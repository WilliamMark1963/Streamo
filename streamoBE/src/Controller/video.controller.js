import { Video } from '../Model/video.model';
import fs from 'fs';

export const handleVideoUpload = async (req, res) => {
    try {
        const { title, description, channelId, userId } = req.body;

        // Basic verification checks
        if (!title || !title.trim()) {
            return res.status(400).json({ success: false, message: "Video title field is mandatory." });
        }
        if (!channelId || !userId) {
            return res.status(400).json({ success: false, message: "Channel reference context properties missing." });
        }

        // Validate that files reached the middleware destination
        if (!req.files || !req.files.videoFile || !req.files.thumbnail) {
            // Cleanup fragments if one file uploaded but the other missed completely
            if (req.files?.videoFile) fs.unlinkSync(req.files.videoFile[0].path);
            if (req.files?.thumbnail) fs.unlinkSync(req.files.thumbnail[0].path);
            
            return res.status(400).json({ success: false, message: "Both video file and thumbnail frame are required." });
        }

        // Local relative storage paths to record in document profiles
        const videoUrlPath = `/uploads/videos/${req.files.videoFile[0].filename}`;
        const thumbnailUrlPath = `/uploads/thumbnails/${req.files.thumbnail[0].filename}`;

        // Create document instance payload
        const publishedVideo = await Video.create({
            title: title.trim(),
            description: description?.trim() || "",
            videoUrl: videoUrlPath,
            thumbnailUrl: thumbnailUrlPath,
            channelId,
            uploadedBy: userId
        });

        return res.status(201).json({
            success: true,
            message: "Content indexed and published successfully!",
            video: publishedVideo
        });

    } catch (error) {
        console.error("Video Controller Engine Failure:", error);
        
        // Remove uploaded files if database insertion drops midway
        if (req.files?.videoFile?.[0]?.path) fs.unlinkSync(req.files.videoFile[0].path);
        if (req.files?.thumbnail?.[0]?.path) fs.unlinkSync(req.files.thumbnail[0].path);

        return res.status(500).json({ 
            success: false, 
            message: "Internal server payload failure during database mapping." 
        });
    }
};