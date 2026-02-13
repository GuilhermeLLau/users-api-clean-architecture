import { validateRequest } from "../../../infra/api/express/middlewares/validate-request.middleware";
import { Route } from "../../../infra/api/express/routes/routes";
import { CreateUserRoute } from "../../../infra/api/express/routes/user/create-user.route.express";
import { DeleteUserRoute } from "../../../infra/api/express/routes/user/delete-user.route.express";
import { FindUserByEmailRoute } from "../../../infra/api/express/routes/user/find-user-by-email.route.express";
import { FindUserByIdRoute } from "../../../infra/api/express/routes/user/find-user-by-id.route.express";
import { ListUserRoute } from "../../../infra/api/express/routes/user/list-user.route.express";
import { UpdateUserRoute } from "../../../infra/api/express/routes/user/update-user.route.express";
import { paramsEmailValidatorSchema } from "../../../infra/api/express/validators/params/params-email-validator.schema";
import { paramsIdValidatorSchema } from "../../../infra/api/express/validators/params/params-id-validator.schema";
import { createUserBodySchema } from "../../../infra/api/express/validators/user/create-user.schema";
import { updateUserBodySchema } from "../../../infra/api/express/validators/user/update-user.schema";
import { BcryptPasswordHasher } from "../../../infra/cryptography/bcrypt-password-hasher";
import { UserRepositoryPrisma } from "../../../infra/repositories/user/prisma/user.repository.prisma";
import { CreateUserUsecase } from "../../../usecases/user/create-user.usecase";
import { DeleteUserUsecase } from "../../../usecases/user/delete-user.usecase";
import { FindUserByEmailUsecase } from "../../../usecases/user/find-user-by-email.usecase";
import { FindUserByIdUsecase } from "../../../usecases/user/find-user-by-id.usecase";
import { ListUserUseCase } from "../../../usecases/user/list-user.usecase";
import { UpdateUserUsecase } from "../../../usecases/user/update-user.usecase";

export function makeUserRoutes(deps: { prisma: any }): Route[] {
  const repository = UserRepositoryPrisma.build(deps.prisma);
  const passwordHasher = new BcryptPasswordHasher();

  const validateParamsId = validateRequest({ params: paramsIdValidatorSchema });
  const validateParamsEmail = validateRequest({
    params: paramsEmailValidatorSchema,
  });

  const validateCreateUser = validateRequest({ body: createUserBodySchema });

  const createUserUsecase = CreateUserUsecase.build(repository, passwordHasher);
  const createRoute = CreateUserRoute.create(createUserUsecase, [
    validateCreateUser,
  ]);

  const listUserUsecase = ListUserUseCase.build(repository);
  const listUserRoute = ListUserRoute.create(listUserUsecase);

  const findUserByIdUsecase = FindUserByIdUsecase.build(repository);
  const findUserByIdRoute = FindUserByIdRoute.create(findUserByIdUsecase, [
    validateParamsId,
  ]);

  const findUserByEmailUsecase = FindUserByEmailUsecase.build(repository);
  const findUserByEmailRoute = FindUserByEmailRoute.create(
    findUserByEmailUsecase,
    [validateParamsEmail],
  );

  const validateUpdateUserBodySchema = validateRequest({
    body: updateUserBodySchema,
  });

  const updateUserUsecase = UpdateUserUsecase.build(repository);
  const updateUserRoute = UpdateUserRoute.create(updateUserUsecase, [
    validateUpdateUserBodySchema,
  ]);

  const deleteUserUsecase = DeleteUserUsecase.build(repository);
  const deleteUserRoute = DeleteUserRoute.create(deleteUserUsecase, [
    validateParamsId,
  ]);

  return [
    createRoute,
    listUserRoute,
    findUserByIdRoute,
    findUserByEmailRoute,
    deleteUserRoute,
    updateUserRoute,
  ];
}
