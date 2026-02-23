import { BcryptPasswordHasher } from "../../infra/cryptography/bcrypt-password-hasher";
import { UserRepositoryPrisma } from "../../infra/repositories/user/prisma/user.repository.prisma";

import { CreateUserUsecase } from "../../usecases/user/create-user.usecase";
import { DeleteUserUsecase } from "../../usecases/user/delete-user.usecase";
import { FindUserByEmailUsecase } from "../../usecases/user/find-user-by-email.usecase";
import { FindUserByIdUsecase } from "../../usecases/user/find-user-by-id.usecase";
import { ListUserUseCase } from "../../usecases/user/list-user.usecase";
import { UpdateUserUsecase } from "../../usecases/user/update-user.usecase";

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

export function makeUserContainer(deps: { prisma: any }): UserContainer {
  const repository = UserRepositoryPrisma.build(deps.prisma);
  const passwordHasher = new BcryptPasswordHasher();

  return {
    usecases: {
      create: CreateUserUsecase.build(repository, passwordHasher),
      list: ListUserUseCase.build(repository),
      findById: FindUserByIdUsecase.build(repository),
      findByEmail: FindUserByEmailUsecase.build(repository),
      update: UpdateUserUsecase.build(repository),
      delete: DeleteUserUsecase.build(repository),
    },
  };
}
