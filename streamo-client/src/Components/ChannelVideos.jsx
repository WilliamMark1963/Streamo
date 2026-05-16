import React, { useState, useEffect } from 'react';
import { Video, Play, Loader2 } from 'lucide-react';
import API from '../utils/APIintercept';

function ChannelVideos({ channelId }) {
    const [videos, setVideos] = useState([]);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const fetchChannelVideos = async () => {
            try {
                setFetching(true);
                // GET request fetching all videos owned by this channel instance
                const { data } = await API.get(`/video/channel/${channelId}`);
                if (data.success) {
                    setVideos(data.videos);
                }
            } catch (err) {
                console.error("Failed to load channel assets:", err);
            } finally {
                setFetching(false);
            }
        };

        if (channelId) fetchChannelVideos();
    }, [channelId]);

    if (fetching) {
        return (
            <div className="flex justify-center items-center py-20 text-neutral-400 gap-2">
                <Loader2 size={20} className="animate-spin text-blue-500" />
                <span className="text-sm font-medium">Loading video library...</span>
            </div>
        );
    }

    if (videos.length === 0) {
        return (
            <div className='flex flex-col items-center justify-center py-20 text-center text-neutral-500 gap-3 animate-fadeIn'>
                <div className='p-4 bg-neutral-900 rounded-full border border-neutral-800 text-neutral-600 shadow-inner'>
                    <Video size={36} />
                </div>
                <div>
                    <h3 className='text-white font-semibold text-base mb-1'>No content uploaded yet</h3>
                    <p className='text-xs max-w-xs text-neutral-500'>
                        Videos uploaded to this channel endpoint structure path will appear publicly on this layout panel space.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 py-6 animate-fadeIn">
            {videos.map((video) => (
                <div key={video._id} className="group cursor-pointer flex flex-col gap-2">
                    {/* Video Thumbnail Box Frame */}
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800">
                        <img 
                            src={`http://localhost:5000${video.thumbnailUrl}`} 
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                            onError={(e) => { e.target.src = "https://placehold.co/600x400/181818/ffffff?text=Video" }}
                        />
                        {/* Hover Overlay Visual Effect */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <div className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white">
                                <Play size={18} fill="currentColor" />
                            </div>
                        </div>
                    </div>

                    {/* Metadata Content Descriptions Row */}
                    <div className="flex flex-col px-1">
                        <h4 className="text-sm font-bold text-neutral-100 line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors">
                            {video.title}
                        </h4>
                        <p className="text-[11px] text-neutral-400 mt-1">
                            {video.views} views • {new Date(video.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ChannelVideos;