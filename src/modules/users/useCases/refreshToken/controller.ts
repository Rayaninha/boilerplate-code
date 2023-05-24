import BaseController, {
  ControllerMethodType,
} from '../../../../shared/commons/BaseController';
import { Request, Response } from 'express';

import { ACTIONS_TYPES } from '../../../../shared/commons/constants';
import { RefreshTokenCommand as Command } from './command';
import { CreateActionsCommand } from '../../../actions/useCases/createActions/command';
import { Db } from 'mongodb';
import Joi from 'joi';

export class RefresnTokenController extends BaseController {
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
          lastToken: Joi.string().required(),
        }),
      },
      fn: async (req: Request, res: Response): Promise<unknown> => {
        try {
          const { lastToken } = req.body;

          const command = new Command(this.db);

          const result = await command.execute({ lastToken });

          if (command.isValid()) {
            await this.createActionsCommand.execute({
              action: ACTIONS_TYPES.USER_REFRESH_TOKEN,
              request: req,
              response: result,
            });

            return this.Ok(res, result);
          }

          await this.createActionsCommand.execute({
            action: ACTIONS_TYPES.USER_REFRESH_TOKEN,
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
