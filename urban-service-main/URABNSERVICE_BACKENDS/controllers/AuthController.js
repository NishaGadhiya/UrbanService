const AdminModel = require("../models/Admin/AdminModel");
const ServiceProviderModel = require("../models/ServiceProviderModel");
const UserModel = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mailUtil = require("../utils/Mail");
const encrypt = require("../utils/Encrypt");

// Common function to check credentials in different tables
const findUser = async (email) => {
  let admin = await AdminModel.findOne({ email });
  if (admin) return { admin, role: "admin" };
  let user = await UserModel.findOne({ email });
  if (user) return { user: user, role: "user" };
  let serviceProvider = await ServiceProviderModel.findOne({ email });
  if (serviceProvider)
    return { user: serviceProvider, role: "service_provider" };
  return null;
};

const logIn = async (req, res) => {
  try {
    const { email, password, roles } = req.body;
    let result;
    if (roles == "user") {
      result = await UserModel.findOne({ email });
    }

    if (roles == "service_provider") {
      result = await ServiceProviderModel.findOne({ email });
    }

    if (result && result.status === false) {
      return res.status(403).json({ message: "You are blocked by admin" });
    }

    if (!result || !(await bcrypt.compare(password, result.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: result._id, role: roles },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.status(200).json({ token, role: roles, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const signUp = async (req, res) => {
  try {
    const { role, email, phone, password, name } = req.body; // Extract role from request

    const result = await findUser(email);
    if (result) {
      if (result.user && result.user.email) {
        return res.status(400).json({
          message: `Email already use for ${result.role}`,
          flag: -1,
        });
      }
    }
    let existingPhone;
    if (role === "user") {
      existingPhone = await UserModel.findOne({
        phone: phone,
      });
    }
    if (role === "service_provider") {
      existingPhone = await ServiceProviderModel.findOne({
        phone: phone,
      });
    }

    if (existingPhone) {
      return res.status(400).json({
        message: "Contact number already in use",
        flag: -1,
      });
    }
    const hashedPassword = encrypt.encrypPassword(password);
    const userObj = { role, email, phone, name, password: hashedPassword };
    let savedUser;

    if (role === "service_provider") {
      savedUser = await ServiceProviderModel.create(userObj);
    } else if (role === "user") {
      savedUser = await UserModel.create(userObj);
      // Send welcome email only for users
      await mailUtil.sendMail(
        savedUser.email,
        "Welcome Mail",
        "Welcome to Urban Services..."
      );
    } else {
      return res.status(400).json({ message: "Invalid role", flag: -1 });
    }
    // const token = jwt.sign({ id: savedUser._id, role: role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(201).json({
      message: `${role} created successfully`,
      flag: 1,
    });
  } catch (error) {
    console.error("Error in signUp:", error);
    res.status(500).json({
      message: "Error in creating account",
      data: error,
      flag: -1,
    });
  }
};

// // Logout route
const logOut = async (req, res) => {};

module.exports = { logIn, signUp, logOut };
