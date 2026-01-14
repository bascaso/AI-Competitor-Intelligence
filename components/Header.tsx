
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-[#d2051e] text-white py-4 px-6 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl flex justify-between items-center mx-auto">
        <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition">
          <div className="w-10 h-10 bg-white flex items-center justify-center rounded-sm">
            <span className="text-[#d2051e] font-black text-xl italic">H</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Competitor AI Tracker</h1>
            <p className="text-xs opacity-80 uppercase tracking-widest">Global Intelligence Hub</p>
          </div>
        </Link>
        <nav className="hidden md:flex space-x-8 text-sm font-medium">
          <Link to="/" className="hover:text-red-100 transition border-b-2 border-transparent hover:border-white/50 pb-1">Dashboard</Link>
          
          {isHome ? (
            <>
              <button 
                onClick={() => handleScroll('competitors-list')} 
                className="hover:text-red-100 transition border-b-2 border-transparent hover:border-white/50 pb-1"
              >
                Competitors
              </button>
              <button 
                onClick={() => handleScroll('reports-analysis')} 
                className="hover:text-red-100 transition border-b-2 border-transparent hover:border-white/50 pb-1"
              >
                Strategic Reports
              </button>
            </>
          ) : (
            <>
              <Link to="/#competitors-list" className="hover:text-red-100 transition border-b-2 border-transparent hover:border-white/50 pb-1">Competitors</Link>
              <Link to="/#reports-analysis" className="hover:text-red-100 transition border-b-2 border-transparent hover:border-white/50 pb-1">Strategic Reports</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
