import { CreatePetsController } from '../../useCases/createPets/controller';
import { Db } from 'mongodb';
import { EnsureAuthentication } from '../../../../shared/infra/http/middlewares/ensureAuthentication';
import { Router } from 'express';
import { SchemaValidator } from '../../../../shared/infra/http/middlewares/schemaValidator';
import { GetPetController } from '../../../../modules/pets/useCases/getPets/controller';

export class PetsRoutes {
  static getRoutes(db: Db): Router {
    const routes = Router();

    const { handle: createPets } = new CreatePetsController(db);
    const { handle: getPet} = new GetPetController(db);


    // localhost:3000/pets/
    routes.post(
      '/',
      SchemaValidator(createPets.schema),
      EnsureAuthentication(createPets.auth),
      createPets.fn,
    );
    
    // localhost:3000/pets/pet
    routes.get(
      '/pet',
      SchemaValidator(getPet.schema),
      EnsureAuthentication(getPet.auth),
      getPet.fn,
    );

    return routes;
  }
}
