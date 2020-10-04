/**
 * Implmentation of verifiying request coming from Slack
 *
 * @author - Harsh Tomar
 */

// Dependencies
import { createHmac } from "crypto";
import { Request, Response, NextFunction } from "express";
import appConfig from "../config/appConfig";
import qs from "qs";

export default function verifySlackRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const timestamp = req.headers["x-slack-request-timestamp"];
    const sig_basestring = `v0:${timestamp}:${qs.stringify(req.body,{ format:'RFC1738' })}`;
    const hmac = createHmac("sha256", appConfig.SLACK_SIGNING_SECRET);
    const data = hmac.update(sig_basestring);
    const signature = data.digest("hex");

    if (req.headers["x-slack-signature"] === `v0=${signature}`) {
      console.log("Request validated!");
      next();
      return;
    }

    res.status(401).send({ err: "Not Allowed!", data: null });
  } catch (err) {
    console.log(err)
    res.status(500).send({ err: err.toString(), data: null });
  }
}
