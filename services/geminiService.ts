import { GoogleGenAI } from "@google/genai";
import { CompetitorMove, GroundingLink, StrategicInsight, RadarData, DashboardData, PESTELData, SWOTData } from "../types";
import { HILTI_COMPETITORS } from "../constants";

export const fetchCompetitorIntelligence = async (): Promise<DashboardData> => {
  // CRITICAL: Always use new GoogleGenAI({ apiKey: process.env.API_KEY }) right before making an API call.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-pro-preview";
  
  const competitorsString = HILTI_COMPETITORS.join(", ");
  const currentDate = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric', day: 'numeric' });
  
  const prompt = `
    TASK: Conduct a comprehensive Multi-Source Strategic Intelligence Audit for Hilti Group.
    TARGETS: ${competitorsString} AND Hilti (as the benchmark).
    
    Today's Date: ${currentDate}.
    
    SEARCH GUIDELINES:
    1. Search across at least 5 different primary sources (ENR, McKinsey, financial news, press releases, industry forums like Reddit/r/construction).
    2. Focus on specific AI product launches, digital twin advancements, and 2025 technology roadmaps.
    3. Ensure you find at least 8-10 distinct "moves" across the target competitors.
    4. Provide specific SWOT analysis for the top 3 most active competitors found in this search.

    OUTPUT REQUIREMENT:
    Return a strictly formatted JSON object. Include "Hilti" in the "radar" and "swot" sections.
    
    {
      "moves": [
        {
          "company": "string", 
          "link": "string", 
          "summary": "Detailed AI move description including tech used and impact", 
          "date": "MMM YYYY", 
          "sector": "Marketing"|"Sales"|"Digital"|"Other"
        }
      ],
      "insights": [
        {"title": "string", "description": "Strategic impact for Hilti", "type": "Opportunity"|"Threat"|"Strategic Question"}
      ],
      "radar": [
        {"company": "string", "innovation": 0-100, "impact": 0-100, "risk": 0-100}
      ],
      "pestel": {
        "political": ["string"], "economic": ["string"], "social": ["string"], "technological": ["string"], "environmental": ["string"], "legal": ["string"]
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
        temperature: 0.2,
      },
    });

    const text = response.text || "";
    
    // Robust extraction of grounding links
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const groundingChunks = groundingMetadata?.groundingChunks || [];
    
    // Use a Map to ensure unique URLs
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
        dashboardData = {
          ...dashboardData,
          ...parsed,
          moves: (parsed.moves || []).map((m: any, i: number) => {
            // If the move doesn't have a valid link, try to find a relevant one from grounding
            let moveLink = m.link;
            if (!moveLink || moveLink === "#" || moveLink.includes("example.com")) {
              const relevantSource = links.find(l => 
                l.title.toLowerCase().includes(m.company.toLowerCase()) || 
                l.uri.toLowerCase().includes(m.company.toLowerCase().replace(/\s/g, ''))
              );
              moveLink = relevantSource?.uri || (links[i % links.length]?.uri || "#");
            }
            return {
              ...m,
              id: `move-${i}`,
              link: moveLink
            };
          })
        };
      }
    } catch (e) {
      console.error("JSON parsing error:", e);
    }

    return dashboardData;
  } catch (error) {
    console.error("Intelligence fetch error:", error);
    throw error;
  }
};