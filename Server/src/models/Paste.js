
import mongoose from "mongoose";

const pasteSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    default: null,
    index: true
  },
  maxViews: {
    type: Number,
    default: null
  },
  viewCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false // We're managing createdAt manually
});

export default mongoose.model('Paste', pasteSchema);