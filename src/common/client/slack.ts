import { response } from "express";
import { method } from "lodash";
/**
 * Implementation of Slack layer to communicate with Slack API
 *
 * @author - Harsh Tomar
 */

// Dependencies
import fetch from "node-fetch";
import appConfig from "../../config/appConfig";
import { logMessageTemplate } from "../constants/logMessageTemplate";
import { ILogger } from "../logger";

type LogParams = {
  ip: string;
  method: string;
  endpoint: string;
  status: number;
  body: any;
  headers: any;
  responseBody: any;
};

export interface ISlackService {
  sendMessage(
    message: string,
    channelId: string,
    logParams?: LogParams
  ): Promise<any>;
}

export default class SlackService implements ISlackService {
  private logger: ILogger;
  private SLACK_API: string = "https://slack.com/api";

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  /**
   * Make HTTP request to Slack API
   * @param endpoint - Endpoint of slack API
   * @param data - Payload to be sent to slack
   */
  private async fetch(
    endpoint: string,
    data: Record<string, any>
  ): Promise<any> {
    try {
      const resObj = await fetch(`${this.SLACK_API}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${appConfig.SLACK_AUTH_TOKEN}`,
        },
        body: JSON.stringify(data),
      });
      const res = await resObj.json();

      if (!resObj.ok) return Promise.reject(res);

      this.logger.debug("Response: %o", res);
      return res;
    } catch (error) {
      this.logger.error(error);
      return Promise.reject(error.toString());
    }
  }

  /**
   * Send Message to a Slack Channel
   * @param message - Message to be sent to slack
   * @param channelId - Channel ID where message needs to be sent
   */
  async sendMessage(
    message: string,
    channelId: string,
    logParams?: LogParams
  ): Promise<any> {
    try {
      const response = await this.fetch("/chat.postMessage", {
        channel: channelId,
        text: message,
        ...logMessageTemplate(
          logParams.ip,
          logParams.method,
          logParams.endpoint,
          logParams.status,
          logParams.body,
          logParams.headers,
          logParams.responseBody
        ),
      });
      return response;
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
