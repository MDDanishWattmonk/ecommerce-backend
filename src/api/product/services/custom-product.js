'use strict';

module.exports = {

  async addProduct(productData) {
    // if(productData.stock < 0) {
    //   throw new Error ("Stock cannot be lessthan zero")
    // }
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
        fields: ['name', 'price', 'description'],
      }
    );
  },
  
  async getProductInsights() {
    const products = await strapi.entityService.findMany(
      'api::product.product',
      {
        populate: {
          Product: { 
            populate: {
              orders: {
                populate:
                 {
                  user: {
                    fields: ['id', 'username', 'email'],
                  },
                }
                
              },
            },
          },
        },
      }
    );  

     console.dir(products, { depth: null });

    return products.map(product => {
      const purchases = product.Product.map(item => {
        // const order = item.orders?.[0];
        const order = item.orders;
        const user = order?.user;

        return {
          userId: user?.id || null,
          username: user?.username || null,
          email: user?.email || null,
          quantity: item.quantity,
          pricePerUnit: item.price,
          totalAmount: item.quantity * item.price,
        };
      });

      return {
        productId: product.id,
        productName: product.name,
        stock: product.stock,
        price: product.price,
        purchases,
      };
    });
  },

  async getSingleProduct(productId) {
    return await strapi.entityService.findOne(
      'api::product.product', productId, {
        filters: { isActive: true, },
      }
    )
  },

async getSingleProductByName(name) {
  const products = await strapi.entityService.findMany(
    'api::product.product', name,
    {
      filters: {
        isActive: true,
      },
      
    }
    
  );
  

  return products.length ? products[0] : null;
},

  async updateProdutStock(productId, newStock) {
    if(newStock < 0){
      throw new Error ('Stock cannot be lessthan zero')
    }
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
