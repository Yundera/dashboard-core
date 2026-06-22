import type { EmailAttachment } from './Sendgrid';
import { getBrandName, getBrandLogo } from '../branding/Brand';

// Shared visual constants for transactional emails. These are theme colors/fonts,
// not tenant identity — brand NAME and LOGO come from config via ../branding/Brand
// so a single dashboard-core build can serve multiple tenants (Yundera, NSL, ...).
export const BRAND = {
  primary: '#27aae1',
  text: '#3d617f',
  infoBg: '#dcebf9',
  lightBg: '#f8f9fa',
  fontBody: "'Trebuchet MS', sans-serif",
  fontHeading: "'Comfortaa','Trebuchet MS', sans-serif",
} as const;

interface RenderEmailOptions {
  heading: string;
  bodyHtml: string;
  closing?: string;
}

export function renderEmail({
  heading,
  bodyHtml,
  closing = 'Thanks,',
}: RenderEmailOptions): { html: string; attachments: EmailAttachment[] } {
  const logo = getBrandLogo();
  const html = `
      <div style="font-family: ${BRAND.fontBody}; max-width: 600px; margin: 0 auto; color:${BRAND.text};">
        ${logo.imgTag}
        <h2 style="font-family: ${BRAND.fontHeading}; color: ${BRAND.primary};">${heading}</h2>
        ${bodyHtml}
        <p style="margin-top: 30px;">
          ${closing}<br>
          <strong>Your Team at ${getBrandName()}</strong>
        </p>
      </div>
    `;
  return { html, attachments: logo.attachments };
}
