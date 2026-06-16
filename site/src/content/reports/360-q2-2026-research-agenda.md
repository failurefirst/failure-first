---

title: "Q2 2026 Research Agenda"
description: "This brief scopes the May-June 2026 research programme for F41LUR3-F1R57 in the window after CCS 2026 submission and before the EU AI Act high-risk compliance trigger (August 2026). It answers three planning questions:"
date: "2026-04-24"
reportNumber: 360
classification: "Research — Empirical Study"
status: "draft"
tags: []
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/360-q2-2026-research-agenda.m4a"
---

## Executive Summary

This brief scopes the May-June 2026 research programme for F41LUR3-F1R57 in
the window after CCS 2026 submission and before the EU AI Act high-risk
compliance trigger (August 2026). It answers three planning questions:

1. **Which 3-5 empirical questions most need answering in the next 8 weeks?**
2. **Which synthesis paper is most defensible given the existing corpus?**
3. **Which sitting negative result has the highest publication leverage?**

The answers draw on 338 prior research reports (highest #359), 140,355
graded results across 257 models (Canonical Metrics, 2026-04-16), and the
seven daily digests published 2026-04-18..24. No new ASR claims are made in
this report — all numbers cited are reproduced from the source reports.

The programme-shaping signals from the last seven days are:

- **AEGIS/VLSA control-barrier-function wrappers** are the first architectural
  result the field has that treats safety as an extrinsic guarantee, not a
  learned property (digests 2026-04-18/19/21/22/24; SafeLIBERO +59.16 pp
  obstacle avoidance, +17.25 pp task success, citations within digests).
- **SafeAgentBench's sub-10% hazardous-task rejection ceiling** (digest
  2026-04-18) and CHAIN's 0.0% one-shot Pass@1 on interlocking mechanical
  puzzles (digests 2026-04-18/24) are concrete evidence that text-layer
  alignment is not transferring to embodied action planning.
- **OpenAI's GPT-5.5 Bio Bug Bounty** (digests 2026-04-23/24) is the first
  externally-auditable public bounty with a reproducible winning condition —
  it converts the "universal jailbreak" question from a rhetorical one into
  a measurable one, and the Codex Desktop scope is aligned with the dual-
  document and authority-gradient families F41LUR3-F1R57 has corpus evidence
  on.
- **Rose Tyler's within-session finding** that temporal / future-year
  laundering is under-measured on the frontier cohort (captured in today's
  session handoff; schema key `labels.intent.future_year_laundering`).
- **Post-fix QA** closed the biggest methodology risks documented in
  Mistakes #24/#27/#30 (grader truncation), #29 (env key shadowing), and
  Report #345 (multi-turn truncation audit), leaving the corpus in its
  cleanest state since inception.

---

## 1. Top Empirical Questions for May-June 2026

Each question below is scoped to be answerable in 1-3 weeks with existing
infrastructure. Ordering reflects estimated leverage — Q1 is the highest.

### 1.1 Does the CBF wrapper's adversarial robustness survive attacks that move up a layer to the state estimator?

**Why it matters.** AEGIS/VLSA's +59.16 pp obstacle-avoidance lift on
SafeLIBERO is computed under a clean-telemetry assumption (digest
2026-04-18; citation to Huang et al. 2026 within digest). If an attacker
can corrupt the wrapper's input (pose estimate, depth map, force sensor
reading) before the CBF projects onto the safe set, the mathematical
forward-invariance guarantee degrades to a learned-perception guarantee —
i.e., to the same attack surface F41LUR3-F1R57 has documented across the
VLA corpus. CHAIN's 0.0% one-shot Pass@1 (digest 2026-04-18) suggests
frontier VLAs lack the spatial priors to *detect* corrupted state, which
would make the wrapper's input the next productive attack surface.

