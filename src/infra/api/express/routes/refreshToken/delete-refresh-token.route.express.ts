import { NextFunction, Request, RequestHandler, Response } from "express";
import { HttpMethod, Route } from "../routes";
import { DeleteRefreshTokenUsecase } from "../../../../../usecases/refreshToken/delete-refresh-token.usecase";
export type DeleteRefreshTokenInputDTO = {
  refreshToken: string;
};

export class DeleteRefreshTokenRoute implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly deleteRefreshTokenUsecase: DeleteRefreshTokenUsecase,
    private readonly middlewares: RequestHandler[] = [],
  ) {}

  public static create(
    deleteRefreshTokenUsecase: DeleteRefreshTokenUsecase,
    middlewares: RequestHandler[],
  ) {
    return new DeleteRefreshTokenRoute(
      "/refresh",
      HttpMethod.DELETE,
      deleteRefreshTokenUsecase,
      middlewares,
    );
  }

  public getHandler() {
    return async (request: Request, response: Response, next: NextFunction) => {
      const { refreshToken } = request.body;

      if (!refreshToken) throw new Error("Invalid Refresh Token");

      const input: DeleteRefreshTokenInputDTO = {
        refreshToken,
      };

      await this.deleteRefreshTokenUsecase.execute(input);

      response.status(201).json({ message: "Refresh Token Deleted" });
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
