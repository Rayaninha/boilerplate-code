import '../../../../shared/infra/http/env';

import { Application } from 'express';
import { Db } from 'mongodb';
import { App } from '../../../../shared/infra/http/app';
import MongoDb from '../../../../shared/infra/database/mongoDb';
import request from 'supertest';
import { CreatePetsCommand } from './command';

let createPetsCommand: CreatePetsCommand;

describe('[CONTROLLER] - CREATE PETS', () => {
  let app: Application;
  let db: Db;

  beforeAll(async () => {
    app = await new App().setup();
    db = await MongoDb.getDb();
    createPetsCommand = new CreatePetsCommand(db);
  });

  afterAll(async () => {
    await db.dropDatabase();
  });

  test('criando um pet', async () => {
    const pet = await request(app)
    .post('/pets')
    .send({
      name: "petpet",
      age: 7
    })

    expect(200);
  })
});