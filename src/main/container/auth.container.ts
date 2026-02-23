import { BcryptPasswordHasher } from "../../infra/cryptography/bcrypt-password-hasher";
import { CryptoRefreshTokenGenerator } from "../../infra/cryptography/crypto-refresh-token-generator";
import { Sha256TokenHasher } from "../../infra/cryptography/sha256-token-hasher";
import { RefreshTokenRepositoryPrisma } from "../../infra/repositories/refreshToken/prisma/refresh-token.prisma";
import { UserRepositoryPrisma } from "../../infra/repositories/user/prisma/user.repository.prisma";
import { LoginUserUsecase } from "../../usecases/auth/login-user.usecase";
import { CreateRefreshTokenUsecase } from "../../usecases/refreshToken/create-refresh-token.usecase";
import { DeleteRefreshTokenUsecase } from "../../usecases/refreshToken/delete-refresh-token.usecase";
import { RefreshSessionUsecase } from "../../usecases/refreshToken/refresh-session.usecase";
import { RevokeRefreshTokenUsecase } from "../../usecases/refreshToken/revoke-refresh-token.usecase";
import { PasswordHasher } from "../../usecases/security/password-hasher";
import { RefreshTokenGenerator } from "../../usecases/security/refresh-token-generator";
import { TokenHasher } from "../../usecases/security/token-hasher";
import { TokenService } from "../../usecases/security/token-service";

type AuthContainer = {
  services: {
    passwordHasher: PasswordHasher;
    tokenHasher: TokenHasher;
    refreshTokenGenerator: RefreshTokenGenerator;
  };
  useCases: {
    login: LoginUserUsecase;
    refreshSession: RefreshSessionUsecase;
    revokeRefreshSession: RevokeRefreshTokenUsecase;
    createRefreshToken: CreateRefreshTokenUsecase;
    deleteRefreshToken: DeleteRefreshTokenUsecase;
  };
};

export function makeAuthContainer(deps: {
  prisma: any;
  tokenService: TokenService;
}): AuthContainer {
  const userRepository = UserRepositoryPrisma.build(deps.prisma);
  const refreshTokenRepository = RefreshTokenRepositoryPrisma.build(
    deps.prisma,
  );

  const pepper = process.env.REFRESH_TOKEN_PEPPER || "123";

  const passwordHasher = new BcryptPasswordHasher();
  const tokenHasher = new Sha256TokenHasher(pepper);
  const refreshTokenGenerator = CryptoRefreshTokenGenerator.build();

  const createRefreshTokenUsecase = CreateRefreshTokenUsecase.build(
    refreshTokenRepository,
  );

  const revokeRefreshSessionUsecase = RevokeRefreshTokenUsecase.build(
    refreshTokenRepository,
    tokenHasher,
  );

  const deleteRefreshTokenUsecase = DeleteRefreshTokenUsecase.build(
    refreshTokenRepository,
    tokenHasher,
  );

  const loginUsecase = LoginUserUsecase.build(
    userRepository,
    deps.tokenService,
    passwordHasher,
    createRefreshTokenUsecase,
    tokenHasher,
    refreshTokenGenerator,
  );

  const refreshSessionUsecase = RefreshSessionUsecase.build(
    deps.tokenService,
    refreshTokenRepository,
    userRepository,
    tokenHasher,
    refreshTokenGenerator,
  );

  return {
    services: {
      passwordHasher,
      tokenHasher,
      refreshTokenGenerator,
    },
    useCases: {
      login: loginUsecase,
      refreshSession: refreshSessionUsecase,
      revokeRefreshSession: revokeRefreshSessionUsecase,
      createRefreshToken: createRefreshTokenUsecase,
      deleteRefreshToken: deleteRefreshTokenUsecase,
    },
  };
}
