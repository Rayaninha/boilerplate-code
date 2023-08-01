import BaseController, { ControllerMethodType } from '../../../../shared/commons/BaseController';
import { Request, Response } from 'express';
import { DeleteUsersCommand as Command } from './command';
import { Db } from 'mongodb';
import Joi from 'joi';
import {
  ROLES_TYPES,
} from '../../../../shared/commons/constants';

export class DeleteUsersController extends BaseController {
  db: Db;

  constructor(db: Db) {
    super();
    this.db = db;
  }

  get handle(): ControllerMethodType {
    return {
      auth: {
        // roles: [],
        roles: [ROLES_TYPES.ROOT, ROLES_TYPES.MANAGER, ROLES_TYPES.USER],
      },
      schema: {},
      fn: async (req: Request, res: Response): Promise<unknown> => {
        try {
          const { _id } = req.user;

          const command = new Command(this.db);

          const result = await command.execute({ _id });

          if (command.isValid()) {
            return this.Ok(res, { message: 'Usuário excluído com sucesso.' });
          }

          return this.Fail(res, result, command.errors);
        } catch (error) {
          return this.BadRequest(res, JSON.stringify(error));
        }
      },
    };
  }
}
