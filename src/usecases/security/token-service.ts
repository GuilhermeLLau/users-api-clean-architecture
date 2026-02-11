import { UserRole } from "../../domain/user/entity/user";

export type TokenPayload = {
  sub: string;
  role: UserRole;
};

export interface TokenService {
  sign(payload: TokenPayload): Promise<string>;
  verify(token: string): Promise<TokenPayload>;
}
