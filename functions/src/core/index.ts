import admin, { ServiceAccount } from 'firebase-admin';
import * as functions from 'firebase-functions';
import { inspect } from 'util';
import { CLOUD_STORAGE_BUCKET } from '../config.js';
import serviceAccount from '../realprice-45367-firebase-adminsdk-8lcoy-c19f244bc7.json';
import { notifyException } from './mail.js';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
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
      response.status(400).end();
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
