import { Request, Response } from "express";
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
  ) {}

  public static create(updateUserUsecase: UpdateUserUsecase) {
    return new UpdateUserRoute("/users/:id", HttpMethod.PUT, updateUserUsecase);
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const { id } = request.params;
      const { name } = request.body;

      if (!id) throw new Error("Erro");

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
}
