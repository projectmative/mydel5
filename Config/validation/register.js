const Validator = require('validator');
const isEmpty = require('./is-empty');
var passwordValidator = require('password-validator');
var schema = new passwordValidator();

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';
  data.role = !isEmpty(data.role) ? data.role : '';
  

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 characters';
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = 'Confirm Password field is required';
  }
  
  
   schema.has().letters(1).digits(1).symbols(1);
   if(!schema.validate(data.password)){
    errors.password = 'Password must contain letter,digit and special character';
    console.log(schema.validate(data.password,{ list: true }));
   }

    

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = 'Passwords must match';
  }
  if (Validator.isEmpty(data.role)) {
    errors.role = 'Select a Role';
  }
 

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
