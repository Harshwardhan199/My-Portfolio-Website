import { handleCorsPreflight, successResponse, errorResponse } from "./shared/responses.js";
import { verifyToken, requireAdmin } from "./shared/auth.js";
import { seedInitialData } from "./services/seedService.js";

export const handler = async (event, context) => {
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
    console.error("Seed error:", err);
    const statusCode = err.statusCode || 500;
    const code = err.code || "INTERNAL_SERVER_ERROR";
    return errorResponse(err.message || "Failed to seed database", statusCode, code);
  }
};
