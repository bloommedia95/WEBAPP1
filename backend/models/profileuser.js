import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contactNumber: { type: String, required: true },
  gender: { type: String, enum: ["male", "female", "other", ""], default: "" },
  birthday: { type: Date },
  alternateNumber: { type: String, default: "" },
  fullName: { type: String },
  cart: [{ 
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 }
  }],
  wishlist: [{ 
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
  }],
  address: [{
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    isDefault: { type: Boolean, default: false }
  }]
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
