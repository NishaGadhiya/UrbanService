    const express = require('express');
    const mongoose = require('mongoose');
    require('dotenv').config();
    const cookieParser = require("cookie-parser");
    const app = express();

    const cors = require('cors')
    app.use(cors())

    const PORT = 4000

    //...Config...
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(
        cors({
            origin: "http://localhost:3000", // Allow frontend origin
            credentials: true, // Allow cookies
        })
    );

    //Connetion to db.....
    var db = mongoose.connect("mongodb://127.0.0.1:27017/urbanservices")
    db.then(() => {
        console.log("connected to mongodb")
    }).catch((err) => {
        console.log(err)
    })






    // Routes
    const roleRoutes = require('./routes/RoleRoutes.js')
    const userRoutes = require('./routes/UserRoutes.js')
    const typeRoutes = require('./routes/TypeRoutes.js')
    const serviceProviderRoutes = require('./routes/ServiceProviderRoutes.js')
    const serviceRoutes = require('./routes/ServiceRoutes.js')
    const fileUplaodRoutes = require('./routes/FileUploadRoutes.js')
    const bookingRoutes = require('./routes/BookingRoutes.js')
    const addressRoutes = require('./routes/AddressRoutes.js')
    const adminRoutes = require('./routes/AdminRoutes.js')
    const authRoutes = require('./routes/AuthRoutes.js')
    const paymentRoutes = require("./routes/PaymentRoutes.js");
    
    

    //App allocation to routes
    app.use("/api",authRoutes)
    app.use("/admin", adminRoutes)
    app.use("/roles", roleRoutes)
    app.use("/users", userRoutes)
    app.use("/types", typeRoutes)
    app.use("/serviceproviders", serviceProviderRoutes)
    app.use("/services", serviceRoutes)
    app.use("/upload", fileUplaodRoutes)
    app.use('/bookings', bookingRoutes)
    app.use('/address', addressRoutes)
    app.use("/payment", paymentRoutes);


    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })