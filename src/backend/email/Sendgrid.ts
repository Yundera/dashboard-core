import sendgrid from '@sendgrid/mail';
import {getConfig} from "../config/LocalBackendConfig";

export interface EmailAttachment {
  filename: string;
  content: string; // base64-encoded content
  type: string; // MIME type (e.g., 'image/png', 'image/jpeg', 'image/svg+xml')
  disposition: 'inline' | 'attachment';
  content_id: string; // for inline images, reference as cid:content_id in HTML
}

// Configure SendGrid API
if(getConfig("SENDGRID_API_KEY")) {
  sendgrid.setApiKey(getConfig("SENDGRID_API_KEY"));
}

export async function sendEmail(msg:{
  to: string,
  from?: string,
  subject: string,
  text: string,
  html?: string,
  attachments?: EmailAttachment[]
}) {
  if(!getConfig("SENDGRID_API_KEY")){
    throw new Error("SENDGRID_API_KEY is not set");
  }
  if(!msg.from) {
    msg.from = getConfig("SENDMAIL_FROM_EMAIL");
  }
  if(!msg.html) {
    msg.html = msg.text;
  }
  await sendgrid.send(msg as any);
}