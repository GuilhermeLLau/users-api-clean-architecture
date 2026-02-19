import { RefreshTokenGateway } from "../../domain/user/gateway/refreshToken.gateway";
import { Usecase } from "../usecase";

type RevokeRefreshTokenInputDTO = {
  id: string;
};

type RevokeRefreshTokenOutputDTO = void;

export class RevokeRefreshTokenUsecase implements Usecase<
  RevokeRefreshTokenInputDTO,
  RevokeRefreshTokenOutputDTO
> {
  private constructor(
    private readonly refreshTokenGateway: RefreshTokenGateway,
  ) {}

  public static build(refreshTokenGateway: RefreshTokenGateway) {
    return new RevokeRefreshTokenUsecase(refreshTokenGateway);
  }

  public async execute(input: RevokeRefreshTokenInputDTO): Promise<void> {
    try {
      await this.refreshTokenGateway.revokeToken(input.id);
    } catch (err) {
      throw new Error("Internal server error");
    }
  }
}
