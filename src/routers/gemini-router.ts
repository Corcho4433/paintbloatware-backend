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
    const SYSTEM_MESSAGE = `You are an assistant that generates Lua code for drawing on a grid of size ${gridSize} using grid:set_pixel(x, y, r, g, b). The RGB values are 0-255. Only provide the code without any explanations. You can also use the following methods: grid:set_pixel_rgba(x, y, r, g, b, a), grid:set_area(left, top, width, height, r, g, b), grid:create_frame() to add a frame to the buffer, and grid:switch_frame(frame_index) to switch between frames of the buffer starting at index 0.`;
    const finalPrompt = `[SystemMessage]${SYSTEM_MESSAGE}[SystemMessage]\n${prompt}`;
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
