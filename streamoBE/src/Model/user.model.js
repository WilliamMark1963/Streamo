import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({
  fullName: { 
    type: String, 
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true, 
    lowercase: true,
    validate: [validator.isEmail, 'Invalid email format']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be 8+ characters'],
    select: false // Safety: hide password from queries by default
  },
  profilePicture: { 
    type: String, 
    default: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);