import { LoginUserRoute } from "../../../infra/api/express/routes/auth/login-user.route.express";
import { RequestPasswordResetRoute } from "../../../infra/api/express/routes/auth/reset-password-request.route.express";
import { ResetPasswordRoute } from "../../../infra/api/express/routes/auth/reset-password.route.express";
import { resetPasswordRequestRateLimiter } from "../../../infra/api/express/ratelimiter/reset-password-reset.ratelimiter.express";
import { DeleteRefreshTokenRoute } from "../../../infra/api/express/routes/refreshToken/delete-refresh-token.route.express";
import { RefreshSessionTokenRoute } from "../../../infra/api/express/routes/refreshToken/refresh-session-token.route.express";
import { RevokeRefreshTokenRoute } from "../../../infra/api/express/routes/refreshToken/revoke-refresh-token.route.express";
import { Route } from "../../../infra/api/express/routes/routes";
import { makeAuthContainer } from "../../container/auth.container";
import { makeHttpContainer } from "../../container/http.container";
import { SharedContainer } from "../../container/shared.container";

export function makeAuthRoutes(deps: { shared: SharedContainer }): Route[] {
  const http = makeHttpContainer({ shared: deps.shared });
  const auth = makeAuthContainer({ shared: deps.shared });

  return [
    LoginUserRoute.create(auth.useCases.loginUsecase, [
      http.validate.loginUserBody,
    ]),
    RefreshSessionTokenRoute.create(auth.useCases.refreshSessionUsecase),
    DeleteRefreshTokenRoute.create(auth.useCases.deleteRefreshTokenUsecase, [
      http.auth.isAdmin,
    ]),
    RevokeRefreshTokenRoute.create(auth.useCases.revokeRefreshSessionUsecase, [
      http.auth.isAdmin,
    ]),
    RequestPasswordResetRoute.create(
      auth.useCases.requestResetPasswordUsecase,
      [
        http.auth.resetPasswordRequest,
        resetPasswordRequestRateLimiter(deps.shared.ratelimiter),
      ],
    ),
    ResetPasswordRoute.create(auth.useCases.resetPasswordUsecase, [
      http.auth.resetPasswordBody,
    ]),
  ];
}
