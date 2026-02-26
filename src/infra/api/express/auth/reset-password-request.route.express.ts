import { Request, Response, NextFunction, RequestHandler } from "express";
import { HttpMethod, Route } from "../routes/routes";
import { RequestPasswordResetUsecase } from "../../../../usecases/auth/request-password-reset.uscase";

export class RequestPasswordResetRoute implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly requestPasswordResetUsecase: RequestPasswordResetUsecase,
    private readonly middlewares: RequestHandler[] = [],
  ) {}

  public static create(
    requestPasswordResetUsecase: RequestPasswordResetUsecase,
    middlewares: RequestHandler[] = [],
  ) {
    return new RequestPasswordResetRoute(
      "/request-password-reset/",
      HttpMethod.POST,
      requestPasswordResetUsecase,
      middlewares,
    );
  }

  public getHandler = () => {
    return async (request: Request, response: Response, next: NextFunction) => {
      const { email } = request.body;

      const output = this.requestPasswordResetUsecase.execute({ email });

      response.status(200).json({ message: "Email sent" });
    };
  };

  public getPath(): string {
    return this.path;
  }
  public getMethod(): HttpMethod {
    return this.method;
  }
  public getMiddlewares?(): RequestHandler[] {
    return this.middlewares;
  }
}
