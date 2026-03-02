import { Api } from "./api";
import express, { Express } from "express";
import { Route } from "./express/routes/routes";
import { errorMiddleware } from "./express/middlewares/error.middleware";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./express/swagger/swagger.config";

export class ApiExpress implements Api {
  private app: Express;

  private constructor(routes: Route[]) {
    this.app = express();
    this.app.use(express.json());
    this.app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    this.addRoutes(routes);
    this.app.use(errorMiddleware);
  }

  public static create(routes: Route[]) {
    return new ApiExpress(routes);
  }

  private addRoutes(routes: Route[]) {
    routes.forEach((route) => {
      const path = route.getPath();
      const method = route.getMethod();
      const handler = route.getHandler();
      const middlewares = route.getMiddlewares ? route.getMiddlewares() : [];

      this.app[method](path, ...middlewares, handler);
    });
  }

  public async start(port: number) {
    this.app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
}
