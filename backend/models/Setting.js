import mongoose from "mongoose";

const settingSchema = new mongoose.Schema({
  // 🔹 General Settings
  imagesPerProduct: { type: Number, default: 12 },
  autoTranslation: { type: Boolean, default: false },
  defaultLanguage: { type: String, default: "English" },
  defaultCurrency: { type: String, default: "INR" },
  defaultTimeZone: { type: String, default: "Asia/Kolkata" },
  defaultDateFormat: { type: String, default: "YYYY-MM-DD" },
  receiptSize: { type: String, default: "80 mm" },

  // 🔹 Invoice Settings
  enableInvoiceEmail: { type: Boolean, default: true },
  fromEmail: { type: String, default: "admin@gmail.com" },

  // 🔹 Company Information
  companyLocation: { type: String, default: "" },
  companyName: { type: String, default: "" },
  vatNumber: { type: String, default: "" },
  address: { type: String, default: "" },
  postCode: { type: String, default: "" },

  // 🔹 Contact Information
  contact: { type: String, default: "" },
  email: { type: String, default: "" },
  website: { type: String, default: "" }
}, { timestamps: true });

const Setting = mongoose.model("Setting", settingSchema);
export default Setting;
