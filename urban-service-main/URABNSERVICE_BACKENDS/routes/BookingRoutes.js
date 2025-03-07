const router = require('express').Router();
const bookingController = require('../controllers/BookingController');
const { verifyToken } = require('../middleware/authMiddleware');


router.post('/create-booking', verifyToken, bookingController.createBooking)
router.get('/booking', verifyToken, bookingController.getAllBooking)
router.get('/booking/:id', verifyToken, bookingController.getBookingById)
router.put('/booking/:id', verifyToken, bookingController.updateBookingById)
router.put('/update-status/:id', verifyToken, bookingController.updateBookingStatus)
// router.put("/bookStatus/:id", bookingController.updateStatusById);
router.get('/get-booking/user', verifyToken, bookingController.getBookingByUserId); // Fetch bookings by user ID
router.get('/booking/pending/user/:id', verifyToken, bookingController.getPendingBooking); // Fetch pending bookings by user ID
router.get('/booking/done/:id', verifyToken, bookingController.getDoneBooking); // Fetch done bookings by user ID
router.get('/get-booking/serviceprovider', verifyToken, bookingController.getBookingByServiceProviderId)
router.get('/booking/serviceprovider/done/:id', verifyToken, bookingController.getDoneBookingByServiceProviderId)

module.exports = router