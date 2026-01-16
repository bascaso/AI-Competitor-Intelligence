import { GoogleGenAI } from "@google/genai";
import { CompetitorMove, GroundingLink, StrategicInsight, RadarData, DashboardData, PESTELData, SWOTData } from "../types";
import { HILTI_COMPETITORS } from "../constants";

export const fetchCompetitorIntelligence = async (): Promise<DashboardData> => {
  // CRITICAL: Always use new GoogleGenAI({ apiKey: process.env.API_KEY }) right before making an API call.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-pro-preview";
  
  const competitorsString = HILTI_COMPETITORS.join(", ");
  const currentFullDate = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric', day: 'numeric' });
  
  const prompt = `
    TASK: Conduct an exhaustive, high-frequency Strategic Intelligence Audit for Hilti Group's AI Strategy Hub.
    TARGETS: ${competitorsString} AND Hilti (as the global benchmark).
    
    REFERENCE DATE: ${currentFullDate}.
    
    MANDATORY SEARCH PROTOCOL (RECENCY & VOLUME):
    1. RECENCY FIRST: Exclusively target developments from Late 2024 through 2025. Prioritize "breaking news," recent product launches, Q3/Q4 2024 earnings calls, and 2025 strategic roadmaps.
    2. SOURCE EXHAUSTION: Crawl across:
       - Construction specialized press (ENR, Construction Dive, BuiltWorlds, Construction Week).
       - Tech/AI portals (TechCrunch, Wired, AI News).
       - Investor Relations (SEC 10-K/10-Q, Annual Reports, Investor Presentations).
       - Professional forums (Reddit r/construction, LinkedIn Industry News).
    3. EVIDENCE DENSITY: You MUST retrieve and cite at least 20-25 UNIQUE primary source links. The "Verified Evidence Hub" is the core of this report.
    4. MOVE QUANTITY: Map out at least 15-20 distinct AI initiatives (autonomous robotics, generative site planning, predictive fleet analytics, etc.).

    OUTPUT REQUIREMENT:
    Return a strictly formatted JSON object. 
    IMPORTANT: Provide the most up-to-date, accurate URLs available.
    
    {
      "moves": [
        {
          "company": "string", 
          "link": "string (Direct Source URL)", 
          "summary": "Synthesized 2025 strategic analysis of the initiative", 
          "date": "MMM YYYY (Must be 2024 or 2025)", 
          "sector": "Marketing"|"Sales"|"Digital"|"Other"
        }
      ],
      "insights": [
        {"title": "string", "description": "Specific competitive threat or opportunity for Hilti in 2025", "type": "Opportunity"|"Threat"|"Strategic Question"}
      ],
      "radar": [
        {"company": "string", "innovation": 0-100, "impact": 0-100, "risk": 0-100}
      ],
      "pestel": {
        "political": ["2025 outlook string"], "economic": ["2025 outlook string"], "social": ["string"], "technological": ["string"], "environmental": ["string"], "legal": ["string"]
      },
      "swot": {
        "CompanyName": {
          "strengths": ["string"], "weaknesses": ["string"], "opportunities": ["string"], "threats": ["string"]
        }
      }
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1,
      },
    });

    const text = response.text || "";
    
    // Comprehensive extraction of unique grounding links from metadata
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const groundingChunks = groundingMetadata?.groundingChunks || [];
    const linksMap = new Map<string, GroundingLink>();
    
    groundingChunks.forEach((chunk: any) => {
      if (chunk.web && chunk.web.uri) {
        linksMap.set(chunk.web.uri, {
          uri: chunk.web.uri,
          title: chunk.web.title || chunk.web.uri
        });
      }
    });

    const links = Array.from(linksMap.values());

    let dashboardData: DashboardData = {
      moves: [],
      links: links,
      insights: [],
      radar: [],
      pestel: { political: [], economic: [], social: [], technological: [], environmental: [], legal: [] },
      swot: {}
    };

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Enrich moves and ensure links are harvested from JSON as well
        dashboardData = {
          ...dashboardData,
          ...parsed,
          moves: (parsed.moves || []).map((m: any, i: number) => {
            let finalLink = m.link;
            
            // If the move has a link not in our map, add it to the evidence list
            if (finalLink && finalLink !== "#" && !finalLink.includes("example.com")) {
               if (!linksMap.has(finalLink)) {
                  dashboardData.links.push({ uri: finalLink, title: `${m.company} - ${m.summary.substring(0, 30)}...` });
                  linksMap.set(finalLink, { uri: finalLink, title: finalLink });
               }
            } else {
               // Fallback: match from existing grounding links
               const matchingLink = links.find(l => 
                 l.title.toLowerCase().includes(m.company.toLowerCase()) || 
                 l.uri.toLowerCase().includes(m.company.toLowerCase().replace(/\s/g, ''))
               );
               finalLink = matchingLink?.uri || (links[i % (links.length || 1)]?.uri || "#");
            }

            return {
              ...m,
              id: `move-${i}`,
              link: finalLink
            };
          })
        };
      }
    } catch (e) {
      console.error("JSON parsing error during intelligence harvest:", e);
    }

    // Secondary cleanup: remove duplicate links after JSON-based enrichment
    const uniqueLinks: GroundingLink[] = [];
    const seenUris = new Set<string>();
    dashboardData.links.forEach(l => {
      if (!seenUris.has(l.uri)) {
        seenUris.add(l.uri);
        uniqueLinks.push(l);
      }
    });
    dashboardData.links = uniqueLinks;

    return dashboardData;
  } catch (error) {
    console.error("Critical Failure in Competitive Intelligence Audit:", error);
    throw error;
  }
};