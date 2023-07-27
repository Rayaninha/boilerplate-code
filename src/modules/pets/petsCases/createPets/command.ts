import BaseCommand from '../../../../shared/commons/BaseCommand';
import { Db } from 'mongodb';
import { PetsRepositories } from '../../infra/database/repositories';
import { PetsEntities } from 'modules/pets/infra/database/entities';

interface IRequest {
  name: string;
  age: string;
  userId: string;
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
  userId,
  }: IRequest): Promise<PetsEntities | boolean> {
    try {
      const checkIfPetAlreadyExists = await this.petsRepositories.findPetsByName(
        { name },
      );

      if (checkIfPetAlreadyExists) {
        return this.addError('artigo já registrado na plataforma.');
      }

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
