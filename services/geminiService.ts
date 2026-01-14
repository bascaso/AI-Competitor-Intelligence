
import { GoogleGenAI } from "@google/genai";
import { CompetitorMove, GroundingLink, StrategicInsight, RadarData, DashboardData, PESTELData, SWOTData } from "../types";
import { HILTI_COMPETITORS } from "../constants";

// The API key is injected by Vite during the build process
const API_KEY = process.env.API_KEY || '';

export const fetchCompetitorIntelligence = async (): Promise<DashboardData> => {
  if (!API_KEY || API_KEY === 'undefined') {
    throw new Error("API_KEY is missing. Please set it in the AWS Amplify Environment Variables.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const model = "gemini-3-flash-preview";
  
  const competitorsString = HILTI_COMPETITORS.join(", ");
  const prompt = `
    As a market intelligence analyst for Hilti, perform a deep dive into AI-driven initiatives by: ${competitorsString}.
    
    REQUIRED OUTPUT STRUCTURE (JSON ONLY, no preamble):
    {
      "moves": [
        {"company": "string", "link": "string", "summary": "string", "date": "string", "sector": "Marketing"|"Sales"|"Digital"|"Other"}
      ],
      "insights": [
        {"title": "string", "description": "string", "type": "Opportunity"|"Threat"|"Strategic Question"}
      ],
      "radar": [
        {"company": "string", "innovation": 0-100, "impact": 0-100, "risk": 0-100}
      ],
      "pestel": {
        "political": ["string"],
        "economic": ["string"],
        "social": ["string"],
        "technological": ["string"],
        "environmental": ["string"],
        "legal": ["string"]
      },
      "swot": {
        "CompanyName": {
          "strengths": ["string"],
          "weaknesses": ["string"],
          "opportunities": ["string"],
          "threats": ["string"]
        }
      }
    }
    
    Ensure moves include REAL verifiable URLs. Use search grounding for current facts.
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
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const links: GroundingLink[] = groundingChunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        uri: chunk.web.uri,
        title: chunk.web.title,
      }));

    let moves: CompetitorMove[] = [];
    let insights: StrategicInsight[] = [];
    let radar: RadarData[] = [];
    let pestel: PESTELData = { political: [], economic: [], social: [], technological: [], environmental: [], legal: [] };
    let swot: Record<string, SWOTData> = {};

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        moves = (parsed.moves || []).map((item: any, index: number) => {
          let finalLink = item.link;
          if (!finalLink || finalLink === "#" || finalLink.includes("example.com")) {
            const relevantGrounding = links.find(l => 
              l.title.toLowerCase().includes(item.company.toLowerCase()) || 
              l.uri.toLowerCase().includes(item.company.toLowerCase().replace(/\s/g, ''))
            );
            finalLink = relevantGrounding ? relevantGrounding.uri : (links[index % links.length]?.uri || "#");
          }
          return {
            id: `move-${index}`,
            company: item.company || "Unknown",
            link: finalLink,
            summary: item.summary || "No summary available",
            date: item.date || "Recent",
            sector: item.sector || "Digital",
          };
        });
        
        insights = parsed.insights || [];
        radar = (parsed.radar || []).map((r: any) => ({
          ...r,
          risk: r.risk || 50
        }));
        pestel = parsed.pestel || pestel;
        swot = parsed.swot || {};
      }
    } catch (e) {
      console.error("JSON parse failed", e);
    }

    return { moves, links, insights, radar, pestel, swot };
  } catch (error) {
    console.error("Intelligence fetch error:", error);
    throw error;
  }
};
