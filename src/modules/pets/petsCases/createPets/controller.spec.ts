import { Application } from "express";
import '../../../../shared/infra/http/env';
import { Db } from "mongodb";
import { App } from '../../../../shared/infra/http/app';
import MongoDb, {collections} from "shared/infra/database/mongoDb";
import request from "supertest";

describe('[CONTOLLER] - CREATE PETS', () => {
  let app: Application;
  let db: Db;

  beforeAll(async () => {
    app = await new App().setup();
    db = await MongoDb.getDb();

    //verificar se o usuário relacionado com o artigo é um admin
  })
})