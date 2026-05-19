import express from 'express';
import { 
    addComment, 
    getVideoComments, 
    updateComment, 
    deleteComment 
} from '../Controller/comment.controller.js';
import { verifyToken } from '../Middleware/verifyToken.js';

const router = express.Router();

router.get('/:videoId', getVideoComments);
router.post('/:videoId', verifyToken, addComment);
router.put('/:commentId', verifyToken, updateComment);
router.delete('/:commentId', verifyToken, deleteComment);

export default router;