const router = require('express').Router();
const serviceController = require('../controllers/ServiceController')
const { verifyToken } = require('../middleware/authMiddleware')

router.post("/add-service", verifyToken, serviceController.addService)
// router.post("/services",serviceController.fileUpload)
router.get("/all-service", verifyToken, serviceController.getAllServices)
router.get("/service/:id", verifyToken, serviceController.getServiceById)
router.delete("/service/:id", verifyToken, serviceController.deleteService)
router.put("/update-service/:id", verifyToken, serviceController.updateService)
router.get("/service-provider-id", verifyToken, serviceController.getServiceByServiceProviderId);
router.get("/servicefilter", verifyToken, serviceController.serviceFilter)


module.exports = router


