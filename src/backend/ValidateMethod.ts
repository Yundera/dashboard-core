// HTTP method validation
import {NextApiRequest, NextApiResponse} from "next";

export function validateMethod(req: NextApiRequest, res: NextApiResponse, allowedMethod: string): boolean {
  if (req.method !== allowedMethod) {
    res.setHeader('Allow', [allowedMethod]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return false;
  }
  return true;
}