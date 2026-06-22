import type { EmailAttachment } from "./Sendgrid";
import { renderEmail, BRAND } from "./template";
import { getBrandName, getBrandDashboardUrl } from "../branding/Brand";

// Pure builders for user-facing transactional emails. Kept free of Firebase /
// HTTP concerns so they can be unit-tested in isolation (see userEmails.test.ts)
// and so brand identity stays config-driven rather than hardcoded.
export type EmailMessage = {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
  attachments?: EmailAttachment[];
};

export function createPasswordResetEmail(
  email: string,
  resetLink: string
): EmailMessage {
  const { html, attachments } = renderEmail({
    heading: '🔑 Password Reset Request',
    bodyHtml: `
        <p>Hello,</p>
        <p>You requested a password reset. Please click the button below to reset your password:</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="display: inline-block; padding: 15px 30px; background-color: ${BRAND.primary}; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a>
        </div>

        <div style="background-color: ${BRAND.infoBg}; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>⏰ Security Notice:</strong> If you did not request this password reset, please ignore this email. Your password will remain unchanged.</p>
        </div>
    `,
  });
  return {
    to: email,
    from: "", // Will use SENDMAIL_FROM_EMAIL env variable
    subject: "Password Reset Request",
    text: `Hello, you requested a password reset. Click the link to reset your password: ${resetLink}`,
    html,
    attachments,
  };
}

export function createRegistrationConfirmationEmail(
  email: string,
  uid: string
): EmailMessage {
  const brandName = getBrandName();
  const registrationUrl = `${getBrandDashboardUrl()}#register`;
  const { html, attachments } = renderEmail({
    heading: `Welcome to ${brandName}! 🌐`,
    closing: 'Welcome aboard!',
    bodyHtml: `
  <p>Your account has been successfully created.</p>

  <div style="background-color: ${BRAND.lightBg}; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="color: #34495e; margin-top: 0;">Account Details:</h3>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Account ID:</strong> ${uid}</p>
    <p><strong>Created:</strong> ${new Date().toLocaleDateString()}</p>
  </div>

  <div style="background-color: ${BRAND.infoBg}; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <h4 style="color: ${BRAND.primary}; margin-top: 0;">🚀 What's Next?</h4>
    <ul style="margin: 10px 0;">
      <li>Purchase your personal cloud server (PCS)</li>
      <li>Choose a name for your cloud</li>
      <li>Install your favorite open source applications</li>
    </ul>
  </div>

  <p style="font-size: 0.9em; color: #666;">
    <strong>Registration URL:</strong> <a href="${registrationUrl}" style="color: ${BRAND.primary};">${registrationUrl}</a>
  </p>

  <p>If you have any questions, feel free to reach out to our support team.</p>
    `,
  });
  return {
    to: email,
    from: "", // Will use SENDMAIL_FROM_EMAIL env variable
    subject: `Welcome to ${brandName} - Registration Confirmed`,
    text: `Welcome to ${brandName}! Your account has been successfully created. Account Details: Email: ${email}, Account ID: ${uid}. Registration URL: ${registrationUrl}`,
    html,
    attachments,
  };
}
