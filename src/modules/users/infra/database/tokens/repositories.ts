import { Collection, Db } from 'mongodb';
import {
  ICreateRefreshTokenRequest,
  IDeleteRefreshTokenByRefreshTokenRequest,
  IFindRefreshTokenByRefreshTokenRequest,
  ITokensRepositories,
} from '../../helpers/types';

import { TokensEntities } from './entities';
import { collections } from '../../../../../shared/infra/database/mongoDb';

export class TokensRepositories implements ITokensRepositories {
  tokensDb: Collection;

  constructor(db: Db) {
    this.tokensDb = db.collection(collections.tokens);
  }

  async findRefreshTokenByRefreshToken({
    refreshToken,
  }: IFindRefreshTokenByRefreshTokenRequest): Promise<TokensEntities> {
    const token = ((await this.tokensDb.findOne({
      refreshToken,
    })) as unknown) as TokensEntities;
    return token;
  }
  async deleteRefreshTokenByRefreshToken({
    token,
  }: IDeleteRefreshTokenByRefreshTokenRequest): Promise<void> {
    await this.tokensDb.deleteOne({ refreshToken: token });
  }

  async create({
    expireAt,
    refreshToken,
    user,
  }: ICreateRefreshTokenRequest): Promise<TokensEntities> {
    const token = new TokensEntities({ expireAt, refreshToken, user });
    await this.tokensDb.insertOne(token);
    return token;
  }
}
