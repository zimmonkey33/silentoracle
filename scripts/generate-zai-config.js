const { writeFileSync } = require("fs");
const { join } = require("path");

const root = join(__dirname, "..");

const baseUrl = process.env.ZAI_BASE_URL || "https://internal-api.z.ai/v1";
const apiKey = process.env.ZAI_API_KEY || "Z.ai";
const token = process.env.ZAI_TOKEN || "";

const config = { baseUrl, apiKey };
if (token) config.token = token;

writeFileSync(join(root, ".z-ai-config"), JSON.stringify(config, null, 2) + "\n");
console.log("Generated .z-ai-config");
