/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import API from '../api';
import EventCard from '../components/EventCard';
import type { EventData, User } from '../types';

const EventsPage = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'discover' | 'my_events'>('discover');

  // Get Logged-in User
  const storedUser = localStorage.getItem('user');
  const user: User | null = storedUser ? JSON.parse(storedUser) : null;

  const fetchEvents = async () => {
    try {
      const { data } = await API.get('/events');
      setEvents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading events...</div>;

  // === FILTERING LOGIC ===
  // 1. Discover: Shows ALL events (as you requested)
  const discoverEvents = events;

  // 2. My Events: Only events where I am the organizer
  const myEvents = events.filter((e) => 
    user && ((e.organizer as any)._id === user.id || (e.organizer as any).id === user.id)
  );

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen">
      
      {/* === TABS HEADER === */}
      <div className="flex justify-center mb-8 border-b">
        <button 
          onClick={() => setActiveTab('discover')}
          className={`px-6 py-3 font-bold text-lg transition-colors border-b-2 ${
            activeTab === 'discover' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          🌍 Discover Events
        </button>
        
        {/* Only show "My Events" tab if user is logged in */}
        {user && (
          <button 
            onClick={() => setActiveTab('my_events')}
            className={`px-6 py-3 font-bold text-lg transition-colors border-b-2 ${
              activeTab === 'my_events' 
                ? 'border-yellow-500 text-yellow-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            ⭐ My Events
          </button>
        )}
      </div>

      {/* === TAB CONTENT === */}
      
      {/* TAB 1: DISCOVER (ALL EVENTS) */}
      {activeTab === 'discover' && (
        <div className="animate-fade-in">
          {discoverEvents.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">No events found. Be the first to create one!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {discoverEvents.map((event) => (
                <EventCard key={event._id} event={event} refreshEvents={fetchEvents} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY EVENTS (ONLY MINE) */}
      {activeTab === 'my_events' && (
        <div className="animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-700">Events You Manage</h2>
            <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">
              Total: {myEvents.length}
            </span>
          </div>

          {myEvents.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500 text-lg mb-2">You haven't created any events yet.</p>
              <a href="/create-event" className="text-blue-600 font-bold hover:underline">Create your first event →</a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myEvents.map((event) => (
                <EventCard key={event._id} event={event} refreshEvents={fetchEvents} />
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default EventsPage;