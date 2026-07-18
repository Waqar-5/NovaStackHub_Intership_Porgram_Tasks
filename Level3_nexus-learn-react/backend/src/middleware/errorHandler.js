import { env } from "../config/env.js";
import { apiError } from "../utils/apiResponse.js";

export function notFoundHandler(req, res) {
  return apiError(res, { status: 404, message: `Route not found: ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars -- Express requires 4 args to recognize error middleware
export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";

  if (env.nodeEnv !== "test") {
    console.error(`[error] ${req.method} ${req.originalUrl} →`, err);
  }

  return apiError(res, {
    status,
    message,
    errors: err.errors || (env.nodeEnv === "development" ? { stack: err.stack } : null),
  });
}
