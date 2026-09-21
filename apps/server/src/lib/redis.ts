// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Redis Client (ioredis) Foundation & In-Memory Fallback Adapter
// =============================================================================

import Redis from "ioredis";
import { env } from "../config/env";
import { logger } from "./logger";

export let isRedisConnected = false;

/**
 * In-memory fallback cache for development/testing environments when a local
 * Redis service is not active. Supports TTL, key expiration, and counter operations.
 */
interface CacheItem {
  value: string;
  expiresAt?: number;
}

class InMemoryRedisStore {
  private store = new Map<string, CacheItem>();

  async get(key: string): Promise<string | null> {
    const item = this.store.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key: string, value: string, ...args: any[]): Promise<string> {
    let expiresAt: number | undefined;
    for (let i = 0; i < args.length; i++) {
      if (typeof args[i] === "string" && args[i].toUpperCase() === "EX" && args[i + 1]) {
        expiresAt = Date.now() + Number(args[i + 1]) * 1000;
        break;
      }
    }
    this.store.set(key, { value: String(value), expiresAt });
    return "OK";
  }

  async del(...keys: string[]): Promise<number> {
    let count = 0;
    for (const k of keys) {
      if (this.store.delete(k)) count++;
    }
    return count;
  }

  async incr(key: string): Promise<number> {
    const item = this.store.get(key);
    let val = 0;
    let expiresAt: number | undefined;
    if (item) {
      if (item.expiresAt && Date.now() > item.expiresAt) {
        this.store.delete(key);
      } else {
        val = parseInt(item.value, 10) || 0;
        expiresAt = item.expiresAt;
      }
    }
    val += 1;
    this.store.set(key, { value: String(val), expiresAt });
    return val;
  }

  async expire(key: string, seconds: number): Promise<number> {
    const item = this.store.get(key);
    if (!item) return 0;
    item.expiresAt = Date.now() + seconds * 1000;
    this.store.set(key, item);
    return 1;
  }

  async ttl(key: string): Promise<number> {
    const item = this.store.get(key);
    if (!item) return -2;
    if (!item.expiresAt) return -1;
    const remaining = Math.ceil((item.expiresAt - Date.now()) / 1000);
    if (remaining <= 0) {
      this.store.delete(key);
      return -2;
    }
    return remaining;
  }

  async ping(): Promise<string> {
    return "PONG";
  }
}

const memoryStore = new InMemoryRedisStore();

function getSafeRedisHost(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.hostname}:${parsed.port || "6379"}`;
  } catch {
    return "redis-instance";
  }
}

const realRedis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 1,
  enableOfflineQueue: false,
  enableReadyCheck: true,
  lazyConnect: true,
  retryStrategy(times) {
    if (times > 2) return null; // Stop reconnecting if server offline
    return Math.min(times * 500, 1500);
  },
});

realRedis.on("connect", () => {
  logger.info(`Redis connecting to ${getSafeRedisHost(env.REDIS_URL)}...`, {
    context: "Redis",
  });
});

realRedis.on("ready", () => {
  isRedisConnected = true;
  logger.info("Redis client connected and ready.", { context: "Redis" });
});

realRedis.on("error", (err: any) => {
  isRedisConnected = false;
  logger.warn(`Redis connection issue: ${err?.message || "Unknown error"}. Using in-memory fallback.`, {
    context: "Redis",
  });
});

realRedis.on("close", () => {
  isRedisConnected = false;
  logger.info("Redis connection closed.", { context: "Redis" });
});

/**
 * Transparent Redis client: delegates to native ioredis when connected;
 * falls back to in-memory TTL store when local Redis is unavailable.
 */
export const redis: Redis = new Proxy(realRedis as any, {
  get(target, prop, receiver) {
    // Intercept data operations
    if (
      prop === "get" ||
      prop === "set" ||
      prop === "del" ||
      prop === "incr" ||
      prop === "expire" ||
      prop === "ttl" ||
      prop === "ping"
    ) {
      return async (...args: any[]) => {
        if (isRedisConnected && target.status === "ready") {
          try {
            return await (target as any)[prop](...args);
          } catch {
            return await (memoryStore as any)[prop](...args);
          }
        }
        return await (memoryStore as any)[prop](...args);
      };
    }

    const value = Reflect.get(target, prop, receiver);
    if (typeof value === "function") {
      return value.bind(target);
    }
    return value;
  },
});

export async function connectRedis(): Promise<void> {
  try {
    await realRedis.connect();
  } catch (error: any) {
    isRedisConnected = false;
    logger.warn(
      `Redis connection could not be established at startup: ${error?.message || error}. Continuing with in-memory store.`,
      { context: "Redis" }
    );
  }
}

export async function disconnectRedis(): Promise<void> {
  if (realRedis.status === "end") return;
  try {
    await realRedis.quit();
    isRedisConnected = false;
    logger.info("Disconnected Redis client gracefully.", { context: "Redis" });
  } catch (error: any) {
    realRedis.disconnect();
    isRedisConnected = false;
    logger.error("Forced Redis disconnection during shutdown", {
      context: "Redis",
      error: error?.message || error,
    });
  }
}
