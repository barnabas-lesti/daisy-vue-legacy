import { router } from '../core/plugins';

router.addRoutes([
  {
    path: '/wallet',
    name: 'wallet',
    component: () => import(/* webpackChunkName: "wallet" */ './views/Wallet.vue'),
  },
  {
    path: '/wallet/new',
    name: 'newWalletItem',
    component: () => import(/* webpackChunkName: "wallet-item" */ './views/WalletItem.vue'),
  },
  {
    path: '/wallet/:itemId',
    name: 'walletItem',
    component: () => import(/* webpackChunkName: "wallet-item" */ './views/WalletItem.vue'),
  },
]);

router.addSidebarItems([
  {
    labelKey: 'wallet.views.wallet.title',
    icon: 'fas fa-wallet',
    routeToName: 'wallet',
    group: 0,
  },
]);
