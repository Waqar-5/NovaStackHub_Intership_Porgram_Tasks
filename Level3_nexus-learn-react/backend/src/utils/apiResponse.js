/**
 * Consistent response envelope across every route, so the frontend's
 * axios interceptor (lib/axios.js) can rely on one shape everywhere.
 */
export function apiSuccess(res, { status = 200, message = "OK", data = null, meta = null }) {
  return res.status(status).json({ success: true, message, data, meta });
}

export function apiError(res, { status = 500, message = "Something went wrong", errors = null }) {
  return res.status(status).json({ success: false, message, errors });
}

/**
 * Custom error class controllers can `throw` — caught by errorHandler.js
 * and turned into a proper apiError response.
 */
export class ApiError extends Error {
  constructor(status, message, errors = null) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}
