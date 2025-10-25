import mongoose from "mongoose";

const attributeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  displayName: { type: String, required: true },
  option: { type: String, enum: ["dropdown", "radio"], required: true },
  published: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Attribute", attributeSchema);
