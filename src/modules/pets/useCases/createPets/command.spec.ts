import '../../../../shared/infra/http/env';

import MongoDb from '../../../../shared/infra/database/mongoDb';
import { CreatePetsCommand } from './command';
import { CreateUsersCommand } from '../../../users/useCases/createUsers/command';
import { UsersEntities } from '../../../users/infra/database/entities';
import { GetMeCommand } from '../../../users/useCases/getMe/command';

let getMeCommand: GetMeCommand;
let createPetsCommand: CreatePetsCommand;
let createUsersCommand: CreateUsersCommand;
let userId: string;

describe('[COMMAND] - CREATE PETS', () => {
  beforeAll(async () => {
    const db = await MongoDb.getDb();
    createPetsCommand = new CreatePetsCommand(db);
    getMeCommand = new GetMeCommand(db);
    createUsersCommand = new CreateUsersCommand(db);
  });

  afterAll(async () => {
    const db = await MongoDb.getDb();
    await db.dropDatabase();
  });

  test('criando pets', async () => {
    jest.setTimeout(30000);
    const createUser = await createUsersCommand.execute({
      email: 'admin@example.com',
      password: 'password',
      role: 'toor',
      name: 'admin',
    });

    if (createUser instanceof UsersEntities) {
      userId = String(createUser._id);
    }

    const getResult = await getMeCommand.execute({ _id: userId });

    const result = await createPetsCommand.execute({
      name: 'pet',
      age: 4,
      userId: userId
    });
    
    expect(result).toHaveProperty('_id');
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('age');
    expect(result).toHaveProperty('userId');
  });
});

