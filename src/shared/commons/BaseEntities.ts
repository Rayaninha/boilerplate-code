import { ObjectId } from 'mongodb';

export class BaseEntities {
  createdAt?: Date;

  updatedAt?: Date;

  _id?: ObjectId;

  constructor() {
    this._id = new ObjectId();
    this.createdAt = new Date(Date.now());
    this.updatedAt = new Date(Date.now());
  }
}
