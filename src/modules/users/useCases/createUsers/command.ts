import BaseCommand from '../../../../shared/commons/BaseCommand';
import { Db } from 'mongodb';
import { IRolesTypes } from '../../../../shared/commons/BaseController';
import { UsersRepositories } from '../../infra/database/repositories';
import { hash } from 'bcryptjs';
import { UsersEntities } from 'modules/users/infra/database/entities';

interface IRequest {
  name: string;
  email: string;
  password: string;
  role: IRolesTypes;
}

export class CreateUsersCommand extends BaseCommand {
  usersRepositories: UsersRepositories;

  constructor(db: Db) {
    super();

    this.usersRepositories = new UsersRepositories(db);
  }

  async execute({ name, email, password, role }: IRequest): Promise<UsersEntities | boolean> {
    try {
      const checkIfUserAlreadyExists = await this.usersRepositories.findUserByEmail(
        { email },
      );

      if (checkIfUserAlreadyExists) {
        return this.addError('email já registrado na plataforma.');
      }

      const hashedPassword = await hash(password, 8);

      const user = await this.usersRepositories.createUsers({
        email,
        name,
        password: hashedPassword,
        role,
      });

      delete user.password;

      return user;
    } catch (error) {
      return this.handleException(error);
    }
  }
}
