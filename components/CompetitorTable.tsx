
import React from 'react';
import { Link } from 'react-router-dom';
import { CompetitorMove } from '../types';

interface CompetitorTableProps {
  data: CompetitorMove[];
  onDownload: () => void;
}

const CompetitorTable: React.FC<CompetitorTableProps> = ({ data, onDownload }) => {
  // Sort data by date descending (newest first)
  const sortedData = [...data].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();

    // Handle non-standard date strings (like "Recent" or "Q1 2024")
    // If parsing fails, we fallback to string comparison or keep original order
    const valA = isNaN(dateA) ? (a.date.toLowerCase() === 'recent' ? Infinity : 0) : dateA;
    const valB = isNaN(dateB) ? (b.date.toLowerCase() === 'recent' ? Infinity : 0) : dateB;

    return valB - valA;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Competitor AI Advancements</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Ordered by Recency</p>
        </div>
        <button
          onClick={onDownload}
          className="flex items-center space-x-2 bg-white border border-gray-300 px-3 py-1.5 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>Download CSV</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sector</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Move / Product Summary</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Source</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">
                  No records found.
                </td>
              </tr>
            ) : (
              sortedData.map((move) => (
                <tr key={move.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link 
                      to={`/competitor/${encodeURIComponent(move.company)}`} 
                      className="font-bold text-gray-900 hover:text-red-600 hover:underline transition"
                    >
                      {move.company}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      move.sector === 'Marketing' ? 'bg-blue-100 text-blue-800' :
                      move.sector === 'Sales' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {move.sector}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 line-clamp-2 max-w-md">{move.summary}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">
                    {move.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <a 
                      href={move.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                    >
                      <span>View Link</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompetitorTable;
