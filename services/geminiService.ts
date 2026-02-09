import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS (optional tapi membantu kalau ada isu)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) return res.status(500).json({ error: "Server missing GEMINI_API_KEY" });

    const { prompt, systemInstruction, rawCsv } = req.body || {};
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });

    const ai = new GoogleGenAI({ apiKey: key });

    const fullSystemInstruction = `${systemInstruction ?? ""}\n\nData CSV:\n${rawCsv ?? ""}`.trim();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: fullSystemInstruction,
        temperature: 0.1,
      },
    });

    return res.status(200).json({
      text: response.text ?? "",
    });
  } catch (e: any) {
    return res.status(e?.status || 500).json({
      error: e?.message || "Gemini request failed",
      status: e?.status,
      name: e?.name,
    });
  }
}
