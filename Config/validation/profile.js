const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.tag = !isEmpty(data.tag) ? data.tag : '';
  // path = !isEmpty(path) ? path : '';

  

  if (Validator.isEmpty(data.tag)) {
    errors.email = 'Bio field is required';
  }
  // if (Validator.isEmpty(data.name)) {
  //   errors.name = 'name field is required';
  // }
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
