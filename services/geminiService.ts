import { GoogleGenAI, Type } from "@google/genai";
import { ServiceCategory, AIAnalysisResult } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize client outside if key exists, otherwise handle gracefully in calls
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const analyzeServiceRequest = async (userDescription: string): Promise<AIAnalysisResult> => {
  if (!ai) {
    throw new Error("API Key not configured");
  }

  const model = "gemini-2.5-flash";
  
  const prompt = `
    You are an expert facility manager for Fayano Agency, a home services platform in Kenya.
    Analyze the user's problem description and categorize it into one of these services: 
    Plumbing, Electrical, Appliances, Handyman, CCTV & Security.
    
    Provide a cost estimation in Kenyan Shillings (KSh) based on these tiers:
    - Small jobs (faucet leak, bulb change): 500 - 2,000 KSh
    - Medium jobs (wiring repair, appliance fix): 3,000 - 5,000 KSh
    - Big jobs (CCTV install, full rewiring): 10,000+ KSh
    
    User Description: "${userDescription}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { 
              type: Type.STRING, 
              enum: [
                ServiceCategory.PLUMBING,
                ServiceCategory.ELECTRICAL,
                ServiceCategory.APPLIANCES,
                ServiceCategory.HANDYMAN,
                ServiceCategory.CCTV_SECURITY,
                ServiceCategory.GENERAL
              ]
            },
            urgency: { type: Type.STRING, enum: ['Low', 'Medium', 'Critical'] },
            estimatedPriceMin: { type: Type.NUMBER },
            estimatedPriceMax: { type: Type.NUMBER },
            reasoning: { type: Type.STRING },
            suggestedAction: { type: Type.STRING }
          },
          required: ['category', 'urgency', 'estimatedPriceMin', 'estimatedPriceMax', 'reasoning', 'suggestedAction']
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AIAnalysisResult;
    }
    
    throw new Error("Empty response from AI");
  } catch (error) {
    console.error("AI Analysis failed:", error);
    // Fallback default
    return {
      category: ServiceCategory.GENERAL,
      urgency: 'Medium',
      estimatedPriceMin: 500,
      estimatedPriceMax: 2000,
      reasoning: "We couldn't precisely analyze the request, but our general fundis can take a look.",
      suggestedAction: "Book a general consultation."
    };
  }
};