import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  orders: { type: Number, default: 0 }
});

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;   // ✅ ESM export
