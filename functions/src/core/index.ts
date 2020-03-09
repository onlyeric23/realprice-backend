import admin, { ServiceAccount } from 'firebase-admin';
import * as functions from 'firebase-functions';
import { inspect } from 'util';
import { FIREBASE_ADMINSDK } from '../../config/config';
import { CLOUD_STORAGE_BUCKET } from './constant';
import { notifyException } from './mail';

admin.initializeApp({
  credential: admin.credential.cert(FIREBASE_ADMINSDK as ServiceAccount),
  storageBucket: CLOUD_STORAGE_BUCKET,
});

const handleException = async (
  error: any,
  from: {
    request?: functions.https.Request;
    context?: functions.EventContext;
  }
) => {
  if (process.env.NODE_ENV === 'production') {
    return notifyException({
      text: inspect(
        {
          ...from,
          error,
        },
        undefined,
        2
      ),
    });
  }
  console.error(error);
};

export type Handler = (
  request: functions.https.Request,
  response: functions.Response
) => void | Promise<void>;

export const firebaseRequestHandler = (handler: Handler) =>
  functions.https.onRequest(async (request, response) => {
    try {
      await handler(request, response);
    } catch (error) {
      await handleException(error, { request });
      response.sendStatus(400).end();
    }
  });

export type Scheduler = () => void | Promise<void>;

export const firebaseScheduler = (
  scheduler: Scheduler,
  schedule: string,
  timezone: string = 'Asia/Taipei'
) =>
  functions.pubsub
    .schedule(schedule)
    .timeZone(timezone)
    .onRun(async context => {
      try {
        await scheduler();
      } catch (error) {
        await handleException(error, { context });
      }
    });
