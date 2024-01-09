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
    prisma: string;
    utils: string;
    email: string;
  }
  