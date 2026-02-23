import { makeSharedContainer } from "../../container/shared.container";
import { makeUserContainer } from "../../container/user.container";
import { makeHttpContainer } from "../../container/http.container";
import { CreateUserRoute } from "../../../infra/api/express/routes/user/create-user.route.express";
import { ListUserRoute } from "../../../infra/api/express/routes/user/list-user.route.express";
import { FindUserByIdRoute } from "../../../infra/api/express/routes/user/find-user-by-id.route.express";
import { FindUserByEmailRoute } from "../../../infra/api/express/routes/user/find-user-by-email.route.express";
import { UpdateUserRoute } from "../../../infra/api/express/routes/user/update-user.route.express";
import { DeleteUserRoute } from "../../../infra/api/express/routes/user/delete-user.route.express";
import { Route } from "../../../infra/api/express/routes/routes";

export function makeUserRoutes(deps: { prisma: any }): Route[] {
  const shared = makeSharedContainer(deps);
  const user = makeUserContainer({ prisma: shared.prisma });
  const http = makeHttpContainer({ tokenService: shared.tokenService });

  return [
    CreateUserRoute.create(user.usecases.create, [
      http.validate.createUserBody,
    ]),
    ListUserRoute.create(user.usecases.list, [http.auth.isAdmin]),
    FindUserByIdRoute.create(user.usecases.findById, [
      http.auth.isAdmin,
      http.validate.paramsId,
    ]),
    FindUserByEmailRoute.create(user.usecases.findByEmail, [
      http.validate.paramsEmail,
    ]),
    DeleteUserRoute.create(user.usecases.delete, [
      http.auth.isAdmin,
      http.validate.paramsId,
    ]),
    UpdateUserRoute.create(user.usecases.update, [
      http.auth.isAdmin,
      http.validate.updateUserBody,
    ]),
  ];
}
