import { Collection, Db } from 'mongodb';
import {
  ICreateUsers,
  IFindUserById,
  IFindUsersByEmail,
  IUpdateLastLoginRequest,
  IUsersRepositories,
} from '../helpers/types';

import { UsersEntities } from './entities';
import { collections } from '../../../../shared/infra/database/mongoDb';

export class UsersRepositories implements IUsersRepositories {
  db: Db;

  usersDb: Collection;

  constructor(db: Db) {
    this.db = db;

    this.usersDb = this.db.collection(collections.users);
  }

  async updateLastLoginUser({
    userId,
  }: IUpdateLastLoginRequest): Promise<void> {
    await this.usersDb.updateOne(
      { _id: userId },
      { $set: { lastLogin: new Date(Date.now()) } },
    );
  }

  async createUsers(payload: ICreateUsers): Promise<UsersEntities> {
    const user = new UsersEntities({ ...payload });
    await this.usersDb.insertOne(user);
    return user;
  }

  async findUserByEmail({ email }: IFindUsersByEmail): Promise<UsersEntities> {
    const user = ((await this.usersDb.findOne({
      email,
    })) as unknown) as UsersEntities;
    return user;
  }

  async findUserById({ userId }: IFindUserById): Promise<UsersEntities> {
    const user = ((await this.usersDb.findOne({
      _id: userId,
    })) as unknown) as UsersEntities;
    return user;
  }
}