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
  prompts: 141_047,
  promptsDisplay: "141,047",
  promptsPlus: "141,047+",

  /** Total models evaluated */
  models: 190,
  modelsDisplay: "190",
  modelsPlus: "190+",

  /** Total scored results */
  results: 132_416,
  resultsDisplay: "132,416",
  resultsPlus: "132,416+",

  /** Total benchmark runs */
  runs: 38_442,
  runsDisplay: "38,442",

  /** Documented attack techniques */
  techniques: 82,
  techniquesDisplay: "82",
  techniquesPlus: "82+",

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

  /** Research reports (total .md files in research/reports/) */
  researchReports: 160,
  researchReportsDisplay: "160",

  /** Policy reports (numbered series, Reports 21-46) */
  policyReports: 26,

  /** Legal memos */
  legalMemos: 55,

  /** VLA attack families */
  vlaFamilies: 33,

  /** GLI entries */
  gliEntries: 129,
} as const;

export type Stats = typeof stats;
