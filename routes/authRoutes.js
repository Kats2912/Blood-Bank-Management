const express = require('express');
const { registerUser, loginUser, currentUser } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const routes = express.Router();

routes.post('/register', registerUser);
routes.post('/login', loginUser);
routes.get('/currentuser', authMiddleware,currentUser);

module.exports = routes;