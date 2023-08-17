import '../../../../shared/infra/http/env';

import MongoDb from '../../../../shared/infra/database/mongoDb';
import { Db } from 'mongodb';
import { CreateActionsCommand } from './command';
import { CreateUsersCommand } from '../../../../modules/users/useCases/createUsers/command';
import { UsersEntities } from '../../../../modules/users/infra/database/entities';
import { ACTIONS_TYPES } from '../../../../shared/commons/constants';

let createActionsCommand: CreateActionsCommand;
let createUsersCommand: CreateUsersCommand;
let userId: string;

describe('[COMMAND] - CREATE ACTIONS', () => {
  let db: Db

  beforeAll(async () => {
    db = await MongoDb.getDb();
    createActionsCommand = new CreateActionsCommand(db);
    createUsersCommand = new CreateUsersCommand(db);

    const user = await createUsersCommand.execute({
      name: "user",
      email: "user@example.com",
      password: "password",
      role: "resu"
    })

    if (user instanceof UsersEntities) {
      userId = String(user._id);
    }
  });

  afterAll(async () => {
    await db.dropDatabase();
  })

  test('should ble able to create users', async () => {
    jest.setTimeout(30000);
    const result = await createActionsCommand.execute({
      userId: userId,
      action: ACTIONS_TYPES.NEW_USER_CREATED,
      request: "",
      response: "",
    })
    expect(200)
  })

  test('should ble able to craete users without userId', async () =>{
    jest.setTimeout(30000);
    const result = await createActionsCommand.execute({
      userId: undefined,
      action: ACTIONS_TYPES.NEW_USER_CREATED,
      request: "",
      response: "",
    })
    expect(200)
  })
})