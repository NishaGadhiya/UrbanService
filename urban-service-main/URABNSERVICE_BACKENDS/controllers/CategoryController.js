const categorySchema = require("../models/CategoryModel");
const subcategorySchema = require("../models/SubCategoryModel");

const createCategory = async (req, res) => {
  try {
    const savedCategory = await categorySchema.create(req.body);
    res.status(201).json({
      message: "Category created successfully",
      data: savedCategory,
      flag: 1,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while creating Category",
      data: error,
      flag: -1,
    });
  }
};

const getAllCategory = async (req, res) => {
  try {
    const categories = await categorySchema.find();
    res.status(200).json({
      message: "Categories fetched successfully",
      data: categories,
      flag: 1,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in getting categories",
      data: error,
      flag: -1,
    });
  }
};

const getActiveCategory = async (req, res) => {
  try {
    categories = await categorySchema.find({ status: true });
    res.status(200).json({
      message: "Categories fetched successfully",
      data: categories,
      flag: 1,
    });
  } catch {
    res.status(500).json({
      message: " Error in getting categories",
      data: error,
      flag: -1,
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await categorySchema.findById(req.params.id);
    if (category == null) {
      res.status(404).json({
        message: "Category not found",
        flag: -1,
      });
    } else {
      res.status(200).json({
        message: "Category fetched",
        data: category,
        flag: 1,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error in getting the category",
      data: error,
      flag: -1,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await categorySchema.findByIdAndDelete(
      req.params.id
    );
    if (deletedCategory == null) {
      res.status(404).json({
        message: "Category not Found ",
        flag: -1,
      });
    } else {
      res.status(200).json({
        message: "Category deleted successfully",
        data: deletedCategory,
        falg: 1,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error while deleting category",
      data: error,
      flag: -1,
    });
  }
};
const toggleCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categorySchema.findById(id);

    if (!category) {
      return res.status(404).json({
        message: "category not found",
        flag: -1,
      });
    }
    // Toggle the status
    category.status = !category.status;
    await category.save();

    await subcategorySchema.updateMany(
      { category: category._id },
      { $set: { status: category.status } }
    );
    res.status(200).json({
      message: "category status updated successfully",
      data: category,
      flag: 1,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error toggling category status",
      data: error,
      flag: -1,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const newCategory = req.body;
    const updatedCategory = await categorySchema.findByIdAndUpdate(
      req.params.id,
      newCategory
    );
    if (updatedCategory == null) {
      res.status(404).json({
        message: "Category not found",
        flag: -1,
      });
    } else {
      res.status(200).json({
        message: "Category updated successfully ",
        flag: 1,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error while updating category",
      flag: -1,
      data: error,
    });
  }
};

module.exports = {
  createCategory,
  getAllCategory,
  getCategoryById,
  deleteCategory,
  updateCategory,
  toggleCategoryStatus,
  getActiveCategory,
};
