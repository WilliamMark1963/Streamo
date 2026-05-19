import React, {useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Camera, Edit2, Video, PlusCircle, Loader2 } from 'lucide-react';
import { setChannel, removeChannelState } from "../utils/userSlice"
import API from'../utils/APIintercept'
import ChannelVideos from "./ChannelVideos"
import { useNavigate } from 'react-router-dom';

function Channel() {
    const dispatch = useDispatch();
    const { channelData } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState({ avatar: false, banner: false });

    // References to hidden domestic system input elements
    const avatarInputRef = useRef(null);
    const bannerInputRef = useRef(null);

    // 1. Fetch channel instance on component load
    useEffect(() => {
        const fetchChannelDetails = async () => {
            try {
                setLoading(true);
                // Matches your backend route: app.use("/", channelRouter) -> router.get('/myChannel')
                const response = await API.get('/myChannel');
                
                // Normalizing response payload data layout properties
                const channelInfo = response.data.channel || response.data;
                dispatch(setChannel(channelInfo));
            } catch (error) {
                console.error("Error pulling active channel data:", error.response?.data?.message || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchChannelDetails();
    }, [dispatch]);

    // 2. Dynamic Asset Upload Handler (Avatar & Banner updates)
    const handleAssetUpdate = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        // Matches backend expectations upload.single('avatar') or upload.single('banner')
        formData.append(type, file);

        try {
            setUploading(prev => ({ ...prev, [type]: true }));
            
            const endpoint = `/channel/${channelData._id}/update-${type}`;
            const response = await API.put(endpoint, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const updatedChannel = response.data.channel || response.data;
            dispatch(setChannel(updatedChannel));
            alert(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully!`);
        } catch (error) {
            alert(error.response?.data?.message || `Failed to update ${type}`);
        } finally {
            setUploading(prev => ({ ...prev, [type]: false }));
        }
    };

    // 3. Channel Deletion Handler
    const handleDeleteChannel = async () => {
        if (!window.confirm("Are you absolutely sure you want to permanently delete your channel? This will delete all media files layout structures and cannot be undone.")) return;

        try {
            await API.delete(`/channel/${channelData._id}/delete`);
            dispatch(removeChannelState());
            alert("Channel deleted successfully local-side.");
        } catch (error) {
            alert(error.response?.data?.message || "Failed to delete the channel profile asset.");
        }
    };

function  handleChannelworkspace(){
    navigate("/createChannel")
}


    if (loading) {
        return (
            <div className="w-full min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center text-white">
                <Loader2 className="animate-spin text-blue-500 mb-2" size={36} />
                <p className="text-sm tracking-wide text-neutral-400">Loading your creative channel ecosystem...</p>
            </div>
        );
    }

    if (!channelData) {
        return (
            <div className="w-full min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center text-white px-6 text-center">
                <h2 className="text-2xl font-bold mb-2">No Channel Found</h2>
                <p className="text-neutral-400 text-sm max-w-md mb-6">You haven't setup a streaming channel workspace under this account credentials yet.</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-full uppercase tracking-wider transition-transform active:scale-95" onClick={handleChannelworkspace}>
                    Create Channel Workspace
                </button>
            </div>
        );
    }

    return (
        <div className='w-full text-white bg-[#0f0f0f] min-h-screen pb-12 relative'>
            
            {/* HIDDEN FILE INPUT ENGINE FIELDS */}
            <input 
                type="file" 
                ref={avatarInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={(e) => handleAssetUpdate(e, 'avatar')} 
            />
            <input 
                type="file" 
                ref={bannerInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={(e) => handleAssetUpdate(e, 'banner')} 
            />

            {/* 1. CHANNEL BANNER SECTION */}
            <div className='relative h-48 w-full bg-gradient-to-r from-neutral-800 to-neutral-700 group overflow-hidden shadow-inner'>
                {uploading.banner ? (
                    <div className="w-full h-full flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <Loader2 className="animate-spin text-white" size={24} />
                    </div>
                ) : channelData.banner ? (
                    <img src={channelData.banner} className="w-full h-full object-cover" alt="Channel Banner" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-500 text-sm italic tracking-wide">
                        No banner uploaded. Hover here to append layout files.
                    </div>
                )}
                
                <button 
                    onClick={() => bannerInputRef.current?.click()}
                    className='absolute top-4 right-4 bg-black/70 hover:bg-black/90 text-white p-2.5 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-xs font-semibold tracking-wide border border-neutral-800 shadow-xl cursor-pointer'
                >
                    <Edit2 size={14} /> Edit Banner
                </button>
            </div>

            {/* 2. CHANNEL HEADER PROFILE STRIP */}
            <div className='px-6 md:px-16 py-8 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 border-b border-neutral-900'>
                
                {/* Avatar Display Frame */}
                <div 
                    className='relative w-36 h-36 md:w-40 md:h-40 group shrink-0 select-none'
                    onClick={() => avatarInputRef.current?.click()}
                >
                    {uploading.avatar ? (
                        <div className="w-full h-full bg-neutral-900 rounded-full flex items-center justify-center border-4 border-[#0f0f0f]">
                            <Loader2 className="animate-spin text-white" size={24} />
                        </div>
                    ) : channelData.avatar ? (
                        <img src={channelData.avatar} className='w-full h-full rounded-full object-cover border-4 border-[#0f0f0f] shadow-2xl' alt="Avatar" />
                    ) : (
                        <div className='w-full h-full bg-blue-600 rounded-full flex items-center justify-center text-4xl font-extrabold border-4 border-[#0f0f0f] shadow-2xl uppercase'>
                            {channelData.name?.charAt(0)}
                        </div>
                    )}
                    
                    <div className='absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity backdrop-blur-[2px]'>
                        <Camera size={28} className="text-white drop-shadow-md" />
                    </div>
                </div>

                {/* Profile Text Metadata */}
                <div className='mt-2 flex-1'>
                    <h1 className='text-3xl md:text-4xl font-extrabold tracking-tight'>
                        {channelData.name}
                    </h1>
                    <p className='text-neutral-400 mt-1.5 text-sm font-medium'>
                        @{channelData.handle} • {channelData.subscribersCount || 0} subscribers
                    </p>
                    <p className='text-neutral-500 mt-3 text-sm max-w-xl leading-relaxed'>
                        {channelData.description || "No channel description provided."}
                    </p>
                    
                    {/* Dashboard Action Controls */}
                    <div className='flex flex-wrap justify-center md:justify-start gap-3 mt-6'>
                        <button className='bg-neutral-900 border border-neutral-800 text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer'
                        onClick={() => navigate('/manage-videos')}
                        >
                            Manage Channel Settings
                        </button>
                        <button className='bg-blue-600 text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-1.5 shadow-md cursor-pointer' onClick={()=>navigate("/upload-video")}>
                            <PlusCircle size={14} /> Upload Video
                        </button>
                        <button 
                            onClick={handleDeleteChannel}
                            className='bg-red-600/20 border border-red-500/30 text-red-400 px-5 py-2.5 rounded-full text-xs font-bold hover:bg-red-600 hover:text-white transition-all active:scale-95 cursor-pointer shadow-md'
                        >
                            Delete Channel
                        </button>
                    </div>
                </div>
            </div>

            {/* 3. VIDEOS LIST FEED TARGET */}
            <div className='px-6 md:px-16 mt-6'>
                <div className='border-b border-neutral-900 flex gap-8 font-bold text-sm tracking-wide uppercase'>
                    <span className='pb-3 border-b-2 border-white text-white flex items-center gap-1.5 cursor-pointer'>
                        <Video size={16} /> Videos
                    </span>
                </div>

                {/* Relies directly on the mapped database string parameter identifier */}
                <ChannelVideos channelId={channelData._id} />
            </div>
        </div>
    );
}

export default Channel;