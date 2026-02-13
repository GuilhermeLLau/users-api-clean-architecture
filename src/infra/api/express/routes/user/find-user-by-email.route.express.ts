import { NextFunction, Request, RequestHandler, Response } from "express";
import { HttpMethod, Route } from "../routes";
import { User } from "../../../../../domain/user/entity/user";
import {
  FindUserByEmailInputDTO,
  FindUserByEmailUsecase,
} from "../../../../../usecases/user/find-user-by-email.usecase";

export class FindUserByEmailRoute implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private findUserByEmailUsecase: FindUserByEmailUsecase,
    private readonly middlewares: RequestHandler[] = [],
  ) {}

  public static create(
    findUserByEmailUsecase: FindUserByEmailUsecase,
    middlewares: RequestHandler[],
  ) {
    return new FindUserByEmailRoute(
      "/users/email/:email",
      HttpMethod.GET,
      findUserByEmailUsecase,
      middlewares,
    );
  }

  public getHandler() {
    return async (request: Request, response: Response, next: NextFunction) => {
      const { email } = request.params;

      if (!email) throw new Error("Internal server error");

      const input: FindUserByEmailInputDTO = {
        email: email.toString(),
      };

      const output = await this.findUserByEmailUsecase.execute(input);

      response.status(200).json(output);
    };
  }

  private presentOutput(user: User): FindUserByEmailInputDTO {
    throw new Error("Not implemented");
  }

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
