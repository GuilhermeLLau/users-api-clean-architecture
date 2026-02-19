import { RefreshTokenGateway } from "../../domain/user/gateway/refreshToken.gateway";
import { Usecase } from "../usecase";

type DeleteRefreshTokenInputDTO = {
  id: string;
};

type DeleteRefreshTokenOutputDTO = void;

export class DeleteRefreshTokenUsecase implements Usecase<
  DeleteRefreshTokenInputDTO,
  DeleteRefreshTokenOutputDTO
> {
  private constructor(
    private readonly refreshTokenGateway: RefreshTokenGateway,
  ) {}

  public static build(refreshTokenGateway: RefreshTokenGateway) {
    return new DeleteRefreshTokenUsecase(refreshTokenGateway);
  }

  public async execute(input: DeleteRefreshTokenInputDTO): Promise<void> {
    try {
      await this.refreshTokenGateway.deleteToken(input.id);
    } catch (err) {
      throw new Error("Invalid Id");
    }
  }
}
