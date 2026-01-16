'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/cart/add',  
      handler: 'custom-cart.addToCart', 
    },
    {
      method: 'GET',
      path: '/cart/my-cart', 
      handler: 'custom-cart.getMyCart', 
    },
{
  method: 'DELETE',
  path: '/cart/remove/:cartItemId',
  handler: 'custom-cart.removeFromCart',
}

  ]
};