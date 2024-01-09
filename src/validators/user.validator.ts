import Joi from 'joi'

const PASSWORD_REGEX = new RegExp(
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!.@#$%^&*])(?=.{8,})'
)

class UserValidator {
  static signinSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(PASSWORD_REGEX).min(8).required()
  })

  static userIdSchema = Joi.object().keys({
    userId: Joi.number().integer().positive().required()
  })
}

export default UserValidator
