import '../../../../shared/infra/http/env';

import { Application } from 'express';
import { Db } from 'mongodb';
import { App } from '../../../../shared/infra/http/app';
import MongoDb, { collections } from '../../../../shared/infra/database/mongoDb';
import request from 'supertest';
import { CreatePetsCommand } from './command';
import { hash } from 'bcryptjs';
import { CreateUsersCommand } from '../../../users/useCases/createUsers/command';
import { GetMeCommand } from '../../../users/useCases/getMe/command';

let createPetsCommand: CreatePetsCommand;
let userId: string;

describe('[CONTROLLER] - CREATE PETS', () => {
  let app: Application;
  let db: Db;

  beforeAll(async () => {
    app = await new App().setup();
    db = await MongoDb.getDb();
    createPetsCommand = new CreatePetsCommand(db);

    const hashedPassword = await hash('admin', 8);

    await db.collection(collections.users).insertOne({
      name: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'toor',
    });
  });

  afterAll(async () => {
    await db.dropDatabase();
  });

  test('criando um pet', async () => {
    const auth = await request(app)
      .post('/users/auth')
      .send({
        email: 'admin@example.com',
        password: 'admin',
      }).expect(200);

    expect(auth.body.data.user).toHaveProperty('_id');

    userId = String(auth.body.data.user._id);

    const pet = await request(app)
      .post('/pets')
      .set({
        Authorization: `Bearer ${auth.body.data.token}`
      }).send({
        name: 'pet test',
        age: 7,
        userId: userId
      }).expect(200);

      expect(pet.body.data).toHaveProperty('_id');
      expect(pet.body.data).toHaveProperty('userId');
  })
});