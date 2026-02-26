import { UserGateway } from "../../domain/user/gateway/user.gateway";
import { CreateRefreshTokenUsecase } from "../refreshToken/create-refresh-token.usecase";
import { PasswordHasher } from "../security/password-hasher";
import { TokenGenerator } from "../security/token-generator";
import { TokenHasher } from "../security/token-hasher";
import { TokenService } from "../security/token-service";
import { Usecase } from "../usecase";

export type LoginUserInputDTO = {
  email: string;
  password: string;
};
export type LoginUserOutputDTO = {
  token: string;
  refreshToken: string;
};

export class LoginUserUsecase implements Usecase<
  LoginUserInputDTO,
  LoginUserOutputDTO
> {
  private constructor(
    private readonly userGateway: UserGateway,
    private readonly tokenService: TokenService,
    private readonly passwordHash: PasswordHasher,
    private readonly createRefreshTokenUsecase: CreateRefreshTokenUsecase,
    private readonly tokenHasher: TokenHasher,
    private readonly tokenGenerator: TokenGenerator,
  ) {}

  public static build(
    userGateway: UserGateway,
    tokenService: TokenService,
    passwordHash: PasswordHasher,
    createRefreshTokenUsecase: CreateRefreshTokenUsecase,
    tokenHasher: TokenHasher,
    tokenGenerator: TokenGenerator,
  ) {
    return new LoginUserUsecase(
      userGateway,
      tokenService,
      passwordHash,
      createRefreshTokenUsecase,
      tokenHasher,
      tokenGenerator,
    );
  }

  public async execute(input: LoginUserInputDTO): Promise<LoginUserOutputDTO> {
    const user = await this.userGateway.findByEmail(input.email);

    if (!user) throw new Error("User not found");

    const ok = await this.passwordHash.compare(
      input.password,
      user.passwordHash,
    );

    if (!ok) throw new Error("Invalid credentials");

    const refreshRaw = await this.tokenGenerator.generateRandomToken();
    const tokenHash = await this.tokenHasher.hash(refreshRaw);

    const accessToken = await this.tokenService.generateAccessToken({
      sub: user.id,
      role: user.role,
    });

    const refreshTokenData = {
      token: tokenHash,
      userId: user.id,
    };

    await this.createRefreshTokenUsecase.execute(refreshTokenData);

    return { token: accessToken, refreshToken: refreshRaw };
  }
}
