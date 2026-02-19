import { NextFunction, Request, RequestHandler, Response } from "express";
import { HttpMethod, Route } from "../routes";
import { DeleteRefreshTokenUsecase } from "../../../../../usecases/refreshToken/delete-refresh-token.usecase";
export type DeleteRefreshTokenInputDTO = {
  id: string;
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
      "/refresh/:id",
      HttpMethod.DELETE,
      deleteRefreshTokenUsecase,
      middlewares,
    );
  }

  public getHandler() {
    return async (request: Request, response: Response, next: NextFunction) => {
      const { id } = request.params;

      if (!id) throw new Error("Invalid id");

      const input: DeleteRefreshTokenInputDTO = {
        id: id.toString(),
      };

      await this.deleteRefreshTokenUsecase.execute(input);

      response.status(201).json({ message: "Token deleted" });
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
