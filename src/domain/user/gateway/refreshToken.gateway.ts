import { RefreshToken } from "../entity/refreshToken";

export interface RefreshTokenGateway {
  create(refreshToken: RefreshToken): Promise<void>;
  findByTokenHash(token: string): Promise<RefreshToken>;
  revokeToken(id: string): Promise<void>;
  deleteToken(id: string): Promise<void>;
}
