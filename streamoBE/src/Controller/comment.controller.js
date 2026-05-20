import { Comment } from "../Model/comment.model.js";

// 1. ADD A NEW COMMENT (POST /comment/:videoId)
export const addComment = async (req, res) => {
    try {
        const { videoId } = req.params;
        const { text } = req.body;
        const userId = req.user._id; // Provided by your auth validation token middleware

        if (!text || !text.trim()) {
            return res.status(400).json({ message: "Comment content body text cannot be empty." });
        }

        const newComment = await Comment.create({
            video: videoId,
            user: userId,
            text: text.trim()
        });

        // Populate user details (name, handle, avatar) before sending back to client
        const populatedComment = await Comment.findById(newComment._id)
            .populate('user', 'fullName  profilePicture');

        return res.status(201).json({
            success: true,
            comment: populatedComment
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// 2. FETCH ALL COMMENTS FOR A VIDEO (GET /comment/:videoId)
export const getVideoComments = async (req, res) => {
    try {
        const { videoId } = req.params;

        // Fetch comments for the video, join user metadata, sort by newest first
        const comments = await Comment.find({ video: videoId })
            .populate('user', 'name avatar')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            comments
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// 3. UPDATE A COMMENT (PUT /comment/:commentId)
export const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { text } = req.body;
        const userId = req.user._id;

        if (!text || !text.trim()) {
            return res.status(400).json({ message: "Comment content cannot be empty." });
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found." });
        }

        // Check ownership
        if (comment.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Unauthorized. You can only edit your own comments." });
        }

        comment.text = text.trim();
        await comment.save();

        // Repopulate user details before returning
        const updatedComment = await Comment.findById(commentId).populate('user', 'name avatar');

        return res.status(200).json({
            success: true,
            message: "Comment updated successfully!",
            comment: updatedComment
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// 4. DELETE A COMMENT (DELETE /comment/:commentId)
export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user._id;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found." });
        }

        // Check ownership
        if (comment.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Unauthorized. You can only delete your own comments." });
        }

        await Comment.findByIdAndDelete(commentId);

        return res.status(200).json({
            success: true,
            message: "Comment removed successfully."
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};