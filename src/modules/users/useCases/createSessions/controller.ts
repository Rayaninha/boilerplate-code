import BaseController, {
  ControllerMethodType,
} from '../../../../shared/commons/BaseController';
import { Request, Response } from 'express';

import { ACTIONS_TYPES } from '../../../../shared/commons/constants';
import { CreateSessionsCommand as Command } from './command';
import { CreateActionsCommand } from '../../../actions/useCases/createActions/command';
import { Db } from 'mongodb';
import Joi from 'joi';

export class CreateSessionsController extends BaseController {
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
      },
      schema: {
        body: Joi.object({
          email: Joi.string()
            .required()
            .email(),
          password: Joi.string().required(),
        }),
      },
      fn: async (req: Request, res: Response): Promise<unknown> => {
        try {
          const { email, password } = req.body;

          const command = new Command(this.db);

          const result = await command.execute({
            email,
            password,
          });

          if (command.isValid()) {
            await this.createActionsCommand.execute({
              action: ACTIONS_TYPES.USER_LOGIN,
              request: req,
              response: result,
            });

            return this.Ok(res, result);
          }

          await this.createActionsCommand.execute({
            action: ACTIONS_TYPES.USER_LOGIN,
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
