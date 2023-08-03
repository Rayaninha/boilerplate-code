import { Application } from 'express';
import '../../../../shared/infra/http/env';
import { Db } from 'mongodb';
import { App } from '../../../../shared/infra/http/app';
import MongoDb, {
  collections,
} from '../../../../shared/infra/database/mongoDb';
import request from 'supertest';
import { hash } from 'bcryptjs';

describe('[CONTROLLER] - CREATE SESSIONS', () => {
  let app: Application;
  let db: Db;

  beforeAll(async () => {
    app = await new App().setup();
    db = await MongoDb.getDb();

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

  test('should be able create a new session', async () => {
    const auth = await request(app)
      .post('/users/auth')
      .send({
        email: 'admin@example.com',
        password: 'admin',
      });

    expect(auth.body.r).toBe(true);
    expect(auth.body.data).toHaveProperty('user');
    expect(auth.body.data).toHaveProperty('token');
    expect(auth.body.data).toHaveProperty('refreshToken');
  });

  test('should be not able create a new session with invalid email', async () => {
    const auth = await request(app)
      .post('/users/auth')
      .send({
        email: 'user@example.com', // invalid email
        password: 'admin',
      });

    expect(auth.body.errors[0]).toBe('seus dados de entrada estão incorretos.');
    expect(auth.body.r).toBe(false);
  });

  test('should be not able create a new session with invalid password', async () => {
    const auth = await request(app)
      .post('/users/auth')
      .send({
        email: 'admin@example.com',
        password: 'user', // invalid password
      });

    expect(auth.body.errors[0]).toBe('seus dados de entrada estão incorretos.');
    expect(auth.body.r).toBe(false);
  });
});
