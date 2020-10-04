/**
 * Implementation of logger middleware to log every request data
 *
 * @author - Harsh Tomar
 */

// Dependencies
import Logger from "./../common/logger";
import { Request, Response, NextFunction } from "express";
import onFinished from "on-finished";
import SlackService from "../common/client/slack";
import appConfig from "../config/appConfig";

interface RequestWithResponseBody extends Request {
  responseBody: string;
}

export default function logRequest(
  req: RequestWithResponseBody,
  res: Response,
  next: NextFunction
) {
  const logger = new Logger();

  const startTime = Date.now();

  function getResponseBody() {
    const oldWrite = res.write;
    const oldEnd = res.end;

    const chunks = [];
    res.write = (...restArgs): any => {
      chunks.push(Buffer.from(restArgs[0]));
      oldWrite.apply(res, restArgs);
    };

    res.end = (...restArgs) => {
      if (restArgs[0]) {
        chunks.push(Buffer.from(restArgs[0]));
      }
      const body = Buffer.concat(chunks).toString("utf8");

      req.responseBody = body;
      oldEnd.apply(res, restArgs);
    };
  }

  function getIp() {
    return req.connection.remoteAddress || req.headers["x-forwarded-for"];
  }

  getResponseBody();
  onFinished(res, function (err, res: Response) {
    if (res.statusCode >= 400) {
      logger.error(
        `${getIp()} ${req.method} ${req.originalUrl} ${res.statusCode} ${
          Date.now() - startTime
        }ms`,
        { method: req.method },
        { endpoint: req.originalUrl },
        { status: res.statusCode },
        { body: req.body },
        { query: req.query },
        { headers: req.headers },
        { responseBody: req.responseBody }
      );
      const slackService = new SlackService(logger);
      slackService.sendMessage(
        `❌ ${getIp()} ${req.method} ${req.originalUrl} ${res.statusCode} ${
          Date.now() - startTime
        }ms`,
        appConfig.SLACK_LOGS_CHANNEL_ID,
        {
          ip: <string>getIp(),
          method: req.method,
          endpoint: req.originalUrl,
          status: res.statusCode,
          body: JSON.stringify(req.body),
          headers: JSON.stringify(req.headers),
          responseBody: req.responseBody
        }
      );
    } else {
      logger.info(
        `${getIp()} ${req.method} ${req.originalUrl} ${res.statusCode} ${
          Date.now() - startTime
        }ms`,
        { method: req.method },
        { endpoint: req.originalUrl },
        { status: res.statusCode },
        { body: req.body },
        { query: req.query },
        { headers: req.headers },
        { responseBody: req.responseBody }
      );
    }
  });
  next();
}