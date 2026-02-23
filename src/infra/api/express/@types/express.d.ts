import { TokenPayload } from "../../../../usecases/security/token-service";

declare global {
  namespace Express {
    interface Request {
      auth?: TokenPayload;
    }
  }
}

export {};
