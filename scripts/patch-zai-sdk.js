// Patch z-ai-web-dev-sdk to also check /tmp/.z-ai-config
// Vercel serverless runtime has read-only process.cwd() but writable /tmp/
const { readFileSync, writeFileSync } = require("fs");
const { join } = require("path");

const indexPath = join(
  __dirname, "..", "node_modules", "z-ai-web-dev-sdk", "dist", "index.js"
);

let code = readFileSync(indexPath, "utf-8");

if (!code.includes("/tmp/.z-ai-config")) {
  code = code.replace(
    `'/etc/.z-ai-config'`,
    `'/etc/.z-ai-config', '/tmp/.z-ai-config'`
  );
  writeFileSync(indexPath, code);
  console.log("Patched z-ai-web-dev-sdk to check /tmp/.z-ai-config");
} else {
  console.log("z-ai-web-dev-sdk already patched");
}
