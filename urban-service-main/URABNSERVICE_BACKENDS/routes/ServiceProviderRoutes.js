const router = require("express").Router();
const serviceProviderController = require("../controllers/ServiceProviderController");
const { verifyToken } = require("../middleware/authMiddleware.js");

router.get(
  "/all-provider",
  verifyToken,
  serviceProviderController.getAllServiceProviders
);
router.get(
  "/service-provider/:id",
  verifyToken,
  serviceProviderController.getServiceProviderById
);
router.put(
  "/service-provider/toggle-status/:id",
  verifyToken,
  serviceProviderController.toggleSpStatus
);
router.delete(
  "/service-provider/:id",
  verifyToken,
  serviceProviderController.deleteServiceProvider
);
router.put(
  "/service-provider/:id",
  verifyToken,
  serviceProviderController.updateServiceProvider
);
router.get(
  "/profile/:id",
  verifyToken,
  serviceProviderController.getServiceProviderProfile
);

router.put(
  "/profile/update/:id",
  verifyToken,
  serviceProviderController.updateSpProfile
);

module.exports = router;
