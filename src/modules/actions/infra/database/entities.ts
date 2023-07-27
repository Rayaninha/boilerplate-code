import { Request, Response } from 'express';

import { BaseEntities } from '../../../../shared/commons/BaseEntities';
import { ObjectId } from 'mongodb';

export class ActionsEntities extends BaseEntities {
  userId?: ObjectId | null;

  petId?: ObjectId | null;

  action: string;

  request: Request;

  response: Response;

  constructor({ userId = null, petId = null, action, request, response }: ActionsEntities) {
    super();

    this.userId = userId;
    this.petId = petId;
    this.action = action;
    this.request = request;
    this.response = response;
  }
}