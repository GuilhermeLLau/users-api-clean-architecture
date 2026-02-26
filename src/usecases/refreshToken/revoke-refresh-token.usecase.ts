import { RefreshTokenGateway } from "../../domain/refreshToken/gateway/refreshToken.gateway";
import { TokenHasher } from "../security/token-hasher";
import { Usecase } from "../usecase";

type RevokeRefreshTokenInputDTO = {
  refreshToken: string;
};

type RevokeRefreshTokenOutputDTO = void;

export class RevokeRefreshTokenUsecase implements Usecase<
  RevokeRefreshTokenInputDTO,
  RevokeRefreshTokenOutputDTO
> {
  private constructor(
    private readonly refreshTokenGateway: RefreshTokenGateway,
    private readonly tokenHasher: TokenHasher,
  ) {}

  public static build(
    refreshTokenGateway: RefreshTokenGateway,
    tokenHasher: TokenHasher,
  ) {
    return new RevokeRefreshTokenUsecase(refreshTokenGateway, tokenHasher);
  }

  public async execute(input: RevokeRefreshTokenInputDTO): Promise<void> {
    try {
      const tokenHashed = await this.tokenHasher.hash(input.refreshToken);
      await this.refreshTokenGateway.revokeToken(tokenHashed);
    } catch (err) {
      throw new Error("Internal server error");
    }
  }
}
