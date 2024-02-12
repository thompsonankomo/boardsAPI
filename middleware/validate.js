const validator = require('../helpers/validate');

const saveStudent = (req, res, next) => {
  const validationRule = {
    firstName: 'required|string',
    lastName: 'required|string',
    studentId: 'required|string',
    birthdate: 'required|date',
    major: 'required|string',
    department: 'required|string',
    address: 'required|string',
    gender: 'required|string',
    studentStatus: 'required|string'    
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    } else {
      next();
    }
  });
};

const saveUser = (req, res, next) => {
    const validationRule = {
      studentId: 'required|string',
      firstName: 'required|string',
      lastName: 'required|string',
      email: 'required|email',
      password: 'required|min:8',           
        
    };

    validator(req.body, validationRule, {}, (err, status) => {
      if (!status) {
        res.status(412).send({
          success: false,
          message: 'Validation failed',
          data: err
        });
      } else {
        next();
      }
    });
  };

module.exports = {
  saveStudent,
  saveUser
};