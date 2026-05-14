import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({
  fullName: { 
    type: String, 
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters'],
    match: [/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces']
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
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ],
        select: false // Safety: hide password from queries by default
  },
  profilePicture: { 
    type: String, 
    default: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  }
}, { timestamps: true });


userSchema.pre('save', async function (next) {
  // Only hash the password if it's new or modified
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export const User = mongoose.model('User', userSchema);

export const User = mongoose.model('User', userSchema);