import router from './routes';
import { loadModels } from '../config';
import { DbInterface } from '../config/load-models';
//import createSeed from "../../seeds";

// Load routes
const routes = router;
// Allow to drop and recreate all tables only development
const eraseTable = false;
// Create models
const db: DbInterface = loadModels(eraseTable);

if (process.env.NODE_ENV === 'development') {
  //Create fake datas
  if (eraseTable) {
    setTimeout(() => {
      //createSeed()
    }, 4000);
  }
}

export { routes, db };
