
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import CompetitorTable from './components/CompetitorTable';
import CompetitorRadar from './components/CompetitorRadar';
import StrategyInsights from './components/StrategyInsights';
import CompetitorDetail from './components/CompetitorDetail';
import { PESTELSection } from './components/StrategicFrameworks';
import { fetchCompetitorIntelligence } from './services/geminiService';
import { CompetitorMove, AppStatus, GroundingLink, StrategicInsight, RadarData, PESTELData, SWOTData } from './types';

// Scroll to anchor on route change
const ScrollToAnchor = () => {
  const location = useLocation();
  const lastHash = useRef('');

  useEffect(() => {
    if (location.hash) {
      lastHash.current = location.hash.substring(1);
    }

    if (lastHash.current && location.pathname === '/') {
      setTimeout(() => {
        const element = document.getElementById(lastHash.current);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          lastHash.current = ''; // Clear after scrolling
        }
      }, 100);
    }
  }, [location]);
  return null;
};

const Dashboard: React.FC<{
  status: AppStatus;
  data: CompetitorMove[];
  insights: StrategicInsight[];
  radar: RadarData[];
  pestel: PESTELData;
  groundingLinks: GroundingLink[];
  error: string | null;
  loadData: () => void;
  handleDownloadCSV: () => void;
}> = ({ status, data, insights, radar, pestel, groundingLinks, error, loadData, handleDownloadCSV }) => {
  return (
    <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
             <span className="bg-red-100 text-red-700 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-tighter">Strictly Confidential</span>
             <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">• Strategy Desk Pulse</span>
          </div>
          <h2 className="text-5xl font-black text-gray-900 tracking-tight mb-2">Global Market Pulse</h2>
          <p className="text-xl text-gray-500 max-w-2xl leading-relaxed">
            Real-time digital transformation monitoring and strategic mapping for AI maturity across the construction sector.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleDownloadCSV}
            className="px-6 py-3 rounded-md font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 shadow-sm transition flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span>Export CSV</span>
          </button>
          <button
            onClick={loadData}
            disabled={status === AppStatus.LOADING}
            className={`px-8 py-3 rounded-md font-bold text-white transition-all shadow-xl flex items-center space-x-3 ${
              status === AppStatus.LOADING ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#d2051e] hover:bg-black active:transform active:scale-95'
            }`}
          >
            {status === AppStatus.LOADING ? (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
            <span>{status === AppStatus.LOADING ? 'Scanning Markets...' : 'Refresh Insight'}</span>
          </button>
        </div>
      </div>

      {status === AppStatus.ERROR && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
          <p className="text-sm text-red-700 font-bold">{error}</p>
        </div>
      )}

      {/* Main Analysis Grid */}
      <div className="space-y-12">
        {/* Row 1: Radar & Strategic Positioning */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-8">
            <CompetitorRadar data={radar} />
          </div>
          <div className="xl:col-span-4">
             <StrategyInsights insights={insights} />
          </div>
        </div>

        {/* Row 2: PESTEL */}
        <div id="reports-analysis">
          <PESTELSection data={pestel} />
        </div>

        {/* Row 3: Competitors List & Evidence */}
        <div id="competitors-list" className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-9">
            <CompetitorTable data={data} onDownload={handleDownloadCSV} />
          </div>
          <div className="xl:col-span-3 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/></svg>
                  Evidence Index
                </h3>
              </div>
              <p className="text-[10px] text-gray-400 mb-4 leading-normal italic uppercase">
                Direct external documents used to validate strategy synthesis.
              </p>
              <ul className="space-y-3">
                {groundingLinks.length > 0 ? (
                  groundingLinks.slice(0, 6).map((link, idx) => (
                    <li key={idx}>
                      <a href={link.uri} target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-gray-50 hover:bg-red-50 transition border border-gray-100 hover:border-red-100">
                        <p className="text-[11px] font-bold text-gray-900 truncate">{link.title || link.uri}</p>
                        <p className="text-[9px] text-gray-400 mt-1 uppercase font-bold tracking-widest">{new URL(link.uri).hostname}</p>
                      </a>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-400 text-center py-4 italic">No evidence indexed yet.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const AppContent: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [data, setData] = useState<CompetitorMove[]>([]);
  const [insights, setInsights] = useState<StrategicInsight[]>([]);
  const [radar, setRadar] = useState<RadarData[]>([]);
  const [pestel, setPestel] = useState<PESTELData>({ political: [], economic: [], social: [], technological: [], environmental: [], legal: [] });
  const [swot, setSwot] = useState<Record<string, SWOTData>>({});
  const [groundingLinks, setGroundingLinks] = useState<GroundingLink[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Use a ref to track if initial load has happened
  const hasInitialLoaded = useRef(false);

  const loadData = useCallback(async () => {
    setStatus(AppStatus.LOADING);
    setError(null);
    try {
      const result = await fetchCompetitorIntelligence();
      setData(result.moves);
      setInsights(result.insights);
      setRadar(result.radar);
      setPestel(result.pestel);
      setSwot(result.swot);
      setGroundingLinks(result.links);
      setStatus(AppStatus.SUCCESS);
      hasInitialLoaded.current = true;
    } catch (err) {
      console.error(err);
      setError("Strategic synthesis engine failed. Please check connection and refresh.");
      setStatus(AppStatus.ERROR);
    }
  }, []);

  useEffect(() => {
    // Only load data if we haven't successfully loaded it before
    if (!hasInitialLoaded.current && status === AppStatus.IDLE) {
      loadData();
    }
  }, [loadData, status]);

  const handleDownloadCSV = () => {
    if (data.length === 0) return;
    const headers = ["Company", "Sector", "Summary", "Date", "Link"];
    const csvContent = [
      headers.join(","),
      ...data.map(item => [
        `"${item.company}"`,
        `"${item.sector}"`,
        `"${item.summary.replace(/"/g, '""')}"`,
        `"${item.date}"`,
        `"${item.link}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `hilti_market_pulse_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafb] selection:bg-red-100 selection:text-red-900">
      <ScrollToAnchor />
      <Header />
      
      <Routes>
        <Route 
          path="/" 
          element={
            <Dashboard 
              status={status} 
              data={data} 
              insights={insights} 
              radar={radar} 
              pestel={pestel}
              groundingLinks={groundingLinks} 
              error={error} 
              loadData={loadData} 
              handleDownloadCSV={handleDownloadCSV} 
            />
          } 
        />
        <Route 
          path="/competitor/:companyName" 
          element={
            <div className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
              <CompetitorDetail moves={data} insights={insights} links={groundingLinks} swot={swot} />
            </div>
          } 
        />
      </Routes>

      <footer className="bg-white border-t border-gray-100 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 text-gray-400">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-100 flex items-center justify-center rounded">
              <span className="text-gray-400 font-black text-sm italic">H</span>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] block">Hilti Intelligence Hub</span>
              <span className="text-[8px] font-bold text-gray-300 uppercase block tracking-widest">Internal Use Only</span>
            </div>
          </div>
          <p className="text-[10px] uppercase font-bold tracking-widest text-center">Powered by Gemini 3 Pro • Search Grounding Enabled</p>
          <div className="text-right">
             <p className="text-[10px]">&copy; {new Date().getFullYear()} Hilti Group Intelligence</p>
             <p className="text-[9px] text-gray-300 mt-1 italic tracking-widest uppercase font-black">Strict Enforcement Policy Applies</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;
