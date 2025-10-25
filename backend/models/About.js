// models/About.js
import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: String,
  description: { type: String, required: true },
  mission: String,
  vision: String,
});

export default mongoose.model("About", aboutSchema);
