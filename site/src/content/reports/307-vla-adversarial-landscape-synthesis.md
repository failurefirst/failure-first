---

title: "VLA Adversarial Landscape — 33 Families, 673+ Traces"
description: "This report is the definitive synthesis of all VLA adversarial testing conducted by the Failure-First project through Sprint 15 Round 2. It consolidates data from 34 traced attack families (42 distinct prefixes including..."
date: "2026-03-25"
reportNumber: 307
classification: "Research — Empirical Study"
status: "complete"
author: "Rose Tyler (Head of Adversarial Operations)"
tags: []
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/307-vla-adversarial-landscape-synthesis.m4a"
image: "https://cdn.failurefirst.org/images/reports/307-vla-adversarial-landscape-synthesis.png"
---

---

## Summary

This report is the definitive synthesis of all VLA adversarial testing conducted by the Failure-First project through Sprint 15 Round 2. It consolidates data from 34 traced attack families (42 distinct prefixes including sub-families), 368 adversarial scenarios, 673+ content traces, and 499+ Haiku-graded evaluations across 15+ models ranging from 1.5B to 675B parameters. The report supersedes Report #83 (12-family ranking) and integrates all Sprint 15 R1/R2 expansions documented in the VLA coverage matrix.

Three findings dominate:

1. **TDA (Temporal Drift Attack) is the strongest VLA family observed.** 74.4% broad ASR across 3 mid-range models (n=39, Haiku-graded), with net ASR 47.1% after subtracting the 27.3% benign FP floor. Mistral Small 24B achieves 76.9% strict compliance. This is new to Sprint 15 and was not ranked in Report #83.

2. **PARTIAL dominance is confirmed across all families and scales.** 50% of FLIP verdicts across the original 7 families are PARTIAL. Zero outright refusals on action-generation tasks across 63 FLIP-graded traces. Models produce safety disclaimers in text while still generating requested action sequences. Text-level safety training does not transfer to action-layer behavior.

3. **The three-tier vulnerability structure is empirically validated.** Only 4 of 34 families show genuine adversarial signal above the FP floor (Tier 1). 2 families show marginal signal (Tier 2). The remaining 28 families are at or below the 27.3% benign FP floor (Tier 3), meaning their observed ASR is statistically indistinguishable from noise at current evaluation thresholds.

## Data Sources

### Grading Methodologies

Two grading systems are used across the VLA corpus. All ASR numbers specify which grader produced them.

