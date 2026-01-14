
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RadarData } from '../types';

interface CompetitorRadarProps {
  data: RadarData[];
}

const CompetitorRadar: React.FC<CompetitorRadarProps> = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Strategic Innovation Radar</h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Triple-Axis: Maturity, Impact, Risk</p>
        </div>
        <div className="flex flex-col items-end space-y-1">
           <span className="flex items-center text-[10px] text-gray-500">
             <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span> Impact (Y)
           </span>
           <span className="flex items-center text-[10px] text-gray-500">
             <span className="w-2 h-2 rounded-full border border-red-500 mr-1"></span> Maturity (X)
           </span>
           <span className="flex items-center text-[10px] text-gray-500">
             <span className="w-2 h-2 rounded-full bg-gray-200 mr-1"></span> Size = Execution Risk
           </span>
        </div>
      </div>
      
      <div className="relative flex-grow min-h-[300px] w-full bg-gray-50 rounded-lg border border-dashed border-gray-300 p-8 overflow-hidden">
        {/* Quadrant Lines */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-200"></div>
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200"></div>
        
        {/* Axes */}
        <div className="absolute bottom-8 left-8 right-8 h-px bg-gray-900/10"></div>
        <div className="absolute top-8 bottom-8 left-8 w-px bg-gray-900/10"></div>
        
        {/* Labels */}
        <span className="absolute bottom-2 right-8 text-[9px] text-gray-400 font-black uppercase tracking-widest">Innovation Maturity →</span>
        <span className="absolute top-8 left-2 text-[9px] text-gray-400 font-black uppercase -rotate-90 origin-top-left translate-y-full tracking-widest">Market Impact →</span>

        {/* Quadrant Titles */}
        <div className="absolute top-4 right-4 text-[9px] text-gray-400 font-black uppercase opacity-60">Leaders (High maturity/impact)</div>
        <div className="absolute bottom-10 right-4 text-[9px] text-gray-400 font-black uppercase opacity-60">Fast Movers</div>
        <div className="absolute top-4 left-10 text-[9px] text-gray-400 font-black uppercase opacity-60">High-Potential Startups</div>
        <div className="absolute bottom-10 left-10 text-[9px] text-gray-400 font-black uppercase opacity-60">Niche Specialists</div>

        {/* Data Points */}
        {data.map((point, idx) => {
          // Normalize size based on risk
          const size = Math.max(12, point.risk / 3);
          return (
            <div 
              key={idx}
              className="absolute transition-all duration-1000 group cursor-pointer z-10"
              style={{ 
                left: `${8 + (point.innovation * 0.84)}%`, 
                bottom: `${8 + (point.impact * 0.84)}%`,
              }}
              onClick={() => navigate(`/competitor/${encodeURIComponent(point.company)}`)}
            >
              <div 
                className="bg-red-600 rounded-full border-2 border-white shadow-xl group-hover:bg-black transition-all group-hover:scale-125"
                style={{ width: `${size}px`, height: `${size}px` }}
              ></div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-[10px] px-2 py-1.5 rounded-md shadow-2xl whitespace-nowrap z-20 transition-all pointer-events-none">
                <p className="font-bold">{point.company}</p>
                <p className="text-gray-400 text-[8px]">Risk: {point.risk}% | Click for profile</p>
              </div>
            </div>
          );
        })}
        
        {data.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm italic">
            Gathering signals for strategic mapping...
          </div>
        )}
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 border-l-2 border-red-500 rounded-r">
        <p className="text-[11px] text-gray-600 leading-tight">
          <strong>Explainability:</strong> Points in the <span className="text-red-600 font-bold">Upper Right</span> represent direct threats with proven maturity. Point size correlates to execution risk; larger bubbles indicate complex strategies that may take longer to reach full market scale.
        </p>
      </div>
    </div>
  );
};

export default CompetitorRadar;
