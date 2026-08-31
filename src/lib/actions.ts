import type { Vulnerability } from "@/types";

export type ActionItem = {
  id: string;
  category: string;
  title: string;
  description: string;
  why: string;
  time_estimate: string;
  steps: string[];
  difficulty: string;
};

/** Pre-built action library mapped to categories */
export const ACTION_LIBRARY: ActionItem[] = [
  {
    id: "money-buffer-1",
    category: "money",
    title: "Open a dedicated emergency buffer account",
    description: "Separate the money so it is not mixed with everyday spending.",
    why: "Mental accounting makes it far more likely you will keep the buffer intact.",
    time_estimate: "15 minutes",
    steps: [
      "Choose a bank or credit union account you already have access to",
      "Open a new savings or 'emergency' labeled account if needed",
      "Set a first transfer of any amount today",
      "Turn on a small automatic weekly transfer",
    ],
    difficulty: "Easy",
  },
  {
    id: "money-buffer-2",
    category: "money",
    title: "Calculate your true 90-day number",
    description: "Know the exact target instead of guessing.",
    why: "Vague goals stall. A concrete number creates a finish line.",
    time_estimate: "10 minutes",
    steps: [
      "List essential monthly expenses only (housing, food, utilities, transport, minimum debt)",
      "Multiply by 3 for 90 days",
      "Write the number somewhere you will see it",
      "Track progress weekly",
    ],
    difficulty: "Easy",
  },
  {
    id: "docs-offline-1",
    category: "documents",
    title: "Download offline copies of critical documents",
    description: "Identity, insurance, property, and recovery information.",
    why: "If your primary device or account becomes inaccessible, you currently risk having no backup.",
    time_estimate: "8–20 minutes",
    steps: [
      "Create a folder on an external drive or encrypted USB",
      "Export or photograph IDs, insurance cards, deeds/leases",
      "Export 2FA recovery codes for major accounts",
      "Store a second copy in a different physical location if possible",
    ],
    difficulty: "Easy",
  },
  {
    id: "comm-contacts-1",
    category: "communication",
    title: "Create an offline emergency contact sheet",
    description: "Paper or offline digital list of people and numbers that matter.",
    why: "Phone loss or network outage should not erase your ability to reach key people.",
    time_estimate: "10 minutes",
    steps: [
      "List family, neighbors, doctor, landlord, key work contacts",
      "Include at least one out-of-area contact",
      "Print one copy and keep one offline digital copy",
      "Update it every 6 months",
    ],
    difficulty: "Easy",
  },
  {
    id: "food-stock-1",
    category: "food",
    title: "Build a 7-day non-perishable starter kit",
    description: "Start small so the task does not feel overwhelming.",
    why: "Even one week of food removes panic buying during short disruptions.",
    time_estimate: "30–60 minutes shopping + 15 minutes organizing",
    steps: [
      "List meals your household will actually eat",
      "Buy one week of shelf-stable versions",
      "Store in a single accessible place",
      "Note the purchase date and rotate older items into normal cooking",
    ],
    difficulty: "Medium",
  },
  {
    id: "pay-alt-1",
    category: "money",
    title: "Establish one alternative payment method",
    description: "Cash reserve or secondary account/card that is not your daily driver.",
    why: "72-hour banking or card outages are more common than people expect.",
    time_estimate: "20 minutes",
    steps: [
      "Withdraw a modest cash amount you can store safely",
      "Or activate a secondary debit/credit option",
      "Test that you can actually use it",
      "Review the amount quarterly",
    ],
    difficulty: "Easy",
  },
  {
    id: "phone-backup-1",
    category: "digital",
    title: "Set up phone recovery and 2FA backups",
    description: "Make sure losing the device does not lock you out of everything.",
    why: "Most critical accounts are still tied to a single phone number or device.",
    time_estimate: "15–25 minutes",
    steps: [
      "Enable a secondary recovery email or phone where possible",
      "Export and store authenticator recovery codes offline",
      "Confirm you can sign in from a second device",
      "Write the recovery steps in your offline document set",
    ],
    difficulty: "Medium",
  },
  {
    id: "home-72h-1",
    category: "home",
    title: "Assemble a basic 72-hour home kit",
    description: "Water, light, basic medical, and power for three days.",
    why: "Most disruptions that affect households last hours to a few days, not months.",
    time_estimate: "1–2 hours",
    steps: [
      "Water: aim for 3 liters per person per day for 3 days",
      "Light: flashlight or lantern + extra batteries",
      "Medical: basic first-aid and any critical personal meds",
      "Power: power bank charged and stored",
      "Put everything in one grab-able location",
    ],
    difficulty: "Medium",
  },
];

export function pickTodaysMove(
  vulnerabilities: Vulnerability[],
  completedActionIds: string[] = []
): ActionItem {
  for (const v of vulnerabilities) {
    const candidates = ACTION_LIBRARY.filter(
      (a) =>
        a.category === v.category && !completedActionIds.includes(a.id)
    );
    if (candidates.length > 0) return candidates[0];
  }
  return (
    ACTION_LIBRARY.find((a) => !completedActionIds.includes(a.id)) ||
    ACTION_LIBRARY[0]
  );
}
