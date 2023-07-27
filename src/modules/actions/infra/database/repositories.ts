import { Collection, Db } from 'mongodb';
import {
  IActionsRepositories,
  ICreateActionsRequest,
} from '../../helpers/types';

import { ActionsEntities } from './entities';
import { collections } from '../../../../shared/infra/database/mongoDb';

export class ActionsRepositories implements IActionsRepositories {
  actionsDb: Collection;

  constructor(db: Db) {
    this.actionsDb = db.collection(collections.actions);
  }

  async create({
    userId,
    petId,
    action,
    request,
    response,
  }: ICreateActionsRequest): Promise<ActionsEntities> {
    const actions = new ActionsEntities({
      userId,
      petId,
      action,
      request,
      response,
    });

    await this.actionsDb.insertOne({ ...actions });
    return actions;
  }
}