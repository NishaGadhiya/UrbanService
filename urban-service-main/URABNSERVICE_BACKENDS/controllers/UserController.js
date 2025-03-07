const userSchema = require("../models/UserModel");
const encrypt = require("../utils/Encrypt");
const mailUtil = require("../utils/Mail");
const otpSchema = require("../models/OtpModel");
const serviceProviderSchema = require("../models/ServiceProviderModel");

const createUser = async (req, res) => {
  try {
    const hashedPasssword = encrypt.encrypPassword(req.body.password);
    const userObj = Object.assign(req.body, { password: hashedPasssword });
    const savedUser = await userSchema.create(userObj);
    console.log("savedUser", savedUser);
    const mailRes = await mailUtil.sendMail(
      savedUser.email,
      "Welcome mail",
      "Welcom to Urban Services....."
    );
    res.status(201).json({
      message: "User created successfully",
      data: savedUser,
      flag: 1,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in creating User",
      data: error,
      flag: -1,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userSchema.find();
    res.status(200).json({
      message: "User fetched successfully",
      data: users,
      flag: 1,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in getting users",
      data: error,
      flag: -1,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedUser = await userSchema.findByIdAndDelete(id).populate("role");
    if (deletedUser == null) {
      res.statu(404).json({
        message: "User not found",
        flag: -1,
      });
    } else {
      res.status(200).json({
        message: "User Deleted Successfully",
        data: deletedUser,
        flag: 1,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error in deleting User",
      data: error,
      falg: -1,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userSchema.findById(id)
    if (user == null) {
      res.status(404).json({
        message: "User not found",
        flag: -1,
      });
    } else {
      res.status(200).json({
        message: "User found successfully",
        data: user,
        flag: 1,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error in getting the user by id",
      data: error,
      flag: -1,
    });
  }
};

const updateUser = async (req, res) => {
  const newUser = req.body;
  try {
    const updatedUser = await userSchema
      .findByIdAndUpdate(req.params.id, newUser)
    if (updatedUser === null) {
      res.status(404).json({
        message: "User not found",
        flag: -1,
      });
    } else {
      res.status(200).json({
        message: "User has been updated!",
        flag: 1,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error in updating the user",
      data: error,
      flag: -1,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userFromEmail = await userSchema.findOne({ email: email });
    if (userFromEmail != null) {
      const flag = encrypt.comparePassword(password, userFromEmail.password);
      if (flag == true) {
        res.status(200).json({
          message: "Logged in successfully",
          data: userFromEmail,
          flag: 1,
        });
      } else {
        res.status(404).json({
          message: "User Not Found",
          flag: -1,
        });
      }
    } else {
      res.status(404).json({
        message: "Employee not found",
        flag: -1,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "erver error",
      data: error,
      flag: -1,
    });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userSchema.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        flag: -1,
      });
    }

    // Toggle the status
    user.status = !user.status;
    await user.save();

    res.status(200).json({
      message: "User status updated successfully",
      data: user,
      flag: 1,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error toggling user status",
      data: error,
      flag: -1,
    });
  }
};

const isUserExist = async (req, res) => {
  try {
    const email = req.body.email;
    const getUserByEmail = await userSchema.findOne({ email: email });

    const getServiceProviderByEmail = await serviceProviderSchema.findOne({
      email: email,
    });

    if (getUserByEmail) {
      // If the email belongs to a regular user
      const otp = Math.floor(1000 + Math.random() * 9000);
      const mailRes = await mailUtil.mail(
        getUserByEmail.email,
        "OTP to reset Password",
        `Your OTP is ${otp} `
      );

      const otpObj = {
        otp: otp,
        email: getUserByEmail.email,
        status: true,
      };

      await otpSchema.create(otpObj);

      res.status(200).json({
        message: "User Found",
        data: getUserByEmail,
        flag: 1,
      });
    } else if (getServiceProviderByEmail) {
      // If the email belongs to a service provider
      const otp = Math.floor(1000 + Math.random() * 9000);
      const mailRes = await mailUtil.mail(
        getServiceProviderByEmail.email,
        "OTP to reset Password",
        `Your OTP is ${otp} `
      );

      const otpObj = {
        otp: otp,
        email: getServiceProviderByEmail.email,
        status: true,
      };

      await otpSchema.create(otpObj);

      res.status(200).json({
        message: "Service Provider Found",
        data: getServiceProviderByEmail,
        flag: 1,
      });
    } else {
      res.status(404).json({
        message: "User not found",
        flag: -1,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error in getting User by Email",
      data: error,
    });
  }
};

const resetPassword = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const otp = req.body.otp;
  const time = req.body.time;

  console.log(email, password);

  const getuser = await otpSchema.findOne({ email: email });
  console.log(getuser);
  if (getuser) {
    if (getuser.otp === otp) {
      const timeDifference = time - getuser.time;
      const is30SecondsGap = timeDifference >= 30000;

      if (is30SecondsGap) {
        res.status(401).json({
          message: "OTP is expired",
          flag: -1,
        });
      } else {
        const hashedPassword = await encrypt.encrypPassword(password);
        try {
          const updateUserPassword = await userSchema.findOneAndUpdate(
            { email: email },
            { $set: { password: hashedPassword } }
          );
          await otpSchema.findOneAndDelete({ email: email });
          const updateServiceProviderPassword =
            await serviceProviderSchema.findOneAndUpdate(
              { email: email },
              { $set: { password: hashedPassword } }
            );
          await otpSchema.findOneAndDelete({ email: email });
          res.status(200).json({
            message: "Password Updated Successfully",
            flag: 1,
          });
        } catch (error) {
          res.status(500).json({
            message: "Error in updating Password",
            flag: -1,
          });
        }
      }
    } else {
      // delete otp
      await otpSchema.findOneAndDelete({ email: email });
      res.status(401).json({
        message: "Invalid OTP",
        flag: -1,
      });
    }
  } else {
    //delete otp
    await otpSchema.findOneAndDelete({ email: email });
    res.status(500).json({
      message: "Error...",
      flag: -1,
    });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  deleteUser,
  getUserById,
  updateUser,
  loginUser,
  isUserExist,
  resetPassword,
  toggleUserStatus
};
