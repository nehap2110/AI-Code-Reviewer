const { GoogleGenAI } = require("@google/genai");
require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const generateCompletion = async (prompt) => {
  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
    contents: prompt,
  });

  return response.text;
};

module.exports = { generateCompletion };