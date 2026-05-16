import { Channel } from '../Model/channel.model.js';
import { User } from '../Model/user.model.js';
import fs from'fs';
import path from 'path';
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

// Get Channel details
export const getMyChannel = async (req, res) => {
    try {
        const channel = await Channel.findOne({ owner: req.user._id });
        if (!channel) return res.status(404).json({ message: "Channel not found" });
        
        res.status(200).json(channel);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Helper function to safely delete old files from server disk storage
const deleteOldFile = (fileUrl) => {
    try {
        if (!fileUrl) return;
        // Turn "http://localhost:5000/public/temp/filename.jpg" into a local path like "public/temp/filename.jpg"
        const relativePath = fileUrl.split(`${process.env.PROTOCOL || 'http'}://${process.env.HOST || 'localhost:5000'}/`)[1];
        
        if (relativePath && fs.existsSync(relativePath)) {
            fs.unlinkSync(relativePath);
            console.log("Old asset file deleted successfully:", relativePath);
        }
    } catch (error) {
        console.error("Failed to delete old file from disk:", error.message);
    }
};

// 1. UPDATE CHANNEL AVATAR PROFILE PICTURE
export const updateChannelAvatar = async (req, res) => {
    try {
        const { channelId } = req.params;

        if (!req.file) {
            return res.status(400).json({ message: "No image file provided" });
        }

        const channel = await Channel.findById(channelId);
        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }

        // Authorization check: Ensure logged-in user owns the channel profile
        if (channel.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized to update this channel" });
        }

        // Wipe the old file to save space on your machine
        deleteOldFile(channel.avatar);

        // Normalize the new file path for storage matching
        const normalizedPath = req.file.path.replace(/\\/g, '/');
        const newAvatarUrl = `${req.protocol}://${req.get('host')}/${normalizedPath}`;

        // Save the fresh URL back down to your MongoDB document instance
        channel.avatar = newAvatarUrl;
        await channel.save();

        return res.status(200).json({
            success: true,
            message: "Profile avatar updated successfully!",
            channel
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// 2. UPDATE CHANNEL BANNER ARTWORK
export const updateChannelBanner = async (req, res) => {
    try {
        const { channelId } = req.params;

        if (!req.file) {
            return res.status(400).json({ message: "No banner file provided" });
        }

        const channel = await Channel.findById(channelId);
        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }

        if (channel.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized to update this channel" });
        }

        // Wipe the old banner file from your server folder layout structures
        deleteOldFile(channel.banner);

        const normalizedPath = req.file.path.replace(/\\/g, '/');
        const newBannerUrl = `${req.protocol}://${req.get('host')}/${normalizedPath}`;

        channel.banner = newBannerUrl;
        await channel.save();

        return res.status(200).json({
            success: true,
            message: "Channel banner updated successfully!",
            channel
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

//  Deleting the Channel
// DELETE CHANNEL PROFILE & CLEAN UP STORAGE
export const deleteChannel = async (req, res) => {
    try {
        const { channelId } = req.params;

        const channel = await Channel.findById(channelId);
        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }

        // Authorization check: Only the owner can delete the channel
        if (channel.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized to delete this channel" });
        }

        // 1. Delete associated local storage files if they exist
        deleteOldFile(channel.avatar);
        deleteOldFile(channel.banner);

        // 2. Remove the Channel document from the database
        await Channel.findByIdAndDelete(channelId);

        // 3. Reset the owner's user flag status back to false
        const user = await User.findById(req.user._id);
        if (user) {
            user.hasChannel = false;
            await user.save();
        }

        return res.status(200).json({
            success: true,
            message: "Channel and all associated local media assets deleted successfully."
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};