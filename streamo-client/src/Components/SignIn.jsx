import React, { useState } from 'react';
import { Clapperboard, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; 
import API from "../utils/APIintercept";
import { addUser } from '../utils/userSlice';
import {useDispatch} from 'react-redux'

function SignIn() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
 const dispatch = useDispatch();

  const validate = () => {
    let tempErrors = {};
    if (!formData.email.trim()) tempErrors.email = "Email is required";
    if (!formData.password) tempErrors.password = "Password is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    // Validate the Form
    if (!validate()) return;

    try {
      const { data } = await API.post('/login', formData);
      // 1. save to Localstorage 
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      // 2. Save to Redux (for UI updates)
    dispatch(addUser({ user: data.user, token: data.token }));
    
      navigate('/'); 
    } catch (err) {
      setServerError(err.response?.data?.message || "Login Failed");
      setTimeout(() => setServerError(""), 5000);
    }
  };

  // Framer Motion Variants for the Shake effect
  const shakeVariants = {
    shake: {
      x: [0, -5, 5, -5, 5, 0],
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className='flex flex-col items-center justify-center w-full min-h-screen bg-[#0f0f0f] text-white p-4 relative'>
      
      {/* 1. ANIMATED ERROR TOAST */}
      <AnimatePresence>
        {serverError && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className='fixed top-5 right-5 left-5 md:left-auto bg-red-600 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 z-50 justify-center'
          >
            <AlertCircle size={20} />
            <span className="font-bold text-xs uppercase tracking-wide">{serverError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className='bg-[#181818] p-6 md:p-10 rounded-2xl border border-neutral-800 w-full max-w-md shadow-xl'
      >
        <div className='flex flex-col items-center mb-8'>
          <Clapperboard size={40} className="text-red-500 mb-2" />
          <h2 className='text-2xl font-bold tracking-tight'>Sign In</h2>
          <p className='text-neutral-400 text-sm'>to continue to Streamo</p>
        </div>

        <form className='flex flex-col gap-5' onSubmit={handleSubmit} noValidate>
          
          <div className='flex flex-col gap-1'>
            <label className='text-[10px] uppercase font-bold text-neutral-500 ml-1 tracking-widest'>Email</label>
            <motion.input 
              animate={errors.email ? "shake" : ""}
              variants={shakeVariants}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              type="email" 
              placeholder="Enter your email" 
              className={`bg-neutral-900 border ${errors.email ? 'border-red-500' : 'border-neutral-700'} p-3 rounded-lg focus:border-blue-500 outline-none transition-all text-sm`} 
            />
            {errors.email && <span className='text-red-500 text-[10px] font-bold uppercase ml-1 mt-1'>{errors.email}</span>}
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-[10px] uppercase font-bold text-neutral-500 ml-1 tracking-widest'>Password</label>
            <motion.input 
              animate={errors.password ? "shake" : ""}
              variants={shakeVariants}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              type="password" 
              placeholder="Enter your password" 
              className={`bg-neutral-900 border ${errors.password ? 'border-red-500' : 'border-neutral-700'} p-3 rounded-lg focus:border-blue-500 outline-none transition-all text-sm`} 
            />
            {errors.password && <span className='text-red-500 text-[10px] font-bold uppercase ml-1 mt-1'>{errors.password}</span>}
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className='bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold mt-2 shadow-lg'
          >
            Sign In
          </motion.button>
        </form>

        <p className='text-sm text-neutral-400 mt-8 text-center'>
          New to Streamo? 
          <Link to="/register" className='text-blue-400 font-medium ml-1 hover:underline'>
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default SignIn;