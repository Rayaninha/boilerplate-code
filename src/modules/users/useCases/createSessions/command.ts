import { Db, ObjectId } from 'mongodb';

import BaseCommand from '../../../../shared/commons/BaseCommand';
import { DateProvider } from '../../../../shared/providers/dateProvider/implementations';
import { TokensRepositories } from '../../infra/database/tokens/repositories';
import { UsersRepositories } from '../../infra/database/repositories';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

interface IRequest {
  email: string;
  password: string;
}

export class CreateSessionsCommand extends BaseCommand {
  usersRepositories: UsersRepositories;

  tokensRepositories: TokensRepositories;

  dateProvider: DateProvider;

  constructor(db: Db) {
    super();

    this.usersRepositories = new UsersRepositories(db);

    this.tokensRepositories = new TokensRepositories(db);

    this.dateProvider = new DateProvider();
  }

  async execute({ email, password }: IRequest) {
    try {
      const user = await this.usersRepositories.findUserByEmail({ email });

      if (!user) {
        return this.addError('seus dados de entrada estão incorretos.');
      }

      const checkPassword = await compare(password, user.password);

      if (!checkPassword) {
        return this.addError('seus dados de entrada estão incorretos.');
      }

      delete user.password;

      const token = sign(
        {
          _id: user._id,
        },
        process.env.PRIVATE_KEY,
        {
          expiresIn: '7d',
        },
      );

      const refreshToken = sign(
        {
          _id: user._id,
        },
        process.env.PRIVATE_KEY,
        {
          expiresIn: '15d',
        },
      );

      await this.tokensRepositories.create({
        expireAt: this.dateProvider.addDays({
          date: this.dateProvider.dateNow(),
          daysToAdd: 7,
        }),
        refreshToken: refreshToken,
        user,
      });

      await this.usersRepositories.updateLastLoginUser({
        userId: new ObjectId(user._id),
      });

      return {
        user,
        token,
        refreshToken,
      };
    } catch (error) {
      return this.handleException(error);
    }
  }
}
