import { NextFunction, Request, Response } from "express";
import { TokenService } from "../../../../usecases/security/token-service";

export const isAdminMiddleware = (tokenService: TokenService) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return response.status(401).json({ message: "Unauthorized" });
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        return response.status(401).json({ message: "Unauthorized" });
      }

      const payload = await tokenService.verifyAccessToken(token);

      if (payload.role !== "admin") throw new Error("Forbbiden");
      request.auth = payload;

      return next();
    } catch (err) {
      return response.status(401).json({ message: "Invalid or expired token" });
    }
  };
};
