'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/products/addproduct',
      handler: 'custom-product.addProduct',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/products/in-stock',
      handler: 'custom-product.inStock',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/products/:id',
      handler: 'custom-product.getSingleProduct',
      config: { auth: false },
    },
    {
      method: 'PUT',
      path: '/products/:id/stock',
      handler: 'custom-product.updateStock',
      config: { auth: false },
    },
    {
      method: 'DELETE',
      path: '/products/:id',
      handler: 'custom-product.deleteProduct',
      config: { auth: false },
    }
  ],
};
