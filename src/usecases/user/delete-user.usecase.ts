import { User, UserRole } from "../../domain/user/entity/user";
import { UserGateway } from "../../domain/user/gateway/user.gateway";
import { PasswordHasher } from "../security/password-hasher";
import { Usecase } from "../usecase";

export type DeleteUserInputDTO = {
  id: string;
};

export type DeleteUserOutputDTO = void;

export class DeleteUserUsecase implements Usecase<
  DeleteUserInputDTO,
  DeleteUserOutputDTO
> {
  private constructor(private readonly userGateway: UserGateway) {}

  public static build(userGateway: UserGateway) {
    return new DeleteUserUsecase(userGateway);
  }

  public async execute(
    input: DeleteUserInputDTO,
  ): Promise<DeleteUserOutputDTO> {
    try {
      await this.userGateway.delete(input.id);
    } catch (err) {
      throw new Error("Erro");
    }
  }

  private presentOutput(): DeleteUserOutputDTO {}
}
