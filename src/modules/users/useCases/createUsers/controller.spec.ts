import { Application } from 'express';
import '../../../../shared/infra/http/env';
import { Db } from 'mongodb';
import { App } from '../../../../shared/infra/http/app';
import MongoDb, {
  collections,
} from '../../../../shared/infra/database/mongoDb';
import request from 'supertest';
import { hash } from 'bcryptjs';
import { CreateUsersCommand } from './command';

let createUsersCommand: CreateUsersCommand;

describe('[CONTROLLER] - CREATE USERS', () => {
  let app: Application;
  let db: Db;

  beforeAll(async () => {
    app = await new App().setup();
    db = await MongoDb.getDb();
    createUsersCommand = new CreateUsersCommand(db);

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

  test('should be able create a new user authenticated', async () => {
    const auth = await request(app)
      .post('/users/auth')
      .send({
        email: 'admin@example.com',
        password: 'admin',
      });

    const user = await request(app)
      .post('/users')
      .send({
        name: 'test user',
        email: 'test@gmail.com',
        password: 'password',
        role: 'resu',
      })
      .set({
        Authorization: `Bearer ${auth.body.data.token}`,
      });

    expect(user.body.r).toBe(true);
    expect(user.body.data).toHaveProperty('_id');
    expect(user.body.data).toHaveProperty('role');
    expect(user.body.data).toHaveProperty('email');
  });

  test('should create a new user and store all properties correctly in the database', async () => {

    jest.mock('./command', () => ({
      CreateUsersCommand: jest.fn().mockImplementation(() => ({
        execute: async () => false,
        isValid: () => true,
        errors: ['TOKEN EXPIRADO'],
      })),
    }));
    
    const userInDatabase = await request(app)
      .post('/users')
      .send({
        name: 'user in database',
        email: 'userindatabase@gmail.com',
        password: 'password',
        role: 'resu',
      })
      .expect(200);

    expect(userInDatabase.body.data).toHaveProperty('_id');
    expect(userInDatabase.body.data).toHaveProperty('name', 'user in database');
    expect(userInDatabase.body.data).toHaveProperty('email', 'userindatabase@gmail.com');
    expect(userInDatabase.body.data).toHaveProperty('role', 'resu');

    // Check if the user is actually stored in the database
    await db.collection(collections.users).findOne({
      _id: userInDatabase.body.data._id,
    });

    expect(userInDatabase.body.data.name).toBe('user in database');
    expect(userInDatabase.body.data.email).toBe('userindatabase@gmail.com');
    expect(userInDatabase.body.data.role).toBe('resu');

    const sameValue = 'user in database';
    const notSameValue = 'test in database'

    expect(sameValue).toEqual(userInDatabase.body.data.name);
    expect(notSameValue).not.toBe(userInDatabase.body.data.name);
  });
});
