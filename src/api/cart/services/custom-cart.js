'use strict';

module.exports = {
async addToCart(userId, productId, quantity) {
  if (quantity <= 0) {
    throw new Error('Quantity must be greater than zero');
  }

  const product = await strapi.entityService.findOne(
    'api::product.product',
    productId
  );

  if (!product || !product.isActive) {
    throw new Error('Product unavailable');
  }

  const existingItems = await strapi.entityService.findMany(
    'api::cart.cart',
    {
      filters: {
        user: { id: userId },
        product: { id: productId },
      },
      limit: 1,
    }
  );

  let finalQuantity = quantity;

  if (existingItems.length > 0) {
    finalQuantity = existingItems[0].quantity + quantity;
  }


  if (finalQuantity > product.stock) {
    throw new Error(`Only ${product.stock} items available in stock`);
  }

  if (existingItems.length > 0) {
    return await strapi.entityService.update(
      'api::cart.cart',
      existingItems[0].id,
      {
        data: {
          quantity: finalQuantity,
        },
      }
    );
  }

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
},


  async getCart(userId) {
    const cartItems = await strapi.entityService.findMany(
      'api::cart.cart',
      {
        filters: { user: { id: userId } },
        populate: {
          product: {
              fields: ['name', 'price', 'description'],
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