import express from 'express';
import { createChannel, getMyChannel } from '../Controller/channel.controller.js';
import { verifyToken } from '../Middleware/verifyToken.js';

const router = express.Router();

router.post('/createChannel', verifyToken, createChannel);
router.get('/myChannel', verifyToken, getMyChannel);

export default router;