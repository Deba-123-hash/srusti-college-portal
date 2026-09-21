// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Automated Phase 3 Foundation Verification Suite
// =============================================================================

import http from "node:http";
import { app } from "../src/app";

interface TestResult {
  name: string;
  passed: boolean;
  details?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, name: string, details?: string) {
  if (condition) {
    results.push({ name, passed: true });
    console.log(`  ✅ PASS: ${name}`);
  } else {
    results.push({ name, passed: false, details });
    console.error(`  ❌ FAIL: ${name} - ${details || "Assertion failed"}`);
  }
}

async function runTests() {
  console.log("\n=======================================================");
  console.log("  Running Phase 3 Express Foundation Verification Suite");
  console.log("=======================================================\n");

  // Spin up test server on an ephemeral port
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address() as any;
  const baseUrl = `http://127.0.0.1:${address.port}`;

  console.log(`Test server running at: ${baseUrl}\n`);

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Health Liveness Probe (GET /api/v1/health)
    // -------------------------------------------------------------------------
    console.log("[1] Testing Health Liveness Probe (/api/v1/health)...");
    const healthRes = await fetch(`${baseUrl}/api/v1/health`);
    const healthData = (await healthRes.json()) as any;

    assert(healthRes.status === 200, "Health endpoint returns HTTP 200");
    assert(healthData.success === true, "Health response success flag is true");
    assert(healthData.data?.status === "ok", "Health response data.status is 'ok'");
    assert(typeof healthData.data?.uptime === "number", "Health response includes numeric uptime");
    assert(healthData.message === "API is healthy", "Health response has correct message");

    // -------------------------------------------------------------------------
    // TEST 2: Request ID Correlation Header
    // -------------------------------------------------------------------------
    console.log("\n[2] Testing Request ID Tracking...");
    const reqIdHeader = healthRes.headers.get("x-request-id");
    assert(
      typeof reqIdHeader === "string" && reqIdHeader.length > 10,
      "Response includes auto-generated UUID in X-Request-ID header",
      `Received: ${reqIdHeader}`
    );

    // Pass custom X-Request-ID
    const customId = "trace-custom-srusti-id-9999";
    const customReqRes = await fetch(`${baseUrl}/api/v1/health`, {
      headers: { "x-request-id": customId },
    });
    const echoedReqId = customReqRes.headers.get("x-request-id");
    assert(
      echoedReqId === customId,
      "Response echoes client-supplied X-Request-ID",
      `Expected ${customId}, got ${echoedReqId}`
    );

    // -------------------------------------------------------------------------
    // TEST 3: Security Headers (Helmet)
    // -------------------------------------------------------------------------
    console.log("\n[3] Testing Helmet Security Headers...");
    assert(
      healthRes.headers.get("x-content-type-options") === "nosniff",
      "X-Content-Type-Options is set to 'nosniff'"
    );
    assert(
      healthRes.headers.has("content-security-policy"),
      "Content-Security-Policy header is present"
    );
    assert(
      healthRes.headers.get("cross-origin-resource-policy") === "cross-origin",
      "Cross-Origin-Resource-Policy is set to 'cross-origin'"
    );

    // -------------------------------------------------------------------------
    // TEST 4: Strict CORS Enforcement
    // -------------------------------------------------------------------------
    console.log("\n[4] Testing Strict CORS Policy...");
    // 4a. Whitelisted origin (http://localhost:5173)
    const corsWhitelistedRes = await fetch(`${baseUrl}/api/v1/health`, {
      headers: { Origin: "http://localhost:5173" },
    });
    assert(
      corsWhitelistedRes.headers.get("access-control-allow-origin") === "http://localhost:5173",
      "Whitelisted origin http://localhost:5173 is allowed"
    );
    assert(
      corsWhitelistedRes.headers.get("access-control-allow-credentials") === "true",
      "Credentials flag is set to true for whitelisted origin"
    );

    // 4b. Disallowed origin (https://malicious-site.example.com)
    const corsForbiddenRes = await fetch(`${baseUrl}/api/v1/health`, {
      headers: { Origin: "https://malicious-site.example.com" },
    });
    const corsForbiddenData = (await corsForbiddenRes.json()) as any;
    assert(
      corsForbiddenRes.status === 403,
      "Disallowed origin is rejected with HTTP 403",
      `Received status: ${corsForbiddenRes.status}`
    );
    assert(
      corsForbiddenData.error?.code === "CORS_NOT_ALLOWED",
      "Disallowed origin error code is 'CORS_NOT_ALLOWED'",
      `Received code: ${corsForbiddenData.error?.code}`
    );

    // 4c. Non-browser request (no Origin header)
    const noOriginRes = await fetch(`${baseUrl}/api/v1/health`);
    assert(
      noOriginRes.status === 200,
      "Requests without Origin header (curl, backend-to-backend) are allowed"
    );

    // -------------------------------------------------------------------------
    // TEST 5: Standardized 404 Route Handling
    // -------------------------------------------------------------------------
    console.log("\n[5] Testing 404 Unmatched Route Handling...");
    const notFoundRes = await fetch(`${baseUrl}/api/v1/non-existent-route-path`);
    const notFoundData = (await notFoundRes.json()) as any;

    assert(notFoundRes.status === 404, "Unmatched route returns HTTP 404");
    assert(notFoundData.success === false, "404 response success flag is false");
    assert(
      notFoundData.error?.code === "ROUTE_NOT_FOUND",
      "404 error code is 'ROUTE_NOT_FOUND'",
      `Received: ${notFoundData.error?.code}`
    );
    assert(
      notFoundData.error?.message === "The requested endpoint does not exist.",
      "404 error message matches standard requirement"
    );
    assert(
      notFoundData.error?.details === null,
      "404 error details are null"
    );

    // -------------------------------------------------------------------------
    // TEST 6: Centralized Error Handling - Malformed JSON Payload
    // -------------------------------------------------------------------------
    console.log("\n[6] Testing Malformed JSON Error Normalization...");
    const malformedJsonRes = await fetch(`${baseUrl}/api/v1/health`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: `{"broken": json_syntax_error`,
    });
    const malformedData = (await malformedJsonRes.json()) as any;

    assert(malformedJsonRes.status === 400, "Malformed JSON returns HTTP 400");
    assert(malformedData.success === false, "Malformed JSON success is false");
    assert(
      malformedData.error?.code === "MALFORMED_JSON",
      "Malformed JSON error code is 'MALFORMED_JSON'",
      `Received: ${malformedData.error?.code}`
    );
    assert(
      malformedData.error?.message === "Invalid JSON payload provided in request body.",
      "Malformed JSON error message is standardized"
    );

    // -------------------------------------------------------------------------
    // TEST 7: Prototype Pollution Defense
    // -------------------------------------------------------------------------
    console.log("\n[7] Testing Prototype Pollution Sanitization...");
    // Send a payload containing __proto__
    const sanitizeRes = await fetch(`${baseUrl}/api/v1/health`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        __proto__: { polluted: true },
        safeField: "valid-value",
      }),
    });
    assert(
      sanitizeRes.status !== 500,
      "Server handles payload with __proto__ without 500 crash"
    );
    assert(
      (Object.prototype as any).polluted === undefined,
      "Global Object.prototype is NOT polluted"
    );

    // -------------------------------------------------------------------------
    // TEST 8: Health Readiness Probe (GET /api/v1/health/ready)
    // -------------------------------------------------------------------------
    console.log("\n[8] Testing Health Readiness Probe (/api/v1/health/ready)...");
    const readyRes = await fetch(`${baseUrl}/api/v1/health/ready`);
    const readyData = (await readyRes.json()) as any;
    // Note: On development without active postgres, it should return 503 without leaking credentials
    if (readyRes.status === 200) {
      assert(readyData.success === true, "Readiness returns 200 when databases are connected");
      assert(readyData.data?.status === "ready", "Readiness data.status is 'ready'");
    } else {
      assert(
        readyRes.status === 503,
        "Readiness safely returns 503 when downstream db/cache is unreachable without crashing",
        `Received status: ${readyRes.status}`
      );
      assert(
        readyData.error?.code === "SERVICE_UNAVAILABLE",
        "Readiness 503 has code 'SERVICE_UNAVAILABLE'"
      );
      assert(
        readyData.error?.details !== undefined,
        "Readiness details report database and redis state without credentials"
      );
    }

    // -------------------------------------------------------------------------
    // TEST 9: Rate Limiting Headers on Regular Endpoints
    // -------------------------------------------------------------------------
    console.log("\n[9] Testing Rate Limiting Headers...");
    const rateLimitTestRes = await fetch(`${baseUrl}/api/v1/any-endpoint`);
    const limitHeader = rateLimitTestRes.headers.get("ratelimit-limit");
    const remainingHeader = rateLimitTestRes.headers.get("ratelimit-remaining");

    assert(
      limitHeader === "200",
      "RateLimit-Limit header is set to 200",
      `Received: ${limitHeader}`
    );
    assert(
      remainingHeader !== null && Number(remainingHeader) < 200,
      "RateLimit-Remaining header is decremented",
      `Received: ${remainingHeader}`
    );

  } finally {
    server.close();
  }

  // ---------------------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------------------
  console.log("\n=======================================================");
  console.log("                  TEST RESULTS SUMMARY                 ");
  console.log("=======================================================");
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;

  console.log(`Total Checks: ${total}`);
  console.log(`Passed:       ${passed}`);
  console.log(`Failed:       ${failed}`);

  if (failed > 0) {
    console.error("\n❌ Some checks failed.");
    process.exit(1);
  } else {
    console.log("\n🌟 ALL PHASE 3 FOUNDATION CHECKS PASSED PERFECTLY!\n");
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error("Test runner crashed:", err);
  process.exit(1);
});
