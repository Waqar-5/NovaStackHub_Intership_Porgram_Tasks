/**
 * Wrap an async controller so a rejected promise is forwarded to
 * errorHandler.js instead of crashing the process / hanging the request.
 */
export function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
