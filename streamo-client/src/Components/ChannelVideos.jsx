import React, { useEffect, useState } from 'react';
import { Play, Film } from 'lucide-react';
import API from'../utils/APIintercept'

function ChannelVideos({ channelId }) {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeed = async () => {
            if (!channelId) return;
            try {
                // Hits router.get('/video/channel/:channelId')
                const response = await API.get(`/video/channel/${channelId}`);
                setVideos(response.data.videos || []);
            } catch (error) {
                console.error("Failed to load channel videos ecosystem tracking grids:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeed();
    }, [channelId]);

    if (loading) {
        return <div className="text-neutral-500 text-xs italic py-8">Loading video library feeds...</div>;
    }

    if (videos.length === 0) {
        return (
            <div className="w-full py-16 flex flex-col items-center justify-center border border-neutral-900 rounded-2xl bg-[#141414]/30 mt-4 text-center px-4">
                <Film className="text-neutral-700 mb-3 animate-pulse" size={32} />
                <p className="text-sm font-semibold text-neutral-400">No content published yet</p>
                <p className="text-xs text-neutral-600 max-w-xs mt-1">Upload a video to see it instantly indexed directly inside this video hub asset tab shelf layout.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-6 animate-fadeIn">
            {videos.map((video) => (
                <div key={video._id} className="group flex flex-col bg-[#161616] border border-neutral-900 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-0.5">
                    
                    {/* Thumbnail Image Framework Display container */}
                    <div className="aspect-video w-full bg-neutral-800 relative overflow-hidden group">
                        <img 
                            src={video.thumbnailUrl} 
                            alt={video.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <div className="bg-blue-600 p-2.5 rounded-full shadow-lg text-white transform scale-90 group-hover:scale-100 transition-transform">
                                <Play size={16} fill="white" />
                            </div>
                        </div>
                    </div>

                    {/* Metadata Content Area */}
                    <div className="p-3.5 flex flex-col flex-1">
                        <h4 className="text-sm font-bold text-neutral-100 line-clamp-1 group-hover:text-blue-400 transition-colors mb-1">
                            {video.title}
                        </h4>
                        <p className="text-neutral-500 text-xs line-clamp-2 leading-relaxed flex-1">
                            {video.description || "No asset descriptions added to this upload record instance."}
                        </p>
                        <div className="text-[10px] text-neutral-600 font-bold uppercase tracking-wider mt-3 pt-2 border-t border-neutral-900">
                            {video.views} views • {new Date(video.createdAt).toLocaleDateString()}
                        </div>
                    </div>

                </div>
            ))}
        </div>
    );
}

export default ChannelVideos;