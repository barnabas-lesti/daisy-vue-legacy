import Vue from 'vue';

import {
  mdiViewDashboard,
  mdiFoodApple,
  mdiAccount,
  mdiCardsHeart,
  mdiWeightLifter,
  mdiCalculator,
  mdiMagnify,
  mdiFoodVariant,
  mdiClose,
  mdiCheck,
  mdiPlus,
  mdiDelete,
} from '@mdi/js';

const usedIcons = {
  mdiViewDashboard,
  mdiFoodApple,
  mdiAccount,
  mdiCardsHeart,
  mdiWeightLifter,
  mdiCalculator,
  mdiMagnify,
  mdiFoodVariant,
  mdiClose,
  mdiCheck,
  mdiPlus,
  mdiDelete,
};

Vue.prototype.$icons = usedIcons;

export default usedIcons;
