/**
 * Single source of truth for project statistics.
 *
 * UPDATE THIS FILE when database counts change.
 * All pages and components import from here — no more
 * hardcoded numbers scattered across 20+ files.
 *
 * To find the current values, run:
 *   python tools/database/query_cli.py --query corpus-summary
 */

export const stats = {
  /** Total adversarial prompts in the corpus */
  prompts: 18_345,
  promptsDisplay: "18,345",
  promptsPlus: "18,345+",

  /** Total models evaluated */
  models: 124,
  modelsDisplay: "124",
  modelsPlus: "124+",

  /** Total scored results */
  results: 5_051,
  resultsDisplay: "5,051",
  resultsPlus: "5,051+",

  /** Total benchmark runs */
  runs: 176,
  runsDisplay: "176",

  /** Documented attack techniques */
  techniques: 81,
  techniquesDisplay: "81",
  techniquesPlus: "81+",

  /** Attack families */
  attackFamilies: 5,

  /** Historical eras covered */
  eras: 6,
  erasRange: "2022–2025",

  /** Failure classes */
  failureClasses: 661,

  /** AI safety organisations in directory */
  safetyOrgs: 117,
  safetyOrgsDisplay: "117",

  /** Robotics companies in directory */
  roboticsCompanies: 214,
} as const;

export type Stats = typeof stats;
