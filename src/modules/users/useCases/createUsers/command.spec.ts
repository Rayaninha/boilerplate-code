import '../../../../shared/infra/http/env';

import MongoDb from '../../../../shared/infra/database/mongoDb';
import { CreateUsersCommand } from './command';
import { GetMeCommand } from '../getMe/command';
import { UsersEntities } from '../../infra/database/entities';
import { Db } from 'mongodb';

let createUsersCommand: CreateUsersCommand;
let getMeCommand: GetMeCommand;
let userId: string;

describe('[COMMAND] - CREATE USERS', () => {
  let db: Db
  
  beforeAll(async () => {
    db = await MongoDb.getDb();
    createUsersCommand = new CreateUsersCommand(db);
    getMeCommand = new GetMeCommand(db);
  });

  afterAll(async () => {
    await db.dropDatabase();
  });

  test('should ble able to create users', async () => {
    jest.setTimeout(30000);
    const result = await createUsersCommand.execute({
      name: 'test user',
      email: 'test@example.com',
      password: 'test-password',
      role: 'resu',
    });

    expect(result).toHaveProperty('_id');
    expect(result).toHaveProperty('email');
    expect(result).toHaveProperty('role');
  });
  
  test('should be not able create a duplicate user', async () => {
    jest.setTimeout(30000);
    const result = await createUsersCommand.execute({
      name: 'test user',
      email: 'test@example.com',
      password: 'test-password',
      role: 'resu',
    });

    expect(result).toBe(false);
  });
});

