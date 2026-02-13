import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { ZodObject, ZodError } from "zod";

export type Schemas = {
  body?: ZodObject;
  params?: ZodObject;
  query?: ZodObject;
};

export const validateRequest = (schemas: Schemas) => {
  return (request: Request, response: Response, next: NextFunction) => {
    try {
      if (schemas.body) request.body = schemas.body.parse(request.body);
      if (schemas.params)
        request.params = schemas.params.parse(
          request.params,
        ) as ParamsDictionary;
      if (schemas.query)
        request.query = schemas.query.parse(request.query) as ParsedQs;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return next({
          type: "validation",
          issues: err.issues.map((i) => ({
            path: i.path.join("."),
            message: i.message,
          })),
        });
      }
      next(err);
    }
  };
};
