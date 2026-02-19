import { RefreshToken } from "../../domain/user/entity/refreshToken";
import { RefreshTokenGateway } from "../../domain/user/gateway/refreshToken.gateway";
import { UserGateway } from "../../domain/user/gateway/user.gateway";
import { RefreshTokenGenerator } from "../security/refresh-token-generator";
import { TokenHasher } from "../security/token-hasher";
import { TokenService } from "../security/token-service";
import { Usecase } from "../usecase";

type RefreshSessionInputDTO = {
  refreshToken: string;
};
type RefreshSessionOutputDTO = {
  token: string;
  refreshToken: string;
};

export class RefreshSessionUsecase implements Usecase<
  RefreshSessionInputDTO,
  RefreshSessionOutputDTO
> {
  private constructor(
    private readonly tokenService: TokenService,
    private readonly refreshTokenGateway: RefreshTokenGateway,
    private readonly userGateway: UserGateway,
    private readonly tokenHasher: TokenHasher,
    private readonly refreshTokenGenerator: RefreshTokenGenerator,
  ) {}

  public static build(
    tokenService: TokenService,
    refreshTokenGateway: RefreshTokenGateway,
    userGateway: UserGateway,
    tokenHasher: TokenHasher,
    refreshTokenGenerator: RefreshTokenGenerator,
  ) {
    return new RefreshSessionUsecase(
      tokenService,
      refreshTokenGateway,
      userGateway,
      tokenHasher,
      refreshTokenGenerator,
    );
  }

  public async execute(
    input: RefreshSessionInputDTO,
  ): Promise<RefreshSessionOutputDTO> {
    const tokenRaw = input.refreshToken;
    const tokenHashed = await this.tokenHasher.hash(tokenRaw);

    const stored = await this.refreshTokenGateway.findByTokenHash(tokenHashed);

    const user = await this.userGateway.findById(stored.userId);

    if (!user) throw new Error("User not found");

    if (!stored || stored.userId !== user.id)
      throw new Error("Invalid refresh token");

    if (stored.revoked) throw new Error("Refresh token revoked");

    if (stored.expiresAt.getTime() < Date.now())
      throw new Error("Refresh token expired");

    await this.refreshTokenGateway.revokeToken(stored.id);

    const newAccessToken = await this.tokenService.generateAccessToken({
      sub: user.id,
      role: user.role,
    });

    const newRefreshRaw = await this.refreshTokenGenerator.generate();
    const newRefreshHash = await this.tokenHasher.hash(newRefreshRaw);

    const saveRefreshToken = RefreshToken.build(newRefreshHash, user.id);

    await this.refreshTokenGateway.create(saveRefreshToken);

    const output: RefreshSessionOutputDTO = this.presentOutput(
      newAccessToken,
      newRefreshRaw,
    );

    return output;
  }

  private presentOutput(
    token: string,
    refreshSession: string,
  ): RefreshSessionOutputDTO {
    const output: RefreshSessionOutputDTO = {
      token: token,
      refreshToken: refreshSession,
    };

    return output;
  }
}
