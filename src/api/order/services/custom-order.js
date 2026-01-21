'use strict';

module.exports = {

  async placeOrder(userId) {

    const cartItems = await strapi.entityService.findMany(
      'api::cart.cart',
      {
        filters: { user: userId },
        populate: ['product'],
      }
    );

    if (!cartItems.length) {
      throw new Error('Cart is empty');
    }

    for (const item of cartItems) {
      if (!item.product || !item.product.isActive) {
        throw new Error('Product unavailable');
      }

      if (item.quantity > item.product.stock) {
        throw new Error(
          `Only ${item.product.stock} items left for ${item.product.title}`
        );
      }
    }

    let totalAmount = 0;
    cartItems.forEach(item => {
      totalAmount += item.product.price * item.quantity;
    });

for (const item of cartItems) {

  const freshProduct = await strapi.entityService.findOne(
    'api::product.product',
    item.product.id
  );

  console.log(
    'Reducing stock:',
    freshProduct.stock,
    '->',
    freshProduct.stock - item.quantity
  );

  await strapi
    .service('api::product.custom-product')
    .updateProdutStock(
      freshProduct.id,
      freshProduct.stock - item.quantity
    );
}


    const order = await strapi.entityService.create(
      'api::order.order',
      {
        data: {
          user: userId,
          totalAmount,
          status: 'PLACED',
          order_items: [],
        },
      }
    );

    for (const item of cartItems) {
      await strapi.entityService.create(
        'api::order-item.order-item',
        {
          data: {
            // myOrders: order.id,
            orders: order.id,
            product: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          },
        }
      );
    }

    for (const item of cartItems) {
      await strapi.entityService.delete(
        'api::cart.cart',
        item.id
      );
    }

    return order;
  },

  async getMyOrders(userId) {
    return await strapi.entityService.findMany(
      'api::order.order',
      {
        filters: { user: userId },
        populate: {
          order_items: {
            populate: ['product'],
          },
        },
      }
    );
  },
};
