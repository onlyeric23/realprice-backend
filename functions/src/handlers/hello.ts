import { firebaseRequestHandler } from '../core';
import { notifyException } from '../core/mail';

export const helloMail = firebaseRequestHandler(async (_, response) => {
  await notifyException({
    text: 'I have a text.',
    // html: "<div>I have a html.</div>"
  });
  response.status(200).end();
});

export const helloError = firebaseRequestHandler(() => {
  throw new Error('I am an error.');
});
