import { JwtTokenService } from "../../infra/cryptography/jwt-token-service";

type SharedDeps = { prisma: any };

export type SharedContainer = {
  prisma: any;
  tokenService: JwtTokenService;
};

export function makeSharedContainer(deps: SharedDeps): SharedContainer {
  const jwtSecret = process.env.JWT_TOKEN_SECRET;
  if (!jwtSecret) throw new Error("JWT_TOKEN_SECRET not defined");

  const jwtRefreshSecret = process.env.JWT_REFRESH_TOKEN_SECRET;
  if (!jwtRefreshSecret)
    throw new Error("JWT_REFRESH_TOKEN_SECRET not defined");

  const tokenService = new JwtTokenService(jwtSecret, jwtRefreshSecret);

  return {
    prisma: deps.prisma,
    tokenService,
  };
}
