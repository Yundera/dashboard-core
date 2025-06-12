import path from 'path';
import fs from 'fs';

// Get the current file's directory
const rootDir = process.cwd();
console.log('CWD:', rootDir);

const filePathConfig = path.join(rootDir, 'config/core.env.json');

// Safely load config file with fallback
let localBackendConfig: Record<string, any> = {};
try {
  localBackendConfig = JSON.parse(fs.readFileSync(filePathConfig, 'utf-8'));
  console.log('Config file loaded successfully');
} catch (error) {
  console.warn(`Config file not found or invalid: ${filePathConfig}`);
  console.warn('Using environment variables only');
}

export type BaseConfig = {
  // SendGrid
  SENDGRID_API_KEY: string;
  SENDMAIL_FROM_EMAIL: string;

  // Frontend public env configuration
  FRONTEND_PUBLIC_ENV: string[];
}

/**
 * Generic config retrieval function
 * @param key Key to retrieve from config
 * @returns Configuration value
 */
export function getConfig<T extends BaseConfig, K = string>(key: keyof T): K {
  return process.env[key as unknown as string] || localBackendConfig[key as unknown as string];
}