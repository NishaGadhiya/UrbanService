const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const serviceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    providerId: {
      type: Schema.Types.ObjectId,
      ref: "ServiceProvider",
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
    },
    area: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    image: {
      data: Buffer, // Store image as binary
      contentType: String, // Store image MIME type (e.g., 'image/jpeg')
      // type: String, // Store file path instead of binary data
      // required: true, // Ensure an image is always stored
    },
    status: {
      type: Boolean,
      default: true, // Store image MIME type (e.g., 'image/jpeg')
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Service", serviceSchema);


