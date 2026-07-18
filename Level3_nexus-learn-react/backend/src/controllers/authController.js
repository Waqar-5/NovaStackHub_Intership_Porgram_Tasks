import { asyncHandler } from "../utils/asyncHandler.js";
import { apiSuccess } from "../utils/apiResponse.js";
import { REFRESH_COOKIE_NAME, refreshCookieOptions } from "../utils/tokens.js";
import * as authService from "../services/authService.js";

function setRefreshCookie(res, token) {
  res.cookie(REFRESH_COOKIE_NAME, token, refreshCookieOptions);
}

function clearRefreshCookie(res) {
  res.clearCookie(REFRESH_COOKIE_NAME, { path: refreshCookieOptions.path });
}

export const register = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);
  return apiSuccess(res, {
    status: 201,
    message: "Account created. Check your email to verify your address.",
    data: { user },
  });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const user = await authService.verifyEmailToken(req.params.token);
  return apiSuccess(res, { message: "Email verified.", data: { user } });
});

export const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.loginUser(req.body);
  setRefreshCookie(res, refreshToken);
  return apiSuccess(res, {
    message: "Logged in.",
    data: { user, accessToken },
  });
});

export const refresh = asyncHandler(async (req, res) => {
  const incoming = req.cookies?.[REFRESH_COOKIE_NAME];
  const { user, accessToken, refreshToken } = await authService.rotateRefreshToken(incoming);
  setRefreshCookie(res, refreshToken);
  return apiSuccess(res, { message: "Token refreshed.", data: { user, accessToken } });
});

export const logout = asyncHandler(async (req, res) => {
  const incoming = req.cookies?.[REFRESH_COOKIE_NAME];
  if (req.user) {
    await authService.revokeRefreshToken(req.user._id, incoming);
  }
  clearRefreshCookie(res);
  return apiSuccess(res, { message: "Logged out." });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  await authService.requestPasswordReset(req.body.email);
  return apiSuccess(res, {
    message: "If that email exists, a reset link has been sent.",
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.params.token, req.body.password);
  return apiSuccess(res, { message: "Password has been reset. Please log in." });
});

export const me = asyncHandler(async (req, res) => {
  return apiSuccess(res, { message: "Current user.", data: { user: req.user } });
});
