import path from 'path';
import fs from 'fs';

// Get the current file's directory
const rootDir = process.cwd();
console.log('CWD:', rootDir);

const filePathConfig = path.join(rootDir, 'config/core.env.json');
const localBackendConfig = JSON.parse(fs.readFileSync(filePathConfig, 'utf-8'));

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
export function getConfig<T extends BaseConfig,K = string>(key: keyof T): K {
  return localBackendConfig[key as unknown as K];
}