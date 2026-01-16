import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Header from './components/Header';
import CompetitorTable from './components/CompetitorTable';
import CompetitorRadar from './components/CompetitorRadar';
import StrategyInsights from './components/StrategyInsights';
import CompetitorDetail from './components/CompetitorDetail';
import StrategicAIPulse from './components/StrategicAIPulse';
import { PESTELSection } from './components/StrategicFrameworks';
import { fetchCompetitorIntelligence } from './services/geminiService';
import { CompetitorMove, AppStatus, GroundingLink, StrategicInsight, RadarData, PESTELData, SWOTData } from './types';

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
  handleDownloadPDF: () => void;
}> = ({ status, data, insights, radar, pestel, groundingLinks, error, loadData, handleDownloadCSV, handleDownloadPDF }) => {
  if (status === AppStatus.LOADING) {
    return (
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-20 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-[#d2051e] rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-2 italic">Auditing Market Signals</h2>
        <p className="text-gray-400 font-medium max-w-sm">Synthesizing signals from global construction news, financial reports, and community forums...</p>
      </main>
    );
  }

  if (status === AppStatus.ERROR) {
    return (
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-20 text-center">
        <div className="bg-red-50 p-8 rounded-2xl border border-red-100 max-w-xl mx-auto">
          <svg className="w-12 h-12 text-[#d2051e] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <h2 className="text-xl font-black text-red-900 mb-2">Connectivity Error</h2>
          <p className="text-red-700 text-sm mb-6">{error || "Failed to reach the intelligence engine."}</p>
          <button onClick={loadData} className="bg-[#d2051e] text-white px-8 py-3 rounded font-black uppercase text-xs tracking-widest hover:bg-black transition-colors">Retry Intelligence Audit</button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 fade-in">
      {/* AI Content Disclaimer */}
      <div className="mb-6 px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center text-center shadow-sm">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center">
          <svg className="w-3.5 h-3.5 mr-2 text-[#d2051e]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          ADVISORY: Results are AI-generated based on digital footprints and may not be complete or exhaustive.
        </span>
      </div>

      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 mb-3">
             <span className="bg-[#d2051e] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-tighter italic">Hilti Confidential</span>
             <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">• Strategic Intelligence Hub</span>
          </div>
          <h2 className="text-5xl font-[900] text-gray-900 tracking-tighter mb-2">AI Competitive Hub</h2>
          <p className="text-lg text-gray-500 max-w-2xl leading-relaxed font-medium">
            Real-time tracking of global construction AI advancements through our multi-source intelligence protocol.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleDownloadPDF} 
            className="px-6 py-3 bg-[#d2051e] text-white rounded font-black uppercase text-xs tracking-widest hover:bg-black transition-all flex items-center shadow-md"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
            Download as PDF
          </button>
          <button onClick={loadData} className="px-8 py-3 bg-black text-white rounded font-black uppercase text-xs tracking-widest hover:bg-[#d2051e] transition-all">Refresh Signals</button>
        </div>
      </div>

      <StrategicAIPulse />

      <div className="space-y-12">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-8">
            <CompetitorRadar data={radar} />
          </div>
          <div className="xl:col-span-4">
             <StrategyInsights insights={insights} />
          </div>
        </div>

        <div id="reports-analysis">
          <PESTELSection data={pestel} />
        </div>

        <div id="competitors-list" className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-9">
            <CompetitorTable data={data} onDownload={handleDownloadCSV} />
          </div>
          <div className="xl:col-span-3">
             <div className="bg-gray-900 p-6 rounded-2xl sticky top-24 shadow-2xl">
                <h3 className="text-xs font-black text-red-500 uppercase tracking-widest mb-6">Verified Evidence</h3>
                <ul className="space-y-4">
                  {groundingLinks.length > 0 ? (
                    groundingLinks.slice(0, 10).map((link, i) => (
                      <li key={i}>
                        <a href={link.uri} target="_blank" rel="noopener noreferrer" className="block p-3 bg-white/5 border border-white/5 rounded-lg hover:bg-white/10 transition">
                          <p className="text-[10px] font-bold text-white truncate mb-1">{link.title || link.uri}</p>
                          <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest">
                            {link.uri.startsWith('http') ? new URL(link.uri).hostname : 'Source'}
                          </p>
                        </a>
                      </li>
                    ))
                  ) : (
                    <li className="text-[10px] text-gray-500 italic">Initiating market crawl...</li>
                  )}
                </ul>
             </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [data, setData] = useState<CompetitorMove[]>([]);
  const [insights, setInsights] = useState<StrategicInsight[]>([]);
  const [radar, setRadar] = useState<RadarData[]>([]);
  const [pestel, setPestel] = useState<PESTELData>({ political: [], economic: [], social: [], technological: [], environmental: [], legal: [] });
  const [swot, setSwot] = useState<Record<string, SWOTData>>({});
  const [groundingLinks, setGroundingLinks] = useState<GroundingLink[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setStatus(AppStatus.LOADING);
    setError(null);
    try {
      const result = await fetchCompetitorIntelligence();
      setData(result.moves || []);
      setInsights(result.insights || []);
      setRadar(result.radar || []);
      setPestel(result.pestel || { political: [], economic: [], social: [], technological: [], environmental: [], legal: [] });
      setSwot(result.swot || {});
      setGroundingLinks(result.links || []);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Intelligence engine unavailable. Verify API_KEY environment variable.");
      setStatus(AppStatus.ERROR);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDownloadCSV = () => {
    if (data.length === 0) return;
    const headers = ["Company", "Sector", "Summary", "Date", "Link"];
    const csvContent = [headers.join(","), ...data.map(m => [`"${m.company}"`, `"${m.sector}"`, `"${m.summary.replace(/"/g, '""')}"`, `"${m.date}"`, `"${m.link}"`].join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hilti_market_intel_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header Styling (Hilti Red)
    doc.setFillColor(210, 5, 30); // #d2051e
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.text("HILTI", 15, 28);
    
    doc.setFontSize(14);
    doc.text("Strategic Intelligence Full Briefing", 15, 38);
    
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.text(`CONFIDENTIAL - Generated: ${new Date().toLocaleString()}`, pageWidth - 15, 55, { align: 'right' });

    // AI Disclaimer at top of PDF
    doc.setFillColor(245, 245, 245);
    doc.rect(15, 58, pageWidth - 30, 8, 'F');
    doc.setTextColor(120, 120, 120);
    doc.setFontSize(7);
    doc.setFont("helvetica", "italic");
    doc.text("ADVISORY: Results are AI-generated from digital footprints and may not be complete or exhaustive.", pageWidth / 2, 63, { align: 'center' });

    // Section 1: Strategic Pulse
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("1. Executive Strategic Pulse", 15, 75);
    
    const pulseTableData = [
      ['Sector AI Aggression', 'Extreme', 'Accelerated tool launches and future roadmaps.'],
      ['Market Sentiment', 'Positive', 'Users report efficiency gains in automated layouts.'],
      ['Digital Maturity', '44%', 'Industry-wide digital adoption benchmark.'],
      ['Response Priority', 'High', 'Recommended priority for Hilti digitalization fleet.']
    ];

    autoTable(doc, {
      startY: 82,
      head: [['Metric', 'Status', 'Strategic Context']],
      body: pulseTableData,
      theme: 'grid',
      headStyles: { fillColor: [210, 5, 30] },
      styles: { fontSize: 9 },
      margin: { horizontal: 15 }
    });

    // Section 2: PESTEL Macro Analysis
    let currentY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(16);
    doc.text("2. PESTEL Market Environment", 15, currentY);
    
    const pestelTableData = [
      ['Political', pestel.political.join(', ') || 'No data identified.'],
      ['Economic', pestel.economic.join(', ') || 'No data identified.'],
      ['Social', pestel.social.join(', ') || 'No data identified.'],
      ['Technological', pestel.technological.join(', ') || 'No data identified.'],
      ['Environmental', pestel.environmental.join(', ') || 'No data identified.'],
      ['Legal', pestel.legal.join(', ') || 'No data identified.'],
    ];

    autoTable(doc, {
      startY: currentY + 7,
      head: [['Category', 'Synthesized Market Signals']],
      body: pestelTableData,
      theme: 'grid',
      headStyles: { fillColor: [33, 33, 33] },
      styles: { fontSize: 9 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 } },
      margin: { horizontal: 15 }
    });

    // Section 3: Innovation Radar & Strategic Insights
    currentY = (doc as any).lastAutoTable.finalY + 15;
    if (currentY > 250) { doc.addPage(); currentY = 20; }
    
    doc.setFontSize(16);
    doc.text("3. Innovation Radar & Positioning", 15, currentY);
    
    const radarTableData = radar.map(r => [r.company, `${r.innovation}%`, `${r.impact}%`, `${r.risk}%`]);
    autoTable(doc, {
      startY: currentY + 7,
      head: [['Company', 'Innovation Maturity', 'Market Impact', 'Execution Risk']],
      body: radarTableData,
      theme: 'striped',
      headStyles: { fillColor: [210, 5, 30] },
      styles: { fontSize: 9 },
      margin: { horizontal: 15 }
    });

    currentY = (doc as any).lastAutoTable.finalY + 15;
    if (currentY > 250) { doc.addPage(); currentY = 20; }
    
    const insightRows = insights.map(i => [i.type, i.title, i.description]);
    autoTable(doc, {
      startY: currentY + 7,
      head: [['Type', 'Insight Title', 'Description & Strategic Impact']],
      body: insightRows,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [33, 33, 33] },
      margin: { horizontal: 15 }
    });

    // Section 4: Competitor Strategic Moves Table (RANKED BY DATE)
    doc.addPage();
    currentY = 20;
    doc.setFontSize(16);
    doc.text("4. Detailed Competitor AI Initiatives", 15, currentY);
    doc.setFontSize(10);
    doc.text("Sorted by Recency (Newest First)", 15, currentY + 6);

    // Strict Date Sorting for PDF
    const sortedMoves = [...data].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      const valA = isNaN(dateA) ? (a.date.toLowerCase() === 'recent' ? Infinity : 0) : dateA;
      const valB = isNaN(dateB) ? (b.date.toLowerCase() === 'recent' ? Infinity : 0) : dateB;
      return valB - valA;
    });

    const moveRows = sortedMoves.map(m => [
      m.company, 
      m.sector, 
      m.summary, 
      m.date
    ]);

    autoTable(doc, {
      startY: currentY + 12,
      head: [['Company', 'Sector', 'Strategic Initiative Summary', 'Timing']],
      body: moveRows,
      theme: 'striped',
      headStyles: { fillColor: [210, 5, 30] },
      styles: { fontSize: 8 },
      columnStyles: { 2: { cellWidth: 90 } },
      margin: { horizontal: 15 }
    });

    // Section 5: Verified Evidence Index
    currentY = (doc as any).lastAutoTable.finalY + 15;
    if (currentY > 240) { doc.addPage(); currentY = 20; }
    
    doc.setFontSize(16);
    doc.text("5. Evidence Index & References", 15, currentY);
    
    const evidenceRows = groundingLinks.map(l => [l.title || 'Source Citation', l.uri]);
    autoTable(doc, {
      startY: currentY + 7,
      head: [['Reference Title', 'Direct Verification Link']],
      body: evidenceRows,
      theme: 'grid',
      styles: { fontSize: 7, overflow: 'ellipsize' },
      headStyles: { fillColor: [33, 33, 33] },
      margin: { horizontal: 15 }
    });

    // Footer with Page Numbers
    const totalPages = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Hilti Strategic Intelligence Unit - Internal - Page ${i} of ${totalPages}`, pageWidth / 2, 285, { align: 'center' });
    }

    doc.save(`Hilti_Full_Competitive_AI_Briefing_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-[#f9fafb]">
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard status={status} data={data} insights={insights} radar={radar} pestel={pestel} groundingLinks={groundingLinks} error={error} loadData={loadData} handleDownloadCSV={handleDownloadCSV} handleDownloadPDF={handleDownloadPDF} />} />
          <Route path="/competitor/:companyName" element={<CompetitorDetail moves={data} insights={insights} links={groundingLinks} swot={swot} />} />
        </Routes>
        <footer className="bg-white border-t border-gray-100 py-12 mt-20 text-center">
           <div className="inline-block py-2 mb-4 transition-transform hover:scale-105">
              <span className="text-[#d2051e] text-2xl font-[900] tracking-tighter uppercase select-none">
                HILTI
              </span>
           </div>
           <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Global Strategic Intelligence Hub • Hilti Group Internal Only</p>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;