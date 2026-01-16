'use strict';

module.exports = {
  beforeCreate(event) {
    const { data } = event.params;  
    strapi.log.info('before create');

    if (data.price < 0) {
      throw new Error('Price cannot be negative');
    }
  },
};
