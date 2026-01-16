import React from 'react';

interface PulseMetric {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
  description: string;
  source: string;
  sourceUrl?: string;
}

const StrategicAIPulse: React.FC = () => {
  const metrics: PulseMetric[] = [
    { 
      label: 'Sector AI Aggression', 
      value: 'Extreme', 
      trend: 'up', 
      color: 'text-red-600',
      description: 'Accelerated tool launches and future roadmaps.',
      source: 'ENR Sector Outlook',
      sourceUrl: 'https://www.enr.com/topics/883-artificial-intelligence'
    },
    { 
      label: 'Market Sentiment', 
      value: 'Positive', 
      trend: 'up', 
      color: 'text-orange-500',
      description: 'Users report significant efficiency gains in automated layouts.',
      source: 'G2 Construction Tech',
      sourceUrl: 'https://www.g2.com/categories/construction'
    },
    { 
      label: 'Digital Maturity', 
      value: '44%', 
      trend: 'up', 
      color: 'text-blue-600',
      description: 'Industry-wide digital adoption benchmark (Current).',
      source: 'McKinsey Digital',
      sourceUrl: 'https://www.mckinsey.com/industries/capital-projects-and-infrastructure/our-insights'
    },
    { 
      label: 'Response Priority', 
      value: 'High', 
      trend: 'stable', 
      color: 'text-red-700',
      description: 'Recommended ranking for Hilti Fleet Digitalization.',
      source: 'Internal Strategic Desk'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-10 overflow-hidden relative fade-in">
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
        <svg className="w-40 h-40 text-[#d2051e]" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Strategic Pulse Data</h3>
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight italic">Strategic AI Pulse</h2>
        </div>
        <div className="flex items-center space-x-4">
           <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Evidence Base</span>
              <div className="flex space-x-2 mt-1">
                {['McKinsey', 'G2', 'Reddit', 'ENR'].map(s => (
                  <span key={s} className="text-[8px] bg-gray-50 text-gray-400 border border-gray-100 px-1.5 py-0.5 rounded font-black uppercase">{s}</span>
                ))}
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        {metrics.map((m, idx) => (
          <div key={idx} className="relative group border-l-2 border-transparent hover:border-[#d2051e] pl-4 transition-colors">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{m.label}</p>
            <div className="flex items-baseline space-x-2 mb-1">
              <span className={`text-3xl font-[900] tracking-tighter ${m.color}`}>{m.value}</span>
              {m.trend === 'up' && <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7"/></svg>}
            </div>
            <p className="text-[9px] text-gray-500 font-medium leading-tight mb-2">{m.description}</p>
            <div className="flex items-center text-[8px] font-black uppercase text-gray-300 group-hover:text-[#d2051e] transition-colors">
              <svg className="w-2.5 h-2.5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/></svg>
              {m.source}
            </div>
          </div>
        ))}
      </div>

      {/* Pulse References Footer */}
      <div className="pt-6 border-t border-gray-100">
        <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Primary Pulse Sources</h4>
        <div className="flex flex-wrap gap-4">
          {metrics.filter(m => m.sourceUrl).map((m, idx) => (
            <a 
              key={idx} 
              href={m.sourceUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center space-x-2 group"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-[#d2051e]"></div>
              <span className="text-[10px] font-bold text-gray-500 group-hover:text-gray-900 transition-colors underline decoration-gray-200 underline-offset-2">{m.source}</span>
            </a>
          ))}
          <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
              <span className="text-[10px] font-bold text-gray-300 italic">Financial Audits (Internal Access Only)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategicAIPulse;