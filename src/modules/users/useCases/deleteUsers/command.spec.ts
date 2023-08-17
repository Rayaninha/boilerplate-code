import '../../../../shared/infra/http/env';

import MongoDb from '../../../../shared/infra/database/mongoDb';
// import { GetMeCommand } from '../getMe/command';
import { CreateUsersCommand } from '../createUsers/command';
import { UsersEntities } from '../../../../modules/users/infra/database/entities';
import { DeleteUsersCommand } from './command';

// let getMeCommand: GetMeCommand;
let createUsersCommand: CreateUsersCommand;
let deleteUserCommand: DeleteUsersCommand;
let userId: string;

describe('[COMMAND] - DELETE USER', () => {
  beforeAll(async () => {
    const db = await MongoDb.getDb();
    // getMeCommand = new GetMeCommand(db);

    createUsersCommand = new CreateUsersCommand(db);
    deleteUserCommand = new DeleteUsersCommand(db);

    const createUser = await createUsersCommand.execute({
      email: 'admin@example.com',
      password: 'password',
      role: 'toor',
      name: 'admin',
    });

    if (createUser instanceof UsersEntities) {
      userId = String(createUser._id);
    }
    
    // const getUser = await getMeCommand.execute({ _id: userId });
  });

  afterAll(async () => {
    const db = await MongoDb.getDb();
    await db.dropDatabase();
  });

  test('must be able to delete a user', async () => {
    jest.setTimeout(30000);
    const deleteUser = await deleteUserCommand.execute({ _id: userId });

    expect(deleteUser).toBe(true);
  })
});
