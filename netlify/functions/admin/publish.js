import { handleCorsPreflight } from "../utils/cors.js";
import { successResponse, errorResponse } from "../utils/responses.js";
import { verifyToken } from "../utils/verifyToken.js";
import { requireAdmin } from "../utils/requireAdmin.js";
import { publishSection, publishAll, ALLOWED_SECTIONS } from "../services/publishService.js";

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

    // 3. Request Payload Validation
    let body = {};
    if (event.body) {
      try {
        body = JSON.parse(event.body);
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
    const statusCode = err.statusCode || 500;
    const code = err.code || "INTERNAL_SERVER_ERROR";
    return errorResponse(err.message || "Failed to publish section", statusCode, code);
  }
}
