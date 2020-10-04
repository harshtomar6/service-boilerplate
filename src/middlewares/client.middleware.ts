/**
 * Implementation of Client middleware to validate every requests
 * coming are actually from one of our clients.
 *
 * @author - Harsh Tomar
 */

// Dependencies
import { Response, NextFunction } from "express";
import IRequest from "../common/interfaces/request";
import { BadRequest, InternalError } from "../common/interfaces/response";
import appConfig from "../config/appConfig";
import { Client } from "./../models";

export default async function verifyClent(
  req: IRequest,
  res: Response,
  next: NextFunction
) {
  // Don't check in Development
  if(appConfig.NODE_ENV === "development") {
    next();
    return;
  }

  function getApiKey() {
    return req.headers["x-api-key"];
  }

  try {
    const apiKey = <string>getApiKey();

    if(!apiKey) {
      res.status(400).send({ err: "API Key is required!", data: null })
      return
    }
    
    const client = await Client.findOne({ apiKey });

    if (!client) {
      const response = BadRequest("Invalid Client!");
      res
        .status(response.status)
        .send({ err: response.err, data: response.data });
      return;
    }

    req.client = client
    next();
  } catch (err) {
    const response = InternalError(err.toString());
    res
      .status(response.status)
      .send({ err: response.err, data: response.data });
  }
}
