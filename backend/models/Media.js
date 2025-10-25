import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
  filename: String,
  url: String,
  type: String,
  size: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

const Media = mongoose.model("Media", mediaSchema);

export default Media;
