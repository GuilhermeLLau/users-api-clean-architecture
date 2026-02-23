import { authMiddleware } from "../../infra/api/express/middlewares/auth.middleware";
import { validateRequest } from "../../infra/api/express/middlewares/validate-request.middleware";
import { loginUserBodySchema } from "../../infra/api/express/validators/auth/login-user.schema";

import { paramsEmailValidatorSchema } from "../../infra/api/express/validators/params/params-email-validator.schema";
import { paramsIdValidatorSchema } from "../../infra/api/express/validators/params/params-id-validator.schema";
import { createUserBodySchema } from "../../infra/api/express/validators/user/create-user.schema";
import { updateUserBodySchema } from "../../infra/api/express/validators/user/update-user.schema";

import type { JwtTokenService } from "../../infra/cryptography/jwt-token-service";

export function makeHttpContainer(deps: { tokenService: JwtTokenService }) {
  return {
    auth: {
      required: authMiddleware(deps.tokenService),
    },
    validate: {
      paramsId: validateRequest({ params: paramsIdValidatorSchema }),
      paramsEmail: validateRequest({ params: paramsEmailValidatorSchema }),
      createUserBody: validateRequest({ body: createUserBodySchema }),
      loginUserBody: validateRequest({ body: loginUserBodySchema }),
      updateUserBody: validateRequest({ body: updateUserBodySchema }),
    },
  };
}
