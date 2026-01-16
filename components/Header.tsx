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
    <header className="bg-white border-b border-gray-200 py-6 px-6 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl flex justify-between items-center mx-auto">
        <Link 
          to="/" 
          className="flex items-center space-x-6 transition-all duration-300 group"
        >
          {/* Text-only HILTI Branding */}
          <div className="flex items-center transition-transform duration-300 group-hover:scale-[1.02]">
            <span className="text-[#d2051e] text-3xl sm:text-4xl font-[900] tracking-tighter leading-none select-none uppercase">
              HILTI
            </span>
          </div>
          
          <div className="border-l border-gray-200 pl-6 py-1 hidden md:block">
            <h1 className="text-xl font-black text-gray-900 tracking-tight leading-none mb-1 uppercase group-hover:text-[#d2051e] transition-colors">Competitor AI Tracker</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-bold">Strategic Intelligence Hub</p>
          </div>
        </Link>
        
        <nav className="hidden lg:flex items-center space-x-10 text-[11px] font-black uppercase tracking-widest text-gray-500">
          <Link to="/" className="hover:text-[#d2051e] transition pb-1 border-b-2 border-transparent hover:border-[#d2051e]">Dashboard</Link>
          
          {isHome ? (
            <>
              <button 
                onClick={() => handleScroll('competitors-list')} 
                className="hover:text-[#d2051e] transition pb-1 border-b-2 border-transparent hover:border-[#d2051e]"
              >
                Competitors
              </button>
              <button 
                onClick={() => handleScroll('reports-analysis')} 
                className="hover:text-[#d2051e] transition pb-1 border-b-2 border-transparent hover:border-[#d2051e]"
              >
                PESTEL Hub
              </button>
            </>
          ) : (
            <>
              <Link to="/#competitors-list" className="hover:text-[#d2051e] transition pb-1 border-b-2 border-transparent hover:border-[#d2051e]">Competitors</Link>
              <Link to="/#reports-analysis" className="hover:text-[#d2051e] transition pb-1 border-b-2 border-transparent hover:border-[#d2051e]">PESTEL Hub</Link>
            </>
          )}
          
          <div className="h-5 w-px bg-gray-200 mx-2"></div>
          
          <div className="flex items-center space-x-2 bg-red-50 px-3 py-1 rounded-full border border-red-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            <span className="text-[#d2051e] text-[9px] font-black tracking-widest uppercase">Live Intelligence Active</span>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;