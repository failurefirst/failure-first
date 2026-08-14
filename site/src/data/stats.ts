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
  prompts: 143_545,
  promptsDisplay: "143,545",
  promptsPlus: "143,545+",

  /** Distinct models evaluated (ratified figure — see data/canonical_metrics.json corpus.distinct_models) */
  models: 277,
  modelsDisplay: "277",
  modelsPlus: "277+",

  /** Total scored results */
  results: 172_469,
  resultsDisplay: "172,469",
  resultsPlus: "172,469+",

  /** Total benchmark runs */
  runs: 38_729,
  runsDisplay: "38,729",

  /** Documented attack techniques */
  techniques: 346,
  techniquesDisplay: "346",
  techniquesPlus: "346+",

  /** Attack families */
  attackFamilies: 5,

  /** Historical eras covered */
  eras: 6,
  erasRange: "2022–2026",

  /** Failure classes */
  failureClasses: 661,

  /** AI safety organisations in directory */
  safetyOrgs: 160,
  safetyOrgsDisplay: "160",

  /** Robotics companies in directory */
  roboticsCompanies: 261,

  /** Research reports (total .md files in research/reports/) */
  researchReports: 377,
  researchReportsDisplay: "377",

  /** Policy reports (numbered policy brief series, docs/policy_briefs/) */
  policyReports: 14,

  /** Legal memos */
  legalMemos: 79,

  /** VLA attack families */
  vlaFamilies: 42,

  /** GLI entries */
  gliEntries: 163,
} as const;

export type Stats = typeof stats;
