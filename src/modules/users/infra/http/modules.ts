import { Application } from 'express';
import { Db } from 'mongodb';
import { UsersRoutes } from './routes';

export class UsersModules {
  static configure(app: Application, db: Db): void {
    app.use('/users', UsersRoutes.getRoutes(db));
  }
}
