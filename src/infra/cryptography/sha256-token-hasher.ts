import { TokenHasher } from "../../usecases/security/token-hasher";
import crypto from "crypto";

export class Sha256TokenHasher implements TokenHasher {
  constructor(private readonly pepper: string) {}

  public static build(pepper: string) {
    return new Sha256TokenHasher(pepper);
  }

  public async hash(token: string): Promise<string> {
    return crypto.createHmac("sha256", this.pepper).update(token).digest("hex");
  }
}