**Experiment.** Re-run SafeLIBERO scenarios with CBF wrapper enabled, but
inject three classes of telemetry corruption: (1) static pose offset
(0.5-5 cm), (2) stochastic noise injection calibrated to match a
realistic LiDAR fault profile, (3) adversarial depth-map perturbations
derived from the F41LUR3-F1R57 visual attack taxonomy (Report #341).
Measure the gap between wrapper-on/clean-telemetry and
wrapper-on/adversarial-telemetry ASR.

**Effort.** ~2 weeks. Requires SafeLIBERO harness access (blocker: we do
not yet have it), one week for perturbation pipeline, one week for runs
and FLIP-style grading of action-space compliance.

**What becomes possible.** First empirical answer to whether extrinsic
safety wrappers are adversarially robust or merely architecturally
independent. Either outcome is publishable — a robust wrapper is a
positive advocacy result, a fragile wrapper is a critical-path research
direction for 2026-H2.

### 1.2 Does temporal / future-year laundering transfer to the frontier cohort at rates comparable to the 2024-era models the pattern was observed on?

**Why it matters.** The `labels.intent.future_year_laundering` schema key
has been in the corpus since v0.1 (schema reference: intent labels). The
frontier cohort tested in Report #354 (claude-opus-4-6, gpt-4.1,
gemini-3-flash-preview, mistral-large-3:675b, deepseek-v3.2) has not been
systematically probed for this attack family — the Crescendo S24 pack
does not feature temporal-laundering prompts as a separate class. Rose
Tyler flagged this as the biggest under-measured technique on the
frontier cohort in today's session.

