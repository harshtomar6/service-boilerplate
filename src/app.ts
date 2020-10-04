/**
 * App intialization
 * 
 * @author - Harsh Tomar
 */

// Dependencies
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import logRequest from './middlewares/logger.middleware';
import verifyClient from "./middlewares/client.middleware";
import ClientRouter from "./resources/client/client.routes";

export const app = express();

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use(logRequest)


app.use("/client", new ClientRouter().getRouter())

// Handle 404
app.use("*", (req, res) => {
  res.status(404).send({ err: "Oo.. That's a Bad Endpoint!", data: null })
})
