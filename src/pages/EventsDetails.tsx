/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, type Key } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import type { EventData, User } from '../types';
import EventCard from '../components/EventCard';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState<EventData | null>(null);
  const [similarEvents, setSimilarEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  const storedUser = localStorage.getItem('user');
  const currentUser: User | null = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // PERFORMANCE FIX: Fetch both requests in PARALLEL
        const [eventRes, allEventsRes] = await Promise.all([
          API.get(`/events/${id}`), // Get specific event (Full details)
          API.get('/events')        // Get list for "Similar" (Lightweight thanks to Step 1)
        ]);

        const currentEvent = eventRes.data;
        setEvent(currentEvent);

        // Filter Similar Events
        const related = allEventsRes.data.filter((e: EventData) => 
          e.location === currentEvent.location && e._id !== currentEvent._id
        );
        setSimilarEvents(related);
        
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await API.delete(`/events/${id}`);
        navigate('/');
      } catch (err: any) {
        alert(err.response?.data?.message || 'Delete Failed');
      }
    }
  };

  if (loading || !event) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  const isOwner = currentUser && event.organizer && (currentUser.id === (event.organizer as any)._id || currentUser.id === (event.organizer as any).id);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => navigate('/')} className="text-blue-600 font-semibold hover:underline flex items-center">
          ← Back to Events
        </button>
        {isOwner && (
          <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition shadow-sm flex items-center gap-2">
            🗑 Delete Event
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 bg-gray-200">
          {event.images && event.images.length > 0 ? (
            event.images.map((img: string | undefined, index: Key | null | undefined) => (
              <img 
                key={index} 
                src={img} 
                alt={`Event ${index}`} 
                loading="lazy" // Add Lazy Loading
                className={`w-full object-cover cursor-pointer hover:opacity-95 transition ${index === 0 ? 'h-96 md:col-span-2' : 'h-48'}`} 
              />
            ))
          ) : (
             <img src={event.image || "https://placehold.co/800x400"} alt="placeholder" className="w-full h-96 object-cover md:col-span-2" />
          )}
        </div>

        <div className="p-8">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-4xl font-bold text-gray-900">{event.title}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${event.capacity - event.attendees.length > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {event.capacity - event.attendees.length > 0 ? 'Available' : 'Sold Out'}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-6 text-gray-600 mb-8 text-sm md:text-base border-b pb-6">
            <p>📅 <strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
            <p>📍 <strong>Location:</strong> {event.location}</p>
            <p>👤 <strong>Organizer:</strong> {(event.organizer as any).name || 'Unknown'}</p>
            <p>🎟 <strong>Capacity:</strong> {event.capacity} People</p>
          </div>

          <div className="prose max-w-none text-gray-700">
            <h3 className="text-xl font-bold mb-3 text-gray-800">About this Event</h3>
            <p className="whitespace-pre-line leading-relaxed">{event.description}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-l-4 border-blue-600 pl-3">
          Similar Events in {event.location}
        </h2>
        {similarEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarEvents.map(evt => (
              <EventCard key={evt._id} event={evt} refreshEvents={() => {}} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">No other events found in this location right now.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;