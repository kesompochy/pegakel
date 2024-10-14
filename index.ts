import { execSync } from "node:child_process";

execSync("bun run ./server/index.ts", { 
  stdio: "inherit",
  env: {
    ...process.env,
    NODE_ENV: "prod",
    CLIENT_PORT: "8080"
  }
});
