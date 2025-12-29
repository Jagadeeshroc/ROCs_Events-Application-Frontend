import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import EventsPage from './pages/EventsPage';
import AuthPage from './pages/AuthPage';
import ProfileUpdate from './pages/ProfileUpdate';
import CreateEvent from './pages/CreatePage';
import EventDetails from './pages/EventsDetails';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute'; // Import the guard

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        
        <Navbar />

        <div className="flex pt-16">
          <Sidebar />

          <main className="flex-1 md:pl-20 p-4 min-h-screen transition-all duration-300">
            <div className="max-w-7xl mx-auto">
              <Routes>
                {/* === PUBLIC ROUTES (Anyone can see these) === */}
                <Route path="/" element={<EventsPage />} />
                <Route path="/login" element={<AuthPage />} />
                <Route path="/signup" element={<AuthPage />} />
              
                
                {/* === PRIVATE ROUTES (Must be logged in) === */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/create-event" element={<CreateEvent />} />
                    <Route path="/event/:id" element={<EventDetails />} />
                  <Route path="/profile-update" element={<ProfileUpdate />} />
                  <Route path="/settings" element={<div className="p-10 text-center text-2xl">⚙️ Settings Page (Coming Soon)</div>} />
                  <Route path="/premium" element={<div className="p-10 text-center text-2xl text-yellow-600">👑 Premium Subscription (Coming Soon)</div>} />
                </Route>

              </Routes>
            </div>
          </main>
        </div>

        <div className="md:ml-64">
           <Footer />
        </div>

      </div>
    </Router>
  );
}

export default App;