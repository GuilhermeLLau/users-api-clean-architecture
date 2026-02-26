import { RateLimiterGateway } from "../../domain/ratelimiter/gateway/rate-limiter.gateway";
import { IMailProvider } from "../../domain/shared/mail/mail.gateway";
import { BcryptPasswordHasher } from "../../infra/cryptography/bcrypt-password-hasher";
import { CryptoTokenGenerator } from "../../infra/cryptography/crypto-refresh-token-generator";
import { JwtTokenService } from "../../infra/cryptography/jwt-token-service";
import { Sha256TokenHasher } from "../../infra/cryptography/sha256-token-hasher";
import { NodeMailerProvider } from "../../infra/mail/nodemailer/nodemailer.provider";
import { RedisRateLimiter } from "../../infra/ratelimiter/redis/redis.ratelimiter";
import { makeRedisClient } from "../../package/redis/redis";
import { PasswordHasher } from "../../usecases/security/password-hasher";
import { TokenGenerator } from "../../usecases/security/token-generator";
import { TokenHasher } from "../../usecases/security/token-hasher";
import { TokenService } from "../../usecases/security/token-service";
import "dotenv/config";

type SharedDeps = { prisma: any };

export type SharedContainer = {
  prisma: any;
  tokenService: TokenService;
  tokenHasher: TokenHasher;
  passwordHasher: PasswordHasher;
  mailProvider: IMailProvider;
  tokenGenerator: TokenGenerator;
  ratelimiter: RateLimiterGateway;
};

export async function makeSharedContainer(
  deps: SharedDeps,
): Promise<SharedContainer> {
  const jwtSecret = process.env.JWT_TOKEN_SECRET;
  if (!jwtSecret) throw new Error("JWT_TOKEN_SECRET not defined");

  const jwtRefreshSecret = process.env.JWT_REFRESH_TOKEN_SECRET;
  if (!jwtRefreshSecret)
    throw new Error("JWT_REFRESH_TOKEN_SECRET not defined");

  const tokenService = new JwtTokenService(jwtSecret, jwtRefreshSecret);

  const pepper = process.env.REFRESH_TOKEN_PEPPER || "123";

  const redis = await makeRedisClient(process.env.REDIS_URL!);
  const ratelimiter = RedisRateLimiter.build(redis);

  const passwordHasher = new BcryptPasswordHasher();

  const tokenHasher = new Sha256TokenHasher(pepper);

  const tokenGenerator = CryptoTokenGenerator.build();

  const mailProvider: IMailProvider = NodeMailerProvider.build({
    host: process.env.MAIL_HOST!,
    port: Number(process.env.MAIL_PORT!),
    user: process.env.MAIL_USER!,
    pass: process.env.MAIL_PASS!,
    from: process.env.MAIL_FROM!,
    secure: false,
  });

  return {
    prisma: deps.prisma,
    tokenService,
    tokenHasher,
    passwordHasher,
    mailProvider,
    tokenGenerator,
    ratelimiter,
  };
}
