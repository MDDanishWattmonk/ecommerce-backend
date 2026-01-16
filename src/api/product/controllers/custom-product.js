'use strict';

module.exports = {
  async addProduct(ctx) {
    const productData = ctx.request.body;
    const newProduct = await strapi
      .service('api::product.custom-product')
      .addProduct(productData);

    ctx.body = {
      success: true,
      data: newProduct,
    };
  },
  async inStock(ctx) {
    const products = await strapi
      .service('api::product.custom-product')
      .getInStock();

    ctx.body = {
      success: true,
      data: products,
    };
  },
  async getSingleProduct(ctx) {
    const { id } = ctx.params;
    const product = await strapi
      .service('api::product.custom-product')
      .getSingleProduct(id);

    if (!product) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        message: 'Product not found or inactive',
      };
      return;
    }
    
    ctx.body = {
      success: true,
      data: product,
    };
  },
  
  async updateStock(ctx) {
    const { id } = ctx.params;
    const { newStock } = ctx.request.body;

    if (newStock === undefined || isNaN(newStock) || newStock < 0) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'Invalid stock value',
      };
      return;
    }

    const updatedProduct = await strapi
      .service('api::product.custom-product')
      .updateProdutStock(id, newStock);

    ctx.body = {
      success: true,
      data: updatedProduct,
    };
  },
  async deleteProduct(ctx) {
    const { id } = ctx.params;
    const deletedProduct = await strapi
      .service('api::product.custom-product')
      .deleteProduct(id);

    ctx.body = {
      success: true,
      data: deletedProduct,
    };
  },
};