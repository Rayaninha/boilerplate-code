import { CreatePetsController } from '../../petsCases/createPets/controller';
import { Db } from 'mongodb';
import { EnsureAuthentication } from '../../../../shared/infra/http/middlewares/ensureAuthentication';
// import { GetMeController } from '../../petsCases/getMe/controller';
import { Router } from 'express';
import { SchemaValidator } from '../../../../shared/infra/http/middlewares/schemaValidator';

export class PetsRoutes {
  static getRoutes(db: Db): Router {
    const routes = Router();

    const { handle: createPets } = new CreatePetsController(db);
    // const { handle: getMe } = new GetMeController(db);

    routes.post(
      '/',
      SchemaValidator(createPets.schema),
      EnsureAuthentication(createPets.auth),
      createPets.fn,
    );

    // routes.get(
    //   '/me',
    //   SchemaValidator(getMe.schema),
    //   EnsureAuthentication(getMe.auth),
    //   getMe.fn,
    // );

    return routes;
  }
}
