import { CreatePetsController } from '../../useCases/createPets/controller';
import { Db } from 'mongodb';
import { EnsureAuthentication } from '../../../../shared/infra/http/middlewares/ensureAuthentication';
import { Router } from 'express';
import { SchemaValidator } from '../../../../shared/infra/http/middlewares/schemaValidator';

export class PetsRoutes {
  static getRoutes(db: Db): Router {
    const routes = Router();

    const { handle: createPets } = new CreatePetsController(db);

    // localhost:3000/pets/
    routes.post(
      '/',
      SchemaValidator(createPets.schema),
      EnsureAuthentication(createPets.auth),
      createPets.fn,
    );

    return routes;
  }
}
