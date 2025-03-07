const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subcategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true, // Ensuring it's always linked to a category
    },
    status: {
      type: Boolean,
      default: true, // Active by default
    },
  },
  { timestamps: true } // Auto-manage created_at & updated_at
);

module.exports = mongoose.model("SubCategory", subcategorySchema);

