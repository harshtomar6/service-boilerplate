# Service Boilerplate

This is a boilerplate to quicky create a new service

## Service
A Service is a RESTful API that abstracts a common functionality. Each service needs a client to be interacted first.

## Endpoints
These are the lists of default endpoints

### `POST /client`
uploads a file to aws

**Request Body**
```json
{
  name: <string>
}
```
