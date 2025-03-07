const userController = require("../controllers/UserController");
const router = require("express").Router();
const { verifyToken } = require("../middleware/authMiddleware")

router.get("/all", verifyToken, userController.getAllUsers);
router.delete("/user/:id", verifyToken, userController.deleteUser);
router.put("/user/toggle-status/:id", verifyToken, userController.toggleUserStatus);
router.get("/user/:id", verifyToken, userController.getUserById);
router.put("/user/:id", verifyToken, userController.updateUser);
router.post("/user/isUserExist", verifyToken, userController.isUserExist);
router.post("/user/resetpassword", verifyToken, userController.resetPassword);

module.exports = router;
