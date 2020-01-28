import sgMail from '@sendgrid/mail';
import { inspect } from 'util';
import { SENDGRID_API_KEY } from '../config.json';
import { ADMIN_EMAIL } from './constant.js';

export const notifyException = ({
  text,
  html,
}: {
  text?: string;
  html?: string;
}) => {
  sgMail.setApiKey(SENDGRID_API_KEY!);
  const msg = {
    to: ADMIN_EMAIL,
    from: 'error@realprice.com.tw',
    subject: 'Exception notification',
    text,
    html,
  };
  return sgMail.send(msg).catch(error => console.error(inspect(error)));
};
