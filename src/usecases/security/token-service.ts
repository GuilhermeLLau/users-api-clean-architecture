import { UserRole } from "../../domain/user/entity/user";

export type TokenPayload = {
  sub: string;
  role: UserRole;
};

export type RefreshTokenPayload = {
  sub: string;
};

export interface TokenService {
  generateAccessToken(payload: TokenPayload): Promise<string>;
  generateRefreshToken(payload: RefreshTokenPayload): Promise<string>;
  verifyAccessToken(token: string): Promise<TokenPayload>;
  verifyRefreshToken(refreshToken: string): Promise<RefreshTokenPayload>;
}
