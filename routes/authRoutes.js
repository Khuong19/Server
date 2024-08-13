const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', authController.isAuthenticated, authController.getMe);
router.put('/me', authController.isAuthenticated, authController.updateProfile);


module.exports = router;
