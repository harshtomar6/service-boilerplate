/**
 * Entrypoint to the application
 * 
 * @author - Harsh Tomar
 */

// Dependencies
import { app } from './app';
import config from './config/appConfig';
import Logger from "./common/logger";
import mongoose from 'mongoose';

// Connect to mongoose DB
mongoose.connect(config.MONGO_URL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Db Connected!"))
  .catch(err => {
    console.log(`Error in connecting DB: `, err)
  })

app.listen({ port: config.PORT }, () => {
  console.log(`🚀 Server ready at http://localhost:${config.PORT}`)
})

process.on("uncaughtException", (err) => {
  const logger = new Logger();
  logger.error(`Uncaught Exception: ${err.toString()}`, { err })
})

process.on("unhandledRejection", (err, promise) => {
  const logger = new Logger();
  logger.error(`Unhandled Promise Rejection: ${err.toString()}`, { err })
})