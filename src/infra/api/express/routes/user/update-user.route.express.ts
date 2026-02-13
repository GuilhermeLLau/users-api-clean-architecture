import { NextFunction, Request, RequestHandler, Response } from "express";
import { HttpMethod, Route } from "../routes";
import {
  UpdateUserInputDTO,
  UpdateUserUsecase,
} from "../../../../../usecases/user/update-user.usecase";
export type UpdateUserResponsoDTO = {
  id: string;
};

export class UpdateUserRoute implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly updateUserUsecase: UpdateUserUsecase,
    private readonly middlewares: RequestHandler[] = [],
  ) {}

  public static create(
    updateUserUsecase: UpdateUserUsecase,
    middlewares: RequestHandler[],
  ) {
    return new UpdateUserRoute(
      "/users/:id",
      HttpMethod.PUT,
      updateUserUsecase,
      middlewares,
    );
  }

  public getHandler() {
    return async (request: Request, response: Response, next: NextFunction) => {
      const { id } = request.params;
      const { name } = request.body;

      if (!id) throw new Error("Invalid id");

      const input: UpdateUserInputDTO = {
        id: id.toString(),
        name,
      };

      const output: UpdateUserResponsoDTO =
        await this.updateUserUsecase.execute(input);

      const responseBody = this.present(output);

      response.status(201).json(responseBody);
    };
  }

  private present(input: UpdateUserResponsoDTO): UpdateUserResponsoDTO {
    const response = { id: input.id };
    return response;
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
