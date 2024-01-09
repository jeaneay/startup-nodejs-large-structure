import schemaValidator from '@/utils/joy.util'
import express from 'express'
import Joi from 'joi'

interface IExpressRequestOverrides extends express.Request {
  value?: {
    body?: any
  }
}

const validateRequest = (schema: Joi.ObjectSchema<any>, useJoiError = true) => {
  return (
    req: IExpressRequestOverrides,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const value = schemaValidator(schema, req.body, useJoiError)
    if (!req?.value) {
      req.value = {}
    }
    // Or req.body = result.value;
    req.value['body'] = value
    next()
  }
}

export default validateRequest
