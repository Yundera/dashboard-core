import { getConfig } from "../config/LocalBackendConfig";
import type { EmailAttachment } from "../email/Sendgrid";

// Whitelabel branding for transactional emails (and anywhere else the brand
// surfaces). dashboard-core is shared across tenants, so brand strings/assets
// MUST NOT be hardcoded — they are read from config with neutral defaults so a
// single build can serve Yundera, NSL, etc. No brand logo is bundled: each
// deployment supplies its own via BRAND_LOGO_URL, or no logo is shown.
const BRAND_DEFAULTS = {
  name: "Yundera",
  dashboardUrl: "https://app.yundera.com/dashboard",
};

const LOGO_STYLE =
  "width: 150px; height: auto; margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto;";

export function getBrandName(): string {
  return getConfig("BRAND_NAME") || BRAND_DEFAULTS.name;
}

export function getBrandDashboardUrl(): string {
  const url = getConfig("BRAND_DASHBOARD_URL") || BRAND_DEFAULTS.dashboardUrl;
  return url.replace(/\/+$/, ""); // strip trailing slash so `${url}/register` is clean
}

/**
 * Build the brand logo for an email.
 * - If BRAND_LOGO_URL is configured, the email references it directly.
 * - Otherwise no logo is rendered (the library bundles no tenant logo).
 */
export function getBrandLogo(): { imgTag: string; attachments: EmailAttachment[] } {
  const logoUrl = getConfig("BRAND_LOGO_URL");
  if (!logoUrl) {
    return { imgTag: "", attachments: [] };
  }
  return {
    imgTag: `<img src="${logoUrl}" alt="${getBrandName()}" style="${LOGO_STYLE}" />`,
    attachments: [],
  };
}
