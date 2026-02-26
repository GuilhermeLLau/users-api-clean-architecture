import {
  RateLimiterGateway,
  RateLimitResult,
} from "../../../domain/ratelimiter/gateway/rate-limiter.gateway";
import { PrismaClient } from "../../../generated/prisma/client";

export class PrismaRateLimiter implements RateLimiterGateway {
  private constructor(private readonly prisma: PrismaClient) {}

  static build(prisma: PrismaClient) {
    return new PrismaRateLimiter(prisma);
  }

  async consume(key: string, windowMs: number): Promise<RateLimitResult> {
    const now = new Date();

    const existing = await this.prisma.rateLimit.findUnique({
      where: { key },
    });

    if (existing && existing.expiresAt.getTime() > now.getTime()) {
      return {
        allowed: false,
        retryAfterMs: existing.expiresAt.getTime() - now.getTime(),
      };
    }

    const expiresAt = new Date(now.getTime() + windowMs);

    await this.prisma.rateLimit.upsert({
      where: { key },
      create: { key, expiresAt },
      update: { expiresAt },
    });

    return { allowed: true };
  }
}
