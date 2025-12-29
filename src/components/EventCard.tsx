/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import API from '../api';
import type { EventData, User } from '../types';
import { useNavigate } from 'react-router-dom';

interface EventCardProps {
  event: EventData;
  refreshEvents: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, refreshEvents }) => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem('user');
  const user: User | null = storedUser ? JSON.parse(storedUser) : null;
  const [showAttendees, setShowAttendees] = useState(false); // Toggle list
  
  // 1. Check if the logged-in user is the ORGANIZER
  // We handle both id formats just in case
  const isCreator = user && (user.id === (event.organizer as any)._id || user.id === (event.organizer as any).id);

  // 2. Updated Check for Joined (Using .some because attendees are now objects)
  const isJoined = user ? event.attendees.some((att: any) => att._id === user.id || att === user.id) : false;
  
  const isFull = event.attendees.length >= event.capacity;
  const seatsLeft = event.capacity - event.attendees.length;

  // Handle Image Logic
  let displayImage = 'https://placehold.co/400x200';
  if (event.images && event.images.length > 0) {
    displayImage = event.images[0];
  } else if (event.image) {
    displayImage = event.image;
  }

  const handleRSVP = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return alert('Please login to join events');
    try {
      await API.post(`/events/${event._id}/rsvp`);
      alert('You have successfully joined!');
      refreshEvents();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error joining event');
    }
  };

  return (
    <div 
      onClick={() => navigate(`/event/${event._id}`)} 
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group flex flex-col h-full"
    >
      <div className="overflow-hidden h-48 relative">
        <img 
  src={displayImage} 
  alt={event.title} 
  loading="lazy"      // <--- ADD THIS
  decoding="async"    // <--- ADD THIS
  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
/>
        {/* Badge for Creator */}
        {isCreator && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded shadow">
            ⭐ Your Event
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col grow">
        <h3 className="text-xl font-bold mb-2 text-gray-800">{event.title}</h3>
        <p className="text-gray-600 text-sm mb-1">📅 {new Date(event.date).toLocaleDateString()}</p>
        <p className="text-gray-600 text-sm mb-4">📍 {event.location}</p>
        
        <div className="bg-gray-100 p-3 rounded-lg mb-4 flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-700">Capacity: {event.capacity}</span>
          <span className={`text-sm font-bold ${seatsLeft === 0 ? 'text-red-500' : 'text-green-600'}`}>
            {seatsLeft} Seats Left
          </span>
        </div>

        <div className="mt-auto">
          {/* === LOGIC: CREATOR vs USER === */}
          {isCreator ? (
            <div className="border-t pt-3" onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={() => setShowAttendees(!showAttendees)}
                className="w-full bg-gray-800 text-white py-2 rounded font-medium hover:bg-gray-700 transition flex justify-between px-4 items-center"
              >
                <span>View Bookings</span>
                <span className="bg-gray-600 px-2 rounded-full text-xs">{event.attendees.length}</span>
              </button>
              
              {/* Dropdown List of Attendees */}
              {showAttendees && (
                <div className="mt-2 bg-gray-50 p-2 rounded border max-h-32 overflow-y-auto">
                  {event.attendees.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center">No bookings yet.</p>
                  ) : (
                    <ul className="space-y-2">
                      {event.attendees.map((att: any, index) => (
                        <li key={index} className="text-sm text-gray-700 border-b pb-2 last:border-0 flex items-center gap-3">
  {/* User Image */}
  <img 
    src={att.profileImage || "https://placehold.co/40x40"} 
    alt={att.name} 
    className="w-10 h-10 rounded-full object-cover border"
  />
  <div>
    <p className="font-bold">{att.name}</p>
    <p className="text-xs text-gray-500">{att.email}</p>
    {att.mobile && <p className="text-xs text-blue-500">{att.mobile}</p>}
  </div>
</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ) : (
            // === NORMAL USER RSVP BUTTONS ===
            <>
              {isJoined ? (
                <button disabled className="w-full bg-green-500 text-white py-2 rounded font-medium cursor-default">
                  ✓ You are Attending
                </button>
              ) : isFull ? (
                <button disabled className="w-full bg-gray-400 text-white py-2 rounded font-medium cursor-not-allowed">
                  ❌ Housefull
                </button>
              ) : (
                <button 
                  onClick={handleRSVP} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium transition"
                >
                  <i className="fa fa-book" aria-hidden="true"></i> Now
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;