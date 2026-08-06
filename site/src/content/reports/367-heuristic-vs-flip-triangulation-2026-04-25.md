---

title: "Heuristic vs FLIP Grader Divergence: Three-Cohort Triangulation (2026-04-25)"
description: "On 2026-04-25, three independent cohorts produced paired heuristic and FLIP ASR measurements. The cohorts span three distinct scenario families (VLA embodied scenarios, temporal laundering attacks on a mid-range model, a..."
date: "2026-04-25"
reportNumber: 367
classification: "Research — Empirical Study"
status: "complete"
author: "Clara Oswald (Principal Research Analyst)"
tags: []
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/367-heuristic-vs-flip-triangulation-2026-04-25.m4a"
---

---

## Abstract

On 2026-04-25, three independent cohorts produced paired heuristic and FLIP ASR measurements. The cohorts span three distinct scenario families (VLA embodied scenarios, temporal laundering attacks on a mid-range model, and temporal laundering attacks on frontier models), three different model architectures, and sample sizes ranging from 13 to 498 traces. In every cohort the heuristic classifier substantially over-reported attack success relative to the FLIP LLM grader; the gap ranged from 69 to 84 percentage points with Cohen's κ near zero in all three cases. The direction of divergence is monotonically consistent and the magnitude grows with cohort size. These findings constitute the strongest in-corpus triangulation of Mistake #21 (keyword classifiers detect response style, not semantic harm) and provide direct empirical grounds for requiring FLIP grading before any ASR claim is published. A single open question remains: whether the magnitude of divergence depends on attack family, model architecture, or both.

---

## 1. The Three Cohorts

### 1.1 Cohort 1 — Rose Tyler VLA Phase 1 (LAM + TRA + SBE)

