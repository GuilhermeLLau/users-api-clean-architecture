import { User, UserRole } from "../../domain/user/entity/user";
import { UserGateway } from "../../domain/user/gateway/user.gateway";
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
  private constructor(private readonly userGateway: UserGateway) {}

  public static build(userGateway: UserGateway) {
    return new CreateUserUsecase(userGateway);
  }

  public async execute(
    input: CreateUserInputDTO,
  ): Promise<CreateUserOutputDTO> {
    const user = User.build(
      input.name,
      input.email,
      input.password,
      input.role,
    );

    await this.userGateway.create(user);

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
