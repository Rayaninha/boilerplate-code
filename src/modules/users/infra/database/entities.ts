import { BaseEntities } from '../../../../shared/commons/BaseEntities';
import { IRolesTypes } from '../../../../shared/commons/BaseController';

export class UsersEntities extends BaseEntities {
  name: string;

  email: string;

  password: string;

  role?: IRolesTypes;

  lastLogin?: Date;

  constructor({ name, email, password, role = 'resu' }: UsersEntities) {
    super();

    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.lastLogin = new Date(Date.now());
  }
}
