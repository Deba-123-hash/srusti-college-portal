// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Express Application & Middleware Pipeline
// =============================================================================

import express, { Request } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { API_VERSION } from "@srusti/shared";

import { corsOptions } from "./config/cors";
import { morganStream } from "./lib/logger";
import { requestIdMiddleware } from "./middleware/requestId";
import { generalRateLimiter } from "./middleware/rateLimiter";
import { sanitizeMiddleware } from "./middleware/sanitize";
import { notFoundHandler } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";
import { apiV1Router } from "./routes";

export const app = express();

// 1. Trust Reverse Proxy (Nginx) for accurate IP and rate-limit tracking
app.set("trust proxy", 1);

// 2. Request Correlation Tracking (UUIDv4)
app.use(requestIdMiddleware);

// 3. Security HTTP Headers via Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// 4. Strict CORS Policy Whitelist
app.use(cors(corsOptions));

// 5. General Rate Limiting (200 req / 15 min per IP)
app.use(generalRateLimiter);

// 6. HTTP Access Logging via Morgan piped into Winston
morgan.token("req-id", (req: Request) => req.id || "-");
app.use(
  morgan(
    ':remote-addr [:req-id] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms',
    { stream: morganStream }
  )
);

// 7. Request Body Parsing with strict payload size limits
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

// 8. Prototype Pollution & Parameter Sanitization
app.use(sanitizeMiddleware);

// 9. Static uploads directory
app.use("/uploads", express.static("public/uploads"));

// 10. API v1 Routing
app.use(`/api/${API_VERSION}`, apiV1Router);

// 10. Standardized 404 Handler for unmatched routes
app.use(notFoundHandler);

// 11. Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
