import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Play } from 'lucide-react';
import API from '../utils/APIintercept';

function Home() {
    const [videos, setVideos] = useState([]);
    const [filteredVideos, setFilteredVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("All");

    // Static placeholder filter categories
    const categories = ["All", "Tech", "Music", "Gaming", "Cooking", "Web Development", "Podcasts"];

    // Fetch the open public video pool
    useEffect(() => {
        const fetchHomeFeed = async () => {
            try {
                setLoading(true);
                const response = await API.get('/video/all-videos');
                const videoData = response.data.videos || [];
                setVideos(videoData);
                setFilteredVideos(videoData); // Initial view displays everything
            } catch (error) {
                console.error("Error pulling public feed resources:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHomeFeed();
    }, []);

    // Filter processing simulation handler
const handleFilterClick = (category) => {
    setActiveFilter(category);
    if (category === "All") {
        setFilteredVideos(videos); // Show everything
    } else {
        //  Accurate property lookup instead of fuzzy string guessing!
        const filtered = videos.filter(video => video.category === category);
        setFilteredVideos(filtered);
    }
};

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center text-white">
                <Loader2 className="animate-spin text-blue-500 mb-2" size={36} />
                <p className="text-xs text-neutral-400">Assembling your public media streaming matrix...</p>
            </div>
        );
    }

    const backendBase = "http://localhost:5000";

    return (
        <div className="w-full min-h-screen bg-[#0f0f0f] text-white px-4 md:px-12 py-6">
            
            {/* 1. HORIZONTAL SCROLLABLE CATEGORY FILTERS STRIP */}
            <div className="flex gap-3 overflow-x-auto pb-4 mb-8 scrollbar-none no-scrollbar select-none">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => handleFilterClick(category)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all duration-200 ${
                            activeFilter === category 
                                ? 'bg-white text-black scale-102 shadow-md' 
                                : 'bg-[#1c1c1c] text-neutral-300 border border-neutral-900 hover:bg-[#262626]'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Empty State Layout Fallback */}
            {filteredVideos.length === 0 ? (
                <div className="w-full py-20 text-center border border-dashed border-neutral-900 rounded-2xl bg-[#161616]/20">
                    <p className="text-sm font-semibold text-neutral-400">No matching streaming tracks indexed</p>
                    <p className="text-xs text-neutral-600 mt-0.5">Try selecting a different filter segment chip above to refresh your viewport canvas.</p>
                </div>
            ) : (
                /* 2. MAIN RESPONSIVE YOUTUBE-STYLE VIDEO GRID DECK */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 animate-fadeIn">
                    {filteredVideos.map((video) => {
                        const fullThumbnail = video.thumbnailUrl?.startsWith('http') ? video.thumbnailUrl : `${backendBase}${video.thumbnailUrl}`;
                        
                        return (
                            <Link 
                                key={video._id} 
                                to={`/watch/${video._id}`} 
                                state={{ videoData: video }} // 👈 Shares the state directly to your VideoPlayerPage
                                className="group flex flex-col gap-3 cursor-pointer"
                            >
                                {/* Thumbnail Frame container */}
                                <div className="aspect-video w-full bg-neutral-900 rounded-2xl relative overflow-hidden shadow-md border border-neutral-950">
                                    <img 
                                        src={fullThumbnail} 
                                        alt={video.title} 
                                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <div className="bg-blue-600 p-2.5 rounded-full shadow-lg text-white transform scale-90 group-hover:scale-100 transition-transform">
                                            <Play size={16} fill="white" />
                                        </div>
                                    </div>
                                </div>

                                {/* Channel Info Strip and Metadata Header */}
                                <div className="flex gap-3 px-1">
                                    {/* Channel Profile Avatar Circle */}
                                    <div className="w-9 h-9 bg-neutral-800 border border-neutral-900 rounded-full shrink-0 overflow-hidden flex items-center justify-center text-xs font-black uppercase tracking-wider text-neutral-300">
                                        {video.channel?.avatar ? (
                                            <img src={video.channel.avatar?.startsWith('http') ? video.channel.avatar : `${backendBase}${video.channel.avatar}`} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            video.channel?.name?.charAt(0) || 'S'
                                        )}
                                    </div>

                                    {/* Information Frame */}
                                    <div className="space-y-0.5 min-w-0">
                                        <h4 className="text-sm font-bold text-neutral-100 line-clamp-2 leading-snug tracking-tight group-hover:text-blue-400 transition-colors">
                                            {video.title}
                                        </h4>
                                        <div className="text-xs text-neutral-400 font-medium truncate">
                                            {video.channel?.name || "Unknown Channel"}
                                        </div>
                                        <div className="text-[11px] text-neutral-500 font-medium">
                                            {video.viewsCount || 0} views • {new Date(video.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Home;