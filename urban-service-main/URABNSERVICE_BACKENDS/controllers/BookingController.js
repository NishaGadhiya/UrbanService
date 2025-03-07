const bookingSchema = require('../models/BookingModel')
const ServiceModel = require('../models/ServiceModel');
const mailUtil = require("../utils/Mail")

const createBooking = async (req, res) => {
    try {
        const { serviceId, date, address, price, serviceProviderId } = req.body;

        const booking = {
            userId: req.user.id, // From JWT
            serviceId,
            serviceProviderId,
            date,
            address,
            price
        };

        const savedbooking = await bookingSchema.create(booking)
        res.status(201).json({
            message: "Booking created Successfully",
            data: savedbooking,
            flag: 1
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            data: error.message,
            flag: -1
        })
    }
}

const getBookingById = async (req, res) => {
    try {
        const booking = await bookingSchema.findById(req.params.id)
        if (booking == null) {
            res.status(404).json({
                message: "Booking not found",
                flag: -1
            })
        } else {
            res.status(200).json({
                message: "Booking fetched",
                data: booking,
                flag: 1
            })
        }

    } catch (error) {
        res.status(500).json({
            message: 'Error in Fetching Data',
            data: error,
            flag: -1
        })
    }
}

const getAllBooking = async (req, res) => {
    try {
        const bookings = await bookingSchema.find().populate('serviceprovider').populate('user').populate('service')
        res.status(200).json({
            message: "Booking fetched successfully",
            data: bookings,
            flag: 1
        })
    } catch (error) {
        res.status(500).json({
            message: "Error",
            data: error,
            flag: -1
        })
    }
}

const updateBookingById = async (req, res) => {
    const newBooking = req.body
    try {
        const updatedBooking = await bookingSchema.findByIdAndUpdate(req.params.id, newBooking)
        if (updatedBooking === null) {
            res.status(404).json({
                message: "Booking not found",
                flag: -1
            })
        } else {
            res.status(200).json({
                message: "Booking has been updated!",
                flag: 1
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Error In Updating Booking",
            data: error,
            flag: -1
        })
    }
}

const updateBookingStatus = async (req, res) => {
    try {
        const id = req.params.id;
        console.log("Booking ID:", id);

        const updateStatus = await bookingSchema
            .findByIdAndUpdate(id, { status: req.body.status }, { new: true }) // Use { new: true } to return updated doc
            .populate("userId", "email name");

        if (!updateStatus) {
            return res.status(404).json({ message: "Booking not found", flag: -1 });
        }

        console.log("Updated Booking:", updateStatus);

        const statusColors = {
            pending: "#f57c00",
            accepted: "#388e3c",
            rejected: "#d32f2f",
            completed: "#1976d2",
            cancelled: "#757575",
        };

        // Email content
        const subject = `Booking Confirmed by Service Provider`;
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">
                <div style="background-color: #2d89ef; color: white; padding: 15px; text-align: center;">
                    <h1 style="margin: 0;">Urban Services</h1>
                    <p>Your Booking Update</p>
                </div>

                <div style="padding: 20px; color: #333;">
                    <p>Dear <strong>${updateStatus.userId.name}</strong>,</p>
                    <p>Your booking status has been updated.</p>

                    <div style="background: #f9f9f9; padding: 15px; border-left: 5px solid ${statusColors[updateStatus.status] || "#000"}; margin: 15px 0;">
                        <p><strong>Booking ID:</strong> ${updateStatus._id}</p>
                        <p><strong>Status:</strong> <span style="color: ${statusColors[updateStatus.status] || "#000"}; font-weight: bold;">${updateStatus.status.toUpperCase()}</span></p>
                        <p><strong>Address:</strong> ${updateStatus.address || "Not Provided"}</p>
                    </div>

                    <p>If you have any questions, please feel free to contact our support team.</p>
                    <p>Thank you for choosing Urban Services!</p>
                </div>

                <div style="background-color: #2d89ef; color: white; padding: 10px; text-align: center;">
                    <p style="margin: 0;">&copy; ${new Date().getFullYear()} Urban Services. All rights reserved.</p>
                </div>
            </div>
        `;

        // Send Confirmation Email
        const mailRes = await mailUtil.sendConfirmMail(updateStatus.userId.email, subject, html);
        console.log("📧 Email Response:", mailRes);

        res.status(201).json({
            message: "Status Updated Successfully",
            flag: 1,
            data: updateStatus,
        });

    } catch (error) {
        console.error("Error in updateBookingStatus:", error);
        res.status(500).json({
            message: "Server Error",
            flag: -1,
            error: error.message,
        });
    }
};


const getBookingByUserId = async (req, res) => {
    try {
        const id = req.user.id
        const bookings = await bookingSchema.find({ userId: id })
            .populate({ path: "serviceId", select: "-image" })
            .populate({ path: "userId", select: "-password" })
            .populate({ path: "serviceProviderId", select: "-password" });

        res.status(200).json({
            message: "Bookings fetched successfully by user ID",
            data: bookings,
            flag: 1
        });
    } catch (error) {
        res.status(500).json({
            message: "Error",
            data: error,
            flag: -1
        });
    }
};

const getPendingBooking = async (req, res) => {
    try {
        const bookings = await bookingSchema.find({ status: 'pending', user: req.params.id }).populate("service").populate("user").populate("serviceprovider");
        res.status(200).json({
            message: "Pending bookings fetched successfully",
            data: bookings,
            flag: 1
        });
    } catch (error) {
        res.status(500).json({
            message: "Error",
            data: error,
            flag: -1
        });
    }
};

const getDoneBooking = async (req, res) => {
    try {
        const bookings = await bookingSchema.find({ status: 'Booked', user: req.params.id }).populate("service").populate("user").populate("serviceprovider").populate('address');
        res.status(200).json({
            message: "Done bookings fetched successfully",
            data: bookings,
            flag: 1
        });
    } catch (error) {
        res.status(500).json({
            message: "Error",
            data: error,
            flag: -1
        });
    }
};

const getBookingByServiceProviderId = async (req, res) => {
    const serviceProviderId = req.user.id
    console.log("serviceProviderId", serviceProviderId)

    try {
        const booking = await bookingSchema.find({ serviceProviderId: serviceProviderId, })
            .populate({ path: 'serviceId', select: "-image" }).populate({ path: 'serviceProviderId', select: "-password" }).populate({ path: 'userId', select: "-password" })

        if (booking && booking.length > 0) {
            res.status(200).json({
                message: "Booking Found",
                flag: 1,
                data: booking,
            })
        } else {
            res.status(200).json({
                message: 'No Booking Found',
                flag: -1,
                data: []
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "No Booking Found",
            flag: -1,
            data: []
        })
    }
}

const getDoneBookingByServiceProviderId = async (req, res) => {
    const serviceProviderId = req.user.id
    try {
        const doneStatus = await bookingSchema.find({ serviceprovider: serviceProviderId, status: "Done" }).populate('address').populate('service').populate('serviceprovider').populate('user')
        if (doneStatus && doneStatus.length > 0) {
            res.status(200).json({
                message: "Status Updated to done",
                flag: 1,
                data: doneStatus
            })
        } else {
            res.status(404).json({
                message: " Status is not done",
                flag: -1,
                data: []
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
            flag: -1,
            data: []
        })
    }
}


module.exports = {
    createBooking,
    getBookingById,
    getAllBooking,
    updateBookingById,
    updateBookingStatus,
    getBookingByUserId,
    getPendingBooking,
    getDoneBooking,
    getBookingByServiceProviderId,
    getDoneBookingByServiceProviderId,
    // updateStatusById
};