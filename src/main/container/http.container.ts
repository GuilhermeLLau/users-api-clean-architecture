import { UserGateway } from "../../domain/user/gateway/user.gateway";
import { isAdminMiddleware } from "../../infra/api/express/middlewares/admin-auth.middleware";
import { authMiddleware } from "../../infra/api/express/middlewares/auth.middleware";
import { validateRequest } from "../../infra/api/express/middlewares/validate-request.middleware";
import { loginUserBodySchema } from "../../infra/api/express/validators/auth/login-user.schema";

import { paramsEmailValidatorSchema } from "../../infra/api/express/validators/params/params-email-validator.schema";
import { paramsIdValidatorSchema } from "../../infra/api/express/validators/params/params-id-validator.schema";
import { createUserBodySchema } from "../../infra/api/express/validators/user/create-user.schema";
import { updateUserBodySchema } from "../../infra/api/express/validators/user/update-user.schema";

import { TokenService } from "../../usecases/security/token-service";

export function makeHttpContainer(deps: { tokenService: TokenService }) {
  return {
    auth: {
      required: authMiddleware(deps.tokenService),
      isAdmin: isAdminMiddleware(deps.tokenService),
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
