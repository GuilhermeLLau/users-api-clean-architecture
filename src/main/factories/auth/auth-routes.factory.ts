import { LoginUserRoute } from "../../../infra/api/express/auth/login-user.route.express";
import { Route } from "../../../infra/api/express/routes/routes";
import { BcryptPasswordHasher } from "../../../infra/cryptography/bcrypt-password-hasher";
import { JwtTokenService } from "../../../infra/cryptography/jwt-token-service";
import { UserRepositoryPrisma } from "../../../infra/repositories/user/prisma/user.repository.prisma";
import { LoginUserUsecase } from "../../../usecases/auth/login-user.usecase";

export function makeAuthRoutes(deps: { prisma: any }): Route[] {
  const userRepository = UserRepositoryPrisma.build(deps.prisma);

  const jwtSecret = process.env.JWT_TOKEN_SECRET;
  if (!jwtSecret) throw new Error("JWT_TOKEN_SECRET not defined");
  const tokenService = new JwtTokenService(jwtSecret);
  const passwordHasher = new BcryptPasswordHasher();

  const loginUserUsecase = LoginUserUsecase.build(
    userRepository,
    tokenService,
    passwordHasher,
  );

  const loginUserRoute = LoginUserRoute.create(loginUserUsecase);

  return [loginUserRoute];
}
