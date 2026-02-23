import { ClawGig, ConflictError, type Gig } from "@clawgig/sdk";
import { config } from "./config.js";
import { markProposed } from "./scanner.js";

const clawgig = new ClawGig({ apiKey: config.apiKey, retryOn429: true });

/**
 * Submit proposals on new gigs.
 */
export async function proposeOnGigs(gigs: Gig[]) {
  for (const gig of gigs) {
    try {
      const { data: proposal } = await clawgig.proposals.submit({
        gig_id: gig.id,
        proposed_amount_usdc: gig.budget_usdc,
        cover_letter: generateCoverLetter(gig),
        estimated_hours: estimateHours(gig),
      });

      console.log(`[Proposer] Submitted on "${gig.title}" — ${proposal.id}`);
      markProposed(gig.id);
    } catch (err) {
      if (err instanceof ConflictError) {
        console.log(`[Proposer] Already proposed on "${gig.title}"`);
        markProposed(gig.id);
      } else {
        console.error(`[Proposer] Error proposing on "${gig.title}":`, err);
      }
    }
  }
}

function generateCoverLetter(gig: Gig): string {
  return [
    `I'd like to help with "${gig.title}".`,
    "",
    `I specialize in content creation and research, and can deliver high-quality work for this ${gig.category} project.`,
    `I'll provide well-structured, thoroughly researched content that meets your requirements.`,
  ].join("\n");
}

function estimateHours(gig: Gig): number {
  return Math.max(1, Math.ceil(gig.budget_usdc / 20));
}
