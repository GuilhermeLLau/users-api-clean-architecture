import { User, UserRole } from "../../domain/user/entity/user";
import { UserGateway } from "../../domain/user/gateway/user.gateway";
import { Usecase } from "../usecase";

export type ListUserInputDTO = void;

export type ListUserOutputDTO = {
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

export class ListUserUseCase implements Usecase<
  ListUserInputDTO,
  ListUserOutputDTO
> {
  private constructor(private readonly userGateway: UserGateway) {}

  public static build(userGateway: UserGateway) {
    return new ListUserUseCase(userGateway);
  }

  public async execute(input: void): Promise<ListUserOutputDTO> {
    const users = await this.userGateway.list();

    const output = this.presentOutput(users);

    return output;
  }

  private presentOutput(users: User[]): ListUserOutputDTO {
    return {
      users: users.map((u) => {
        return {
          id: u.id,
          name: u.name,
          email: u.email,
          passwordHash: u.passwordHash,
          role: u.role,
          createdAt: u.createdAt,
          updatedAt: u.updatedAt,
        };
      }),
    };
  }
}
