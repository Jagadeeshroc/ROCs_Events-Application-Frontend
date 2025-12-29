/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types';

const ProfileUpdate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: '',
    mobile: '',
    email: ''
  });
  const [preview, setPreview] = useState<string | null>(null); // For showing image
  const [imageFile, setImageFile] = useState<string>(''); // For sending to DB (Base64)

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user: User = JSON.parse(storedUser);
      setFormData(prev => ({ ...prev, email: user.email }));
    }
  }, []);

  // 1. Handle File Selection & Conversion to Base64
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string); // Show preview
        setImageFile(reader.result as string); // Store Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Send formData + the Base64 image
      const payload = { ...formData, profileImage: imageFile };
      
      const { data } = await API.put('/auth/profile', payload);
      
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...currentUser, ...data }));
      
      alert('Profile Updated Successfully!');
      navigate('/'); 
    } catch (err: any) {
      alert(err.response?.data?.message || 'Update Failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">Complete Your Profile</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Image Upload Section */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 mb-4 rounded-full overflow-hidden border-2 border-gray-300 bg-gray-100 flex items-center justify-center">
              {preview ? (
                <img src={preview} alt="Profile Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 text-3xl">📷</span>
              )}
            </div>
            
            <label className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition">
              Upload Photo
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="hidden" // Hides the ugly default file input
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Age</label>
            <input 
              type="number" name="age" placeholder="e.g. 24" 
              onChange={handleChange} required 
              className="w-full p-2 border rounded mt-1 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
            <input 
              type="tel" name="mobile" placeholder="+91 98765 43210" 
              onChange={handleChange} required 
              className="w-full p-2 border rounded mt-1 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input 
              type="email" value={formData.email} readOnly 
              className="w-full p-2 border rounded mt-1 bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>

          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition font-bold mt-4">
            Save & Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileUpdate;