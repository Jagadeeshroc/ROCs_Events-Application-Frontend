import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const location = useLocation();

  const isActive = (path:string) =>
    location.pathname === path
      ? "bg-gradient-to-r from-blue-500/10 to-blue-500/5 text-blue-600 border-l-4 border-blue-500 shadow-sm"
      : "text-gray-500 hover:bg-gray-100 hover:text-gray-900";

  return (
    <aside
      className={`fixed top-16 left-0 z-20 h-[calc(100vh-4rem)]
      backdrop-blur-xl bg-white/80 border-r border-gray-200
      transition-all duration-300 ease-in-out
      ${isExpanded ? "w-65" : "w-20"}
      hidden md:flex flex-col`}
    >
      {/* NAV */}
      <div className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-2 font-medium">

          {/* ITEM */}
          {[
            { to: "/", label: "Discover", icon: HomeIcon },
            { to: "/create-event", label: "Create Event", icon: PlusIcon },
            { to: "/my-events", label: "My Events", icon: StarIcon },
              { to: "/Listyourevent", label: "List Your Event", icon: ListEventIcon },
             { to: "/play", label: "Play", icon: PlayIcon },
              { to: "/offers", label: "Offers", icon: OffersIcon },
            { to: "/premium", label: "Premium Plan", icon: PremiumIcon },
          ].map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <Link
                to={to}
                className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 ${isActive(
                  to
                )}`}
              >
                <Icon />
                <span
                  className={`text-sm font-medium transition-all duration-300
                  ${isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 w-0 overflow-hidden"}`}
                >
                  {label}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* SUPPORT */}
        {isExpanded && (
          <div className="mt-10 pt-6 border-t border-gray-200">
            <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase">
              Support
            </p>
            <a
              href="#"
              className="flex items-center gap-3 p-3 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition"
            >
              <HelpIcon />
              <span className="text-sm">Help Center</span>
            </a>
          </div>
        )}
      </div>

      {/* TOGGLE */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 p-2
          text-gray-500 rounded-lg hover:bg-gray-100 transition"
        >
          {isExpanded ? (
            <>
              <CollapseIcon />
              <span className="text-sm">Collapse</span>
            </>
          ) : (
            <ExpandIcon />
          )}
        </button>
      </div>
    </aside>
  );
};

/* ICONS */
const HomeIcon = () => (
  <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 3l3 6 6 .9-4.5 4.4 1 6.2L12 17l-5.5 3.5 1-6.2L3 9.9l6-.9z" />
  </svg>
);

const PremiumIcon = () => (
  <svg className="w-6 h-6 shrink-0 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m7 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const HelpIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M9.09 9a3 3 0 115.82 1c-.5.6-1.41 1.1-1.41 2" />
  </svg>
);

const CollapseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
  </svg>
);

const ExpandIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
  </svg>
);

// 1. List Your Event (Calendar with Plus)
const ListEventIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

// 2. Play (Game Controller)
const PlayIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
  </svg>
);

// 3. Offers (Discount Tag)
const OffersIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-5 5a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 015 8V3a1 1 0 011-1zm5 5h.01" />
  </svg>
);

export default Sidebar;
