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

  test('criando pets', async () => {
    jest.setTimeout(30000);
    const result = await createPetsCommand.execute({
      name: 'pet',
      age: 4
    });
    
    expect(result).toHaveProperty('_id');
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('age');
  });
});

