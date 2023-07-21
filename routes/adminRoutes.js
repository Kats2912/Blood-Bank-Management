const express = require("express");
const routes = express.Router();
const authMiddleware = require("../middlewares/authMiddleware.js");
const {
  getDonarList,
  getOrgList,
  getHospitalList,
  deleteDonar,
} = require("../controllers/adminController.js");
const adminMiddleware = require("../middlewares/adminMiddleware.js");

routes.get("/donarlist", authMiddleware, adminMiddleware, getDonarList);
routes.get("/hospitallist", authMiddleware, adminMiddleware, getHospitalList);
routes.get("/organisationlist", authMiddleware, adminMiddleware, getOrgList);
routes.delete("/deletedonar/:id", authMiddleware, adminMiddleware, deleteDonar);
routes.delete("/deletehospital/:id", authMiddleware, adminMiddleware, deleteDonar);
routes.delete(
  "/deleteorganisation/:id",
  authMiddleware,
  adminMiddleware,
  deleteDonar
);

module.exports = routes;
