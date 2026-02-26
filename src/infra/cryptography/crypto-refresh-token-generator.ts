import crypto from "crypto";
import { TokenGenerator } from "../../usecases/security/token-generator";

export class CryptoTokenGenerator implements TokenGenerator {
  private constructor() {}

  public static build() {
    return new CryptoTokenGenerator();
  }

  public async generateRandomToken(): Promise<string> {
    return crypto.randomBytes(48).toString("base64url");
  }

  public async generateResetPasswordToken(): Promise<string> {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const bytes = crypto.randomBytes(6);

    let code = "";

    for (let i = 0; i < 6; i++) {
      code += chars[bytes[i] % chars.length];
    }

    return code;
  }
}
