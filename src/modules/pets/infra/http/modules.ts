import { Application } from 'express';
import { Db } from 'mongodb';
import { PetsRoutes } from './routes';

export class PetsModules {
  static configure(app: Application, db: Db): void {
    app.use('/pets', PetsRoutes.getRoutes(db));
  }
}
