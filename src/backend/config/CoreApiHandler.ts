import { NextApiRequest, NextApiResponse } from 'next';
import {BaseConfig, getConfig} from "./LocalBackendConfig";

// Configuration handlers
function getPublicConfig(): Record<string, any> {
  const publicConfig: Record<string, any> = {};
  for (const key of getConfig<BaseConfig,string[]>("FRONTEND_PUBLIC_ENV") || []) {
    publicConfig[key] = getConfig<any,any>(key);
  }
  return publicConfig;
}

// Route handlers
async function handleConfigRoute(pathStr: string, res: NextApiResponse) {
  switch (pathStr) {
    case 'config/core':
      return res.status(200).json(getPublicConfig());
    default:
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
    }else {
      // No matching route found
      return res.status(404).json({error: 'Route not found'});
    }

  } catch (error) {
    console.error(error.toString());
    return res.status(500).json({ error: error.toString() });
  }
}