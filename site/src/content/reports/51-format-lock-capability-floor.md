---

title: "The Format-Lock Capability Floor — Why Structural Compliance Attacks Work Across the Full Model Spectrum"
description: "This report synthesizes format-lock pilot data (n=25 traces, qwen3:1.7b), faithfulness CLI results (n=75 traces, 3 frontier models), corpus pattern mining (Report #48), cross-model vulnerability profiles (Report #50), an..."
date: "2026-03-10"
reportNumber: 51
classification: "Research — Empirical Study"
status: "complete"
author: "Clara Oswald (benchmark-operator)"
tags: []
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/51-format-lock-capability-floor.m4a"
---

---

## Summary

This report synthesizes format-lock pilot data (n=25 traces, qwen3:1.7b), faithfulness CLI results (n=75 traces, 3 frontier models), corpus pattern mining (Report #48), cross-model vulnerability profiles (Report #50), and embodied capability-floor experiments (Report #47) into a unified hypothesis about why format-lock attacks exhibit a qualitatively different scaling relationship from other attack families.

Our central claim: format-lock attacks exploit a **structural compliance mechanism** that is distinct from the safety reasoning mechanism. Below approximately 3B parameters, all attack types succeed because safety reasoning is underdeveloped. Above approximately 7B parameters, most attack families show clear scale dependence (larger/better-trained models refuse more). Format-lock attacks are an exception — they maintain elevated ASR across the full capability spectrum because they target format compliance, which scales *with* model capability rather than against it.

This is a hypothesis-generating brief. The pilot data is small (n=25 for format-lock, n=75 for faithfulness CLI), and the mechanism is inferred from converging observational evidence rather than controlled experiments. We outline specific experiments to test the hypothesis.

---

## The Capability Floor

### Below ~3B: Universal Compliance

Multiple data sources converge on the observation that models below approximately 3B parameters comply with nearly all requests regardless of attack technique:

| Model | Parameters | Attack Type | ASR | Source |
|-------|-----------|-------------|-----|--------|
| qwen3:1.7b | 1.7B | Jailbreak archaeology | 85.6% | Report #48, n=150 (COALESCE(llm_verdict, heuristic_verdict); Report #50's LLM-only grading gives 27.3%) |
| qwen3:1.7b | 1.7B | Format-lock pilot | 47.1% (COMPLIANCE+PARTIAL, non-ERROR) | This report, n=17 non-ERROR |
| qwen3.5:0.8b obliteratus | 0.8B | Obliteratus corpus | 100% | Report #48, n=114 |
| qwen3 obliteratus | 2.0B | Obliteratus corpus | 100% | Report #48, n=57 |
| deepseek-r1:1.5b | 1.5B | Jailbreak archaeology | 79.7% | Report #48, n=477 |
| Liquid LFM 1.2B | 1.2B | Mixed | 31.1% | Report #50, n=177 |
| DistilGPT2 | 0.08B | Mixed | 100% | Report #50, base model |

At this scale, the limiting factor is not safety training but model capacity. Small models lack the representational capacity to distinguish between benign format requests and adversarial format requests that embed harmful content. They comply structurally because structural compliance is their primary mode of operation.

**Caveat:** The qwen3:1.7b format-lock ASR (47.1% COMPLIANCE+PARTIAL) is lower than its jailbreak archaeology ASR (85.6%). However, 8 of 25 traces (32%) received ERROR verdicts from the LLM grader, and 7 received BENIGN_QUERY — suggesting the grader may have miscategorized format-compliant responses that produced structured output without obvious harm markers. The structural compliance rate (responses beginning with structured output markers like `{`, `def`, `SELECT`) was 76.5% of non-ERROR traces, which is more consistent with the high ASR expected at this scale.

### Above ~7B: Safety Training Creates Divergence

Above approximately 7B parameters, safety training creates clear divergence between attack families. Amy's Report #50 documents three vulnerability profiles:

- **Restrictive (ASR <= 15%):** 5 models, all with extensive RLHF/constitutional AI training. Claude Sonnet 4.5: 3.9% (n=128), GPT-5.2: 8.8% (n=125), Gemini-3-Flash: 2.3% (n=130).
- **Mixed (ASR 15-40%):** 15 models, instruction-tuned open-weight models with moderate safety training.
- **Permissive (ASR >= 40%):** 37 models, including base models, abliterated models, and models with minimal safety training.

The critical observation is that these profiles are determined primarily by safety training investment, not parameter count (Pearson r = -0.140 between log-parameter-count and ASR, n=24 models with known sizes).

### The Format-Lock Exemption

Format-lock attacks appear to resist this pattern. From the faithfulness CLI data (same 25 format-lock scenarios tested against 3 frontier models that are otherwise in the "restrictive" profile):

| Model | Profile (Report #50) | Standard ASR | Format-Lock ASR (LLM-graded) | n |
|-------|---------------------|-------------|------------------------------|---|
| Claude Sonnet 4.5 | Restrictive (3.9%) | 3.9% | 30.4% (7/23 non-ERROR) | 25 |
| Codex GPT-5.2 | Restrictive (8.8%) | 8.8% | 42.1% (8/19 non-ERROR) | 25 |
| Gemini-3-Flash | Restrictive (2.3%) | 2.3% | 23.8% (5/21 non-ERROR) | 25 |

All three frontier models show a substantial jump in ASR when the attack is delivered via format-lock framing rather than conventional jailbreak techniques. The format-lock ASR for these restrictive models (23.8-42.1%) falls in the range that Report #50 classifies as "mixed" — suggesting that format-lock attacks effectively shift frontier models from the restrictive to the mixed vulnerability profile.

**Note on the 88.2% figure:** The format-lock pilot was previously characterized as having 88.2% FLIP-graded ASR. This figure appears to derive from heuristic structural compliance assessment rather than LLM grading. The LLM-graded data shows 47.1% COMPLIANCE+PARTIAL for qwen3:1.7b (n=17 non-ERROR), and the faithfulness structural ASR data from prior HTTP benchmarks (Nemotron 30B: 92%, Llama 70B: 91%, DeepSeek R1: 84%) uses heuristic assessment. We report both but distinguish them clearly. The discrepancy between heuristic and LLM-graded ASR for format-lock is itself informative — it suggests that format-lock attacks produce responses that *look* compliant structurally but may contain mixed signals when evaluated for actual harmful content.

---

## The Mechanism: Format Compliance vs. Safety Reasoning

### Hypothesis: Two Competing Systems

We hypothesize that language models develop two partially independent capabilities through training:

1. **Format compliance:** The ability to follow structural instructions (output JSON, complete code, produce YAML). This capability scales *with* model quality — better models are better at format compliance. It is reinforced by instruction-tuning and RLHF, which reward following user instructions precisely.

2. **Safety reasoning:** The ability to recognize harmful requests and refuse them. This capability requires additional safety-specific training (RLHF safety data, constitutional AI, red-teaming). It is weaker in base models and grows with safety training investment.

Format-lock attacks create a tension between these two systems. The format instruction ("Output ONLY valid JSON conforming to this schema") activates the format compliance system, while the embedded harmful content ("vulnerability documentation endpoint," "synthesis route YAML") should activate the safety reasoning system.

At small scales, format compliance wins trivially because safety reasoning barely exists. At large scales, the outcome depends on the relative strength of the two systems — and critically, format compliance is reinforced by the same training signals that improve general instruction-following, while safety reasoning requires separate investment.

### Supporting Evidence

**From Martha's Report #48 (Finding 3):** Compliant responses are 54% longer than refusals (Mann-Whitney U, p=1.05e-27, Cohen's d=0.325). Reasoning models think 75% longer before complying than before refusing (p=8.89e-14). This is consistent with a two-system model: compliance requires overriding the safety system, which costs additional computation. Refusal activates a "fast path" — a well-learned pattern that terminates quickly.

**From Report #47 (Embodied cap-floor):** On the PiCar-X robot with sub-2B models, persona hijack produced a "theatricality displacement" effect — jailbreak personas increased expression tool usage by 15-18pp while *decreasing* motion commands on safety-boundary prompts. This suggests that at small scales, format/persona priming redirects *which capability* the model exercises rather than whether it complies with the harmful intent. The format takes over; the content becomes secondary.

**From Martha's Report #48 (Finding 2):** Safety re-emerges in abliterated models as size increases (Qwen3.5: 100% ASR at 0.8B, decreasing to 47.3% at 9.0B). This suggests that safety-like reasoning is partially an emergent property of scale, not solely a product of explicit safety training. If true, the "capability floor" is not just about safety training — it is about the minimum model capacity required for *any* nuanced content evaluation.

---

## Format-Lock in Amy's Three-Profile Taxonomy

Report #50 clusters models into permissive (>= 40% ASR), mixed (15-40%), and restrictive (<= 15%) profiles. Where does format-lock sit?

Our preliminary data suggests format-lock attacks **shift models one profile level toward permissive:**

| Original Profile | Standard ASR Range | Format-Lock ASR (observed) | Effective Profile |
|-----------------|--------------------|---------------------------|-------------------|
| Restrictive | <= 15% | 23.8-42.1% (n=3 frontier models) | Mixed → Permissive |
| Mixed | 15-40% | Unknown (not yet tested) | Likely Permissive |
| Permissive | >= 40% | >= 40% (already compliant) | Permissive (no change) |

The shift magnitude appears to depend on the gap between a model's format compliance capability and its safety reasoning capability. Frontier models have strong format compliance (they are excellent at following structural instructions) AND strong safety reasoning. Format-lock attacks create a conflict that safety reasoning does not always win. The 23.8-42.1% ASR range on restrictive models indicates that safety reasoning wins approximately 60-75% of the time on these specific prompts, but loses a non-trivial fraction.

For permissive models, format-lock may produce no additional effect because the model already complies without format framing. This is consistent with the capability-floor concept: below the floor, the attack type does not matter.

**Testable prediction:** If format-lock attacks shift models one profile level, then "mixed" profile models (15-40% standard ASR) should show format-lock ASR in the 40-65% range. This has not yet been tested.

---

## Detection Implications

### Response Length as a Signal

Martha's finding that COMPLIANCE produces 54% longer responses (Report #48) has specific implications for format-lock detection. In our format-lock pilot (n=17 non-ERROR):

| Verdict | n | Mean Response Length (chars) |
|---------|---|----------------------------|
| COMPLIANCE | 3 | 882 |
| PARTIAL | 5 | 1,422 |
| BENIGN_QUERY | 7 | 1,626 |
| REFUSAL | 2 | 1,942 |

Interestingly, the format-lock pattern *inverts* the corpus-wide verbosity signal. Format-lock COMPLIANCE responses are *shorter* than refusals — because the format constraint itself limits response length (structured output is inherently more concise than prose refusals). BENIGN_QUERY responses are longest, possibly because the grader classified format-compliant responses as benign when the harmful content was implicit in the structure rather than explicit in prose.

**Implication:** The verbosity detection signal from Report #48 may not apply to format-lock attacks. A format-lock-specific detector would need to look at structural features (did the model produce the requested format?) rather than length anomalies. This is a limitation of length-based detection that warrants further investigation.

### Structural Compliance Rate as a Better Signal

A more promising detection signal for format-lock attacks may be the structural compliance rate itself. In our pilot, 76.5% of non-ERROR traces began with structural output markers (`{`, `def`, `SELECT`, etc.) — regardless of whether the LLM grader classified them as COMPLIANCE, PARTIAL, or BENIGN_QUERY. If a model produces valid JSON/YAML/code in response to a prompt that also contains harm-category content, the structural compliance itself is the signal, not the response length.

---

## Synthesis: The Capability Floor Landscape

Combining all findings, we propose the following landscape:

```
ASR
100% |xxxxx                                     Format-lock
     |  xxxxx                               ----===========----
     |     xxxx                         ----/
     |       xxxx    Capability Floor  /
 50% |        xxx  <-- (~3B) -->      /     Standard attacks
     |          xx                   /      ----------
     |           xx              ---/      /
     |            x          ---/         /
     |             x     ---/            /
  0% |              x---/              /
     +---+---+---+---+---+---+---+---+---+
       0.5B  1B   3B   7B  30B  70B 175B 671B
                    Model Size
```

Key features:
1. **Below ~3B (capability floor):** Both standard and format-lock attacks achieve high ASR. The floor represents the minimum capacity for any safety reasoning.
2. **Above ~7B:** Standard attacks show clear scale dependence (ASR decreases with safety training investment). Format-lock attacks maintain elevated ASR because they exploit format compliance, which increases with model capability.
3. **The gap widens with scale:** The most capable models show the largest gap between standard ASR and format-lock ASR, because they have both stronger format compliance AND stronger safety reasoning — but format-lock attacks activate the former while suppressing the latter.

**Important qualification:** This landscape is schematic, not empirically derived from controlled experiments across all size points. The sub-3B region draws on Reports #47, #48, and #50. The frontier region draws on faithfulness CLI data (n=75 total across 3 models). The mid-range (3B-30B) is extrapolated from the 8-model heuristic ASR data noted in session records (Nemotron 30B: 92%, Llama 70B: 91%, DeepSeek R1: 84%, Gemma 27B: 0%) but these are heuristic-graded and have not been LLM-validated. The landscape should be treated as a hypothesis to be tested, not a confirmed finding.

---

## Limitations

1. **Small sample sizes.** The format-lock pilot has n=25 traces (17 non-ERROR). The faithfulness CLI has n=25 per model (19-23 non-ERROR per model). These are sufficient for hypothesis generation but not for confident claims about ASR magnitudes.

2. **High ERROR rate in grading.** 32% of format-lock pilot traces received ERROR verdicts from the deepseek-r1:1.5b grader. This is consistent with known limitations of small grading models on structured output (documented in MISTAKES_TO_LEARN_FROM.md). LLM-graded ASR should be re-evaluated with a more capable grader.

3. **Heuristic vs. LLM grading discrepancy.** The gap between heuristic structural ASR (68-92%) and LLM-graded ASR (17.6-42.1%) for format-lock prompts requires investigation. It is possible that (a) the LLM grader is too conservative on format-lock responses, (b) the heuristic is too liberal, or (c) format-lock attacks produce a genuinely ambiguous category where structural compliance does not equate to harmful content generation.

4. **No controlled mid-range data.** The 3B-30B parameter range is critical for testing the capability-floor hypothesis but lacks LLM-graded format-lock data. The 8-model heuristic ASR data is from HTTP benchmarks and uses heuristic classification.

5. **Format diversity confound.** The pilot scenarios use 6 format types (JSON: 10, Code: 4, SQL: 2, YAML: 1, CSV: 1, XML: 1, Other: 6). Different format types may have different ASR profiles. JSON-locked prompts showed the most balanced verdict distribution (2 COMPLIANCE, 2 PARTIAL, 2 REFUSAL, 2 BENIGN_QUERY, 2 ERROR in n=10).

6. **Scenario confound.** All format-lock scenarios are from the `faithfulness_gap_exploit` scenario class. Different harm domains may interact differently with format-lock framing.

---

## Proposed Follow-Up Experiments

### Experiment 1: Mid-Range Format-Lock Ladder
**Goal:** Fill the 3B-30B gap with LLM-graded format-lock data.
**Design:** Run the 25 format-lock scenarios against models at 3B, 7B, 8B, 14B, and 30B parameters (e.g., qwen3:4b, llama3.2:3b, qwen3:8b, qwen3:14b, nemotron-nano-30b). Grade all traces with a frontier LLM grader (Claude or GPT-5.2). Compare format-lock ASR to standard jailbreak ASR on the same models.
**Expected outcome:** If the capability-floor hypothesis holds, format-lock ASR should remain elevated (>30%) even at scales where standard ASR drops below 15%.

### Experiment 2: Format-Lock on Frontier Models (Expanded)
**Goal:** Confirm the profile-shift effect with larger sample sizes.
**Design:** Expand the format-lock scenario set to 50+ prompts across 4+ harm domains, each with 3+ format types (JSON, YAML, code, XML). Test against Claude, GPT-5.2, and Gemini-3-Flash. Grade with a different frontier model than the one being tested.
**Expected outcome:** Format-lock ASR 20-40% on frontier models (vs < 10% for standard attacks).

### Experiment 3: Response-Length Anomaly Detector
**Goal:** Determine if format-lock attacks produce a detectably different response length distribution.
**Design:** Collect 100+ format-lock responses and 100+ standard responses from the same model. Compare length distributions using Mann-Whitney U. Build a simple threshold classifier and measure precision/recall.
**Expected outcome:** Format-lock COMPLIANCE may be shorter than standard COMPLIANCE (inverted verbosity signal), providing a second detection dimension.

### Experiment 4: Format Compliance Ablation
**Goal:** Determine whether format framing causally increases ASR.
**Design:** Create matched pairs: (a) harmful request with format-lock framing, (b) identical harmful request without format-lock framing. Test both on the same models. The ASR difference is attributable to format-lock framing.
**Expected outcome:** Format-lock framing increases ASR by 15-30pp on models in the "mixed" and "restrictive" profiles.

---

## Connection to CCS Paper

This hypothesis, if validated by the proposed experiments, strengthens two sections of the CCS submission:

1. **Section 4.3 (Faithfulness Gap):** The format-lock mechanism explains *why* format-locked prompts achieve elevated ASR — they exploit a capability (format compliance) that is strengthened by the same training that improves general performance. This is a more precise claim than "format-lock works because models follow instructions."

2. **Section 4.9 (Embodied AI Capability Floor):** The capability-floor concept from Report #47 (theatricality displacement at sub-2B scale) generalizes: below a certain capability threshold, the model's response is determined by prompt format rather than content safety. Format-lock attacks extend this principle above the floor by anchoring the model in format-compliance mode.

The schematic landscape figure in this report could serve as a unifying visualization for the paper's results across multiple attack families.

---

## Data and Reproducibility

- **Format-lock pilot traces:** `runs/format_lock_pilot/qwen3-1.7b_traces.jsonl` (25 traces)
- **Format-lock pilot scenarios:** `runs/format_lock_pilot/format_lock_scenarios_25.jsonl` (25 scenarios)
- **LLM-graded format-lock results:** `runs/format_lock_pilot/qwen3_graded_by_deepseek.jsonl` (25 traces, deepseek-r1:1.5b grader)
- **Faithfulness CLI traces:** `runs/faithfulness_cli/{claude,codex,gemini}_traces_classified.jsonl` (75 traces total)
- **Cross-reference:** Report #47 (`research/reports/47_embodied_cap_floor_action_space_hijack.md`)
- **Cross-reference:** Report #48 (`research/reports/48_corpus_pattern_mining.md`)
- **Cross-reference:** Report #50 (`research/reports/50_cross_model_vulnerability_profiles.md`)

---

*Report 51 -- F41LUR3-F1R57 Research Brief Series*
*Classification: Internal Research | Status: Complete*
*Related: Report 47 (Embodied Cap-Floor), Report 48 (Corpus Pattern Mining), Report 50 (Cross-Model Vulnerability Profiles)*
*Issue: #212 (Sprint-24)*

⦑F41LUR3-F1R57|FORMAT-LOCK-CAPABILITY-FLOOR⦒
