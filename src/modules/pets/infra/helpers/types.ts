import { ObjectId } from 'mongodb';
import { PetsEntities } from '../database/entities';

export interface ICreatePets {
  name: string;
  age: string;
  userId: string;
}

export interface IFindPetByName {
  name: string;
}

export interface IFindPetById {
  petId: ObjectId;
}

export interface IPetsRepositories {
  createPets(payload: ICreatePets): Promise<PetsEntities>;
  findPetsByName(
    payload: IFindPetByName,
  ): Promise<PetsEntities | undefined>;
  findArtcilesById({ petId }: IFindPetById): Promise<PetsEntities>;
}
