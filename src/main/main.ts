import { ApiExpress } from "../infra/api/api.express";
import { Route } from "../infra/api/express/routes/routes";
import { prisma } from "../package/prisma/prisma";
import { makeAuthRoutes } from "./factories/auth/auth-routes.factory";
import { makeUserRoutes } from "./factories/user/user-routes.factory";
import "dotenv/config";

function main() {
  const port = Number(process.env.PORT ?? 8000);

  const routes: Route[] = [
    ...makeUserRoutes({ prisma }),
    ...makeAuthRoutes({ prisma }),
  ];

  const api = ApiExpress.create(routes);

  api.start(port);
}

main();
