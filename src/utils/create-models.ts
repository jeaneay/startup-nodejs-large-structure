import * as Sequelize from 'sequelize';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import { Model } from 'sequelize';

type ListModel = {
  [x: string]: Model;
};

const APP_ROOT = process.env.PWD + '/dist/modules';
/*
    For retrieve all model we need to create for each component directory a "models" directory
    And this directory create only file model
*/
const createModels = (sequelize: Sequelize.Sequelize): ListModel[] => {
  //Filter directory where are the components for retrieve only Model
  const listModels = fs
    .readdirSync(APP_ROOT)
    .filter((dir) => {
      //Check if is directory and not file for remove file
      return fs.lstatSync(APP_ROOT + '/' + dir).isDirectory();
    })
    .map((dirNameComponent) => {
      //Get directory models for all components
      const dir = APP_ROOT + '/' + dirNameComponent + '/models';
      const listDirModels = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
      /*This reduce allow to get array of model with this format :
            [
                [{ nameModel : Model }]
                [{ nameModel : Model }, { nameModel : Model }]
            ]
        */
      return listDirModels.reduce<ListModel[]>(
        (acc: ListModel[], fileNameModel: string): ListModel[] => {
          //Remove all file aren't .js
          if (fileNameModel.slice(-3) !== '.js') {
            return acc;
          }
          if (
            fs.existsSync(
              path.join(
                APP_ROOT,
                dirNameComponent,
                'models',
                fileNameModel.replace('.js', ''),
              ),
            )
          ) {
            return acc;
          }
          //Retrieve file model and inject sequelize instance
          const model = require(path.join(
            APP_ROOT,
            dirNameComponent,
            'models',
            fileNameModel.replace('.js', ''),
          ))(sequelize);
          //We retrieve only name of file exemple : forum-category.js => ForumCategory
          const nameModel = fileNameModel
            .replace('.js', '')
            .split('-')
            .map((name) => _.capitalize(name))
            .join('');
          //And push in new array
          acc.push({ [nameModel]: model });
          return acc;
        },
        [],
      );
    });

  //Transform listModel to array of object
  return _.flattenDeep(listModels);
};

export default createModels;
