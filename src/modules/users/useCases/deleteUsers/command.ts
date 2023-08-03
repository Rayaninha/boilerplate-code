import BaseCommand from '../../../../shared/commons/BaseCommand';
import { Db, ObjectId } from 'mongodb';
import { UsersRepositories } from '../../infra/database/repositories';

interface IRequest {
  _id: string;
}

export class DeleteUsersCommand extends BaseCommand {
  usersRepositories: UsersRepositories;

  constructor(db: Db) {
    super();

    this.usersRepositories = new UsersRepositories(db);
  }

  async execute({ _id }: IRequest): Promise<boolean> {
    try {
      const user = await this.usersRepositories.findUserById({
        userId: new ObjectId(_id),
      });

      if (!user) {
        return this.addError('User not found.');
      }

      await this.usersRepositories.deleteUserById({ userId: new ObjectId(_id) });
      return true;
    } catch (error) {
      return this.handleException(error);
    }
  }
}
