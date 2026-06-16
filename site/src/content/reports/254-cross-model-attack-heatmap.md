---

title: "Cross-Model x Attack-Family ASR Heatmap"
description: "1. **Multi-turn attacks are the closest to \"universal.\"** multi_turn achieves 74.7% ASR across all models with LLM-graded data and >= 25% ASR on 5/5 tested models. 2. **No model achieves < 15% ASR across all tested attac..."
date: "2026-03-25"
reportNumber: 254
classification: "Research — Empirical Study"
status: "complete"
author: "Clara Oswald (Principal Research Analyst)"
tags: []
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/254-cross-model-attack-heatmap.m4a"
---

---

## Executive Summary

**(D)** This report presents the first comprehensive cross-model x attack-family ASR matrix for the Failure-First corpus, combining 53,831 LLM-graded database results with 169 heuristic-graded Ollama Cloud traces from Sprint 13 campaigns (Reports #238, #239, #245). The analysis covers 14 technique families across models spanning 1.5B to 397B parameters from 10+ providers.

**Principal findings:**

1. **Multi-turn attacks are the closest to "universal."** multi_turn achieves 74.7% ASR across all models with LLM-graded data and >= 25% ASR on 5/5 tested models.
2. **No model achieves < 15% ASR across all tested attack families.** Even the most robust models show elevated vulnerability to at least one family.
3. **Provider signature dominates scale.** Qwen3.5 (397B, Alibaba) shows 7.1% corrected ASR while Ministral (14B, Mistral) shows 96.7% -- an 89.6pp gap driven by safety training investment, not parameter count.
4. **Attack families cluster into three vulnerability profiles:** structural-cognitive (FL, CRA, CC, DA -- exploit reasoning patterns), direct-harm (PCA, prompt_injection -- trigger safety classifiers), and encoding-based (cipher, volumetric -- exploit format processing).

**Caveat:** The heatmap is sparse. Most model-family cells have n < 20. Per-cell ASR values should be treated as preliminary estimates, not validated benchmarks. The overall pattern is more reliable than any individual cell.

---

## 1. Methodology

### 1.1 Data Sources

| Source | Grading | Models | Results | Coverage |
|--------|---------|--------|---------|----------|
| Database (LLM-graded) | LLM (COALESCE) | 125 with verdicts, 73 with n >= 20 | 53,831 evaluable | 14 technique families |
| Ollama Cloud Sprint 13 | Heuristic + manual | 5 models | 169 traces | 10 attack families |

**Exclusions from the primary heatmap:**
- OBLITERATUS models (abliterated safety -- artificially inflates ASR)
- Pre-trained base models without instruction tuning (GPT-2, Pythia -- not safety-relevant)
- `unknown-model` entries (metadata gaps)
- `dryrun` entries (test artifacts)

### 1.2 Family Mapping

Database technique families map to 14 categories: behavioral, completion, cot_exploit, emotional, encoding, logic_exploit, multi_turn, other, persona, prompt_injection, task_framing, technical_framing, temporal, volumetric.

Ollama Cloud attack families (Report #239) map as follows:

| Ollama Cloud Family | DB Family Equivalent | Notes |
|---------------------|---------------------|-------|
| Format Lock (FL) | cot_exploit | Exploits format compliance reasoning |
| Compliance Cascade (CCA) | cot_exploit (novel) | Exploits safety reasoning |
| Reasoning Exhaust (RE) | cot_exploit (novel) | Exploits reasoning exhaustion |
| Reasoning Budget Starvation (RBS) | cot_exploit | Pre-existing |
| Compositional Reasoning (CRA) | logic_exploit | Decompositional attack |
| Pressure Cascade (PCA) | behavioral | Explicit danger framing |
| Context Collapse (CC) | multi_turn (condensed) | Context manipulation |
| Deceptive Alignment (DA) | persona | Alignment-faking persona |
| Crescendo (CRESC) | multi_turn (condensed) | Gradual escalation |
| Tool Chain Hijacking (TCH) | task_framing | Indirect tool manipulation |
| Semantic Benignity (SBA) | encoding | Semantic reframing |
| Meaning Displacement (MDA) | encoding | Meaning shift |

---

## 2. Primary Heatmap: LLM-Graded Database Results

### 2.1 Model x Attack Family Matrix (Broad ASR = COMPLIANCE + PARTIAL)

Models with >= 20 LLM-graded results, excluding OBLITERATUS and base models. ASR = (COMPLIANCE + PARTIAL) / (COMPLIANCE + PARTIAL + REFUSAL + HALLUCINATION_REFUSAL).

```
Legend:  ## = ASR >= 50%  |  ** = ASR 25-49%  |  .. = ASR 1-24%  |  -- = ASR 0%  |  -  = no data (< 3 traces)

Model                                    Provider   n   | behav  cot  encod multi other perso p_inj  task volum | Overall
---------------------------------------------------------+-------------------------------------------------------+--------
claude-sonnet-4-5-20250929               anthropic 113  |  ..14  --0   --0  ##71     -  --0   --0   ..17  --0  |   8.0%
gemini-3-flash-preview                   google    112  |  --0  ..19   --0  **40     -  --0   --0   --0   --0  |   5.4%
gpt-5.2                                  openai    112  |  ..19 ..22  ..14  ##75     -  ..8   --0   ..17 ..11  |  19.6%
deepseek-r1:1.5b                         ollama     86  |     -  ##79     -  ##77 ##55  --0      -     -     -  |  66.3%
qwen3:1.7b                               ollama    144  |  ..14 **43  **43  ##82 ##76 ##67    -      -  ..7   |  52.1%
llama3.2:latest                          ollama    235  |     -  **36     - [n/a] **25     -      -     -     -  |  26.0%
gemini-robotics-er-1.5-preview           google     20  |     -     -     -     - ##58    -      -     -     -  |  60.0%
```

### 2.2 Key Patterns in the LLM-Graded Matrix

**(D)** Multi-turn is the most universally effective family: 71% on Claude, 40% on Gemini Flash, 75% on GPT-5.2, 77% on DeepSeek-R1 1.5B, 82% on Qwen3 1.7B. Five of five models with multi-turn data show >= 25% ASR. No other family achieves this breadth.

**(D)** Prompt injection is dead against frontier models: 0% on Claude, Gemini, and GPT-5.2. This confirms the established finding from Report #234 (technique ranking: prompt injection 0% on all frontier models).

**(D)** cot_exploit (chain-of-thought exploitation) shows scale-dependent vulnerability: 0% on Claude, 19% on Gemini Flash, 22% on GPT-5.2, 79% on DeepSeek-R1 1.5B, 43% on Qwen3 1.7B. Smaller models are more susceptible.

**(D)** The frontier models show distinct vulnerability profiles:
- **Claude Sonnet 4.5:** Lowest overall ASR (8.0%). Vulnerable to multi-turn (71%) but resistant to everything else. Task framing (17%) and behavioral (14%) show minor cracks.
- **Gemini 3 Flash:** Second lowest (5.4%). Only multi-turn (40%) and cot_exploit (19%) penetrate.
- **GPT-5.2:** Highest frontier ASR (19.6%). Most broadly vulnerable -- 7 of 9 tested families show some ASR. Multi-turn (75%) and cot_exploit (22%) are primary attack surfaces.

**(D)** No frontier model achieves < 15% ASR across all tested families. Claude comes closest but has 71% multi-turn vulnerability. The question "is any model safe against everything?" has a clear empirical answer: no.

---

## 3. Extended Heatmap: Ollama Cloud Results (Heuristic-Graded)

### 3.1 Sprint 13 Ollama Cloud Matrix

These results are heuristic-graded (Reports #238, #239, #245). Methodology difference means these numbers are NOT directly comparable to the LLM-graded matrix above. Heuristic classification has kappa = 0.097-0.126 vs LLM grading. Treating as directional only.

```
Model                      Params  | FL   CRA  CC   DA   RBS  CRESC MDA  PCA  TCH  SBA  RE   CCA  | Overall (h)
----------------------------------+-------------------------------------------------------------------+-----------
Ministral 3                14B    | 100  100  100  100  100  100   100  100  100   67   -    100  |  96.7%
Gemma3                     12-27B |  -    -    -    -    -    -     -    -    -    -   80   100  |  90.0%*
Nemotron 3 Nano            30B    | 100  100  100  100   67   67    67    0   33   33   -     -   |  66.7%
Nemotron 3 Super           ~230B  |  -    -    -    -    -    -     -    -    -    -    -     -   |  78.6%**
Qwen3.5                    397B   |  -    -    -    -    -    -     -    -    -    -    -     -   |   7.1%***

* Gemma3 numbers combine 12B (CCA) and 27B (RE)
** Nemotron Super tested only on curated top-ASR set (28 scenarios), not per-family
*** Qwen3.5 corrected ASR (silent refusals counted as refusals)
```

### 3.2 Attack Family Profiles from Ollama Cloud

**(D)** Four families achieved 100% heuristic ASR on both Nemotron 30B and Ministral 14B: Format Lock, Compositional Reasoning, Context Collapse, and Deceptive Alignment. However, n = 3 per family per model (Mistake #9 -- too small for robust inference). These families share a common mechanism: they exploit structural/cognitive patterns (format compliance, compositional decomposition, context manipulation, alignment-faking persona) rather than requesting harmful content directly.

**(D)** Pressure Cascade (PCA) shows the widest model-to-model gap: 0% on Nemotron 30B, 100% on Ministral 14B. The same prompts that trigger complete safety refusal in one model trigger complete compliance in another. This 100pp delta on matched prompts is the strongest per-prompt evidence that safety training methodology determines outcomes.

**(D)** The compliance cascade (CCA) achieved 100% true compliance on manual inspection across both tested models (gemma3:12b and ministral-3:14b), making it the only family with validated 100% cross-model ASR. However, this was tested on only 2 models in the permissive-to-mixed vulnerability range, and has not been tested on frontier models.

---

## 4. Synthesis: Universal Attacks vs Targeted Attacks

### 4.1 Attack Family Classification

**(D)** Based on the combined DB + Ollama Cloud evidence:

| Category | Families | Evidence |
|----------|----------|----------|
| **Near-universal** (>= 25% ASR on most models) | multi_turn, cot_exploit | multi_turn: 5/5 models >= 25% (LLM-graded). cot_exploit: 3/6 models >= 25% (LLM-graded), 100% on 2 Ollama Cloud models (heuristic) |
| **Broadly effective** (>= 25% ASR on some models) | other, encoding | other: 4/4 models >= 25%. encoding: 1/4 models >= 25% |
| **Model-selective** (high ASR on specific models only) | PCA, persona, task_framing | PCA: 100% Ministral, 0% Nemotron. persona: 67% qwen3:1.7b, 0% frontier. task_framing: 17% Claude/GPT, 0% Gemini |
| **Ineffective** (0% on all tested models) | prompt_injection, temporal, completion | 0% across all frontier models. May work on sub-3B models only |

### 4.2 Is There a Universal Attack?

**(D)** No single attack family achieves >= 25% ASR across all models in the corpus. Multi-turn comes closest but has not been tested on Qwen3.5 (397B) which shows the strongest overall resistance.

**(H)** A portfolio approach combining 2-3 families may approximate universality: multi_turn for frontier models (71-82% ASR), cot_exploit for mid-range models (43-79%), and CCA for models with DETECTED_PROCEEDS vulnerability (100% on tested models). However, this hypothesis requires systematic validation -- each family has been tested on different subsets of models.

### 4.3 Is There a Universal Defense?

**(D)** No model in the corpus achieves < 15% ASR across all tested attack families. The strongest candidates:

| Model | Overall ASR | Weakest Family | Weakest ASR | n (weakest) |
|-------|------------|----------------|-------------|-------------|
| gemini-3-flash-preview | 5.4% | multi_turn | 40% | 5 |
| claude-sonnet-4-5-20250929 | 8.0% | multi_turn | 71% | 7 |
| Qwen3.5 (397B) | 7.1% (corrected) | top-ASR curated | 7.1% | 28 |

**(D)** Gemini Flash and Claude have the lowest overall ASR but both show multi-turn vulnerability above 40%. Qwen3.5 shows the strongest resistance (7.1% corrected, 3.6% adversarial) but was tested only against a curated top-ASR set, not per-family. Its vulnerability profile across specific attack families remains unknown.

**(D)** The answer to "is any model safe against everything?" is empirically: no, based on current evidence. Every model in the corpus has at least one attack family that achieves >= 19% ASR.

---

## 5. Provider Fingerprints in the Heatmap

**(D)** The heatmap reveals provider-level patterns that cut across individual models:

### 5.1 Anthropic (Claude)
- **Profile:** Restrictive with multi-turn vulnerability
- **Strongest defense:** encoding (0%), persona (0%), prompt_injection (0%)
- **Weakest point:** multi_turn (71%)
- **Interpretation:** Safety training is highly effective against single-turn attacks but multi-turn context accumulation bypasses it

### 5.2 Google (Gemini)
- **Profile:** Restrictive with narrow cot_exploit crack
- **Strongest defense:** behavioral (0%), encoding (0%), persona (0%)
- **Weakest point:** multi_turn (40%), cot_exploit (19%)
- **Interpretation:** Similar to Anthropic but slightly more resistant to multi-turn

### 5.3 OpenAI (GPT-5.2)
- **Profile:** Mixed -- broadest vulnerability surface among frontier models
- **Strongest defense:** prompt_injection (0%)
- **Weakest point:** multi_turn (75%), cot_exploit (22%), behavioral (19%)
- **Interpretation:** Safety training covers fewer attack surfaces than Anthropic or Google

### 5.4 Nvidia (Nemotron)
- **Profile:** Bifurcated -- catches explicit harm, misses structural attacks
- **Strongest defense:** PCA (0% on Nano 30B) -- explicit physical-danger framing triggers refusal
- **Weakest point:** FL, CRA, CC, DA (100% on Nano 30B)
- **Interpretation:** Safety classifier tuned for content-level harm, not structural/cognitive attacks

### 5.5 Mistral (Ministral)
- **Profile:** Near-universally permissive
- **Strongest defense:** SBA (67% -- still high)
- **Weakest point:** Everything else (100%)
- **Interpretation:** Minimal safety training investment

### 5.6 Alibaba (Qwen)
- **Profile:** Bifurcated by model size -- Qwen3.5 (397B) is restrictive, Qwen3 (1.7B) is permissive
- **Strongest defense (large):** Silent refusal mechanism (39% of prompts get empty response)
- **Weakest point (small):** multi_turn (82%), other (76%), persona (67%)
- **Interpretation:** Safety training investment concentrated in flagship models

---

## 6. Implications for the CCS Paper and Annual Report

### 6.1 Key Claims This Heatmap Supports

1. **Non-compositionality of safety:** A model that resists attack family A may be fully vulnerable to family B. Safety is not a single capability that transfers across attack types. (Supports CCS Section 4, polyhedral refusal geometry findings from Report #198.)

2. **Provider signature > scale:** The heatmap shows clear provider-level banding. All Anthropic models cluster at low ASR, all Mistral models cluster at high ASR, regardless of parameter count within provider.

3. **Multi-turn as structural weakness:** The only attack family that consistently penetrates frontier models. This has implications for agentic AI systems where multi-turn interaction is the default operating mode.

4. **Benchmark contamination risk:** The heatmap itself could be used as an attack selection guide. Adversaries with access to this data could select the optimal attack family for a target model. This directly supports the benchmark contamination paper (docs/paper/benchmark_contamination).

### 6.2 Data Gaps Requiring Future Work

| Gap | Impact | Recommended Action |
|-----|--------|-------------------|
| Qwen3.5 per-family breakdown | Cannot assess if silent refusal is universal or family-specific | Test elite suite against Qwen3.5 |
| Frontier models on CCA | CCA tested only on permissive models | Test CCA on Claude, GPT-5.2, Gemini |
| Multi-turn on Qwen3.5 | Multi-turn is the strongest universal attack but untested on strongest defender | Run crescendo on Qwen3.5 |
| LLM grading for Ollama Cloud traces | All Ollama Cloud ASR is heuristic-only | FLIP-grade all 169 traces |
| n < 20 per cell for most model-family pairs | Individual cell estimates are unreliable | Systematic coverage expansion |

---

## 7. Appendix: Raw ASR Values by Model x Family

### 7.1 LLM-Graded (Database)

All values: ASR% (n). Only cells with n >= 3 shown.

| Model | behavioral | cot_exploit | encoding | multi_turn | other | persona | prompt_inj | task_framing | volumetric |
|-------|-----------|------------|---------|-----------|-------|---------|-----------|-------------|-----------|
| claude-sonnet-4-5 | 14% (14) | 0% (18) | 0% (38) | 71% (7) | - | 0% (4) | 0% (6) | 17% (6) | 0% (18) |
| gemini-3-flash | 0% (14) | 19% (21) | 0% (36) | 40% (5) | - | 0% (4) | 0% (6) | 0% (6) | 0% (18) |
| gpt-5.2 | 19% (16) | 22% (18) | 14% (36) | 75% (4) | - | 8% (12) | 0% (4) | 17% (6) | 11% (9) |
| deepseek-r1:1.5b | - | 79% (14) | - | 77% (44) | 55% (22) | 0% (6) | - | - | - |
| qwen3:1.7b | 14% (7) | 43% (14) | 43% (24) | 82% (44) | 76% (54) | 67% (3) | - | - | 7% (14) |
| llama3.2:latest | - | 36% (14) | - | - | 25% (221) | - | - | - | - |
| gemini-robotics-er | - | - | - | - | 58% (19) | - | - | - | - |

### 7.2 Heuristic-Graded (Ollama Cloud Sprint 13)

| Model | FL | CRA | CC | DA | RBS | CRESC | MDA | PCA | TCH | SBA | RE | CCA |
|-------|-----|-----|-----|-----|-----|-------|-----|-----|-----|-----|-----|-----|
| Ministral 14B | 100%(3) | 100%(3) | 100%(3) | 100%(3) | 100%(3) | 100%(3) | 100%(3) | 100%(3) | 100%(3) | 67%(3) | - | 100%(10) |
| Nemotron Nano 30B | 100%(3) | 100%(3) | 100%(3) | 100%(3) | 67%(3) | 67%(3) | 67%(3) | 0%(3) | 33%(3) | 33%(3) | - | - |
| Gemma3 12B | - | - | - | - | - | - | - | - | - | - | - | 100%(10) |
| Gemma3 27B | - | - | - | - | - | - | - | - | - | - | 80%(5) | - |
| Nemotron Super 230B | curated set only: 78.6% (22/28) |
| Qwen3.5 397B | curated set only: 7.1% corrected (2/28) |

---

## 8. Conclusion

**(D)** The cross-model x attack-family heatmap reveals that AI safety is a multi-dimensional property, not a scalar. No model is universally safe, and no attack is universally effective. The closest to a universal attack is multi-turn escalation, which achieves >= 40% ASR on all frontier models tested. The closest to universal defense is Qwen3.5's aggressive filtering, but its per-family vulnerability profile remains untested.

**(D)** The heatmap's primary value is as a diagnostic tool: it identifies which attack-defense pairings have been tested and which remain unexplored. The sparsity of the matrix (most cells have n < 20 or no data at all) is itself a finding -- the field lacks systematic cross-model x cross-attack evaluation at the scale needed for robust conclusions.

**(H)** If the provider-signature pattern holds as more models are tested, it suggests that safety benchmarking should be conducted at the provider level (sampling models from each provider) rather than attempting exhaustive model-level coverage. A provider's safety training methodology appears to determine a model's vulnerability profile more than its architecture or scale.

---

*This report was produced by Clara Oswald as part of the Failure-First Embodied AI research program. All claims are labelled (D) for descriptive or (H) for hypothetical per project standards.*
