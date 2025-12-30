/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import type { AuthResponse } from '../types';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  
  // 1. Add loading state
  const [loading, setLoading] = useState(false); 
  
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 2. Start loading
    setLoading(true); 

    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    
    try {
      const { data } = await API.post<AuthResponse>(endpoint, formData);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      window.dispatchEvent(new Event('auth-change'));

      if (isLogin) {
        navigate('/'); 
      } else {
        navigate('/profile-update'); 
      }
      // Note: We don't need setLoading(false) here because the page navigates away immediately
    } catch (err: any) {
      alert(err.response?.data?.message || 'Authentication Failed');
      
      // 3. Stop loading only if there is an error (so the user can try again)
      setLoading(false); 
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
          
          {/* 4. Update the button to handle loading state */}
          <button 
            type="submit" 
            disabled={loading} // Disable button while loading
            className={`w-full text-white py-2 rounded transition font-semibold 
              ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
            `}
          >
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-blue-600 font-bold hover:underline"
            disabled={loading} // Also disable this link while loading
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
