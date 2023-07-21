const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { bloodGroupDetailController } = require('../controllers/analyticsController');
const routes = express.Router();


//get donar
routes.get('/bloodgroupdetails', authMiddleware, bloodGroupDetailController);





module.exports = routes;
