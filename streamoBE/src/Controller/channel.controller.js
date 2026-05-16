import { Channel } from '../Model/channel.model.js';
import { User } from '../Model/user.model.js';
export const createChannel = async (req, res) => {
    try {
        const { name, handle, description } = req.body;
        const ownerId = req.user._id; // Assuming you have an auth middleware

        // 1. Check if handle is taken
        const handleExists = await Channel.findOne({ handle });
        if (handleExists) return res.status(400).json({ message: "Handle already taken" });

        // 2. Check if user already has a channel
        const user = await User.findById(ownerId);
        if (user.hasChannel) return res.status(400).json({ message: "User already has a channel" });

        // 3. Create Channel
        const newChannel = await Channel.create({
            name,
            handle,
            description,
            owner: ownerId
        });

        // 4. Update User status
        user.hasChannel = true;
        await user.save();

        res.status(201).json({
            success: true,
            message: "Channel created successfully",
            channel: newChannel
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMyChannel = async (req, res) => {
    try {
        const channel = await Channel.findOne({ owner: req.user._id });
        if (!channel) return res.status(404).json({ message: "Channel not found" });
        
        res.status(200).json(channel);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};