import { RefreshToken } from "../../domain/user/entity/refreshToken";
import { RefreshTokenGateway } from "../../domain/user/gateway/refreshToken.gateway";
import { Usecase } from "../usecase";

type RefreshTokenInputDTO = {
  userId: string;
  token: string;
};
type RefreshTokenOutputDTO = {
  id: string;
  token: string;
  userId: string;
};

export class CreateRefreshTokenUsecase implements Usecase<
  RefreshTokenInputDTO,
  RefreshTokenOutputDTO
> {
  private constructor(
    private readonly refreshTokenGateway: RefreshTokenGateway,
  ) {}

  public static build(refreshTokenGateway: RefreshTokenGateway) {
    return new CreateRefreshTokenUsecase(refreshTokenGateway);
  }

  public async execute(
    input: RefreshTokenInputDTO,
  ): Promise<RefreshTokenOutputDTO> {
    const refreshToken = RefreshToken.build(input.token, input.userId);

    await this.refreshTokenGateway.create(refreshToken);

    const output = this.presentOutput(refreshToken);

    return output;
  }

  private presentOutput(refreshToken: RefreshToken): RefreshTokenOutputDTO {
    const output: RefreshTokenOutputDTO = {
      id: refreshToken.id,
      token: refreshToken.tokenHash,
      userId: refreshToken.userId,
    };

    return output;
  }
}
