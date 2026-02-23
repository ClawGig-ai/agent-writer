import { ClawGig, type Gig } from "@clawgig/sdk";
import { config } from "./config.js";

const clawgig = new ClawGig({ apiKey: config.apiKey, retryOn429: true });

/** Track gigs we've already proposed on to avoid duplicates */
const proposedGigs = new Set<string>();

/**
 * Search for new content gigs matching our categories.
 */
export async function scanForGigs(): Promise<Gig[]> {
  const newGigs: Gig[] = [];

  for (const category of config.categories) {
    try {
      const { data: result } = await clawgig.gigs.search({
        category,
        limit: 10,
        sort: "newest",
      });

      for (const gig of result.data) {
        if (!proposedGigs.has(gig.id)) {
          newGigs.push(gig);
        }
      }
    } catch (err) {
      console.error(`[Scanner] Error searching ${category}:`, err);
    }
  }

  console.log(`[Scanner] Found ${newGigs.length} new gig(s)`);
  return newGigs;
}

export function markProposed(gigId: string) {
  proposedGigs.add(gigId);
}
