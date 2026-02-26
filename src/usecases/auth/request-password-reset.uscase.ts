import { PasswordResetToken } from "../../domain/passwordToken/entity/passwordToken";
import { PasswordResetTokenGateway } from "../../domain/passwordToken/gateway/passwordToken.gateway";
import { IMailProvider } from "../../domain/shared/mail/mail.gateway";
import { UserGateway } from "../../domain/user/gateway/user.gateway";
import { resetPasswordEmailTemplate } from "../notifications/email/reset-password-request.emai.template";
import { TokenGenerator } from "../security/token-generator";
import { TokenHasher } from "../security/token-hasher";
import { Usecase } from "../usecase";

type PasswordResetTokenInputDTO = {
  email: string;
};
type PasswordResetTokenOutputDTO = {
  id: string;
  token: string;
  userId: string;
};

export class RequestPasswordResetUsecase implements Usecase<
  PasswordResetTokenInputDTO,
  PasswordResetTokenOutputDTO
> {
  private constructor(
    private readonly userGateway: UserGateway,
    private readonly tokenGenerator: TokenGenerator,
    private readonly tokenHasher: TokenHasher,
    private readonly passwordResetTokenGateway: PasswordResetTokenGateway,
    private readonly mailProvider: IMailProvider,
  ) {}

  public static build(
    userGateway: UserGateway,
    tokenGenerator: TokenGenerator,
    tokenHasher: TokenHasher,
    passwordResetTokenGateway: PasswordResetTokenGateway,
    mailProvider: IMailProvider,
  ) {
    return new RequestPasswordResetUsecase(
      userGateway,
      tokenGenerator,
      tokenHasher,
      passwordResetTokenGateway,
      mailProvider,
    );
  }

  public async execute(
    input: PasswordResetTokenInputDTO,
  ): Promise<PasswordResetTokenOutputDTO> {
    const user = await this.userGateway.findByEmail(input.email);
    if (!user) throw new Error("User not found");

    const tokenRaw = await this.tokenGenerator.generateResetPasswordToken();
    const tokenHash = await this.tokenHasher.hash(tokenRaw);

    const resetToken = PasswordResetToken.build(tokenHash, user.id);
    await this.passwordResetTokenGateway.create(resetToken);

    try {
      const mail = resetPasswordEmailTemplate({
        name: user.name,
        token: tokenRaw,
      });

      await this.mailProvider.sendMail({
        to: user.email,
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
      });
    } catch (err) {
      throw new Error("Internal server error");
    }

    const output = this.presentOutput(resetToken);

    return output;
  }

  private presentOutput(
    passwordResetToken: PasswordResetToken,
  ): PasswordResetTokenOutputDTO {
    const output: PasswordResetTokenOutputDTO = {
      id: passwordResetToken.id,
      token: passwordResetToken.tokenHash,
      userId: passwordResetToken.userId,
    };

    return output;
  }
}
