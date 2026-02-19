import { NextFunction, Request, Response } from "express";
import {
  ListUserOutputDTO,
  ListUserUseCase,
} from "../../../../../usecases/user/list-user.usecase";
import { HttpMethod, Route } from "../routes";
import { UserRole } from "../../../../../domain/user/entity/user";

export type ListUserResponseDTO = {
  users: {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
  }[];
};

export class ListUserRoute implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly listUserUsecase: ListUserUseCase,
  ) {}

  public static create(listUserUsecase: ListUserUseCase) {
    return new ListUserRoute("/users", HttpMethod.GET, listUserUsecase);
  }

  public getHandler() {
    return async (request: Request, response: Response, next: NextFunction) => {
      const output = await this.listUserUsecase.execute();

      const responseBody = this.present(output);
      response.status(200).json(responseBody);
    };
  }

  public getPath(): string {
    return this.path;
  }

  public getMethod(): HttpMethod {
    return this.method;
  }

  private present(input: ListUserOutputDTO): ListUserResponseDTO {
    const response: ListUserResponseDTO = {
      users: input.users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        passwordHash: user.passwordHash,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
    };
    return response;
  }
}
