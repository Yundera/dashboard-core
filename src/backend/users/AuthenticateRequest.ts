// New authentication function
import {NextApiRequest} from "next";
import { admin } from "./FirebaseAdminApi";

export async function authenticateRequest(req: NextApiRequest): Promise<{ uid: string }> {
  if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const idToken = req.headers.authorization.split("Bearer ")[1];
  return await admin.auth().verifyIdToken(idToken);
}