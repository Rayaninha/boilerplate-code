import { BaseEntities } from '../../../../shared/commons/BaseEntities';

export class PetsEntities extends BaseEntities {
  name: string;

  age: number;

  userId: string;

  constructor({ name, age, userId }: PetsEntities) {
    super();

    this.name = name;
    this.age = age;
    this.userId = userId;
  }
}
