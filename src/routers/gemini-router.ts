import { Router } from "express";
import { BadRequest, ServerError } from "../errors/server_errors";
import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export const geminiRouter = Router();

// POST /gemini { prompt: string }
geminiRouter.post("/", async (req, res, next) => {
  try {
    
    const { prompt, gridSize } = req.body;
    const SYSTEM_MESSAGE = `You are an assistant that generates Lua code for drawing on a grid of size ${gridSize} using grid:set_pixel(x, y, r, g, b). The RGB values are 0-255. Only provide the code without any explanations.`;
    const finalPrompt = `${SYSTEM_MESSAGE}\n${prompt}`;
    if (!prompt || !gridSize) {
      throw new BadRequest("Missing prompt or gridSize.");
    }
    if (!GEMINI_API_KEY) {
      throw new ServerError("Missing Gemini API key");
    }
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: finalPrompt,

    });
    const data = response.text;
    res.status(200).json({ result: data });
  } catch (error) {
    next(error);
  }
});
