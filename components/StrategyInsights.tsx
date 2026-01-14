
import React from 'react';
import { StrategicInsight } from '../types';

interface StrategyInsightsProps {
  insights: StrategicInsight[];
}

const StrategyInsights: React.FC<StrategyInsightsProps> = ({ insights }) => {
  return (
    <div className="bg-[#212121] text-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-800">
        <h3 className="text-xl font-bold flex items-center">
          <svg className="w-6 h-6 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          AI Strategic Positioning Matrix
        </h3>
        <p className="text-gray-400 text-sm mt-1">Hilti-focused competitive response framework.</p>
      </div>
      
      <div className="divide-y divide-gray-800">
        {insights.map((insight, idx) => (
          <div key={idx} className="p-6 hover:bg-gray-800/50 transition cursor-default">
            <div className="flex items-start">
              <span className={`mt-1 mr-3 flex-shrink-0 w-2 h-2 rounded-full ${
                insight.type === 'Threat' ? 'bg-red-500' : 
                insight.type === 'Opportunity' ? 'bg-green-500' : 'bg-blue-500'
              }`}></span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 block">
                  {insight.type}
                </span>
                <h4 className="text-sm font-bold mb-1">{insight.title}</h4>
                <p className="text-sm text-gray-400 leading-relaxed">{insight.description}</p>
              </div>
            </div>
          </div>
        ))}
        
        {insights.length === 0 && (
          <div className="p-8 text-center text-gray-500 text-sm italic">
            Analyzing market signals for strategic insights...
          </div>
        )}
      </div>
    </div>
  );
};

export default StrategyInsights;
