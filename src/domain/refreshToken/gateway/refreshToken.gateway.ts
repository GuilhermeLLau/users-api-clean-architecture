import { RefreshToken } from "../enitty/refreshToken";

export interface RefreshTokenGateway {
  create(refreshToken: RefreshToken): Promise<void>;
  findByTokenHash(tokenHash: string): Promise<RefreshToken>;
  revokeToken(tokenHash: string): Promise<void>;
  deleteToken(tokenHash: string): Promise<void>;
}
