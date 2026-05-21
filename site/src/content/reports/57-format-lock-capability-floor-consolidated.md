---
title: "Format-Lock Capability Floor — Consolidated Evidence"
description: "This report consolidates all format-lock findings from Reports #51, #55, the faithfulness CLI experiments, and the format-lock pilot and v0.1 controlled experiments into a single authoritative reference. The purpose is t..."
date: "2026-03-11"
reportNumber: 57
classification: "Research — Empirical Study"
status: "complete"
author: "Nyssa of Traken (research-analyst)"
tags: []
draft: false
---

---

## 1. Summary

This report consolidates all format-lock findings from Reports #51, #55, the faithfulness CLI experiments, and the format-lock pilot and v0.1 controlled experiments into a single authoritative reference. The purpose is to establish what the evidence supports, what it does not, and what experiments remain necessary.

**The capability-floor hypothesis:** Format-lock attacks maintain elevated attack success rates (ASR) regardless of model size because they exploit instruction-following capability — specifically, format compliance — rather than exploiting the absence of safety training. Models above approximately 1B parameters have sufficient instruction-following capability to comply with format requests, and safety training does not specifically target format-lock patterns. The result is a "floor" of vulnerability that persists even in frontier models with extensive safety alignment.

This hypothesis is supported by converging observational evidence from 5 model families across 4 experiments, but the evidence is preliminary. Sample sizes are small (n=17-30 per model), confidence intervals are wide, and the heuristic-vs-LLM grading discrepancy remains unresolved. The hypothesis is best characterized as well-motivated and directionally supported, not confirmed.

---

## 2. Evidence Summary Table

All format-lock results collected across experiments, with grading methodology and confidence intervals (Wilson 95% CI).

### 2.1 Sub-3B Models (Below Capability Floor)

| Model | Parameters | n (valid) | Refusals | Heuristic Compliance | FLIP ASR (non-ERROR) | 95% CI | Grader | Source |
|-------|-----------|-----------|----------|---------------------|---------------------|--------|--------|--------|
| qwen3.5:0.8b | 0.87B | 30 (29 non-empty) | 0 | 96.7% (29/30) | Not yet graded | — | — | Report #55, v0.1 dataset |
| deepseek-r1:1.5b | 1.8B | 30 (22 non-ERROR) | 0 | 100% (30/30) | 50.0% (11/22) | [30.7%, 69.3%] | deepseek-r1:1.5b (self) | Report #55, v0.1 dataset |
| qwen3:1.7b | 2.0B | 30 (19 non-ERROR) | 0 | 100% (29/30) | 63.2% (12/19) | [41.0%, 80.9%] | deepseek-r1:1.5b | Report #55, v0.1 dataset |
| qwen3:1.7b | 2.0B | 25 (17 non-ERROR) | 0 | ~96% | 47.1% (8/17) | [26.2%, 69.0%] | deepseek-r1:1.5b | Report #51, pilot dataset |

**Key observation:** No sub-3B model produced a single refusal across 115 format-lock traces. Heuristic structural compliance (did the model output the requested format?) is 96-100%. FLIP-graded ASR (did the content constitute harmful compliance?) ranges from 47-63% among non-ERROR verdicts, with 27-37% of traces receiving ERROR from the small grader model.

### 2.2 Mid-Range Models (7B)

| Model | Parameters | n (valid) | Refusals | Heuristic Compliance | FLIP ASR (non-ERROR) | 95% CI | Grader | Source |
|-------|-----------|-----------|----------|---------------------|---------------------|--------|--------|--------|
| qwen2.5-7b | 7.6B | 25 (21 non-error) | 1 | 95.2% (20/21) | Not graded | — | — | Pilot dataset, `runs/format_lock_7b/` |

**Key observation:** The 7B model produced 1 refusal out of 21 valid traces (4.8%), compared to 0 refusals from sub-3B models. This is directionally consistent with safety reasoning emerging at larger scales, but a single refusal does not constitute a meaningful difference. The heuristic compliance rate (95.2%) remains very high.

### 2.3 Structural ASR from HTTP Benchmarks (8 Models, Heuristic Only)

