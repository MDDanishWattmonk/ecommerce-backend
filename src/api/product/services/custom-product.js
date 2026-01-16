'use strict';

module.exports = {

  async addProduct(productData) {
    return await strapi.entityService.create(
      'api::product.product',{
        data: productData,
      }
    )
  },
  async getInStock() {
    return await strapi.entityService.findMany(
      'api::product.product',
      {
        filters: {
          stock: { $gt: 0 },
          isActive: true,
        },
      }
    );
  },
  async getSingleProduct(productId) {
    return await strapi.entityService.findOne(
      'api::product.product', productId, {
        filters: { isActive: true, },
      }
    )
  },

  async updateProdutStock(productId, newStock) {
    return await strapi.entityService.update(
      'api::product.product', productId, {
        data: { stock: newStock, },
      }
    );
  },

  async deleteProduct(productId) {
    return await strapi.entityService.delete(
      'api::product.product', productId
    );
  },
};
