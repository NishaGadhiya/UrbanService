const router = require("express").Router();
const subCategoryController = require("../controllers/SubCategoryController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post(
  "/add-subcategory",
  verifyToken,
  subCategoryController.createSubCategory
);
router.put(
  "/subcategory/:id",
  verifyToken,
  subCategoryController.updateSubCategory
);
router.put(
  "/subcategory/toggle-status/:id",
  verifyToken,
  subCategoryController.toggleSubCategoryStatus
);
router.get(
  "/subcategory/:id",
  verifyToken,
  subCategoryController.getSubCategoryById
);
router.delete(
  "/subcategory/:id",
  verifyToken,
  subCategoryController.deleteSubCategory
);
router.get(
  "/subcategory-by-category-id/:id",
  verifyToken,
  subCategoryController.getSubCategoriesByCategoryId
);
router.get(
  "/allsubcategories",
  verifyToken,
  subCategoryController.getAllSubCategory
);

module.exports = router;
