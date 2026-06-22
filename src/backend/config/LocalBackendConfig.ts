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

  // Branding (all optional — fall back to Yundera defaults in Brand.ts).
  // Lets a single dashboard-core build serve multiple tenants (Yundera, NSL, ...).
  BRAND_NAME: string;          // e.g. "Yundera", "NSL"
  BRAND_DASHBOARD_URL: string; // e.g. "https://dashboard.yundera.com"
  BRAND_LOGO_URL: string;      // hosted logo; if unset, bundled logo is inlined
}

/**
 * Generic config retrieval function
 * @param key Key to retrieve from config
 * @returns Configuration value
 */
export function getConfig<T extends BaseConfig, K = string>(key: keyof T): K {
  return process.env[key as unknown as string] || localBackendConfig[key as unknown as string];
}