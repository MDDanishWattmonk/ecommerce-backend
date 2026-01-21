'use strict';

const { ApplicationError } = require('@strapi/utils').errors;

module.exports = {
  beforeCreate(event) {
    const { data } = event.params;

    if (data.price < 0) {
      throw new ApplicationError('Price cannot be negative');
    }

    if (data.stock < 0) {
      throw new ApplicationError('Stock cannot be less than zero');
    }
  },

  beforeUpdate(event) {
    const { data } = event.params;

    if (data.price !== undefined && data.price < 0) {
      throw new ApplicationError('Price cannot be negative');
    }

    if (data.stock !== undefined && data.stock < 0) {
      throw new ApplicationError('Stock cannot be less than zero');
    }
  },
};

