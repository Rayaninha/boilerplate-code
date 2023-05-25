import '../../../../shared/infra/http/env'

import MongoDb from "../../../../shared/infra/database/mongoDb";
import { CreateUsersCommand } from "./command";

let createUsersCommand: CreateUsersCommand;

describe('[COMMAND] - CREATE USERS', () => {

  beforeAll(async () => {
    const db = await MongoDb.getDb();
    console.log(process.env.MONGODB_URL)
    createUsersCommand = new CreateUsersCommand(db);
  })

  afterAll(async () => {
    const db = await MongoDb.getDb();
    await db.dropDatabase()
  })

  it('should ble able to create users', async () => {
    jest.setTimeout(30000);
    const result = await createUsersCommand.execute({
      name: 'test user',
      email: 'test@example.com',
      password: 'test-password',
      role: 'resu'
    })

    expect(result).toHaveProperty('_id')
    expect(result).toHaveProperty('email')
    expect(result).toHaveProperty('role')
  })
})
