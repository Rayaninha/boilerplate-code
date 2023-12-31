import { IRolesTypes } from '../../../../shared/commons/BaseController';
import { ObjectId } from 'mongodb';
import { TokensEntities } from '../database/tokens/entities';
import { UsersEntities } from '../database/entities';
// import { PetsEntities } from 'modules/pets/infra/database/entities';

export interface ICreateUsers {
  name: string;
  email: string;
  password: string;
  role: IRolesTypes;
}

export interface IFindUsersByEmail {
  email: string;
}

export interface IFindUserById {
  userId: ObjectId;
}

export interface IGetAllUsers {
  // userId: ObjectId;
}

export interface IDeleteUserById {
  userId: ObjectId;
}

export interface ICreateRefreshTokenRequest {
  refreshToken: string;
  user: Partial<UsersEntities>;
  expireAt: Date;
}

export interface IFindRefreshTokenByRefreshTokenRequest {
  refreshToken: string;
}

export interface IDeleteRefreshTokenByRefreshTokenRequest {
  token: string;
}

export interface IUpdateLastLoginRequest {
  userId: ObjectId;
}

export interface ITokensRepositories {
  create(payload: ICreateRefreshTokenRequest): Promise<TokensEntities>;
  findRefreshTokenByRefreshToken(
    payload: IFindRefreshTokenByRefreshTokenRequest,
  ): Promise<TokensEntities>;
  deleteRefreshTokenByRefreshToken(
    payload: IDeleteRefreshTokenByRefreshTokenRequest,
  ): Promise<void>;
}

export interface IUsersRepositories {
  createUsers(payload: ICreateUsers): Promise<UsersEntities>;
  findUserByEmail(
    payload: IFindUsersByEmail,
  ): Promise<UsersEntities | undefined>;
  findUserById({ userId }: IFindUserById): Promise<UsersEntities>;
  getAllUsers({}: IGetAllUsers): Promise<UsersEntities>;
  updateLastLoginUser({ userId }: IUpdateLastLoginRequest): Promise<void>;
  deleteUserById({ userId }: IDeleteUserById): Promise<UsersEntities>;
}
