import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function signAccessToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

export function signRefreshToken(user) {
  return jwt.sign({ sub: user._id.toString() }, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpiresIn,
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.jwtSecret);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, env.jwtRefreshSecret);
}

export const REFRESH_COOKIE_NAME = "nexus_refresh_token";

export const refreshCookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: "lax",
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  path: "/api/v1/auth",
};
