import { Request, Response } from "express";
import { LoginUserUsecase } from "../../../../usecases/auth/login-user.usecase";
import { HttpMethod, Route } from "../routes/routes";

export type LoginUserInputDTO = {
  email: string;
  password: string;
};

export type LoginUserResponseDTO = {
  token: string;
};

export class LoginUserRoute implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly loginUserUsecase: LoginUserUsecase,
  ) {}

  public static create(loginUserUsecase: LoginUserUsecase) {
    return new LoginUserRoute("/login", HttpMethod.POST, loginUserUsecase);
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const { email, password } = request.body;

      const input: LoginUserInputDTO = {
        email,
        password,
      };

      const output = await this.loginUserUsecase.execute(input);
      const resposeBody = this.present(output);

      response.status(200).json(resposeBody);
    };
  }

  private present(input: LoginUserResponseDTO): LoginUserResponseDTO {
    const response = { token: input.token };
    return response;
  }

  public getPath(): string {
    return this.path;
  }

  public getMethod(): HttpMethod {
    return this.method;
  }
}
