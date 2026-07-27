/**
 * Environment validation on startup
 */

const requiredEnvVars = [
  'MONGO_URI',
  'JWT_SECRET',
  'AI_PROVIDER',
];

const validateEnv = () => {
  const missing = [];

  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  });

  if (process.env.AI_PROVIDER === 'groq' && !process.env.GROQ_API_KEY) {
    missing.push('GROQ_API_KEY');
  }

  if (process.env.AI_PROVIDER === 'gemini' && !process.env.GEMINI_API_KEY) {
    missing.push('GEMINI_API_KEY');
  }

  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    console.error('Please check your .env file');
    process.exit(1);
  }

  console.log('✅ All required environment variables are set');
};

module.exports = { validateEnv };
