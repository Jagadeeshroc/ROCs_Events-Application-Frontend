/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  
  // State for form data
  const [formData, setFormData] = useState({
    title: '', description: '', date: '', location: '', capacity: ''
  });
  
  // State for images
  const [images, setImages] = useState<string[]>([]);

  // Get logged-in user on load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      alert('You must be logged in to create an event');
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Multiple Image Selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Check limit (Existing images + New files)
      if (images.length + files.length > 10) {
        alert('You can only upload a maximum of 10 images.');
        return;
      }

      // Convert each file to Base64
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Remove an image from the preview list
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Send images array along with other data
      await API.post('/events', { ...formData, images });
      alert('Event Created Successfully!');
      navigate('/');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create event');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-xl">
      
      {/* 1. User Identity Header */}
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Create New Event</h2>
        {user && (
          <div className="flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            <span className="mr-2">Posting as:</span>
            <span className="font-bold text-blue-600">{user.name}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="title" placeholder="Event Title" onChange={handleChange} required className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"/>
        
        <div className="grid grid-cols-2 gap-4">
          <input type="datetime-local" name="date" onChange={handleChange} required className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"/>
          <input type="number" name="capacity" placeholder="Max Capacity" min="1" onChange={handleChange} required className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"/>
        </div>
        
        <input type="text" name="location" placeholder="Location" onChange={handleChange} required className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"/>
        <textarea name="description" placeholder="Description" onChange={handleChange} required className="w-full p-3 border rounded h-32 focus:ring-2 focus:ring-blue-500 outline-none"/>

        {/* 2. Image Upload Section */}
        <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg text-center">
          <label className="cursor-pointer">
            <span className="bg-blue-50 text-blue-600 px-4 py-2 rounded font-semibold hover:bg-blue-100 transition">
              + Add Images (Max 10)
            </span>
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              onChange={handleImageChange} 
              className="hidden" 
            />
          </label>
          <p className="text-xs text-gray-500 mt-2">{images.length} / 10 images selected</p>
        </div>

        {/* 3. Image Preview Gallery */}
        {images.length > 0 && (
          <div className="grid grid-cols-5 gap-2 mt-4">
            {images.map((img, index) => (
              <div key={index} className="relative group">
                <img src={img} alt="preview" className="w-full h-20 object-cover rounded shadow-sm" />
                <button 
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 bg-red-600 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs opacity-0 group-hover:opacity-100 transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        
        <button type="submit" className="w-full bg-green-600 text-white py-3 rounded text-lg font-bold hover:bg-green-700 transition mt-6">
          Publish Event
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;