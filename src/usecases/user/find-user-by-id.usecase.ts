import { User, UserRole } from "../../domain/user/entity/user";
import { UserGateway } from "../../domain/user/gateway/user.gateway";
import { Usecase } from "../usecase";

export type FindUserByIdInputDTO = {
  id: string;
};

export type FindUserByIdOutputDTO = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
};

export class FindUserByIdUsecase implements Usecase<
  FindUserByIdInputDTO,
  FindUserByIdOutputDTO
> {
  private constructor(private readonly useGateway: UserGateway) {}

  public static build(useGateway: UserGateway) {
    return new FindUserByIdUsecase(useGateway);
  }

  public async execute(
    input: FindUserByIdInputDTO,
  ): Promise<FindUserByIdOutputDTO> {
    const user = await this.useGateway.findById(input.id);

    const output = this.presentOutput(user);

    return output;
  }

  private presentOutput(user: User): FindUserByIdOutputDTO {
    const output: FindUserByIdOutputDTO = {
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
