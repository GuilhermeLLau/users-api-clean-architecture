import { Request, Response, NextFunction } from "express";

export function errorMiddleware(
  err: any,
  request: Request,
  response: Response,
  next: NextFunction,
) {
  if (err?.type === "validation") {
    return response.status(400).json({
      message: "Validation error",
      errors: err.issues ?? [],
    });
  }
  return response.status(500).json({ message: err.message });
}
