
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from '../types';

/**
 * Formats ChatMessage array into Gemini API contents structure
 */
const formatHistory = (history: ChatMessage[], currentPrompt: string) => {
  return [
    ...history.map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    })),
    { role: 'user', parts: [{ text: currentPrompt }] }
  ];
};

/**
 * Study Assistant (Fast) using gemini-3-flash-preview
 */
export const generateStudyAssistance = async (prompt: string, history: ChatMessage[]) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const contents = formatHistory(history, prompt);
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: contents.flatMap(c => c.parts) },
      config: {
        systemInstruction: "You are an expert academic tutor for Section E. Help with notes and concepts concisely. Use the provided conversation history for context.",
        temperature: 0.7,
      },
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini Flash Error:", error);
    return "Error communicating with the study assistant.";
  }
};

/**
 * Advanced AI Chatbot (Complex Reasoning) using gemini-3-pro-preview
 */
export const generateAdvancedChat = async (prompt: string, history: ChatMessage[]) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const contents = formatHistory(history, prompt);
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts: contents.flatMap(c => c.parts) },
      config: {
        systemInstruction: "You are Section E AI Pro, a highly intelligent academic and entertainment companion. Provide deep explanations, structured study tips, and accurate answers using the context of the current conversation.",
      },
    });
    return response.text || "I'm having trouble thinking right now.";
  } catch (error) {
    console.error("Gemini Pro Error:", error);
    return "The advanced chatbot is currently resting.";
  }
};

/**
 * Image Editing with Gemini 2.5 Flash Image
 */
export const editContentImage = async (base64Image: string, prompt: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Image.split(',')[1] || base64Image, mimeType: 'image/png' } },
          { text: prompt }
        ]
      },
    });

    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Edit Error:", error);
    return null;
  }
};
