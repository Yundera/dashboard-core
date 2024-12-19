import { NextApiRequest, NextApiResponse } from 'next';

type ApiHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<any>;
type RouteHandlerMap = Record<string, ApiHandler>;

export async function genericApiHandler(
  handlers: RouteHandlerMap,
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Get the path from query parameters
    const path = req.query.path || [];
    const pathStr = Array.isArray(path) ? path.join('/') : path;

    // Find the appropriate handler based on the path prefix
    const handlerKey = Object.keys(handlers).find(key => pathStr.startsWith(key));

    if (!handlerKey) {
      return res.status(404).json({
        error: 'Route not found',
        availableRoutes: Object.keys(handlers)
      });
    }

    // Call the matching handler
    const handler = handlers[handlerKey];
    return await handler(req, res);

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: process.env.NODE_ENV === 'development'
        ? error.toString()
        : 'Internal server error'
    });
  }
}

// Example usage with TypeScript types
interface HandlerConfig {
  [key: string]: ApiHandler;
}

// Helper to create a strongly-typed handler configuration
export function createHandlerConfig(config: HandlerConfig): HandlerConfig {
  return config;
}