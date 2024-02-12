const express = require ('express');
const router = express.Router();

const userController = require('../controllers/user');
const validation = require('../middleware/validate');
const {isAuthenticated} = require('../middleware/authenticate');


router.get('/', userController.getAll);

router.get('/:id', userController.getSingle);

router.post('/', isAuthenticated, validation.saveUser,  userController.createUser);

router.put('/:id',  isAuthenticated, validation.saveUser, userController.updateUser);
router.delete('/:id', isAuthenticated, userController.deleteUser);

module.exports = router;