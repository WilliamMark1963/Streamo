import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Image, UploadCloud, Loader2, ArrowLeft } from 'lucide-react';
import API from "../utils/APIintercept"

function UploadVideoForm() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
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
        formData.append('videoFile', videoFile);        // Matches backend .fields() key name
        formData.append('thumbnailFile', thumbnailFile);  // Matches backend .fields() key name

        try {
            setIsPublishing(true);
            
            // Your app.js matches layout: app.use("/video", videoRouter)
            await API.post('/video/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            alert("Video successfully processed and updated to your stream feed!");
            // Automatically push back to the main channel dashboard page view layout
            navigate('/channel'); 
        } catch (error) {
            alert(error.response?.data?.message || "Failed to finalize asset tracking registry variables.");
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#0f0f0f] text-white p-6 md:p-12 flex justify-center items-center">
            <div className="w-full max-w-2xl bg-[#161616] border border-neutral-900 rounded-2xl p-6 md:p-8 shadow-2xl relative">
                
                <button 
                    onClick={() => navigate('/channel')} 
                    className="flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white mb-6 transition-colors cursor-pointer"
                >
                    <ArrowLeft size={14} /> Back to Channel
                </button>

                <h2 className="text-2xl font-black tracking-tight mb-2 flex items-center gap-2">
                    <UploadCloud className="text-blue-500" size={26} /> Upload Media Asset
                </h2>
                <p className="text-neutral-400 text-xs mb-6">Publish high-fidelity video formats straight to your custom streaming ecosystem channel layout grids.</p>

                <form onSubmit={handleFormSubmit} className="space-y-5">
                    {/* Title Input */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Video Title *</label>
                        <input 
                            type="text" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Catchy title for your content..."
                            className="w-full bg-[#0f0f0f] border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                            required
                        />
                    </div>

                    {/* Description Input */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Description</label>
                        <textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Tell your viewers about your video..."
                            rows={4}
                            className="w-full bg-[#0f0f0f] border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Video File Picker Container */}
                        <div className="bg-[#0f0f0f] border-2 border-dashed border-neutral-800 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-neutral-700 transition-colors relative">
                            <Film className="text-neutral-500 mb-2" size={24} />
                            <span className="text-xs font-medium text-neutral-400 max-w-[180px] truncate">
                                {videoFile ? videoFile.name : "Select Video File"}
                            </span>
                            <input 
                                type="file" 
                                accept="video/*"
                                onChange={(e) => setVideoFile(e.target.files[0])}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                required
                            />
                        </div>

                        {/* Thumbnail File Picker Container */}
                        <div className="bg-[#0f0f0f] border-2 border-dashed border-neutral-800 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-neutral-700 transition-colors relative">
                            <Image className="text-neutral-500 mb-2" size={24} />
                            <span className="text-xs font-medium text-neutral-400 max-w-[180px] truncate">
                                {thumbnailFile ? thumbnailFile.name : "Select Thumbnail Image"}
                            </span>
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => setThumbnailFile(e.target.files[0])}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                required
                            />
                        </div>
                    </div>

                    {/* Actions and Submission controls */}
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