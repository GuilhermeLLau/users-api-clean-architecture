import { LoginUserRoute } from "../../../infra/api/express/auth/login-user.route.express";
import { DeleteRefreshTokenRoute } from "../../../infra/api/express/routes/refreshToken/delete-refresh-token.route.express";
import { RefreshSessionTokenRoute } from "../../../infra/api/express/routes/refreshToken/refresh-session-token.route.express";
import { RevokeRefreshTokenRoute } from "../../../infra/api/express/routes/refreshToken/revoke-refresh-token.route.express";
import { Route } from "../../../infra/api/express/routes/routes";
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
      http.auth.isAdmin,
    ]),
    RevokeRefreshTokenRoute.create(auth.useCases.revokeRefreshSession, [
      http.auth.isAdmin,
    ]),
  ];
}
