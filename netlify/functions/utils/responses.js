import { CORS_HEADERS } from "./cors.js";

/**
 * Standard success JSON response.
 * @param {object|array|null} [data=null]
 * @param {string} [message="Success"]
 * @param {number} [statusCode=200]
 */
export function successResponse(data = null, message = "Success", statusCode = 200) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      ...CORS_HEADERS,
    },
    body: JSON.stringify({
      success: true,
      message,
      ...(data !== null ? { data } : {}),
    }),
  };
}

/**
 * Standard error JSON response.
 * @param {string} message
 * @param {number} [statusCode=400]
 * @param {string} [code="BAD_REQUEST"]
 */
export function errorResponse(message = "An error occurred", statusCode = 400, code = "BAD_REQUEST") {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      ...CORS_HEADERS,
    },
    body: JSON.stringify({
      success: false,
      message,
      code,
    }),
  };
}
