import { LoginUserRoute } from "../../../infra/api/express/auth/login-user.route.express";
import { DeleteRefreshTokenRoute } from "../../../infra/api/express/routes/refreshToken/delete-refresh-token.route.express";
import { RefreshSessionTokenRoute } from "../../../infra/api/express/routes/refreshToken/refresh-session-token.route.express";
import { RevokeRefreshTokenRoute } from "../../../infra/api/express/routes/refreshToken/revoke-refresh-token.route.express";
import { Route } from "../../../infra/api/express/routes/routes";
import { BcryptPasswordHasher } from "../../../infra/cryptography/bcrypt-password-hasher";
import { CryptoRefreshTokenGenerator } from "../../../infra/cryptography/crypto-refresh-token-generator";
import { JwtTokenService } from "../../../infra/cryptography/jwt-token-service";
import { Sha256TokenHasher } from "../../../infra/cryptography/sha256-token-hasher";
import { RefreshTokenRepositoryPrisma } from "../../../infra/repositories/refreshToken/prisma/refresh-token.prisma";
import { UserRepositoryPrisma } from "../../../infra/repositories/user/prisma/user.repository.prisma";
import { LoginUserUsecase } from "../../../usecases/auth/login-user.usecase";
import { CreateRefreshTokenUsecase } from "../../../usecases/refreshToken/create-refresh-token.usecase";
import { makeAuthContainer } from "../../container/auth.container";
import { makeHttpContainer } from "../../container/http.container";
import { makeSharedContainer } from "../../container/shared.container";

export function makeAuthRoutes(deps: { prisma: any }): Route[] {
  const shared = makeSharedContainer(deps);
  const http = makeHttpContainer({ tokenService: shared.tokenService });
  const auth = makeAuthContainer({
    prisma: shared.prisma,
    tokenService: shared.tokenService,
  });

  return [
    LoginUserRoute.create(auth.useCases.login, [http.validate.loginUserBody]),
    RefreshSessionTokenRoute.create(auth.useCases.refreshSession),
    DeleteRefreshTokenRoute.create(auth.useCases.deleteRefreshToken, [
      http.validate.paramsId,
    ]),
    RevokeRefreshTokenRoute.create(auth.useCases.revokeRefreshSession, [
      http.validate.paramsId,
    ]),
  ];
}
