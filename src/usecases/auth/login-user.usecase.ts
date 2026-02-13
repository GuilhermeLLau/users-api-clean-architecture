import { UserGateway } from "../../domain/user/gateway/user.gateway";
import { PasswordHasher } from "../security/password-hasher";
import { TokenService } from "../security/token-service";
import { Usecase } from "../usecase";

export type LoginUserInputDTO = {
  email: string;
  password: string;
};
export type LoginUserOutputDTO = {
  token: string;
};

export class LoginUserUsecase implements Usecase<
  LoginUserInputDTO,
  LoginUserOutputDTO
> {
  private constructor(
    private readonly userGateway: UserGateway,
    private readonly tokenService: TokenService,
    private readonly passwordHash: PasswordHasher,
  ) {}

  public static build(
    userGateway: UserGateway,
    tokenService: TokenService,
    passwordHash: PasswordHasher,
  ) {
    return new LoginUserUsecase(userGateway, tokenService, passwordHash);
  }

  public async execute(input: LoginUserInputDTO): Promise<LoginUserOutputDTO> {
    const user = await this.userGateway.findByEmail(input.email);

    if (!user) throw new Error("User not found");

    const ok = await this.passwordHash.compare(input.password, user.password);

    if (!ok) throw new Error("Invalid credentials");

    const token = await this.tokenService.sign({
      sub: user.id,
      role: user.role,
    });

    return { token };
  }
}
