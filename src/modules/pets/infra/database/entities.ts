import { BaseEntities } from '../../../../shared/commons/BaseEntities';
import { IRolesTypes } from '../../../../shared/commons/BaseController';

export class PetsEntities extends BaseEntities {
  name: string;

  age: number;

  constructor({ name, age }: PetsEntities) {
    super();

    this.name = name;
    this.age = age;
  }
}
