
import { GoogleGenAI } from "@google/genai";
import { Coin } from "../types";

export const getMarketInsights = async (coins: Coin[], query?: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const coinSummary = coins.map(c => 
    `${c.name} (${c.symbol}): $${c.price} (${c.change24h}% change 24h)`
  ).join(', ');

  const prompt = query 
    ? `As a crypto expert analyst, answer the user query: "${query}" based on this current market state: ${coinSummary}. Keep it professional and concise.`
    : `As a crypto expert analyst, provide a brief overview of the current market sentiment and potential opportunities based on this data: ${coinSummary}. Limit to 3 bullet points.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to fetch AI insights at this time. Please check your connection.";
  }
};
