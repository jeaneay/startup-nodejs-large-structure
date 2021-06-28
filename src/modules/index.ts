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


export { routes, db };
