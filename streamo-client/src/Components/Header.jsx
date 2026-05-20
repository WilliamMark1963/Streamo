import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, UserCircle, Video, Bell, LogOut, User as UserIcon, PlusCircle, Clapperboard, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleMenu } from '../utils/menuSlice';
import { removeUser } from '../utils/userSlice';
import { motion, AnimatePresence } from 'framer-motion';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    const user = useSelector((store) => store.user.userData);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const menuRef = useRef(null);

    // Sync input box text if the user clears or modifies search context via alternate paths
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const q = params.get('q');
        if (!q) setSearchQuery('');
    }, [location.search]);

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

    // Handle Search Submission
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            navigate('/');
        }
    };

    // Clear search manually
    const clearSearch = () => {
        setSearchQuery('');
        navigate('/');
    };

    const handleSignOut = () => {
        setIsMenuOpen(false);
        localStorage.removeItem('user');
        localStorage.removeItem('channel');
        dispatch(removeUser());
        navigate('/');
    };

    return (
        <nav className='flex justify-between items-center px-4 h-14 bg-[#0f0f0f] text-white sticky top-0 z-50 border-b border-neutral-900'>

            {/* Left Section */}
            <div className='flex items-center gap-4'>
                <button 
                    className='p-2 hover:bg-neutral-800 rounded-full transition-colors flex items-center justify-center text-white cursor-pointer' 
                    onClick={() => dispatch(toggleMenu())}
                    aria-label="Toggle Menu"
                >
                    <Menu size={22} strokeWidth={1.5} />
                </button>
                <Link to="/" className='flex items-center gap-1'>
                    <Clapperboard size={24} strokeWidth={2.5} className="text-red-400" />
                    <div className='flex items-center select-none'>
                        <span className='font-bold text-lg tracking-tighter'>Stre</span>
                        <span className='font-bold text-lg tracking-tighter text-green-300'>amo</span>
                    </div>
                </Link>
            </div>

            {/* Center Section - Functional Search Engine layout */}
            <form onSubmit={handleSearchSubmit} className='flex-grow max-w-[500px] hidden sm:flex items-center ml-10'>
                <div className='flex w-full bg-[#121212] border border-neutral-800 rounded-l-full px-4 py-1.5 focus-within:border-blue-500 relative items-center'>
                    <input 
                        type="text" 
                        placeholder="Search videos..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className='bg-transparent border-none outline-none w-full text-sm text-white placeholder-neutral-500 pr-6' 
                    />
                    {searchQuery && (
                        <button 
                            type="button" 
                            onClick={clearSearch} 
                            className="absolute right-3 text-neutral-500 hover:text-white cursor-pointer"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
                <button type="submit" className='bg-neutral-900 border border-l-0 border-neutral-800 rounded-r-full px-5 py-2 hover:bg-neutral-800 text-neutral-400 hover:text-white cursor-pointer transition-colors'>
                    <Search size={18} strokeWidth={1.5} />
                </button>
            </form>

            {/* Right Section */}
            <div className='flex items-center gap-3 relative' ref={menuRef}>
                {user ? (
                    <>
                        <button className='p-2 hover:bg-neutral-800 rounded-full hidden md:block text-neutral-300 hover:text-white cursor-pointer'>
                            <Video size={22} strokeWidth={1.5} />
                        </button>
                        <button className='p-2 hover:bg-neutral-800 rounded-full hidden md:block mr-2 text-neutral-300 hover:text-white cursor-pointer'>
                            <Bell size={22} strokeWidth={1.5} />
                        </button>

                        {user?.profilePicture ? (
                            <img
                                src={user.profilePicture}
                                alt="avatar"
                                className='w-8 h-8 rounded-full border border-neutral-800 cursor-pointer hover:opacity-80 transition-opacity object-cover'
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            />
                        ) : (
                            <div 
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold border border-neutral-800 cursor-pointer select-none"
                            >
                                {user?.fullName?.charAt(0).toUpperCase() || "U"}
                            </div>
                        )}

                        {/* USER DROPDOWN POPUP */}
                        <AnimatePresence>
                            {isMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className='absolute right-0 top-12 w-64 bg-[#1c1c1c] border border-neutral-800 rounded-xl shadow-2xl py-3 z-50'
                                >
                                    <div className='flex items-center gap-3 px-4 pb-3 border-b border-neutral-800 mb-2'>
                                        {user?.profilePicture ? (
                                            <img src={user.profilePicture} className='w-10 h-10 rounded-full object-cover' alt="user" />
                                        ) : (
                                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-md font-bold">
                                                {user?.fullName?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div className='flex flex-col max-w-[160px]'>
                                            <span className='font-bold text-sm truncate'>{user?.fullName}</span>
                                            <span className='text-xs text-neutral-400 truncate'>{user?.email}</span>
                                        </div>
                                    </div>

                                    <div className='flex flex-col'>
                                        <Link
                                            to={user?.hasChannel ? `/channel/${user._id}` : "/createChannel"}
                                            onClick={() => setIsMenuOpen(false)}
                                            className='flex items-center gap-3 px-4 py-2 hover:bg-neutral-800 transition-colors text-sm text-neutral-200'
                                        >
                                            <UserIcon size={18} />
                                            {user?.hasChannel ? 'Your channel' : 'Create a channel'}
                                        </Link>
                                        <Link to="/studio" onClick={() => setIsMenuOpen(false)} className='flex items-center gap-3 px-4 py-2 hover:bg-neutral-800 transition-colors text-sm text-neutral-200'>
                                            <PlusCircle size={18} /> Streamo Studio
                                        </Link>
                                        <button
                                            onClick={handleSignOut}
                                            className='flex items-center gap-3 px-4 py-2 hover:bg-neutral-800 transition-colors text-sm text-red-400 mt-2 border-t border-neutral-800 pt-3 text-left cursor-pointer'
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
                        <button className='flex items-center gap-2 text-[#3ea6ff] border border-neutral-800 px-3 py-1.5 rounded-full hover:bg-[#263850]/50 transition-all font-medium text-sm ml-2 cursor-pointer'>
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