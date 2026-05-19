import {Video} from "../Model/video.model.js"
import { Channel } from "../Model/channel.model.js";

// 1. CREATE OPERATIOn
export const uploadVideoAsset = async (req, res) => {
    try {
        // Pull category destructured straight from req.body payload
        const { title, description, category } = req.body;
        const ownerId = req.user._id;

        if (!title) {
            return res.status(400).json({ message: "Video title is required." });
        }

        // Locate the channel owned by the active user credentials
        const channel = await Channel.findOne({ owner: ownerId });
        if (!channel) {
            return res.status(404).json({ message: "You must create a channel before uploading videos." });
        }

        // File verification checks (Using multer's field configurations)
        if (!req.files || !req.files.videoFile || !req.files.thumbnailFile) {
            return res.status(400).json({ message: "Both a video file and a thumbnail image are required." });
        }

        const videoFile = req.files.videoFile[0];
        const thumbnailFile = req.files.thumbnailFile[0];

        // Normalize paths for storage matching cross-platform systems
        const normalizedVideoPath = videoFile.path.replace(/\\/g, '/');
        const normalizedThumbnailPath = thumbnailFile.path.replace(/\\/g, '/');

        // Construct asset URLs
        const videoUrl = `${req.protocol}://${req.get('host')}/${normalizedVideoPath}`;
        const thumbnailUrl = `${req.protocol}://${req.get('host')}/${normalizedThumbnailPath}`;

        // Commit record back down to MongoDB including category
        const newVideo = await Video.create({
            title: title.trim(),
            description: description ? description.trim() : "",
            category: category || "All", // Injects selected tag or falls back safely to 'All'
            videoUrl,
            thumbnailUrl,
            channel: channel._id,
            owner: ownerId
        });

        return res.status(201).json({
            success: true,
            message: "Video file package processed and published successfully!",
            video: newVideo
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// HELPER ROUTE: Fetch videos by specific channelId for your tab panel feed
export const getChannelVideos = async (req, res) => {
    try {
        const { channelId } = req.params;
        const videos = await Video.find({ channel: channelId }).sort({ createdAt: -1 });
        
        return res.status(200).json({
            success: true,
            videos
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// 3. UPDATE VIDEO TEXT METADATA (CRUD - Update)
export const updateVideoAsset = async (req, res) => {
    try {
        const { videoId } = req.params;
        // Accept category updates from editing form inputs
        const { title, description, category } = req.body;
        const ownerId = req.user._id;

        if (!title) {
            return res.status(400).json({ message: "Video title is required." });
        }

        // Locate the video and verify the authenticated request owner matches
        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({ message: "Video asset not found." });
        }

        if (video.owner.toString() !== ownerId.toString()) {
            return res.status(403).json({ message: "Unauthorized. You can only manage your own media content assets." });
        }

        // Commit text and structural category updates back to the instance document
        video.title = title.trim();
        video.description = description ? description.trim() : "";
        video.category = category || video.category; // 👈 Updates the category value or preserves existing state
        
        await video.save();

        return res.status(200).json({
            success: true,
            message: "Video metadata updated successfully!",
            video
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// 4. DELETE VIDEO ASSET PROFILE (CRUD - Delete)
export const deleteVideoAsset = async (req, res) => {
    try {
        const { videoId } = req.params;
        const ownerId = req.user._id;

        // Locate video entry
        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({ message: "Video file target not found." });
        }

        // Verify resource ownership access
        if (video.owner.toString() !== ownerId.toString()) {
            return res.status(403).json({ message: "Unauthorized. Action restricted to asset content owners." });
        }

        // Purge record from MongoDB
        await Video.findByIdAndDelete(videoId);

        /* 💡 Note: If you want to clean up local storage files on your drive, 
           you can eventually import 'fs' and delete video.videoUrl paths here.
        */

        return res.status(200).json({
            success: true,
            message: "Video record permanently purged from database registries."
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// FETCH ALL VIDEOS FOR PUBLIC HOME FEED (No token required)
export const getAllVideosPublic = async (req, res) => {
    try {
        // Find all videos, populate channel details, sort by newest
        const videos = await Video.find()
            .populate('channel', 'name avatar handle') 
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            videos
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};