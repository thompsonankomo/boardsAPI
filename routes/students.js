const express = require('express');
const router = express.Router();

const studentController = require('../controllers/students');
const validation = require('../middleware/validate');
const { isAuthenticated } = require('../middleware/authenticate');

router.get('/',  studentController.getAll);

router.get('/:id', studentController.getSingle);

router.post('/', isAuthenticated, validation.saveStudent,  studentController.createStudents);

router.put('/:id', isAuthenticated, validation.saveStudent,  studentController.updateStudents);

router.delete('/:id', isAuthenticated, studentController.deleteStudents);

module.exports = router;