const mongoose = require("mongoose");
const Inventory = require("../models/inventoryModel");
const User = require("../models/userModel");

const createInventoryController = async (req, res) => {
  try {
    const { email } = req.body;

    //validation
    const user = await User.findOne({ email });
    if (!user) return new Error("User not found");

    // if (inventoryType === "in" && user.role !== "donar")
    //   return new Error("Not a donar account");

    // if (inventoryType === "out" && user.role !== "hospital")
    //   return new Error("Not a hospital account");
    if (req.body.inventoryType === "out") {
      const requestedBloodGroup = req.body.bloodGroup;
      const requestedQuantityOfBlood = req.body.quantity;
      const organisation = new mongoose.Types.ObjectId(req.body.userId);

      //calculate blood quanity
      const totalInOfRequestedBlood = await Inventory.aggregate([
        {
          $match: {
            organisation,
            inventoryType: "in",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      //console.log(totalInOfRequestedBlood);
      const totalIn = totalInOfRequestedBlood[0]?.total || 0;

      //calculate out blood requested
      const totalOutRequestedBlood = await Inventory.aggregate([
        {
          $match: {
            organisation,
            inventoryType: "out",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      const totalOut = totalOutRequestedBlood[0]?.total || 0;
      //quanity calculation
      const totalQuantity = totalIn - totalOut;

      //quantity validation
      if (totalQuantity < requestedQuantityOfBlood) {
        return res.status(501).send({
          success: false,
          message: `only ${totalOut}ML of requested blood is left`,
        });
      }
      req.body.hospital = user?._id;
    } else {
      req.body.donar = user?._id;
    }

    const inventory = new Inventory(req.body);
    await inventory.save();

    return res.status(201).json({
      success: true,
      message: "New blood record added",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

//get blood records
const getInventoryController = async (req, res) => {
  try {
    const inventory = await Inventory.find({ organisation: req.body.userId })
      .populate("donar")
      .populate("hospital")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "Inventories fetched successfully",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

//get blood record of 3
const getRecentInventoryController = async (req, res) => {
  try {
    const inventory = await Inventory.find({ organisation: req.body.userId }).limit(3).sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message:'recent inventory data',
      inventory
    })

  } catch (error) {
    return res.status(501).send({
      success: false,
      error
    })
  }
}

//get hospital blood records
const getInventoryHospitalController = async (req, res) => {
  try {
    const inventory = await Inventory.find(req.body.filters)
      .populate("donar")
      .populate("hospital")
      .populate("organisation")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "Hospital Consumer fetched successfully",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

//get donar record
const getDonar = async (req, res) => {
  try {
    const organisation = req.body.userId;
    //find donars
    const donarId = await Inventory.distinct("donar", {
      organisation,
    });
    const donars = await User.find({ _id: { $in: donarId } });
    return res.status(200).send({
      success: true,
      message: "Donars fetched successfull",
      donars,
    });
  } catch (error) {
    return res.status(501).send({
      success: false,
      message: "error in donar record",
      error,
    });
  }
};

const getHospitalController = async (req, res) => {
  try {
    const organisation = req.body.userId;
    //get hospital id
    const hospitalId = await Inventory.distinct("hospital", { organisation });
    //get hospital
    const hospitals = await User.find({ _id: { $in: hospitalId } });
    console.log(hospitals);
    if (!hospitals) {
      return res.status(502).send({
        success: false,
        message: "no hospitals found",
      });
    }
    return res.status(201).send({
      success: true,
      message: "Hospitals fetched successfully",
      hospitals,
    });
  } catch (error) {
    //console.log(error);
    return res.status(501).send({
      success: false,
      message: "error in hospital record",
      error,
    });
  }
};

const getOrganisationController = async (req, res) => {
  try {
    const donar = req.body.userId;
    const organisationId = await Inventory.distinct("organisation", { donar });
    const organisations = await User.find({ _id: { $in: organisationId } });
    return res.status(200).send({
      success: true,
      message: "Organisations fetched successfully",
      organisations,
    });
  } catch (error) {
    return res.status(501).send({
      success: false,
      message: "error in organisation record",
      error,
    });
  }
};
const getOrganisationForHospitalController = async (req, res) => {
  try {
    const hospital = req.body.userId;
    const organisationId = await Inventory.distinct("organisation", { hospital });
    const organisations = await User.find({ _id: { $in: organisationId } });
    return res.status(200).send({
      success: true,
      message: "Organisations fetched successfully",
      organisations,
    });
  } catch (error) {
    return res.status(501).send({
      success: false,
      message: "error in organisation record",
      error,
    });
  }
};

module.exports = {
  createInventoryController,
  getInventoryController,
  getInventoryHospitalController,
  getDonar,
  getHospitalController,
  getOrganisationController,
  getOrganisationForHospitalController,
  getRecentInventoryController
  
};
