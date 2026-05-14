import React from 'react';
import { Menu, Search, UserCircle, Video, Bell } from 'lucide-react'; // Import Lucide icons
import { Link } from 'react-router-dom';
import logo from "../assets/Logo.png"
import { Clapperboard } from 'lucide-react';
function Header() {
  return (
    <nav className='flex justify-between items-center px-4 h-14 bg-[#0f0f0f] text-white sticky top-0 z-50'>
      
      {/* Left: Menu and Logo */}
      <div className='flex items-center gap-4'>
        <button className='p-2 hover:bg-neutral-800 rounded-full transition-colors'>
          <Menu size={22} strokeWidth={1.5} />
        </button>
        <Link to="/" className='flex items-center gap-1 '>
            <Clapperboard size={28} 
  strokeWidth={2.5} 
  className="text-red-400"/>
        <div className='flex items-center'>
        <span className='font-bold text-xl tracking-tighter '>Stre</span>
          <span className='font-bold text-xl tracking-tighter text-red-300'>amo</span>
        </div>

        </Link>
      </div>

      {/* Center: Search Bar */}
      <div className='flex-grow max-w-[600px] hidden sm:flex items-center ml-10'>
        <div className='flex w-full bg-[#121212] border border-neutral-700 rounded-l-full px-4 py-1.5 focus-within:border-blue-500'>
          <input 
            type="text" 
            placeholder="Search" 
            className='bg-transparent border-none outline-none w-full text-white placeholder-neutral-500'
          />
        </div>
        <button className='bg-neutral-800 border border-l-0 border-neutral-700 rounded-r-full px-5 py-2 hover:bg-neutral-700'>
          <Search size={20} strokeWidth={1.5} />
        </button>
      </div>

      {/* Right: Actions & User */}
      <div className='flex items-center gap-3'>
        <button className='p-2 hover:bg-neutral-800 rounded-full hidden md:block'>
          <Video size={22} strokeWidth={1.5} />
        </button>
        <button className='p-2 hover:bg-neutral-800 rounded-full hidden md:block'>
          <Bell size={22} strokeWidth={1.5} />
        </button>
        
        <Link to="/signin">
          <button className='flex items-center gap-2 text-[#3ea6ff] border border-neutral-700 px-3 py-1.5 rounded-full hover:bg-[#263850] transition-all font-medium text-sm ml-2'>
            <UserCircle size={24} strokeWidth={1.5} />
            Sign in
          </button>
        </Link>
      </div>

    </nav>
  );
}

export default Header;