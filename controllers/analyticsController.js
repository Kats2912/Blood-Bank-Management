const mongoose = require("mongoose");
const Inventory = require("../models/inventoryModel");
//get bloood group

const bloodGroupDetailController = async (req, res) => {
  try {
    const bloodGroups = ["O+", "O-", "AB+", "AB-", "A-", "A+", "B-", "B+"];
    const bloodGroupData = [];
    const organisation = new mongoose.Types.ObjectId(req.body.userId);

    //get single blood group
    await Promise.all(
      bloodGroups.map(async (bloodGroup) => {
        //count totalin
        const totalIn = await Inventory.aggregate([
          {
            $match: {
              bloodGroup: bloodGroup,
              inventoryType: "in",
              organisation,
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$quantity" },
            },
          },
        ]);
        //total out
        const totalOut = await Inventory.aggregate([
          {
            $match: {
              bloodGroup: bloodGroup,
              inventoryType: "out",
              organisation,
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$quantity" },
            },
          },
        ]);
        //calculate total
        const availableBlood =
          (totalIn[0]?.total || 0) - (totalOut[0]?.total || 0);
        //puah data
        bloodGroupData.push({
          bloodGroup,
          totalIn: totalIn[0]?.total || 0,
          totalOut: totalOut[0]?.total || 0,
          availableBlood,
        });
      })
    );
    return res.status(200).send({
      success: true,
      message: "Blood Group data fetched successfully",
      bloodGroupData,
    });
  } catch (error) {
    return res.status(501).send({
      success: false,
      error,
    });
  }
};

module.exports = { bloodGroupDetailController };
