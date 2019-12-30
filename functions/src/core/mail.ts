import sgMail from "@sendgrid/mail";
import { ADMIN_EMAIL } from "../config";
import { inspect } from "util";

export const notifyException = ({
  text,
  html
}: {
  text?: string;
  html?: string;
}) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
  const msg = {
    to: ADMIN_EMAIL,
    from: "error@realprice.com.tw",
    subject: "Exception notification",
    text,
    html
  };
  return sgMail.send(msg).catch(error => console.error(inspect(error)));
};
