import { PasswordResetToken } from "../entity/passwordToken";

export interface PasswordResetTokenGateway {
  create(passwordResetToken: PasswordResetToken): Promise<void>;
  findByTokenHash(tokenHash: string): Promise<PasswordResetToken>;
  markAsUsed(tokenHash: string): Promise<void>;
}
