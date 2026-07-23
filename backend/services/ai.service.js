const Groq = require("groq-sdk");
require("dotenv").config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const reviewCode = async (code) => {
const prompt = `
You are a Senior Software Engineer.

Review the following ${language} code.

Return your answer in Markdown with these sections:

# Overall Score (0-100)

# Strengths

# Bugs

# Performance Improvements

# Security Issues

# Best Practices

# Refactored Code

# Final Verdict

Code:

${code}
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.2,
  });

  return completion.choices[0].message.content;
};

module.exports = { reviewCode };