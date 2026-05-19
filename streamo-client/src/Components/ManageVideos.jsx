import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, Trash2, X, Film, AlertTriangle, Loader2 } from 'lucide-react';
import API from '../utils/APIintercept';

function ManageVideos() {
    const navigate = useNavigate();
    const { channelData } = useSelector((state) => state.user);
    
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // Edit Modal States
    const [editingVideo, setEditingVideo] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');

    // Fetch Channel Specific Catalog
    useEffect(() => {
        const fetchChannelVideos = async () => {
            if (!channelData?._id) return;
            try {
                setLoading(true);
                const response = await API.get(`/video/channel/${channelData._id}`);
                setVideos(response.data.videos || []);
            } catch (error) {
                console.error("Failed fetching studio asset index registries:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchChannelVideos();
    }, [channelData]);

    // Handle Delete Operation (CRUD - Delete)
    const handleDelete = async (videoId) => {
        if (!window.confirm("Are you sure you want to delete this video file entry permanently from your stream ecosystem registry?")) return;
        
        try {
            setActionLoading(true);
            // Hits backend setup layout routing target: router.delete('/video/:id')
            await API.delete(`/video/${videoId}`);
            
            // Sync client state seamlessly without running another heavy network fetch
            setVideos(videos.filter(v => v._id !== videoId));
            alert("Video asset successfully purged from data servers.");
        } catch (error) {
            alert(error.response?.data?.message || "Failed processing item removal transaction logic.");
        } finally {
            setActionLoading(false);
        }
    };

    // Open Edit Modal Form Framework
    const openEditModal = (video) => {
        setEditingVideo(video);
        setEditTitle(video.title);
        setEditDescription(video.description || '');
    };

    // Handle Update Submission (CRUD - Update)
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        if (!editTitle.trim()) return alert("Video title field tracking criteria required.");

        try {
            setActionLoading(true);
            // Hits backend text patch endpoint layout: router.put('/video/:id')
            const response = await API.put(`/video/${editingVideo._id}`, {
                title: editTitle,
                description: editDescription
            });

            // Re-map localized states instantly
            setVideos(videos.map(v => v._id === editingVideo._id ? { ...v, title: editTitle, description: editDescription } : v));
            alert("Video metadata configurations modified successfully!");
            setEditingVideo(null); // Clear Modal state
        } catch (error) {
            alert(error.response?.data?.message || "Failed modifying asset variable parameters.");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-[#0f0f0f] text-white flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-blue-500 mb-2" size={32} />
                <p className="text-xs text-neutral-400">Loading your streaming catalog registry matrices...</p>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-[#0f0f0f] text-white p-6 md:p-12">
            <div className="max-w-5xl mx-auto">
                
                {/* Header Back Strip */}
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white mb-6 transition-colors cursor-pointer"
                >
                    <ArrowLeft size={14} /> Back to Dashboard
                </button>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-900 pb-6 mb-8">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight">Channel Content Studio</h2>
                        <p className="text-xs text-neutral-400 mt-1">Perform configuration modifications, manage textual metadata schemas, or delete stream media profiles.</p>
                    </div>
                    <button 
                        onClick={() => navigate('/upload-video')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-3 rounded-xl uppercase tracking-wider transition-all active:scale-[0.98] self-start md:self-auto shadow-md"
                    >
                        Upload New Video
                    </button>
                </div>

                {/* Empty State Handler */}
                {videos.length === 0 ? (
                    <div className="w-full py-20 flex flex-col items-center justify-center border border-dashed border-neutral-800 rounded-2xl bg-[#161616]/40 text-center px-4">
                        <Film className="text-neutral-700 mb-3" size={36} />
                        <h4 className="text-sm font-bold text-neutral-400">No content indexing logs found</h4>
                        <p className="text-xs text-neutral-600 max-w-xs mt-1">Your video catalog index registry parameters are empty. Use the upload engine console to insert media formats.</p>
                    </div>
                ) : (
                    /* Administrative Data Grid Desk Table */
                    <div className="bg-[#161616] border border-neutral-900 rounded-2xl overflow-hidden shadow-xl">
                        <div className="p-4 bg-[#1a1a1a] border-b border-neutral-900 grid grid-cols-12 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                            <div className="col-span-8 md:col-span-6">Video Metadata Details</div>
                            <div className="hidden md:block col-span-3 text-center">Date Published</div>
                            <div className="hidden md:block col-span-1 text-center">Views</div>
                            <div className="col-span-4 md:col-span-2 text-right">Management Actions</div>
                        </div>

                        <div className="divide-y divide-neutral-900/60">
                            {videos.map((video) => (
                                <div key={video._id} className="p-4 grid grid-cols-12 items-center hover:bg-[#1c1c1c]/50 transition-colors">
                                    {/* Info Panel Left Block */}
                                    <div className="col-span-8 md:col-span-6 flex items-center gap-3 pr-2">
                                        <div className="w-20 aspect-video bg-neutral-900 rounded-lg overflow-hidden shrink-0 hidden sm:block border border-neutral-800">
                                            <img 
                                                src={video.thumbnailUrl?.startsWith('http') ? video.thumbnailUrl : `http://localhost:5000${video.thumbnailUrl}`} 
                                                alt="" 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="truncate">
                                            <h4 className="text-sm font-bold text-white truncate">{video.title}</h4>
                                            <p className="text-xs text-neutral-400 truncate max-w-[250px] md:max-w-[350px] mt-0.5">{video.description || "No descriptions."}</p>
                                        </div>
                                    </div>

                                    {/* Middle Segment Data Points */}
                                    <div className="hidden md:block col-span-3 text-center text-xs text-neutral-400 font-medium">
                                        {new Date(video.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                    </div>
                                    <div className="hidden md:block col-span-1 text-center text-xs font-bold text-neutral-300">
                                        {video.viewsCount || 0}
                                    </div>

                                    {/* Control Hotspots Right Columns */}
                                    <div className="col-span-4 md:col-span-2 flex items-center justify-end gap-2.5">
                                        <button 
                                            onClick={() => openEditModal(video)}
                                            disabled={actionLoading}
                                            className="p-2 text-neutral-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer disabled:opacity-30"
                                            title="Edit Metadata Parameters"
                                        >
                                            <Edit3 size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(video._id)}
                                            disabled={actionLoading}
                                            className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer disabled:opacity-30"
                                            title="Delete Media File Profile"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* CRUD TEXT-UPDATE DIALOG DRAWER OVERLAY MODAL */}
                {editingVideo && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="w-full max-w-lg bg-[#161616] border border-neutral-800 rounded-2xl p-6 shadow-2xl relative animate-fadeIn">
                            
                            <button 
                                onClick={() => setEditingVideo(null)} 
                                className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors cursor-pointer"
                            >
                                <X size={18} />
                            </button>

                            <h3 className="text-lg font-black tracking-tight mb-1 flex items-center gap-2">
                                Modify Video Context Configurations
                            </h3>
                            <p className="text-neutral-400 text-xs mb-5">Make adjustments to the dynamic textual string attributes of this production record profile storage container.</p>

                            <form onSubmit={handleUpdateSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">Video Title *</label>
                                    <input 
                                        type="text" 
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        className="w-full bg-[#0f0f0f] border border-neutral-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">Description Context Area</label>
                                    <textarea 
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                        rows={4}
                                        className="w-full bg-[#0f0f0f] border border-neutral-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500 transition-colors resize-none"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-2">
                                    <button 
                                        type="button"
                                        onClick={() => setEditingVideo(null)}
                                        className="px-4 py-2.5 rounded-xl border border-neutral-800 hover:bg-neutral-900 text-xs font-bold tracking-wide transition-colors cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={actionLoading}
                                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all active:scale-[0.97] cursor-pointer flex items-center gap-1.5 shadow-md"
                                    >
                                        {actionLoading ? <Loader2 className="animate-spin" size={14} /> : "Save Changes"}
                                    </button>
                                </div>
                            </form>

                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default ManageVideos;