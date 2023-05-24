import { Db, ObjectId } from 'mongodb';

import BaseCommand from '../../../../shared/commons/BaseCommand';
import { UsersRepositories } from '../../infra/database/repositories';

interface IRequest {
  _id: string;
}

export class GetMeCommand extends BaseCommand {
  usersRepositories: UsersRepositories;

  constructor(db: Db) {
    super();

    this.usersRepositories = new UsersRepositories(db);
  }

  async execute({ _id }: IRequest) {
    try {
      const user = await this.usersRepositories.findUserById({
        userId: new ObjectId(_id),
      });

      delete user.role;

      return {
        user
      }
    } catch (error) {
      this.handleException(error);
    }
  }
}
