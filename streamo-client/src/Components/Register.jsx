import React, { useState } from 'react';
import { Clapperboard, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import API from "../utils/APIintercept"

function Register() {

  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/register', formData);
      alert("Registration Successful! Please Sign In.");
      navigate('/signin');
    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed");
    }
  };


  return (
    <div className='flex items-center justify-center w-full min-h-[90vh] bg-[#0f0f0f] text-white p-4'>
      <div className='bg-[#181818] border border-neutral-800 rounded-2xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden'>

        {/* Left Side: Branding/Info */}
        <div className='p-10 flex-1 flex flex-col justify-center bg-gradient-to-br from-neutral-800 to-neutral-900'>
          <div className='flex items-center gap-2 mb-6'>
            <Clapperboard size={32} className="text-red-500" strokeWidth={2.5} />
            <span className='font-bold text-2xl tracking-tighter'>Streamo</span>
          </div>
          <h1 className='text-3xl font-bold mb-4'>Create your Account</h1>
          <p className='text-neutral-400'>Join the Streamo community to upload videos, comment, and subscribe to your favorite creators.</p>
        </div>

        {/* Right Side: Form */}
        <div className='p-10 flex-1'>
          <form className='flex flex-col gap-4' onSubmit={(e) => handleSubmit(e)}>
            <input
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              type="text" placeholder="Full Name" required
              className='bg-transparent border border-neutral-700 p-3 rounded-lg focus:border-blue-500 outline-none'
            />

            <input
              type="email"
              placeholder="Email address"
              className='bg-transparent border border-neutral-700 p-3 rounded-lg focus:border-blue-500 outline-none'
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <div className='relative'>
              <input
                type="password"
                placeholder="Password"
                className='w-full bg-transparent border border-neutral-700 p-3 rounded-lg focus:border-blue-500 outline-none'
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <p className='text-xs text-neutral-500 mt-1 px-1'>Use 8 or more characters with a mix of letters, numbers & symbols</p>
            </div>

            <div className='flex items-center justify-between mt-6'>
              <Link to="/signin" className='text-blue-400 text-sm font-medium hover:underline'>
                Sign in instead
              </Link>
              <button className='bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-bold flex items-center gap-1 transition-all' type='submit'>
                Next <ChevronRight size={18} />
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Register;