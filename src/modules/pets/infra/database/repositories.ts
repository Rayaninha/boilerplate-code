import { Collection, Db } from 'mongodb';
import {
  ICreatePets,
  IPetsRepositories,
  IFindPetByName,
} from '../helpers/types';

import { PetsEntities } from './entities';
import { collections } from '../../../../shared/infra/database/mongoDb';

export class PetsRepositories implements IPetsRepositories {
  db: Db;

  petsDb: Collection;

  constructor(db: Db) {
    this.db = db;

    this.petsDb = this.db.collection(collections.pets);
  }

  async createPets(payload: ICreatePets): Promise<PetsEntities> {
    const pet = new PetsEntities({ ...payload });
    await this.petsDb.insertOne(pet);
    return pet;
  }

  async findPetByName({ name, userId }: IFindPetByName): Promise<PetsEntities> {
    const pet = ((await this.petsDb.findOne({
      name: name,
      userId: userId
    })) as unknown) as PetsEntities;
    return pet; 
  }
}
