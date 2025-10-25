import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  bannerImage: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    default: '',
  },
  extraSections: [{
    title: String,
    content: String,
    images: [String]
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Blog', BlogSchema);