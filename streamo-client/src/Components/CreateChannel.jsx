import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, ArrowRight, Loader2, AtSign } from 'lucide-react';
import API from "../utils/APIintercept";
import { useDispatch, useSelector } from 'react-redux';
import { setChannel } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';

function CreateChannel() {
    const { userData } = useSelector(store => store.user);
    const fileInputRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!userData) {
            navigate("/");
        }
    }, [userData, navigate]);

    const [channelName, setChannelName] = useState(userData?.fullName || "");
    const [handle, setHandle] = useState("");
    const [description, setDescription] = useState("");


    // Image Upload States
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(userData?.profilePicture || "");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");



    // Handle Image Selection & Preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit check
                setError("Image size should be less than 2MB");
                return;
            }
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file)); // Create local URL for instant preview
        }
    };

    // Client-side Handle Validation
    const handleTextChange = (e) => {
        const value = e.target.value.toLowerCase().replace(/[^a-z0-9._]/g, '');
        setHandle(value);
    };

    const handleCreate = async () => {
        if (!channelName.trim() || channelName.length < 3) {
            setError("Channel name must be at least 3 characters");
            return;
        }
        if (!handle.trim() || handle.length < 3) {
            setError("Channel handle must be at least 3 characters");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // Use FormData for Multipart/Form-Data submissions (text + files combined)
            const formData = new FormData();
            formData.append("channelName", channelName.trim());
            formData.append("handle", handle.trim());
            formData.append("description", description.trim());

            if (selectedImage) {
                formData.append("avatar", selectedImage); // Match the field name expected by your Multer upload middleware
            }

            const { data } = await API.post('/createChannel', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (data.success) {
                dispatch(setChannel(data.channel));
                localStorage.setItem('channel', JSON.stringify(data.channel));

                const updatedUser = { ...userData, hasChannel: true };
                localStorage.setItem('user', JSON.stringify(updatedUser));

                alert("Channel Created Successfully!");
                navigate(`/channel/${data.channel._id}`);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong. Try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[85vh] text-white p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#181818] p-6 md:p-10 rounded-3xl border border-neutral-800 w-full max-w-lg text-center shadow-2xl"
            >
                <h1 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight">How you'll appear</h1>
                <p className="text-neutral-400 text-sm mb-8">Customize your channel profile picture, unique handle, and details.</p>

                {error && (
                    <div className="bg-red-900/40 border border-red-500 text-red-200 text-xs font-semibold p-3 rounded-xl mb-6 text-left">
                        {error}
                    </div>
                )}

                {/* Hidden File Input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                />

                {/* Avatar Display & Picker Interaction */}
<div className="relative w-24 h-24 mx-auto mb-8 group">
    {/* 🔴 Conditional Render to prevent passing "" to src */}
    {previewUrl ? (
        <img 
            src={previewUrl} 
            className="w-full h-full rounded-full object-cover border-2 border-neutral-700 transition-opacity group-hover:opacity-80" 
            alt="avatar preview" 
        />
    ) : (
        <div className="w-full h-full bg-blue-600 rounded-full flex items-center justify-center text-3xl font-extrabold border-2 border-neutral-700">
            {userData?.fullName?.charAt(0).toUpperCase() || "W"}
        </div>
    )}
    
    <div 
        onClick={() => fileInputRef.current.click()}
        className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full border-2 border-[#181818] cursor-pointer hover:bg-blue-700 transition-colors shadow-lg"
    >
        <Camera size={16} />
    </div>
</div>

                {/* Form Elements Layer */}
                <div className="flex flex-col gap-5 text-left">
                    {/* Name Input */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] text-neutral-500 ml-1 uppercase font-bold tracking-widest">Channel Name</label>
                        <input
                            value={channelName}
                            onChange={(e) => setChannelName(e.target.value)}
                            placeholder="e.g. Warangal Vibes"
                            className="bg-neutral-900 border border-neutral-700 p-3 rounded-xl focus:border-blue-500 outline-none text-sm transition-all"
                        />
                    </div>

                    {/* Handle Input with Layout Icon */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] text-neutral-500 ml-1 uppercase font-bold tracking-widest">Handle</label>
                        <div className="flex items-center bg-neutral-900 border border-neutral-700 rounded-xl focus-within:border-blue-500 transition-all px-3">
                            <AtSign size={16} className="text-neutral-500 mr-1" />
                            <input
                                value={handle}
                                onChange={handleTextChange}
                                placeholder="warangalvibes"
                                className="bg-transparent border-none outline-none py-3 w-full text-sm text-white placeholder-neutral-600"
                            />
                        </div>
                        <span className="text-[10px] text-neutral-500 ml-1">Allowed: lowercase letters, numbers, dots, and underscores.</span>
                    </div>

                    {/* Description Area */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] text-neutral-500 ml-1 uppercase font-bold tracking-widest">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Tell viewers about your channel..."
                            rows={3}
                            className="bg-neutral-900 border border-neutral-700 p-3 rounded-xl focus:border-blue-500 outline-none text-sm transition-all resize-none"
                        />
                    </div>
                </div>

                {/* Submit Action CTA */}
                <button
                    onClick={handleCreate}
                    disabled={loading}
                    className="w-full bg-white text-black font-bold py-3 rounded-full mt-8 hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <Loader2 size={18} className="animate-spin" /> Creating...
                        </>
                    ) : (
                        <>
                            Create Channel <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </motion.div>
        </div>
    );
}

export default CreateChannel;