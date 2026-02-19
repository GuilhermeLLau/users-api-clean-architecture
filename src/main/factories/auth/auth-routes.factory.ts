import { LoginUserRoute } from "../../../infra/api/express/auth/login-user.route.express";
import { Route } from "../../../infra/api/express/routes/routes";
import { BcryptPasswordHasher } from "../../../infra/cryptography/bcrypt-password-hasher";
import { CryptoRefreshTokenGenerator } from "../../../infra/cryptography/crypto-refresh-token-generator";
import { JwtTokenService } from "../../../infra/cryptography/jwt-token-service";
import { Sha256TokenHasher } from "../../../infra/cryptography/sha256-token-hasher";
import { RefreshTokenRepositoryPrisma } from "../../../infra/repositories/refreshToken/prisma/refresh-token.prisma";
import { UserRepositoryPrisma } from "../../../infra/repositories/user/prisma/user.repository.prisma";
import { LoginUserUsecase } from "../../../usecases/auth/login-user.usecase";
import { CreateRefreshTokenUsecase } from "../../../usecases/refreshToken/create-refresh-token.usecase";

export function makeAuthRoutes(deps: { prisma: any }): Route[] {
  const userRepository = UserRepositoryPrisma.build(deps.prisma);
  const refreshTokenRepository = RefreshTokenRepositoryPrisma.build(
    deps.prisma,
  );

  const jwtSecret = process.env.JWT_TOKEN_SECRET;
  if (!jwtSecret) throw new Error("JWT_TOKEN_SECRET not defined");

  const jwtRefreshSecret = process.env.JWT_REFRESH_TOKEN_SECRET;
  if (!jwtRefreshSecret)
    throw new Error("JWT_REFRESH_TOKEN_SECRET not defined");

  const pepper = process.env.REFRESH_TOKEN_PEPPER || "123";

  const tokenService = new JwtTokenService(jwtSecret, jwtRefreshSecret);
  const createRefreshTokenUsecase = CreateRefreshTokenUsecase.build(
    refreshTokenRepository,
  );
  const passwordHasher = new BcryptPasswordHasher();

  const tokenHasher = Sha256TokenHasher.build(pepper);
  const refreshTokenGenerator = CryptoRefreshTokenGenerator.build();

  const loginUserUsecase = LoginUserUsecase.build(
    userRepository,
    tokenService,
    passwordHasher,
    createRefreshTokenUsecase,
    tokenHasher,
    refreshTokenGenerator,
  );

  const loginUserRoute = LoginUserRoute.create(loginUserUsecase);

  return [loginUserRoute];
}
