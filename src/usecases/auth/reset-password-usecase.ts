import { PasswordResetTokenGateway } from "../../domain/passwordToken/gateway/passwordToken.gateway";
import { UserGateway } from "../../domain/user/gateway/user.gateway";
import { PasswordHasher } from "../security/password-hasher";
import { TokenHasher } from "../security/token-hasher";
import { Usecase } from "../usecase";

type ResetPasswordInputDTO = {
  token: string;
  password: string;
};
type ResetPasswordOutputDTO = void;

export class ResetPasswordUsecase implements Usecase<
  ResetPasswordInputDTO,
  ResetPasswordOutputDTO
> {
  private constructor(
    private readonly resetPasswordTokenRepository: PasswordResetTokenGateway,
    private readonly tokenHasher: TokenHasher,
    private readonly userRepository: UserGateway,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  public static build(
    resetPasswordTokenRepository: PasswordResetTokenGateway,
    tokenHasher: TokenHasher,
    userRepository: UserGateway,
    passwordHasher: PasswordHasher,
  ) {
    return new ResetPasswordUsecase(
      resetPasswordTokenRepository,
      tokenHasher,
      userRepository,
      passwordHasher,
    );
  }

  public async execute(
    input: ResetPasswordInputDTO,
  ): Promise<ResetPasswordOutputDTO> {
    const tokenHash = await this.tokenHasher.hash(input.token);

    const foundToken =
      await this.resetPasswordTokenRepository.findByTokenHash(tokenHash);

    if (!foundToken) throw { type: "validation", message: "Invalid Code" };
    if (foundToken.used) throw new Error("Invalid Token");
    if (foundToken.expiresAt < new Date())
      throw { type: "validation", message: "Code expired" };

    const user = await this.userRepository.findById(foundToken.userId);

    if (!user) throw new Error("User not found");

    const passwordHash = await this.passwordHasher.hash(input.password);

    await this.userRepository.updatePassword(user.id, passwordHash);

    await this.resetPasswordTokenRepository.markAsUsed(foundToken.tokenHash);
  }
}
