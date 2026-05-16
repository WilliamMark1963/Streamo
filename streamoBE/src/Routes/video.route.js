import express from 'express';
import { handleVideoUpload } from '../Controller/video.controller.js';
import { uploadMedia } from '../Middleware/videoMulter.js';
import { verifyToken } from '../Middleware/verifyToken.js';

const router = express.Router();

// Maps multiple discrete field binaries out of a single multi-part form stream
router.post(
    '/upload', 
    // requireAuthentication, // Add auth layer security here when ready
    uploadMedia.fields([
        { name: 'videoFile', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 }
    ]), 
    handleVideoUpload
);

export default router;