import firebaseRequestHandler from "../core";
import { notifyAdmin } from "../core/mail";

export const helloMail = firebaseRequestHandler(async (_, response) => {
  await notifyAdmin({
    text: "I have a text.",
    // html: "<div>I have a html.</div>"
  });
  response.status(200).end();
});
