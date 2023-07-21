const userModel = require("../models/userModel");

const getDonarList = async (req, res) => {
  try {
    const donarData = await userModel
      .find({ role: "donar" })
      .sort({ createdAt: -1 });
    return res.status(201).send({
      success: true,
      message: "api fetched successfully",
      totalCount: donarData.length,
      donarData,
    });
  } catch (error) {
    return res.status(501).send({
      success: false,
      message: "error in api",
      error,
    });
  }
};
const getHospitalList = async (req, res) => {
  try {
    const hospitalData = await userModel
      .find({ role: "hospital" })
      .sort({ createdAt: -1 });
    return res.status(201).send({
      success: true,
      message: "api fetched successfully",
      totalCount: hospitalData.length,
      hospitalData,
    });
  } catch (error) {
    return res.status(501).send({
      success: false,
      message: "error in api",
      error,
    });
  }
};
const getOrgList = async (req, res) => {
  try {
    const orgData = await userModel
      .find({ role: "organisation" })
      .sort({ createdAt: -1 });
    return res.status(201).send({
      success: true,
      message: "api fetched successfully",
      totalCount: orgData.length,
      orgData,
    });
  } catch (error) {
    return res.status(501).send({
      success: false,
      message: "error in api",
      error,
    });
  }
};
//deleete stuff
const deleteDonar = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    // console.log("nsfisnfgi");
    return res.status(200).send({
      success: true,
      message: " Record Deleted successfully",
    });
  } catch (error) {
    return res.status(501).send({
      success: false,
      message: "error in api",
      error,
    });
  }
};

module.exports = {
  getDonarList,
  getHospitalList,
  getOrgList,
  deleteDonar,
};
