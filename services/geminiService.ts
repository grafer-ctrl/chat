import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GroundingChunk } from '../types';

// Helper to safely access API key without crashing if process is undefined
const getApiKey = (): string => {
  try {
    // In standard Vite/CRA builds, process.env.API_KEY is replaced by string literal.
    // In raw browser environments, accessing 'process' might throw ReferenceError.
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) {
    console.warn("Could not access process.env.API_KEY");
  }
  return "";
};

const apiKey = getApiKey();

if (!apiKey) {
  console.error("API_KEY is missing. Please ensure it is set in your environment variables.");
}

// Initialize the client
const ai = new GoogleGenAI({ apiKey: apiKey });

/**
 * Helper to convert Blob to Base64
 */
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Basic Text Chat
 */
export const sendTextMessage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No response text generated.";
  } catch (error) {
    console.error("Gemini Text Error:", error);
    throw error;
  }
};

/**
 * Vision Analysis
 */
export const analyzeImage = async (imageFile: File, prompt: string): Promise<string> => {
  try {
    const base64Data = await blobToBase64(imageFile);
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: imageFile.type,
              data: base64Data
            }
          },
          { text: prompt || "Describe this image in detail." }
        ]
      }
    });

    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    throw error;
  }
};

/**
 * Search Grounding (Web Search)
 */
export const searchWithGrounding = async (query: string): Promise<{ text: string, sources: GroundingChunk[] }> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const text = response.text || "No information found.";
    
    // Extract sources safely
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];
    
    return { text, sources: chunks };
  } catch (error) {
    console.error("Gemini Grounding Error:", error);
    throw error;
  }
};