'use strict';

module.exports = {
  async addToCart(userId, productId, quantity) {
    const product = await strapi.entityService.findOne(
      'api::product.product',
      productId
    );

    if (!product || product.stock < quantity) {
      throw new Error('Product unavailable');
    }

   
    const existingItems = await strapi.entityService.findMany(
      'api::cart.cart',
      {
        filters: {
          user: { id: userId },
          product: { id: productId },
        },
      }
    );

    if (existingItems.length > 0) {
      
      const existingItem = existingItems[0];
      return await strapi.entityService.update(
        'api::cart.cart',
        existingItem.id,
        {
          data: {
            quantity: existingItem.quantity + quantity,
          },
        }
      );
    } else {
     
      return await strapi.entityService.create(
        'api::cart.cart',
        {
          data: {
            user: { id: userId },
            product: { id: productId },
            quantity,
          },
        }
      );
    }
  },

  async getCart(userId) {
    const cartItems = await strapi.entityService.findMany(
      'api::cart.cart',
      {
        filters: { user: { id: userId } },
        populate: {
          product: {
            populate: '*' 
          }
        },
      }
    );
    
   
    return cartItems.map(item => ({
      cartItemId: item.id, 
      product: item.product,
      quantity: item.quantity,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));
  },

 async removeProductFromCart(userId, cartItemId, quantity = 1) {

  const cartItems = await strapi.entityService.findMany(
    'api::cart.cart',
    {
      filters: {
        id: cartItemId,
        user: userId,
      },
      populate: ['product'],
      limit: 1,
    }
  );

  const cartItem = cartItems[0];

  if (!cartItem) {
    throw new Error('Cart item not found or unauthorized');
  }

  if (cartItem.quantity < quantity) {
    throw new Error('Insufficient quantity in cart');
  }

  if (cartItem.quantity === quantity) {
    await strapi.entityService.delete('api::cart.cart', cartItem.id);
    return {
      message: 'Product removed from cart successfully',
      removed: true,
    };
  }

  const updated = await strapi.entityService.update(
    'api::cart.cart',
    cartItem.id,
    {
      data: {
        quantity: cartItem.quantity - quantity,
      },
    }
  );

  return {
    message: 'Quantity reduced successfully',
    removed: false,
    remainingQuantity: updated.quantity,
  };
},  

};