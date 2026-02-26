import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

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

  if (err?.type === "auth") {
    return response.status(err.status ?? 401).json({
      message: err.message ?? "Unauthorized",
    });
  }

  if (err?.status) {
    return response.status(err.status).json({ message: err.message });
  }

  return response.status(500).json({ message: err.message });
}
