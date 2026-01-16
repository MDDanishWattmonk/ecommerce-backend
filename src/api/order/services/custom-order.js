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

   
    let totalAmount = 0;
    cartItems.forEach(item => {
      totalAmount += item.product.price * item.quantity;
    });

    
    const order = await strapi.entityService.create(
      'api::order.order',
      {
        data: {
          user: userId,
          totalAmount,
          status: 'PLACED',
        },
      }
    );

   
    for (const item of cartItems) {
      await strapi.entityService.create(
        'api::order-item.order-item',
        {
          data: {
            order: order.id,
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
          items: {
            populate: ['product'],
          },
        },
      }
    );
  },
};
