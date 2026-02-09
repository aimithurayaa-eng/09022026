import { GoogleGenAI } from "@google/genai";

// Ambil API key dari Vite env
const apiKey = import.meta.env.VITE_API_KEY;

if (!apiKey) {
  throw new Error(
    "VITE_API_KEY tidak dijumpai. Sila set dalam .env atau Vercel Environment Variables."
  );
}

// Init Gemini
const ai = new GoogleGenAI({ apiKey });

async function runGemini() {
  try {
    const prompt = "Sila ringkaskan data CSV berikut";
    const systemInstruction = "Anda ialah seorang data analyst profesional";
    const rawCsv = "name,age\nAli,20\nSiti,22";

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: `${systemInstruction}\n\nData CSV:\n${rawCsv}`,
        temperature: 0.1,
      },
    });

    console.log("Gemini response:");
    console.log(response.text);
  } catch (error) {
    console.error("Gemini error:", error);
  }
}

// Jalankan
runGemini();
