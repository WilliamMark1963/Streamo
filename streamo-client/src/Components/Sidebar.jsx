import React from 'react';
import { useSelector } from 'react-redux';
import { Home, PlaySquare, Library, History } from 'lucide-react';

function Sidebar() {
  const isMenuOpen = useSelector((store) => store.menu.isMenuOpen);

  // If menu is closed, don't show the sidebar (Early Return)
  if (!isMenuOpen) return null; 

  return (
    <div className='w-56 bg-[#0f0f0f] text-white h-[calc(100vh-56px)] p-3 sticky top-14'>
      <ul>
        <li className='flex items-center gap-5 p-2 hover:bg-neutral-800 rounded-lg cursor-pointer'>
          <Home size={20} /> <span>Home</span>
        </li>
        <li className='flex items-center gap-5 p-2 hover:bg-neutral-800 rounded-lg cursor-pointer'>
          <PlaySquare size={20} /> <span>Shorts</span>
        </li>
        <li className='flex items-center gap-5 p-2 hover:bg-neutral-800 rounded-lg cursor-pointer'>
          <Library size={20} /> <span>Subscriptions</span>
        </li>
      </ul>
      <hr className='my-3 border-neutral-700' />
      {/* Add more sections like 'Explore' as required by the PDF */}
    </div>
  );
}

export default Sidebar;