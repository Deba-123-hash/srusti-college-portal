// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Transactional Mailer Service (Nodemailer)
// =============================================================================

import nodemailer from "nodemailer";
import { env } from "../config/env";
import { logger } from "./logger";

let transporter: nodemailer.Transporter | null = null;

if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASSWORD) {
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT || 587,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASSWORD,
    },
  });
}

export interface SendMailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

/**
 * Send a transactional email.
 * Never logs sensitive email body content or OTP values.
 */
export async function sendMail(options: SendMailOptions): Promise<boolean> {
  if (!transporter) {
    // In local development or test without SMTP credentials,
    // dispatch safely without exposing sensitive OTP data in logs.
    logger.info(`[Email Service] Simulated dispatch: subject="${options.subject}" to="${options.to}"`);
    return true;
  }

  try {
    await transporter.sendMail({
      from: env.SMTP_FROM || `"Srusti Academy Portal" <noreply@srusti.ac.in>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
    logger.info(`[Email Service] Successfully sent email to "${options.to}"`);
    return true;
  } catch (error: any) {
    logger.error(`[Email Service] Failed to send email to "${options.to}": ${error.message}`);
    return false;
  }
}
