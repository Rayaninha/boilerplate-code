import { BaseEntities } from '../../../../../shared/commons/BaseEntities';
import { UsersEntities } from '../entities';

export class TokensEntities extends BaseEntities {
  expireAt: Date;

  refreshToken: string;

  user: Partial<UsersEntities>;

  constructor({ expireAt, refreshToken, user }: TokensEntities) {
    super();

    this.expireAt = expireAt;
    this.refreshToken = refreshToken;
    this.user = user;
  }
}
