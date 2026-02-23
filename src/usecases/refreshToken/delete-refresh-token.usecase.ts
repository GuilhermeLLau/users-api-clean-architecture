import { RefreshTokenGateway } from "../../domain/user/gateway/refreshToken.gateway";
import { TokenHasher } from "../security/token-hasher";
import { Usecase } from "../usecase";

type DeleteRefreshTokenInputDTO = {
  refreshToken: string;
};

type DeleteRefreshTokenOutputDTO = void;

export class DeleteRefreshTokenUsecase implements Usecase<
  DeleteRefreshTokenInputDTO,
  DeleteRefreshTokenOutputDTO
> {
  private constructor(
    private readonly refreshTokenGateway: RefreshTokenGateway,
    private readonly tokenHasher: TokenHasher,
  ) {}

  public static build(
    refreshTokenGateway: RefreshTokenGateway,
    tokenHasher: TokenHasher,
  ) {
    return new DeleteRefreshTokenUsecase(refreshTokenGateway, tokenHasher);
  }

  public async execute(input: DeleteRefreshTokenInputDTO): Promise<void> {
    try {
      const tokenHashed = await this.tokenHasher.hash(input.refreshToken);
      await this.refreshTokenGateway.deleteToken(tokenHashed);
    } catch (err) {
      throw new Error("Invalid Token");
    }
  }
}
