import { ApiError } from "../utils/apiResponse.js";

/**
 * Usage: router.patch('/:id', requireAuth, roleGuard('admin'), controller)
 * Always runs after requireAuth. Never trust a role coming from the client —
 * this checks req.user, which was loaded fresh from the DB.
 */
export function roleGuard(...allowedRoles) {
  return function guard(req, res, next) {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }
    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, "You don't have permission to do that");
    }
    next();
  };
}
