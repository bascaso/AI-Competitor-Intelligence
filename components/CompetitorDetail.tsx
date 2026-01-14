
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CompetitorMove, StrategicInsight, GroundingLink, SWOTData } from '../types';
import { SWOTSection } from './StrategicFrameworks';

interface CompetitorDetailProps {
  moves: CompetitorMove[];
  insights: StrategicInsight[];
  links: GroundingLink[];
  swot: Record<string, SWOTData>;
}

const CompetitorDetail: React.FC<CompetitorDetailProps> = ({ moves, insights, links, swot }) => {
  const { companyName } = useParams<{ companyName: string }>();
  const decodedName = decodeURIComponent(companyName || '');

  const competitorMoves = moves.filter(m => m.company.toLowerCase().includes(decodedName.toLowerCase()));
  const competitorInsights = insights.filter(i => 
    i.description.toLowerCase().includes(decodedName.toLowerCase()) || 
    i.title.toLowerCase().includes(decodedName.toLowerCase())
  );
  
  const relevantLinks = links.filter(l => 
    l.title.toLowerCase().includes(decodedName.toLowerCase()) || 
    l.uri.toLowerCase().includes(decodedName.toLowerCase().replace(/\s+/g, ''))
  );

  const companySwot = swot[decodedName] || swot[Object.keys(swot).find(k => k.toLowerCase().includes(decodedName.toLowerCase())) || ''] || null;

  if (competitorMoves.length === 0 && competitorInsights.length === 0) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Competitor Not Found</h2>
        <p className="text-gray-500 mt-2">Data not available for "{decodedName}".</p>
        <Link to="/" className="mt-6 inline-block text-red-600 font-bold hover:underline">← Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <Link to="/" className="text-sm font-bold text-gray-400 hover:text-red-600 transition mb-6 inline-flex items-center space-x-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        <span>Back to Intelligence Hub</span>
      </Link>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
        <div className="bg-[#d2051e] p-10 text-white relative">
          <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
            <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <div className="relative z-10">
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-white/20 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-widest text-white">Confidential Profile</span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter mb-4">{decodedName}</h1>
            <p className="text-white/80 max-w-2xl text-xl leading-relaxed">
              Deep-dive strategic mapping of AI maturity and disruptive potential within the construction ecosystem.
            </p>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 xl:grid-cols-3 gap-12">
          <div className="xl:col-span-2 space-y-12">
            {companySwot && (
              <section>
                <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
                  <span className="w-8 h-8 rounded bg-red-100 text-red-600 flex items-center justify-center mr-3 text-sm">01</span>
                  SWOT Analysis
                </h2>
                <SWOTSection data={companySwot} company={decodedName} />
              </section>
            )}

            <section>
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 rounded bg-red-100 text-red-600 flex items-center justify-center mr-3 text-sm">{companySwot ? '02' : '01'}</span>
                AI Initiatives & Digital Footprint
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {competitorMoves.map((move) => (
                  <div key={move.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-4">
                      <span className="bg-gray-100 text-gray-600 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">{move.sector}</span>
                      <span className="text-xs text-gray-400 font-medium">{move.date}</span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-6">{move.summary}</p>
                    <a 
                      href={move.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-red-600 text-xs font-bold hover:underline group"
                    >
                      <span>Primary Evidence Source</span>
                      <svg className="w-3 h-3 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </a>
                  </div>
                ))}
              </div>
            </section>
            
            <section>
               <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
                  <span className="w-8 h-8 rounded bg-red-100 text-red-600 flex items-center justify-center mr-3 text-sm">{companySwot ? '03' : '02'}</span>
                  Strategic Positioning
                </h2>
                <div className="space-y-4">
                  {competitorInsights.map((insight, idx) => (
                    <div key={idx} className="flex items-start p-6 bg-gray-50 rounded-xl">
                      <div className={`mt-1 mr-4 w-3 h-3 rounded-full flex-shrink-0 ${
                        insight.type === 'Threat' ? 'bg-red-500' : insight.type === 'Opportunity' ? 'bg-green-500' : 'bg-blue-500'
                      }`}></div>
                      <div>
                        <h4 className="text-sm font-black text-gray-900 mb-1">{insight.title}</h4>
                        <p className="text-sm text-gray-500 leading-relaxed">{insight.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
            </section>
          </div>

          <div className="space-y-8">
            <div className="bg-gray-900 rounded-2xl p-6 text-white shadow-2xl">
              <h3 className="text-xs font-black uppercase tracking-widest text-red-500 mb-6">Evidence Index</h3>
              <p className="text-[10px] text-gray-400 mb-4 leading-normal italic">
                *The links below represent the digital footprint crawled in real-time from official PR hubs, financial reports, and industry publications.
              </p>
              <ul className="space-y-4">
                {relevantLinks.map((link, idx) => (
                  <li key={idx}>
                    <a href={link.uri} target="_blank" rel="noopener noreferrer" className="block p-4 bg-white/5 rounded-xl hover:bg-white/10 border border-white/5 transition">
                      <p className="text-xs font-bold text-white truncate mb-1">{link.title || link.uri}</p>
                      <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">{new URL(link.uri).hostname}</p>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
               <h4 className="text-xs font-black text-red-900 uppercase tracking-widest mb-4">Analyst Summary</h4>
               <p className="text-xs text-red-800 leading-relaxed">
                 {decodedName}'s AI strategy is currently characterized by high operational intensity in the digital sector. Their ability to integrate legacy data into new AI models remains a key competitive differentiator.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitorDetail;
