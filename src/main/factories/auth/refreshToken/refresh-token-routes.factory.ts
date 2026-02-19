import { validateRequest } from "../../../../infra/api/express/middlewares/validate-request.middleware";
import { DeleteRefreshTokenRoute } from "../../../../infra/api/express/routes/refreshToken/delete-refresh-token.route.express";
import { RefreshSessionTokenRoute } from "../../../../infra/api/express/routes/refreshToken/refresh-session-token.route.express";
import { RevokeRefreshTokenRoute } from "../../../../infra/api/express/routes/refreshToken/revoke-refresh-token.route.express";
import { Route } from "../../../../infra/api/express/routes/routes";
import { paramsIdValidatorSchema } from "../../../../infra/api/express/validators/params/params-id-validator.schema";
import { CryptoRefreshTokenGenerator } from "../../../../infra/cryptography/crypto-refresh-token-generator";
import { JwtTokenService } from "../../../../infra/cryptography/jwt-token-service";
import { Sha256TokenHasher } from "../../../../infra/cryptography/sha256-token-hasher";
import { RefreshTokenRepositoryPrisma } from "../../../../infra/repositories/refreshToken/prisma/refresh-token.prisma";
import { UserRepositoryPrisma } from "../../../../infra/repositories/user/prisma/user.repository.prisma";
import { DeleteRefreshTokenUsecase } from "../../../../usecases/refreshToken/delete-refresh-token.usecase";
import { RefreshSessionUsecase } from "../../../../usecases/refreshToken/refresh-session.usecase";
import { RevokeRefreshTokenUsecase } from "../../../../usecases/refreshToken/revoke-refresh-token.usecase";

export function makeRefreshTokenRoutes(deps: { prisma: any }): Route[] {
  const validateParamsId = validateRequest({ params: paramsIdValidatorSchema });

  const refreshTokenRepository = RefreshTokenRepositoryPrisma.build(
    deps.prisma,
  );

  const jwtSecret = process.env.JWT_TOKEN_SECRET;
  if (!jwtSecret) throw new Error("JWT_TOKEN_SECRET not defined");

  const jwtRefreshSecret = process.env.JWT_REFRESH_TOKEN_SECRET;
  if (!jwtRefreshSecret)
    throw new Error("JWT_REFRESH_TOKEN_SECRET not defined");

  const pepper = process.env.REFRESH_TOKEN_PEPPER || "123";

  const tokenHasher = Sha256TokenHasher.build(pepper);
  const refreshTokenGenerator = CryptoRefreshTokenGenerator.build();
  const userRepository = UserRepositoryPrisma.build(deps.prisma);
  const tokenService = new JwtTokenService(jwtSecret, jwtRefreshSecret);

  const refreshSessionTokenUsecase = RefreshSessionUsecase.build(
    tokenService,
    refreshTokenRepository,
    userRepository,
    tokenHasher,
    refreshTokenGenerator,
  );

  const refreshSessionTokenRoute = RefreshSessionTokenRoute.create(
    refreshSessionTokenUsecase,
  );

  const deleteRefreshTokenUsecase = DeleteRefreshTokenUsecase.build(
    refreshTokenRepository,
  );
  const deleteRefreshTokenRoute = DeleteRefreshTokenRoute.create(
    deleteRefreshTokenUsecase,
    [validateParamsId],
  );

  const revokeRefreshTokenUsecase = RevokeRefreshTokenUsecase.build(
    refreshTokenRepository,
  );
  const revokeRefreshTokenRoute = RevokeRefreshTokenRoute.create(
    revokeRefreshTokenUsecase,
    [validateParamsId],
  );

  return [
    deleteRefreshTokenRoute,
    revokeRefreshTokenRoute,
    refreshSessionTokenRoute,
  ];
}
