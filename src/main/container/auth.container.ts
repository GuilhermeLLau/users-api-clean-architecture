import { PasswordResetTokenRepositoryPrisma } from "../../infra/repositories/passwordResetToken/prisma/password-reset-token.prisma";
import { RefreshTokenRepositoryPrisma } from "../../infra/repositories/refreshToken/prisma/refresh-token.prisma";
import { UserRepositoryPrisma } from "../../infra/repositories/user/prisma/user.repository.prisma";
import { LoginUserUsecase } from "../../usecases/auth/login-user.usecase";
import { RequestPasswordResetUsecase } from "../../usecases/auth/request-password-reset.uscase";
import { ResetPasswordUsecase } from "../../usecases/auth/reset-password-usecase";
import { CreateRefreshTokenUsecase } from "../../usecases/refreshToken/create-refresh-token.usecase";
import { DeleteRefreshTokenUsecase } from "../../usecases/refreshToken/delete-refresh-token.usecase";
import { RefreshSessionUsecase } from "../../usecases/refreshToken/refresh-session.usecase";
import { RevokeRefreshTokenUsecase } from "../../usecases/refreshToken/revoke-refresh-token.usecase";
import { SharedContainer } from "./shared.container";

type AuthDeps = { shared: SharedContainer };

type AuthContainer = {
  useCases: {
    loginUsecase: LoginUserUsecase;
    refreshSessionUsecase: RefreshSessionUsecase;
    revokeRefreshSessionUsecase: RevokeRefreshTokenUsecase;
    createRefreshTokenUsecase: CreateRefreshTokenUsecase;
    deleteRefreshTokenUsecase: DeleteRefreshTokenUsecase;
    requestResetPasswordUsecase: RequestPasswordResetUsecase;
    resetPasswordUsecase: ResetPasswordUsecase;
  };
};

export function makeAuthContainer(deps: AuthDeps): AuthContainer {
  const userRepository = UserRepositoryPrisma.build(deps.shared.prisma);
  const refreshTokenRepository = RefreshTokenRepositoryPrisma.build(
    deps.shared.prisma,
  );
  const passwordResetTokenRepository = PasswordResetTokenRepositoryPrisma.build(
    deps.shared.prisma,
  );

  const createRefreshTokenUsecase = CreateRefreshTokenUsecase.build(
    refreshTokenRepository,
  );

  const revokeRefreshSessionUsecase = RevokeRefreshTokenUsecase.build(
    refreshTokenRepository,
    deps.shared.tokenHasher,
  );

  const deleteRefreshTokenUsecase = DeleteRefreshTokenUsecase.build(
    refreshTokenRepository,
    deps.shared.tokenHasher,
  );

  const loginUsecase = LoginUserUsecase.build(
    userRepository,
    deps.shared.tokenService,
    deps.shared.passwordHasher,
    createRefreshTokenUsecase,
    deps.shared.tokenHasher,
    deps.shared.tokenGenerator,
  );

  const refreshSessionUsecase = RefreshSessionUsecase.build(
    deps.shared.tokenService,
    refreshTokenRepository,
    userRepository,
    deps.shared.tokenHasher,
    deps.shared.tokenGenerator,
  );

  const requestResetPasswordUsecase = RequestPasswordResetUsecase.build(
    userRepository,
    deps.shared.tokenGenerator,
    deps.shared.tokenHasher,
    passwordResetTokenRepository,
    deps.shared.mailProvider,
  );

  const resetPasswordUsecase = ResetPasswordUsecase.build(
    passwordResetTokenRepository,
    deps.shared.tokenHasher,
    userRepository,
    deps.shared.passwordHasher,
  );

  return {
    useCases: {
      loginUsecase,
      refreshSessionUsecase,
      revokeRefreshSessionUsecase,
      createRefreshTokenUsecase,
      deleteRefreshTokenUsecase,
      requestResetPasswordUsecase,
      resetPasswordUsecase,
    },
  };
}
