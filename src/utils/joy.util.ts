import { joiValidationOptions } from '@/config/joi.config'
import { IJoiError, IJoiValidationError } from '@/types/validator.type'
import Joi from 'joi'
import { BadRequestError, UnprocessableEntityError } from './errors'

// Personalize error for Joi : https://joi.dev/api/?v=17.9.1#anyerrorerr

const schemaValidator = <T>(
  schema: Joi.ObjectSchema<T>,
  request: T,
  useJoiError = true
): any => {
  const { error, value } = schema.validate(request, joiValidationOptions)
  if (error) {
    const joiError: IJoiError = {
      error: {
        original: error._original,
        details: error.details.map(
          ({ message, type }: IJoiValidationError) => ({
            message: message.replace(/['"]/g, ''),
            type
          })
        )
      }
    }
    throw useJoiError
      ? new UnprocessableEntityError(JSON.stringify(joiError))
      : new BadRequestError(
          'Invalid request. Please review request and try again.'
        )
  }
  // validation successful
  return value
}

export default schemaValidator
