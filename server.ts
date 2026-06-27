import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry User-Agent header
const ai = process.env.GEMINI_API_KEY 
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    })
  : null;

// API Brand Strategy Generation Endpoint using Gemini 3.5 Flash
app.post("/api/gemini/branding", async (req, res) => {
  const { brandName = "EPOCH", vibe = "high-fashion luxury" } = req.body;

  if (!ai) {
    // If user hasn't configured a key yet, or during startup, return a high-quality fallback strategy configuration list.
    return res.json({
      tagline: `Bespoke Design & Spatial Media`,
      powerVerbs: ["Envision.", "Elevate.", "Dominate."],
      aboutText: `We build fierce brand identities for ${brandName} that don't just turn heads -- they dictate the tempo of modern couture. Absolute aesthetics, zero noise.`,
      mockProjects: [
        {
          title: `PROJECT: KRONOS x ${brandName.toUpperCase()}`,
          tag: "Luxury Wearable Architecture",
          year: "2026",
          story: "Crafting a bespoke high-fashion spatial accessory interface."
        },
        {
          title: `PROJECT: AETHER by ${brandName.toUpperCase()}`,
          tag: "Decentralized Lifestyle Identity",
          year: "2025",
          story: "Constructing physical-digital design worlds."
        },
        {
          title: `PROJECT: HELIOS x ${brandName.toUpperCase()}`,
          tag: "Bespoke Carbon Vessel Design",
          year: "2026",
          story: "Aerodynamic branding concepts for cutting-edge racing hardware."
        }
      ],
      stats: [
        { value: "340+", label: "Masterpieces Built" },
        { value: "98%", label: "Absolute Perfection" },
        { value: "12+", label: "Years Leading Culture" }
      ]
    });
  }

  try {
    const prompt = `You are the lead Creative Identity Director at an elite global digital studio.
Create a high-end, futuristic, bespoke corporate branding campaign, mission statements, stats, and mock projects for a brand named "${brandName}" with a design vibe of "${vibe}".

Return a single JSON object strictly matching the following schema. Make all values professional, luxurious, and matching the requested aesthetic theme:
{
  "tagline": "A short uppercase tagline of 3-5 words summarizing the digital collection",
  "powerVerbs": ["WordOne.", "WordTwo.", "WordThree."],
  "aboutText": "An inspiring, highly descriptive 1-2 sentence paragraph explaining their brand ideology",
  "mockProjects": [
    {
      "title": "Bespoke project name (including the brand name ${brandName}) in uppercase",
      "tag": "Short modern industry category (e.g. 'Spatial OS Branding')",
      "year": "2025 or 2026",
      "story": "A short poetic description of what this enterprise created for this masterpiece."
    },
    ... Exactly 3 objects total ...
  ],
  "stats": [
    { "value": "A unique creative stat number (e.g., '480k', '99.2%', '15M')", "label": "A short, elegant, uppercase label (e.g. 'PEOPLE INFLUENCED', 'PERFECT SCORE', 'CULTURE ACCENT')" },
    ... Exactly 3 objects total ...
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["tagline", "powerVerbs", "aboutText", "mockProjects", "stats"],
          properties: {
            tagline: { type: Type.STRING },
            powerVerbs: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            aboutText: { type: Type.STRING },
            mockProjects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["title", "tag", "year", "story"],
                properties: {
                  title: { type: Type.STRING },
                  tag: { type: Type.STRING },
                  year: { type: Type.STRING },
                  story: { type: Type.STRING }
                }
              }
            },
            stats: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["value", "label"],
                properties: {
                  value: { type: Type.STRING },
                  label: { type: Type.STRING }
                }
              }
            }
          }
        },
        temperature: 0.85
      }
    });

    const text = response.text || "";
    const parsedData = JSON.parse(text.trim());
    return res.json(parsedData);

  } catch (error) {
    console.error("Gemini Branding API Error:", error);
    // Graceful fallback response on error
    return res.json({
      tagline: `Elite Bespoke Identity Hub`,
      powerVerbs: ["Envision.", "Elevate.", "Dominate."],
      aboutText: `We build fierce brand identities for ${brandName} that don't just turn heads -- they dictate the tempo of modern couture. Absolute aesthetics, zero noise.`,
      mockProjects: [
        {
          title: `PROJECT: KRONOS x ${brandName.toUpperCase()}`,
          tag: "Luxury Wearable Architecture",
          year: "2026",
          story: "Crafting a bespoke high-fashion spatial accessory interface."
        },
        {
          title: `PROJECT: AETHER by ${brandName.toUpperCase()}`,
          tag: "Decentralized Lifestyle Identity",
          year: "2025",
          story: "Constructing physical-digital design worlds."
        },
        {
          title: `PROJECT: HELIOS x ${brandName.toUpperCase()}`,
          tag: "Bespoke Carbon Vessel Design",
          year: "2026",
          story: "Aerodynamic branding concepts for cutting-edge racing hardware."
        }
      ],
      stats: [
        { value: "250+", label: "Brands Transformed" },
        { value: "95%", label: "Client Retention" },
        { value: "10+", label: "Years in the Game" }
      ]
    });
  }
});

// Configure Vite or Static Production Serve
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[EPOCH] Full-stack Server running at http://localhost:${PORT}`);
  });
}

setupServer();
