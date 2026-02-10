import { Request, Response } from "express";
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
  ) {}

  public static create(findUserByEmailUsecase: FindUserByEmailUsecase) {
    return new FindUserByEmailRoute(
      "/users/email/:email",
      HttpMethod.GET,
      findUserByEmailUsecase,
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const { email } = request.params;

      if (!email) throw new Error("erro");

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
}
