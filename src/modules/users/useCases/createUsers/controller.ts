import {
  ACTIONS_TYPES,
  ROLES_TYPES,
} from '../../../../shared/commons/constants';
import BaseController, {
  ControllerMethodType,
} from '../../../../shared/commons/BaseController';
import { Request, Response } from 'express';

import { CreateUsersCommand as Command } from './command';
import { CreateActionsCommand } from '../../../actions/useCases/createActions/command';
import { Db } from 'mongodb';
import Joi from 'joi';

export class CreateUsersController extends BaseController {
  db: Db;

  createActionsCommand: CreateActionsCommand;

  constructor(db: Db) {
    super();

    this.db = db;

    this.createActionsCommand = new CreateActionsCommand(db);
  }

  get handle(): ControllerMethodType {
    return {
      auth: {
        roles: [],
        // roles: [ROLES_TYPES.ROOT, ROLES_TYPES.MANAGER, ROLES_TYPES.USER],
      },
      schema: {
        body: Joi.object({
          name: Joi.string().required(),
          email: Joi.string()
            .required()
            .email(),
          password: Joi.string().required(),
          role: Joi.string().required(),
        }),
      },
      fn: async (req: Request, res: Response): Promise<unknown> => {
        try {
          const { name, email, password, role } = req.body;
          // const { _id } = req.user; // create first new user

          const command = new Command(this.db);

          const result = await command.execute({
            name,
            email,
            password,
            role,
          });

          if (command.isValid()) {
            await this.createActionsCommand.execute({
              // userId: _id, // create first new user
              action: ACTIONS_TYPES.NEW_USER_CREATED,
              request: req,
              response: result,
            });

            return this.Ok(res, result);
          }

          await this.createActionsCommand.execute({
            // userId: _id, // create first new user
            action: ACTIONS_TYPES.NEW_USER_CREATED,
            request: req,
            response: command.errors,
          });

          return this.Fail(res, result, command.errors);
        } catch (error) {
          return this.BadRequest(res, JSON.stringify(error));
        }
      },
    };
  }
}
