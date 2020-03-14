import auth from './auth';
import common from './common';
import diary from './diary';
import diet from './diet';

export default {
  ...auth,
  ...common,
  ...diary,
  ...diet,
};
