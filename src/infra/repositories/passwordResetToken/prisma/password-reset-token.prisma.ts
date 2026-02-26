import { PasswordResetToken } from "../../../../domain/passwordToken/entity/passwordToken";
import { PasswordResetTokenGateway } from "../../../../domain/passwordToken/gateway/passwordToken.gateway";
import { PrismaClient } from "../../../../generated/prisma/client";

export class PasswordResetTokenRepositoryPrisma implements PasswordResetTokenGateway {
  private constructor(private readonly prisma: PrismaClient) {}

  public static build(prisma: PrismaClient) {
    return new PasswordResetTokenRepositoryPrisma(prisma);
  }

  public async create(passwordResetToken: PasswordResetToken): Promise<void> {
    const data = {
      id: passwordResetToken.id,
      tokenHash: passwordResetToken.tokenHash,
      userId: passwordResetToken.userId,
      used: passwordResetToken.used,
      usedAt: passwordResetToken.usedAt ?? null,
      expiresAt: passwordResetToken.expiresAt,
      createdAt: passwordResetToken.createdAt,
    };

    await this.prisma.passwordResetToken.create({ data });
  }
  public async findByTokenHash(tokenHash: string): Promise<PasswordResetToken> {
    const foundToken = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });
    if (!foundToken) throw new Error("Token not found");

    const output = PasswordResetToken.with({
      id: foundToken.id,
      tokenHash: foundToken.tokenHash,
      userId: foundToken.userId,
      used: foundToken.used,
      usedAt: foundToken.usedAt,
      expiresAt: foundToken.expiresAt,
      createdAt: foundToken.createdAt,
    });

    return output;
  }
  public async markAsUsed(tokenHash: string): Promise<void> {
    await this.prisma.passwordResetToken.update({
      where: { tokenHash },
      data: {
        used: true,
        usedAt: new Date(),
      },
    });
  }
}
