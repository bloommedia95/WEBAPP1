import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
  products: [{ name: String, quantity: Number, price: Number }],
  totalAmount: Number,
  status: { type: String, default: "Pending" }
}, { timestamps: true });

export default mongoose.model("Purchase", purchaseSchema);
