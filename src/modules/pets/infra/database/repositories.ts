import { Collection, Db } from 'mongodb';
import {
  ICreatePets,
  IFindPetById,
  IPetsRepositories,
} from '../helpers/types';

import { PetsEntities } from './entities';
import { collections } from '../../../../shared/infra/database/mongoDb';

export class PetsRepositories implements IPetsRepositories {
  db: Db;

  petsDb: Collection;

  constructor(db: Db) {
    this.db = db;

    this.petsDb = this.db.collection(collections.users);
  }

  findArtcilesById({ petId }: IFindPetById): Promise<PetsEntities> {
    throw new Error('Method not implemented.');
  }

  async createPets(payload: ICreatePets): Promise<PetsEntities> {
    const pet = new PetsEntities({ ...payload });
    await this.petsDb.insertOne(pet);
    return pet;
  }

  async findPetById({ petId }: IFindPetById): Promise<PetsEntities> {
    const pet = ((await this.petsDb.findOne({
      _id: petId,
    })) as unknown) as PetsEntities;
    return pet;
  }
}
