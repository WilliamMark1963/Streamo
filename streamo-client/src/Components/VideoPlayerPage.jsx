import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, Share2, Send, ArrowLeft } from 'lucide-react';

function VideoPlayerPage() {
    const { videoId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // Safely pull state passed through the Link component wrapper fallback
    const { videoData } = location.state || {};

    // Static placeholder comments state model
    const [comments, setComments] = useState([
        { id: 1, user: "Alex Mercer", text: "Wow, the fidelity on this content stream layout is absolutely incredible! 🔥", timestamp: "2 hours ago" },
        { id: 2, user: "Sarah Connor", text: "Great architectural breakdown. Clear, crisp, and clean audio staging.", timestamp: "5 hours ago" },
        { id: 3, user: "Devon Lane", text: "Can you provide the GitHub repository links for this project model setup?", timestamp: "1 day ago" }
    ]);
    const [newComment, setNewComment] = useState("");

    const handleAddComment = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setComments([
            {
                id: Date.now(),
                user: "Anonymous Creator",
                text: newComment,
                timestamp: "Just now"
            },
            ...comments
        ]);
        setNewComment("");
    };

    // If a user navigates here directly without state, fetch fallback or display error
    if (!videoData) {
        return (
            <div className="w-full min-h-screen bg-[#0f0f0f] text-white flex flex-col items-center justify-center gap-4">
                <p className="text-neutral-400 text-sm">No video metadata payload found in navigation state context.</p>
                <button onClick={() => navigate('/')} className="bg-blue-600 text-xs px-4 py-2 rounded-full font-bold">Go Home</button>
            </div>
        );
    }

    // Dynamic clean absolute URL compiler for asset loading matching your app.js backend configurations
    const backendBase = "http://localhost:5000";
    const fullVideoUrl = videoData.videoUrl?.startsWith('http') ? videoData.videoUrl : `${backendBase}${videoData.videoUrl}`;

    return (
        <div className="w-full min-h-screen bg-[#0f0f0f] text-white px-4 md:px-12 py-6">
            
            {/* Top Navigation Back button */}
            <button 
                onClick={() => navigate(-1)} 
                className="flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white mb-6 transition-colors cursor-pointer"
            >
                <ArrowLeft size={14} /> Back
            </button>

            {/* Layout Grid Split Splitter */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                {/* LEFT SIDE COLUMN: VIDEO CONTROLLER FRAME AND DETAILS */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Native Video Element Wrapper Container */}
                    <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-neutral-900">
                        <video 
                            src={fullVideoUrl} 
                            controls 
                            autoPlay
                            className="w-full h-full object-contain"
                            poster={`${backendBase}${videoData.thumbnailUrl}`}
                        />
                    </div>

                    {/* Metadata Header Segment */}
                    <div className="space-y-2">
                        <h1 className="text-xl md:text-2xl font-black tracking-tight leading-snug">
                            {videoData.title}
                        </h1>
                        
                        {/* Engagement Bar Metric Elements */}
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-900 pb-4">
                            <p className="text-neutral-400 text-xs font-medium">
                                {videoData.viewsCount || 0} views • {new Date(videoData.createdAt || Date.now()).toLocaleDateString()}
                            </p>
                            
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

                    {/* Expandable Description Box Container Layout */}
                    <div className="bg-[#161616] border border-neutral-900 rounded-2xl p-4 text-sm shadow-md">
                        <p className="font-bold text-xs tracking-wider uppercase text-neutral-400 mb-1">Description</p>
                        <p className="text-neutral-300 leading-relaxed font-medium">
                            {videoData.description || "No description provided for this media file asset block."}
                        </p>
                    </div>
                </div>

                {/* RIGHT SIDE COLUMN: DEDICATED STATIC COMMENTS THREAD COMPONENT */}
                <div className="bg-[#161616] border border-neutral-900 rounded-2xl p-4 md:p-6 shadow-xl flex flex-col h-[calc(100vh-180px)] lg:h-[600px]">
                    <h3 className="text-sm font-black tracking-wider uppercase border-b border-neutral-900 pb-3 mb-4">
                        Comments ({comments.length})
                    </h3>

                    {/* New Comment Submission Form Block */}
                    <form onSubmit={handleAddComment} className="flex gap-2 mb-6">
                        <input 
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a public comment..."
                            className="flex-1 bg-[#0f0f0f] border border-neutral-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                        />
                        <button 
                            type="submit" 
                            className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl transition-transform active:scale-95 flex items-center justify-center cursor-pointer shadow-md"
                        >
                            <Send size={14} />
                        </button>
                    </form>

                    {/* Scrollable Comments Mapping Deck List */}
                    <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-neutral-800">
                        {comments.map((comment) => (
                            <div key={comment.id} className="border-b border-neutral-950 pb-3 last:border-0">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs font-extrabold text-neutral-300">@{comment.user}</span>
                                    <span className="text-[10px] text-neutral-500 font-semibold">{comment.timestamp}</span>
                                </div>
                                <p className="text-xs text-neutral-400 mt-1 font-medium leading-relaxed">
                                    {comment.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default VideoPlayerPage;