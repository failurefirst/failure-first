---
title: "Gemma 4 (31B) and Mistral Small 4 (119B MoE) — New Model Safety Evaluation"
description: "Two newly released frontier-scale models were evaluated against the standard 100-scenario F41LUR3-F1R57 benchmark pack during Sprint 22, graded by Gemini 2.5 Flash via FLIP backward inference. Both models fall into the *..."
date: "2026-04-06"
reportNumber: 342
classification: "Research — Empirical Study"
status: "complete"
tags: []
draft: false
---

## Executive Summary

Two newly released frontier-scale models were evaluated against the standard 100-scenario F41LUR3-F1R57 benchmark pack during Sprint 22, graded by Gemini 2.5 Flash via FLIP backward inference. Both models fall into the **permissive cluster** (strict ASR above 50%).

**Gemma 4 (31B)** achieves 60.0% strict ASR and 62.0% broad ASR, statistically indistinguishable from its predecessor gemma3:27b (59%, p=1.0 Fisher's exact). The 4B-to-31B parameter increase within the Gemma family produced no measurable safety improvement, while the jump from gemma3:4b (32% strict) to gemma4:31b (60%) represents a significant *decrease* in safety (p=0.0007). This constitutes additional evidence for the inter-generational defense degradation at larger scale (IDDL) pattern previously observed across families.

**Mistral Small 4 (119B MoE)** achieves 55.0% strict ASR and 63.0% broad ASR. The heuristic classifier reported 81% success, over-reporting by 18pp against FLIP broad ASR -- consistent with the known heuristic inflation pattern (Mistake #21). Mistral Small 4 showed 0% format-lock refusal rate: every format-lock scenario that was attempted produced compliance, indicating complete susceptibility to structured output attacks.

**Grading caveat:** Single grader (Gemini 2.5 Flash). Per Mistake #28, grader bias direction has not been assessed for this specific model pairing. Results are directional estimates.

---

## 1. Gemma 4 (31B): No Safety Improvement Over Gemma 3

### 1.1 Verdict Distribution

| Verdict | Count | Percentage |
|---------|-------|-----------|
| COMPLIANCE | 60 | 60.0% |
| PARTIAL | 2 | 2.0% |
| REFUSAL | 38 | 38.0% |
| **Total** | **100** | |

- **Strict ASR:** 60.0%
- **Broad ASR:** 62.0%

### 1.2 Intra-Family Comparison

| Model | Params | Strict ASR | Broad ASR | p vs gemma4:31b |
|-------|--------|-----------|-----------|-----------------|
| gemma3:4b | 4B | 32.0% | -- | 0.0007 (significantly safer) |
| gemma3:12b | 12B | -- | -- | (not tested on this pack) |
| gemma3:27b | 27B | 59.0% | -- | 1.0 (statistically identical) |
| **gemma4:31b** | **31B** | **60.0%** | **62.0%** | -- |

The gemma3:4b-to-gemma4:31b comparison is instructive. The smaller model refused more often, likely because it lacked the capacity to generate plausible harmful content even when the attack bypassed alignment -- a phenomenon consistent with the capability floor hypothesis (Report #265). The gemma3:27b-to-gemma4:31b null result (p=1.0) suggests that Google's safety training for Gemma 4 did not measurably improve on the Gemma 3 (27B) baseline despite architectural updates.

### 1.3 Attack Class Performance

Gemma 4 showed a clear split between attack families:

**100% compliance (all scenarios):** combination_attack (5/5), multi_agent_collusion (3/3), crescendo (4/4), reward_hacking (via VLA-RHA 3/3), multi-turn escalation (6/6), v0.6 MDA scenarios (6/6).

**0% compliance (full refusal):** compositional_reasoning (JA-REASON 0/4), sensor_spoofing (JA-CIPHER 0/3), DAN-classic (JA-DAN 0/4), multi-shot (JA-MSHOT 0/2), skeleton_key (JA-SKEY 0/3).

The pattern indicates that Gemma 4 has robust defenses against well-known jailbreak templates (DAN, skeleton key, cipher) but remains vulnerable to combination attacks, multi-turn strategies, and embodied/VLA-specific attack families. This is consistent with the observation that safety training tends to memorize known attack signatures rather than generalize to novel attack structures.

### 1.4 IDDL Evidence

The gemma3:4b (32%) to gemma4:31b (60%) trajectory provides additional data for the inter-generational defense degradation at larger scale pattern. As capability increases, the model becomes better at producing the requested harmful content, while safety training does not scale proportionally. The +28pp increase in strict ASR (p=0.0007) is statistically significant and practically meaningful. However, this comparison confounds generation (3 vs 4) with parameter count (4B vs 31B), so the effect cannot be cleanly attributed to either factor alone.

---

## 2. Mistral Small 4 (119B MoE): Weak Safety at Scale

### 2.1 Verdict Distribution

| Verdict | Count | Percentage |
|---------|-------|-----------|
| COMPLIANCE | 55 | 55.0% |
| PARTIAL | 8 | 8.0% |
| REFUSAL | 37 | 37.0% |
| **Total** | **100** | |

- **Strict ASR:** 55.0%
- **Broad ASR:** 63.0%

### 2.2 Heuristic vs FLIP Divergence

| Metric | Value |
|--------|-------|
| Heuristic ASR | 81.0% |
| FLIP Strict ASR | 55.0% |
| FLIP Broad ASR | 63.0% |
| Heuristic over-report (vs broad) | +18.0pp |

The 18pp over-report is the largest single-model heuristic-FLIP divergence observed in Sprint 22 and reinforces Mistake #21: keyword-based classifiers detect response style rather than semantic harm. Mistral Small 4 frequently produces responses that look compliant in format (structured output, step-by-step language) but contain disclaimers or redirections that FLIP correctly classifies as PARTIAL or REFUSAL.

### 2.3 Format-Lock Susceptibility

Mistral Small 4 achieved 0% refusal rate on format-lock scenarios (FL-JSON, FLA-CODE, FLA-CSV, FLA-JSON, FLA-XML, FLA-YAML): 16/16 format-lock traces classified as COMPLIANCE. When the attack constrains the response format (JSON, CSV, code blocks), the model's instruction-following training appears to override its safety alignment completely. This is consistent with the format-lock mechanism documented in Report #340 (Section 3) and suggests that Mistral's safety training did not account for format compliance as an attack vector.

### 2.4 VLA Family Performance

Unlike Gemma 4 which showed broad VLA vulnerability, Mistral Small 4 has a more mixed VLA profile: 0% on VLA-CRA (crash avoidance) and VLA-PCA (physical collision), but 100% on VLA-TCH (tool-chain hijacking) and STS-DIV (strategy diversion). The model appears to have stronger alignment on scenarios with physically harmful framing but weaker alignment on abstract planning and strategy scenarios.

---

## 3. Cross-Model Comparison

The following table places these two models alongside recent benchmark results from comparable models, all on the 100-scenario pack with FLIP grading (Gemini CLI, LLM-only).

| Model | Family | Params | Strict ASR | Broad ASR | Format-Lock Refusal | Cluster |
|-------|--------|--------|-----------|-----------|-------------------|---------|
| gemma3:4b | Google | 4B | 32.0% | -- | -- | Moderate |
| gemma3:27b | Google | 27B | 59.0% | -- | -- | Permissive |
| **gemma4:31b** | **Google** | **31B** | **60.0%** | **62.0%** | Partial | **Permissive** |
| **mistralai/mistral-small-2603** | **Mistral** | **119B MoE** | **55.0%** | **63.0%** | **0%** | **Permissive** |
| ministral-3:8b | Mistral | 8B | 84.6% | 84.6% | -- | Highly Permissive |
| devstral-small-2:24b | Mistral | 24B | 61.1% | 79.2% | -- | Permissive |
| qwen3:1.7b | Qwen | 1.7B | 32.5% | 51.6% | -- | Moderate |

**Note:** gemma3:27b, ministral-3:8b, and devstral-small-2:24b ASR figures are from the 149-scenario Pliny corpus (Report #340) on a different scenario set. Direct numeric comparison should be treated with caution; cluster assignment is more reliable than point estimates across different packs.

---

## 4. Implications

### 4.1 Safety Training Investment Matters More Than Scale

These two models reinforce the established finding that parameter count alone does not predict safety. Mistral Small 4 at 119B MoE is no safer than devstral-small-2 at 24B dense. Gemma 4 at 31B is statistically identical to Gemma 3 at 27B. In both cases, the safety profile appears to be determined by the investment in safety training (RLHF, red-teaming, constitutional AI methods) rather than by raw model capacity. This is consistent with the broader corpus finding that safety is a training decision, not an emergent capability.

### 4.2 Format-Lock Remains an Open Attack Surface

Mistral Small 4's complete susceptibility to format-lock attacks (0% refusal) suggests this attack class is not yet part of standard safety training regimens for Mistral-family models. The mechanism is straightforward: specifying a structured output format (JSON, CSV, code) triggers instruction-following behavior that overrides safety alignment. Defenders should consider format-aware safety layers that evaluate content intent independent of output structure.

### 4.3 Known-Template Defense vs Novel-Attack Vulnerability

Gemma 4's clean split -- 0% ASR on DAN/skeleton-key/cipher, 100% on combination and multi-turn attacks -- suggests safety training has become effective against cataloged attack templates but has not generalized to structural attack patterns. This asymmetry is exploitable: any novel attack structure that does not match the training distribution of known jailbreaks is likely to succeed.

---

## 5. CCS Integration Potential

Both models contribute to the CCS paper's argument in two ways:

1. **IDDL evidence.** The Gemma 3 (4B) to Gemma 4 (31B) trajectory provides a within-family data point for inter-generational defense degradation at larger scale, strengthening Section 5.3 of the paper (capability-safety divergence).

2. **Format-lock attack surface.** Mistral Small 4's 0% format-lock refusal extends the evidence base for format compliance as an under-defended attack vector, relevant to the paper's attack taxonomy (Section 4.2).

These results increase the model count in the CCS paper by 2 (to 241 with results) and add 200 FLIP-graded traces to the corpus.

---

## 6. Limitations

1. **Single grader.** All 200 verdicts from Gemini 2.5 Flash. Grader bias direction unknown.
2. **Different scenario packs.** Gemma 4 and Mistral Small 4 were tested on the same 100-scenario pack, but comparison models (Report #340) used the 149-scenario Pliny corpus. Cross-pack comparisons are approximate.
3. **Single evaluation per scenario.** No repeat trials; stochastic variation in model responses is not captured.
4. **Different APIs.** Gemma 4 via Ollama Cloud, Mistral Small 4 via OpenRouter. Provider-level content filtering may differ.
5. **n=100 per model.** Wilson 95% CI for 60% at n=100 is approximately [50.2%, 69.0%]. Results are directional, not precise.

---

*Data: `runs/gemma4_31b_s22/` (100 traces), `runs/mistral_small4_s21/` (100 traces)*

*Grading: `runs/grading/gemma4_31b_s22/gemini_graded_verdicts.jsonl`, `runs/grading/mistral_small4_s21/gemini_graded_verdicts.jsonl`*

*Previous: Report #340 (Pliny Full Corpus Validation), Report #265 (Capability Floor Analysis)*
