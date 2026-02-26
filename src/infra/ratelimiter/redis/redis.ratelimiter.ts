import {
  RateLimiterGateway,
  RateLimitResult,
} from "../../../domain/ratelimiter/gateway/rate-limiter.gateway";
import { RedisClient } from "../../../package/redis/redis";

export class RedisRateLimiter implements RateLimiterGateway {
  private constructor(private readonly redis: RedisClient) {}

  public static build(redis: RedisClient) {
    return new RedisRateLimiter(redis);
  }

  async consume(key: string, windowMs: number): Promise<RateLimitResult> {
    const redisKey = `ratelimit:${key}`;

    const created = await this.redis.set(redisKey, "1", {
      NX: true,
      PX: windowMs,
    });
    if (created === "OK") {
      return { allowed: true };
    }

    const ttl = await this.redis.pTTL(redisKey);

    return {
      allowed: false,
      retryAfterMs: ttl > 0 ? ttl : windowMs,
    };
  }
}
