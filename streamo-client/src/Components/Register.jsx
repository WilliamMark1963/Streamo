import React, { useState } from 'react';
import { Clapperboard, ChevronRight, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import API from "../utils/APIintercept";

function Register() {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [errors, setErrors] = useState({}); 
  const [serverError, setServerError] = useState(""); 
  const navigate = useNavigate();

  const patterns = {
    fullName: /^[a-zA-Z\s]{3,}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.fullName.trim()) {
      tempErrors.fullName = "Full name is required";
    } else if (!patterns.fullName.test(formData.fullName)) {
      tempErrors.fullName = "Name must be letters only (min 3)";
    }
    if (!formData.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!patterns.email.test(formData.email)) {
      tempErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      tempErrors.password = "Password is required";
    } else if (!patterns.password.test(formData.password)) {
      tempErrors.password = "Weak password (Need Uppercase, Number, Special Char)";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(""); 
    if (!validate()) return; 

    try {
      const { data } = await API.post('/register', formData);
      console.log("Result", data.message);
      navigate('/signin');
    } catch (err) {
      setServerError(err.response?.data?.message || "Registration Failed");
      setTimeout(() => setServerError(""), 5000);
    }
  };

  return (
    <div className='flex items-center justify-center w-full min-h-screen bg-[#0f0f0f] text-white p-4 relative'>
      
      {/* Responsive Toast Popup */}
      {serverError && (
        <div className='fixed top-5 right-5 left-5 md:left-auto bg-red-600 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-bounce z-50 justify-center md:justify-start'>
          <AlertCircle size={20} />
          <span className="font-bold text-xs md:text-sm uppercase tracking-wide">{serverError}</span>
        </div>
      )}

      {/* Main Container: Stacked on mobile (flex-col), Side-by-side on desktop (md:flex-row) */}
      <div className='bg-[#181818] border border-neutral-800 rounded-2xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden shadow-2xl'>
        
        {/* Branding: Centered text on mobile, Left-aligned on desktop */}
        <div className='p-8 md:p-10 flex-1 flex flex-col justify-center items-center md:items-start bg-gradient-to-br from-neutral-800 to-neutral-900 text-center md:text-left'>
          <div className='flex items-center gap-2 mb-4 md:mb-6'>
            <Clapperboard size={32} className="text-red-500" strokeWidth={2.5} />
            <span className='font-bold text-2xl tracking-tighter'>Streamo</span>
          </div>
          <h1 className='text-2xl md:text-3xl font-bold mb-2 md:mb-4'>Create your Account</h1>
          <p className='text-neutral-400 text-sm md:text-base max-w-xs md:max-w-none'>Join the community to upload and share videos.</p>
        </div>

        {/* Form Container */}
        <div className='p-6 md:p-10 flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit} noValidate>
            
            <div className='flex flex-col gap-1'>
              <input
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                type="text" placeholder="Full Name"
                className={`bg-neutral-900 md:bg-transparent border ${errors.fullName ? 'border-red-500 animate-shake' : 'border-neutral-700'} p-3 rounded-lg focus:border-blue-500 outline-none transition-colors text-sm`}
              />
              {errors.fullName && <span className='text-red-500 text-[10px] font-bold uppercase ml-1'>{errors.fullName}</span>}
            </div>

            <div className='flex flex-col gap-1'>
              <input
                type="email" placeholder="Email address"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`bg-neutral-900 md:bg-transparent border ${errors.email ? 'border-red-500 animate-shake' : 'border-neutral-700'} p-3 rounded-lg focus:border-blue-500 outline-none transition-colors text-sm`}
              />
              {errors.email && <span className='text-red-500 text-[10px] font-bold uppercase ml-1'>{errors.email}</span>}
            </div>

            <div className='flex flex-col gap-1 relative'>
              <input
                type="password" placeholder="Password"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full bg-neutral-900 md:bg-transparent border ${errors.password ? 'border-red-500 animate-shake' : 'border-neutral-700'} p-3 rounded-lg focus:border-blue-500 outline-none transition-colors text-sm`}
              />
              {errors.password ? (
                <span className='text-red-500 text-[10px] font-bold uppercase ml-1'>{errors.password}</span>
              ) : (
                <p className='text-[10px] md:text-xs text-neutral-500 mt-1 px-1'>Use 8+ chars with Uppercase, Number & Symbol</p>
              )}
            </div>

            <div className='flex flex-col md:flex-row items-center justify-between mt-4 md:mt-6 gap-4'>
              <Link to="/signin" className='text-blue-400 text-xs md:text-sm font-medium hover:underline order-2 md:order-1'>
                Sign in instead
              </Link>
              <button 
                className='w-full md:w-auto bg-blue-600 hover:bg-blue-700 px-8 py-2.5 rounded-lg font-bold flex items-center justify-center gap-1 transition-all active:scale-95 order-1 md:order-2' 
                type='submit'
              >
                Next <ChevronRight size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
}

export default Register;