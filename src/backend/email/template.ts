import * as fs from 'fs';
import * as path from 'path';
import { EmailAttachment } from './Sendgrid';

export const BRAND = {
  primary: '#27aae1',
  text: '#3d617f',
  infoBg: '#dcebf9',
  lightBg: '#f8f9fa',
  fontBody: "'Trebuchet MS', sans-serif",
  fontHeading: "'Comfortaa','Trebuchet MS', sans-serif",
} as const;

function getLogoBase64(): string {
  const logoPath = process.env.NODE_ENV === 'production'
    ? '/app/assets/yundera-logo.png'
    : path.resolve(__dirname, '../assets/yundera-logo.png');
  return fs.readFileSync(logoPath).toString('base64');
}

export function getLogoAttachment(): EmailAttachment {
  return {
    filename: 'yundera-logo.png',
    content: getLogoBase64(),
    type: 'image/png',
    disposition: 'inline',
    content_id: 'yundera_logo',
  };
}

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
  const html = `
      <div style="font-family: ${BRAND.fontBody}; max-width: 600px; margin: 0 auto; color:${BRAND.text};">
        <img src="cid:yundera_logo" alt="Yundera" style="width: 150px; height: auto; margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto;" />
        <h2 style="font-family: ${BRAND.fontHeading}; color: ${BRAND.primary};">${heading}</h2>
        ${bodyHtml}
        <p style="margin-top: 30px;">
          ${closing}<br>
          <strong>Your Team at Yundera</strong>
        </p>
      </div>
    `;
  return { html, attachments: [getLogoAttachment()] };
}
