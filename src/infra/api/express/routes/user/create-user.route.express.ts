import { NextFunction, Request, RequestHandler, Response } from "express";
import { CreateUserUsecase } from "../../../../../usecases/user/create-user.usecase";
import { HttpMethod, Route } from "../routes";
import { CreateUserInputDTO } from "../../../../../usecases/user/create-user.usecase";
export type CreateUserResponseDTO = {
  id: string;
};

export class CreateUserRoute implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly createUserUsecase: CreateUserUsecase,
    private readonly middlewares: RequestHandler[] = [],
  ) {}

  public static create(
    createUserUsecase: CreateUserUsecase,
    middlewares: RequestHandler[] = [],
  ) {
    return new CreateUserRoute(
      "/users",
      HttpMethod.POST,
      createUserUsecase,
      middlewares,
    );
  }

  public getHandler() {
    return async (request: Request, response: Response, next: NextFunction) => {
      const { name, email, password, role } = request.body;

      const input: CreateUserInputDTO = {
        name,
        email,
        password,
        role,
      };

      const output: CreateUserResponseDTO =
        await this.createUserUsecase.execute(input);

      const responseBody = this.present(output);

      response.status(201).json(responseBody);
    };
  }

  private present(input: CreateUserResponseDTO): CreateUserResponseDTO {
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
