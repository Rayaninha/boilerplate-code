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
        roles: [],
      },
      schema: {
        body: Joi.object({
          name: Joi.string().required(),
          age: Joi.number().integer().required(),
        }),
      },
      fn: async (req: Request, res: Response): Promise<unknown> => {
        try {
          const { name, age } = req.body;
          // const { _id } = req.user; // first test
          const userId = req.user?._id;

          const command = new Command(this.db);

          const result = await command.execute({
            name,
            age,
            userId
          });

          if (command.isValid()) {
            await this.createActionsCommand.execute({
              // petId: _id, // first test
              action: ACTIONS_TYPES.NEW_PET_CREATED,
              request: req,
              response: result,
            });

            return this.Ok(res, result);
          }

          await this.createActionsCommand.execute({
            // petId: _id, // first test
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
