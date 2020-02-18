import Vue from 'vue';

import {
  mdiViewDashboard,
  mdiFoodApple,
  mdiAccount,
  mdiCardsHeart,
  mdiWeightLifter,
  mdiCalculator,
} from '@mdi/js';

const usedIcons = {
  mdiViewDashboard,
  mdiFoodApple,
  mdiAccount,
  mdiCardsHeart,
  mdiWeightLifter,
  mdiCalculator,
};

Vue.prototype.$icons = usedIcons;

export default usedIcons;
