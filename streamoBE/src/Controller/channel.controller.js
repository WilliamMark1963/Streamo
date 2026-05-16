import { Channel } from '../Model/channel.model.js';
import { User } from '../Model/user.model.js';
export const createChannel = async (req, res) => {
    try {
        const { channelName, handle, description } = req.body;
        const ownerId = req.user._id;

        if (!channelName || !handle) {
            return res.status(400).json({ message: "Channel name and unique handle are required" });
        }

        const formattedHandle = handle.toLowerCase().trim();
        const handleExists = await Channel.findOne({ handle: formattedHandle });
        if (handleExists) {
            return res.status(400).json({ message: "Handle is already taken. Try another." });
        }

        const user = await User.findById(ownerId);
        if (!user) return res.status(404).json({ message: "User account not found" });
        if (user.hasChannel) return res.status(400).json({ message: "You already own a channel" });

        // Build a localized server asset path url reference string
        let profilePictureUrl = user.profilePicture; 
        if (req.file) {
            // Replaces backslashes with forward slashes for cross-platform system compatibility
            const normalizedPath = req.file.path.replace(/\\/g, '/');
            // This yields strings like: "http://localhost:5000/public/temp/avatar-1715..."
            profilePictureUrl = `${req.protocol}://${req.get('host')}/${normalizedPath}`;
        }

        const newChannel = await Channel.create({
            name: channelName.trim(),
            handle: formattedHandle,
            description: description ? description.trim() : "",
            owner: ownerId,
             avatar: profilePictureUrl,
            banner: "" 
        });

        user.hasChannel = true;
        await user.save();

        return res.status(201).json({
            success: true,
            message: "Channel created successfully local-side",
            channel: newChannel
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
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