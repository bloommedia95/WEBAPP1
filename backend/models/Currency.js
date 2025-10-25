import mongoose from "mongoose";

const currencySchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  symbol: { type: String },
  rate: { type: Number, default: 1.00 },
  createdAt: { type: Date, default: Date.now }
});

const Currency = mongoose.model("Currency", currencySchema);

export default Currency;
