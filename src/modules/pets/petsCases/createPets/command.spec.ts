import '../../../../shared/infra/http/env';

import MongoDb from '../../../../shared/infra/database/mongoDb';
import { CreatePetsCommand } from './command';

let createPetsCommand: CreatePetsCommand;

describe('[COMMAND] - CREATE PETS', () => {
  beforeAll(async () => {
    const db = await MongoDb.getDb();
    createPetsCommand = new CreatePetsCommand(db);
  });

  afterAll(async () => {
    const db = await MongoDb.getDb();
    await db.dropDatabase();
  });

  test('rapaz, crinado um pet', async () => {
    jest.setTimeout(30000);
    const result = await createPetsCommand.execute({
      name: 'test name',
      age: 'test age',
    })

    expect(result).toHaveProperty('_id');
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('age');
  })

  test('rapaz, verificando a existencia de um outro pet', async () => {
    jest.setTimeout(30000);
    const result = await createPetsCommand.execute({
      name: 'test name',
      age: 'test age',
    });

    expect(result).toBe(false);
  })
});
