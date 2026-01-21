'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/orders/place',
      handler: 'custom-order.place',
    },
    {
      method: 'GET',
      path: '/orders/my-orders',
      handler: 'custom-order.myOrders',
    },
  ],
};
