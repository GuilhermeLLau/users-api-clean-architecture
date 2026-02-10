import { UpdateUserDTO } from "../../domain/user/dto/update-user.dto";
import { User, UserRole } from "../../domain/user/entity/user";
import { UserGateway } from "../../domain/user/gateway/user.gateway";
import { Usecase } from "../usecase";

export type UpdateUserInputDTO = {
  id: string;
  name: string;
};

export type UpdateUserOutputDTO = {
  id: string;
  name: string;
};

export class UpdateUserUsecase implements Usecase<
  UpdateUserInputDTO,
  UpdateUserOutputDTO
> {
  private constructor(private readonly userGateway: UserGateway) {}

  public static build(userGateway: UserGateway) {
    return new UpdateUserUsecase(userGateway);
  }

  public async execute(
    input: UpdateUserInputDTO,
  ): Promise<UpdateUserOutputDTO> {
    const data: UpdateUserDTO = { name: input.name };

    const user = await this.userGateway.update(input.id, data);

    return this.presentOutput(user);
  }

  private presentOutput(user: User): UpdateUserOutputDTO {
    return {
      id: user.id,
      name: user.name,
    };
  }
}
