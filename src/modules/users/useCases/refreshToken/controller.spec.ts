import { Application } from 'express';
import '../../../../shared/infra/http/env';
import { Db } from 'mongodb';
import { App } from '../../../../shared/infra/http/app';
import MongoDb, {
  collections,
} from '../../../../shared/infra/database/mongoDb';
import request from 'supertest';
import { hash } from 'bcryptjs';

describe('[CONTROLLER] - REFRESH TOKEN', () => {
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

  test('should be able refresh your token', async () => {
    const auth = await request(app)
      .post('/users/auth')
      .send({
        email: 'admin@example.com',
        password: 'admin',
      });

    const refresh = await request(app)
      .post('/users/refresh')
      .send({
        lastToken: auth.body.data.refreshToken,
      });

    expect(refresh.body.r).toBe(true);
    expect(refresh.body.data).toHaveProperty('token');
    expect(refresh.body.data).toHaveProperty('refreshToken');
  });

  test('should be not able refresh a invalid token', async () => {
    const refresh = await request(app)
      .post('/users/refresh')
      .send({
        lastToken: 'Bearer TOKEN',
      });

    expect(refresh.body.r).toBe(false);
    expect(refresh.body.errors[0]).toBe(
      'token não encontrado, por favor, logue novamente.',
    );
  });
});
