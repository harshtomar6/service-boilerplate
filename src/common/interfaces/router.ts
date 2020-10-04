/**
 * Definition of IRouter interface to be implemented by every Router Class
 * 
 * @author - Harsh Tomar
 */

// Dependencies
import { Router as ExpressRouter } from "express";

export default interface IRouter {
  getRouter(): ExpressRouter
}