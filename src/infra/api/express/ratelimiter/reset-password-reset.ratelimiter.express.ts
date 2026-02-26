import { NextFunction, Request, Response } from "express";
import { RateLimiterGateway } from "../../../../domain/ratelimiter/gateway/rate-limiter.gateway";

export const resetPasswordRequestRateLimiter =
  (limiter: RateLimiterGateway) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const emailRaw = req.body?.email;

      if (!emailRaw || typeof emailRaw !== "string") return next();

      const email = emailRaw.trim().toLowerCase();
      const key = `pwdreset:${email}`;

      const result = await limiter.consume(key, 60_000); // 1 minuto

      if (!result.allowed) {
        const retrySeconds = Math.ceil((result.retryAfterMs ?? 60_000) / 1000);
        res.setHeader("Retry-After", String(retrySeconds));
        return res.status(429).json({
          message: "Too many password reset requests. Try again later.",
          retryAfterSeconds: retrySeconds,
        });
      }

      return next();
    } catch (err) {
      return next(err);
    }
  };