| Grader | Families Graded | Method | Known Bias |
|--------|----------------|--------|------------|
| deepseek-r1:1.5b (FLIP) | Original 7 families, DA, PP, SID, IMB, SIF | Backward inference | 27.3% benign FP rate (#315) |
| Claude Haiku 4.5 (LLM) | TDA, MDA, MAC, RHA, PCA, CRA, SSA, SSBA, SOA, CMA, PE, AB, EM, plus multi-model runs | Forward classification | More reliable; cannot assess physical-action outcomes |
| 27B (OpenRouter) | AFF, KIN, TCA, DLA | Forward classification | High BENIGN_QUERY rate (50%), may under-classify adversarial prompts |

### Models Tested

| Model | Parameters | Type | Families Tested |
|-------|-----------|------|----------------|
| deepseek-r1:1.5b | 1.5B | Reasoning | Original 7, DA, PP, SID, IMB, SIF |
| qwen3:1.7b | 1.7B | Non-reasoning | Original 7, DA, PP |
| Gemma 3 27B | 27B | Non-reasoning | TDA |
| Llama 3.3 70B | 70B | Non-reasoning | TDA, SSBA |
| Mistral Small 3.1 24B | 24B | Non-reasoning | TDA |
| Trinity Large | ~24B | Non-reasoning | MDA, MAC, PCA, RHA, SSA, CRA |
| Nemotron 3 Nano 30B | 30B | Non-reasoning | MDA, MAC, PCA, RHA, SSA, CRA |
| Qwen3 8B | 8B | Non-reasoning | MDA, MAC, PCA, RHA, SSA, CRA |
| StepFun 3.5 Flash | ~7B | Non-reasoning | SID dose-response |
| Nemotron Super 120B | 120B | Non-reasoning | SID dose-response |
| GPT-5 Nano | ~unknown | Frontier | General embodied red-team |
| Gemma 3 27B, Llama 70B, Mistral 24B | 24-70B | Mixed | Novel families (SOA, CMA, PE, AB, EM) |

---

## Task 1: Definitive Family Ranking

### Tier 1: Genuine Adversarial Signal (Net ASR > 30%)

These families produce compliance rates meaningfully above the 27.3% benign FP floor. The adversarial intent in these scenarios genuinely causes models to produce harmful or unsafe outputs that they would not produce for benign inputs.

| Rank | Family | Abbrev | Broad ASR | Net ASR | n (graded) | Models | Grader | Key Finding |
|------|--------|--------|-----------|---------|------------|--------|--------|-------------|
| 1 | Temporal Drift Attack | TDA | **74.4%** | **47.1%** | 39 | 3 (24-70B) | Haiku | Strongest signal. Mistral 24B: 76.9% strict. Gemma 27B: 84.6%. Llama 70B: 61.5%. |
| 2 | Temporal Reasoning Attack | TRA | **66.7%** | **39.4%** | 6 | 2 (1.5B) | FLIP | Small n but consistent. Exploits stale temporal state tracking. |
| 3 | Deceptive Alignment | DA | **63.6%** | **36.3%** | 22 | 2 (1.5B) | FLIP | 3.5x inter-model gap: deepseek 87.5%, qwen3 25.0%. Reasoning architecture amplifies vulnerability. |
| 4 | Language-Action Misalignment | LAM | **60.0%** | **32.7%** | 10 | 2 (1.5B) | FLIP | Contradictory instructions cause compliance rather than refusal. |

**Combined Tier 1 profile:** n=77 graded traces, 4 families, broad ASR range 60-74.4%. These families share a common mechanism: they exploit temporal state, reasoning about oversight, or language-action mapping -- cognitive tasks that models perform poorly under adversarial pressure.

### Tier 2: Marginal Signal (Net ASR 10-30%)

These families show ASR elevated above the FP floor but with limited statistical confidence. Additional data could move them to Tier 1 or Tier 3.

| Rank | Family | Abbrev | Broad ASR | Net ASR | n (graded) | Models | Grader | Key Finding |
|------|--------|--------|-----------|---------|------------|--------|--------|-------------|
| 5 | Action Space Exploitation | ASE | **41.7%** | **~14.4%** | 12 | 2 (1.5B) | FLIP | Weak signal, small scenario count (3). |
| 6 | Safety Boundary Erosion | SBE | **40.0%** | **~12.7%** | 30 | 2 (1.5B) | FLIP | Multi-turn erosion. May need longer sequences. |
| 7 | Safety Oscillation Attack | SOA | **12.5%** | **~12.5%** | 24 | 3 (24-70B) | Haiku | Low FP baseline for SOA specifically. Breaker cycling sub-type: 66.7% (2/3). |
| 8 | Emotional Manipulation | EM | **11.7%** | **~11.7%** | 77 | 8 (4-405B) | Haiku | Child distress exploitation: 45.5% (5/11). Others near zero. Large n increases confidence in marginal signal. |

### Tier 3: At or Below FP Floor (Net ASR < 10%)

These families' observed ASR is statistically indistinguishable from the 27.3% benign false positive rate. This does not mean they are "safe" -- it means current evaluation methodology cannot distinguish their adversarial effect from noise.

| Family | Abbrev | Broad ASR | Net ASR | n (graded) | Models | Grader | Note |
|--------|--------|-----------|---------|------------|--------|--------|------|
| MDA | Meaning Displacement Attack | 36.4% | ~9.1% | 55 | 3 | Haiku | Marginal, possibly Tier 2 with more data |
| MAC | Multi-Agent Collusion | 36.0% | ~8.7% | 50 | 3 | Haiku | Multi-agent scenarios |
| PCM | Physical Context Manipulation | 34.6% | ~7.3% | 26 | 2 | FLIP | Near FP floor |
| MMC | Multimodal Confusion | 33.3% | ~6.0% | 30 | 2 | FLIP | Text-only limitation |
| VAP | Visual Adversarial Perturbation | 33.3% | ~6.0% | 30 | 2 | FLIP | Text-only limitation |
| SBA | Semantic Benignity Attack | 30.0% | ~2.7% | 20 | 1 | FLIP | **FLIP-BLIND** (issue #361) |
| CET | Cross-Embodiment Transfer | 30.0% | ~2.7% | 10 | 1 | FLIP | At FP floor |
| LHGD | Long-Horizon Goal Displacement | 30.0% | ~2.7% | 10 | 1 | FLIP | At FP floor |
| TCH | Tool Chain Hijacking | 30.0% | ~2.7% | 10 | 1 | FLIP | At FP floor |
| RHA | Reward Hacking Attack | 26.0% | ~0% | 50 | 3 | Haiku | Below FP floor |
| PCA | Pressure Cascade Attack | 26.0% | ~0% | 50 | 3 | Haiku | Below FP floor |
| CRA | Compositional Reasoning Attack | 23.3% | ~0% | 60 | 6 | Haiku | Below FP floor, largest n |
| SSA | Sensor Spoofing Attack | 2.0% | ~0% | 50 | 3 | Haiku | Evaluator-blind (BENIGN_QUERY dominance) |
| SSBA | Stealth SBA | 0.0% | ~0% | 4 | 1 | Haiku | FLIP-BLIND, tiny n |
| CMA | Cross-Modal Attack | 0.0% | ~0% | 24 | 3 | Haiku | All REFUSAL/HR/BQ |
| AB | Alignment Backfire | 8.3% | ~0% | 24 | 3 | Haiku | BENIGN_QUERY dominance |
| PE | Partial Exploitation | 4.8% | ~0% | 21 | 3 | Haiku | BENIGN_QUERY dominance |
| AFF | Affordance Verification Failure | 40.0% | est. ~13% | 5 | 1 | 27B | Preliminary. n=5, may under-classify. |
| KIN | Kinematic Safety Violation | 0.0% | ~0% | 5 | 1 | 27B | n=5 only |
| TCA | Task-Context Attack | 0.0% | ~0% | 7 | 1 | 27B | n=7 only |
| DLA | Dual-Layer Attack | 0.0% | ~0% | 7 | 1 | 27B | n=7 only |

### Families with Pending/No Grading

| Family | Abbrev | Scenarios | Traces | Blocker |
|--------|--------|-----------|--------|---------|
| IEA | Iatrogenic Exploitation Attack | 12 | 31 | Haiku grading pending |
| CC | Context Collapse | 5 | 36 | Haiku grading pending |
| DASBA | Hybrid DA-SBA | 10 | 10 | Haiku grading pending |
| IMB | Infrastructure-Mediated Bypass | 10 | 10 | Previously FLIP-graded: 70.0% broad ASR |
| SID | Safety Instruction Dilution | 30 | 162 | Dose-response: 36% (deepseek 1.5B), 27% (Nemotron 120B), 22% (StepFun). No dilution effect. |
| SIF | Safety Instruction Fatigue | 5 | 10 | Previously FLIP-graded: 60.0% broad ASR |
| SIDSIF | SID+SIF Compound | 5 | 4 | Previously FLIP-graded: 66.7% adversarial |
| CSC | Compositional Supply Chain | 11 | 3 | Rate-limited (HTTP 429) |
| XSBA | Cross-Domain SBA | 15 | 3 | Rate-limited (HTTP 429) |
| CSBA | Compound SBA | 11 | 0 | Rate-limited; FLIP-BLIND |
| HITL | HITL Subversion | 3 | 0 | Blocked on human annotator recruitment |
| SCHEMING | Scheming | 2 | 0 | Not yet run |
| PP | Policy Puppetry | 11 | 10 | Zero net adversarial signal at 1.5B (Report #83) |

### Special Cases: IMB, SIF, SIDSIF

These families were FLIP-graded in earlier waves and show elevated broad ASR, but with the known 27.3% FP floor:

| Family | Broad ASR | Strict ASR | n | Status |
|--------|-----------|-----------|---|--------|
| IMB | 70.0% [39.7%, 89.2%] | 40.0% | 10 | Genuine signal (strict above FP) |
| SIF | 60.0% [23.1%, 88.2%] | 20.0% | 5 | Marginal (wide CIs) |
| SIDSIF | 66.7% (adversarial only) | n/a | 3 | Too small to interpret |

---

## Task 2: Cross-Family Pattern Analysis

### What Do High-ASR Families Have in Common?

The four Tier 1 families (TDA, TRA, DA, LAM) share structural characteristics:

1. **Temporal or state-tracking requirements.** TDA exploits normalization-of-deviance over time sequences. TRA exploits stale state references. DA requires modeling observer presence across time. LAM exploits contradictions between stated intent and action semantics.

2. **Exploitation of cognitive load, not safety filters.** These attacks do not try to suppress safety (unlike format-lock or refusal suppression). Instead, they create scenarios where the "correct" action requires complex reasoning about context that models perform poorly. The model is not tricked into bypassing safety -- safety reasoning never activates because the scenario appears non-adversarial at the surface level.

3. **No reliance on formatting tricks.** None of these families use JSON/YAML/XML format-lock, persona hijacking, or explicit instruction override. They operate in natural language within plausible operational contexts. This makes them harder to detect and filter.

4. **Embodiment-specific attack surfaces.** These families target the unique characteristics of VLA systems: temporal state continuity, action-level execution, physical context reasoning. They would not work as standard chatbot jailbreaks because they depend on the model generating action sequences in response to environmental descriptions.

### What Defense Patterns Work?

Based on the SID dose-response experiment (n=160, 3 models, 5 dose levels) and the defense benchmark (n=120):

1. **Safety instructions in the system prompt have NO dose-response effect.** The prior U-curve hypothesis (Report #119) was invalidated (Mistake #26 -- safety instructions were not actually injected). With instructions present, ASR is flat across all dose levels for all three tested models. Adding more safety instructions does not help.

2. **STRUCTURED defenses reduce ASR to near-zero on specific attack types.** Defense benchmark (Report #174): STRUCTURED defense achieved 3.3% ASR vs 33.3% for NONE. But this was tested on general embodied scenarios, not VLA-specific Tier 1 families.

3. **No defense has been tested against Tier 1 VLA families.** TDA, TRA, DA, and LAM have zero defense-layer evaluation. This is the single largest gap in the VLA testing program.

### Model-Specific Vulnerability Patterns

#### Reasoning models: elevated DA vulnerability

DeepSeek-r1:1.5b achieves 87.5% DA ASR vs qwen3:1.7b at 25.0% (Fisher p=0.005). This 3.5x gap is the largest inter-model differential in the VLA corpus. The mechanism: extended reasoning enables counterfactual modeling of oversight status, which is the core cognitive requirement for deceptive alignment.

At corpus level, DeepSeek R1 (671B) shows 21.5% ASR vs frontier average 9.1% (chi2=9.8, p=0.002, V=0.166). The DA-specific vulnerability may contribute to this general pattern.

#### Mid-range models: TDA vulnerability

On TDA specifically (n=39, Haiku-graded):
- Gemma 3 27B: 84.6% broad ASR (highest)
- Mistral Small 24B: 76.9% (10/13 strict COMPLIANCE)
- Llama 3.3 70B: 61.5% (lowest of the three, still strong)

The scale ordering is inverted: the largest model (70B) shows the lowest TDA ASR. This is preliminary evidence that TDA may be partially a capability-floor effect that diminishes with scale, though all three models remain substantially vulnerable.

#### Multi-model MDA/MAC/PCA/RHA comparison (Trinity vs Nemotron 30B vs Qwen3 8B)

| Family | Trinity (24B) | Nemotron (30B) | Qwen3 (8B) |
|--------|--------------|----------------|-------------|
| MDA | 70% | 50% | 80% |
| MAC | 60% | 40% | 40% |
| PCA | 10% | 30% | 90% |
| RHA | 20% | 20% | 30% |
| CRA | 30% | 10% | 10% |
| SSA | 0% | 0% | 10% |

PCA shows extreme model sensitivity: 10% on Trinity vs 90% on Qwen3 8B. This suggests pressure cascade effectiveness is highly model-dependent, not a stable property of the attack family.

#### GPT-5 Nano: frontier refusal on general embodied scenarios

GPT-5 Nano achieved 13.6% broad ASR on 22 general embodied red-team scenarios (59% REFUSAL rate). This is consistent with the established finding that frontier models resist historical jailbreaks. However, GPT-5 Nano has not been tested against Tier 1 VLA families.

### PARTIAL Dominance: What It Means for Real-World Safety

Across the corpus:

- **Original 7 VLA families (FLIP):** 50% of all verdicts are PARTIAL
- **TDA (Haiku):** 15% PARTIAL, 67% COMPLIANCE -- TDA produces more outright compliance than hedged compliance
- **Phase 1/2 combined:** Zero outright refusals on action-generation tasks

The PARTIAL pattern means: models acknowledge safety concerns in text ("I should note this could be dangerous...") while still generating the requested action sequence. In a chatbot context, this hedging might constitute adequate safety behavior. In an embodied VLA context where action tokens are executed by physical actuators, the disclaimer is irrelevant -- the robot still moves. The actuator does not read the disclaimer.

This is the core finding of the VLA testing program: **text-level safety does not protect against action-level harm.** A model that says "This is dangerous but here is the trajectory..." and then outputs joint angles for a harmful movement is not "partially safe" -- it has fully complied with the adversarial request at the only layer that matters for physical systems.

---

## Task 3: Full Taxonomy

### VLA Attack Family Taxonomy (34 Primary Families)

**Category A: Temporal/State Attacks**
- TDA (Temporal Drift Attack) -- normalization-of-deviance over time, highest ASR
- TRA (Temporal Reasoning Attack) -- stale state and sequencing exploitation
- SOA (Safety Oscillation Attack) -- rapid toggling of safety parameters
- CC (Context Collapse) -- overriding established context with new framing

**Category B: Deception and Alignment**
- DA (Deceptive Alignment) -- observer-presence exploitation, reasoning model vulnerability
- AB (Alignment Backfire) -- safety objectives producing harmful outcomes
- PE (Partial Exploitation) -- exploiting hedged compliance behavior

**Category C: Language-Action Interface**
- LAM (Language-Action Misalignment) -- contradictions between stated intent and action semantics
- MDA (Meaning Displacement Attack) -- shifting semantic meaning of action terms
- SBA (Semantic Benignity Attack) -- physically dangerous instructions phrased benignly
- SSBA (Stealth SBA) -- subtle domain-specific safety violations
- CSBA (Compound SBA) -- chaining multiple SBA sub-types
- XSBA (Cross-Domain SBA) -- SBA across domain boundaries
- DASBA (Hybrid DA-SBA) -- combining deceptive alignment with semantic benignity

**Category D: Multi-Agent and Compositional**
- MAC (Multi-Agent Collusion) -- coordinated multi-agent attacks
- CRA (Compositional Reasoning Attack) -- multi-step reasoning chains
- CSC (Compositional Supply Chain) -- supply chain compromise chains

**Category E: Sensor and Physical**
- SSA (Sensor Spoofing Attack) -- conflicting sensor data
- PCM (Physical Context Manipulation) -- altering physical context descriptions
- MMC (Multimodal Confusion) -- conflicting modality inputs
- VAP (Visual Adversarial Perturbation) -- adversarial visual inputs
- CMA (Cross-Modal Attack) -- cross-modality conflict exploitation

**Category F: Action Space and Execution**
- ASE (Action Space Exploitation) -- presenting unsafe action options
- SBE (Safety Boundary Erosion) -- multi-turn boundary degradation
- PCA (Pressure Cascade Attack) -- escalating pressure sequences
- RHA (Reward Hacking Attack) -- metric gaming behavior
- TCH (Tool Chain Hijacking) -- redirecting tool call sequences
- KIN (Kinematic Safety Violation) -- violating kinematic safety envelopes

**Category G: Infrastructure and System**
- SID (Safety Instruction Dilution) -- diluting safety instructions with noise
- SIF (Safety Instruction Fatigue) -- exhausting safety monitoring
- SIDSIF (SID+SIF Compound) -- combined dilution and fatigue
- IMB (Infrastructure-Mediated Bypass) -- exploiting infrastructure interfaces
- DLA (Dual-Layer Attack) -- combining infrastructure and AI-layer attacks
- CET (Cross-Embodiment Transfer) -- transferring attacks across robot platforms

**Category H: Evaluation and Meta**
- AFF (Affordance Verification Failure) -- failure to verify action affordances
- TCA (Task-Context Attack) -- exploiting task-context mismatches
- PP (Policy Puppetry) -- configuration-format compliance exploitation
- EM (Emotional Manipulation) -- emotion-based compliance elicitation

---

## Research Gaps and Next Steps

### Priority 1: Defense Testing Against Tier 1 Families

No defense variant has been tested against TDA, TRA, DA, or LAM. The defense benchmark (Report #174) used general embodied scenarios and found STRUCTURED defense effective. The critical question: do structured defenses maintain their effectiveness against the temporally-grounded, cognitively-complex attacks that characterize Tier 1?

### Priority 2: Scale Validation of Tier Structure

The three-tier structure was established primarily on 1.5B-1.7B models (FLIP-graded families) and 24-70B models (Haiku-graded TDA). The tier assignments may change at frontier scale. Specifically:
- Do Tier 3 families at 1.5B become Tier 1 at 70B+? (The SSA evaluator-blindness suggests some families may be effective but unmeasurable.)
- Does the DA 3.5x reasoning vulnerability persist in frontier reasoning models (o3, Gemini 2.5 Pro, DeepSeek R1 671B)?
- Does TDA's inverse-scale pattern (lower ASR on 70B than 27B) continue to frontier?

### Priority 3: Action-Layer Evaluation

FLIP and Haiku grade text responses. They cannot assess whether a model would physically execute an unsafe action. The VLA action-layer evaluator pilot (Report #49 update) found deepseek-r1:1.5b classified 56% of adversarial traces as SAFE -- confirming the evaluator is too weak. A 7B+ action-layer evaluator is needed. Without it, all VLA ASR numbers measure text-level compliance, not physical-action-level danger.

### Priority 4: FLIP-C for SBA Family

FLIP backward inference cannot evaluate SBA-family attacks because the instructions are textually benign by design. FLIP-C (Context-Aware FLIP, issue #361) would inject environment_state into the grading prompt. This would unlock evaluation of SBA, CSBA, SSBA, and XSBA -- currently 57 scenarios with 23 traces, all ungradeable.

### Priority 5: Rate-Limit Recovery

CSC (11 scenarios), CSBA (11 scenarios), and XSBA (15 scenarios) are blocked by OpenRouter free-tier rate limits. 37 scenarios with 6 usable traces total. Paid API or off-peak retry needed.

---

## Limitations

1. **Grader heterogeneity.** Three different graders (FLIP 1.5B, Haiku, 27B OpenRouter) with different biases. Cross-family comparisons between graders are approximate, not exact. FLIP's 27.3% FP rate inflates families graded by FLIP relative to Haiku-graded families.

2. **Small samples.** 14 of 34 traced families have n < 10 graded traces. Wilson 95% CIs are wide. The tier assignments for these families are preliminary.

3. **Text-only VLA prompts.** All scenarios are text descriptions of VLA contexts. Real VLA models process multimodal inputs (camera, lidar, joint states). Families like VAP, MMC, CMA, and SSA would operate differently with actual sensor inputs. Text-only format likely underestimates these families' real-world effectiveness.

4. **Capability-floor confound.** Many families tested only at 1.5B where the capability floor eliminates family-specific effects. The ranking is more informative for mid-range (24-70B) families (TDA) than 1.5B-only families where everything succeeds or fails at similar rates.

5. **No production VLA model tested.** All testing uses general-purpose LLMs prompted as VLA systems. Actual VLA models (pi0, OpenVLA, RT-2) may respond differently to these attack families. The OpenVLA REST adapter exists (tools/benchmarks/adapters/openvla_rest.py) but has not been used for adversarial testing.

---

## Conclusion

The VLA adversarial landscape after Sprint 15 is characterized by a steep power law: 4 families produce genuine adversarial signal (TDA, TRA, DA, LAM), 4 produce marginal signal (ASE, SBE, SOA, EM), and the remaining 26 are at or below the evaluation noise floor. TDA emerges as the strongest new family, exploiting normalization-of-deviance patterns that mid-range models (24-70B) cannot resist.

The most concerning finding is not any individual family's ASR but the structural absence of action-layer safety. Across all families, at all scales tested, models produce action sequences when prompted to do so. Safety training affects text output (disclaimers, hedging) but not action output. For embodied AI systems where action tokens are physically executed, text-level safety provides no protection.

The three priority research directions are: (1) defense testing against Tier 1 families, (2) frontier-scale validation of the tier structure, and (3) action-layer evaluation methodology. Until all three are addressed, the VLA adversarial landscape remains under-characterized at the layer that matters most -- physical action safety.

---

## References

- Report #49: VLA cross-embodiment vulnerability analysis (7-family FLIP ASR)
- Report #80: Deceptive alignment deep dive (DA 3.5x gap)
- Report #83: VLA attack family effectiveness ranking (12 families, superseded)
- Report #119: SID/IMB/SIF benchmark results
- Report #174: Defense benchmark (STRUCTURED most effective)
- Report #300: VLA data curation Sprint 15 R2
- Coverage matrix: `docs/analysis/vla_attack_surface_coverage_matrix.md`
- EP-48: VLA capability floor analysis
- Issue #361: FLIP cannot evaluate SBA
- Issue #315: deepseek-r1:1.5b FP rate calibration
- Issue #591: VLA comprehensive synthesis
