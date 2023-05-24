import BaseCommand from '../../../../shared/commons/BaseCommand';
import { DateProvider } from '../../../../shared/providers/dateProvider/implementations';
import { Db } from 'mongodb';
import { TokensRepositories } from '../../infra/database/tokens/repositories';
import { UsersRepositories } from '../../infra/database/repositories';
import { sign } from 'jsonwebtoken';

interface IRequest {
  lastToken: string;
}

export class RefreshTokenCommand extends BaseCommand {
  usersRepositories: UsersRepositories;

  tokensRepositories: TokensRepositories;

  dateProvider: DateProvider;

  constructor(db: Db) {
    super();

    this.usersRepositories = new UsersRepositories(db);
    this.tokensRepositories = new TokensRepositories(db);
    this.dateProvider = new DateProvider();
  }

  async execute({ lastToken }: IRequest) {
    try {
      const findLastToken = await this.tokensRepositories.findRefreshTokenByRefreshToken(
        { refreshToken: lastToken },
      );

      if (!findLastToken) {
        return this.addError(
          'token não encontrado, por favor, logue novamente.',
        );
      }

      const token = sign(
        {
          _id: findLastToken.user._id,
        },
        process.env.PRIVATE_KEY,
        {
          expiresIn: '1h',
        },
      );

      const refreshToken = sign(
        {
          _id: findLastToken.user._id,
        },
        process.env.PRIVATE_KEY,
        {
          expiresIn: '7d',
        },
      );

      await this.tokensRepositories.create({
        expireAt: this.dateProvider.addDays({
          date: this.dateProvider.dateNow(),
          daysToAdd: 7,
        }),
        refreshToken: refreshToken,
        user: findLastToken.user,
      });

      await this.tokensRepositories.deleteRefreshTokenByRefreshToken({
        token: lastToken,
      });

      return {
        refreshToken,
        token,
      };
    } catch (error) {
      this.handleException(error);
    }
  }
}
