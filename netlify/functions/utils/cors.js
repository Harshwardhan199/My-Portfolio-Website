export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

/**
 * Handles OPTIONS preflight CORS requests.
 * @param {object} event - Netlify function event
 * @returns {object|null} Response object for OPTIONS requests, or null for non-OPTIONS requests.
 */
export function handleCorsPreflight(event) {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: CORS_HEADERS,
      body: "",
    };
  }
  return null;
}
