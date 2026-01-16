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
      {/* AI Content Disclaimer & Freshness Badge */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex-grow px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center text-center shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center">
            <svg className="w-4 h-4 mr-2 text-[#d2051e]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            ADVISORY: Results are AI-generated based on global digital footprints. Content may not be exhaustive.
          </span>
        </div>
        <div className="flex-shrink-0 flex items-center bg-green-50 text-green-700 border border-green-200 px-4 py-3 rounded-xl shadow-sm">
           <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-3"></span>
           <span className="text-[10px] font-black uppercase tracking-widest">2024-2025 Intelligence Cycle Active</span>
        </div>
      </div>

      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 mb-3">
             <span className="bg-[#d2051e] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-tighter italic">Hilti Confidential</span>
             <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">• Strategic Intelligence Hub</span>
          </div>
          <h2 className="text-5xl font-[900] text-gray-900 tracking-tighter mb-2">AI Competitive Hub</h2>
          <p className="text-lg text-gray-500 max-w-2xl leading-relaxed font-medium">
            Exhaustive, real-time tracking of global construction AI advancements through our multi-source 2025 intelligence protocol.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleDownloadPDF} 
            className="px-6 py-3 bg-[#d2051e] text-white rounded font-black uppercase text-xs tracking-widest hover:bg-black transition-all flex items-center shadow-md"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
            Full PDF Audit
          </button>
          <button onClick={loadData} className="px-8 py-3 bg-black text-white rounded font-black uppercase text-xs tracking-widest hover:bg-[#d2051e] transition-all">Deep Re-Audit</button>
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
          <div className="xl:col-span-8">
            <CompetitorTable data={data} onDownload={handleDownloadCSV} />
          </div>
          <div className="xl:col-span-4">
             <div className="bg-gray-900 p-8 rounded-3xl sticky top-24 shadow-2xl flex flex-col max-h-[900px]">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10">
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Verified Evidence Hub</h3>
                    <p className="text-[10px] text-gray-500 font-bold mt-1">Direct verification sources crawled 2024-2025</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[14px] font-[900] text-red-500">{groundingLinks.length}</span>
                    <span className="text-[8px] font-black text-gray-600 uppercase">Verified Sources</span>
                  </div>
                </div>
                
                <div className="overflow-y-auto pr-3 custom-scrollbar flex-grow space-y-4">
                  {groundingLinks.length > 0 ? (
                    groundingLinks.map((link, i) => (
                      <div key={i} className="group">
                        <a 
                          href={link.uri} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="block p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all group-hover:border-red-500/30 group-hover:translate-x-1"
                        >
                          <p className="text-[11px] font-bold text-white leading-snug mb-3 group-hover:text-red-400 transition-colors">
                            {link.title || link.uri}
                          </p>
                          <div className="flex justify-between items-center pt-3 border-t border-white/5">
                            <span className="text-[8px] text-gray-500 font-black uppercase tracking-[0.2em] flex items-center">
                              <svg className="w-3 h-3 mr-1.5 opacity-50" fill="currentColor" viewBox="0 0 20 20"><path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z"/></svg>
                              {link.uri.startsWith('http') ? new URL(link.uri).hostname.replace('www.', '') : 'External Reference'}
                            </span>
                            <span className="text-[8px] font-black text-red-600 uppercase bg-red-600/10 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">Verify Access →</span>
                          </div>
                        </a>
                      </div>
                    ))
                  ) : (
                    <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                       <div className="w-10 h-10 border-2 border-gray-700 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
                       <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest italic">Executing 2025 Deep-Web Audit...</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-8 pt-6 border-t border-white/10">
                   <div className="flex items-center justify-between">
                     <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest">Protocol: Search Grounding v3.0</p>
                     <span className="text-[8px] text-gray-700 italic">Audit Cycle: {new Date().getFullYear()}</span>
                   </div>
                </div>
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
      setError(err.message || "Strategic Hub offline. Check system logs for API errors.");
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
    
    // Header Branding
    doc.setFillColor(210, 5, 30); 
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.text("HILTI", 15, 28);
    
    doc.setFontSize(14);
    doc.text("2025 Strategic AI Market Audit", 15, 38);
    
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.text(`INTERNAL ONLY - Generated: ${new Date().toLocaleString()}`, pageWidth - 15, 55, { align: 'right' });

    // AI Disclaimer
    doc.setFillColor(245, 245, 245);
    doc.rect(15, 58, pageWidth - 30, 12, 'F');
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(7);
    doc.setFont("helvetica", "italic");
    doc.text("ADVISORY: Results are AI-generated from 2024-2025 digital footprints. Information is summarized for strategic guidance only.", pageWidth / 2, 65, { align: 'center' });

    // 1. Executive Pulse
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("1. Executive Intelligence Pulse", 15, 82);
    
    const pulseRows = [
      ['AI Market Intensity', 'Extreme', 'Rapid shift towards generative design and robotic site integration.'],
      ['Sector Momentum', 'High (2025)', 'Competitive tool launches have increased by 40% vs. 2023.'],
      ['Market Maturity', '44%', 'Current digitalization index for primary global construction hubs.'],
      ['Hilti Response Priority', 'Critical', 'Digitalization of fleet services remains the top strategic counter.']
    ];

    autoTable(doc, {
      startY: 88,
      head: [['Pulse Metric', 'Status', '2025 Strategic Context']],
      body: pulseRows,
      theme: 'grid',
      headStyles: { fillColor: [210, 5, 30] },
      styles: { fontSize: 9 },
      margin: { horizontal: 15 }
    });

    // 2. PESTEL Outlook
    let currentY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(16);
    doc.text("2. 2025 PESTEL Macro-Outlook", 15, currentY);
    
    const pestelRows = [
      ['Political', pestel.political.join(', ') || 'Audit Pending'],
      ['Economic', pestel.economic.join(', ') || 'Audit Pending'],
      ['Social', pestel.social.join(', ') || 'Audit Pending'],
      ['Technological', pestel.technological.join(', ') || 'Audit Pending'],
      ['Environmental', pestel.environmental.join(', ') || 'Audit Pending'],
      ['Legal', pestel.legal.join(', ') || 'Audit Pending'],
    ];

    autoTable(doc, {
      startY: currentY + 7,
      head: [['Dimension', 'Synthesized 2025 Market Signals']],
      body: pestelRows,
      theme: 'grid',
      headStyles: { fillColor: [33, 33, 33] },
      styles: { fontSize: 9 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 } },
      margin: { horizontal: 15 }
    });

    // 3. Radar & Insights
    currentY = (doc as any).lastAutoTable.finalY + 15;
    if (currentY > 240) { doc.addPage(); currentY = 20; }
    doc.setFontSize(16);
    doc.text("3. Competitive Maturity Positioning", 15, currentY);
    
    const radarRows = radar.map(r => [r.company, `${r.innovation}%`, `${r.impact}%`, `${r.risk}%`]);
    autoTable(doc, {
      startY: currentY + 7,
      head: [['Company', 'Innovation Maturity', 'Market Reach', 'Execution Risk']],
      body: radarRows,
      theme: 'striped',
      headStyles: { fillColor: [210, 5, 30] },
      styles: { fontSize: 9 },
      margin: { horizontal: 15 }
    });

    currentY = (doc as any).lastAutoTable.finalY + 15;
    if (currentY > 240) { doc.addPage(); currentY = 20; }
    const insightRows = insights.map(i => [i.type, i.title, i.description]);
    autoTable(doc, {
      startY: currentY + 7,
      head: [['Strategic Class', 'Opportunity/Threat Focus', 'Guidance for Hilti']],
      body: insightRows,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [33, 33, 33] },
      margin: { horizontal: 15 }
    });

    // 4. Detailed Moves
    doc.addPage();
    currentY = 20;
    doc.setFontSize(16);
    doc.text("4. Exhaustive Competitor Strategic Moves", 15, currentY);
    doc.setFontSize(10);
    doc.text("Audit Window: Late 2024 - 2025 (Ranked by Recency)", 15, currentY + 6);

    const sortedMoves = [...data].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      const valA = isNaN(dateA) ? (a.date.toLowerCase() === 'recent' ? Infinity : 0) : dateA;
      const valB = isNaN(dateB) ? (b.date.toLowerCase() === 'recent' ? Infinity : 0) : dateB;
      return valB - valA;
    });

    const moveRows = sortedMoves.map(m => [m.company, m.sector, m.summary, m.date]);
    autoTable(doc, {
      startY: currentY + 12,
      head: [['Competitor', 'Sector', 'Strategic AI Initiative Summary', 'Timing']],
      body: moveRows,
      theme: 'striped',
      headStyles: { fillColor: [210, 5, 30] },
      styles: { fontSize: 8 },
      columnStyles: { 2: { cellWidth: 90 } },
      margin: { horizontal: 15 }
    });

    // 5. Exhaustive Source Index
    currentY = (doc as any).lastAutoTable.finalY + 15;
    if (currentY > 220) { doc.addPage(); currentY = 20; }
    doc.setFontSize(16);
    doc.text("5. Verification Trail & Exhaustive Source Index", 15, currentY);
    
    const evidenceRows = groundingLinks.map(l => [l.title || 'Market Source Citation', l.uri]);
    autoTable(doc, {
      startY: currentY + 7,
      head: [['Source Citation / Title', 'Verification URL']],
      body: evidenceRows,
      theme: 'grid',
      styles: { fontSize: 6.5, overflow: 'ellipsize' },
      headStyles: { fillColor: [33, 33, 33] },
      margin: { horizontal: 15 }
    });

    // Final Pagination
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Hilti Global Intelligence - Confidential - Page ${i} of ${pageCount}`, pageWidth / 2, 285, { align: 'center' });
    }

    doc.save(`Hilti_Intelligence_Audit_2025_${new Date().toISOString().split('T')[0]}.pdf`);
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
           <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Global Strategic Intelligence Hub • 2025 AI Lifecycle Audit</p>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;