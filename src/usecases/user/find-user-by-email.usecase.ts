import { User, UserRole } from "../../domain/user/entity/user";
import { UserGateway } from "../../domain/user/gateway/user.gateway";
import { Usecase } from "../usecase";

export type FindUserByEmailInputDTO = {
  email: string;
};

export type FindUserByEmailOutputDTO = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
};

export class FindUserByEmailUsecase implements Usecase<
  FindUserByEmailInputDTO,
  FindUserByEmailOutputDTO
> {
  private constructor(private readonly useGateway: UserGateway) {}

  public static build(useGateway: UserGateway) {
    return new FindUserByEmailUsecase(useGateway);
  }

  public async execute(
    input: FindUserByEmailInputDTO,
  ): Promise<FindUserByEmailOutputDTO> {
    const user = await this.useGateway.findByEmail(input.email);

    const output = this.presentOutput(user);

    return output;
  }

  private presentOutput(user: User): FindUserByEmailOutputDTO {
    const output: FindUserByEmailOutputDTO = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return output;
  }
}
