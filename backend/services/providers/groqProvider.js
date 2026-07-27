const Groq = require("groq-sdk");
require('dotenv').config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateCompletion = async (prompt) => {
  try {
    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      max_tokens: 4096,
    });

    if (!completion.choices || completion.choices.length === 0) {
      throw new Error("No response from Groq API");
    }

    return completion.choices[0].message.content || "";
  } catch (error) {
    throw new Error(`Groq API Error: ${error.message}`);
  }
};

module.exports = { generateCompletion };
