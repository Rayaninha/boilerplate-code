import BaseCommand from '../../../../shared/commons/BaseCommand';
import { Db } from 'mongodb';
import { IRolesTypes } from '../../../../shared/commons/BaseController';
import { PetsRepositories } from '../../infra/database/repositories';
import { PetsEntities } from '../../infra/database/entities';

interface IRequest {
  name: string;
  age: number;
}

export class CreatePetsCommand extends BaseCommand {
  petsRepositories: PetsRepositories;

  constructor(db: Db) {
    super();

    this.petsRepositories = new PetsRepositories(db);
  }

  async execute({
    name,
    age,
  }: IRequest): Promise<PetsEntities | boolean> {
    try {
      const pet = await this.petsRepositories.createPets({
        name,
        age,
      });

      return pet;
    } catch (error) {
      return this.handleException(error);
    }
  }
}
