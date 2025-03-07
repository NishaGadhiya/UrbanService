const serviceSchema = require("../models/ServiceModel");
const multer = require("multer");
const path = require("path");
const cloudinaryController = require("./CloudinaryController");

// Multer Storage Configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Max file size: 2MB
}).single("image");

const addService = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: "Error while uploading file" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file selected" });
    }

    try {
      // Convert image to Buffer and store in MongoDB
      const serviceObj = {
        name: req.body.name,
        price: req.body.price,
        city: req.body.city,
        state: req.body.state,
        category: req.body.category,
        subcategory: req.body.subcategory,
        providerId: req.body.providerId,
        image: {
          data: req.file.buffer, // Binary image data
          contentType: req.file.mimetype, // Image type (jpg/png)
        },
      };
      console.log(serviceObj);
      // Save service in database
      const savedService = await serviceSchema.create(serviceObj);

      res.status(201).json({
        message: "Service added successfully!",
        data: savedService,
      });
    } catch (error) {
      console.error("Error adding service:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
};

const createService = async (req, res) => {
  try {
    const savedService = await serviceSchema.create(req.body);
    res.status(201).json({
      message: "Service created successfully ",
      data: savedService,
      flag: 1,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      data: error,
      falg: -1,
    });
  }
};

const getAllServices = async (req, res) => {
  try {
    const services = await serviceSchema
      .find()
      .populate("category")
      .populate("subcategory")
      .populate("providerId");
    const formattedServices = services.map((service) => ({
      ...service.toObject(),
      image: service.image
        ? {
            contentType: service.image.contentType,
            data: service.image.data.toString("base64"), // Convert buffer to Base64
          }
        : null,
    }));
    res.status(200).json({
      message: "Data fetched Successfully!",
      data: formattedServices,
      flag: 1,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      data: error,
      flag: -1,
    });
  }
};

const getServiceById = async (req, res) => {
  try {
    const service = await serviceSchema
      .findById(req.params.id)
      .populate("category")
      .populate("subcategory")
      .populate("providerId");
    if (service == null) {
      res.status(404).json({
        message: "Service not found",
        flag: -1,
      });
    } else {
      const formattedService = {
        ...service.toObject(),
        image: service.image
          ? {
              contentType: service.image.contentType,
              data: service.image.data.toString("base64"),
            }
          : null,
      };
      res.status(200).json({
        message: "Service found",
        data: formattedService,
        flag: 1,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      data: error,
      flag: -1,
    });
  }
};

const deleteService = async (req, res) => {
  try {
    const deletedService = await serviceSchema
      .findByIdAndDelete(req.params.id)
      .populate("category")
      .populate("subCategory")
      .populate("type")
      .populate("serviceprovider");
    if (deletedService == null) {
      res.status(404).json({
        message: "Service not found",
        flag: -1,
      });
    } else {
      res.status(200).json({
        message: "Service deleted successfully!",
        data: deletedService,
        flag: 1,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      data: error,
      flag: -1,
    });
  }
};

const updateService = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: "Error while uploading file" });
    }

    try {
      const { id } = req.params;
      const { name, price, city, state } = req.body;
      console.log("id", id);
      console.log(" req.body", req.body);
      // Find existing service
      let service = await serviceSchema.findById(id);
      if (!service)
        return res.status(404).json({ message: "Service not found" });

      // Update only provided fields
      if (name) service.name = name;
      if (price) service.price = price;
      if (city) service.city = city;
      if (state) service.state = state;
      if (req.file)
        service.image = {
          data: req.file.buffer, // Binary image data
          contentType: req.file.mimetype, // Image type (jpg/png)
        };
      console.log("Request Headers:", req.headers);
      console.log("Request Body:", req.body);
      console.log("Request File:", req.file);
      console.log(state, service.state);
      await service.save();
      res
        .status(200)
        .json({ message: "Service updated successfully!", data: service });
    } catch (error) {
      console.error("Error updating service:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
};

const getServiceByServiceProviderId = async (req, res) => {
  const serviceProviderId = req.user.id;
  try {
    const services = await serviceSchema.find({
      providerId: serviceProviderId,
    });
    // console.log(services)
    if (services && services.length > 0) {
      res.status(200).json({
        message: "Service Found",
        data: services,
        flag: 1,
      });
    } else {
      res.status(200).json({
        message: "No service Found",
        flag: -1,
        data: [],
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      data: error.message,
      flag: -1,
    });
  }
};

const serviceFilter = async (req, res) => {
  console.log("Req query...", req.query);
  const services = await serviceSchema
    .find({ serviceName: { $regex: req.query.serviceName, $options: "i" } })
    .populate("category")
    .populate("subCategory")
    .populate("type")
    .populate("serviceprovider");
  if (services && services.length > 0) {
    res.status(200).json({
      message: "Services Found Successfully",
      data: services,
      flag: 1,
    });
  } else {
    res.status(404).json({
      message: "No Service Found In Database",
      data: [],
      flag: -1,
    });
  }
};

module.exports = {
  createService,
  getAllServices,
  getServiceById,
  deleteService,
  updateService,
  getServiceByServiceProviderId,
  addService,
  serviceFilter,
};
