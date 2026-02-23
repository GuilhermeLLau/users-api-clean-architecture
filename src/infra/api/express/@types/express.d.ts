// src/types/express.d.ts
import { TokenPayload } from "../../../../usecases/security/token-service";

declare global {
  namespace Express {
    interface Request {
      auth?: TokenPayload;
    }
  }
}

// This empty export is crucial to turn the file into a module
// so the import above doesn't break the global augmentation.
export {};
