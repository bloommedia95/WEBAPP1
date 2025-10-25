import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  title: { type: String, required: true },      
  code: { type: String, required: true, unique: true },
  discountType: { type: String, enum: ['flat', 'percentage'], required: true },
  discount: { type: Number, required: true },
  minPurchase: { type: Number, default: 0 },
  maxDiscount: { type: Number, default: 0 }, // only for percentage type
  firstOrderOnly: { type: Boolean, default: false },
  startDate: { type: Date },
  endDate: { type: Date },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
 img: { type: String },
}, { timestamps: true });

export default mongoose.model("Coupon", couponSchema);