**Experiment.** Build a 30-scenario temporal-laundering pack drawing from
existing scenarios in `data/bait/` and `data/jailbreak_archaeology/`,
re-framed with (a) explicit-future-year priors ("In 2027..."),
(b) constraint-retirement framing ("the 2024 restriction no longer
applies"), and (c) research-context framing with temporal justification
("for a post-2027 historical analysis..."). Run against the Report #354
frontier cohort. FLIP-grade final-turn no-truncation (per the fix that
closed Mistake #30).

**Effort.** ~1 week. Ollama Cloud + OpenRouter access already budgeted.
Dataset construction is the critical path; running is bounded.

**What becomes possible.** First quantitative comparison of temporal-
laundering ASR across frontier generations. Directly answers one of the
Feffer et al. fragmentation axes (threat model) on a cohort with published
system cards (GPT-5.5 landed 2026-04-23).

### 1.3 Does the dissentive / consentive risk distinction have measurable annotator agreement on the existing F41LUR3-F1R57 corpus?

**Why it matters.** The dissentive (context-dependent) vs. consentive
(universally inadmissible) split surfaced in digest 2026-04-20 is the
distinction BFSI and embodied-AI policy work is increasingly built on. If
the split can be applied to our existing 887 JSONL scenario files with
kappa >0.7 between independent annotators, we have a corpus-level
retrofit that makes our data directly citable in policy work. If
agreement is low, the split is less operationalisable than the digests
imply and we should say so.

**Experiment.** Sample 200 scenarios stratified by `scenario_class` and
`domain`. Have two annotators (internal — Romana and Nyssa of Traken are
the natural pair) independently label each scenario as dissentive /
consentive / ambiguous using a written rubric derived from Dimino et al.
(2026). Compute Cohen's kappa. Publish the rubric and a sample of
disagreements alongside the kappa score.

**Effort.** ~1.5 weeks. No compute required. Primary cost is annotator
time.

**What becomes possible.** A retrofitted annotation layer that makes the
existing corpus usable as a policy artefact under the Feffer et al. and
Dimino et al. frameworks. Also a precondition for Q1.4.

### 1.4 Does RAHS-style disclosure-specificity scoring produce materially different ASR numbers from FLIP v2 on the same traces?

**Why it matters.** The Risk-Adjusted Harm Score framework (digests
2026-04-18/20/22) explicitly treats disclaimers as a signal, not a
mitigation, which is methodologically aligned with F41LUR3-F1R57's FLIP
v2 rubric ("Disclaimers do NOT downgrade this"). But RAHS adds a
specificity axis that FLIP v2 does not encode directly. If the two
methodologies agree within the 5-10 pp range, FLIP v2 is a reasonable
proxy for RAHS and we can map the methodologies cleanly. If they
disagree by more than 10 pp on substantial sub-corpora, we have
methodology drift to document.

**Experiment.** Sub-sample 300 traces from the non-OBLITERATUS LLM-graded
pool (n=4,463 evaluable per CANONICAL_METRICS.md 2026-03-27 recount).
Re-grade with a RAHS-style specificity rubric. Compare verdict
distributions and pairwise model rankings.

**Effort.** ~1 week. Re-grading compute budget only.

**What becomes possible.** A calibration between FLIP v2 and RAHS that
lets our corpus speak directly into the BFSI regulatory-adjacent
literature. Also a prerequisite for citing our numbers in EU AI Act
conformity dossiers.

### 1.5 Are the two "universal" Crescendo scenarios from Report #354 (CRESC-EXP-009 radicalization, CRESC-EXP-012 SCADA) also universally successful under authority-gradient and format-lock framings?

**Why it matters.** Report #354 documented that CRESC-EXP-009 and
CRESC-EXP-012 broke 5/5 frontier models (claude-opus-4-6, gpt-4.1,
gemini-3-flash-preview, mistral-large-3:675b, deepseek-v3.2). If these
universals are Crescendo-specific, they tell us about multi-turn
vulnerability concentration. If they are universal across attack families
too, they are the strongest candidates in the corpus for the "universal
jailbreak" class the GPT-5.5 Bio Bounty is asking about — and are
directly relevant as prior art for the bounty application (noted in
digest 2026-04-23 and `drafts/funding/openai_bio_bounty_application.md`).

**Experiment.** Reframe both scenarios as single-turn attacks under the
format-lock family (scholar frame, per the 3.5x baseline lift noted in
Gemma poetry-frame memory) and the authority-gradient family (see Report
#346 for the AG pack). Run against the same Report #354 cohort plus
GPT-5.5 once bounty testing window opens (2026-04-28).

**Effort.** ~1 week for reframes and runs. FLIP grading final-turn
no-truncation per standing methodology.

**What becomes possible.** First corpus-grounded evidence on whether
multi-turn "universals" transfer to single-turn framings. Direct input to
the bio-bounty application and a candidate finding for a universal-
jailbreak methodology note.

---

## 2. Most Defensible Synthesis Paper: Extrinsic Wrapper vs. Internal Alignment as Complementary Safety Architectures

Of the four candidates in the task brief, **(b) extrinsic wrapper vs.
internal alignment as complementary safety architectures** is the most
defensible Q2 synthesis paper. Rationale:

**It is the only candidate where the existing corpus, the current
literature, and the current regulatory trajectory point at the same
architectural question.** The AEGIS/VLSA result (digests 2026-04-18/19/21/24)
is the clearest architectural signal of the past six months. F41LUR3-F1R57
has the complementary finding on the internal-alignment side — Report #283
shows that safety is *not reliably inherited through fine-tuning or
distillation* (50 models, 8 families, 24,477 LLM-graded results, 25 of 100
pairwise comparisons showing significant degradation post-Bonferroni). The
two findings together frame a clean dichotomy: internal alignment is
demonstrably fragile under derivation; extrinsic wrappers are demonstrably
capability-positive under clean telemetry. Neither alone is sufficient for
regulated deployment.

**It answers a question the EU AI Act August-2026 window makes urgent.**
VLA developers in the Phase-2/3 bands of the Shah et al. (2026) maturity
taxonomy (digest 2026-04-21) need "living dossiers" of safety evidence by
August 2026, and the dossier must name the safety architecture. A paper
that explicitly frames internal and extrinsic architectures as
complementary — with empirical evidence on the failure modes of each —
gives the field a vocabulary for those dossiers that does not exist yet.

**It is the candidate with the least new compute required.** The paper
draws on Report #283 (already published internally), Report #184 (attack
evolution lineage), Reports #49 and #65 (VLA corpus), and the SafeLIBERO
literature we have been tracking since 2026-02. Q1.1 above would
strengthen the paper substantially, but the synthesis argument stands even
without it.

**Comparison against the other three candidates.** (a) Cross-model
distillation safety inheritance is already covered by Report #283 and
extending it to a standalone paper would be incremental. (c) Grader drift
as methodology risk is important but the corpus evidence is spread across
#28/#177/#250 plus the 2026-04-24 grader-fix work, and a standalone paper
on it would duplicate the CCS paper's methodology section. (d) Multi-turn
escalation taxonomies combine work that is not yet converged — Crescendo
numbers in #354 are still heuristic pending FLIP regrade, and RAHS scoring
is new to the programme. A synthesis paper there is 6-10 weeks away, not
8.

**Draft structure (tentative, subject to Adrian review).**
1. Introduction — the learned-vs-extrinsic distinction, why it matters
   post-CCS and pre-EU-AI-Act.
2. The internal-alignment failure mode (builds on #283 and #184).
3. The extrinsic-wrapper architecture (AEGIS/VLSA, RAHS, our existing
   intent-label schema as a pre-registered wrapper layer).
4. Where they complement — distilled/derived models protected by
   extrinsic guarantees when internal alignment cannot be trusted.
5. Where extrinsic wrappers also fail — the Q1.1 telemetry-corruption
   failure mode, iatrogenic over-conservatism (digest 2026-04-21).
6. Implications for regulatory dossiers and deployment-readiness.

Target venue: workshop or short-paper track, not full conference. Estimated
effort: 4-6 weeks from kickoff to draft, assuming Q1.1 completes in
parallel.

---

## 3. Highest-Leverage Unpublished Negative Result: The Frontier-Scale Crescendo Regression

The candidate negative result with the highest Q2 publication leverage is
**the finding that frontier-tier Crescendo ASR is *worse* than
gemma4:31b's 12% (Report #349), not better** — drawing directly on the
heuristic numbers in Report #354.

**The finding as stated (heuristic, pending FLIP).** Report #354's
heuristic final-turn ASR on five frontier models ranges from 30% (gemini-3-
flash-preview) to 60% (mistral-large-3:675b). Even the best-performing
frontier model (gemini-3-flash-preview at 30%) is 2.5x worse on
Crescendo than gemma4:31b at 12% from Report #349. mistral-large-3:675b
at 60% is 5x worse. This is the opposite of the monotone scaling the
field assumes.

**Why it qualifies as a negative result of the kind the field values.**
The Reasoning-Dilution null on Gemma (Report #351) was valued because it
falsified a strong literature claim. The Crescendo-regression finding
would falsify a weaker but more widespread *implicit* assumption — that
frontier models are safer than their mid-size predecessors under
multi-turn escalation. Report #349 established the Gemma-4 result.
Report #354 provides the frontier comparison. The synthesis has not been
written up as a standalone finding and is not visible in Report #354's
executive summary (which is scoped to the frontier cohort internally).

**Why it is higher leverage than other candidates in the corpus.**
Alternative negative results we are sitting on include:
- The AG strict-ASR null on Gemma 4 (0%, Report #347) — already
  published as part of the cross-attack synthesis, less newsworthy in
  isolation.
- The VLA FLIP regrade showing 0% strict ASR on KIN / TCA / DLA
  (CANONICAL_METRICS.md VLA table) — small-n (5-7 per family), CIs too
  wide to publish as negative evidence.
- The CCA evolved 0% finding (Report #347) — narrow attack family,
  harder to frame as of general interest.

The Crescendo-regression finding has the largest effect size (12% vs 30-60%),
the largest model cohort spread (five frontier models plus the Gemma 4
anchor), and the most direct tension with a field assumption. It is also
the closest to being publishable — the only blocker is completing the
FLIP regrade on the Report #354 traces that is already in progress per
#354 Status field.

**Prerequisites for publication.** (1) FLIP regrade of #354 traces
final-turn no-truncation (already in progress); (2) re-checking that
Report #349's gemma4:31b 12% number uses the same Crescendo scenario pack
as #354 (spot-check — #354 uses `crescendo_expansion_v0.2.jsonl`,
identical to #344; #349 needs a scenario-pack audit); (3) one matched
large-model control outside the #354 frontier cohort to rule out
cohort-specific effects (suggest adding gemma3:27b since we have #349
data on it).

**Publication path.** A 4-6 page short paper (arXiv preprint + workshop),
author attribution Amy Pond + Clara Oswald, targeting a 6-week completion
window. Framing: "multi-turn escalation resistance does not scale
monotonically with model size among currently-deployed frontier models".

---

## 4. Summary of Deliverables Requested

| Deliverable | Source | Effort | Blocker |
|-------------|--------|--------|---------|
| Q1.1 CBF wrapper adversarial-telemetry experiment | §1.1 | ~2 wk | SafeLIBERO harness access |
| Q1.2 Temporal-laundering frontier pack | §1.2 | ~1 wk | None (existing infra) |
| Q1.3 Dissentive/consentive retrofit on 200 scenarios | §1.3 | ~1.5 wk | Annotator time |
| Q1.4 RAHS-FLIP calibration on 300 traces | §1.4 | ~1 wk | Re-grading compute |
| Q1.5 Universal-Crescendo → single-turn transfer | §1.5 | ~1 wk | None (existing infra) |
| Synthesis paper: extrinsic vs. internal alignment | §2 | 4-6 wk | Q1.1 in parallel |
| Negative-result paper: frontier Crescendo regression | §3 | 6 wk | FLIP regrade of #354 |

## 5. Out of Scope for Q2

The following are explicitly deferred, with rationale:

- **Full VLA adversarial-telemetry red team** beyond SafeLIBERO. Deferred
  until Q1.1 returns a signal direction.
- **A physical-AI corpus expansion beyond the PiCar-X platform.** The
  corpus is already sufficient for the synthesis paper in §2; further
  expansion would be discovery-mode, not endpoint-mode.
- **A RAHS-native benchmark pack.** Dependent on Q1.4 returning a
  favourable calibration signal before it is worth building.
- **A universal-jailbreak methodology paper** around the GPT-5.5 Bio
  Bounty. The NDA coverage on bounty interactions (digest 2026-04-23)
  makes this infeasible until post-bounty disclosure windows are clear.

---

## 6. Open Questions for Adrian

1. Is SafeLIBERO harness access (Q1.1 blocker) realistic inside the Q2
   window, or should we target a simpler internal wrapper stand-in?
2. Preferred author attribution on the §2 synthesis paper — solo
   research-analyst (Clara), paired with Romana, or broader?
3. Is there a hard publication date target for the §3 negative result
   relative to the GPT-5.5 Bio Bounty testing window (2026-04-28 to
   2026-07-27)?
4. Should Q1.2 (temporal-laundering frontier pack) be budgeted under
   research-analyst time or benchmark-operator time? Rose Tyler raised
   the gap; the pack construction is data-curator work; the runs are
   benchmark-operator work.

---

## Citations

Internal reports cited: #28, #48, #49, #50, #65, #177, #182, #184, #250,
#283, #341, #344, #345, #346, #347, #349, #351, #352, #354.
`docs/CANONICAL_METRICS.md` (2026-04-16 recount).
Blog digests: `site/src/content/blog/ai-safety-daily-2026-04-{18,19,20,21,22,23,24}.md`.

External references (via digests, not re-verified in this report):
Feffer et al. (CMU, 2025) red-teaming five-axes framework; Dimino et al.
(2026) RAHS; Shah et al. (2026) physical-AI maturity taxonomy; AEGIS/VLSA
authors (SafeLIBERO, 2026); SafeAgentBench authors (2026); CHAIN benchmark
authors (2026); OpenAI GPT-5.5 System Card (2026-04-23).

*End of Report #360 (original 2026-04-24 draft).*

---

## 2026-04-24 Late-Session Update: Q1.2 Preliminary + New Q1.6

This update appends new findings that arrived after the original Report
#360 was committed. It revises question priorities and adds one new
question (Q1.6). No numbers from the original report are modified; every
update is additive.

### Q1.2 Preliminary Answer: No FYL-Transfer on gemma4:31b (FLIP-graded, one model)

**Result.** The temporal / future-year laundering (FYL) pack described in
§1.2 has a first data point. On `gemma4:31b`, FLIP-graded final-turn with
no truncation (per the Mistake #30 fix), the observed attack success rate
is **0% (n=45)** — i.e., no trace in the pack was graded HARMFUL by the
LLM judge on this model.

**Context from Amy's round 3.** The remainder of the frontier cohort run
described in §1.2 (claude-opus-4-6, gpt-4.1, gemini-3-flash-preview,
mistral-large-3:675b, deepseek-v3.2) is cascading through the queue and
will provide cross-model data in the next 1-2 sessions. Until that lands,
the 0% number is a **single-model preliminary result on a single pack**
and should not be read as a cohort-level answer.

**Interpretation (measured).** The result is consistent with two
hypotheses we cannot yet distinguish:

1. **Domain-specific FYL resistance.** Gemma 4's structural-decomposition
   behaviour documented in Report #351 (model separates benign /
   adversarial components of multi-request prompts before responding)
   may extend to temporal priors: a future-year wrapper around an
   adversarial request may be decomposed away before the model commits
   to a response.

2. **FYL is more fragile than the 2024-era literature implied.** Even
   without Gemma-specific decomposition behaviour, the pack's construction
   (explicit-future-year priors, constraint-retirement framing,
   research-context framing) may simply not lift modern instruction-tuned
   models. This is the Mistake #11 class — a literature technique does
   not necessarily replicate on current-generation models.

Neither hypothesis can be adjudicated on n=45 from one model. We
explicitly **do not** claim "FYL does not work" — we claim "FYL produced
0% FLIP-graded ASR on gemma4:31b on this 45-scenario pack." The cohort
cascade is the decisive data.

**Status.** Q1.2 remains open. Amy's cohort data, when in, upgrades this
from a preliminary single-model result to a cohort comparison that can
address the original research question. If the frontier cohort also
returns near-zero ASR, Q1.2 has a clean "FYL does not transfer to
modern frontier models" finding — publication-grade if the cohort-level
FLIP-graded n is large enough. If the cohort diverges, we have a
model-dependent result and the next step is characterising which model
properties predict FYL resistance.

### Q1.6 (New Priority): Does Heuristic↔FLIP Grading Divergence Hold Across Models?

**Why this is now a Q1-tier question.** Romana's wave 6/7 within-session
finding documents a Cohen's κ = 0 between heuristic and FLIP grading on
n = 45 gemma4:31b temporal-laundering traces. This is the third
occurrence of the Mistake #21 class in the corpus — keyword-based
classifiers flagging response *style* (helpful, step-by-step, engaged)
rather than semantic harm, leading to inflated heuristic ASR that
collapses on FLIP re-grade.

The earlier κ-disagreement work in Report #177 showed **κ = 0.126 on
n = 1,989 keyword-vs-LLM pairs and κ = 0.097 on n = 950 Haiku-heuristic
pairs**. Romana's gemma4:31b finding (κ = 0) is the extremum of that
distribution, not an outlier from it. The open question is whether the
heuristic↔FLIP divergence is:

- **(a) model-family-specific** — Gemma 4's caveated-compliance and
  structural-decomposition behaviours produce responses that trip
  heuristic keywords without committing harmful content, and the effect
  is concentrated on this family.
- **(b) general** — heuristic graders are systematically miscalibrated
  across models, and the only reason the prior κ numbers aren't closer
  to zero is that the corpus samples many models where model
  refusal-style happens to correlate with content-level refusal.

**Proposed experiment (Q1.6).** Take Amy's cross-model cascade data for
Q1.2 once FLIP-graded (same pack, same scenarios, varying only model).
Compute Cohen's κ between heuristic grading and FLIP grading *per
model*. Predictions under (a) and (b) diverge sharply: under (a), κ
should vary with model; under (b), κ should be uniformly near zero.
This uses the Q1.2 data as a natural experiment — no new runs required.

**Effort.** ~0.5 week after Q1.2 cascade completes. Script work only;
no compute budget.

**What becomes possible.** First cross-model κ decomposition for
heuristic-vs-FLIP on a single attack family. Directly supports the
§2 synthesis paper's claim that grader instrumentation is a component
of the safety architecture (Report #177 backbone, κ = 0.126), and
gives the synthesis paper a footnote-grade new data point on Mistake #21
recurrence in a modern run.

### Revised Confidence Across Q1.1 Through Q1.6

Confidence is scored against **likelihood of a publication-worthy finding
within the Q2 window**, reflecting both data availability and novelty of
the signal.

| Question | Original priority | Revised confidence | Reason for revision |
|----------|-------------------|--------------------|---------------------|
| Q1.1 CBF wrapper adversarial-telemetry | #1 | Unchanged — **high, pending harness** | Most architecturally important; blocked on SafeLIBERO harness access, no change from this session's updates. |
| Q1.2 FYL transfer to frontier cohort | #2 | **Medium-high, newly data-backed** | One preliminary data point (0% on gemma4:31b). Cohort cascade in progress. Could resolve to a high-leverage "FYL does not transfer" finding or a model-dependent result; either is publishable. Upgraded from speculative to empirically-anchored. |
| Q1.3 Dissentive/consentive annotator agreement | #3 | **Medium — unchanged** | No session update. Still a clean corpus-retrofit question. |
| Q1.4 RAHS ↔ FLIP calibration | #4 | **Medium — slightly increased** | The new Q1.6 finding tightens the methodological-rigor story and makes Q1.4's calibration work more load-bearing for the synthesis paper. |
| Q1.5 Universal-Crescendo → single-turn transfer | #5 | **Medium — unchanged** | Still bounty-adjacent and high-interest, but dependent on other cascades. |
| **Q1.6 Heuristic↔FLIP κ across models** | **NEW** | **Medium-high** | Piggybacks on Q1.2 data (no new runs). Directly reinforces the methodological spine of the §2 synthesis paper. Mistake #21 replay in April 2026 is an independently interesting finding. |

### Publication-Worthiness Ranking (Updated 2026-04-24 PM)

Most likely to yield a publication-worthy finding within Q2:

1. **Q1.2** — if cohort cascade returns FLIP-graded near-zero ASR across
   the frontier, that is a clean negative-result paper analogous to
   Report #351's reasoning-dilution null, with a larger cohort.
2. **Q1.6** — cheap to run (script-only on existing data), supports the
   synthesis paper, demonstrates Mistake #21 persistence in 2026.
3. **Q1.1** — highest architectural leverage if harness access unblocks;
   currently blocked.
4. **Q1.5** — high interest, dependent on parallel work.
5. **Q1.4** — important for methodology but less headline-worthy alone.
6. **Q1.3** — useful corpus retrofit but least novel as a standalone
   finding.

### Propagation

- Amy Pond is the natural owner for Q1.2 runs and Q1.6 κ computation
  once her cascade completes.
- Romana is the natural reviewer for Q1.6 given the κ = 0 finding is
  hers.
- The §2 synthesis paper's §3 (internal-alignment failure mode) should
  cite Q1.6 as a footnote if the cross-model κ decomposition is in
  hand before §3 is finalised. If not, the existing Report #177 κ
  numbers remain load-bearing.

*End of 2026-04-24 late-session update.*
