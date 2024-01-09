export const joiValidationOptions = {
  abortEarly: false, //when true, stops validation on the first error, otherwise returns all the errors found. Defaults to true.
  allowUnknown: false, //when true, allows object to contain unknown keys which are ignored. Defaults to false.
  debug: process.env.NODE_ENV === 'production' ? false : true, //when true, valid results and throw errors are decorated with a debug property which includes an array of the validation steps used to generate the returned result. Defaults to false.
  stripUnknown: false //remove unknown elements from objects and arrays. Defaults to false
}
