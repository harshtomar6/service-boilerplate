/**
 * Implementation of Mongoose model of client
 * 
 * @author - Harsh Tomar
 */

// Dependencies
import { Schema, Document, model } from "mongoose";
import validator from "validator";

const clientSchema = new Schema({
  name: { type: String, required: [true, "Client Name is required"] },
  apiKey: { type: String, rquired: [true, "API Key is required"] },
  // Add Providers here
  deletedAt: { type: Date }
}, {
  timestamps: true
});

export interface IClientSchema extends Document {
  name: string;
  apiKey: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

const Client = model<IClientSchema>("Client", clientSchema);

export default Client;