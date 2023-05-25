import { Application } from 'express';
import '../../../../shared/infra/http/env';
import { Db } from 'mongodb';
import { App } from '../../../../shared/infra/http/app';
import MongoDb, {
  collections,
} from '../../../../shared/infra/database/mongoDb';
import request from 'supertest';
import { hash } from 'bcryptjs';

describe('[CONTROLLER] - CREATE USERS', () => {
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

  test('should be not able create a user non authenticated', async () => {
    const { body, status } = await request(app)
      .post('/users')
      .send({
        name: 'test user',
        email: 'test@example.com',
        password: 'test-password',
        role: 'resu',
      });

    expect(body.r).toBe(false);
    expect(status).toBe(401);
    expect(body.errors[0]).toBe('401 - UNAUTHORIZED');
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
        email: 'test@example.com',
        password: 'test-password',
        role: 'resu',
      }).set({
        Authorization: `Bearer ${auth.body.data.token}`
      });

    expect(user.body.r).toBe(true);
    expect(user.body.data).toHaveProperty('_id');
    expect(user.body.data).toHaveProperty('role');
    expect(user.body.data).toHaveProperty('email');
  });
});
