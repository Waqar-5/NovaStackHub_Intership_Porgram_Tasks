import { getTransporter } from "../config/mailer.js";
import { env } from "../config/env.js";

async function sendMail({ to, subject, html }) {
  if (!env.smtp.host) {
    // No SMTP configured (e.g. local dev without credentials yet) — log
    // instead of failing the request, so register/forgot-password flows
    // are still testable without setting up an inbox.
    console.log(`[mailer:dev] would send "${subject}" to ${to}\n${html}\n`);
    return { devMode: true };
  }

  const transporter = getTransporter();
  return transporter.sendMail({ from: env.smtp.fromEmail, to, subject, html });
}

export function sendVerificationEmail(user, token) {
  const link = `${env.clientUrl}/verify-email/${token}`;
  return sendMail({
    to: user.email,
    subject: "Verify your Nexus Learn account",
    html: `<p>Hi ${user.name},</p>
      <p>Confirm your email to activate your account:</p>
      <p><a href="${link}">${link}</a></p>
      <p>This link expires in 24 hours.</p>`,
  });
}

export function sendPasswordResetEmail(user, token) {
  const link = `${env.clientUrl}/reset-password/${token}`;
  return sendMail({
    to: user.email,
    subject: "Reset your Nexus Learn password",
    html: `<p>Hi ${user.name},</p>
      <p>Reset your password using the link below. If you didn't request this, ignore this email.</p>
      <p><a href="${link}">${link}</a></p>
      <p>This link expires in 1 hour.</p>`,
  });
}
