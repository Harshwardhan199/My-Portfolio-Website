import { handleCorsPreflight, successResponse, errorResponse } from "./shared/responses.js";
import { verifyToken, requireAdmin } from "./shared/auth.js";
import { publishSection, publishAll, ALLOWED_SECTIONS } from "./services/publishService.js";

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

    // 3. Request Payload Validation
    let body = {};
    if (event.body) {
      try {
        body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
      } catch (err) {
        return errorResponse("Invalid JSON request body", 400, "BAD_REQUEST");
      }
    }

    const { sectionName } = body;
    if (!sectionName || typeof sectionName !== "string") {
      return errorResponse("Missing or invalid 'sectionName' parameter", 400, "BAD_REQUEST");
    }

    const trimmedSection = sectionName.trim();
    if (trimmedSection !== "all" && !ALLOWED_SECTIONS.includes(trimmedSection)) {
      return errorResponse(
        `Invalid section '${trimmedSection}'. Allowed sections: ${ALLOWED_SECTIONS.join(", ")}, all`,
        400,
        "BAD_REQUEST"
      );
    }

    // 4. Service Execution
    if (trimmedSection === "all") {
      await publishAll(decodedToken);
      return successResponse(null, "All sections published successfully");
    } else {
      await publishSection(trimmedSection, decodedToken);
      return successResponse(null, `Section '${trimmedSection}' published successfully`);
    }
  } catch (err) {
    console.error("Publish error:", err);
    const statusCode = err.statusCode || 500;
    const code = err.code || "INTERNAL_SERVER_ERROR";
    return errorResponse(err.message || "Failed to publish section", statusCode, code);
  }
};
