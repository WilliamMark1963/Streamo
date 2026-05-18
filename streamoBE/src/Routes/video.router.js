import express from 'express';
import { uploadVideoAsset, getChannelVideos } from '../Controller/video.controller.js';
import { verifyToken } from '../Middleware/verifyToken.js';
import { uploadVideo } from '../Middleware/fileUpload.js'; // Using your existing multer instance setup

const router = express.Router();

// Route: /video/upload
// Accepts two distinct dynamic form-data keys
router.post('/upload', verifyToken, uploadVideo.fields([
    { name: 'videoFile', maxCount: 1 },
    { name: 'thumbnailFile', maxCount: 1 }
]), uploadVideoAsset);

// Route: /video/channel/:channelId
// Open route to fetch specific video lists for layout injection
router.get('/channel/:channelId', getChannelVideos);

export default router;