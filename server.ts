import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client strictly following System Guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Secure Server-side API endpoint for generating a custom geometric icon based on user prompt
app.post("/api/generate-icon", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    console.log(`Generating icon for prompt: "${prompt}"`);

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Create a pixel-perfect, highly professional geometric business and finance vector icon based on this prompt: "${prompt}".
The icon MUST be designed strictly on a 100x100 grid canvas (viewBox="0 0 100 100").
It should look neat, symmetric, modern, and mathematically coherent. It should consist of clean vector elements (paths, rectangles, circles, ellipses, and lines) matching the existing high-craft style of other geometric icons (like market growth trends, piggy bank, vault door, briefcase).

If the user writes their prompt in Indonesian or any non-English language, translate the concept first so that the resulting 'title', 'concept', and 'description' are written beautifully in Indonesian to match the translated system layout, or fully in Indonesian. 

Return ONLY a flat JSON object that meets this schema structure:
{
  "id": "unique-kebab-case-id",
  "title": "A Professional Title in Indonesian (e.g., 'Kursi Kantor Modern')",
  "concept": "1-2 word concept in Indonesian (e.g., 'Aset Kerja')",
  "description": "A clean 1-sentence descriptive summary in Indonesian of the icon design.",
  "elements": [
    {
      "type": "path" | "rect" | "circle" | "ellipse" | "line",
      // If type is "path"
      "d": "M ... L ... Z",
      // If type is "rect"
      "x": "...",
      "y": "...",
      "width": "...",
      "height": "...",
      "rx": "...", // optional border radius
      // If type is "circle"
      "cx": "...",
      "cy": "...",
      "r": "...",
      // If type is "ellipse"
      "cx": "...",
      "cy": "...",
      "rx": "...",
      "ry": "...",
      // If type is "line"
      "x1": "...",
      "y1": "...",
      "x2": "...",
      "y2": "...",
      
      "useStroke": true, // whether to apply the primaryColor stroke
      "strokeWidthMultiplier": 1.0, // multiplier of standard strokeWidth (e.g., 1.0, 1.25, 1.5)
      "useSecondaryFill": true // whether to fill the element with secondaryColor and secondaryOpacity
    }
  ]
}`,
      config: {
        responseMimeType: "application/json",
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.LOW,
        },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            concept: { type: Type.STRING },
            description: { type: Type.STRING },
            elements: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  d: { type: Type.STRING },
                  x: { type: Type.STRING },
                  y: { type: Type.STRING },
                  width: { type: Type.STRING },
                  height: { type: Type.STRING },
                  rx: { type: Type.STRING },
                  cx: { type: Type.STRING },
                  cy: { type: Type.STRING },
                  r: { type: Type.STRING },
                  x1: { type: Type.STRING },
                  y1: { type: Type.STRING },
                  x2: { type: Type.STRING },
                  y2: { type: Type.STRING },
                  useStroke: { type: Type.BOOLEAN },
                  strokeWidthMultiplier: { type: Type.NUMBER },
                  useSecondaryFill: { type: Type.BOOLEAN }
                },
                required: ["type"]
              }
            }
          },
          required: ["id", "title", "concept", "description", "elements"]
        }
      }
    });

    const parsedData = JSON.parse(response.text.trim());
    return res.json(parsedData);
  } catch (error: any) {
    console.error("Error generating icon via Gemini API:", error);
    return res.status(500).json({ error: error.message || "Gagal membuat ikon dengan AI." });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully started on http://localhost:${PORT}`);
  });
}

startServer();
