const mongoose = require("mongoose");
const AdminSchema = require("./models/Admin/AdminModel");
const encrypt = require("./utils/Encrypt");
require("dotenv").config();

mongoose.connect("mongodb://localhost:27017/urbanservices", { useNewUrlParser: true, useUnifiedTopology: true });

const seedAdmin = async () => {
    try {
        const existingAdmin = await AdminSchema.findOne({ email: process.env.ADMIN_EMAIL });

        if (!existingAdmin) {
            const hashedPassword = await encrypt.encrypPassword(`${process.env.ADMIN_PASSWORD}`);

            const newAdmin = new AdminSchema({
                name: "Super Admin",
                email: process.env.ADMIN_EMAIL,
                phone: process.env.ADMIN_PHONE || "9876543210",
                password: hashedPassword,
                role: "superadmin",
                profilePicture: "",
                status: true
            });

            await newAdmin.save();
            console.log("✅ Admin seeded successfully!");
        } else {
            console.log("✅ Admin already exists.");
        }

        mongoose.connection.close();
    } catch (error) {
        console.error("❌ Error seeding admin:", error);
        mongoose.connection.close();
    }
};

seedAdmin();
