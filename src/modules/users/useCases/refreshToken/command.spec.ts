import '../../../../shared/infra/http/env';

import MongoDb from '../../../../shared/infra/database/mongoDb';
import { RefreshTokenCommand } from './command';
import { CreateUsersCommand } from '../createUsers/command';
import { UsersEntities } from '../../../../modules/users/infra/database/entities';
import { CreateSessionsCommand } from '../createSessions/command';

let refreshTokenCommand: RefreshTokenCommand;
let createUsersCommand: CreateUsersCommand;
let createSessionsCommand: CreateSessionsCommand;
let userId: string;

describe('[COMMAND] - USER GET ME', () => {
  beforeAll(async () => {
    const db = await MongoDb.getDb();
    refreshTokenCommand = new RefreshTokenCommand(db);
    createUsersCommand = new CreateUsersCommand(db);
    createSessionsCommand = new CreateSessionsCommand(db);

    const result = await createUsersCommand.execute({
      email: 'admin@example.com',
      password: 'password',
      role: 'toor',
      name: 'admin',
    });

    if (result instanceof UsersEntities) {
      userId = String(result._id);
    }
  });

  afterAll(async () => {
    const db = await MongoDb.getDb();
    await db.dropDatabase();
  });

  test('should be able refresh your token', async () => {
    const auth = await createSessionsCommand.execute({
      email: 'admin@example.com',
      password: 'password',
    });

    const result = await refreshTokenCommand.execute({
      //@ts-ignore
      lastToken: auth.refreshToken,
    });

    expect(result).toHaveProperty('token');
    expect(result).toHaveProperty('refreshToken');
  });

  test('should be not able refresh a invalid token', async () => {
    const auth = await createSessionsCommand.execute({
      email: 'admin@example.com',
      password: 'password',
    });

    const result = await refreshTokenCommand.execute({
      //@ts-ignore
      lastToken: 'Bearer TOKEN',
    });

    expect(result).toBe(false);
  });
});
