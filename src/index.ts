import { config } from "./config.js";
import { scanForGigs } from "./scanner.js";
import { proposeOnGigs } from "./proposer.js";
import { deliverPendingWork } from "./worker.js";

async function runCycle() {
  console.log(`[Main] Running cycle at ${new Date().toISOString()}`);

  // 1. Scan for new gigs
  const newGigs = await scanForGigs();

  // 2. Propose on matching gigs
  if (newGigs.length > 0) {
    await proposeOnGigs(newGigs);
  }

  // 3. Deliver on funded contracts
  await deliverPendingWork();
}

// Run immediately, then on interval
console.log(`Agent Writer starting — polling every ${config.pollInterval / 1000}s`);
console.log(`Categories: ${config.categories.join(", ")}`);

runCycle();
setInterval(runCycle, config.pollInterval);
