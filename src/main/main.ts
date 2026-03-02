import { ApiExpress } from "../infra/api/api.express";
import { Route } from "../infra/api/express/routes/routes";
import { prisma } from "../package/prisma/prisma";
import { makeSharedContainer } from "./container/shared.container";
import { makeAuthRoutes } from "./factories/auth/auth-routes.factory";
import { makeUserRoutes } from "./factories/user/user-routes.factory";

import "dotenv/config";

async function main() {
  const port = Number(process.env.PORT ?? 8000);

  const shared = await makeSharedContainer({ prisma });

  const routes: Route[] = [
    ...makeUserRoutes({ shared }),
    ...makeAuthRoutes({ shared }),
  ];

  const api = ApiExpress.create(routes);

  api.start(port);
}

main();
