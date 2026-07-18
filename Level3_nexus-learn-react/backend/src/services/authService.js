import crypto from "crypto";
import User from "../models/User.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/apiResponse.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/tokens.js";
import { sendVerificationEmail, sendPasswordResetEmail } from "./emailService.js";

const MAX_REFRESH_TOKENS_PER_USER = 5;

function hashToken(rawToken) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

function generateRawToken() {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * The ONLY way an account becomes admin: its email matches SUPER_ADMIN_EMAIL
 * at registration time. Nothing in the register controller/route ever lets
 * a client request the admin role directly (see validators/authValidators.js).
 */
function resolveRole(email, requestedRole) {
  if (env.superAdminEmail && email.toLowerCase() === env.superAdminEmail.toLowerCase()) {
    return "admin";
  }
  return requestedRole || "student";
}

export async function registerUser({ name, email, password, role }) {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const resolvedRole = resolveRole(email, role);

  const rawVerifyToken = generateRawToken();
  const user = await User.create({
    name,
    email,
    password,
    role: resolvedRole,
    emailVerifyToken: hashToken(rawVerifyToken),
    emailVerifyExpires: Date.now() + 24 * 60 * 60 * 1000,
    ...(resolvedRole === "teacher" ? { teacherProfile: { approved: false } } : {}),
  });

  await sendVerificationEmail(user, rawVerifyToken);

  return user;
}

export async function verifyEmailToken(rawToken) {
  const hashed = hashToken(rawToken);
  const user = await User.findOne({
    emailVerifyToken: hashed,
    emailVerifyExpires: { $gt: Date.now() },
  }).select("+emailVerifyToken +emailVerifyExpires");

  if (!user) {
    throw new ApiError(400, "Verification link is invalid or has expired");
  }

  user.isEmailVerified = true;
  user.emailVerifyToken = undefined;
  user.emailVerifyExpires = undefined;
  await user.save();

  return user;
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email }).select("+password +refreshTokens");
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Incorrect email or password");
  }
  if (user.status === "suspended") {
    throw new ApiError(403, "This account has been suspended");
  }

  const { accessToken, refreshToken } = await issueTokenPair(user);
  user.lastLoginAt = new Date();
  await user.save();

  return { user, accessToken, refreshToken };
}

export async function issueTokenPair(user) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  user.refreshTokens = user.refreshTokens || [];
  user.refreshTokens.push(hashToken(refreshToken));
  // Cap stored tokens so a never-logged-out account doesn't grow forever.
  if (user.refreshTokens.length > MAX_REFRESH_TOKENS_PER_USER) {
    user.refreshTokens = user.refreshTokens.slice(-MAX_REFRESH_TOKENS_PER_USER);
  }

  return { accessToken, refreshToken };
}

export async function rotateRefreshToken(rawToken) {
  if (!rawToken) throw new ApiError(401, "Missing refresh token");

  let payload;
  try {
    payload = verifyRefreshToken(rawToken);
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await User.findById(payload.sub).select("+refreshTokens");
  const hashed = hashToken(rawToken);

  if (!user || !user.refreshTokens.includes(hashed)) {
    throw new ApiError(401, "Refresh token was revoked — please log in again");
  }

  // Rotate: remove the used token, issue a new pair.
  user.refreshTokens = user.refreshTokens.filter((t) => t !== hashed);
  const { accessToken, refreshToken } = await issueTokenPair(user);
  await user.save();

  return { user, accessToken, refreshToken };
}

export async function revokeRefreshToken(userId, rawToken) {
  if (!rawToken) return;
  const hashed = hashToken(rawToken);
  await User.findByIdAndUpdate(userId, { $pull: { refreshTokens: hashed } });
}

export async function requestPasswordReset(email) {
  const user = await User.findOne({ email });
  // Always respond as if it succeeded — don't leak which emails exist.
  if (!user) return;

  const rawToken = generateRawToken();
  user.resetPasswordToken = hashToken(rawToken);
  user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
  await user.save();

  await sendPasswordResetEmail(user, rawToken);
}

export async function resetPassword(rawToken, newPassword) {
  const hashed = hashToken(rawToken);
  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpires: { $gt: Date.now() },
  }).select("+resetPasswordToken +resetPasswordExpires +refreshTokens");

  if (!user) {
    throw new ApiError(400, "Reset link is invalid or has expired");
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  // Resetting the password invalidates every existing session.
  user.refreshTokens = [];
  await user.save();

  return user;
}
