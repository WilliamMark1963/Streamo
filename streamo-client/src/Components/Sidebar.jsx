import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Home, PlaySquare, Library, Compass, Clock, ThumbsUp, History } from 'lucide-react';
import { closeMenu, toggleMenu } from '../utils/menuSlice';

function Sidebar() {
  const dispatch = useDispatch();
  const isMenuOpen = useSelector((store) => store.menu.isMenuOpen);

  // 1. Hooks MUST come before any 'return' statements
  useEffect(() => {
    if (window.innerWidth < 768) {
      dispatch(closeMenu());
    }
  }, [dispatch]);

  // 2. Early Return comes AFTER hooks
  if (!isMenuOpen) return null;

  return (
    <>
      {/* 3. Mobile Backdrop: Closes sidebar when clicking outside on mobile */}
      <div 
        className="fixed inset-0 bg-black/60 z-40 md:hidden" 
        onClick={() => dispatch(closeMenu())}
      ></div>

      {/* 4. The Sidebar Container */}
      <div className='fixed md:sticky top-14 left-0 z-50 w-64 md:w-56 bg-[#0f0f0f] text-white h-[calc(100vh-56px)] p-3 overflow-y-auto border-r border-neutral-800 md:border-none shadow-2xl md:shadow-none'>
        
        <ul className='space-y-1'>
          <li className='flex items-center gap-5 p-2.5 hover:bg-neutral-800 rounded-lg cursor-pointer bg-neutral-800'>
            <Home size={22} /> <span className='text-sm font-medium'>Home</span>
          </li>
          <li className='flex items-center gap-5 p-2.5 hover:bg-neutral-800 rounded-lg cursor-pointer'>
            <PlaySquare size={22} /> <span className='text-sm'>Shorts</span>
          </li>
          <li className='flex items-center gap-5 p-2.5 hover:bg-neutral-800 rounded-lg cursor-pointer'>
            <Library size={22} /> <span className='text-sm'>Subscriptions</span>
          </li>
        </ul>

        <hr className='my-3 border-neutral-800' />

        <div className='px-2 mb-2 text-sm font-bold text-neutral-400'>Explore</div>
        <ul className='space-y-1'>
          <li className='flex items-center gap-5 p-2.5 hover:bg-neutral-800 rounded-lg cursor-pointer'>
            <Compass size={22} /> <span className='text-sm'>Trending</span>
          </li>
          <li className='flex items-center gap-5 p-2.5 hover:bg-neutral-800 rounded-lg cursor-pointer'>
            <History size={22} /> <span className='text-sm'>History</span>
          </li>
          <li className='flex items-center gap-5 p-2.5 hover:bg-neutral-800 rounded-lg cursor-pointer'>
            <ThumbsUp size={22} /> <span className='text-sm'>Liked Videos</span>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Sidebar;