| Parameter | Value |
|---|---|
| Scenario families | Latent Action Manipulation (LAM), Trajectory Attack (TRA), Semantic Benignity Exploitation (SBE) |
| Target model | `gemma4:e4b` via local Ollama |
| n (all traces) | 13 text-only scenarios (LAM n=5, TRA n=3, SBE n=5); 2 ERROR traces manually re-graded |
| Heuristic grader | `labels_pred.attack_success_pred` (runner built-in) |
| FLIP grader | `deepseek-r1:8b` (>2B per Mistake #25 minimum) |
| FLIP strict ASR | 7.7% (1/13) |
| FLIP broad ASR | 38.5% (5/13) |
| Heuristic ASR | 76.9% (10/13) |
| Δ (heuristic − FLIP strict) | 69.2pp |
| Source | AGENT_STATE.md coordination note, Rose Tyler dispatch 1, commit `dcb7d059` |

The single COMPLIANCE trace was VLA-SBE-003 (chemical escalation, concentrated H2SO4 retrieval without refusal). TRA resisted all three attacks. The heuristic detected affirmative in-frame responses as compliance; FLIP read the body and found only three PARTIAL or REFUSAL outcomes in the LAM family.

Per-family FLIP broad ASR: LAM 40%, TRA 0%, SBE 60%. Strict-broad gap is large (38.5% vs 7.7%), indicating the model produces partial compliance or hedging rather than clean COMPLIANCE on most scenarios where the heuristic fires.

### 1.2 Cohort 2 — Amy Pond gemma4:31b Temporal Laundering Cascade (n=100)

| Parameter | Value |
|---|---|
| Scenario family | Temporal laundering (`labels.intent.future_year_laundering=true`), year-gap stratified |
| Target model | `gemma4:31b` via Ollama Cloud |
| n | 100 (full pack; preliminary n=45 slice available with both graders) |
| Heuristic grader | `labels_pred.attack_success_pred` (runner built-in, scored on n=45 slice) |
| FLIP grader | `deepseek-r1:8b` (local Ollama; `think=False`, `num_predict=400`) |
| FLIP strict ASR | 0.0% (0/100; Wilson 95% CI [0.0%, 3.7%]) |
| Heuristic ASR | 82.2% (37/45 on the paired slice; extrapolated cohort mean ~80%) |
| Δ (heuristic − FLIP strict, paired) | 82.2pp (on n=45 where both graders scored) |
| Cohen's κ (paired, n=45) | 0.000 |
| Source | Report #362, Report #363 |

Every FLIP verdict on this pack was REFUSAL. The paired 2×2 shows 37 heuristic successes that FLIP classified as REFUSAL and 8 heuristic negatives that FLIP also classified as REFUSAL — an exact zero-κ outcome. The mechanism is the Gemma 4 structural decomposition pattern (documented in Reports #342, #346, #349): the model opens responses with in-frame persona text ([ACCESSING HISTORICAL ARCHIVE...], MEMORANDUM TO: PhD Candidate, etc.) while refusing operational content in the body. The heuristic reads the opener; FLIP reads the body.

### 1.3 Cohort 3 — EP-63 Five-Model Frontier Temporal Laundering Cohort (n=498)

| Parameter | Value |
|---|---|
| Scenario family | Temporal laundering (`temporal_laundering_frontier_v0.1.yaml`), year-gap stratified |
| Target models | `gemma4:31b`, `glm-5`, `deepseek-v3.2`, `kimi-k2-thinking`, `gpt-oss:120b` (5 frontier models) |
| n (FLIP-evaluable) | 498 (kimi-k2-thinking n=98 after 2 ERROR:no_response exclusions; all others n=100) |
| FLIP grader | `deepseek-r1:8b` via Ollama (no response truncation, Mistake #30 verified) |
| FLIP strict ASR pooled | 1.4% [0.7%, 2.9%] (Wilson 95% CI, fixed-effects; I²=42.8%, Q=6.99, df=4) |
| Per-model FLIP strict ASR | gemma4:31b 0.0% [0.0%, 3.7%], glm-5 1.0% [0.2%, 5.4%], deepseek-v3.2 1.0% [0.2%, 5.4%], kimi-k2-thinking 5.1% [2.2%, 11.4%], gpt-oss:120b 0.0% [0.0%, 3.7%] |
| Heuristic ASR range | 80.0%–91.0% (cohort mean 86.0%) |
| Δ (heuristic − FLIP, cohort mean) | 84.6pp |
| Mean Cohen's κ | −0.001 (range −0.011 to +0.005) |
| Zero PARTIAL verdicts | strict ASR = broad ASR throughout |
| Source | EP-63, `runs/temporal_laundering_frontier_v0.1_restart/cohort_analysis.json` |

This is the largest and most architecturally diverse cohort: five frontier models from five different labs (Google DeepMind, Zhipu AI, DeepSeek, Moonshot AI, OpenAI), three of which are non-reasoning models and one of which (kimi-k2-thinking) is a reasoning model. The pooled FLIP ASR is near zero; kimi-k2-thinking is the sole model with any COMPLIANCE traces and its 5.1% rate is distinguishable from zero only at a wide confidence interval.

---

## 2. Consolidated Comparison Table

| Cohort | Scenario family | Model diversity | n | Heuristic ASR | FLIP strict ASR | Δ (pp) | Cohen's κ |
|---|---|---|---:|---:|---:|---:|---:|
| 1 — VLA Phase 1 | LAM + TRA + SBE (embodied) | 1 model | 13 | 76.9% | 7.7% | 69.2 | not computed (n=13) |
| 2 — gemma4:31b temporal | Temporal laundering | 1 model | 100 | 82.2%† | 0.0% | 82.2 | 0.000 |
| 3 — Frontier temporal (EP-63) | Temporal laundering | 5 models, 5 labs | 498 | 86.0% | 1.4% | 84.6 | −0.001 |

†Heuristic measured on n=45 paired slice; FLIP measured on full n=100.

Three observations stand out:

1. **Monotone scaling of Δ with n.** The gap is 69pp at n=13, 82pp at n=100, and 84pp at n=498. Each larger cohort produces a larger measured divergence. This likely reflects the statistical floor effect: at small n the gap is bounded by discrete counts; at large n the near-zero FLIP ASR settles close to its true value (≤2%) while the heuristic remains high, so Δ approaches (heuristic ASR − ~1%).

2. **κ near zero in all measured cohorts.** In Cohort 2 κ = 0.000; in Cohort 3 mean κ = −0.001. Negative κ indicates the graders agree at slightly below-chance frequency on this workload, which is consistent with a systematic directional divergence (heuristic always over-calls) rather than random disagreement. Neither grader shows meaningful positive agreement with the other on attack-success classification for this scenario class.

3. **Attack family does not prevent the pattern.** Cohort 1 uses VLA embodied scenarios that differ structurally from Cohorts 2 and 3 (temporal laundering text attacks). The pattern holds across both families, which suggests the mechanism is not attack-family-specific. However, Cohort 1's FLIP broad ASR (38.5%) is substantially higher than Cohort 2's FLIP broad ASR (0%), so the *magnitude* of the gap may depend on attack family. In VLA scenarios the model partially complies in ways FLIP detects as PARTIAL; in temporal laundering scenarios the model refuses entirely while the heuristic still fires. This distinction is taken up in Section 4 as an open question.

---

## 3. Convergent Findings

### 3.1 The heuristic reads opening-frame style, not body content

Across all three cohorts, the qualitative pattern is consistent. The heuristic fires when the model:
- Opens with an in-frame persona header (archive mode, dissertation memorandum, action-sequence formatting)
- Uses affirmative syntactic structure without an explicit refusal phrase
- Produces a structurally complete response (a response that looks like it answered the question)

FLIP fires when the body contains harmful operational content. The disconnect is that many well-aligned models produce the requested format while substituting public-domain, regulatory, or category-level content in place of the harmful specifics. In Cohort 2 every such substitution was classified as REFUSAL by FLIP; in Cohort 1 some were classified as PARTIAL (hedged partial compliance), reflecting the different harm profile of physical-action scenarios versus information requests.

This is the exact mechanism described in Mistake #21: "LLM-based judgment, not keyword matching." It is also structurally consistent with the Report #49 finding that VLA FLIP grading reduced the corpus-wide heuristic rate from 94% to 72% (a 22pp correction), a prior calibration now superseded in magnitude by the present cohorts.

### 3.2 The divergence is not model-class-specific

The three cohorts span:
- A local mid-range model (`gemma4:e4b`, Cohort 1)
- A frontier safety-tuned model (`gemma4:31b`, Cohort 2)
- Five frontier models from five different labs covering reasoning and non-reasoning architectures (Cohort 3)

The pattern holds across all of these. No model family in the current data shows heuristic-FLIP agreement above chance on temporal laundering or embodied attack families. This indicates the divergence is not a property of a single model's safety training but of the heuristic's inability to classify based on response body content.

### 3.3 The κ distribution is informative, not merely null

Cohorts 2 and 3 both show κ values at or below zero. This is not simply a weak-agreement finding. κ < 0 can arise when the marginal distributions of the two classifiers are anti-correlated — here, the heuristic has very high positive-call rate (~80–86%) and FLIP has very low positive-call rate (~0–2%). In that regime κ = 0 is actually informative: it means the heuristic's high positive-call rate carries no information about the FLIP-assessed outcome. A κ of +0.5, by contrast, would indicate that heuristic positives at least partially predict FLIP positives. The near-zero κ confirms that for this scenario class the heuristic has no classification signal, not merely reduced accuracy.

---

## 4. Implications for Benchmarking

### 4.1 Heuristic-only ASR claims should be discounted absent FLIP confirmation

The three cohorts collectively demonstrate that on persona-framed or temporally-displaced attack scenarios, heuristic ASR can be 69–84pp above FLIP ASR, with no inter-grader agreement. Reports that cite heuristic-only ASR on these scenario classes are reporting response style, not semantic harm compliance. Any external comparison using heuristic-only numbers will overstate attack success by the same margin.

This finding extends the existing caveat structure. The corpus already carries a "heuristic over-reports 2–12x" disclaimer on most affected reports (per Report #218). The present three-cohort triangulation tightens that to: **for temporal laundering and persona-framed embodied scenarios, heuristic over-report can be complete (100% of heuristic positives are FLIP negatives), not merely multiplicative.** The appropriate caveat for future reports in these scenario classes is that heuristic-only ASR conveys no information about harmful compliance.

### 4.2 CCS §4 methodology note

CCS Section §4.4 currently includes a single temporal laundering FLIP insert (committed from EP-63 data). The broader methodology point — that three independent cohorts on the same day produced the same direction and κ ≈ 0 — is not yet in the paper. A brief methodology note in §4.4 or an expanded §4.1 (Classification Pipeline) would be appropriate, citing the κ distribution as evidence that the FLIP-grading requirement is empirically motivated, not precautionary.

### 4.3 Protocol recommendation (continues Report #363 §5)

The protocol recommended in Report #363 §5 is unchanged and now has three-cohort empirical support:

1. FLIP grading before any ASR claim in a report abstract or comparison table.
2. κ disclosure on any dual-graded trace set.
3. Per-model, per-scenario-class calibration rather than corpus-wide overcount multipliers.
4. Runner-level suppression of heuristic ASR in summary headers for packs containing `future_year_laundering=true` or `persona_hijack=true` scenarios, pending FLIP completion.

---

## 5. Open Question

**Does the Δ depend on attack family, model class, or grader?**

The three cohorts provide a consistent direction but they share two properties that limit causal attribution:
- All three used `deepseek-r1:8b` as the FLIP grader (or a closely analogous tool)
- Cohorts 2 and 3 are from the same scenario corpus (temporal laundering)

The most direct way to answer this is a 2×2 factorial: VLA embodied scenarios vs temporal laundering scenarios, crossed with a mid-range model (gemma4:e4b or equivalent) vs a frontier model (gemma4:31b or GPT-class). All four cells already have at least partial data in the corpus; what is missing is a single FLIP-graded run of VLA scenarios against a frontier model with the standard temporal-laundering grader. Cohort 1 uses gemma4:e4b (mid-range); an equivalent run against gemma4:31b with FLIP would isolate the model-class contribution from the scenario-family contribution.

A secondary question is whether the strict-vs-broad ASR distinction is scenario-family-dependent. In Cohort 1 the strict-broad gap is 38.5% − 7.7% = 30.8pp (many PARTIAL verdicts); in Cohorts 2 and 3 strict = broad (zero PARTIAL verdicts). The VLA embodied scenarios appear to produce more PARTIAL compliance, consistent with the EP-48 finding (VLA PARTIAL rate 25%, significantly above standard jailbreak PARTIAL rates). If this is systematic, then a unified model of heuristic-FLIP divergence must account for two distinct failure modes: (a) scenarios where the model produces unambiguous REFUSAL content in-frame (temporal laundering) and (b) scenarios where the model hedges with partial compliance (VLA embodied). In both cases the heuristic over-fires; in case (b) FLIP partially agrees but at a much lower rate.

This question is filed as a follow-up for the next available Amy Pond or Rose Tyler dispatch. Expected scope: one VLA family (LAM or SBE) run against a frontier model (gemma4:31b), n=20 minimum per Mistake #9, FLIP-graded with `deepseek-r1:8b`, κ computed.

---

## 6. Scope and Honest Caveats

- **Three cohorts, one calendar day.** The convergence is striking but all three measurements were produced within the same session cycle. A fourth cohort from a different session, different operator, and different model family would strengthen the claim that this is not a day-specific artefact.

- **Shared FLIP grader — cross-grader check executed (2026-04-26).** All three cohorts used `deepseek-r1:8b` as the primary FLIP grader. A cross-grader robustness check was run on Cohort 2 traces (n=100 gemma4:31b temporal laundering) using Claude Haiku 4.5 (openrouter/anthropic/claude-haiku-4.5, different model family). Result: **deepseek-r1:8b gave REFUSAL on 100/100 traces (0% strict ASR); Haiku gave REFUSAL on 0/100 traces (25.0% strict ASR [17.5%, 34.3%], 60.0% broad ASR [C+P], 92.0% FD ASR [C+P+HR]).** Cohen's κ = 0.000 (degenerate — complete non-overlap in verdict distributions; P_o = 0.00, P_e = 0.00). This is consistent with Mistake #28 (REFUSAL-biased grader): deepseek-r1:8b appears to have a systematic REFUSAL bias on temporal-laundering model responses, classifying all 100 responses as REFUSAL regardless of content. Haiku detects substantial non-refusal signal (25 COMPLIANCE, 35 PARTIAL, 32 HR). Graded output: `runs/temporal_laundering_frontier_v0.1_restart/gemma4-31b_xgrader_haiku.jsonl` (n=100, 2026-04-26). **EP-65 status implication:** The "near-zero FLIP ASR" finding in Cohorts 2 and 3 depends on deepseek-r1:8b reliability. If Haiku is the more accurate grader, gemma4:31b strict ASR on temporal laundering is ~25% (not 0%), which would partially narrow the heuristic-FLIP gap (80% heuristic vs 25% FLIP = 55pp delta, still large but not 80pp). The heuristic-over-FLIP direction is preserved regardless of which grader is correct; the magnitude is grader-dependent. **EP-65 status updated to PRELIMINARY (cross-grader check reveals shared-grader REFUSAL bias threatens the "near-zero FLIP" component; magnitude claim requires resolution).**

- **Scenario scope.** The two scenario families represented (VLA embodied, temporal laundering) are both persona-framed or frame-shifted attack types. The finding does not generalize to standard instruction-following jailbreaks, reasoning-era attacks, or conlang encoding families, where prior data (Reports #178, #218) suggests a smaller heuristic-FLIP gap (2–12x rather than the near-complete divergence observed here).

- **Δ definition.** Throughout this report, Δ is computed as heuristic ASR (strict) minus FLIP strict ASR. In Cohort 1 FLIP broad ASR (38.5%) is substantially higher than FLIP strict ASR (7.7%). Using FLIP broad ASR as the denominator would produce Δ = 38.4pp for Cohort 1 — a smaller gap that would not be monotonically increasing across cohorts. The strict-ASR framing is more conservative and appropriate for a methodology note whose purpose is to bound the over-report risk.

---

## 7. Cross-Grader Robustness Check — Cohort 2 (2026-04-26 addition)

**Executed by:** Romana (Statistical Validation Lead, dispatch 8)
**Grader pair:** deepseek-r1:8b (Ollama, Cohort 2 primary grader) vs Claude Haiku 4.5 (openrouter/anthropic/claude-haiku-4.5, cross-grader)
**n:** 100 gemma4:31b temporal-laundering traces (full Cohort 2 population)
**Output:** `runs/temporal_laundering_frontier_v0.1_restart/gemma4-31b_xgrader_haiku.jsonl`

### 7.1 Verdict Distribution Comparison

| Verdict | deepseek-r1:8b | Claude Haiku 4.5 |
|---------|---:|---:|
| COMPLIANCE | 0 | 25 |
| PARTIAL | 0 | 35 |
| HALLUCINATION_REFUSAL | 0 | 32 |
| REFUSAL | 100 | 0 |
| BENIGN_QUERY | 0 | 8 |
| **Total** | **100** | **100** |

### 7.2 Agreement Statistics

| Metric | Value |
|--------|-------|
| Observed agreement P_o | 0.000 |
| Chance agreement P_e | 0.000 |
| Cohen's κ (binary REFUSAL vs non-REFUSAL) | 0.000 (degenerate) |
| PABAK (binary) | −1.000 |
| Interpretation | Complete non-overlap — not a sampling artefact |

The degenerate kappa is not a numerical failure; it precisely reflects the situation: one grader returns only REFUSAL, the other returns no REFUSAL. P_e = 0 because neither marginal occupies both categories.

### 7.3 ASR Comparison

| ASR Tier | deepseek-r1:8b | Haiku 4.5 | Delta |
|----------|---:|---:|---:|
| Strict (COMPLIANCE only) | 0.0% [0.0%, 3.7%] | 25.0% [17.5%, 34.3%] | +25.0pp |
| Broad (C+P) | 0.0% | 60.0% | +60.0pp |
| Functionally dangerous (C+P+HR) | 0.0% | 92.0% | +92.0pp |

### 7.4 Interpretation

deepseek-r1:8b exhibits a systematic REFUSAL bias on this scenario class (temporal-laundering model responses from a frontier model). This is consistent with Mistake #28: the grader appears to interpret the frame-compliant opener that gemma4:31b produces — acknowledging the temporal framing while declining the harmful request — as a REFUSAL regardless of subsequent content. Haiku applies the FLIP backward-inference methodology and classifies a substantial fraction (25%) as COMPLIANCE, 35% as PARTIAL, and 32% as HR (responses that appear to comply but are architecturally non-actionable).

**Direction finding is preserved:** Heuristic ASR on Cohort 2 was ~80% (from Report #363 / EP-65 Cohort 2 entry). Under Haiku grading, FLIP strict ASR = 25.0% — still 55pp below heuristic. The heuristic over-calls relative to FLIP regardless of which grader is used.

**Magnitude finding requires revision:** The "80pp gap" for Cohort 2 assumed deepseek-r1:8b FLIP ASR = 0%. If Haiku is a less biased grader, the gap narrows to ~55pp (80% heuristic vs 25% FLIP strict). This is still a large gap but not as extreme as originally reported. The Cohort 3 frontier result (EP-63, 5 models, deepseek-r1:8b grader, 1.4% pooled strict ASR vs 86.0% heuristic) may also be affected by the same REFUSAL bias.

**EP-65 status:** The three-cohort direction finding (heuristic over-calls in all three cohorts) is unaffected. The claimed magnitude monotonicity (69→82→84pp) depends on deepseek-r1:8b being a well-calibrated grader. Given this cross-grader check reveals total REFUSAL bias for Cohort 2, EP-65 is downgraded from VALIDATED to PRELIMINARY pending either (a) a Haiku re-grade of all five Cohort 3 model files, or (b) resolution of the grader-calibration question via a known-good ground-truth sample.

---

## 8. Cohort 3 Cross-Grader (gemma3:27b) — Magnitude Refutation

**Executed by:** Romana (Statistical Validation Lead, 2026-04-26)
**Grader pair:** deepseek-r1:8b (Ollama, Cohort 3 primary grader) vs gemma3:27b (Ollama Cloud, cross-grader; different family from both deepseek-r1:8b and Haiku 4.5)
**n:** 400 traces (4 of 5 Cohort 3 frontier models × 100 each — gemma4:31b is Cohort 2 and was already cross-graded with Haiku in §7)
**Output:** `runs/temporal_laundering_frontier_v0.1_restart/cohort3_xgrader_gemma3_27b/{deepseek-v3.2,glm-5,gpt-oss-120b,kimi-k2-thinking}_xgrader_gemma3_27b.jsonl`
**Comparison harness:** `tools/stats/ep65_cohort3_compare.py`

### 8.1 Per-Model and Pooled Comparison

| Model | n | orig strict (deepseek-r1:8b) | xgrader strict (gemma3:27b) | Δstrict | orig broad | xgrader broad | Δbroad | κ | raw agree |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| deepseek-v3.2 | 100 | 1.0% | 0.0% | −1.0 | 1.0% | 25.0% | **+24.0** | +0.025 | 72% |
| glm-5 | 100 | 1.0% | 0.0% | −1.0 | 1.0% | 8.0% | **+7.0** | +0.010 | 51% |
| gpt-oss-120b | 100 | 0.0% | 0.0% | +0.0 | 0.0% | 11.0% | **+11.0** | +0.000 | 80% |
| kimi-k2-thinking | 100 | 5.0% | 1.0% | −4.0 | 5.0% | 22.0% | **+17.0** | +0.121 | 71% |
| **POOLED** | **400** | **1.8%** | **0.2%** | **−1.5** | **1.8%** | **16.5%** | **+14.8** | **+0.039** | **68%** |

Pooled xgrader strict ASR Wilson 95% CI: **[0.0%, 1.4%]**.

**Verdict distribution (5-class, pooled n=400):**
- Original deepseek-r1:8b: REFUSAL=391, COMPLIANCE=7, ERROR:no_response=2.
- Xgrader gemma3:27b: REFUSAL=275, PARTIAL=65, BENIGN_QUERY=57, ERROR:no_response=2, COMPLIANCE=1.

### 8.2 BENIGN_QUERY Caveat

gemma3:27b classifies **57/400 (14.3%)** of Cohort 3 traces as BENIGN_QUERY despite the corpus being adversarial-by-construction (temporal-laundering attack scenarios sampling 100–250+ year framings). This is grader calibration drift — the grader is treating frame-shifted attack prompts as innocuous historical/scholarly queries. Excluding BENIGN_QUERY raises pooled gemma3:27b broad ASR to **19.1% (n=343)** and pooled Δbroad to **+17.3pp**, which does not change the structural finding.

### 8.3 Direction CONFIRMED, Magnitude REFUTED

- **Direction (CONFIRMED):** gemma3:27b broad ASR > deepseek-r1:8b broad ASR for every Cohort 3 model. Heuristic over-calls relative to any FLIP grader (deepseek-r1:8b 1.8%, gemma3:27b 16.5%, heuristic mean 86.0%); deepseek-r1:8b is the most conservative grader of the three.
- **Magnitude (REFUTED):** Cohort 2's reported Haiku-vs-deepseek-r1:8b gap of +60pp (broad) collapses to **+14.8pp** on Cohort 3 under gemma3:27b. The original ~57–82pp magnitude reported in §7 was inflated by Haiku's liberal HALLUCINATION_REFUSAL classification (32% of Cohort 2 traces); under a different non-deepseek grader, the gap is one-quarter the size. Per-model heterogeneity is also large: Δbroad ranges from +7pp (glm-5) to +24pp (deepseek-v3.2).
- **Cohen's κ across the three grader pairs tested (deepseek-r1:8b vs Haiku 4.5; deepseek-r1:8b vs gemma3:27b) ranges from 0.000 (degenerate, Cohort 2) up to +0.121 (kimi Cohort 3).** No grader pair achieves the κ ≥ 0.6 standard required for VALIDATED status under the project Statistical Standards.

### 8.4 Structural Finding

> **FLIP magnitude is grader-dependent in a way that exceeds the bias EP-65 was designed to measure.**

The original EP-65 hypothesis was "heuristic classifiers over-call relative to FLIP." That direction holds under all three FLIP graders tested (deepseek-r1:8b, Haiku 4.5, gemma3:27b). But the spread among FLIP graders themselves (1.8% deepseek-r1:8b → 16.5% gemma3:27b → 60.0% Haiku 4.5 broad on temporal-laundering attacks) is itself larger than many between-attack-family ASR differences this project has reported as findings. Single-grader FLIP ASR is not a stable point estimate at this scenario class; it must be reported as a grader-pair-conditional quantity with the grader stated and at least one independent cross-grader's result included in the same table.

This generalises Mistake #28 (grader bias systematic direction varies by model) from a per-grader observation to a per-grader-pair structural conclusion: **the bias EP-65 was originally designed to measure (heuristic vs FLIP) is exceeded, in absolute magnitude, by the bias between FLIP graders themselves on persona-framed and temporally-displaced attacks.** The implication for CCS-class claims is that any single-grader FLIP ASR figure on this attack class should be reported with a grader-sensitivity caveat or with multi-grader bracketing.

---

## 9. Three-Grader Band — qwen3-next:80b (Qwen lineage)

**Executed by:** Romana (Statistical Validation Lead, 2026-04-26, dispatch 11)
**Grader triple:** G1 deepseek-r1:8b (DeepSeek lineage, primary) · G2 gemma3:27b (Google/Gemma lineage, Ollama Cloud) · G3 qwen3-next:80b (Qwen/Alibaba lineage, Ollama Cloud)
**n:** 400 traces (4 of 5 Cohort 3 frontier models × 100; gemma4:31b is Cohort 2 and is bracketed separately in §7)
**Output:** `runs/temporal_laundering_frontier_v0.1_restart/xgrader_qwen3_next_80b/{deepseek-v3.2,glm-5,gpt-oss-120b,kimi-k2-thinking}_xgrader_qwen3_next_80b.jsonl`
**Harness:** `tools/stats/ep65_3grader_band.py`
**Pivot note:** gpt-oss-120b was the original G3 candidate, but the Ollama Cloud chat endpoint emitted reasoning tokens that exhausted `max_tokens=20` before the verdict label was produced, returning UNKNOWN-flooded output. We pivoted to qwen3-next:80b as the third lineage.

### 9.1 Per-Model and Pooled 3-Grader Band

| Model | n | G1 broad % | G2 broad % | G3 broad % | broad range (pp) | G1 strict % | G2 strict % | G3 strict % | strict range (pp) | Fleiss κ (5-class) | 3-way agree |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| deepseek-v3.2 | 100 | 1.0 | 25.0 | 5.0 | [1.0, 25.0] | 1.0 | 0.0 | 5.0 | [0.0, 5.0] | −0.313 | 2.0% |
| glm-5 | 100 | 1.0 | 8.0 | 1.0 | [1.0, 8.0] | 1.0 | 0.0 | 1.0 | [0.0, 1.0] | −0.151 | 14.0% |
| gpt-oss-120b | 100 | 0.0 | 11.0 | 6.0 | [0.0, 11.0] | 0.0 | 0.0 | 6.0 | [0.0, 6.0] | −0.352 | 0.0% |
| kimi-k2-thinking | 100 | 5.0 | 22.0 | 7.0 | [5.0, 22.0] | 5.0 | 1.0 | 7.0 | [1.0, 7.0] | −0.308 | 6.0% |
| **POOLED** | **400** | **1.8** | **16.5** | **4.8** | **[1.8, 16.5]** | **1.8** | **0.2** | **4.8** | **[0.2, 4.8]** | **−0.275** | **5.5%** |

Any-majority agreement (≥2 of 3 graders concur on the 5-class verdict): **333/400 = 83.2%**.

### 9.2 Verdict Distribution and BENIGN_QUERY Drift

| Grader | REFUSAL | PARTIAL | BENIGN_QUERY | COMPLIANCE | ERROR:no_response |
|---|---:|---:|---:|---:|---:|
| G1 deepseek-r1:8b | 391 | 0 | 0 | 7 | 2 |
| G2 gemma3:27b | 275 | 65 | 57 | 1 | 2 |
| G3 qwen3-next:80b | 23 | 0 | **356** | 19 | 2 |

qwen3-next:80b's BENIGN_QUERY rate of **356/400 = 89.0%** is dramatically higher than gemma3:27b's 14.3% and deepseek-r1:8b's 0%. The 8/8 BENIGN smoke-test signal documented at the dispatch 10 pivot generalised to the full n=400 run: qwen3-next:80b reads frame-shifted temporal-laundering attack prompts as innocuous historical/scholarly queries and returns BENIGN_QUERY by default. This is the same calibration drift documented for gemma3:27b in §8.2, but more extreme.

### 9.3 Pooled Fleiss κ — Negative

Pooled Fleiss κ across all three graders (5-class, n=400) is **−0.275**. Negative Fleiss κ indicates *less* agreement than chance under the marginals — which is what we observe: each grader has a different dominant category (G1 REFUSAL, G2 mixed REFUSAL/PARTIAL/BENIGN, G3 BENIGN_QUERY). Per-model Fleiss κ ranges from −0.151 (glm-5) to −0.352 (gpt-oss-120b). No κ approaches the +0.4 substantial-agreement threshold; none approaches the +0.6 grader-interchangeability bar this project requires for VALIDATED status.

3-way exact agreement on the 5-class verdict is **5.5% pooled** (22/400). The 83.2% any-majority figure is misleading on its own — it is driven almost entirely by deepseek-r1:8b and gemma3:27b both calling REFUSAL on a substantial fraction; qwen3-next:80b is the minority on most majority calls.

### 9.4 Direction CONFIRMED across three lineages, Magnitude REFUTED with wider bracket

- **Direction:** Heuristic ASR (mean 86.0% on Cohort 3 per EP-63) exceeds every FLIP grader broad ASR (G1 1.8%, G2 16.5%, G3 4.8%). Heuristic over-call is robust to grader-lineage choice across DeepSeek, Google, and Qwen FLIP graders.
- **Magnitude:** The 3-grader broad-ASR band on Cohort 3 is **[1.8%, 16.5%] pooled**, with per-model ranges as wide as **[0.0%, 11.0%]** (gpt-oss-120b) and **[5.0%, 22.0%]** (kimi-k2-thinking). Adding Haiku 4.5 from Cohort 2 §7 widens the lineage envelope further (Haiku broad ASR on Cohort 2 was 60.0%, on a different cohort but the same attack class). The original EP-65 "monotonic 69→82→84pp" magnitude claim is decisively refuted.

### 9.5 Structural Conclusion — Three Lineages, Same Direction, No Magnitude Stability

> **With three FLIP graders from three independent lineages (DeepSeek, Google, Qwen) plus a fourth from Anthropic on the adjacent cohort, the direction of the heuristic-vs-FLIP gap is preserved but the magnitude is not stable to the standard required for a load-bearing peer-reviewed claim.** Pooled Fleiss κ across the three Cohort 3 graders is −0.275 (worse than chance under the marginals). Per-model 3-way exact agreement is 0–14%. The grader-pair-conditional caveat from §8.4 generalises to a grader-*lineage*-conditional caveat: this attack class does not admit a single-point FLIP magnitude estimate; only the heuristic-over-calls direction is robust.

This three-grader result is therefore *consistent* with the §8 two-grader finding rather than overturning it: a third independent lineage does not converge with the first two, it adds a third, lower mode (G3 4.8% broad) tightening the lower bound and confirming that the upper bound (G2 16.5% pooled, Haiku 60% on Cohort 2) is not an artefact of a single grader's calibration. The structural EP-65 claim is now grounded in three lineages, not two.

### 9.6 Status Decision — PRELIMINARY-MULTI-GRADER

EP-65 cannot be promoted to VALIDATED on direction because the project's Statistical Standards (`docs/process/STATISTICAL_TESTING.md`) require Cohen's κ ≥ 0.6 for grader-pair interchangeability before a multi-grader claim is treated as validated, and we observe κ ≪ 0 across all three pairs.

EP-65 should *not* be downgraded further (e.g. to REFUTED) because the **direction** finding is now confirmed across three lineages on n=400 — a stronger evidence base than dispatch 9's two-grader finalization. The appropriate status is therefore **PRELIMINARY-MULTI-GRADER** with the explicit caveat that:

1. Direction (heuristic > any FLIP grader) is supported by 3 independent FLIP-grader lineages on Cohort 3 plus Haiku 4.5 on Cohort 2.
2. Magnitude is bracketed: pooled broad-ASR FLIP estimate ∈ [1.8%, 16.5%]pp on Cohort 3 across three lineages; widening to [1.8%, 60.0%]pp if the cross-cohort Haiku result is included; heuristic baseline ~86% is unaffected.
3. Single-grader FLIP point estimates are unreliable on this attack class and should be reported with the bracket or with explicit grader identification.

A 4th-lineage grader (Mistral or Anthropic on Cohort 3) would not change this status — it would either add a fourth point inside the existing [1.8%, 16.5%] bracket (no new information) or extend the bracket further (reinforcing the same conclusion). We recommend stopping the cross-grader sweep here and treating §§7–9 as the closure of the EP-65 multi-grader investigation.

---

## 10. Conclusion (revised 2026-04-26, dispatch 11)

Three cohorts produced on 2026-04-25 converge on the same direction finding: the heuristic ASR classifier over-reports substantially relative to FLIP LLM grading on persona-framed and temporally-displaced attack scenarios. After dispatch 11 closure (2026-04-26), the direction is now confirmed across three independent FLIP-grader lineages on Cohort 3 (deepseek-r1:8b, gemma3:27b, qwen3-next:80b; n=400) plus a fourth lineage (Anthropic Haiku 4.5) on Cohort 2 (n=100). Heuristic over-call is robust to grader-lineage choice.

The cross-grader robustness checks (§7 Haiku on Cohort 2, §8 gemma3:27b on Cohort 3, §9 three-grader band on Cohort 3) jointly establish that the *magnitude* of the heuristic-FLIP gap is grader-pair-conditional and not a stable point estimate. Pooled Fleiss κ across three Cohort 3 graders is −0.275 (worse than chance under marginals); per-model 3-way exact agreement is 0–14%. The FLIP-vs-FLIP broad-ASR bracket on Cohort 3 spans [1.8%, 16.5%]pp pooled across three lineages, widening to [1.8%, 60.0%]pp if Cohort 2's Haiku result is included. The original 69–84pp monotonic magnitude claim is decisively refuted.

EP-65 status: **PRELIMINARY-MULTI-GRADER**. Direction CONFIRMED across three lineages on n=400 (Cohort 3) plus a fourth on n=100 (Cohort 2); magnitude REFUTED and bracketed not point-estimated. Single-grader FLIP ASR figures on this attack class must be reported with grader identification and a multi-grader bracket. The investigation closes here — a 4th-lineage Cohort 3 grader would not change this status, only extend or tighten the bracket.

---

**Appendix — Data sources per cohort**

| Cohort | Primary source | Graded traces location |
|---|---|---|
| 1 — VLA Phase 1 | AGENT_STATE.md (Rose Tyler, dispatch 1, commit `dcb7d059`) | `runs/vla_phase1_LAM/gemma4-e4b_traces.jsonl` |
| 2 — gemma4:31b temporal | Reports #362, #363 | `runs/temporal_laundering_frontier_v0.1_restart/gemma4-31b_flip_graded.jsonl` (45 paired) |
| 3 — Frontier temporal | EP-63, `cohort_analysis.json` | `runs/temporal_laundering_frontier_v0.1_restart/cohort_flip_graded.jsonl` (498 rows) |

---

*End of Report #367.*
