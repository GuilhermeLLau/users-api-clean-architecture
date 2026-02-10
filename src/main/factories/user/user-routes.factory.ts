import { Route } from "../../../infra/api/express/routes/routes";
import { CreateUserRoute } from "../../../infra/api/express/routes/user/create-user.route.express";
import { FindUserByEmailRoute } from "../../../infra/api/express/routes/user/find-user-by-email.route.express";
import { FindUserByIdRoute } from "../../../infra/api/express/routes/user/find-user-by-id.route.express";
import { ListUserRoute } from "../../../infra/api/express/routes/user/list-user.route.express";
import { UserRepositoryPrisma } from "../../../infra/repositories/user/prisma/user.repository.prisma";
import { CreateUserUsecase } from "../../../usecases/user/create-user.usecase";
import { FindUserByEmailUsecase } from "../../../usecases/user/find-user-by-email.usecase";
import { FindUserByIdUsecase } from "../../../usecases/user/find-user-by-id.usecase";
import { ListUserUseCase } from "../../../usecases/user/list-user.usecase";

export function makeUserRoutes(deps: { prisma: any }): Route[] {
  const repository = UserRepositoryPrisma.build(deps.prisma);

  const createUserUsecase = CreateUserUsecase.build(repository);
  const createRoute = CreateUserRoute.create(createUserUsecase);

  const listUserUsecase = ListUserUseCase.build(repository);
  const listUserRoute = ListUserRoute.create(listUserUsecase);

  const findUserByIdUsecase = FindUserByIdUsecase.build(repository);
  const findUserByIdRoute = FindUserByIdRoute.create(findUserByIdUsecase);

  const findUserByEmailUsecase = FindUserByEmailUsecase.build(repository);
  const findUserByEmailRoute = FindUserByEmailRoute.create(
    findUserByEmailUsecase,
  );

  return [createRoute, listUserRoute, findUserByIdRoute, findUserByEmailRoute];
}
