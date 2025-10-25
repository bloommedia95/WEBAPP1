import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  price: Number,
  tax: Number,
  total: Number
});

const invoiceSchema = new mongoose.Schema({
  senderName: String,
  senderAddress: String,
  phone: String,
  invoiceNumber: String,
  issueDate: Date,
  dueDate: Date,
  amount: Number,
  status: { type: String, enum: ["Paid", "Unpaid", "Pending"] },
  issueFrom: {
    name: String,
    address: String,
    phone: String,
    email: String
  },
  issueFor: {
    name: String,
    address: String,
    phone: String,
    email: String
  },
  products: [productSchema],
  subtotal: Number,
  discount: Number,
  estTax: Number,
  grandTotal: Number,
});

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;
