import {NextApiRequest, NextApiResponse} from 'next';
import {admin, config} from './FirebaseAdminApi';
import {sendEmail} from "./Sendgrid";
import {USER_STORAGE_KEY} from "../core/UsersResource";
import {addPermission, getPermissions} from "./Permission";
import {validateMethod} from "./ValidateMethod";

// Types
type EmailMessage = {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
};

// User management handlers
async function createUser(email: string, password: string) {
  const userRecord = await admin.auth().createUser({
    email,
    password,
  });

  await admin.firestore().collection(USER_STORAGE_KEY).doc(userRecord.uid).set({});
  await addPermission(userRecord.uid, "user");
  return userRecord;
}

async function handlePasswordReset(email: string) {
  const resetLink = await admin.auth().generatePasswordResetLink(email);
  const resetEmail = createPasswordResetEmail(email, resetLink);
  await sendEmail(resetEmail);
  return { message: "Password reset email sent" };
}

function createPasswordResetEmail(email: string, resetLink: string): EmailMessage {
  return {
    to: email,
    from: 'admin@aptero.co',
    subject: 'Password Reset Request',
    text: `Hello, you requested a password reset. Click the link to reset your password: ${resetLink}`,
    html: `
      <p>Hello,</p>
      <p>You requested a password reset. Please click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
      <p>Thanks,</p>
      <p>Your Team at Aptero</p>
    `,
  };
}

async function handleUserPermission(uid: string): Promise<Record<string, any>> {
  return await getPermissions(uid);
}

async function handleUserRoute(pathStr: string, req: NextApiRequest, res: NextApiResponse) {
  switch (pathStr) {
    case 'user/create':
      if (!validateMethod(req, res, 'POST')) return;
      const { email, password } = req.body;
      const userRecord = await createUser(email, password);
      return res.status(200).json(userRecord);

    case 'user/config/firebase':
      return res.status(200).json(config);

    case 'user/reset':
      if (!validateMethod(req, res, 'POST')) return;
      const { email: resetEmail } = req.body;
      const result = await handlePasswordReset(resetEmail);
      return res.status(200).json(result);

    case 'user/permission':
      if (!validateMethod(req, res, 'POST')) return;
      const { uid } = req.body;
      const perms = await handleUserPermission(uid);
      return res.status(200).json(perms);

    default:
      return res.status(404).json({ error: 'Route not found' });
  }
}

// Main API handler
export async function userApiHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const path = req.query.path || [];
    const pathStr = Array.isArray(path) ? path.join('/') : path;

    // Handle different route types
    if (pathStr.startsWith('user')) {
      return await handleUserRoute(pathStr, req, res);
    } else {
      return res.status(404).json({ error: 'Route not found' });
    }

  } catch (error) {
    console.error(error.toString());
    return res.status(500).json({ error: error.toString() });
  }
}