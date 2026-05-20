import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, Share2, ArrowLeft } from 'lucide-react';
import { useSelector } from 'react-redux';
import CommentSection from './CommentSection';

function VideoPlayerPage() {
    const { videoId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const { videoData } = location.state || {};
    const { userData: user } = useSelector((state) => state.user); 

    const [isSubscribed, setIsSubscribed] = useState(false);
    
    // --- FRONTEND-ONLY INTERACTIVE STATE LAYOUT ---
    const [hasLiked, setHasLiked] = useState(() => {
        const savedLikeState = localStorage.getItem(`streamo_like_${videoId}`);
        return savedLikeState === 'true';
    });

    const [hasDisliked, setHasDisliked] = useState(() => {
        const savedDislikeState = localStorage.getItem(`streamo_dislike_${videoId}`);
        return savedDislikeState === 'true';
    });

    const [likesCount, setLikesCount] = useState(() => {
        const initialLikes = videoData?.likesCount || videoData?.likes || 0;
        const savedLikeState = localStorage.getItem(`streamo_like_${videoId}`);
        
        // Adjust baseline if the user liked it in a previous browser session
        return savedLikeState === 'true' ? initialLikes + 1 : initialLikes;
    });

    const isOwnChannel = user?._id === videoData?.owner;

    const handleSubscribeClick = () => {
        if (isOwnChannel) {
            alert("You cannot subscribe to your own channel!");
            return;
        }
        setIsSubscribed(!isSubscribed);
    };

    // --- FRONTEND LIKE HANDLER ---
    const handleLikeToggle = () => {
        if (hasLiked) {
            // Unlike
            setHasLiked(false);
            setLikesCount(prev => prev - 1);
            localStorage.setItem(`streamo_like_${videoId}`, 'false');
        } else {
            // Like
            setHasLiked(true);
            setLikesCount(prev => prev + 1);
            localStorage.setItem(`streamo_like_${videoId}`, 'true');

            // Clear dislike if it was active
            if (hasDisliked) {
                setHasDisliked(false);
                localStorage.setItem(`streamo_dislike_${videoId}`, 'false');
            }
        }
    };

    // --- FRONTEND DISLIKE HANDLER ---
    const handleDislikeToggle = () => {
        if (hasDisliked) {
            setHasDisliked(false);
            localStorage.setItem(`streamo_dislike_${videoId}`, 'false');
        } else {
            setHasDisliked(true);
            localStorage.setItem(`streamo_dislike_${videoId}`, 'true');

            // Clear like if it was active
            if (hasLiked) {
                setHasLiked(false);
                setLikesCount(prev => prev - 1);
                localStorage.setItem(`streamo_like_${videoId}`, 'false');
            }
        }
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
    let rawUrl = videoData?.videoUrl || "";

    if (rawUrl.endsWith("…")) {
        rawUrl = rawUrl.replace("…", "");
    }

    const isYouTube = rawUrl.includes("youtube.com") || rawUrl.includes("youtu.be");
    
    let fullVideoUrl = "";
    if (isYouTube) {
        if (rawUrl.includes("v=")) {
            const id = rawUrl.split("v=")[1]?.split("&")[0];
            fullVideoUrl = `https://www.youtube.com/embed/${id}`;
        } else if (rawUrl.includes("youtu.be/")) {
            const id = rawUrl.split("youtu.be/")[1]?.split("?")[0];
            fullVideoUrl = `https://www.youtube.com/embed/${id}`;
        }
    } else {
        fullVideoUrl = rawUrl.startsWith('http') ? rawUrl : `${backendBase}${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`;
    }

    return (
        <div className="w-full min-h-screen bg-[#0f0f0f] text-white px-4 md:px-12 py-6">
            
            <button 
                onClick={() => navigate(-1)} 
                className="flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white mb-6 transition-colors cursor-pointer"
            >
                <ArrowLeft size={14} /> Back
            </button>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                <div className="lg:col-span-2 space-y-4">
                    
                    <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-neutral-900 relative">
                        {isYouTube ? (
                            <iframe
                                src={fullVideoUrl}
                                title={videoData.title}
                                className="absolute top-0 left-0 w-full h-full"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        ) : (
                            <video
                                src={fullVideoUrl}
                                controls
                                className="absolute top-0 left-0 w-full h-full object-contain"
                                onError={(e) => console.log("Native video element media asset loading error: ", e)}
                            />
                        )}
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

                            {/* ENGAGEMENT CONTROLS BLOCK */}
                            <div className="flex items-center gap-2">
                                <div className="bg-neutral-900 border border-neutral-800 rounded-full flex items-center p-1">
                                    
                                    {/* LIKE BUTTON */}
                                    <button 
                                        onClick={handleLikeToggle}
                                        className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-l-full cursor-pointer transition-colors border-r border-neutral-800 ${hasLiked ? 'text-blue-500 bg-blue-500/10 hover:bg-blue-500/20' : 'text-white hover:bg-neutral-800'}`}
                                    >
                                        <ThumbsUp size={14} fill={hasLiked ? "currentColor" : "none"} /> {likesCount}
                                    </button>
                                    
                                    {/* DISLIKE BUTTON */}
                                    <button 
                                        onClick={handleDislikeToggle}
                                        className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-r-full cursor-pointer transition-colors ${hasDisliked ? 'text-red-500 bg-red-500/10 hover:bg-red-500/20' : 'text-white hover:bg-neutral-800'}`}
                                    >
                                        <ThumbsDown size={14} fill={hasDisliked ? "currentColor" : "none"} />
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

                <div className="w-full lg:sticky lg:top-4">
                    <CommentSection videoId={videoId} />
                </div>

            </div>
        </div>
    );
}

export default VideoPlayerPage;