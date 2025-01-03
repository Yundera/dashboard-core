import {NextApiRequest, NextApiResponse} from 'next';
import {admin, config as fbConfig} from './FirebaseAdminApi';
import {sendEmail} from "../email/Sendgrid";
import {PERMISSION_RESOURCE, USER_PERMISSION, USERS_RESOURCE} from "../../core/UsersResource";
import {addPermission, getPermissions} from "./Permission";
import {validateMethod} from "../generic/ValidateMethod";
import {authenticateRequest} from "./AuthenticateRequest";

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

  await admin.firestore().collection(USERS_RESOURCE).doc(userRecord.uid).set({});
  await admin.firestore().collection(PERMISSION_RESOURCE).doc(userRecord.uid).set({});
  await addPermission(userRecord.uid, USER_PERMISSION);
  return userRecord;
}

export async function disableUser(uid: string, disable = true) {

  if (disable) {
    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    await admin.firestore()
    .collection(USERS_RESOURCE)
    .doc(uid)
    .update({
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
  return {message: "Password reset email sent"};
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
    case 'user/create':
      // no auth required. anybody can create an account
      if (!validateMethod(req, res, 'POST')) return;
      const {email, password} = req.body;
      const userRecord = await createUser(email, password);
      if (config?.onUserCreate) config.onUserCreate(userRecord.uid);
      return res.status(200).json(userRecord);

    case 'user/config/firebase':
      // no auth required
      return res.status(200).json(fbConfig);

    case 'user/reset':
      // no auth required
      if (!validateMethod(req, res, 'POST')) return;
      const {email: resetEmail} = req.body;
      const result = await handlePasswordReset(resetEmail);
      return res.status(200).json(result);

    case 'user/permission':
      if (!validateMethod(req, res, 'POST')) return;
      // Using authentication
      try {
        const decodedToken = await authenticateRequest(req);
        const {uid} = decodedToken;
        const perms = await handleUserPermission(uid);
        return res.status(200).json(perms);
      } catch (error) {
        return res.status(401).json({error: "Unauthorized"});
      }

    case 'user/delete':
      if (!validateMethod(req, res, 'POST')) return;
      // Using authentication
      try {
        const decodedToken = await authenticateRequest(req);
        const {uid} = decodedToken;
        if (config?.onUserDelete) {
          config.onUserDelete(uid);//we may need the user id to do some clean up so this is first thing to do
        } else {
          await disableUser(uid);
        }
        return res.status(200).json("done");
      } catch (error) {
        return res.status(401).json({error: "Unauthorized"});
      }

    default:
      return res.status(404).json({error: 'Route not found'});
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
    const pathStr = Array.isArray(path) ? path.join('/') : path;

    // Handle different route types
    if (pathStr.startsWith('user')) {
      return await handleUserRoute(pathStr, req, res, config);
    } else {
      return res.status(404).json({error: 'Route not found'});
    }

  } catch (error) {
    console.error(error.toString());
    return res.status(500).json({error: error.toString()});
  }
}