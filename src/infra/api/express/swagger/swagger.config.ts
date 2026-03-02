import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Users API Documentation",
      version: "1.0.0",
      description: "Boilerplate Users API",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/infra/api/express/swagger/swagger-routes/**/*.swagger.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
