import { NextApiRequest, NextApiResponse } from "next";
import { admin, config as fbConfig } from "./FirebaseAdminApi";
import { sendEmail, EmailAttachment } from "../email/Sendgrid";
import { renderEmail, BRAND } from "../email/template";
import {
  PERMISSION_RESOURCE,
  USER_PERMISSION,
  USERS_RESOURCE,
} from "../../core/UsersResource";
import { addPermission, getPermissions } from "./Permission";
import { validateMethod } from "../generic/ValidateMethod";
import { authenticateRequest } from "./AuthenticateRequest";
import { getBrandName, getBrandDashboardUrl } from "../branding/Brand";

// Types
type EmailMessage = {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
  attachments?: EmailAttachment[];
};

// User management handlers
async function createUser(email: string, password: string) {
  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    await admin
      .firestore()
      .collection(USERS_RESOURCE)
      .doc(userRecord.uid)
      .set({});
    await admin
      .firestore()
      .collection(PERMISSION_RESOURCE)
      .doc(userRecord.uid)
      .set({});
    await addPermission(userRecord.uid, USER_PERMISSION);

    // Send registration confirmation email
    try {
      const confirmationEmail = createRegistrationConfirmationEmail(email, userRecord.uid);
      await sendEmail(confirmationEmail);
      console.log(`Registration confirmation email sent to ${email}`);
    } catch (emailError) {
      // Log email error but don't fail user creation
      console.error("Failed to send registration confirmation email:", emailError);
    }

    return userRecord;
  } catch (error: any) {
    console.error("createUser error:", error);
    // Check if it's a duplicate email error
    if (error.code === "auth/email-already-exists") {
      throw new Error(
        "An account with this email already exists. Please use a different email or try logging in."
      );
    }
    throw error; // Re-throw other errors
  }
}

export async function disableUser(uid: string, disable = true) {
  if (disable) {
    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    await admin.firestore().collection(USERS_RESOURCE).doc(uid).update({
      disabled: true,
      disabledAt: timestamp,
    });
  } else {
    await admin.firestore().collection(USERS_RESOURCE).doc(uid).delete();
  }

  //always remove all the permission
  await admin.firestore().collection(PERMISSION_RESOURCE).doc(uid).delete();

  if (disable) {
    await admin.auth().updateUser(uid, {
      disabled: true,
    });
  } else {
    await admin.auth().deleteUser(uid);
  }
}

async function handlePasswordReset(email: string) {
  const resetLink = await admin.auth().generatePasswordResetLink(email);
  const resetEmail = createPasswordResetEmail(email, resetLink);
  await sendEmail(resetEmail);
  return { message: "Password reset email sent" };
}

function createPasswordResetEmail(
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

function createRegistrationConfirmationEmail(
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

async function handleUserPermission(uid: string): Promise<Record<string, any>> {
  return await getPermissions(uid);
}

async function handleUserRoute(
  pathStr: string,
  req: NextApiRequest,
  res: NextApiResponse,
  config?: {
    onUserCreate?: (uid: string) => void;
    onUserDelete?: (uid: string) => void;
  }
) {
  switch (pathStr) {
    case "user/create":
      // no auth required. anybody can create an account
      if (!validateMethod(req, res, "POST")) return;
      const { email, password } = req.body;
      const userRecord = await createUser(email, password);
      if (config?.onUserCreate) config.onUserCreate(userRecord.uid);
      return res.status(200).json(userRecord);

    case "user/config/firebase":
      // no auth required
      return res.status(200).json(fbConfig);

    case "user/reset":
      // no auth required
      if (!validateMethod(req, res, "POST")) return;
      const { email: resetEmail } = req.body;
      const result = await handlePasswordReset(resetEmail);
      return res.status(200).json(result);

    case "user/permission":
      if (!validateMethod(req, res, "POST")) return;
      // Using authentication
      try {
        const decodedToken = await authenticateRequest(req);
        const { uid } = decodedToken;
        const perms = await handleUserPermission(uid);
        return res.status(200).json(perms);
      } catch (error) {
        return res.status(401).json({ error: "Unauthorized" });
      }

    case "user/delete":
      if (!validateMethod(req, res, "POST")) return;
      // Using authentication
      try {
        const decodedToken = await authenticateRequest(req);
        const { uid } = decodedToken;
        if (config?.onUserDelete) {
          config.onUserDelete(uid); //we may need the user id to do some clean up so this is first thing to do
        } else {
          await disableUser(uid);
        }
        return res.status(200).json("done");
      } catch (error) {
        return res.status(401).json({ error: "Unauthorized" });
      }

    default:
      return res.status(404).json({ error: "Route not found" });
  }
}

// Main API handler
export async function userApiHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  config?: {
    onUserCreate?: (uid: string) => void;
    onUserDelete?: (uid: string) => void;
  }
) {
  try {
    const path = req.query.path || [];
    const pathStr = Array.isArray(path) ? path.join("/") : path;

    // Handle different route types
    if (pathStr.startsWith("user")) {
      return await handleUserRoute(pathStr, req, res, config);
    } else {
      return res.status(404).json({ error: "Route not found" });
    }
  } catch (error) {
    console.error(error.toString());
    return res.status(500).json({ error: error.toString() });
  }
}
