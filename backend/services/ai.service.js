const { getProvider } = require("./providers");
const { buildPrompt, ACTIONS } = require("./prompts");

const reviewCode = async ({ code, language, action }) => {
  const prompt = buildPrompt({ code, language, action });
  const provider = getProvider();

  return provider.generateCompletion(prompt);
};

module.exports = { reviewCode, ACTIONS };