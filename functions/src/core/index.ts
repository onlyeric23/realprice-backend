import * as functions from "firebase-functions";
import admin, { ServiceAccount } from "firebase-admin";
import serviceAccount from "../realprice-45367-firebase-adminsdk-8lcoy-c19f244bc7.json";
import { CLOUD_STORAGE_BUCKET } from "../config.js";

export type Handler = (
  request: functions.https.Request,
  response: functions.Response
) => void;

export const firebaseRequestHandler = (handler: Handler) =>
  functions.https.onRequest(async (request, response) => {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as ServiceAccount),
      storageBucket: CLOUD_STORAGE_BUCKET
    });

    handler(request, response);
  });

export default firebaseRequestHandler;
