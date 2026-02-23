import {
  RefreshTokenPayload,
  TokenPayload,
  TokenService,
} from "../../usecases/security/token-service";
import jwt from "jsonwebtoken";

export class JwtTokenService implements TokenService {
  private readonly secret: string;
  private readonly refreshSecret: string;

  public constructor(secret: string, refreshSecret: string) {
    this.secret = secret;
    this.refreshSecret = refreshSecret;
  }
  public async generateAccessToken(payload: TokenPayload): Promise<string> {
    return jwt.sign({ sub: payload.sub, role: payload.role }, this.secret, {
      expiresIn: "5m",
    });
  }
  public async verifyAccessToken(token: string): Promise<TokenPayload> {
    const decoded = jwt.verify(token, this.secret) as TokenPayload;

    return {
      sub: decoded.sub as string,
      role: decoded.role,
    };
  }

  public async generateRefreshToken(
    payload: RefreshTokenPayload,
  ): Promise<string> {
    return jwt.sign({ sub: payload.sub }, this.refreshSecret, {
      expiresIn: "1m",
    });
  }

  public async verifyRefreshToken(token: string) {
    const decoded = jwt.verify(
      token,
      this.refreshSecret,
    ) as RefreshTokenPayload;
    return { sub: decoded.sub as string };
  }
}
