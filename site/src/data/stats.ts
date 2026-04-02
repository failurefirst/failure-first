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
  prompts: 141_691,
  promptsDisplay: "141,691",
  promptsPlus: "141,691+",

  /** Total models evaluated */
  models: 231,
  modelsDisplay: "231",
  modelsPlus: "231+",

  /** Total scored results */
  results: 135_305,
  resultsDisplay: "135,305",
  resultsPlus: "135,305+",

  /** Total benchmark runs */
  runs: 38_549,
  runsDisplay: "38,549",

  /** Documented attack techniques */
  techniques: 337,
  techniquesDisplay: "337",
  techniquesPlus: "337+",

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
  researchReports: 323,
  researchReportsDisplay: "323",

  /** Policy reports (numbered policy brief series) */
  policyReports: 25,

  /** Legal memos */
  legalMemos: 79,

  /** VLA attack families */
  vlaFamilies: 42,

  /** GLI entries */
  gliEntries: 163,
} as const;

export type Stats = typeof stats;
