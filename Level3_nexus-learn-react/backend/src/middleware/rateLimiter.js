import rateLimit from "express-rate-limit";

/**
 * General API limiter — generous, just a backstop against abuse.
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." },
});

/**
 * Tighter limiter for auth endpoints (login/register/forgot-password) —
 * these are the ones brute-force/credential-stuffing attempts target.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts, please try again later." },
});
