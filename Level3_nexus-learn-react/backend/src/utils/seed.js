import "dotenv/config";
import crypto from "crypto";
import mongoose from "mongoose";
import { env } from "../config/env.js";
import User from "../models/User.js";

async function seedSuperAdmin() {
  if (!env.superAdminEmail) {
    console.error("[seed] SUPER_ADMIN_EMAIL is not set in .env — nothing to do.");
    process.exit(1);
  }

  await mongoose.connect(env.mongoUri);
  console.log(`[seed] connected → ${mongoose.connection.name}`);

  let admin = await User.findOne({ email: env.superAdminEmail });

  if (admin) {
    if (admin.role !== "admin") {
      admin.role = "admin";
      await admin.save();
      console.log(`[seed] promoted existing account ${admin.email} to admin.`);
    } else {
      console.log(`[seed] ${admin.email} is already admin — nothing to do.`);
    }
  } else {
    // Generate a one-time random password and print it ONCE — never store
    // it in plaintext or a repo. Change it immediately after first login.
    const tempPassword = crypto.randomBytes(12).toString("base64url");

    admin = await User.create({
      name: "Super Admin",
      email: env.superAdminEmail,
      password: tempPassword,
      role: "admin",
      isEmailVerified: true,
    });

    console.log("[seed] Super Admin account created:");
    console.log(`        email:    ${admin.email}`);
    console.log(`        password: ${tempPassword}`);
    console.log("        ⚠ Save this password now — it will not be shown again.");
    console.log("        Log in and change it immediately.");
  }

  await mongoose.disconnect();
  process.exit(0);
}

seedSuperAdmin().catch((err) => {
  console.error("[seed] failed:", err);
  process.exit(1);
});
