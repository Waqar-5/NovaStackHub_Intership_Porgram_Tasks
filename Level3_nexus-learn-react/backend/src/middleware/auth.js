import { ApiError } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyAccessToken } from "../utils/tokens.js";
import User from "../models/User.js";

/**
 * Verifies the Bearer access token and attaches the user to req.user.
 * Fetches a lean copy of the user so roleGuard/ownership checks downstream
 * always see the current role/status, not a stale JWT claim.
 */
export const requireAuth = asyncHandler(async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    throw new ApiError(401, "Authentication required");
  }

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }

  const user = await User.findById(payload.sub).select("-password");
  if (!user) {
    throw new ApiError(401, "User no longer exists");
  }
  if (user.status === "suspended") {
    throw new ApiError(403, "Account suspended");
  }

  req.user = user;
  next();
});
