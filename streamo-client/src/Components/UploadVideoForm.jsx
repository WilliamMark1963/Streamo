import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Image, UploadCloud, Loader2, ArrowLeft } from 'lucide-react';
import { useSelector } from 'react-redux';
import API from "../utils/APIintercept";

function UploadVideoForm() {
    const navigate = useNavigate();
    const { channelData } = useSelector((state) => state.user);
    
    // Form Input States
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('All');
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [isPublishing, setIsPublishing] = useState(false);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        if (!videoFile || !thumbnailFile || !title) {
            alert("Please provide a title, video file, and thumbnail image.");
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('videoFile', videoFile);        // Matches backend .fields() configuration
        formData.append('thumbnailFile', thumbnailFile);  // Matches backend .fields() configuration

        try {
            setIsPublishing(true);

            // Dispatches multiform asset stream data across intercept networks
            await API.post('/video/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            alert("Video successfully processed and updated to your stream feed!");
            
            // Redirect logic layout
            if (channelData?._id) {
                navigate(`/channel/${channelData._id}`);
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error("Asset upload routing failure:", error);
            alert(error.response?.data?.message || "Failed to finalize asset tracking registry variables.");
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#0f0f0f] text-white p-6 md:p-12 flex justify-center items-center">
            <div className="w-full max-w-2xl bg-[#161616] border border-neutral-900 rounded-2xl p-6 md:p-8 shadow-2xl">

                {/* BACK TO DASHBOARD ACTION BUTTON */}
                <button
                    type="button"
                    onClick={() => channelData?._id ? navigate(`/channel/${channelData._id}`) : navigate('/')}
                    className="flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white mb-6 transition-colors cursor-pointer"
                >
                    <ArrowLeft size={14} /> Back to Channel
                </button>

                {/* FORM TITLE HEADER BLOCK */}
                <h2 className="text-2xl font-black tracking-tight mb-2 flex items-center gap-2">
                    <UploadCloud className="text-blue-500" size={26} /> Upload Media Asset
                </h2>
                <p className="text-neutral-400 text-xs mb-6">
                    Publish high-fidelity video formats straight to your custom streaming ecosystem channel layout grids.
                </p>

                {/* DATA MANAGEMENT SUBMISSION OBJECT FORM */}
                <form onSubmit={handleFormSubmit} className="space-y-5">
                    
                    {/* TITLE INPUT TEXTFIELD */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                            Video Title *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Catchy title for your content..."
                            className="w-full bg-[#0f0f0f] border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                            required
                        />
                    </div>

                    {/* DESCRIPTION TEXTAREA COMPONENT */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Tell your viewers about your video..."
                            rows={4}
                            className="w-full bg-[#0f0f0f] border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
                        />
                    </div>

                    {/* OPTION META DROPDOWN BLOCK */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                            Video Category Tag *
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-[#0f0f0f] border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-neutral-300 transition-colors cursor-pointer"
                        >
                            <option value="All">All / General</option>
                            <option value="Tech">Tech</option>
                            <option value="Music">Music</option>
                            <option value="Gaming">Gaming</option>
                            <option value="Cooking">Cooking</option>
                            <option value="Web Development">Web Development</option>
                            <option value="Podcasts">Podcasts</option>
                        </select>
                    </div>

                    {/* BINARY BUFFER FILE PICKERS CONTAINER SPLIT GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* FILM MP4 SOURCE SELECTOR BOX */}
                        <div className="bg-[#0f0f0f] border-2 border-dashed border-neutral-800 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-neutral-700 transition-colors relative min-h-[120px]">
                            <Film className="text-neutral-500 mb-2" size={24} />
                            <span className="text-xs font-medium text-neutral-400 max-w-[180px] truncate px-2">
                                {videoFile ? videoFile.name : "Select Video File"}
                            </span>
                            <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => setVideoFile(e.target.files[0])}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                required={!videoFile}
                            />
                        </div>

                        {/* COMPRESSED PNG/JPG THUMBNAIL TRACK INPUT BOX */}
                        <div className="bg-[#0f0f0f] border-2 border-dashed border-neutral-800 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-neutral-700 transition-colors relative min-h-[120px]">
                            <Image className="text-neutral-500 mb-2" size={24} />
                            <span className="text-xs font-medium text-neutral-400 max-w-[180px] truncate px-2">
                                {thumbnailFile ? thumbnailFile.name : "Select Thumbnail Image"}
                            </span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setThumbnailFile(e.target.files[0])}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                required={!thumbnailFile}
                            />
                        </div>
                    </div>

                    {/* INTERACTIVE FORM STATE REQUEST MUTATION CONTROL SUBMITTER */}
                    <button
                        type="submit"
                        disabled={isPublishing}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg cursor-pointer mt-4"
                    >
                        {isPublishing ? (
                            <>
                                <Loader2 className="animate-spin" size={16} /> Encoding & Publishing Assets...
                            </>
                        ) : (
                            "Publish Content"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default UploadVideoForm;