import { IMailProvider } from "../../domain/shared/mail/mail.gateway";
import { User, UserRole } from "../../domain/user/entity/user";
import { UserGateway } from "../../domain/user/gateway/user.gateway";
import { welcomeUserEmailTemplate } from "../notifications/email/welcome-user.email.template";
import { PasswordHasher } from "../security/password-hasher";
import { Usecase } from "../usecase";

export type CreateUserInputDTO = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export type CreateUserOutputDTO = {
  id: string;
  name: string;
};

export class CreateUserUsecase implements Usecase<
  CreateUserInputDTO,
  CreateUserOutputDTO
> {
  private constructor(
    private readonly userGateway: UserGateway,
    private readonly passwordHasher: PasswordHasher,
    private readonly mailProvider: IMailProvider,
  ) {}

  public static build(
    userGateway: UserGateway,
    passwordHasher: PasswordHasher,
    mailProvider: IMailProvider,
  ) {
    return new CreateUserUsecase(userGateway, passwordHasher, mailProvider);
  }

  public async execute(
    input: CreateUserInputDTO,
  ): Promise<CreateUserOutputDTO> {
    const hashPassword = await this.passwordHasher.hash(input.password);
    const user = User.build(input.name, input.email, hashPassword, input.role);

    await this.userGateway.create(user);

    try {
      const mail = welcomeUserEmailTemplate({ name: user.name });
      await this.mailProvider.sendMail({
        to: user.email,
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
      });
    } catch (err) {
      console.log(err);
    }

    const output = this.presentOutput(user);

    return output;
  }

  private presentOutput(user: User): CreateUserOutputDTO {
    const output: CreateUserOutputDTO = {
      id: user.id,
      name: user.name,
    };

    return output;
  }
}
