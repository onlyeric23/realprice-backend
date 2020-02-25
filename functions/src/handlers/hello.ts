import { firebaseRequestHandler } from '../core';
import { notifyException } from '../core/mail';
import { RawItemTP } from '../models/RawItemTP';

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

export const helloSQL = firebaseRequestHandler(async (_, res) => {
  const count = await RawItemTP.count();
  res.send(`Current count: ${count}`).end();
});
