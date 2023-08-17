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

  test('deve ser possível criar um pet', async () => {
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
      expect(pet.body.data).toHaveProperty('name', 'pet test');
      expect(pet.body.data).toHaveProperty('age', 7);
      expect(pet.type).toBe('application/json');
  })

  test('nao deve ser possível criar um pet com os tipos errados nos campus', async () => {
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
        age: 'sete',
        userId: userId
      }).expect(400)
      expect(pet.body.errors[0]).toBe('"age\" must be a number');
      expect(pet.type).toBe('application/json');
  })

  test('nao deve ser possível criar um pet com o token invalido', async () => {
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
        Authorization: `Bearer invalidtoken`
      }).send({
        name: 'pet test',
        age: 7,
        userId: userId
      })
      expect(pet.body.errors[0]).toBe('TOKEN EXPIRADO.')
      expect(pet.type).toBe('application/json');
  })

  test('o pet deve ser excluido quando o usuário dono for excluído', async () => {
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
    })
    .send({
      name: 'petinho',
      age: 10,
      userId: userId
    }).expect(200);

    const deleteUser = await request(app)
    .delete('/users/delete')
    .set({
      Authorization: `Bearer ${auth.body.data.token}`,
    }).expect(200);

    const getPet = await request(app)
    .get('/pets/pet')
    .set({
      Authorization: `Bearer ${auth.body.data.token}`,
    })
    .send({
      name: 'petinho',
      userId: userId,
    }).expect(200);
    expect(getPet.body.data).not.toHaveProperty('_id');
  })
});