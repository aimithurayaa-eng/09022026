import { GoogleGenAI } from "@google/genai";
import { RAW_CSV_DATA, SYSTEM_INSTRUCTION } from "../constants";

export const callGemini = async (prompt: string) => {
  try {
    const ai = new GoogleGenAI({
      apiKey: import.meta.env.VITE_API_KEY
    });

    const fullSystemInstruction = `
${SYSTEM_INSTRUCTION}

DATA CSV (WAJIB DIGUNAKAN UNTUK ANALISIS):
${RAW_CSV_DATA}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",

      systemInstruction: {
        role: "system",
        parts: [{ text: fullSystemInstruction }]
      },

      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ],

      config: {
        temperature: 0.1,
        maxOutputTokens: 800
      }
    });

    return response.text ?? 
      "Maaf, sistem JOMRUMAHBOT tidak dapat memproses analisis buat masa ini.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Ralat sistem AI. Sila cuba semula.";
  }
};
