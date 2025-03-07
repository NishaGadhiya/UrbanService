const router = require("express").Router();
const categoryController = require("../controllers/CategoryController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/add-category", verifyToken, categoryController.createCategory);
router.put("/category/:id", verifyToken, categoryController.updateCategory);
router.put(
  "/category/toggle-status/:id",
  verifyToken,
  categoryController.toggleCategoryStatus
);
router.get("/category/:id", verifyToken, categoryController.getCategoryById);
router.delete("/category/:id", verifyToken, categoryController.deleteCategory);
router.get("/allcategories", verifyToken, categoryController.getAllCategory);
router.get(
  "/active-categories",
  verifyToken,
  categoryController.getActiveCategory
);

module.exports = router;
