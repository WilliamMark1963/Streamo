import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, ArrowRight } from 'lucide-react';
import API from "../utils/APIintercept";
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../utils/userSlice';

function CreateChannel() {
    const { userData } = useSelector(store => store.user);
    const [channelName, setChannelName] = useState(userData?.fullName || "");
    const dispatch = useDispatch();

    const handleCreate = async () => {
        try {
            const { data } = await API.post('/channels/create', { name: channelName });
            // Update Redux so the Header knows the channel now exists
            dispatch(addUser({ user: { ...userData, hasChannel: true }, token: localStorage.getItem('token') }));
            alert("Channel Created!");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-white p-6">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#181818] p-10 rounded-3xl border border-neutral-800 w-full max-w-lg text-center"
            >
                <h1 className="text-3xl font-bold mb-2">How you'll appear</h1>
                <p className="text-neutral-400 mb-8">Choose a name and profile picture for your new channel.</p>

                <div className="relative w-24 h-24 mx-auto mb-8">
                    <img src={userData?.profilePicture} className="w-full h-full rounded-full object-cover border-2 border-neutral-700" alt="avatar" />
                    <div className="absolute bottom-0 right-0 bg-blue-600 p-1.5 rounded-full border-2 border-[#181818] cursor-pointer">
                        <Camera size={16} />
                    </div>
                </div>

                <div className="flex flex-col gap-4 text-left">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-neutral-500 ml-1 uppercase font-bold tracking-widest">Name</label>
                        <input 
                            value={channelName}
                            onChange={(e) => setChannelName(e.target.value)}
                            className="bg-neutral-900 border border-neutral-700 p-3 rounded-xl focus:border-blue-500 outline-none"
                        />
                    </div>
                </div>

                <button 
                    onClick={handleCreate}
                    className="w-full bg-white text-black font-bold py-3 rounded-full mt-8 hover:bg-neutral-200 transition-all flex items-center justify-center gap-2"
                >
                    Create Channel <ArrowRight size={18} />
                </button>
            </motion.div>
        </div>
    );
}

export default CreateChannel;