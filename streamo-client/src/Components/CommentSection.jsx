import React, { useState, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import API from '../utils/APIintercept';
import CommentItem from './CommentItem';

function CommentSection({ videoId }) {
const { userData: user } = useSelector((state) => state.user); 
    
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [commentsLoading, setCommentsLoading] = useState(true);

    // 1. READ: Fetch Live Database Comments
    useEffect(() => {
        const fetchCommentsThread = async () => {
            try {
                setCommentsLoading(true);
                const response = await API.get(`/comment/${videoId}`);
                setComments(response.data.comments || []);
            } catch (error) {
                console.error("Error fetching video comments:", error);
            } finally {
                setCommentsLoading(false);
            }
        };

        if (videoId) {
            fetchCommentsThread();
        }
    }, [videoId]);

    // 2. CREATE: Send New Comment to Database
    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        if (!user) {
            alert("Please log in to participate in discussion threads!");
            return;
        }

        try {
            const response = await API.post(`/comment/${videoId}`, { text: newComment });
            // Instantly append new populated comment item onto the top of the array
            setComments([response.data.comment, ...comments]);
            setNewComment("");
        } catch (error) {
            alert(error.response?.data?.message || "Failed to post comment.");
        }
    };

    // 3. UPDATE: Update modified comment element block locally
    const handleUpdateCommentInState = (commentId, updatedComment) => {
        setComments(comments.map(c => c._id === commentId ? updatedComment : c));
    };

    // 4. DELETE: Remove comment from UI state immediately
    const handleDeleteCommentFromState = (commentId) => {
        setComments(comments.filter(c => c._id !== commentId));
    };

    return (
        <div className="bg-[#161616] border border-neutral-900 rounded-2xl p-4 md:p-6 shadow-xl flex flex-col h-[calc(100vh-180px)] lg:h-[600px]">
            <h3 className="text-sm font-black tracking-wider uppercase border-b border-neutral-900 pb-3 mb-4">
                Comments ({comments.length})
            </h3>

            {/* Comment input form layout */}
            <form onSubmit={handleAddComment} className="flex gap-2 mb-6">
                <input 
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={user ? "Add a public comment..." : "Log in to post a comment..."}
                    disabled={!user}
                    className="flex-1 bg-[#0f0f0f] border border-neutral-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-white"
                />
                <button 
                    type="submit" 
                    disabled={!user || !newComment.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-800 disabled:text-neutral-600 text-white p-2.5 rounded-xl transition-transform active:scale-95 flex items-center justify-center cursor-pointer shadow-md"
                >
                    <Send size={14} />
                </button>
            </form>

            {/* Dynamic scroll container */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-neutral-800 no-scrollbar">
                {commentsLoading ? (
                    <div className="w-full py-12 flex flex-col items-center justify-center gap-1.5 text-neutral-500">
                        <Loader2 className="animate-spin text-blue-500" size={20} />
                        <span className="text-[11px] font-medium">Syncing database comment stream...</span>
                    </div>
                ) : comments.length === 0 ? (
                    <div className="w-full py-16 text-center text-neutral-600 text-xs font-semibold border border-dashed border-neutral-900 rounded-xl bg-[#0f0f0f]/30">
                        No comments posted yet. Start the conversation!
                    </div>
                ) : (
                    comments.map((comment) => (
                        <CommentItem 
                            key={comment._id}
                            comment={comment}
                            currentUser={user}
                            onUpdate={handleUpdateCommentInState}
                            onDelete={handleDeleteCommentFromState}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default CommentSection;