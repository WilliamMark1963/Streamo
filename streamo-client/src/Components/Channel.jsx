import React from 'react';
import { useSelector } from 'react-redux';

function Channel() {
  return (
    <div className='w-full text-white'>
      {/* 1. Channel Banner */}
      <div className='h-48 w-full bg-gradient-to-r from-neutral-800 to-neutral-700'></div>

      {/* 2. Channel Header */}
      <div className='px-16 py-6 flex items-start gap-6'>
        <div className='w-40 h-40 bg-red-500 rounded-full flex items-center justify-center text-4xl font-bold border-4 border-[#0f0f0f]'>
          W
        </div>
        <div className='mt-4'>
          <h1 className='text-4xl font-bold'>William Mark</h1>
          <p className='text-neutral-400 mt-1 text-sm'>@williammark • 0 subscribers • 0 videos</p>
          <p className='text-neutral-400 mt-2 text-sm max-w-xl'>More about this channel... This is your personal creative space on Streamo.</p>
          <div className='flex gap-2 mt-4'>
            <button className='bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-neutral-200'>Customize Channel</button>
            <button className='bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-neutral-200'>Manage Videos</button>
          </div>
        </div>
      </div>

      {/* 3. Tabs (Mock) */}
      <div className='px-16 border-b border-neutral-700 flex gap-8 font-medium text-neutral-400'>
        <button className='pb-3 border-b-2 border-white text-white'>Home</button>
        <button className='pb-3 hover:text-white'>Videos</button>
        <button className='pb-3 hover:text-white'>Playlists</button>
        <button className='pb-3 hover:text-white'>About</button>
      </div>
    </div>
  );
}

export default Channel;