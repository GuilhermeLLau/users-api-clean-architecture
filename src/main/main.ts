import { ApiExpress } from "../infra/api/api.express";
import { prisma } from "../package/prisma/prisma";
import { makeUserRoutes } from "./factories/user/user-routes.factory";

function main() {
  const port = 8000;

  const UserRoutes = makeUserRoutes({ prisma });

  const api = ApiExpress.create(UserRoutes);

  api.start(port);
}

main();
