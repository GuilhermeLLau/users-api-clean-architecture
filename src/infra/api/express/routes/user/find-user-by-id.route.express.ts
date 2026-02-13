import { NextFunction, Request, RequestHandler, Response } from "express";
import { HttpMethod, Route } from "../routes";
import {
  FindUserByIdOutputDTO,
  FindUserByIdUsecase,
} from "../../../../../usecases/user/find-user-by-id.usecase";
import { FindUserByIdInputDTO } from "../../../../../usecases/user/find-user-by-id.usecase";
import { User } from "../../../../../domain/user/entity/user";

export class FindUserByIdRoute implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private findUserByIdUsecase: FindUserByIdUsecase,
    private readonly middlewares: RequestHandler[] = [],
  ) {}

  public static create(
    findUserByIdUsecase: FindUserByIdUsecase,
    middlewares: RequestHandler[],
  ) {
    return new FindUserByIdRoute(
      "/users/:id",
      HttpMethod.GET,
      findUserByIdUsecase,
      middlewares,
    );
  }

  public getHandler() {
    return async (request: Request, response: Response, next: NextFunction) => {
      const { id } = request.params;

      if (!id) throw new Error("Invalid id");

      const input: FindUserByIdInputDTO = {
        id: id.toString(),
      };

      const output = await this.findUserByIdUsecase.execute(input);

      response.status(200).json(output);
    };
  }

  private presentOutput(user: User): FindUserByIdOutputDTO {
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
