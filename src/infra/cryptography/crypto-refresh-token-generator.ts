import crypto from "crypto";
import { RefreshTokenGenerator } from "../../usecases/security/refresh-token-generator";

export class CryptoRefreshTokenGenerator implements RefreshTokenGenerator {
  private constructor() {}

  public static build() {
    return new CryptoRefreshTokenGenerator();
  }

  public async generate(): Promise<string> {
    return crypto.randomBytes(48).toString("base64url");
  }
}
