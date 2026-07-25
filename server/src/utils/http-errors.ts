import { HTTPException } from "hono/http-exception";

export function badRequest(message: string): HTTPException {
  return new HTTPException(400, { message });
}

export function requestTimeout(message: string): HTTPException {
  return new HTTPException(408, { message });
}

export function unsupportedMediaType(message: string): HTTPException {
  return new HTTPException(415, { message });
}

export function badGateway(message: string): HTTPException {
  return new HTTPException(502, { message });
}
