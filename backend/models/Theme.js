import mongoose from 'mongoose';

const ThemeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    required: true
  },
  colors: {
    primary: {
      type: String,
      required: true,
      default: '#2c4691'
    },
    secondary: {
      type: String,
      required: true,
      default: '#5a7bd5'
    },
    accent: {
      type: String,
      required: true,
      default: '#ff4444'
    },
    background: {
      type: String,
      required: true,
      default: '#ffffff'
    },
    surface: {
      type: String,
      required: true,
      default: '#f8faff'
    },
    text: {
      type: String,
      required: true,
      default: '#333333'
    },
    textSecondary: {
      type: String,
      required: true,
      default: '#666666'
    },
    success: {
      type: String,
      required: true,
      default: '#4caf50'
    },
    warning: {
      type: String,
      required: true,
      default: '#ff9800'
    },
    error: {
      type: String,
      required: true,
      default: '#f44336'
    },
    border: {
      type: String,
      required: true,
      default: '#e0e0e0'
    },
    shadow: {
      type: String,
      required: true,
      default: 'rgba(0, 0, 0, 0.1)'
    }
  },
  gradients: {
    primary: {
      type: String,
      default: 'linear-gradient(135deg, #2c4691, #5a7bd5)'
    },
    secondary: {
      type: String,
      default: 'linear-gradient(135deg, #ff4444, #ff6666)'
    },
    success: {
      type: String,
      default: 'linear-gradient(135deg, #4caf50, #66bb6a)'
    }
  },
  isActive: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: String,
    default: 'admin'
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Ensure only one theme is active at a time
ThemeSchema.pre('save', async function(next) {
  if (this.isActive) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { isActive: false }
    );
  }
  next();
});

export default mongoose.model('Theme', ThemeSchema);