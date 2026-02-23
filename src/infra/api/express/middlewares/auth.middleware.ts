import { NextFunction, Request, Response } from "express";
import {
  TokenPayload,
  TokenService,
} from "../../../../usecases/security/token-service";

interface AuthenticatedRequest extends Request {
  auth?: TokenPayload;
}

export const authMiddleware = (tokenService: TokenService) => {
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

      request.auth = payload;

      return next();
    } catch (err) {
      return response.status(401).json({ message: "Invalid or expired token" });
    }
  };
};
