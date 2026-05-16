import express from 'express';
import { createChannel, getMyChannel } from '../Controller/channel.controller.js';
import { verifyToken } from '../Middleware/verifyToken.js';
import { upload } from '../Middleware/fileUpload.js';
const router = express.Router();

router.post('/createChannel', verifyToken,upload.single('avatar'), createChannel);
router.get('/myChannel', verifyToken, getMyChannel);

export default router;