import { Db, ObjectId } from 'mongodb';

import BaseCommand from '../../../../shared/commons/BaseCommand';
import { PetsRepositories } from '../../infra/database/repositories';
import { UsersRepositories } from '../../../../modules/users/infra/database/repositories';

interface IRequest {
  name: string;
  userId: string
}

export class GetPetCommand extends BaseCommand {
  petsRepositories: PetsRepositories;
  usersRepositories: UsersRepositories;

  constructor(db: Db) {
    super();

    this.petsRepositories = new PetsRepositories(db);

    this.usersRepositories = new UsersRepositories(db);
  }

  async execute({ 
    name, 
    userId 
  }: IRequest) {
    try {
      const user = await this.usersRepositories.findUserById({
        userId: new ObjectId(userId),
      });

      const pet = await this.petsRepositories.findPetByName({
        name: name,
        userId: userId,
      });

      return {
        pet,
      };
    } catch (error) {
      this.handleException(error);
    }
  }
}
