const Validator = require('validator');
const isEmpty = require('./is-empty');
var passwordValidator = require('password-validator');
var schema = new passwordValidator();

module.exports = function validatePasswordInput(data) {
  let errors = {};
  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.npass = !isEmpty(data.npass) ? data.npass : '';
  data.cpass = !isEmpty(data.cpass) ? data.cpass : '';
  

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  
  if (Validator.isEmpty(data.npass)) {
    errors.npass= 'New Password field is required';
  }

  if (Validator.isEmpty(data.cpass)) {
    errors.cpass = 'Confirm Password field is required';
  }
  if (!Validator.equals(data.npass, data.cpass)) {
    errors.cpass = 'Passwords must match';
  }
  if (!Validator.isLength(data.npass, { min: 6, max: 30 })) {
    errors.npass = 'Password must be at least 6 characters';
  }
  schema.has().letters(1).digits(1).symbols(1);
   if(!schema.validate(data.npass)){
    errors.npass = 'Password must contain letter,digit and special character';
    console.log(schema.validate(data.npass,{ list: true }));
   }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
