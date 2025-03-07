const router = require('express').Router();
const authController = require("../controllers/AuthController")

router.post("/login", authController.logIn);
router.post("/signup", authController.signUp);
router.post("/logout", authController.logOut);

module.exports = router;
