import { RefreshToken } from "../../../../domain/user/entity/refreshToken";
import { RefreshTokenGateway } from "../../../../domain/user/gateway/refreshToken.gateway";
import { PrismaClient } from "../../../../generated/prisma/client";

export class RefreshTokenRepositoryPrisma implements RefreshTokenGateway {
  private constructor(readonly prisma: PrismaClient) {}

  public static build(prisma: PrismaClient) {
    return new RefreshTokenRepositoryPrisma(prisma);
  }

  public async create(refreshToken: RefreshToken): Promise<void> {
    const data = {
      id: refreshToken.id,
      tokenHash: refreshToken.tokenHash,
      userId: refreshToken.userId,
      expiresAt: refreshToken.expiresAt,
      revoked: refreshToken.revoked,
      revokedAt: refreshToken.revokedAt ?? null,
      createdAt: refreshToken.createdAt,
    };

    await this.prisma.refreshToken.create({ data });
  }
  public async revokeToken(refreshToken: string): Promise<void> {
    await this.prisma.refreshToken.update({
      where: { tokenHash: refreshToken },
      data: {
        revoked: true,
        revokedAt: new Date(),
      },
    });
  }
  public async deleteToken(refreshToken: string): Promise<void> {
    await this.prisma.refreshToken.delete({
      where: { tokenHash: refreshToken },
    });
  }

  public async findByTokenHash(tokenHash: string): Promise<RefreshToken> {
    const foundToken = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
    });
    if (!foundToken) throw new Error("Invalid token");

    const output = RefreshToken.with({
      id: foundToken.id,
      tokenHash: foundToken.tokenHash,
      createdAt: foundToken.createdAt,
      revoked: foundToken.revoked,
      revokedAt: foundToken.revokedAt,
      expiresAt: foundToken.expiresAt,
      userId: foundToken.userId,
    });

    return output;
  }
}
