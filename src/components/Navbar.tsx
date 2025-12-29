import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import type { User } from "../types";
import API from "../api";

interface SearchResult {
  _id: string;
  title: string;
  location: string;
  date: string;
  images: string[];
}

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [showMobileSearch, setShowMobileSearch] = useState<boolean>(false);
  const [showProfileDropUp, setShowProfileDropUp] = useState(false);

  // Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Dropdowns
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Load user
  const loadUser = () => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  };

  // Search (debounced)
  useEffect(() => {
    if (searchTerm.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setIsSearching(true);
        const { data } = await API.get(`/events?search=${searchTerm}&limit=5`);
        setSearchResults(data);
        setShowResults(true);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  // Global listeners
  useEffect(() => {
    loadUser();
    window.addEventListener("auth-change", loadUser);

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowProfileDropdown(false);
        setShowProfileDropUp(false)
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("auth-change", loadUser);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("auth-change"));
    navigate("/login");
  };

  return (
    <>
      {/* ================= MOBILE TOP BAR ================= */}
      <div className="fixed top-0 left-0 right-0 z-40 h-14 bg-white border-b flex items-center justify-between px-4 md:hidden">
        <button
          className="p-2 rounded hover:bg-gray-100"
          onClick={() => setShowMobileSearch(true)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>

        {showMobileSearch && (
          <div className="fixed inset-0 z-50 bg-white md:hidden animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 h-14 border-b">
              <button
                onClick={() => {
                  setShowMobileSearch(false);
                  setSearchTerm("");
                  setShowResults(false);
                }}
                className="p-2"
              >
                ←
              </button>

              <input
                autoFocus
                type="text"
                placeholder="Search events, locations..."
                className="flex-1 border rounded-lg px-4 py-2 text-sm outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Results */}
            <div className="p-4">
              {isSearching && (
                <p className="text-center text-gray-500 text-sm">
                  Searching...
                </p>
              )}

              {!isSearching && showResults && searchResults.length === 0 && (
                <p className="text-center text-gray-400 text-sm">
                  No results found
                </p>
              )}

              <ul className="space-y-3">
                {searchResults.map((event) => (
                  <li key={event._id}>
                    <Link
                      to={`/event/${event._id}`}
                      onClick={() => setShowMobileSearch(false)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
                    >
                      <img
                        src={event.images?.[0] || "https://placehold.co/50"}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div>
                        <p className="font-medium text-sm">{event.title}</p>
                        <p className="text-xs text-gray-500">
                          📍 {event.location} •{" "}
                          {new Date(event.date).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <img
          src="https://img.icons8.com/ios-filled/50/000000/walter-white.png"
          className="w-8 h-8"
          alt="logo"
        />
      </div>

      {/* ================= DESKTOP NAVBAR ================= */}
      <nav className="bg-white border-b fixed z-30 w-full top-0 h-16 hidden md:flex items-center justify-between px-6 shadow-sm">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-blue-600 text-white p-1.5 rounded-lg">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <span className="text-xl font-bold text-gray-800">ROCsEventS</span>
        </Link>

        {/* Search */}
        <div
          className="hidden md:flex items-center w-1/3 relative"
          ref={searchRef}
        >
          {" "}
          <div className="relative w-full">
            {" "}
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              {" "}
              <svg
                className="w-4 h-4 text-gray-500"
                aria-hidden="true"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>{" "}
            </div>{" "}
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 outline-none"
              placeholder="Search events, locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => searchTerm.length >= 2 && setShowResults(true)}
            />{" "}
          </div>{" "}
          {/* --- SEARCH RESULTS MODEL/DROPDOWN --- */}{" "}
          {showResults && (
            <div className="absolute top-full left-0 w-full bg-white mt-2 rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50">
              {" "}
              {isSearching ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  Searching...
                </div>
              ) : searchResults.length > 0 ? (
                <ul className="max-h-96 overflow-y-auto">
                  {" "}
                  {searchResults.map((event) => (
                    <li key={event._id}>
                      {" "}
                      <Link
                        to={`/event/${event._id}`}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-50 transition"
                        onClick={() => setShowResults(false)}
                      >
                        {" "}
                        {/* Mini Image */}{" "}
                        <img
                          src={
                            event.images?.[0] || "https://placehold.co/50x50"
                          }
                          alt=""
                          className="w-12 h-12 rounded object-cover"
                        />{" "}
                        {/* Details */}{" "}
                        <div>
                          {" "}
                          <div className="font-semibold text-gray-800 text-sm">
                            {event.title}
                          </div>{" "}
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            {" "}
                            <span>📍 {event.location}</span> <span>•</span>{" "}
                            <span>
                              {new Date(event.date).toLocaleDateString()}
                            </span>{" "}
                          </div>{" "}
                        </div>{" "}
                      </Link>{" "}
                    </li>
                  ))}{" "}
                </ul>
              ) : (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No events found.
                </div>
              )}{" "}
            </div>
          )}{" "}
        </div>

        {/* Profile */}
        <div className="flex items-center gap-4">
          {!user ? (
            <div className="flex gap-3">
              <Link
                to="/login"
                className="text-gray-600 hover:text-blue-600 font-medium py-2"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Get Started
              </Link>
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-2 focus:outline-none transition transform active:scale-95"
              >
                <img
                  src={user.profileImage || "https://placehold.co/40x40"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border border-gray-300 object-cover"
                />
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow-xl border border-gray-100 animate-fade-in z-50">
                  <div className="px-4 py-3 text-sm text-gray-900">
                    <div className="font-bold">{user.name}</div>
                    <div className="text-gray-500 truncate">{user.email}</div>
                  </div>
                  <ul className="py-2 text-sm text-gray-700">
                    <li>
                      <Link
                        to="/profile-update"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        👤 View Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        ⚙️ Settings
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/premium"
                        className="block px-4 py-2 hover:bg-gray-100 text-yellow-600 font-bold"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        👑 Go Premium
                      </Link>
                    </li>
                  </ul>
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 font-medium"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* ================= MOBILE BOTTOM BAR ================= */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-40 md:hidden">
        <div className="flex justify-around items-center h-16 text-xs">
          <Link to="/" className="flex flex-col items-center gap-1">
            🏠 <span>Home</span>
          </Link>

          <Link
            to="/create-event"
            className="flex flex-col items-center gap-1 text-blue-600"
          >
            ➕ <span>Create</span>
          </Link>

          <Link to="/play" className="flex flex-col items-center gap-1">
            ▶️ <span>Play</span>
          </Link>

          <Link to="/offers" className="flex flex-col items-center gap-1">
            🎁 <span>Offers</span>
          </Link>

          <button
            onClick={() => setShowProfileDropUp(!showProfileDropUp)}
            className="flex flex-col items-center gap-1"
          >
            <img
              src={user?.profileImage || "https://placehold.co/32"}
              className="w-8 h-8 rounded-full"
            />
            <span>Profile</span>
          </button>

          {/* ⬆️ PROFILE DROP-UP (Mobile) */}
          {showProfileDropUp && (
            <div className="absolute bottom-16 right-2 w-44 bg-white rounded-xl shadow-xl border border-gray-200 md:hidden animate-fade-in">
              {/* Premium */}
              <Link
                to="/premium"
                onClick={() => setShowProfileDropdown(false)}
                className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-yellow-600 hover:bg-yellow-50 rounded-t-xl"
              >
                👑 Premium
              </Link>

              <div className="border-t" />

              {/* Logged In */}
              {user ? (
                <button
                  onClick={() => {
                    setShowProfileDropUp(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-50 rounded-b-xl"
                >
                  🚪 Sign out
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setShowProfileDropUp(false)}
                  className="block px-4 py-3 text-sm text-blue-600 hover:bg-gray-50 rounded-b-xl"
                >
                  🔐 Login
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
