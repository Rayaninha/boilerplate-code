import { Collection, Db } from 'mongodb';
import {
  ICreateUsers,
  IFindUserById,
  IFindUsersByEmail,
  IUpdateLastLoginRequest,
  IUsersRepositories,
  IDeleteUserById,
  IGetAllUsers,
} from '../helpers/types';

import { UsersEntities } from './entities';
import { collections } from '../../../../shared/infra/database/mongoDb';

export class UsersRepositories implements IUsersRepositories {
  db: Db;

  usersDb: Collection;
  petsDb: Collection;

  constructor(db: Db) {
    this.db = db;

    this.usersDb = this.db.collection(collections.users);
    this.petsDb = this.db.collection(collections.pets);
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

  async getAllUsers({}: IGetAllUsers): Promise<UsersEntities> {
    const users = ((this.usersDb.find({})) as unknown) as UsersEntities;
    return users;
  }

  async deleteUserById({ userId }: IDeleteUserById): Promise<UsersEntities> {
    const user = ((await this.usersDb.findOne({ 
      _id: userId,
     })) as unknown) as UsersEntities;

    const petsToDelete = await this.petsDb.find({ userId: String(userId) }).toArray();

    await this.petsDb.deleteMany({ userId: String(userId) });
    // if (!user) {
    //   throw new Error('User not found');
    // }

    await this.usersDb.deleteOne({ _id: userId });
    return user;
  }
}
