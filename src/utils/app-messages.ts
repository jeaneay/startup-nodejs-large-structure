const ACCESS_SECTION = 'Please log in, before accessing this section.';

export const general = {
  SUCCESS_SAVED_DATA: `Your change has been successfully completed.`,
  SUCCESS_DELETE_DATA: `Successful removal.`,
  ERROR_AUTHENTICATED: `G001 - ${ACCESS_SECTION}`,
  ERROR_ADMIN: `G002 - ${ACCESS_SECTION}`,
  ERROR_GENERAL: 'Impossible to access your request, please contact us.',
  ERROR_NOT_URL: (field: string, value?: string | number) => {
    return `This ${field} ${value} is not an url !`;
  },
  ERROR_VALUE_TOO_LONG: (field: string, value?: string | number) => {
    return `This ${field} ${value} is too long !`;
  },
  ERROR_VALUE_TOO_SHORT: (field: string, value?: string | number) => {
    return `This ${field} ${value} is too short !`;
  },
  ERROR_VALUE_SIZE: (field: string, min: number, max: number) => {
    return `The size for ${field} must be between ${min} and ${max} character !`;
  },
  ERROR_ENUM_VALUE: (field: string, value?: string | number) => {
    return `This ${field} must have one of these values ${value} !`;
  },
  ERROR_VALUE: (field: string) => {
    return `Your ${field} is not correct.`;
  },
  ERROR_VALUE_EMPTY: (field: string) => {
    return `This ${field} must be not empty !`;
  },
  ERROR_VALUE_NULL: (field: string) => {
    return `This ${field} must be not null !`;
  },
  ERROR_VALUE_DATE: (field: string) => {
    return `Your ${field} must be a date !`;
  },
  ERROR_VALUE_INTEGER: (field: string) => {
    return `Your ${field} must be a integer !`;
  },
  SIMPLE_ERROR_MESSAGE: (field: string) => {
    return `An error is detected with the field ${field} verify the value !`;
  },
};

export const server = {
  ERROR_ACCESS_DENIED: "Access denied. You don't have the authorisations.",
  ERROR_SESSION_EXPIRED: 'Your session has expired, please log in again',
  ERROR_NOT_TOKEN: 'Access denied. No token provided !',
  ERROR_INCORRECT_TOKEN: 'Incorrect token or it is expired.',
  ERROR_NOT_XSRF_TOKEN: 'Access denied. No xsrf token provided !',
  ERROR_BAD_XSRF_TOKEN: 'Access denied. Bad xsrf token !',
  ERROR_SIGNIN: `Unable to log in, Please check your informations.`,
  ERROR_SIGNUP: 'Unable to register, please try again later or contact us.',
  ERROR_SENDING_EMAIL: `Email could not be sent.`,

  ERROR_UPLOAD_FILE: `Invalid file type, only PDF and WORD (.doc, .docx) are allowed !`,
  ERROR_UPLOAD_IMAGE: `Invalid file type, only JPEG (.jpg, .jpeg) and PNG is allowed !`,

  MISSED_INFOS: `There is missing information.`,

  SUCCESS_SIGNIN: `User was registered successfully.`,
  SUCCESS_EMAIL_SENT: `The email has been sent.`,

  SUCCESS_RECORD: (field: string) => {
    return `Your ${field} has been recorded !`;
  },
  SUCCESS_DELETE_RECORD: (field: string) => {
    return `This ${field} has been deleted !`;
  },
  SUCCESS_UPDATE_RECORD: (field: string) => {
    return `This ${field} has been modify !`;
  },
  ERROR_SAVE_RECORD: (field: string) => {
    return `Impossible to save this ${field} !`;
  },
  ERROR_DELETE_RECORD: (field: string) => {
    return `Cannot delete this ${field} check if exist !`;
  },
  ERROR_UPDATE_RECORD: (field: string) => {
    return `Cannot modify this ${field} !`;
  },
  ERROR_RECORD_ALREADY_EXITS: (field: string, value?: string | number) => {
    return `This ${field} ${value} already exits !`;
  },
  ERROR_BAD_RIGHT: (field: string) => {
    return `Access denied. You are not the right ${field} !`;
  },
  ERROR_NOT_EXIST: (field: string, value?: string | number) => {
    return `This ${field} does not exist !`;
  },
  ERROR_FILE_NOT_FOUND: (field: string, value?: string | number) => {
    return `File ${field} not found !`;
  },
};

export const sequelize = {
  SERVER_CONNECTED: (dbName: string) => {
    return `Postgresql database "${dbName}" connection is open !`;
  },
  SERVER_ERROR: (dbName: string, error?: string) => {
    return `Postgresql database "${dbName}" connection has occured "${error}" error.`;
  },
  SERVER_DISCONNECTED: (dbName: string) => {
    return `Postgresql database "${dbName}" connection is disconnected.`;
  },
  SERVER_SIGINT: (dbName: string) => {
    return `Postgresql database "${dbName}" connection disconnected through app termination.`;
  },
  ERROR_PROPERTY_NOT_VALID: (field: string, value?: string | number) => {
    return `The ${field} ${value} is not valid !`;
  },
  ERROR_PROPERTY_ALREADY_EXITS: (field: string, value?: string | number) => {
    return `This ${field} ${value} already exits !`;
  },
};

export const user = {
  SUCCESS_ACCOUNT_VALIDATE: `Your account has been validated.`,
  SUCCESS_PASSWORD_CHANGED: `The password has been changed.`,

  ERROR_LOGIN: `Unable to log in, please check your email address or password.`,
  ERROR_MDP: `Unable to log in, please check your password or email address.`,
  ERROR_EMAIL_NOT_VERIFIED: `Unable to log in, please confirm your account with the email sent to your email address.`,
  ERROR_PASSWORD: 'Your password must be at least 6 characters long.',
  ERROR_BIRTHDAY: 'Your birthday must be a date.',

  ERROR_ACCOUNT_ALREADY_VALIDATED: 'Your account has already been validated.',

  ERROR_ACCOUNT_NOT_FOUND: 'Account error not found.',
  ERROR_TOKEN_RESET_PASSWORD_NOT_FOUND:
    'Account with this token does not exist.',
  ERROR_ATTEMPT_SEND_EMAIL:
    'You have used all attempts to send an email, contact us.',
  ERROR_EMAIL_MUST_CONFIRMED: 'Your email must be confirmed.',

  START_DATE: 'Your start date must be a date.',
  END_DATE: 'Your end date must be a date.',

  FIRSTNAME_TOO_SHORT: 'Your firstname must be at least 2 characters long.',
  LASTNAME_TOO_SHORT: 'Your lastname must be at least 2 characters long.',
};

export const company = {
  ERROR_DATE_CREATED: 'Your date of creation must be a date.',
  ERROR_USER_NOT_PART_COMPANY: 'You are not part of this company.',
};

export const applicantRespondsOffer = {
  SUCCESS_RESPONSE_ACCEPTED: 'The response has been accepted.',
  SUCCESS_RESPONSE_REJECTED: 'The response has been rejected.',
};
