import mongoose from "mongoose";

const languageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true }
});

const Language = mongoose.model("Language", languageSchema);

export default Language;
