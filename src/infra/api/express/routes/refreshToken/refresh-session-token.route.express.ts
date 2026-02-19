import { NextFunction, Request, RequestHandler, Response } from "express";
import { HttpMethod, Route } from "../routes";
import { RefreshSessionUsecase } from "../../../../../usecases/refreshToken/refresh-session.usecase";
export type RefreshSessionTokenInputDTO = {
  refreshToken: string;
};

export class RefreshSessionTokenRoute implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly refreshSessionTokenUsecase: RefreshSessionUsecase,
    // private readonly middlewares: RequestHandler[] = [],
  ) {}

  public static create(
    refreshSessionTokenUsecase: RefreshSessionUsecase,

    // middlewares: RequestHandler[],
  ) {
    return new RefreshSessionTokenRoute(
      "/refresh",
      HttpMethod.POST,
      refreshSessionTokenUsecase,
      //   middlewares,
    );
  }

  public getHandler() {
    return async (request: Request, response: Response, next: NextFunction) => {
      const { refreshToken } = request.body;

      const output = await this.refreshSessionTokenUsecase.execute({
        refreshToken,
      });
      response.status(200).json(output);
    };
  }

  private present(): void {}

  public getPath(): string {
    return this.path;
  }

  public getMethod(): HttpMethod {
    return this.method;
  }

  //   public getMiddlewares(): RequestHandler[] {
  //     return this.middlewares;
  //   }
}
