import sendgrid from '@sendgrid/mail';
import {getConfig} from "./LocalBackendConfig";
// Configure SendGrid API
sendgrid.setApiKey(getConfig("SENDGRID_API_KEY"));

export async function sendEmail(msg:{
  to: string,
  from: string,
  subject: string,
  text: string,
  html?: string
}) {
  if(!msg.html) {
    msg.html = msg.text;
  }
  await sendgrid.send(msg);
}