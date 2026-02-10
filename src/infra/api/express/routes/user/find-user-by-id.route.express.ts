import { Request, Response } from "express";
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
  ) {}

  public static create(findUserByIdUsecase: FindUserByIdUsecase) {
    return new FindUserByIdRoute(
      "/users/:id",
      HttpMethod.GET,
      findUserByIdUsecase,
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const { id } = request.params;

      if (!id) throw Error("Erro");

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
}
