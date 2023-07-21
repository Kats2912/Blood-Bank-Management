const bcrypt = require("bcryptjs");
const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser == true) {
      return res.status(200).send({
        success: false,
        message: "User already exists",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;
    const newUser = new User(req.body);
    await newUser.save();
    return res.status(201).send({
      success: true,
      message: "User registered successfully",
      newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser == false) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (existingUser.role !== req.body.role) {
      return res.status(500).send({
        success: false,
        message:'user role does not match'
      })
    }
    const password = existingUser.password;
    const isMatched = await bcrypt.compare(req.body.password, password);
    if (isMatched == false) {
      return res.status(500).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return res.status(200).json({
      success: true,
      message: "User logged in",
      token,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
};

const currentUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    return res.status(200).send({
      success: true,
      message: "user fetched successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "unable to get current user",
    });
  }
};

module.exports = { registerUser, loginUser, currentUser };
