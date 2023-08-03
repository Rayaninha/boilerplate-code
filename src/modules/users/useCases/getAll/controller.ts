// import BaseController, { ControllerMethodType } from '../../../../shared/commons/BaseController';
// import { Request, Response } from 'express';
// import { GetAllUsersCommand as Command } from './command';
// import { Db } from 'mongodb';
// import Joi from 'joi';
// import {
//   ACTIONS_TYPES,
//   ROLES_TYPES,
// } from '../../../../shared/commons/constants';
// import { CreateActionsCommand } from '../../../actions/useCases/createActions/command';

// export class GetAllUsersController extends BaseController {
//   db: Db;

//   createActionsCommand: CreateActionsCommand;

//   constructor(db: Db) {
//     super();

//     this.db = db;

//     this.createActionsCommand = new CreateActionsCommand(db);
//   }

//   get handle(): ControllerMethodType {
//     return {
//       auth: {
//         // roles: [],
//         roles: [ROLES_TYPES.ROOT, ROLES_TYPES.MANAGER, ROLES_TYPES.USER],
//       },
//       schema: {},
//       fn: async (req: Request, res: Response): Promise<unknown> => {
//         try {
//           const { _id } = req.user;

//           const command = new Command(this.db);

//           const result = await command.execute({ _id });

//           if (command.isValid()) {
//             await this.createActionsCommand.execute({
//               // userId: _id, // create first new user
//               action: ACTIONS_TYPES.GET_ALL_USER,
//               request: req,
//               response: result,
//             });

//             return this.Ok(res, result);
//           }

//           await this.createActionsCommand.execute({
//             // userId: _id, // create first new user
//             action: ACTIONS_TYPES.GET_ALL_USER,
//             request: req,
//             response: command.errors,
//           });

//           return this.Fail(res, result, command.errors);
//         } catch (error) {
//           return this.BadRequest(res, JSON.stringify(error));
//         }
//       },
//     };
//   }
// }
