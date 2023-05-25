import '../../../../shared/infra/http/env';

import MongoDb from '../../../../shared/infra/database/mongoDb';
import { GetMeCommand } from './command';
import { CreateUsersCommand } from '../createUsers/command';
import { UsersEntities } from '../../../../modules/users/infra/database/entities';

let getMeCommand: GetMeCommand;
let createUsersCommand: CreateUsersCommand;
let userId: string;

describe('[COMMAND] - USER GET ME', () => {
  beforeAll(async () => {
    const db = await MongoDb.getDb();
    getMeCommand = new GetMeCommand(db);

    createUsersCommand = new CreateUsersCommand(db);

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

  test('should able user get me', async () => {
    const result = await getMeCommand.execute({ _id: userId });

    expect(result).toHaveProperty('user');
  });
});
