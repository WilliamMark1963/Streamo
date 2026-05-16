import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Camera, Edit2, Video, PlusCircle, Loader2, X, Film } from 'lucide-react';
import API from '../utils/APIintercept';
import { setChannel } from '../utils/userSlice';

function Channel() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Auth & Channel state data from Redux Store
    const { userData, channelData } = useSelector(store => store.user);

    // Bug Fix: If userData is cleared (Sign Out), immediately redirect to home page
    useEffect(() => {
        if (!userData) {
            navigate("/");
        }
    }, [userData, navigate]);

    // Check if the logged-in visitor is the actual owner of this channel channel page
    const isOwner = channelData?._id === id || channelData?.handle === id;
    const currentChannel = isOwner ? channelData : null;

    // Interactive Media Presentation States
    const [avatarPreview, setAvatarPreview] = useState(currentChannel?.avatar || userData?.profilePicture || "");
    const [bannerPreview, setBannerPreview] = useState(currentChannel?.banner || "");
    
    // Video Upload Management States
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [videoTitle, setVideoTitle] = useState("");
    const [videoDescription, setVideoDescription] = useState("");
    const [selectedVideoFile, setSelectedVideoFile] = useState(null);

    const [loading, setLoading] = useState(false);

    // Domestic input element tracking layout references
    const avatarInputRef = useRef(null);
    const bannerInputRef = useRef(null);
    const videoFileInputRef = useRef(null);

    // 1. Handle Updating the Avatar Image Asset File
    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setAvatarPreview(URL.createObjectURL(file)); // Local Instant Preview

        if (isOwner) await uploadChannelAsset(file, 'avatar');
    };

    // 2. Handle Updating the Banner Image Asset File
    const handleBannerChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setBannerPreview(URL.createObjectURL(file)); // Local Instant Preview

        if (isOwner) await uploadChannelAsset(file, 'banner');
    };

    // 3. API Core Handler for Layout Image Updates
    const uploadChannelAsset = async (file, assetType) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append(assetType, file);

            const { data } = await API.put(`/channel/${channelData?._id}/update-${assetType}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (data.success) {
                dispatch(setChannel(data.channel));
                localStorage.setItem('channel', JSON.stringify(data.channel));
            }
        } catch (err) {
            console.error(`Failed to sync ${assetType} upload changes:`, err);
            alert("Error saving file down to local server storage.");
        } finally {
            setLoading(false);
        }
    };

    // 4. Submit Handler for Uploading Video Form
    const handleVideoUploadSubmit = async (e) => {
        e.preventDefault();
        if (!videoTitle.trim() || !selectedVideoFile) {
            alert("Please provide a video title and select a video file.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("title", videoTitle.trim());
            formData.append("description", videoDescription.trim());
            formData.append("videoFile", selectedVideoFile); // Match field your backend routes look for

            const { data } = await API.post(`/channel/${channelData?._id}/uploadVideo`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (data.success) {
                alert("Video uploaded successfully onto your local server storage profile!");
                setIsUploadModalOpen(false);
                setVideoTitle("");
                setVideoDescription("");
                setSelectedVideoFile(null);
                // Optional: Trigger a dispatch fetch action here to update your videos list grid array
            }
        } catch (err) {
            console.error("Video submission execution failed:", err);
            alert(err.response?.data?.message || "Internal crash while saving content file.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='w-full text-white bg-[#0f0f0f] min-h-screen pb-12 relative'>
            
            {/* Hidden Native File Input Selectors */}
            <input type="file" ref={avatarInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
            <input type="file" ref={bannerInputRef} onChange={handleBannerChange} accept="image/*" className="hidden" />

            {/* 1. CHANNEL BANNER SECTION */}
            <div className='relative h-48 w-full bg-gradient-to-r from-neutral-800 to-neutral-700 group overflow-hidden shadow-inner'>
                {bannerPreview ? (
                    <img src={bannerPreview} className="w-full h-full object-cover" alt="Channel Banner" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-500 text-sm italic tracking-wide">No banner uploaded. Hover here to append layout files.</div>
                )}
                
                {isOwner && (
                    <button 
                        onClick={() => bannerInputRef.current.click()}
                        className='absolute top-4 right-4 bg-black/70 hover:bg-black/90 text-white p-2.5 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-xs font-semibold tracking-wide border border-neutral-800 shadow-xl cursor-pointer'
                    >
                        <Edit2 size={14} /> Edit Banner
                    </button>
                )}
            </div>

            {/* 2. CHANNEL HEADER PROFILE MANAGEMENT STRIP */}
            <div className='px-6 md:px-16 py-8 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 border-b border-neutral-900'>
                
                {/* Avatar Display Frame Wrapper */}
                <div className='relative w-36 h-36 md:w-40 md:h-40 group shrink-0'>
                    {avatarPreview ? (
                        <img src={avatarPreview} className='w-full h-full rounded-full object-cover border-4 border-[#0f0f0f] shadow-2xl' alt="Avatar" />
                    ) : (
                        <div className='w-full h-full bg-blue-600 rounded-full flex items-center justify-center text-4xl font-extrabold border-4 border-[#0f0f0f] shadow-2xl'>
                            {currentChannel?.name?.charAt(0) || userData?.fullName?.charAt(0) || "W"}
                        </div>
                    )}
                    
                    {isOwner && (
                        <div 
                            onClick={() => avatarInputRef.current.click()}
                            className='absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity backdrop-blur-[2px]'
                        >
                            <Camera size={28} className="text-white drop-shadow-md" />
                        </div>
                    )}
                </div>

                {/* Profile Text Metadata Layer */}
                <div className='mt-2 flex-1'>
                    <h1 className='text-3xl md:text-4xl font-extrabold tracking-tight'>
                        {currentChannel?.name || userData?.fullName || "William Mark"}
                    </h1>
                    <p className='text-neutral-400 mt-1.5 text-sm font-medium'>
                        @{currentChannel?.handle || "williammark"} • 0 subscribers • 0 videos
                    </p>
                    <p className='text-neutral-500 mt-3 text-sm max-w-xl leading-relaxed'>
                        {currentChannel?.description || "This is your personal creative space on Streamo. Share your voice, upload media content, and manage your localized audience base layout engine."}
                    </p>
                    
                    {/* Management Interactive Row Custom Direct Actions */}
                    {isOwner && (
                        <div className='flex flex-wrap justify-center md:justify-start gap-3 mt-6'>
                            <button className='bg-neutral-900 border border-neutral-800 text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer'>
                                Manage Channel Settings
                            </button>
                            <button 
                                onClick={() => setIsUploadModalOpen(true)}
                                className='bg-blue-600 text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-1.5 shadow-md cursor-pointer'
                            >
                                <PlusCircle size={14} /> Upload Video
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* 3. EXCLUSIVE TABS PANEL LAYOUT PANEL VIEW (VIDEOS GRID STRIP) */}
            <div className='px-6 md:px-16 mt-6'>
                <div className='border-b border-neutral-900 flex gap-8 font-bold text-sm tracking-wide uppercase'>
                    <span className='pb-3 border-b-2 border-white text-white flex items-center gap-1.5 cursor-pointer'>
                        <Video size={16} /> Videos
                    </span>
                </div>

                {/* Empty State Presentation Layout Canvas Frame */}
                <div className='flex flex-col items-center justify-center py-20 text-center text-neutral-500 gap-3'>
                    <div className='p-4 bg-neutral-900 rounded-full border border-neutral-800 text-neutral-600 shadow-inner'>
                        <Video size={36} />
                    </div>
                    <div>
                        <h3 className='text-white font-semibold text-base mb-1'>No content uploaded yet</h3>
                        <p className='text-xs max-w-xs text-neutral-500'>Videos uploaded to this channel endpoint structure path will appear publicly on this layout panel panel space container.</p>
                    </div>
                </div>
            </div>

            {/* ========================================================================= */}
            {/* 4. MODAL POPUP DRAW-OVER COMPONENT - VIDEO UPLOAD DRAWER ENGINE */}
            {/* ========================================================================= */}
            {isUploadModalOpen && (
                <div className='fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn'>
                    <div className='bg-[#181818] border border-neutral-800 w-full max-w-lg rounded-2xl p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto text-left'>
                        
                        <button 
                            onClick={() => setIsUploadModalOpen(false)}
                            className='absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors p-1 rounded-full hover:bg-neutral-900 cursor-pointer'
                        >
                            <X size={20} />
                        </button>

                        <div className='flex items-center gap-2 mb-6 border-b border-neutral-900 pb-3'>
                            <Film className='text-blue-500' size={22} />
                            <h2 className='text-xl font-bold tracking-tight text-white'>Upload Creative Video Content</h2>
                        </div>

                        <form onSubmit={handleVideoUploadSubmit} className='flex flex-col gap-5'>
                            {/* Title Field Input Block */}
                            <div className='flex flex-col gap-1.5'>
                                <label className='text-[10px] text-neutral-500 uppercase font-bold tracking-widest ml-1'>Video Title *</label>
                                <input 
                                    type="text"
                                    required
                                    value={videoTitle}
                                    onChange={(e) => setVideoTitle(e.target.value)}
                                    placeholder='Give your video a catchy name'
                                    className='bg-neutral-900 border border-neutral-700 p-3 rounded-xl focus:border-blue-500 outline-none text-sm text-white transition-all'
                                />
                            </div>

                            {/* Description Field Input Block */}
                            <div className='flex flex-col gap-1.5'>
                                <label className='text-[10px] text-neutral-500 uppercase font-bold tracking-widest ml-1'>Description</label>
                                <textarea 
                                    value={videoDescription}
                                    onChange={(e) => setVideoDescription(e.target.value)}
                                    placeholder='Tell viewers what your video file contains...'
                                    rows={4}
                                    className='bg-neutral-900 border border-neutral-700 p-3 rounded-xl focus:border-blue-500 outline-none text-sm text-white transition-all resize-none'
                                />
                            </div>

                            {/* Native Binary Selector Component Area */}
                            <div className='flex flex-col gap-1.5'>
                                <label className='text-[10px] text-neutral-500 uppercase font-bold tracking-widest ml-1'>Select Video File *</label>
                                <input 
                                    type="file"
                                    required
                                    ref={videoFileInputRef}
                                    accept="video/*"
                                    onChange={(e) => setSelectedVideoFile(e.target.files[0])}
                                    className='hidden'
                                />
                                <div 
                                    onClick={() => videoFileInputRef.current.click()}
                                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                                        selectedVideoFile 
                                            ? 'border-green-600 bg-green-900/10 text-green-400' 
                                            : 'border-neutral-700 bg-neutral-900/40 text-neutral-400 hover:border-neutral-500'
                                    }`}
                                >
                                    <Film size={28} className={selectedVideoFile ? 'text-green-500' : 'text-neutral-500'} />
                                    <span className='text-xs font-semibold max-w-xs truncate px-4'>
                                        {selectedVideoFile ? selectedVideoFile.name : "Click to browse local video files (.mp4, .mkv, etc)"}
                                    </span>
                                    {selectedVideoFile && <span className='text-[10px] text-green-600 font-bold uppercase'>File Staged Successfully</span>}
                                </div>
                            </div>

                            {/* Control Action Buttons Row */}
                            <div className='flex items-center justify-end gap-3 mt-4 border-t border-neutral-900 pt-4'>
                                <button 
                                    type="button"
                                    onClick={() => setIsUploadModalOpen(false)}
                                    className='px-4 py-2 rounded-full text-xs font-bold text-neutral-400 hover:text-white hover:bg-neutral-900 transition-all cursor-pointer'
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className='bg-white text-black font-bold px-6 py-2.5 rounded-full text-xs hover:bg-neutral-200 transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-md'
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={14} className='animate-spin' /> Processing...
                                        </>
                                    ) : (
                                        <>
                                            Publish Content
                                        </>
                                    )}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Channel;