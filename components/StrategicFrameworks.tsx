
import React from 'react';
import { PESTELData, SWOTData } from '../types';

export const PESTELSection: React.FC<{ data: PESTELData }> = ({ data }) => {
  const items = [
    { label: 'Political', items: data.political, color: 'bg-blue-100 text-blue-800' },
    { label: 'Economic', items: data.economic, color: 'bg-green-100 text-green-800' },
    { label: 'Social', items: data.social, color: 'bg-yellow-100 text-yellow-800' },
    { label: 'Technological', items: data.technological, color: 'bg-purple-100 text-purple-800' },
    { label: 'Environmental', items: data.environmental, color: 'bg-teal-100 text-teal-800' },
    { label: 'Legal', items: data.legal, color: 'bg-gray-100 text-gray-800' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50/50">
        <h3 className="text-lg font-bold text-gray-900">PESTEL Market Analysis</h3>
        <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">AI Construction Macro-Environment</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-x divide-y divide-gray-100">
        {items.map((cat, i) => (
          <div key={i} className="p-5 hover:bg-gray-50 transition">
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-widest ${cat.color} mb-3 inline-block`}>
              {cat.label}
            </span>
            <ul className="space-y-2">
              {cat.items.map((item, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-start">
                  <span className="text-red-500 mr-2 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
              {cat.items.length === 0 && <li className="text-xs text-gray-400 italic">No data identified.</li>}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SWOTSection: React.FC<{ data: SWOTData; company: string }> = ({ data, company }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-900">SWOT Matrix</h3>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Specific to {company} AI Capability</p>
        </div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Internal / External View</span>
      </div>
      <div className="grid grid-cols-2">
        <div className="p-6 border-r border-b border-gray-100 bg-green-50/20">
          <h4 className="text-sm font-black uppercase text-green-700 mb-4 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
            Strengths
          </h4>
          <ul className="space-y-2 text-sm text-gray-700">
            {data.strengths.map((s, i) => <li key={i}>• {s}</li>)}
          </ul>
        </div>
        <div className="p-6 border-b border-gray-100 bg-red-50/20">
          <h4 className="text-sm font-black uppercase text-red-700 mb-4 flex items-center">
             <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"/></svg>
             Weaknesses
          </h4>
          <ul className="space-y-2 text-sm text-gray-700">
            {data.weaknesses.map((w, i) => <li key={i}>• {w}</li>)}
          </ul>
        </div>
        <div className="p-6 border-r border-gray-100 bg-blue-50/20">
          <h4 className="text-sm font-black uppercase text-blue-700 mb-4 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Opportunities
          </h4>
          <ul className="space-y-2 text-sm text-gray-700">
            {data.opportunities.map((o, i) => <li key={i}>• {o}</li>)}
          </ul>
        </div>
        <div className="p-6 bg-orange-50/20">
          <h4 className="text-sm font-black uppercase text-orange-700 mb-4 flex items-center">
             <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
             Threats
          </h4>
          <ul className="space-y-2 text-sm text-gray-700">
            {data.threats.map((t, i) => <li key={i}>• {t}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
};
