import sgMail from '@sendgrid/mail';
import { inspect } from 'util';
import { SENDGRID_API_KEY } from '../../config/config';
import { ADMIN_EMAIL } from './constant';

interface NotificationOptions {
  text?: string;
  html?: string;
  subject: string;
  from: string;
}

export const notify = ({ text, html, subject, from }: NotificationOptions) => {
  sgMail.setApiKey(SENDGRID_API_KEY!);
  const msg = {
    to: ADMIN_EMAIL,
    from,
    subject,
    text,
    html,
  };
  return sgMail.send(msg).catch(error => console.error(inspect(error)));
};

export const notifyException = ({
  text,
  html,
}: Omit<NotificationOptions, 'subject' | 'from'>) => {
  return notify({
    text,
    html,
    subject: 'Exception notification',
    from: 'error@realprice.com.tw',
  });
};

export const notifyDebugging = ({
  text,
  html,
}: Omit<NotificationOptions, 'subject' | 'from'>) => {
  return notify({
    text,
    html,
    subject: 'Debugging notification',
    from: 'debug@realprice.com.tw',
  });
};
