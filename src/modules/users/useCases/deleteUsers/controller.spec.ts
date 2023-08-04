import { Application } from 'express';
import '../../../../shared/infra/http/env';
import { Db } from 'mongodb';
import { App } from '../../../../shared/infra/http/app';
import MongoDb, {
  collections,
} from '../../../../shared/infra/database/mongoDb';
import request from 'supertest';
import { hash } from 'bcryptjs';
import { DeleteUsersCommand } from './command';

describe('[CONTROLLER] - DELETE USER', () => {
  let app: Application;
  let db: Db;

  beforeAll(async () => {
    app = await new App().setup();
    db = await MongoDb.getDb();

    const hashedPassword = await hash('password', 8);

    await db.collection(collections.users).insertOne({
      name: 'root',
      email: 'root@example.com',
      password: hashedPassword,
      role: 'toor',
    });
  });

  afterAll(async () => {
    await db.dropDatabase();
  });

  test('should able delete user', async () => {
    jest.mock('./command', () => ({
      DeleteUsersCommand: jest.fn().mockImplementation(() => ({
        execute: async () => false,
        isValid: () => true,
      })),
    }));
    
    const auth = await request(app)
      .post('/users/auth')
      .send({
        email: 'root@example.com',
        password: 'password',
      });

    const me = await request(app)
      .delete('/users/delete')
      .set({
        Authorization: `Bearer ${auth.body.data.token}`,
      }).expect(200);
      
    expect(me.body.r).toBe(true);
  });

  test('erro ao deletar o usuário', async () => {
    // utilizar mock quando for preciso controlar o comportamento de dependências específicas de uma rota.
    jest.mock('./command', () => ({
      DeleteUsersCommand: jest.fn().mockImplementation(() => ({
        execute: async () => false,
        isValid: () => true,
        errors: ['TOKEN EXPIRADO.'],
      })),
    }));

    const errorToken = await request(app)
    .delete('/users/delete')
    .set({
      Authorization: `Bearer tokenquenaoexiste`,
    });

    expect(errorToken.body.errors[0]).toBe('TOKEN EXPIRADO.');
    expect(errorToken.body.r).toBe(false);
  });
});
