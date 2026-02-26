import { isAdminMiddleware } from "../../infra/api/express/middlewares/admin-auth.middleware";
import { authMiddleware } from "../../infra/api/express/middlewares/auth.middleware";
import { validateRequest } from "../../infra/api/express/middlewares/validate-request.middleware";
import { loginUserBodySchema } from "../../infra/api/express/validators/auth/login-user.schema";
import { resetPasswordRequestSchema } from "../../infra/api/express/validators/auth/reset-password-request.schema";
import { resetPasswordSchema } from "../../infra/api/express/validators/auth/reset-password.schema";
import { paramsEmailValidatorSchema } from "../../infra/api/express/validators/params/params-email-validator.schema";
import { paramsIdValidatorSchema } from "../../infra/api/express/validators/params/params-id-validator.schema";
import { createUserBodySchema } from "../../infra/api/express/validators/user/create-user.schema";
import { updateUserBodySchema } from "../../infra/api/express/validators/user/update-user.schema";
import { resetPasswordEmailTemplate } from "../../usecases/notifications/email/reset-password-request.emai.template";
import { SharedContainer } from "./shared.container";

type ContainerDeps = { shared: SharedContainer };

export function makeHttpContainer(deps: ContainerDeps) {
  return {
    auth: {
      required: authMiddleware(deps.shared.tokenService),
      isAdmin: isAdminMiddleware(deps.shared.tokenService),
      resetPasswordRequest: validateRequest({
        body: resetPasswordRequestSchema,
      }),
      resetPasswordBody: validateRequest({ body: resetPasswordSchema }),
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
