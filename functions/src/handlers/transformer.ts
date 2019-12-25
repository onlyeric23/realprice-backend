import firebaseRequestHandler from "../core/index.js";
import { parseString } from "xml2js";

const transformPrice = firebaseRequestHandler((reqeust, response) => {
  response.status(200).send("Hello World");
});

export default transformPrice;
