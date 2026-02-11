import {
  TokenPayload,
  TokenService,
} from "../../usecases/security/token-service";
import jwt from "jsonwebtoken";

export class JwtTokenService implements TokenService {
  private readonly secret: string;

  public constructor(secret: string) {
    this.secret = secret;
  }
  public async sign(payload: TokenPayload): Promise<string> {
    return await jwt.sign(
      { id: payload.sub, role: payload.role },
      "senhaSecreta",
      {
        expiresIn: "1m",
      },
    );
  }
  public async verify(token: string): Promise<TokenPayload> {
    const decoded = jwt.verify(token, this.secret) as TokenPayload;

    return {
      sub: decoded.sub as string,
      role: decoded.role,
    };
  }
}
