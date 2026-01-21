import { NextApiRequest, NextApiResponse } from 'next';
import {BaseConfig, getConfig} from "./LocalBackendConfig";

export interface CoreApiHandlerOptions {
  defaultPublicEnv?: string[];
}

// Configuration handlers
function getPublicConfig(defaultPublicEnv: string[] = []): Record<string, any> {
  const publicConfig: Record<string, any> = {};
  const envKeys = getConfig<BaseConfig,string[]>("FRONTEND_PUBLIC_ENV") || defaultPublicEnv;
  for (const key of envKeys) {
    publicConfig[key] = getConfig<any,any>(key);
  }
  return publicConfig;
}

// Route handlers
async function handleConfigRoute(pathStr: string, res: NextApiResponse, options: CoreApiHandlerOptions) {
  switch (pathStr) {
    case 'config/core':
      return res.status(200).json(getPublicConfig(options.defaultPublicEnv));
    default:
      return res.status(404).json({ error: 'Route not found' });
  }
}

// Main API handler
export async function coreApiHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  options: CoreApiHandlerOptions = {}
) {
  try {
    const path = req.query.path || [];
    const pathStr = Array.isArray(path) ? path.join('/') : path;

    // Handle different route types
    if(pathStr.startsWith('config')) {
      return await handleConfigRoute(pathStr, res, options);
    }else {
      // No matching route found
      return res.status(404).json({error: 'Route not found'});
    }

  } catch (error) {
    console.error(error.toString());
    return res.status(500).json({ error: error.toString() });
  }
}