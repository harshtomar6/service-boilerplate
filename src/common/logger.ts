/**
 * Implementation of Logger class used by various modules for logging
 *
 * @author - Harsh Tomar
 */

// Dependencies
import {
  createLogger,
  format,
  Logger as LoggerType,
  transports,
} from "winston";
import appConfig from "../config/appConfig";
import path from "path";

export interface ILogger {
  info(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  debug(message: string, ...args: any[]): void;
}

export default class Logger implements ILogger {
  private logger: LoggerType;

  constructor() {
    this.logger = createLogger({
      level: appConfig.NODE_ENV === "production" ? "info" : "debug",
      format: format.combine(
        format.label({ label: path.basename(require.main.filename) }),
        format.splat(),
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" })
      ),
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.splat(),
            format.printf((info) => {
              return `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`;
            })
          ),
        }),
        new transports.File({
          filename: "logs/error.log",
          level: "error",
          format: format.json()
        }),
        new transports.File({
          filename: "logs/combined.log",
          format: format.json()
        })
      ],
    });
  }

  info(message: string, ...args: any[]): void {
    this.logger.info(message, ...args);
  }

  error(message: string, ...args: any[]): void {
    this.logger.error(message, ...args);
  }

  debug(message: string, ...args: any[]): void {
    this.logger.debug(message, ...args);
  }
}
