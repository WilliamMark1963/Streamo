import express from 'express';
import { 
    createChannel, 
    getMyChannel,
    updateChannelAvatar,
    updateChannelBanner,
    deleteChannel
 } from '../Controller/channel.controller.js';
import { verifyToken } from '../Middleware/verifyToken.js';
import { upload } from '../Middleware/fileUpload.js';
const router = express.Router();

// Channel Creation
router.post('/createChannel', verifyToken,upload.single('avatar'), createChannel);
// To get Channel
router.get('/myChannel', verifyToken, getMyChannel);

// To update the avatar
router.put('/channel/:channelId/update-avatar', verifyToken, upload.single('avatar'), updateChannelAvatar);
// To update the banner
router.put('/channel/:channelId/update-banner', verifyToken, upload.single('banner'), updateChannelBanner);
// To Delete the channel
router.delete('/channel/:channelId/delete', verifyToken, deleteChannel);

export default router;