import {
  ACTIONS_TYPES,
  ROLES_TYPES,
} from '../../../../shared/commons/constants';
import BaseController, {
  ControllerMethodType,
} from '../../../../shared/commons/BaseController';
import { Request, Response } from 'express';

import { CreatePetsCommand as Command } from './command';
import { CreateActionsCommand } from '../../../actions/useCases/createActions/command';
import { Db } from 'mongodb';
import Joi from 'joi';

export class CreatePetsController extends BaseController {
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
        // roles: [],
        roles: [ROLES_TYPES.ROOT, ROLES_TYPES.MANAGER, ROLES_TYPES.USER],
      },
      // validando os dados
      schema: {
        body: Joi.object({
          name: Joi.string().required(),
          age: Joi.number().required(),
          userId: Joi.string().required(),
        }),
      },
      fn: async (req: Request, res: Response): Promise<unknown> => {
        try {
          const { name, age, userId } = req.body;
          const { _id } = req.user;

          const command = new Command(this.db);

          const result = await command.execute({
            name,
            age,
            userId,
          });

          if (command.isValid()) {
            await this.createActionsCommand.execute({
              userId: _id,
              action: ACTIONS_TYPES.NEW_PET_CREATED,
              request: req,
              response: result,
            });

            return this.Ok(res, result);
          }

          await this.createActionsCommand.execute({
            userId: _id,
            action: ACTIONS_TYPES.NEW_PET_CREATED,
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
