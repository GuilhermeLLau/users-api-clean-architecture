import { NextFunction, Request, RequestHandler, Response } from "express";
import { HttpMethod, Route } from "../routes";
import { RevokeRefreshTokenUsecase } from "../../../../../usecases/refreshToken/revoke-refresh-token.usecase";
export type RevokeRefreshTokenInputDTO = {
  id: string;
};

export class RevokeRefreshTokenRoute implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly revokeRefreshTokenUsecase: RevokeRefreshTokenUsecase,
    private readonly middlewares: RequestHandler[] = [],
  ) {}

  public static create(
    revokeRefreshTokenUsecase: RevokeRefreshTokenUsecase,
    middlewares: RequestHandler[],
  ) {
    return new RevokeRefreshTokenRoute(
      "/refresh/:id",
      HttpMethod.PUT,
      revokeRefreshTokenUsecase,
      middlewares,
    );
  }

  public getHandler() {
    return async (request: Request, response: Response, next: NextFunction) => {
      const { id } = request.params;

      if (!id) throw new Error("Invalid id");

      const input: RevokeRefreshTokenInputDTO = {
        id: id.toString(),
      };

      await this.revokeRefreshTokenUsecase.execute(input);

      response.status(201).json({ message: "Token Revoked" });
    };
  }

  private present(): void {}

  public getPath(): string {
    return this.path;
  }

  public getMethod(): HttpMethod {
    return this.method;
  }

  public getMiddlewares(): RequestHandler[] {
    return this.middlewares;
  }
}
