const { GoogleGenAI } = require("@google/genai");
require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const generateCompletion = async (prompt) => {
  try {
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("No response from Gemini API");
    }

    const content = response.candidates[0].content;
    if (!content || !content.parts || content.parts.length === 0) {
      throw new Error("Empty response from Gemini API");
    }

    return content.parts[0].text || "";
  } catch (error) {
    throw new Error(`Gemini API Error: ${error.message}`);
  }
};

module.exports = { generateCompletion };
