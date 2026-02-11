import { Request, Response } from "express";
import { CreateUserUsecase } from "../../../../../usecases/user/create-user.usecase";
import { HttpMethod, Route } from "../routes";
import { DeleteUserUsecase } from "../../../../../usecases/user/delete-user.usecase";
export type DeleteUserInputDTO = {
  id: string;
};

export class DeleteUserRoute implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly deleteUserUsecase: DeleteUserUsecase,
  ) {}

  public static create(deleteUserUsecase: DeleteUserUsecase) {
    return new DeleteUserRoute(
      "/users/:id",
      HttpMethod.DELETE,
      deleteUserUsecase,
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const { id } = request.params;

      if (!id) throw new Error("Erro");

      const input: DeleteUserInputDTO = {
        id: id.toString(),
      };

      await this.deleteUserUsecase.execute(input);

      response.status(201).json({ message: "Usuário deletado" });
    };
  }

  private present(): void {}

  public getPath(): string {
    return this.path;
  }

  public getMethod(): HttpMethod {
    return this.method;
  }
}
