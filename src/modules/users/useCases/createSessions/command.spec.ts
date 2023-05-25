import '../../../../shared/infra/http/env';

import MongoDb from '../../../../shared/infra/database/mongoDb';
import { CreateSessionsCommand } from './command';
import { CreateUsersCommand } from '../createUsers/command';

let createSessionsCommand: CreateSessionsCommand;
let createUsersCommand: CreateUsersCommand;

describe('[COMMAND] - CREATE SESSIONS', () => {
  beforeAll(async () => {
    const db = await MongoDb.getDb();
    createSessionsCommand = new CreateSessionsCommand(db);
    createUsersCommand = new CreateUsersCommand(db);

    await createUsersCommand.execute({
      email: 'admin@example.com',
      password: 'password',
      role: 'toor',
      name: 'admin',
    });
  });

  afterAll(async () => {
    const db = await MongoDb.getDb();
    await db.dropDatabase();
  });

  test('should be able create a new session', async () => {
    const result = await createSessionsCommand.execute({
      email: 'admin@example.com',
      password: 'password',
    });

    expect(result).toHaveProperty('user');
    expect(result).toHaveProperty('token');
    expect(result).toHaveProperty('refreshToken');
  });

  test('should be not able create a new session with invalid email', async () => {
    const result = await createSessionsCommand.execute({
      email: 'user@example.com',
      password: 'password',
    });

    expect(result).toBe(false);
  });

  test('should be not able create a new session with invalid password', async () => {
    const result = await createSessionsCommand.execute({
      email: 'admin@example.com',
      password: 'admin',
    });

    expect(result).toBe(false);
  });
});
