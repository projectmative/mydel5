const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateBellmanInput(data) {
  let errors = {};

  data.tag = !isEmpty(data.tag) ? data.tag : '';
  data.address = !isEmpty(data.address) ? data.address : '';
  data.name = !isEmpty(data.name) ? data.name : '';
  data.price = !isEmpty(data.price) ? data.price : '';
  // path = !isEmpty(path) ? path : '';

  
  if (Validator.isEmpty(data.price)) {
    errors.price = 'Price field is required';
  }
  if (Validator.isEmpty(data.tag)) {
    errors.email = 'Bio field is required';
  }
  if (Validator.isEmpty(data.address)) {
    errors.address2 = 'Address field is required';
  }
  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }
  // if (Validator.isEmpty(path)) {
  //   errors.pic = 'Picture is required';
  // }

  // if (Validator.isEmpty(data.path)) {
  //   errors.password = 'Image field is required';
  // }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
