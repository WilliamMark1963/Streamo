import React, { useState } from 'react';
import API from '../utils/APIintercept';

function CommentItem({ comment, currentUser, onUpdate, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.text);
    
    const backendBase = "http://localhost:5000";
    const isCommentOwner = currentUser?._id === comment.user?._id;

    // Handle Inline Edit Mode activation
    const startEditing = () => {
        setIsEditing(true);
        setEditText(comment.text);
    };

    // Save Updated Comment Payload
    const handleUpdateComment = async (e) => {
        e.preventDefault();
        if (!editText.trim()) return;

        try {
            const response = await API.put(`/comment/${comment._id}`, { text: editText });
            onUpdate(comment._id, response.data.comment);
            setIsEditing(false);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to update comment.");
        }
    };

    // Delete Comment from Database
    const handleDeleteComment = async () => {
        if (!window.confirm("Are you sure you want to delete this comment?")) return;
        
        try {
            await API.delete(`/comment/${comment._id}`);
            onDelete(comment._id);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to delete comment.");
        }
    };

    return (
        <div className="border-b border-neutral-950 pb-3 last:border-0 default-fadeIn text-white">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    {/* User Avatar Circle */}
<div className="w-5 h-5 rounded-full bg-neutral-800 border border-neutral-900 overflow-hidden flex items-center justify-center text-[9px] font-bold text-neutral-400">
    {comment.user?.profilePicture ? (
        <img 
            src={comment.user.profilePicture.startsWith('http') ? comment.user.profilePicture : `${backendBase}${comment.user.profilePicture}`} 
            alt="" 
            className="w-full h-full object-cover" 
        />
    ) : (
        comment.user?.fullName?.charAt(0) || 'U'
    )}
</div>

{/* User Name String */}
<span className="text-xs font-extrabold text-neutral-300">
    @{comment.user?.fullName || "Anonymous"}
</span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-neutral-500 font-semibold">
                        {new Date(comment.createdAt).toLocaleDateString(undefined, { dateStyle: 'short' })}
                    </span>
                    
                    {/* Conditional Edit/Delete Actions (Only for Comment Owner) */}
                    {isCommentOwner && !isEditing && (
                        <div className="flex items-center gap-2.5 text-[10px] text-neutral-500 font-bold ml-2">
                            <button onClick={startEditing} className="hover:text-blue-400 transition-colors cursor-pointer">Edit</button>
                            <button onClick={handleDeleteComment} className="hover:text-red-500 transition-colors cursor-pointer">Delete</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Conditional Body View: Normal Text Layout vs Inline Edit Input Form */}
            {isEditing ? (
                <form onSubmit={handleUpdateComment} className="mt-2 pl-7 flex gap-2">
                    <input 
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-1 bg-[#0f0f0f] border border-neutral-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500 text-neutral-300"
                        required
                        autoFocus
                    />
                    <div className="flex gap-1.5 shrink-0">
                        <button type="submit" className="bg-blue-600 text-[10px] font-bold px-3 py-1.5 rounded-lg text-white cursor-pointer hover:bg-blue-700">Save</button>
                        <button type="button" onClick={() => setIsEditing(false)} className="bg-neutral-800 text-[10px] font-bold px-3 py-1.5 rounded-lg text-neutral-400 cursor-pointer hover:bg-neutral-700">Cancel</button>
                    </div>
                </form>
            ) : (
                <p className="text-xs text-neutral-400 mt-1 pl-7 font-medium leading-relaxed break-words">
                    {comment.text}
                </p>
            )}
        </div>
    );
}

export default CommentItem;