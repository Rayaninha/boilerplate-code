import { BaseEntities } from '../../../../shared/commons/BaseEntities';
import { IRolesTypes } from '../../../../shared/commons/BaseController';

export class PetsEntities extends BaseEntities {
  name: string;

  age: string;

  userId: string;

  constructor({ name, age, userId }: PetsEntities) {
    super();

    this.name = name;
    this.age = age;
    this.userId = userId;
  }
}
