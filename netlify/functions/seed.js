import { handleCorsPreflight } from "./utils/cors.js";
import { successResponse, errorResponse } from "./utils/responses.js";
import { verifyToken } from "./utils/verifyToken.js";
import { requireAdmin } from "./utils/requireAdmin.js";
import { seedInitialData } from "./services/seedService.js";

export async function handler(event, context) {
  // 1. Handle CORS preflight request
  const preflight = handleCorsPreflight(event);
  if (preflight) return preflight;

  if (event.httpMethod !== "POST") {
    return errorResponse("Method Not Allowed", 405, "METHOD_NOT_ALLOWED");
  }

  try {
    // 2. Authentication & Authorization
    const decodedToken = await verifyToken(event);
    requireAdmin(decodedToken);

    // 3. Service Execution
    await seedInitialData(decodedToken);
    return successResponse(null, "Database seeded and published successfully");
  } catch (err) {
    const statusCode = err.statusCode || 500;
    const code = err.code || "INTERNAL_SERVER_ERROR";
    return errorResponse(err.message || "Failed to seed database", statusCode, code);
  }
}

export default async function (req, context) {
  if (typeof Request !== "undefined" && req instanceof Request) {
    let body = null;
    if (req.method === "POST") {
      try {
        body = await req.text();
      } catch (e) {}
    }
    const headers = {};
    req.headers.forEach((val, key) => {
      headers[key] = val;
    });

    const eventAdapter = {
      httpMethod: req.method,
      headers,
      body,
    };

    const res = await handler(eventAdapter, context);
    return new Response(res.body, {
      status: res.statusCode,
      headers: res.headers,
    });
  }

  return handler(req, context);
}
