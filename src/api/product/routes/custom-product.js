'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/products/addproduct',
      handler: 'custom-product.addProduct',
      
    },
    {
      method: 'GET',
      path: '/products/in-stock',
      handler: 'custom-product.inStock',
      
    },
    {
      method: 'GET',
      path: '/admin/products/insights',
      handler: 'custom-product.productInsights',
      config: {
        auth: {
          scope: ['admin'],
        },
      },
    },

    {
      method: 'GET',
      path: '/products/name/:name',
      handler: 'custom-product.getSingleProductByName',
      
    },
    {
      method: 'GET',
      path: '/products/:id',
      handler: 'custom-product.getSingleProduct',
      
    },

    {
      method: 'PUT',
      path: '/products/:id/stock',
      handler: 'custom-product.updateStock',
      config: {
        auth: {
          scope: ['admin'],
        },
      },
    },
    {
      method: 'DELETE',
      path: '/products/:id',
      handler: 'custom-product.deleteProduct',
      config: {
        auth: {
          scope: ['admin'],
        },
      },
    }
  ],
};
