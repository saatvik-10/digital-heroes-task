import type { ErrorHandler, NotFoundHandler } from "hono";
import { HTTPException } from "hono/http-exception";

export const notFoundHandler: NotFoundHandler = (c) =>
  c.json(
    {
      error: "Route not found.",
      status: 404,
    },
    404,
  );

export const errorHandler: ErrorHandler = (error, c) => {
  if (error instanceof HTTPException) {
    return c.json(
      {
        error: error.message,
        status: error.status,
      },
      error.status,
    );
  }

  console.error(error);

  return c.json(
    {
      error: "Unexpected server error.",
      status: 500,
    },
    500,
  );
};
