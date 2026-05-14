import React from 'react';
import { Clapperboard } from 'lucide-react';
import { Link } from 'react-router-dom';

function SignIn() {
  return (
    <div className='flex flex-col items-center justify-center w-full min-h-[80vh] text-white p-4'>
      <div className='bg-[#181818] p-10 rounded-2xl border border-neutral-800 w-full max-w-md shadow-xl'>
        
        {/* Logo and Header */}
        <div className='flex flex-col items-center mb-8'>
          <Clapperboard size={40} className="text-red-400 mb-2" />
          <h2 className='text-2xl font-bold'>Sign In</h2>
          <p className='text-neutral-400 text-sm'>to continue to Streamo</p>
        </div>

        {/* Simplified Form */}
        <form className='flex flex-col gap-4' onSubmit={(e) => e.preventDefault()}>
          <div className='flex flex-col gap-1'>
            <label className='text-xs text-neutral-400 ml-1'>Email</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className='bg-transparent border border-neutral-700 p-3 rounded-lg focus:border-blue-500 outline-none transition-all' 
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-xs text-neutral-400 ml-1'>Password</label>
            <input 
              type="password" 
              placeholder="Enter your password" 
              className='bg-transparent border border-neutral-700 p-3 rounded-lg focus:border-blue-500 outline-none transition-all' 
            />
          </div>
          
          <button className='bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold mt-4 transition-colors active:scale-95'>
            Sign In
          </button>
        </form>

        {/* Footer Link to Register Page */}
        <p className='text-sm text-neutral-400 mt-8 text-center'>
          New to Streamo? 
          <Link to="/register" className='text-blue-400 font-medium ml-1 hover:underline'>
            Create an account
          </Link>
        </p>
      </div>
      
      {/* Optional Help Links */}
      <div className='mt-8 flex gap-6 text-xs text-neutral-500'>
        <span className='hover:text-neutral-300 cursor-pointer'>Privacy</span>
        <span className='hover:text-neutral-300 cursor-pointer'>Terms</span>
        <span className='hover:text-neutral-300 cursor-pointer'>Help</span>
      </div>
    </div>
  );
}

export default SignIn;