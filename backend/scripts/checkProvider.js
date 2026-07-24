require("dotenv").config();
const { getProvider } = require("../services/providers");

(async () => {
  const providerName = (process.env.AI_PROVIDER || "groq").toLowerCase();

  try {
    console.log(`Checking provider: ${providerName}`);
    const provider = getProvider();
    const result = await provider.generateCompletion("Reply with exactly: OK");
    console.log("✅ Provider responded:", result);
  } catch (error) {
    console.error("❌ Provider check failed:", error.message);
    process.exit(1);
  }
})();