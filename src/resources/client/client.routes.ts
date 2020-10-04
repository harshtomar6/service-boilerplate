/**
 * Implementation of all the routes accessible at /client
 * 
 * @author - Harsh Tomar
 */

// Dependencies
import { Router as ExpressRouter, Request, Response } from "express";
import IRouter from "../../common/interfaces/router";
import IRequest from "../../common/interfaces/request";
import ClientService from "./client.service";
import verifySlackRequest from "./../../middlewares/slack.middleware";

export default class ClientRouter implements IRouter {
  private static router:ExpressRouter = ExpressRouter();
  private clientService:ClientService = new ClientService();

  constructor() {
    const { router } = ClientRouter;

    // POST /client to create a new client
    router.post("/", verifySlackRequest, async (req: IRequest, res: Response) => {
      // console.log("VIEW: ", JSON.parse(req.body.payload).view.blocks)
      const reqBody = JSON.parse(req.body.payload).view.state.values
      try {
        const { err, status, data } = await this.clientService.createClient(
          reqBody.clientNameInput.name.value,
          req.body.providers
        )

        res.status(status).send({ err, data });
      } catch({ err, status, data }) {
        res.status(status).send({ err, data });
      }
    })
  }

  getRouter():ExpressRouter {
    return ClientRouter.router;
  }
}