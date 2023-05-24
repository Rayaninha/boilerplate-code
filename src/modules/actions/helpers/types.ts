import { ActionsEntities } from '../infra/database/entities';
import { ObjectId } from 'mongodb';

export interface ICreateActionsRequest {
  userId?: ObjectId;
  action: string;
  request: any;
  response: any;
}

export interface IActionsRepositories {
  create(payload: ICreateActionsRequest): Promise<ActionsEntities>;
}
