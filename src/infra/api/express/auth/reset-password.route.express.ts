import { Request, RequestHandler, Response } from "express";
import { HttpMethod, Route } from "../routes/routes";
import { ResetPasswordUsecase } from "../../../../usecases/auth/reset-password-usecase";

export type ResetPasswordInputDTO = {
  token: string;
  password: string;
};

export type ResetPasswordOutputDTO = void;

export class ResetPasswordRoute implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly resetPasswordUsecase: ResetPasswordUsecase,
    private readonly middlewares: RequestHandler[] = [],
  ) {}

  public static create(
    resetPasswordUsecase: ResetPasswordUsecase,
    middlewares: RequestHandler[] = [],
  ) {
    return new ResetPasswordRoute(
      "/reset-password/",
      HttpMethod.POST,
      resetPasswordUsecase,
      middlewares,
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const { token, password } = request.body;

      const input: ResetPasswordInputDTO = {
        token,
        password,
      };

      const output = await this.resetPasswordUsecase.execute(input);

      response.status(200).json({ message: "Password updated" });
    };
  }

  private present(input: ResetPasswordInputDTO): ResetPasswordOutputDTO {}

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
