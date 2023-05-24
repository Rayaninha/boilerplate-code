import express, { Application } from 'express';

import { Db } from 'mongodb';
import MongoDb from '../database/mongoDb';
import { UsersModules } from '../../../modules/users/infra/http/modules';
import cors from 'cors';

export class App {
  app: Application;

  constructor() {
    this.app = express();
  }

  async schedules() {}

  async database(): Promise<Db> {
    const database = await MongoDb.getDb();
    return database;
  }

  middlewares(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use('/not-found', (_, res) => res.send('page not found'));
  }

  modules(db: Db): void {
    UsersModules.configure(this.app, db);
  }

  async setup(): Promise<Application> {
    const mongoDb = await this.database();

    this.middlewares();
    this.modules(mongoDb);
    this.schedules();

    return this.app;
  }
}
