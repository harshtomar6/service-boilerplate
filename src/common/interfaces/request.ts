/**
 * Populate Express Request with client property
 * 
 * @author - harsh tomar
 */

// Dependencies
import { Request } from "express";
import { IClientSchema } from "./../../models/client.model"; 

export default interface IRequest extends Request {
  client?: IClientSchema
}