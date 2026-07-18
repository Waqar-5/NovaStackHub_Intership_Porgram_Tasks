import nodemailer from "nodemailer";
import { env } from "./env.js";

let transporter = null;

export function getTransporter() {
  if (transporter) return transporter;

  if (!env.smtp.host) {
    console.warn("[mailer] SMTP not configured — emails will be logged, not sent.");
  }

  transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.pass } : undefined,
  });

  return transporter;
}
