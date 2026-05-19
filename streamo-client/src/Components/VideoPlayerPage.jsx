import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, Share2, Send, ArrowLeft, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import API from "../utils/APIintercept";

function VideoPlayerPage() {
    const { videoId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const { videoData } = location.state || {};
    const { user } = useSelector((state) => state.user); 

    // Dynamic states for active system entries
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [commentsLoading, setCommentsLoading] = useState(true);

    // Inline Comment Editing States
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editText, setEditText] = useState("");

    const isOwnChannel = user?._id === videoData?.owner;

    // 1. READ: Fetch Live Database Comments on Route Mount / Video Change
    useEffect(() => {
        const fetchCommentsThread = async () => {
            try {
                setCommentsLoading(true);
                const response = await API.get(`/comment/${videoId}`);
                setComments(response.data.comments || []);
            } catch (error) {
                console.error("Error downloading comments metrics registry:", error);
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
            alert(error.response?.data?.message || "Failed tracking target message node parameters.");
        }
    };

    // 3. UPDATE: Trigger Inline Edit State Mode
    const startEditing = (comment) => {
        setEditingCommentId(comment._id);
        setEditText(comment.text);
    };

    // Save Updated Comment Payload
    const handleUpdateComment = async (e, commentId) => {
        e.preventDefault();
        if (!editText.trim()) return;

        try {
            const response = await API.put(`/comment/${commentId}`, { text: editText });
            // Map over state and update the modified comment element block
            setComments(comments.map(c => c._id === commentId ? response.data.comment : c));
            setEditingCommentId(null);
            setEditText("");
        } catch (error) {
            alert(error.response?.data?.message || "Failed to update comment.");
        }
    };

    // 4. DELETE: Remove Comment from Database and UI State
    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Are you sure you want to delete this comment?")) return;
        
        try {
            await API.delete(`/comment/${commentId}`);
            // Remove the comment from UI state immediately
            setComments(comments.filter(c => c._id !== commentId));
        } catch (error) {
            alert(error.response?.data?.message || "Failed to delete comment.");
        }
    };

    const handleSubscribeClick = () => {
        if (isOwnChannel) {
            alert("You cannot subscribe to your own channel!");
            return;
        }
        setIsSubscribed(!isSubscribed);
    };

    if (!videoData) {
        return (
            <div className="w-full min-h-screen bg-[#0f0f0f] text-white flex flex-col items-center justify-center gap-4">
                <p className="text-neutral-400 text-sm">No video metadata payload found in navigation state context.</p>
                <button onClick={() => navigate('/')} className="bg-blue-600 text-xs px-4 py-2 rounded-full font-bold">Go Home</button>
            </div>
        );
    }

    const backendBase = "http://localhost:5000";
    const fullVideoUrl = videoData.videoUrl?.startsWith('http') ? videoData.videoUrl : `${backendBase}${videoData.videoUrl}`;

    return (
        <div className="w-full min-h-screen bg-[#0f0f0f] text-white px-4 md:px-12 py-6">
            
            <button 
                onClick={() => navigate(-1)} 
                className="flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white mb-6 transition-colors cursor-pointer"
            >
                <ArrowLeft size={14} /> Back
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                {/* LEFT COLUMN: PLAYER AND ENGAGEMENT */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-neutral-900">
                        <video src={fullVideoUrl} controls autoPlay className="w-full h-full object-contain" poster={`${backendBase}${videoData.thumbnailUrl}`} />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-xl md:text-2xl font-black tracking-tight leading-snug">{videoData.title}</h1>
                        
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-900 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-neutral-800 border border-neutral-900 rounded-full overflow-hidden flex items-center justify-center text-xs font-black uppercase text-neutral-300 shrink-0">
                                    {videoData.channel?.avatar ? (
                                        <img src={videoData.channel.avatar.startsWith('http') ? videoData.channel.avatar : `${backendBase}${videoData.channel.avatar}`} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        videoData.channel?.name?.charAt(0) || 'S'
                                    )}
                                </div>
                                <div className="mr-2">
                                    <h4 className="text-sm font-black text-neutral-100 leading-tight">{videoData.channel?.name || "Unknown Channel"}</h4>
                                    <p className="text-[11px] text-neutral-500 font-medium">{videoData.viewsCount || 0} views</p>
                                </div>

                                {isOwnChannel ? (
                                    <span className="text-[10px] uppercase font-black tracking-widest text-neutral-500 bg-neutral-900/50 border border-neutral-900 px-3 py-2 rounded-xl select-none">Your Channel</span>
                                ) : (
                                    <button onClick={handleSubscribeClick} className={`flex items-center gap-1.5 text-xs font-black px-5 py-2 rounded-full transition-all tracking-wide active:scale-[0.98] cursor-pointer shadow-sm ${isSubscribed ? 'bg-neutral-800 border border-neutral-700 text-neutral-300 hover:bg-neutral-700' : 'bg-white text-black hover:bg-neutral-200'}`}>
                                        {isSubscribed ? "Subscribed" : "Subscribe"}
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="bg-neutral-900 border border-neutral-800 rounded-full flex items-center p-1">
                                    <button className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold hover:bg-neutral-800 rounded-l-full cursor-pointer transition-colors border-r border-neutral-800">
                                        <ThumbsUp size={14} /> {videoData.likes || 0}
                                    </button>
                                    <button className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold hover:bg-neutral-800 rounded-r-full cursor-pointer transition-colors">
                                        <ThumbsDown size={14} />
                                    </button>
                                </div>
                                <button className="bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors">
                                    <Share2 size={14} /> Share
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#161616] border border-neutral-900 rounded-2xl p-4 text-sm shadow-md">
                        <p className="font-bold text-xs tracking-wider uppercase text-neutral-400 mb-1">Description</p>
                        <p className="text-neutral-300 leading-relaxed font-medium">{videoData.description || "No description provided."}</p>
                    </div>
                </div>

                {/* RIGHT SIDE: LIVE COMMENT DISCUSSIONS MODULE (WITH CRUD) */}
                <div className="bg-[#161616] border border-neutral-900 rounded-2xl p-4 md:p-6 shadow-xl flex flex-col h-[calc(100vh-180px)] lg:h-[600px]">
                    <h3 className="text-sm font-black tracking-wider uppercase border-b border-neutral-900 pb-3 mb-4">
                        Comments ({comments.length})
                    </h3>

                    <form onSubmit={handleAddComment} className="flex gap-2 mb-6">
                        <input 
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder={user ? "Add a public comment..." : "Log in to post a comment..."}
                            disabled={!user}
                            className="flex-1 bg-[#0f0f0f] border border-neutral-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        />
                        <button 
                            type="submit" 
                            disabled={!user || !newComment.trim()}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-800 disabled:text-neutral-600 text-white p-2.5 rounded-xl transition-transform active:scale-95 flex items-center justify-center cursor-pointer shadow-md shadow-black/40"
                        >
                            <Send size={14} />
                        </button>
                    </form>

                    {/* DYNAMIC SCROLL CONTAINER */}
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
                            comments.map((comment) => {
                                const isCommentOwner = user?._id === comment.user?._id;

                                return (
                                    <div key={comment._id} className="border-b border-neutral-950 pb-3 last:border-0 animate-fadeIn">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                {/* User Avatar Circle */}
                                                <div className="w-5 h-5 rounded-full bg-neutral-800 border border-neutral-900 overflow-hidden flex items-center justify-center text-[9px] font-bold text-neutral-400">
                                                    {comment.user?.avatar ? (
                                                        <img src={comment.user.avatar.startsWith('http') ? comment.user.avatar : `${backendBase}${comment.user.avatar}`} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        comment.user?.name?.charAt(0) || 'U'
                                                    )}
                                                </div>
                                                <span className="text-xs font-extrabold text-neutral-300">@{comment.user?.name || "Anonymous"}</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-neutral-500 font-semibold">
                                                    {new Date(comment.createdAt).toLocaleDateString(undefined, {dateStyle: 'short'})}
                                                </span>
                                                
                                                {/* Conditional Edit/Delete Actions (Only for Comment Owner) */}
                                                {isCommentOwner && editingCommentId !== comment._id && (
                                                    <div className="flex items-center gap-2.5 text-[10px] text-neutral-500 font-bold ml-2">
                                                        <button onClick={() => startEditing(comment)} className="hover:text-blue-400 transition-colors cursor-pointer">Edit</button>
                                                        <button onClick={() => handleDeleteComment(comment._id)} className="hover:text-red-500 transition-colors cursor-pointer">Delete</button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Conditional Body View: Normal Text Layout vs Inline Edit Input Form */}
                                        {editingCommentId === comment._id ? (
                                            <form onSubmit={(e) => handleUpdateComment(e, comment._id)} className="mt-2 pl-7 flex gap-2">
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
                                                    <button type="button" onClick={() => setEditingCommentId(null)} className="bg-neutral-800 text-[10px] font-bold px-3 py-1.5 rounded-lg text-neutral-400 cursor-pointer hover:bg-neutral-700">Cancel</button>
                                                </div>
                                            </form>
                                        ) : (
                                            <p className="text-xs text-neutral-400 mt-1 pl-7 font-medium leading-relaxed break-words">
                                                {comment.text}
                                            </p>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default VideoPlayerPage;