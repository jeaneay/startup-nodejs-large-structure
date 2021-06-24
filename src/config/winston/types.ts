export interface MessageLog {
  level?: string;
  label?: string;
  message?: string;
  user?: string;
  adressip?: string;
}

export interface ILabel {
  user: string;
  node: string;
  express: string;
  postgres: string;
  sequelize: string;
  helpers: string;
  email: string;
  sendinblue: string;
}
