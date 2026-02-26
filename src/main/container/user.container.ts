import { UserRepositoryPrisma } from "../../infra/repositories/user/prisma/user.repository.prisma";
import { CreateUserUsecase } from "../../usecases/user/create-user.usecase";
import { DeleteUserUsecase } from "../../usecases/user/delete-user.usecase";
import { FindUserByEmailUsecase } from "../../usecases/user/find-user-by-email.usecase";
import { FindUserByIdUsecase } from "../../usecases/user/find-user-by-id.usecase";
import { ListUserUseCase } from "../../usecases/user/list-user.usecase";
import { UpdateUserUsecase } from "../../usecases/user/update-user.usecase";
import { SharedContainer } from "./shared.container";

type UserDeps = { shared: SharedContainer };

export type UserContainer = {
  usecases: {
    create: CreateUserUsecase;
    list: ListUserUseCase;
    findById: FindUserByIdUsecase;
    findByEmail: FindUserByEmailUsecase;
    update: UpdateUserUsecase;
    delete: DeleteUserUsecase;
  };
};

export function makeUserContainer(deps: UserDeps): UserContainer {
  const repository = UserRepositoryPrisma.build(deps.shared.prisma);

  return {
    usecases: {
      create: CreateUserUsecase.build(
        repository,
        deps.shared.passwordHasher,
        deps.shared.mailProvider,
      ),
      list: ListUserUseCase.build(repository),
      findById: FindUserByIdUsecase.build(repository),
      findByEmail: FindUserByEmailUsecase.build(repository),
      update: UpdateUserUsecase.build(repository),
      delete: DeleteUserUsecase.build(repository),
    },
  };
}
