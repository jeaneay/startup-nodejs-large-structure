import * as ctrlUser from './controller-user';
import * as ctrlUserRessources from './controller-user-ressources';
import * as ctrlUserFirstConnection from './controller-user-first-connection';

export default {
  ...ctrlUser,
  ...ctrlUserRessources,
  ...ctrlUserFirstConnection,
};
