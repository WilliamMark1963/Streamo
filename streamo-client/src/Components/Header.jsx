import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, UserCircle, Video, Bell, LogOut, User as UserIcon, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Clapperboard } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleMenu } from '../utils/menuSlice';
import { removeUser } from '../utils/userSlice';
import { motion, AnimatePresence } from 'framer-motion';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const user = useSelector((store) => store.user.userData);
    const dispatch = useDispatch();
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className='flex justify-between items-center px-4 h-14 bg-[#0f0f0f] text-white sticky top-0 z-50'>
            
            {/* Left Section */}
            <div className='flex items-center gap-4'>
                <button className='p-2 hover:bg-neutral-800 rounded-full transition-colors' onClick={() => dispatch(toggleMenu())}>
                    <Menu size={22} strokeWidth={1.5} />
                </button>
                <Link to="/" className='flex items-center gap-1'>
                    <Clapperboard size={28} strokeWidth={2.5} className="text-red-400" />
                    <div className='flex items-center'>
                        <span className='font-bold text-xl tracking-tighter'>Stre</span>
                        <span className='font-bold text-xl tracking-tighter text-green-300'>amo</span>
                    </div>
                </Link>
            </div>

            {/* Center Section */}
            <div className='flex-grow max-w-[600px] hidden sm:flex items-center ml-10'>
                <div className='flex w-full bg-[#121212] border border-neutral-700 rounded-l-full px-4 py-1.5 focus-within:border-blue-500'>
                    <input type="text" placeholder="Search" className='bg-transparent border-none outline-none w-full text-white placeholder-neutral-500' />
                </div>
                <button className='bg-neutral-800 border border-l-0 border-neutral-700 rounded-r-full px-5 py-2 hover:bg-neutral-700'>
                    <Search size={20} strokeWidth={1.5} />
                </button>
            </div>

            {/* Right Section */}
            <div className='flex items-center gap-3 relative' ref={menuRef}>
                {user ? (
                    <>
                        <button className='p-2 hover:bg-neutral-800 rounded-full hidden md:block'>
                            <Video size={22} strokeWidth={1.5} />
                        </button>
                        <button className='p-2 hover:bg-neutral-800 rounded-full hidden md:block mr-2'>
                            <Bell size={22} strokeWidth={1.5} />
                        </button>

                        {/* User Avatar clickable to toggle menu */}
                        <img 
                            src={user?.profilePicture} 
                            alt="avatar" 
                            className='w-8 h-8 rounded-full border border-neutral-700 cursor-pointer hover:opacity-80 transition-opacity'
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        />

                        {/* USER DROPDOWN POPUP */}
                        <AnimatePresence>
                            {isMenuOpen && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className='absolute right-0 top-12 w-64 bg-[#282828] border border-neutral-700 rounded-xl shadow-2xl py-3 z-50'
                                >
                                    {/* User Info Header */}
                                    <div className='flex items-center gap-3 px-4 pb-3 border-b border-neutral-700 mb-2'>
                                        <img src={user?.profilePicture} className='w-10 h-10 rounded-full' alt="user" />
                                        <div className='flex flex-col'>
                                            <span className='font-bold text-sm truncate'>{user?.fullName}</span>
                                            <span className='text-xs text-neutral-400 truncate'>{user?.email}</span>
                                        </div>
                                    </div>

                                    {/* Menu Actions */}
                                    <div className='flex flex-col'>
<Link 
    to={user?.hasChannel ? `/channel/${user._id}` : "/create-channel"} 
    onClick={() => setIsMenuOpen(false)} 
    className='flex items-center gap-3 px-4 py-2 hover:bg-neutral-700 transition-colors text-sm'
>
    <UserIcon size={18} /> 
    {user?.hasChannel ? 'Your channel' : 'Create a channel'}
</Link>
                                        <Link to="/studio" onClick={() => setIsMenuOpen(false)} className='flex items-center gap-3 px-4 py-2 hover:bg-neutral-700 transition-colors text-sm'>
                                            <PlusCircle size={18} /> Streamo Studio
                                        </Link>
                                        <button 
                                            onClick={() => { dispatch(removeUser()); setIsMenuOpen(false); }}
                                            className='flex items-center gap-3 px-4 py-2 hover:bg-neutral-700 transition-colors text-sm text-red-400 mt-2 border-t border-neutral-700 pt-3'
                                        >
                                            <LogOut size={18} /> Sign out
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </>
                ) : (
                    <Link to="/signin">
                        <button className='flex items-center gap-2 text-[#3ea6ff] border border-neutral-700 px-3 py-1.5 rounded-full hover:bg-[#263850] transition-all font-medium text-sm ml-2'>
                            <UserCircle size={24} strokeWidth={1.5} />
                            Sign in
                        </button>
                    </Link>
                )}
            </div>
        </nav>
    );
}

export default Header;