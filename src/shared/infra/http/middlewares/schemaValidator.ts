import { NextFunction, Request, Response } from 'express';

import Joi from 'joi';

export type ISchemaType = {
  body?: Joi.ObjectSchema<any>;
  params?: Joi.ObjectSchema<any>;
  query?: Joi.ObjectSchema<any>;
};

export const SchemaValidator = (schema: ISchemaType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: string[] = [];

    if (schema.body) {
      const body = schema.body.validate(req.body);
      if (body.error) {
        body.error.details.map((err) => errors.push(err.message));
      }
    } else if (schema.params) {
      const params = schema.params.validate(req.params);

      if (params.error) {
        params.error.details.map((err) => errors.push(err.message));
      }
    } else if (schema.query) {
      const query = schema.query.validate(req.query);

      if (query.error) {
        query.error.details.map((err) => errors.push(err.message));
      }
    }

    if (errors.length) {
      return res.status(400).json({ r: false, errors });
    }

    next();
  };
};
