import '../../../../shared/infra/http/env';

import { CreatePetsCommand } from "../createPets/command";
import { CreateUsersCommand } from "../../../../modules/users/useCases/createUsers/command";
import MongoDb from "../../../../shared/infra/database/mongoDb";
import { UsersEntities } from "../../../../modules/users/infra/database/entities";
import { CreateSessionsCommand } from "../../../../modules/users/useCases/createSessions/command";
import { GetPetCommand } from './command';

let createPetsCommand: CreatePetsCommand;
let getPetCommand: GetPetCommand;
let createUsersCommand: CreateUsersCommand;
let createSessionsCommand: CreateSessionsCommand;
let userId: string;

describe('[COMMAND] - GET PET', () => {
  beforeAll(async () => {
    const db = await MongoDb.getDb();
    createPetsCommand = new CreatePetsCommand(db);
    createUsersCommand = new CreateUsersCommand(db);
    createSessionsCommand = new CreateSessionsCommand(db);
    getPetCommand = new GetPetCommand(db);

    const user = await createUsersCommand.execute({
      name: 'user',
      email: 'user@example.com',
      password: 'password',
      role: 'resu'
    })

    if (user instanceof UsersEntities) {
      userId = String(user._id);
    }

    const auth = await createSessionsCommand.execute({
      email: 'user@example.com',
      password: 'password',
    })

    const pet = await createPetsCommand.execute({
      name: 'pet',
      age: 3,
      userId: userId,
    })
  });

  afterAll(async () => {
    const db = await MongoDb.getDb();
    await db.dropDatabase();
  });

  test('deve ser possível acessar a rota get pet', async () => {
    const getPet = await getPetCommand.execute({
      name: 'pet',
      userId: userId,
    })
    expect(getPet.pet).toHaveProperty('_id');
  })

  test('nao deve ser possível acessar a rota get pet com o userId inválido', async () => {
    const getPet = await getPetCommand.execute({
      name: 'pet',
      userId: 'idinvalido'
    })
    expect(getPet).toBe(undefined);
  })

  test('deve retornar que o pet nao existe', async () => {
    const getPet = await getPetCommand.execute({
      name: 'petinho',
      userId: userId
    })
    expect(getPet.pet).toBe(null);
  })
});