const ACTIONS = {
  REVIEW: "review",
  EXPLAIN: "explain",
  FIX_BUGS: "fixBugs",
  OPTIMIZE: "optimize",
  GENERATE_TESTS: "generateTests",
};

const PROMPT_BUILDERS = {
  [ACTIONS.REVIEW]: (code, language) => `
You are a Senior Software Engineer conducting a thorough code review.

Review the following ${language} code and return your answer in Markdown with these exact sections:

# Overall Score (0-100)
# Strengths
# Bugs
# Performance Improvements
# Security Issues
# Best Practices
# Refactored Code
# Final Verdict

Code:
\`\`\`${language}
${code}
\`\`\`
`,

  [ACTIONS.EXPLAIN]: (code, language) => `
You are a Senior Software Engineer mentoring a junior developer.

Explain the following ${language} code in Markdown with these sections:

# What This Code Does
# Step-by-Step Walkthrough
# Key Concepts Used
# Potential Gotchas

Code:
\`\`\`${language}
${code}
\`\`\`
`,

  [ACTIONS.FIX_BUGS]: (code, language) => `
You are a Senior Software Engineer specializing in debugging.

Analyze the following ${language} code strictly for bugs and correctness issues. Return your answer in Markdown with these sections:

# Bugs Found
# Root Cause Analysis
# Fixed Code
# Explanation of Fixes

If no bugs exist, say so plainly under "Bugs Found" instead of inventing issues.

Code:
\`\`\`${language}
${code}
\`\`\`
`,

  [ACTIONS.OPTIMIZE]: (code, language) => `
You are a Senior Software Engineer specializing in performance optimization.

Analyze the following ${language} code. Return your answer in Markdown with these sections:

# Current Time/Space Complexity
# Bottlenecks Identified
# Optimized Code
# Complexity After Optimization
# Trade-offs

Code:
\`\`\`${language}
${code}
\`\`\`
`,

  [ACTIONS.GENERATE_TESTS]: (code, language) => `
You are a Senior Software Engineer specializing in test-driven development.

Generate a comprehensive test suite for the following ${language} code. Return your answer in Markdown with these sections:

# Test Framework Used
# Test Cases (Happy Path)
# Test Cases (Edge Cases)
# Complete Test Code

Use the most idiomatic framework for ${language} (Jest for JavaScript, PyTest for Python, JUnit for Java, Google Test for C++).

Code:
\`\`\`${language}
${code}
\`\`\`
`,
};

const buildPrompt = ({ code, language, action }) => {
  const builder = PROMPT_BUILDERS[action];

  if (!builder) {
    throw new Error(`Unsupported action "${action}"`);
  }

  return builder(code, language || "javascript");
};

module.exports = { ACTIONS, buildPrompt };