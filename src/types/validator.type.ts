export interface IJoiValidationError {
  message: string
  type: string
}

export interface IJoiError {
  error: {
    original: unknown
    details: IJoiValidationError[]
  }
}

export interface IJoiCustomError {
  status: string
  error: string
}

const supportedMethods = ['post', 'put', 'patch', 'delete']
