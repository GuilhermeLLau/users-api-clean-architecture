import {
  makeSharedContainer,
  SharedContainer,
} from "../../container/shared.container";
import { makeUserContainer } from "../../container/user.container";
import { makeHttpContainer } from "../../container/http.container";
import { CreateUserRoute } from "../../../infra/api/express/routes/user/create-user.route.express";
import { ListUserRoute } from "../../../infra/api/express/routes/user/list-user.route.express";
import { FindUserByIdRoute } from "../../../infra/api/express/routes/user/find-user-by-id.route.express";
import { FindUserByEmailRoute } from "../../../infra/api/express/routes/user/find-user-by-email.route.express";
import { UpdateUserRoute } from "../../../infra/api/express/routes/user/update-user.route.express";
import { DeleteUserRoute } from "../../../infra/api/express/routes/user/delete-user.route.express";
import { Route } from "../../../infra/api/express/routes/routes";

export function makeUserRoutes(deps: { shared: SharedContainer }): Route[] {
  const user = makeUserContainer({ shared: deps.shared });
  const http = makeHttpContainer({ shared: deps.shared });

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
