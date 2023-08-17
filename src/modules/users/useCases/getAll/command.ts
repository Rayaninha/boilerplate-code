import { Db, ObjectId } from 'mongodb';

import BaseCommand from '../../../../shared/commons/BaseCommand';
import { UsersRepositories } from '../../infra/database/repositories';

// interface IRequest {
//   _id: string;
// }

export class GetAllCommand extends BaseCommand {
  usersRepositories: UsersRepositories;

  constructor(db: Db) {
    super();

    this.usersRepositories = new UsersRepositories(db);
  }

  async execute() {
    try {
      const users = await this.usersRepositories.getAllUsers({});

      delete users.role;

      return {
        users,
      };
    } catch (error) {
      this.handleException(error);
    }
  }
}
