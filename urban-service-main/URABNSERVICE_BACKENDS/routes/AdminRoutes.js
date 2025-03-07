const router = require('express').Router()
const AdminController = require('../controllers/Admin/Admincontroller')
const { verifyToken } = require('../middleware/authMiddleware.js')
const categoryRoutes = require('./CategoryRoutes.js')
const subCategoryRoutes = require('./SubCategoryRoutes.js')


router.post("/login", AdminController.loginAdmin);
router.use("/categories", categoryRoutes);
router.use("/subcategories", subCategoryRoutes);
router.use("/dashboard", verifyToken, AdminController.getDashboardDetails);
router.get("/profile/:id", verifyToken, AdminController.getAdminProfile);
router.put("/profile/update/:id", verifyToken, AdminController.updateAdminProfile);

module.exports = router