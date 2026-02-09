import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_API_KEY;

if (!apiKey) {
  throw new Error(
    "VITE_API_KEY tidak dijumpai. Sila set di Vercel Environment Variables atau .env"
  );
}

const ai = new GoogleGenAI({ apiKey });

export async function callGemini(
  prompt: string,
  systemInstruction?: string,
  rawCsv?: string
): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction: `${systemInstruction ?? ""}\n\nData CSV:\n${rawCsv ?? ""}`.trim(),
      temperature: 0.1,
    },
  });

  return response.text ?? "";
}
