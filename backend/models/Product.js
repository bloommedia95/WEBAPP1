import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sku: { type: String },
    category: { type: String },
     subcategory: { type: String }, 
  price: { type: Number, required: true },
  mrp: { type: Number },
  images: [{ type: String }], // Array of image URLs
  video: { type: String }, // Product video path
  rating: { type: Number, default: 4.1 },
  ratingCount: { type: String, default: "2.5k" },
    stock: { type: Number, default: 0 },
    status: { type: String, default: "Active" },
    description: { type: String },
    imageUrl: { type: String }, // URL stored via multer

    gender: { type: String },
    brand: { type: String },
    size: { type: String }, 
    color: { type: String },
    material: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
