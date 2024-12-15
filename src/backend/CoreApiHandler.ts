import { NextApiRequest, NextApiResponse } from 'next';
import { admin, config } from './FirebaseAdminApi';
import { sendEmail } from "./Sendgrid";
import {PERMISSION_STORAGE_KEY, USER_STORAGE_KEY} from "../core/UsersResource";
import {addPermission, getPermissions} from "./Permission";
import {BaseConfig, getConfig} from "./LocalBackendConfig";

// Types
type EmailMessage = {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
};

// Configuration handlers
function getPublicConfig(): Record<string, any> {
  const publicConfig: Record<string, any> = {};
  for (const key of getConfig<BaseConfig,string[]>("FRONTEND_PUBLIC_ENV") || []) {
    publicConfig[key] = getConfig<any,any>(key);
  }
  return publicConfig;
}

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

async function handleUserPermission(uid: string):Promise<Record<string, any>> {
  return await getPermissions(uid);
}

// Route handlers
async function handleConfigRoute(pathStr: string, res: NextApiResponse) {
  if (pathStr === 'config/core') {
    return res.status(200).json(getPublicConfig());
  } else if (pathStr === 'config/firebase') {
    return res.status(200).json(config);
  } else {
    return res.status(404).json({ error: 'Route not found' });
  }
}

async function handleUserRoute(pathStr: string, req: NextApiRequest, res: NextApiResponse) {
  if (pathStr === 'user/create') {
    if (!validateMethod(req, res, 'POST')) return;

    const { email, password } = req.body;
    const userRecord = await createUser(email, password);
    return res.status(200).json(userRecord);
  } else if (pathStr === 'user/reset') {
    if (!validateMethod(req, res, 'POST')) return;

    const { email } = req.body;
    const result = await handlePasswordReset(email);
    return res.status(200).json(result);
  } else if (pathStr === 'user/permission') {
    if (!validateMethod(req, res, 'POST')) return;
    const { uid } = req.body;
    let perms = await handleUserPermission(uid);
    return res.status(200).json(perms);
  }else {
      return res.status(404).json({ error: 'Route not found' });
  }
}

// Main API handler
export async function coreApiHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const path = req.query.path || [];
    const pathStr = Array.isArray(path) ? path.join('/') : path;

    // Handle different route types
    if(pathStr.startsWith('config')) {
      return await handleConfigRoute(pathStr, res);
    }else if(pathStr.startsWith('user')) {
      return await handleUserRoute(pathStr, req, res);
    }else {
      // No matching route found
      return res.status(404).json({error: 'Route not found'});
    }

  } catch (error) {
    console.error(error.toString());
    return res.status(500).json({ error: error.toString() });
  }
}

// HTTP method validation
function validateMethod(req: NextApiRequest, res: NextApiResponse, allowedMethod: string): boolean {
  if (req.method !== allowedMethod) {
    res.setHeader('Allow', [allowedMethod]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return false;
  }
  return true;
}