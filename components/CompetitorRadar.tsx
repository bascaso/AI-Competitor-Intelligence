import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RadarData } from '../types';

interface CompetitorRadarProps {
  data: RadarData[];
}

const CompetitorRadar: React.FC<CompetitorRadarProps> = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Strategic Innovation Radar</h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">AI-Synthesized Positioning</p>
        </div>
        <div className="flex flex-col items-end space-y-2">
           <span className="flex items-center text-sm text-gray-600 font-bold">
             <span className="w-3.5 h-3.5 rounded-full bg-black mr-2 shadow-sm border border-white"></span> Hilti Baseline
           </span>
           <span className="flex items-center text-sm text-gray-600 font-bold">
             <span className="w-3.5 h-3.5 rounded-full bg-red-600 mr-2 shadow-sm border border-white"></span> Competitors
           </span>
        </div>
      </div>
      
      {/* Radar Grid with increased margins for label visibility */}
      <div className="relative flex-grow min-h-[480px] w-full bg-gray-50 rounded-lg border border-dashed border-gray-300 p-20 overflow-visible mb-10">
        {/* Grid lines */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-200 z-0"></div>
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 z-0"></div>
        
        {/* Main Axes */}
        <div className="absolute bottom-20 left-20 right-20 h-0.5 bg-gray-900/10"></div>
        <div className="absolute top-20 bottom-20 left-20 w-0.5 bg-gray-900/10"></div>
        
        {/* Axis Labels - Positioning adjusted for zero clipping */}
        <div className="absolute bottom-8 right-20 bg-white/80 px-3 py-1 rounded shadow-sm border border-gray-100">
           <span className="text-[11px] text-gray-700 font-black uppercase tracking-wider">Innovation Maturity →</span>
        </div>
        
        <div className="absolute top-1/2 left-4 -rotate-90 origin-center -translate-y-1/2">
           <div className="bg-white/80 px-3 py-1 rounded shadow-sm border border-gray-100">
              <span className="text-[11px] text-gray-700 font-black uppercase tracking-wider whitespace-nowrap">Market Impact →</span>
           </div>
        </div>

        {/* Quadrant Markers */}
        <div className="absolute top-10 right-10 text-[10px] text-gray-400 font-black uppercase opacity-60">Market Leaders</div>
        <div className="absolute bottom-24 right-10 text-[10px] text-gray-400 font-black uppercase opacity-60">Fast Movers</div>
        <div className="absolute top-10 left-24 text-[10px] text-gray-400 font-black uppercase opacity-60">High Potential</div>
        <div className="absolute bottom-24 left-24 text-[10px] text-gray-400 font-black uppercase opacity-60">Niche Experts</div>

        {/* Dynamic Data Points */}
        {data.map((point, idx) => {
          const isHilti = point.company.toLowerCase() === 'hilti';
          const size = Math.max(20, point.risk / 2);
          
          return (
            <div 
              key={idx}
              className={`absolute transition-all duration-700 group cursor-pointer z-10 ${isHilti ? 'z-20' : ''}`}
              style={{ 
                left: `${20 + (point.innovation * 0.60)}%`, 
                bottom: `${20 + (point.impact * 0.60)}%`,
              }}
              onClick={() => navigate(`/competitor/${encodeURIComponent(point.company)}`)}
            >
              <div 
                className={`rounded-full border-2 border-white shadow-xl transition-all group-hover:scale-150 ${
                  isHilti ? 'bg-black ring-4 ring-black/10' : 'bg-red-600 ring-4 ring-red-600/5'
                }`}
                style={{ width: `${size}px`, height: `${size}px` }}
              >
                {isHilti && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
              
              <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-all bg-gray-900 text-white text-[12px] px-4 py-2.5 rounded shadow-2xl whitespace-nowrap z-30 pointer-events-none ${isHilti ? 'border-l-4 border-red-600' : ''}`}>
                <p className={`font-black uppercase tracking-tight ${isHilti ? 'text-red-500' : ''}`}>
                  {point.company} {isHilti ? '(BASELINE)' : ''}
                </p>
                <div className="flex flex-col mt-2 space-y-1.5 opacity-90 border-t border-white/10 pt-2">
                   <div className="flex justify-between space-x-6"><span>Innovation Maturity</span> <span className="font-bold text-red-400">{point.innovation}%</span></div>
                   <div className="flex justify-between space-x-6"><span>Market Footprint</span> <span className="font-bold text-red-400">{point.impact}%</span></div>
                   <div className="flex justify-between space-x-6"><span>Operational Risk</span> <span className="font-bold text-red-400">{point.risk}%</span></div>
                </div>
              </div>
              
              {isHilti && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-[11px] font-black uppercase text-white bg-black px-3 py-1 rounded shadow-lg border border-white/20 whitespace-nowrap">
                  HILTI INTERNAL
                </div>
              )}
            </div>
          );
        })}
        
        {data.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-400 text-base italic font-medium">
            Conducting global market audit...
          </div>
        )}
      </div>
      
      {/* SLIGHTLY SMALLER Strategy Methodology Section */}
      <div className="p-8 bg-gray-900 rounded-2xl text-white border-l-4 border-red-600 shadow-xl">
        <div className="flex items-center mb-6">
           <div className="bg-red-600/10 p-2.5 rounded-lg mr-4 border border-red-600/20">
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/></svg>
           </div>
           <div>
              <h4 className="text-sm font-black uppercase tracking-widest text-red-500 italic">Strategic Hub Methodology</h4>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">AI-Driven Synthesis v2.5</p>
           </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group border-l border-white/5 pl-5">
            <h5 className="text-[11px] font-black text-white uppercase tracking-widest mb-2 group-hover:text-red-500 transition-colors">X: Innovation Maturity</h5>
            <p className="text-sm text-gray-400 leading-relaxed font-medium">
              Calculated via <span className="text-gray-200">TRL levels</span>, patent density analysis, and technical stability of 2025 AI roadmaps.
            </p>
          </div>
          
          <div className="group border-l border-white/5 pl-5">
            <h5 className="text-[11px] font-black text-white uppercase tracking-widest mb-2 group-hover:text-red-500 transition-colors">Y: Market Impact</h5>
            <p className="text-sm text-gray-400 leading-relaxed font-medium">
              Composite score of <span className="text-gray-200">customer reach</span> and global distribution scale in construction digitalization.
            </p>
          </div>
          
          <div className="group border-l border-white/5 pl-5">
            <h5 className="text-[11px] font-black text-white uppercase tracking-widest mb-2 group-hover:text-red-500 transition-colors">Size: Execution Risk</h5>
            <p className="text-sm text-gray-400 leading-relaxed font-medium">
              Quantifies <span className="text-gray-200">organizational friction</span> and legacy barriers to rapid AI deployment.
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
           <div className="flex items-center space-x-3">
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Integrity:</span>
              <span className="flex items-center text-[10px] font-bold text-green-500/80">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                Grounding Active
              </span>
           </div>
           <p className="text-[10px] text-gray-500 font-medium italic text-right">
             Synthesis of available market signals as of {new Date().toLocaleDateString()}.
           </p>
        </div>
      </div>
    </div>
  );
};

export default CompetitorRadar;