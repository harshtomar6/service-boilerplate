/**
 * Implementation of Clinet Business Logic
 *
 * @author - Harsh Tomar
 */

// Dependencies
import {
  BadRequest,
  InternalError,
  IResponse,
  OkResponse,
} from "../../common/interfaces/response";
import { Client } from "../../models";
import uuidAPIKey from "uuid-apikey";

type Providers = {
  aws: {
    ACCESS_KEY_ID: string;
    SECRET_ACCESS_KEY: string;
    BUCKETS: string[];
  };
};

export interface IClientService {
  createClient(
    name: string,
    providers?: Providers
  ): Promise<IResponse>;
  getClients(): Promise<IResponse>;
  updateClient(
    id: string,
    data: { name?: string; apiKey?: string; providers?: Providers }
  ): Promise<IResponse>;
}

export default class ClientService implements IClientService {
  /**
   * Creates a new client
   * @param name - Name of the client
   * @param providers - Provider config object
   */
  async createClient(
    name: string,
    providers?: Providers
  ): Promise<IResponse> {
    try {
      if(!name)
        return Promise.reject(BadRequest("Client Name is required!"))

      const existingClient = await Client.findOne({ name });

      if (existingClient)
        return Promise.reject(BadRequest(`Client already exists with name ${name}`));

      const client = new Client({
        name,
        apiKey: uuidAPIKey.create().apiKey,
        providers,
      });

      const savedClient = await client.save();

      return OkResponse(savedClient);
    } catch (err) {
      return Promise.reject(InternalError(err.toString()));
    }
  }

  /**
   * Get lists of all clients
   */
  async getClients(): Promise<IResponse> {
    try {
      const clients = await Client.find().sort({ createdAt: -1 });

      return OkResponse(clients);
    } catch (err) {
      return Promise.reject(InternalError(err.toString()));
    }
  }

  /**
   * Update a client's data 
   * @param id - client id
   * @param data - the updated data object
   */
  async updateClient(
    id: string,
    data: { name?: string; apiKey?: string; providers?: Providers }
  ): Promise<IResponse> {
    try {
      const client = await Client.findOne({ _id: id });

      if (!client) return Promise.reject(BadRequest("No Client exists!"));

      const updatedData = await Client.findOneAndUpdate(
        { _id: id },
        { ...data },
        { new: true }
      );
      return OkResponse(updatedData);
    } catch (err) {
      return Promise.reject(InternalError(err.toString()));
    }
  }
}
