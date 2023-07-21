const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { createInventoryController, getInventoryController, getDonar, getHospitalController, getOrganisationController, getOrganisationForHospitalController, getInventoryHospitalController, getRecentInventoryController } = require('../controllers/inventoryController');
const routes = express.Router();

routes.post('/createinventory', authMiddleware, createInventoryController);

//get all blood records
routes.get('/getinventory', authMiddleware, getInventoryController)

//get hospital blood records
routes.post('/getinventoryhospital', authMiddleware, getInventoryHospitalController)

//get donar
routes.get('/getdonar', authMiddleware, getDonar);

//get hospital record
routes.get('/gethospital', authMiddleware, getHospitalController);

//get organisation record
routes.get('/getorganisation', authMiddleware, getOrganisationController);

//get organisation for hospital record
routes.get('/getorganisationforhospital', authMiddleware, getOrganisationForHospitalController);

//get recent inventories
routes.get('/getrecentinventories', authMiddleware, getRecentInventoryController);




module.exports = routes;
