/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import type { AuthResponse } from '../types';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle state
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    
    try {
      const { data } = await API.post<AuthResponse>(endpoint, formData);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // === ADD THIS LINE ===
      // Tell the rest of the app that auth has changed
      window.dispatchEvent(new Event('auth-change'));

      if (isLogin) {
        navigate('/'); 
      } else {
        navigate('/profile-update'); 
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Authentication Failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh] bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input 
              type="text" name="name" placeholder="Full Name" 
              onChange={handleChange} required 
              className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          )}
          <input 
            type="email" name="email" placeholder="Email Address" 
            onChange={handleChange} required 
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input 
            type="password" name="password" placeholder="Password" 
            onChange={handleChange} required 
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
          
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-semibold">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-blue-600 font-bold hover:underline"
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;