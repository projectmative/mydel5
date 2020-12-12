const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateproductInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.price = !isEmpty(data.price) ? data.price : '';
  data.quantity = !isEmpty(data.quantity) ? data.quantity : '';
  


  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  if (Validator.isEmpty(data.price)) {
    errors.price = 'Price field is required';
  }

  if (Validator.isEmpty(data.quantity)) {
    errors.quantity = 'Quantity field is required';
  }


  return {
    errors,
    isValid: isEmpty(errors)
  };
};
