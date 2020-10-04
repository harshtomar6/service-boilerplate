/**
 * Definition of standard Response interface, used for sending response from 
 * different endpoints
 * 
 * @author - Harsh Tomar
 */

export interface IResponse {
  err: string | null;
  status: number;
  data: unknown | string |null; 
}

/**
 * Returns Ok Response
 * @param data - data to send
 */
export function OkResponse(data: unknown | string): IResponse {
  return {
    err: null,
    status: 200,
    data
  }
}

/**
 * Returns Created Response
 * @param data - data to send
 */
export function CreatedResponse(data: unknown | string): IResponse {
  return {
    err: null,
    status: 201,
    data
  }
}

/**
 * Return Bad Request error
 * @param err - error message
 */
export function BadRequest(err: string): IResponse {
  return {
    err,
    status: 400,
    data: null
  }
}

/**
 * Return Internal Error
 * @param err - error message
 */
export function InternalError(err: string): IResponse {
  return {
    err,
    status: 500,
    data: null
  }
}

/**
 * Return unauthorized error
 * @param err - error message
 */
export function UnauthorizedError(err: string): IResponse {
  return {
    err,
    status: 401,
    data: null
  }
}