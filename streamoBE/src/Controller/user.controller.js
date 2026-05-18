import { User } from '../Model/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Channel} from "../Model/channel.model.js"

// --- REGISTER ---
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email already registered" });

    // Just pass the plain password. Mongoose will validate length '8' here.
    const user = await User.create({
      fullName,
      email,
      password 
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    // If validation fails (like password length), it will return the error here
    res.status(400).json({ message: error.message });
  }
};

// --- LOGIN ---
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // 💡 Check if a channel exists for this user ID
    const userChannel = await Channel.findOne({ owner: user._id }); // Make sure field name matches ('owner' or 'userId')

    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.status(200).json({
      token,
      user: {
        _id: user._id, // Using _id here to match your frontend code user._id
        fullName: user.fullName,
        email: user.email,
        profilePicture: user.profilePicture,
        hasChannel: !!userChannel 
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};