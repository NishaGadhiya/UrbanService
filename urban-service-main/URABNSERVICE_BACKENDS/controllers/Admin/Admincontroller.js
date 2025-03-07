const AdminSchema = require("../../models/Admin/AdminModel");
const CategorySchema = require("../../models/CategoryModel");
const SubCategorySchema = require("../../models/SubCategoryModel");
const UserSchema = require("../../models/UserModel");
const ServiceProviderSchema = require("../../models/ServiceProviderModel");
const encrypt = require("../../utils/Encrypt");
const jwt = require("jsonwebtoken");

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find Admin by email
    const admin = await AdminSchema.findOne({ email });
    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
        flag: -1,
      });
    }

    // Compare passwords
    const isMatch = await encrypt.comparePassword(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
        flag: -1,
      });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Successful login
    res.status(200).json({
      message: "Logged in successfully",
      token: token,
      data: admin,
      role: "admin",
      flag: 1,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
      flag: -1,
    });
  }
};

// Fetch Admin Dashboard Details
const getDashboardDetails = async (req, res) => {
  try {
    // Count Categories
    const categoryCount = await CategorySchema.countDocuments();

    // Count Subcategories
    const subcategoryCount = await SubCategorySchema.countDocuments();

    // Count Service Providers
    const serviceProviderCount = await ServiceProviderSchema.countDocuments();

    // Count Users
    const userCount = await UserSchema.countDocuments();

    // Return the statistics
    res.status(200).json({
      categories: categoryCount,
      subcategories: subcategoryCount,
      serviceProviders: serviceProviderCount,
      users: userCount,
    });
  } catch (error) {
    console.error("Dashboard Data Error:", error);
    res.status(500).json({
      message: "Failed to fetch dashboard data",
      error: error.message,
      flag: -1,
    });
  }
};

const getAdminProfile = async (req, res) => {
  try {
    const admin = await AdminSchema.findById(req.params.id).select("-password");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found", flag: -1 });
    }

    res
      .status(200)
      .json({ message: "Admin profile fetched", data: admin, flag: 1 });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error", error: error.message, flag: -1 });
  }
};

const updateAdminProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    const updatedAdmin = await AdminSchema.findByIdAndUpdate(
      req.params.id,
      { name, phone },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found", flag: -1 });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      data: updatedAdmin,
      flag: 1,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error", error: error.message, flag: -1 });
  }
};

module.exports = {
  loginAdmin,
  getDashboardDetails,
  getAdminProfile,
  updateAdminProfile,
};
