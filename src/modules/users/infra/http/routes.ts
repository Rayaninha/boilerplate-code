import { CreateSessionsController } from '../../useCases/createSessions/controller';
import { CreateUsersController } from '../../useCases/createUsers/controller';
import { Db } from 'mongodb';
import { EnsureAuthentication } from '../../../../shared/infra/http/middlewares/ensureAuthentication';
import { GetMeController } from '../../useCases/getMe/controller';
import { RefresnTokenController } from '../../useCases/refreshToken/controller';
import { Router } from 'express';
import { SchemaValidator } from '../../../../shared/infra/http/middlewares/schemaValidator';

export class UsersRoutes {
  static getRoutes(db: Db): Router {
    const routes = Router();

    const { handle: createUsers } = new CreateUsersController(db);
    const { handle: createSessions } = new CreateSessionsController(db);
    const { handle: refreshToken } = new RefresnTokenController(db);
    const { handle: getMe } = new GetMeController(db);

    // localhost:3000/users/
    routes.post(
      '/',
      SchemaValidator(createUsers.schema),
      EnsureAuthentication(createUsers.auth),
      createUsers.fn,
    );

    // localhost:3000/users/me
    routes.get(
      '/me',
      SchemaValidator(getMe.schema),
      EnsureAuthentication(getMe.auth),
      getMe.fn,
    );

    // localhost:3000/users/auth
    routes.post(
      '/auth',
      SchemaValidator(createSessions.schema),
      createSessions.fn,
    );

    // localhost:3000/users/refresh
    routes.post(
      '/refresh',
      SchemaValidator(refreshToken.schema),
      refreshToken.fn,
    );

    return routes;
  }
}
