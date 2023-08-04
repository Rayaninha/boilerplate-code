import BaseCommand from '../../../../shared/commons/BaseCommand';
import { Db, ObjectId } from 'mongodb';
import { IRolesTypes } from '../../../../shared/commons/BaseController';
import { PetsRepositories } from '../../infra/database/repositories';
import { PetsEntities } from '../../infra/database/entities';
import { UsersRepositories } from '../../../users/infra/database/repositories';

interface IRequest {
  name: string;
  age: number;
  userId: string;
}

export class CreatePetsCommand extends BaseCommand {
  usersRepositories: UsersRepositories;
  petsRepositories: PetsRepositories;

  constructor(db: Db) {
    super();

    this.petsRepositories = new PetsRepositories(db);

    this.usersRepositories = new UsersRepositories(db);
  }

  async execute({
    name,
    age,
    userId,
  }: IRequest): Promise<PetsEntities | boolean> {
    try {
      const user = await this.usersRepositories.findUserById({
        userId: new ObjectId(userId),
      });

      const pet = await this.petsRepositories.createPets({
        name,
        age,
        userId
      });

      return pet;
    } catch (error) {
      return this.handleException(error);
    }
  }
}
