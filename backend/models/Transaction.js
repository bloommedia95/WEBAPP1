import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  user: String,
  amount: Number,
  date: { type: Date, default: Date.now },
  status: { type: String, default: "Pending" }
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
