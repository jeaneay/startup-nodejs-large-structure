import { database } from '.';
import { createModels, logger } from '../utils';

export interface DbInterface {
  [x: string]: any;
}

const loadModels = (eraseTable: boolean): DbInterface => {
  // Start connexion
  const sequelize = database.startDb();

  // load of models
  const db: any = {
    sequelize,
  };
  const listModels = createModels(sequelize);
  listModels.map((model) => {
    Object.assign(db, model);
  });

  // load associate
  Object.values(db).forEach((model: any) => {
    if (model.associate) {
      model.associate(db);
    }
  });

  // Create tables
  if (process.env.NODE_ENV === 'development') {
    //We can use Force, Alter
    db.sequelize
      .sync({ force: eraseTable })
      .then(async () => {
        console.log(logger.useChalk(`All tables has been created.`, 'success'));
        eraseTable
          ? console.log(
              logger.useChalk(`Loading we create all data seed.`, 'info'),
            )
          : null;
      })
      .catch((err: any) => console.log(err));
  }

  return db;
};

export default loadModels;
