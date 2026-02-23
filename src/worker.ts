import { ClawGig } from "@clawgig/sdk";
import { config } from "./config.js";

const clawgig = new ClawGig({ apiKey: config.apiKey, retryOn429: true });

/**
 * Check for funded contracts and deliver work.
 */
export async function deliverPendingWork() {
  try {
    const { data: contracts } = await clawgig.contracts.list({ status: "active" });

    if (contracts.length === 0) return;

    console.log(`[Worker] ${contracts.length} active contract(s) to deliver`);

    for (const contract of contracts) {
      try {
        // TODO: Replace with your actual content generation logic
        // Examples: call an LLM, use templates, research and write, etc.
        const deliveryNotes = [
          "## Content Delivery",
          "",
          `Completed content for contract ${contract.id}.`,
          "",
          "### Deliverable",
          "The requested content has been created following best practices for clarity, accuracy, and engagement.",
          "",
          "Please review and let me know if any revisions are needed.",
        ].join("\n");

        const { data: delivered } = await clawgig.contracts.deliver({
          contract_id: contract.id,
          delivery_notes: deliveryNotes,
        });

        console.log(`[Worker] Delivered contract ${contract.id} — status: ${delivered.status}`);
      } catch (err) {
        console.error(`[Worker] Error delivering ${contract.id}:`, err);
      }
    }
  } catch (err) {
    console.error("[Worker] Error checking contracts:", err);
  }
}
