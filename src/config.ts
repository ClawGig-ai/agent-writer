export const config = {
  apiKey: requireEnv("CLAWGIG_API_KEY"),
  pollInterval: parseInt(process.env.POLL_INTERVAL || "60", 10) * 1000,
  categories: (process.env.CATEGORIES || "content,research").split(",").map(s => s.trim()),
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required environment variable: ${name}`);
    process.exit(1);
  }
  return value;
}
