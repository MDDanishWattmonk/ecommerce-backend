'use strict';

module.exports = {
  async addToCart(ctx) {
    try {
      const user = ctx.state.user;
      const { productId, quantity } = ctx.request.body;

      if (!productId || !quantity) {
        return ctx.badRequest('Product ID and quantity are required');
      }

      const result = await strapi
        .service('api::cart.custom-cart')
        .addToCart(user.id, productId, quantity);

      return {
        success: true,
        data: result
      };
    } catch (error) {
      return ctx.badRequest(error.message);
    }
  },

  async getMyCart(ctx) {
    try {
      const user = ctx.state.user;

      const cart = await strapi
        .service('api::cart.custom-cart')
        .getCart(user.id);

      return {
        success: true,
        data: cart
      };
    } catch (error) {
      return ctx.badRequest(error.message);
    }
  },

async removeFromCart(ctx) {
  const user = ctx.state.user;

  if (!user) {
    return ctx.unauthorized('Login required');
  }

  const { cartItemId } = ctx.params;
  const quantity = Number(ctx.query.quantity || 1);

  const result = await strapi
    .service('api::cart.custom-cart')
    .removeProductFromCart(user.id, cartItemId, quantity);

  ctx.body = {
    success: true,
    data: result
  };
},
};