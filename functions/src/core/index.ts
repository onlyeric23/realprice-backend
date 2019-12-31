import * as functions from "firebase-functions";
import admin, { ServiceAccount } from "firebase-admin";
import serviceAccount from "../realprice-45367-firebase-adminsdk-8lcoy-c19f244bc7.json";
import { CLOUD_STORAGE_BUCKET } from "../config.js";
import { notifyException } from "./mail.js";
import { inspect } from "util";

const handleException = async (
  error: any,
  from: {
    request?: functions.https.Request;
    context?: functions.EventContext;
  }
) => {
  if (process.env.NODE_ENV === "production") {
    return await notifyException({
      text: inspect(
        {
          ...from,
          error
        },
        undefined,
        2
      )
    });
  }
  console.error(error);
};

export type Handler = (
  request: functions.https.Request,
  response: functions.Response
) => void;

export const firebaseRequestHandler = (handler: Handler) =>
  functions.https.onRequest(async (request, response) => {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as ServiceAccount),
        storageBucket: CLOUD_STORAGE_BUCKET
      });
      handler(request, response);
    } catch (error) {
      await handleException(error, { request });
      response.send(400).end();
    }
  });

export type Scheduler = () => void;

export const firebaseScheduler = (
  scheduler: Scheduler,
  schedule: string,
  timezone: string = "Asia/Taipei"
) =>
  functions.pubsub
    .schedule(schedule)
    .timeZone(timezone)
    .onRun(async context => {
      try {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount as ServiceAccount),
          storageBucket: CLOUD_STORAGE_BUCKET
        });

        scheduler();
        return null;
      } catch (error) {
        await handleException(error, { context });
      }
    });

export default firebaseRequestHandler;
