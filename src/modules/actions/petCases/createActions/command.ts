import { Db, ObjectId } from 'mongodb';

import { ActionsRepositories } from '../../infra/database/repositories';
import BaseCommand from '../../../../shared/commons/BaseCommand';

export interface IRequest {
  petId?: string;
  action: string;
  request: any;
  response: any;
}

export class CreateActionsCommand extends BaseCommand {
  actionsRepositories: ActionsRepositories;

  constructor(db: Db) {
    super();

    this.actionsRepositories = new ActionsRepositories(db);
  }

  async execute({ petId, action, request, response }: IRequest) {
    try {
      if (!petId) {
        const result = await this.actionsRepositories.create({
          action,
          request: {
            body: request.body,
            headers: request.headers,
            baseUrl: request.baseUrl,
            method: request.method,
          },
          response,
        });
        return result;
      } else {
        const result = await this.actionsRepositories.create({
          petId: new ObjectId(petId),
          action,
          request: {
            body: request.body,
            headers: request.headers,
            baseUrl: request.baseUrl,
            method: request.method,
          },
          response,
        });
        return result;
      }
    } catch (error) {
      this.handleException(error);
    }
  }
}