'use strict';

module.exports = {

  async place(ctx) {
    const user = ctx.state.user;

    const order = await strapi
      .service('api::order.custom-order')
      .placeOrder(user.id);

    ctx.body = {
      success: true,
      message: 'Order placed successfully',
      data: order,
    };
  },

  async myOrders(ctx) {
    const user = ctx.state.user;

    const orders = await strapi
      .service('api::order.custom-order')
      .getMyOrders(user.id);

    ctx.body = {
      success: true,
      data: orders,
    };
  },
};
