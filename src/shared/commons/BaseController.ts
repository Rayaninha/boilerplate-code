import { Request, Response } from 'express';

import { ISchemaType } from '../infra/http/middlewares/schemaValidator';

export type IRolesTypes = 'toor' | 'resu' | 'reganam' | 'etailiffa' | 'renwo';

export type IAuthType = {
  roles: string[];
};

export type ControllerMethodType = {
  auth: IAuthType;
  schema: ISchemaType;
  fn: (req: Request, resp: Response) => Promise<unknown>;
};

export default class BaseController {
  Redirect(res: Response, url: string): void {
    res.redirect(url);
  }

  Ok(res: Response, result: unknown): void {
    res.status(200).send({
      r: true,
      data: result,
    });
  }

  Fail(res: Response, _: unknown, errors: Array<string>): void {
    res.status(400).send({
      r: false,
      errors,
    });
  }

  BadRequest(res: Response, errors: any): void {
    const errorType = errors?.name;
    let error = null;

    switch (errorType) {
      case 'ValidationError':
        error = errors.errors;
        break;
      default:
        error = errors;
        break;
    }

    res.status(400).json({
      r: false,
      errors: error,
    });
  }
}
