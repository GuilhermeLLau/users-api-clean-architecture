export type RateLimitResult = {
  allowed: boolean;
  retryAfterMs?: number;
};

export interface RateLimiterGateway {
  consume(key: string, windowMs: number): Promise<RateLimitResult>;
}
