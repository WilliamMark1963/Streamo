import {Video} from "../Model/video.model.js"
import { Channel } from "../Model/channel.model.js";

export const uploadVideoAsset = async (req, res) => {
    try {
        const { title, description } = req.body;
        const ownerId = req.user._id;

        if (!title) {
            return res.status(400).json({ message: "Video title is required." });
        }

        // 1. Locate the channel owned by the active user credentials
        const channel = await Channel.findOne({ owner: ownerId });
        if (!channel) {
            return res.status(404).json({ message: "You must create a channel before uploading videos." });
        }

        // 2. File verification checks (Using multer's field configurations)
        if (!req.files || !req.files.videoFile || !req.files.thumbnailFile) {
            return res.status(400).json({ message: "Both a video file and a thumbnail image are required." });
        }

        const videoFile = req.files.videoFile[0];
        const thumbnailFile = req.files.thumbnailFile[0];

        // 3. Normalize paths for storage matching cross-platform systems
        const normalizedVideoPath = videoFile.path.replace(/\\/g, '/');
        const normalizedThumbnailPath = thumbnailFile.path.replace(/\\/g, '/');

        // 4. Construct asset URLs
        const videoUrl = `${req.protocol}://${req.get('host')}/${normalizedVideoPath}`;
        const thumbnailUrl = `${req.protocol}://${req.get('host')}/${normalizedThumbnailPath}`;

        // 5. Commit record back down to MongoDB
        const newVideo = await Video.create({
            title: title.trim(),
            description: description ? description.trim() : "",
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