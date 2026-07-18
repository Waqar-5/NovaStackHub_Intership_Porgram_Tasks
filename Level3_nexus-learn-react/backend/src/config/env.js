const requiredInProduction = ["MONGO_URI", "JWT_SECRET", "JWT_REFRESH_SECRET"];

if (process.env.NODE_ENV === "production") {
  const missing = requiredInProduction.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing required env vars: ${missing.join(", ")}`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",

  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/nexus-learn",

  jwtSecret: process.env.JWT_SECRET || "dev-only-jwt-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "15m",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "dev-only-refresh-secret-change-me",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",

  // Per the roadmap: never hardcode this — the Super Admin role is
  // auto-assigned to whichever account's email matches this env var on
  // seed / first login (see src/services/authService.js).
  superAdminEmail: process.env.SUPER_ADMIN_EMAIL || "",

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
  },

  smtp: {
    host: process.env.SMTP_HOST || "",
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    fromEmail: process.env.EMAIL_FROM || "no-reply@nexuslearn.dev",
  },
};