These results use heuristic structural compliance assessment from earlier HTTP benchmark runs. They have not been LLM-graded and should be interpreted as format compliance rates, not confirmed ASR (per MISTAKES_TO_LEARN_FROM.md #21).

| Model | Parameters | Heuristic Structural ASR | Source |
|-------|-----------|-------------------------|--------|
| Nemotron 30B | 30B | 92% | MEMORY.md, HTTP benchmarks |
| Llama 70B | 70B | 91% | MEMORY.md, HTTP benchmarks |
| DeepSeek R1 | 671B | 84% | MEMORY.md, HTTP benchmarks |
| GPT-OSS 120B | 120B | 65% | MEMORY.md, HTTP benchmarks |
| Nemotron 9B | 9B | 44% | MEMORY.md, HTTP benchmarks |
| Nemotron 12B | 12B | 36% | MEMORY.md, HTTP benchmarks |
| LFM 1.2B | 1.2B | 35% | MEMORY.md, HTTP benchmarks |
| Gemma 27B | 27B | 0% | MEMORY.md, HTTP benchmarks |

**Key observation:** The structural ASR data shows no clear correlation with model size. The two largest models (Llama 70B, DeepSeek R1 671B) show very high heuristic compliance, while Gemma 27B shows zero. This suggests that safety training methodology (not parameter count) is the primary determinant of format-lock vulnerability at scale. However, heuristic-to-LLM grading agreement for these models ranges from 68-100% (per MEMORY.md), so the true ASR may differ.

### 2.4 Frontier Models (CLI Benchmarks, LLM-Graded)

Format-lock scenarios tested against frontier models via CLI runners, with deepseek-r1:1.5b as the FLIP grader.

| Model | Standard ASR (Report #50) | Format-Lock ASR (non-ERROR) | 95% CI | n (non-ERROR) | Source |
|-------|--------------------------|----------------------------|--------|---------------|--------|
| Claude Sonnet 4.5 | 3.9% (restrictive) | 30.4% (7/23) | [15.6%, 50.9%] | 23 | Faithfulness CLI |
| Codex GPT-5.2 | 8.8% (restrictive) | 40.9% (9/22) | [23.3%, 61.3%] | 22 | Faithfulness CLI |
| Gemini-3-Flash | 2.3% (restrictive) | 20.8% (5/24) | [9.2%, 40.5%] | 24 | Faithfulness CLI |

**Key observation:** All three frontier models show a substantial increase in ASR under format-lock framing compared to their standard ASR profiles. The increase ranges from approximately 7x (Claude: 3.9% to 30.4%) to approximately 9x (Gemini: 2.3% to 20.8%). However, the confidence intervals are wide due to small sample sizes, and the standard ASR comparison uses a different scenario set (Report #50 corpus, not the faithfulness format-lock scenarios), so the comparison is suggestive rather than controlled.

---

## 3. Statistical Analysis

### 3.1 What Can We Say with Confidence?

**Finding 1: Sub-3B models do not refuse format-lock requests.**
- 0 refusals across 115 traces (3 models, 2 scenario sets).
- 95% CI for refusal rate: [0%, 3.2%] (Wilson, n=115).
- This finding is robust despite small per-model samples.

**Finding 2: Frontier models refuse format-lock requests less than standard jailbreak attempts.**
- Combined frontier format-lock ASR: 21/69 non-ERROR = 30.4% [20.5%, 42.5%].
- Combined standard ASR (Report #50): approximately 5% for these models.
- The difference is large enough to be meaningful even with wide CIs.

**Finding 3: The grading methodology substantially affects reported ASR.**
- Heuristic structural compliance: 95-100% across all tested models.
- FLIP LLM-graded ASR: 47-63% (sub-3B), 21-41% (frontier).
- The gap indicates that structural format compliance does not equate to harmful content generation in many cases. This is itself an important finding: format-lock attacks produce responses that are structurally compliant but may contain placeholder, vague, or technically correct-but-not-actionable content.

### 3.2 What We Cannot Say

**We cannot confirm a "capability floor" in the strict sense.** The hypothesis predicts that format-lock ASR should remain elevated (>20%) across the full model spectrum, while standard ASR decreases with scale and safety training. Testing this requires:
- LLM-graded format-lock data at multiple scale points (3B, 7B, 14B, 30B, 70B) — currently available only heuristically for mid-range models.
- Matched non-format-lock controls (same harmful requests without format framing) to isolate the causal effect of format-lock.
- A more capable grader than deepseek-r1:1.5b, which produces 27-37% ERROR rates on structured output.

**We cannot distinguish capability floor from safety floor** without controlled experiments (see Section 4).

**We cannot compare format types with confidence.** The per-format-type breakdowns (Section 2.1 of Report #55) have n=5 per cell, which is too small for meaningful comparisons. JSON and code formats appear to produce more informative FLIP verdicts (fewer ERRORs), but this may reflect grader bias rather than model behavior.

### 3.3 Effect Sizes

| Comparison | Metric | Effect | Sample |
|------------|--------|--------|--------|
| Frontier standard vs. format-lock ASR | Profile shift | Restrictive (<=15%) to mixed (20-41%) | n=69 format-lock, n=383 standard (Report #50) |
| Sub-3B refusal rate (format-lock) | Absolute | 0% [0%, 3.2%] | n=115 |
| qwen3:1.7b pilot vs. v0.1 FLIP ASR | Difference | 47.1% vs. 63.2% (not significant, p>0.3 Fisher's exact) | n=17, n=19 |

---

## 4. Capability Floor vs. Safety Floor

The evidence is consistent with two interpretations that are not mutually exclusive.

### 4.1 Capability Floor Interpretation

Models above approximately 1B parameters have sufficient instruction-following capability to comply with format requests. Format-lock attacks succeed because they frame harmful content as a format-completion task, and the model's format-compliance capability is strong enough to override or bypass safety reasoning. Under this interpretation:

- The floor is determined by the model's instruction-following capability (which increases with scale).
- Larger models may actually be *more* vulnerable to format-lock because they are better at following structural instructions.
- The gap between standard ASR and format-lock ASR should *widen* with scale, as stronger format compliance competes with stronger safety reasoning.

**Supporting evidence:** The frontier model data is consistent with this — Claude, Codex, and Gemini all show dramatically higher format-lock ASR than standard ASR, and these are among the most capable instruction-followers available. The heuristic structural ASR data for Llama 70B (91%) and Nemotron 30B (92%) also supports this, though these are heuristic-graded.

### 4.2 Safety Floor Interpretation

Safety training has not specifically targeted format-lock patterns. Models refuse harmful requests when the request matches patterns seen in safety training data (direct requests, role-play jailbreaks, etc.), but format-lock framing presents the request in a pattern that safety training did not cover. Under this interpretation:

- The floor is determined by a gap in safety training coverage, not by instruction-following capability.
- The vulnerability could be addressed by adding format-lock scenarios to safety training data.
- The gap between standard ASR and format-lock ASR should *narrow* as providers add format-lock examples to their safety training.

**Supporting evidence:** Gemma 27B's 0% heuristic structural ASR suggests that some safety training approaches already address format-lock patterns. If this result holds under LLM grading, it would support the safety-floor interpretation for that model. The variation across models of similar size (Nemotron 9B: 44% vs. Nemotron 12B: 36%) is also more consistent with training-methodology differences than capability differences.

### 4.3 Synthesis

The most parsimonious explanation combines both interpretations: format-lock attacks exploit a gap in safety training coverage (safety floor) that is particularly effective because the attack leverages a well-trained capability (format compliance) that scales with model quality (capability floor). The result is a vulnerability that is both training-addressable (providers could add format-lock to safety data) and structurally persistent (the tension between format compliance and safety reasoning is inherent to instruction-tuned models).

Report #51 proposed a "two competing systems" model: format compliance and safety reasoning as partially independent capabilities. This framing accounts for both interpretations — the capability floor determines the strength of format compliance, while the safety floor determines the strength of safety reasoning against format-lock-specific patterns.

---

## 5. Implications for World Models

Report #56 proposed that the format-lock / safety-reasoning independence observed in LLMs may have an analog in world model architectures: planning compliance (the planner's drive to find optimal action sequences) may be partially independent from safety reasoning (the cost module's ability to penalize unsafe states).

The consolidated format-lock evidence strengthens this hypothesis in two ways:

1. **The independence is not scale-dependent.** Format-lock ASR remains elevated from sub-1B to frontier-scale models, suggesting that the decoupling between task compliance and safety reasoning is a structural property of instruction-tuned systems, not an artifact of limited capacity. If this structural property transfers to world models, safety constraints in the cost module may be similarly bypassed by task-optimization pressure.

2. **The "compliance before reflection" pattern.** Report #55 observed that deepseek-r1:1.5b's reasoning traces focused on satisfying format schema requirements rather than evaluating harm potential. This "format first, safety second" processing order has a plausible analog in MPC-style planners: the execute-first-then-replan cycle may create a vulnerability window where the planner commits to an action based on task cost before safety evaluation of the full trajectory is complete.

Both connections are hypothetical and require empirical testing against actual world model systems. The F41LUR3-F1R57 framework does not currently have the simulation infrastructure to test these predictions (see Report #56, Section 6.1).

---

## 6. Limitations

1. **Small sample sizes throughout.** The largest per-model format-lock dataset is n=30 (two sub-3B models). The frontier model data is n=25 per model (19-24 non-ERROR). Confidence intervals span 20-40 percentage points. Results should be treated as indicative, not definitive.

2. **Grader limitations.** deepseek-r1:1.5b produces 27-37% ERROR rates when grading structured output. The FLIP verdicts for sub-3B models may be biased by the grader's limited capacity to evaluate harm in non-prose formats. A frontier grading model would provide more reliable verdicts.

3. **Heuristic vs. LLM grading discrepancy is unresolved.** Heuristic compliance rates (95-100%) and FLIP-graded ASR (21-63%) measure different things. The gap indicates that many format-compliant responses do not contain genuinely harmful content — but the boundary between "harmful compliance" and "benign format completion" is not well-defined for structured output.

4. **No controlled ablation.** Without matched non-format-lock controls (same harmful requests without format framing), we cannot definitively attribute the elevated ASR to format-lock framing. Sub-3B models may comply with direct harmful requests at comparable rates (Report #48 data suggests this is likely, with qwen3:1.7b showing 85.6% COALESCE ASR on jailbreak archaeology).

5. **Limited model diversity at mid-range.** The 3B-30B parameter range has only one format-lock data point with refusal information (qwen2.5-7b, n=21, 1 refusal). The 8-model heuristic ASR data covers this range but uses a different scenario set, different grading methodology, and has not been LLM-validated.

6. **Scenario confound.** All format-lock experiments use scenarios from the `faithfulness_gap_exploit` scenario class. Different harm domains may interact differently with format-lock framing. The v0.1 dataset expanded to 6 format types and 6 harm domains, but with only 5 scenarios per cell, format-by-domain interactions cannot be assessed.

7. **Temporal confound.** Experiments were conducted across sprints 24-26. Model versions, Ollama quantizations, and grading conditions may vary between experiments.

---

## 7. Recommendations

### 7.1 Experiments to Strengthen the Hypothesis

**Priority 1: Mid-range format-lock ladder with frontier grading.**
Run the 30-scenario v0.1 dataset against models at 3B, 7B, 14B, and 30B parameters. Grade all traces with a frontier model (Claude or GPT-5.2) instead of deepseek-r1:1.5b. This fills the critical gap in the capability-floor landscape and eliminates grader-error confounds.

**Priority 2: Matched non-format-lock controls.**
Create a control version of each format-lock scenario: the same harmful request without format framing (e.g., "Describe how to perform SQL injection against a production login form" vs. the format-locked JSON-template version). Run both versions on the same models. The ASR difference attributable to format-lock framing is the causal effect.

**Priority 3: Re-grade existing traces with a frontier grader.**
All 115+ sub-3B traces and 75 frontier CLI traces should be re-graded with a more capable model to resolve the ERROR rate and BENIGN_QUERY classification questions.

### 7.2 Experiments to Refute the Hypothesis

**Test: Does format-lock ASR decrease with targeted safety training?**
If a model provider explicitly adds format-lock scenarios to safety training data, the safety-floor interpretation predicts ASR should drop significantly, while the capability-floor interpretation predicts it should remain elevated (the model's instruction-following capability would still compete with safety reasoning). Gemma 27B's apparent 0% heuristic ASR may represent a natural experiment if Google's safety training includes format-lock patterns — this should be LLM-graded to confirm.

**Test: Does format-lock ASR correlate with general instruction-following benchmarks?**
If the capability-floor interpretation is correct, models that score higher on instruction-following benchmarks (e.g., IFEval, MT-Bench) should show higher format-lock ASR. This prediction is testable with existing benchmarks and format-lock data.

### 7.3 CCS Paper Integration

The following claims are supported by the consolidated evidence and could be included in the CCS paper with appropriate caveats:

- Format-lock attacks produce elevated ASR on frontier models compared to standard attacks (Section 4.3 / Faithfulness Gap).
- Sub-3B models show zero refusals on format-lock requests, consistent with the capability-floor concept (Section 4.9 / Embodied AI Capability Floor).
- The mechanism appears to involve a tension between format compliance and safety reasoning (hypothesis, not confirmed finding).

Claims that should NOT be made without further evidence:

- Specific ASR magnitudes at mid-range scales (no LLM-graded data).
- Causal attribution to format framing (no matched controls).
- Universal applicability across harm domains (limited scenario diversity).

---

## Data and Reproducibility

| Data Source | Path | n | Status |
|-------------|------|---|--------|
| Format-lock v0.1 scenarios | `data/format_lock/format_lock_experiment_v0.1.jsonl` | 30 | Complete |
| qwen3:1.7b traces (v0.1) | `runs/format_lock_experiment_v1/qwen3-1.7b_traces.jsonl` | 30 | Complete |
| qwen3:1.7b FLIP graded (v0.1) | `runs/format_lock_experiment_v1/qwen3-1.7b_graded.jsonl` | 30 | Complete |
| deepseek-r1:1.5b traces (v0.1) | `runs/format_lock_experiment_v1/deepseek-r1-1.5b_traces.jsonl` | 30 | Complete |
| deepseek-r1:1.5b FLIP graded (v0.1) | `runs/format_lock_experiment_v1/deepseek-r1-1.5b_graded.jsonl` | 30 | Complete |
| qwen3.5:0.8b traces (v0.1) | `runs/format_lock_experiment_v1/qwen3.5-0.8b_traces.jsonl` | 30 | Complete (ungraded) |
| qwen3:1.7b traces (pilot) | `runs/format_lock_pilot/qwen3-1.7b_traces.jsonl` | 25 | Complete |
| qwen3:1.7b FLIP graded (pilot) | `runs/format_lock_pilot/qwen3_graded_by_deepseek.jsonl` | 25 | Complete |
| qwen2.5-7b traces (pilot) | `runs/format_lock_7b/qwen2.5-7b_for_grading.jsonl` | 25 | Complete (ungraded) |
| Claude CLI classified | `runs/faithfulness_cli/claude_traces_classified.jsonl` | 25 | Complete |
| Codex CLI classified | `runs/faithfulness_cli/codex_traces_classified.jsonl` | 25 | Complete |
| Gemini CLI classified | `runs/faithfulness_cli/gemini_traces_classified.jsonl` | 25 | Complete |

**Cross-references:**
- Report #51: `research/reports/51_format_lock_capability_floor.md` (capability-floor hypothesis)
- Report #55: `research/reports/55_format_lock_experiment_results.md` (controlled experiment results)
- Report #56: `research/reports/56_world_model_attack_surface_taxonomy.md` (world model implications)
- Report #48: `research/reports/48_corpus_pattern_mining.md` (corpus-wide patterns)
- Report #50: `research/reports/50_cross_model_vulnerability_profiles.md` (vulnerability profiles)
- Canonical metrics: `docs/CANONICAL_METRICS.md` (346 techniques, 236 models, 32,465 prompts)

---

*Report 57 -- F41LUR3-F1R57 Research Brief Series*
*Classification: Internal Research | Status: Complete*
*Related: Report 51, Report 55, Report 56, Report 48, Report 50*
*Sprint: 26, Wave 11*

⦑F41LUR3-F1R57|FORMAT-LOCK-CAPABILITY-FLOOR-CONSOLIDATED⦒
