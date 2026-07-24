const groqProvider = require("./groqProvider");
const geminiProvider = require("./geminiProvider");

const PROVIDERS = {
  groq: groqProvider,
  gemini: geminiProvider,
};

const getProvider = () => {
  const providerName = (process.env.AI_PROVIDER || "groq").toLowerCase();
  const provider = PROVIDERS[providerName];

  if (!provider) {
    throw new Error(
      `Unknown AI_PROVIDER "${providerName}". Supported: ${Object.keys(PROVIDERS).join(", ")}`
    );
  }

  return provider;
};

module.exports = { getProvider, PROVIDERS };