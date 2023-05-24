import MongoDb, { collections } from '../../database/mongoDb';
import { NextFunction, Request, Response } from 'express';

import { ERRORS } from '../../../commons/constants';
import { IAuthType } from '../../../commons/BaseController';
import { ObjectId } from 'mongodb';
import { UsersEntities } from '../../../../modules/users/infra/database/entities';
import { verify } from 'jsonwebtoken';

export type IDecodedTokenType = {
  _id: string;
};

declare global {
  namespace Express {
    export interface Request {
      user: {
        _id: string;
      };
    }
  }
}

export const EnsureAuthentication = (auth: IAuthType) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const mongoDb = await MongoDb.getDb();
    const usersDb = mongoDb.collection(collections.users);

    const { roles } = auth;

    if (!roles.length) return next();

    const { authorization } = req.headers;

    if (!authorization) {
      return res
        .status(ERRORS.UNAUTHORIZED.code)
        .json(ERRORS.UNAUTHORIZED.json);
    }

    const [_, token] = authorization.split(' ');

    try {
      const decoded = verify(token, process.env.PRIVATE_KEY);

      const { _id } = decoded as IDecodedTokenType;

      const user = ((await usersDb.findOne({
        _id: new ObjectId(_id),
      })) as unknown) as UsersEntities;

      if (!roles.includes(user.role)) {
        return res.status(ERRORS.FORBIDDEN.code).json(ERRORS.FORBIDDEN.json);
      }

      req.user = {
        _id,
      };

      next();
    } catch (error) {
      return res
        .status(ERRORS.EXPIRED_TOKEN.code)
        .json(ERRORS.EXPIRED_TOKEN.json);
    }
  };
};
