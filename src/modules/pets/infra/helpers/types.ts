import { PetsEntities } from '../database/entities';

export interface ICreatePets {
  name: string;
  age: number;
}

export interface IPetsRepositories {
  createPets(payload: ICreatePets): Promise<PetsEntities>;
}
