import { CreateSessionsController } from '../../useCases/createSessions/controller';
import { CreateUsersController } from '../../useCases/createUsers/controller';
import { Db } from 'mongodb';
import { EnsureAuthentication } from '../../../../shared/infra/http/middlewares/ensureAuthentication';
import { GetMeController } from '../../useCases/getMe/controller';
import { RefresnTokenController } from '../../useCases/refreshToken/controller';
import { Router } from 'express';
import { SchemaValidator } from '../../../../shared/infra/http/middlewares/schemaValidator';
import { DeleteUsersController } from '../../useCases/deleteUsers/controller';


export class UsersRoutes {
  static getRoutes(db: Db): Router {
    const routes = Router();

    const { handle: createUsers } = new CreateUsersController(db);
    const { handle: createSessions } = new CreateSessionsController(db);
    const { handle: refreshToken } = new RefresnTokenController(db);
    const { handle: getMe } = new GetMeController(db);
    const { handle: deleteUsers } = new DeleteUsersController(db);

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

    // localhost:3000/users/all
    // routes.get(
    //   '/all',
    //   SchemaValidator(getAll.schema),
    //   getAll.fn,
    // );

    // localhost:3000/users/delete
    routes.delete(
      '/delete',
      SchemaValidator(deleteUsers.schema),
      EnsureAuthentication(deleteUsers.auth),
      deleteUsers.fn,
    );    

    return routes;
  }
}
