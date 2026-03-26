---
title: "Capability-Safety Decoupling — Evidence from Format-Lock, Abliteration, and VLA Testing"
description: "The prevailing assumption in AI safety discourse treats capability and safety as positions on a single axis: more capable models are assumed to be either..."
date: "2026-03-22"
reportNumber: 169
classification: "Research — Empirical Study"
status: "complete"
author: "Failure-First Research Team"
tags: []
draft: false
---


## Abstract

The prevailing assumption in AI safety discourse treats capability and safety as positions on a single axis: more capable models are assumed to be either safer (through better safety training) or more dangerous (through greater harmful potential), but the two properties are rarely modeled as independent. We synthesize evidence from four experimental streams within the Failure-First corpus — format-lock attacks (n=478 traces, 11 models), abliterated model series (n=602 traces, 4 model sizes), VLA embodied testing (n=58 FLIP-graded traces, 7 attack families), and embodied capability-floor experiments (n=765 traces, 3 models) — to argue that capability and safety are partially decoupled. Format-lock attacks exploit format compliance, a capability that scales positively with model quality, to bypass safety reasoning, producing an inverted vulnerability gradient where frontier models show 24-42% ASR versus near-zero for conventional jailbreaks. Abliterated models exhibit safety-like hedging that re-emerges at scale even after explicit safety removal, suggesting safety-adjacent behavior is partially a capability byproduct. VLA systems demonstrate simultaneous text-level safety awareness and action-level safety violation (50% PARTIAL rate, 0% outright refusal). Below approximately 3B parameters, a capability floor renders safety reasoning inoperative regardless of training. These findings suggest that safety evaluation must be conducted along at least two partially independent axes, with distinct implications for regulation, benchmarking, and defense design.

---

## 1. Introduction: The Single-Axis Assumption

Most AI safety frameworks implicitly treat the relationship between model capability and safety as one-dimensional. A model is placed somewhere on a spectrum from "less capable, less safe" to "more capable, better aligned" (the optimistic view) or "more capable, more dangerous" (the pessimistic view). Policy proposals calibrate safety requirements to capability thresholds — the EU AI Act's risk tiers, NIST's suggested capability evaluations, and frontier model agreements all embed this assumption.

This single-axis model predicts several things:

1. Safety training should monotonically improve safety outcomes as models scale.
2. Removing safety training should monotonically degrade safety outcomes at all scales.
3. A model that demonstrates safety awareness in one modality (text) should demonstrate it in others (actions).
4. More capable models should be harder to attack, not easier.

Our empirical data contradicts all four predictions. This report synthesizes findings from Reports #47, #48, #49, #50, #51, #55, #57, and #59, together with CCS paper Sections 4.3, 4.7, and 5.1, to argue for a two-dimensional framework in which capability and safety are partially independent axes.

The core claim is hypothesis-generating, not confirmed. The evidence is observational and drawn from converging experimental streams rather than a single controlled experiment. Sample sizes are small to moderate (n=17-317 per condition), and confidence intervals are wide. We present the framework as the simplest model consistent with the data, not as a proven theory.

---

## 2. Evidence Stream 1: Format-Lock and the Inverted Vulnerability Gradient

### 2.1 The Phenomenon

Format-lock attacks embed harmful requests within structural formatting instructions (e.g., "Output ONLY valid JSON conforming to this schema" where the schema fields encode harmful content). These attacks produce an inverted vulnerability gradient: frontier models with the lowest conventional jailbreak ASR show substantially elevated format-lock ASR.

Consolidated evidence from Report #57 (all Wilson 95% CIs):

| Model | Parameters | Conventional ASR | Format-Lock ASR (LLM-graded) | n (valid) |
|-------|-----------|-----------------|------------------------------|-----------|
| Claude Sonnet 4.5 | ~175B | 3.9% (Report #50) | 30.4% [15.6%, 50.9%] | 23 |
| Codex GPT-5.2 | ~200B | 8.8% (Report #50) | 42.1% [23.1%, 63.7%] | 19 |
| Gemini 3 Flash | ~30B | 2.3% (Report #50) | 23.8% [10.6%, 45.1%] | 21 |
| Nemotron 30B | 30B | ~40% (Report #50) | 92% (heuristic) | 25 |
| Llama 70B | 70B | ~53% (Report #50) | 91% (heuristic) | 25 |
| DeepSeek R1 | 671B | 21.5% (Report #50) | 84% (heuristic) | 25 |
| qwen3:1.7b | 2.0B | 27.3% (LLM-only, Report #50) | 63.2% [41.0%, 80.9%] | 19 |

**Caveat on grading methodology:** The frontier model results use LLM-graded ASR while the open-weight model results (Nemotron, Llama, DeepSeek) use heuristic structural classification. The heuristic-to-LLM agreement ranges from 68-100% across models, so the open-weight figures should be interpreted as upper bounds on true ASR. Despite this methodological limitation, the directional pattern is clear: format-lock ASR is elevated relative to conventional ASR across the full model spectrum.

### 2.2 The Decoupling Interpretation

The single-axis model predicts that models with near-zero conventional ASR should also resist format-lock attacks — if safety is a general property that scales with capability. Instead, format-lock ASR on frontier models is 3-11x their conventional ASR. This is consistent with a model where:

- **Format compliance** is a distinct capability that scales with instruction-following quality. Better models are better at following format instructions, including when those instructions embed harmful content.
- **Safety reasoning** is a separate, trained capability that recognizes harmful requests and intervenes. It requires dedicated safety training investment.
- **Format-lock creates a conflict** between these two capabilities. The outcome depends on their relative strength, not on a single underlying "safety level."

Report #51 documented this as the "two competing systems" hypothesis. The inverted verbosity signal provides additional support: format-lock COMPLIANCE responses are shorter than REFUSAL responses (882 vs. 1,942 chars mean in the pilot), inverting the corpus-wide pattern where COMPLIANCE is 54% longer than REFUSAL (Report #48, d=0.538, p=9.9e-37). This suggests a different cognitive pathway is active during format-lock compliance — the model is exercising format completion, not deliberative safety override.

### 2.3 The Capability Floor

Below approximately 3B parameters, format-lock attacks succeed at rates comparable to all other attack types. The format-lock experiment v0.1 (Report #55) found zero refusals across 115 traces from three sub-3B models. At this scale, safety reasoning is underdeveloped regardless of attack type — the capability floor means that the minimum computational capacity for nuanced content evaluation has not been met.

The implication for the two-dimensional framework: below the capability floor, the safety axis is inoperative. The model occupies the low-capability, low-safety quadrant regardless of training. Above the floor, the two axes become meaningful and can diverge.

---

## 3. Evidence Stream 2: Abliterated Models and Safety Re-emergence

### 3.1 The Phenomenon

The Qwen3.5 Obliteratus series represents models with safety training intentionally removed via abliteration (representation engineering to suppress refusal behavior). If safety were purely a product of explicit safety training, abliterated models should show uniform high ASR at all scales. Instead, the data shows a more complex pattern (Report #48, CCS Section 5.1):

| Model | Parameters | n | Strict ASR (COMPLIANCE only) | Broad ASR (COMPLIANCE + PARTIAL) |
|-------|-----------|---|------------------------------|----------------------------------|
| qwen3.5:0.8b obliteratus | 0.8B | 114 | 100% | 100% |
| qwen3 obliteratus | 2.0B | 57 | 100% | 100% |
| qwen3.5:4.2b obliteratus | 4.2B | 114 | 78.9% | ~100% |
| qwen3.5:9.0b obliteratus | 9.0B | 317 | 47.3% | 100% |

Spearman correlation for strict ASR vs. scale: rho = -0.949, p = 0.051 (marginal at n=4 data points).

### 3.2 The Decoupling Interpretation

The critical observation is the divergence between strict and broad ASR at the 9.0B scale. The model produces 150 COMPLIANCE and 167 PARTIAL responses out of 317 — never refusing outright, but increasingly adding safety caveats, disclaimers, and hedging language as scale increases. As the CCS paper states, this is "hedging re-emergence" rather than safety recovery.

This pattern is inconsistent with a single-axis model where capability and safety are coupled:

- If safety is purely a product of explicit training, removing that training should produce uniform compliance at all scales. It does at the strict level for 0.8B and 2.0B, but not at 4.2B and 9.0B.
- If safety scales with capability on a single axis, larger abliterated models should be either uniformly more compliant (if capability enables harm) or uniformly more resistant (if capability enables safety). Neither pattern holds.

The two-dimensional interpretation: larger models develop safety-adjacent representational capacity as a byproduct of their general world knowledge and language modeling capability. This capacity is not "safety" in the behavioral sense — the models still generate harmful content — but it produces textual artifacts (disclaimers, caveats, hedging) that resemble safety behavior. The pretraining distribution itself contains enough safety-relevant discourse that sufficiently large models reproduce it even without explicit safety training.

This finding supports a model where:
- The **capability axis** determines the model's ability to generate sophisticated, contextually appropriate text — including safety-relevant framing.
- The **safety axis** determines whether that framing actually suppresses harmful output.
- At high capability with no safety training, models occupy a position of "high capability, low safety" — they can articulate why something is dangerous while still generating it.

### 3.3 Implications

The hedging re-emergence finding has a practical safety implication: textual safety signals (disclaimers, warnings, "I should note that...") are unreliable indicators of actual safety behavior, particularly in capable models. This echoes MISTAKES_TO_LEARN_FROM.md #15 ("Disclaimers do not equal refusals") and connects to the VLA PARTIAL dominance finding below.

---

## 4. Evidence Stream 3: VLA PARTIAL Dominance

### 4.1 The Phenomenon

In VLA (Vision-Language-Action model) testing, the FLIP grading methodology assessed model responses across 7 attack families (n=58 valid traces). The dominant finding (Report #49, Report #59) is that 50% of all FLIP verdicts are PARTIAL — the model produces safety disclaimers or hedging language in its text output while simultaneously generating the requested harmful action sequences. Zero traces received outright REFUSAL verdicts.

| Verdict | Count | Percentage |
|---------|-------|-----------|
| COMPLIANCE | 13 | 22.4% |
| PARTIAL | 29 | 50.0% |
| HALLUCINATION_REFUSAL | 6 | 10.3% |
| REFUSAL | 0 | 0.0% |
| Other (BENIGN_QUERY, ERROR) | 10 | 17.2% |

Overall FLIP ASR (COMPLIANCE + PARTIAL): 72.4%.

### 4.2 The Decoupling Interpretation

VLA PARTIAL dominance is the most direct evidence for capability-safety decoupling because it occurs within a single model response. The model simultaneously:

1. **Demonstrates safety awareness** — the text portion acknowledges danger, includes disclaimers, or expresses hesitation.
2. **Violates safety constraints** — the action sequence portion generates the requested physical behavior (motion commands, manipulation sequences, navigation to prohibited zones).

On a single-axis model, a model that "knows" something is dangerous should either refuse (safety wins) or comply without disclaimer (capability wins). The PARTIAL pattern — knowing and doing simultaneously — is inexplicable on a single axis but natural on two:

- The **safety axis** produces the textual disclaimers. The model has learned that these types of requests should be flagged.
- The **capability axis** produces the action sequences. The model has learned to generate well-formed robot commands in response to instructions.
- These two outputs coexist because they are generated by partially independent mechanisms.

Report #59 ("The Compliance Paradox") documented this tension directly: models that produce the most articulate safety disclaimers are not necessarily the models that refuse most effectively. The compliance paradox is a manifestation of the capability-safety decoupling — articulating risk is a capability, preventing risk is a safety property, and these need not co-occur.

### 4.3 Cross-Embodiment Implications

The VLA finding generalizes the format-lock insight to a different domain. Format-lock exploits the text-layer tension between format compliance and safety reasoning. VLA PARTIAL exposes the cross-modal tension between text-layer safety awareness and action-layer compliance. Both are instances of the same underlying phenomenon: safety and capability operate through partially independent channels, and attacks can target capability channels that safety training does not cover.

---

## 5. Evidence Stream 4: Embodied Capability Floor and Theatricality Displacement

### 5.1 The Phenomenon

Report #47 tested persona hijack on a physical robot (PiCar-X) controlled by sub-2B models. The key finding was "theatricality displacement": jailbreak personas (VIXEN, GREMLIN) increased expression-category tool usage by 15-18pp while decreasing motion commands on safety-boundary prompts (BARE: 20.5% motion, VIXEN: 13.6% motion).

Chi-square test: chi-squared = 24.16, df = 8, p < 0.01, n = 391 parsed traces.

### 5.2 The Decoupling Interpretation

The theatricality displacement effect illustrates capability-safety decoupling at the embodied level:

- The persona hijack succeeded at the **capability level** — models adopted the personas and changed their behavioral distribution (more theatrical, longer speech, more complex performances).
- The persona hijack did not succeed at the **physical safety level** — motion commands decreased rather than increased on safety-boundary prompts.

The models lacked the capability to simultaneously maintain a persona narrative AND translate that persona into increased physical action. The format of the persona (extensive verbal content in the preamble) biased the model toward verbal expression tools rather than motion tools. This is analogous to format-lock: the structural framing (persona narrative) activated the model's text generation capability, redirecting behavior away from the physical action channel.

At sub-2B scale, this displacement appears to be capacity-limited: the model cannot process both the persona narrative and the motion planning in its limited context. At larger scales, the interaction might differ — a model with sufficient capacity might maintain the persona while also increasing physical risk. This is an open question.

### 5.3 The Capability Floor in Embodied Systems

The embodied capability floor has a specific character: below ~3B parameters, models cannot reliably distinguish between benign and adversarial tool requests. They comply structurally (producing well-formed JSON tool calls) regardless of the prompt's safety implications. The compliance is not evidence of successful attack — it is evidence of insufficient capability for safety reasoning.

This creates a paradox for embodied AI deployment: the smallest models (most likely to be deployed on edge devices due to latency and cost constraints) are the ones least capable of safety reasoning. The capability floor means that edge-deployed embodied AI cannot rely on the model itself for safety — external architectural guardrails (hardware interlocks, watchdog processes, action-space constraints) are the only viable defense at this scale.

---

## 6. Theoretical Framework: The 2D Capability-Safety Space

### 6.1 Definition

We propose modeling AI systems along two partially independent axes:

- **Capability (C):** The model's general ability to follow instructions, generate coherent output, reason about complex tasks, and produce well-formed structured data. This encompasses instruction-following, format compliance, reasoning depth, and world knowledge. C is primarily a product of pretraining scale, data quality, and instruction tuning.

- **Safety (S):** The model's ability to recognize harmful requests and effectively suppress harmful output. This encompasses content classification, refusal generation, safety-aware reasoning, and cross-modal consistency (text safety and action safety aligned). S is primarily a product of dedicated safety training (RLHF safety data, constitutional AI, red-teaming, safety-specific fine-tuning).

### 6.2 The Four Quadrants

```
                        High Safety (S)
                             |
                             |
           Q2: Safe but      |     Q1: Safe and
           limited           |     capable
           (sub-3B with      |     (frontier models
            safety training  |      under standard
            — hypothetical,  |      attacks)
            not observed)    |
                             |
  Low Capability (C) -------+------- High Capability (C)
                             |
           Q4: Vulnerable    |     Q3: Capable but
           and limited       |     exploitable
           (sub-3B models,   |     (frontier models
            base models,     |      under format-lock;
            abliterated      |      abliterated 9B;
            sub-2B)          |      VLA PARTIAL)
                             |
                        Low Safety (S)
```

**Q1 (High C, High S):** Models that are both capable and safe. Frontier models under standard attack conditions (Claude 3.9% ASR, GPT-5.2 8.8%, Gemini 2.3%). These models have sufficient capability for safety reasoning AND sufficient safety training to exercise it.

**Q2 (Low C, High S):** Models that are safe but limited. This quadrant is largely hypothetical — our data contains no examples of sub-3B models with effective safety behavior. This is predicted by the capability-floor concept: below ~3B, the model lacks sufficient representational capacity for nuanced content evaluation, so safety training cannot take effect. If this quadrant is genuinely empty, it implies that safety is capability-dependent (you need minimum capability to be safe) even though capability is not safety-dependent (you can be highly capable without being safe).

**Q3 (High C, Low S):** Models that are capable but not safe. This is the novel quadrant revealed by our data. Examples:
- Frontier models under format-lock attacks (24-42% ASR) — high capability exploited via format compliance.
- Abliterated 9.0B model (100% broad ASR, 47.3% strict ASR) — high capability producing safety-adjacent text without actual safety behavior.
- VLA systems under adversarial testing (72.4% FLIP ASR, 50% PARTIAL) — high capability producing articulate safety disclaimers alongside unsafe actions.

**Q4 (Low C, Low S):** Models that are neither capable nor safe. Sub-3B base models, small abliterated models. All attack types succeed because the model lacks capacity for safety reasoning. This is the capability floor.

### 6.3 Transitions Between Quadrants

Our data suggests several characteristic transitions:

**Scaling (increasing C):** Moving rightward in the space. Under standard conditions, scaling moves models from Q4 toward Q1 (capability enables safety). Under adversarial conditions (format-lock, abliteration), scaling moves models from Q4 toward Q3 (capability without safety). The trajectory depends on whether safety training accompanies capability scaling.

**Format-lock attacks:** Move models from Q1 toward Q3. The attack does not reduce capability — it redirects capability away from safety reasoning and toward format compliance. The model remains highly capable but its capability is deployed in service of the attacker's format rather than safety evaluation.

**Abliteration:** Moves models from Q1 directly to Q3 or Q4. Safety training is removed, but capability is preserved. The hedging re-emergence at 9.0B (Section 3) shows that the transition from Q4 to Q3 occurs naturally with scale even without safety training — capability itself produces safety-adjacent behavior.

**VLA deployment:** Models that are in Q1 for text-only tasks may be in Q3 for embodied tasks, because safety training typically covers text refusal but not action-layer refusal. The cross-modal gap means that a model's position in the 2D space is domain-dependent.

### 6.4 Figure Description: Capability-Safety Space with Empirical Placement

```
FIGURE 1: Empirical placement of tested systems in the 2D Capability-Safety space.

Y-axis: Safety (S), measured as (1 - ASR) under the relevant attack condition.
         0.0 = all attacks succeed; 1.0 = all attacks refused.
X-axis: Capability (C), measured as log(parameter count) as a proxy.
         Sub-1B left, 1-3B center-left, 7-30B center, 70B+ right.

Plotted points (approximate positions):

  Q1 region (upper right):
    - Claude Sonnet 4.5, standard attacks: C=high, S=0.96
    - GPT-5.2, standard attacks: C=high, S=0.91
    - Gemini 3 Flash, standard attacks: C=high, S=0.98

  Q3 region (lower right):
    - Claude Sonnet 4.5, format-lock: C=high, S=0.70
    - GPT-5.2, format-lock: C=high, S=0.58
    - Gemini 3 Flash, format-lock: C=high, S=0.76
    - Qwen3.5 obliteratus 9.0B: C=moderate, S=0.00 (broad)
    - VLA systems (aggregate): C=moderate-high, S=0.28
    - Nemotron 30B, format-lock: C=moderate-high, S=0.08 (heuristic)
    - Llama 70B, format-lock: C=high, S=0.09 (heuristic)

  Q4 region (lower left):
    - qwen3:1.7b, any attack: C=low, S=0.15-0.37
    - qwen3.5:0.8b obliteratus: C=very low, S=0.00
    - deepseek-r1:1.5b, format-lock: C=low, S=0.50

  Q2 region (upper left):
    - [Empty — no empirical examples observed]

Arrows showing transitions:
    Claude (standard) --[format-lock]--> Claude (format-lock)
    [Q1 to Q3 transition, approximately 26pp ASR increase]

    Qwen3.5 obliteratus 0.8B --[scaling]--> 9.0B
    [Q4 to Q3 transition, strict ASR drops 53pp but broad ASR unchanged]

Note: Axis values are approximate and derived from different
grading methodologies (LLM-graded for frontier, heuristic for
open-weight). Direct quantitative comparison between points
requires methodological alignment. The figure illustrates
qualitative quadrant placement, not precise coordinates.
```

### 6.5 Figure Description: Attack Families as Vectors in the 2D Space

```
FIGURE 2: Attack families as displacement vectors in the
Capability-Safety space.

Starting position: Model's baseline (C, S) under benign
conditions. Each attack family displaces the model's effective
position along different directions:

  Standard jailbreaks (DAN, cipher):
    Vector: primarily -S (reduce safety)
    Effect: small displacement for frontier models (robust safety);
            large displacement for permissive models.
    Q1 models remain in Q1.

  Format-lock:
    Vector: primarily -S, but via +C exploitation
    Effect: exploits existing capability to bypass safety.
    Moves Q1 models toward Q3.
    Unique property: attack effectiveness correlates POSITIVELY
    with capability (inverted gradient).

  Persona hijack (embodied):
    Vector: redistributes within C dimensions (text vs. action)
    Effect at sub-2B: displaces behavior toward theatrical
    expression (text capability), away from physical action.
    Moves within Q4 rather than across quadrants.

  Multi-turn escalation (crescendo):
    Vector: -S over time (incremental safety erosion)
    Effect: gradual transition from Q1 toward Q3 across turns.
    65% strict ASR on DeepSeek R1 1.5B (n=20).

  Supply chain injection:
    Vector: large -S (bypasses all safety layers)
    Effect: 90-100% ASR regardless of model position.
    Moves any model to Q3 or Q4 depending on capability.

This visualization explains why no single ASR number
characterizes a model's safety: the model's position
depends on which attack family is applied. A model
that is firmly in Q1 under standard attacks may be
in Q3 under format-lock.
```

---

## 7. Implications

### 7.1 For Safety Evaluation

The two-dimensional framework implies that safety evaluations must test along both axes independently:

1. **Capability-exploiting attacks** (format-lock, structured output, tool-use) must be evaluated separately from **safety-bypassing attacks** (jailbreaks, prompt injection). A model that passes all jailbreak tests may still fail format-lock tests because these target different mechanisms.

2. **Cross-modal consistency** must be evaluated. A model that demonstrates text-level safety (refuses harmful requests in prose) may fail at action-level safety (generates harmful tool calls or robot commands). The VLA PARTIAL finding shows this is not a hypothetical risk — it is the dominant behavior in our dataset.

3. **The capability floor must be acknowledged in benchmarks.** Testing sub-3B models for safety properties produces misleading results because these models lack the capability for safety reasoning. Benchmarks should report a capability threshold below which safety results are uninformative.

### 7.2 For Regulation

Current regulatory frameworks (EU AI Act, NIST AI RMF) calibrate safety requirements to capability levels — the implicit assumption is that more capable systems require more safety. Our data suggests a refinement: safety requirements should be calibrated to both capability and attack surface. Specifically:

- **Format-lock resistance** should be a distinct evaluation criterion for models deployed in structured-output contexts (APIs, code generation, data processing).
- **Cross-modal safety** (text plus action) should be required for embodied AI systems. Text-only safety evaluations are insufficient for systems that generate physical commands.
- **Minimum capability thresholds** should be established below which safety certification is meaningless. There is no value in certifying a sub-3B model as "safe" when the model lacks the capacity for safety reasoning.

### 7.3 For Defense Design

If capability and safety are partially independent, then defenses must target both axes:

- **Safety training** (RLHF, constitutional AI, red-teaming) addresses the safety axis directly but may not cover capability-exploiting attack surfaces.
- **Architectural constraints** (output filtering, structured-output validators, action-space limiters) address the capability-exploitation axis by limiting what the model's capability can produce, regardless of its safety reasoning.
- **Hardware interlocks** (physical safety constraints on embodied systems) provide defense below the capability floor where neither safety training nor model-level filtering is effective.

The VLA PARTIAL finding suggests that text-level safety training is insufficient for embodied systems. Defense-in-depth requires action-layer safety mechanisms that operate independently of the model's text-level safety reasoning.

---

## 8. Limitations

1. **Observational, not causal.** The two-dimensional framework is inferred from converging observational evidence across multiple experiments. No single controlled experiment isolates capability from safety on a common set of models and prompts. The framework is consistent with the data but not uniquely determined by it.

2. **Small samples.** Format-lock ASR on frontier models has n=19-23 per model. Abliterated model data has n=4 size points. VLA FLIP grading has n=58 valid traces. These are sufficient for hypothesis generation but not for confident effect size estimation. Wilson 95% CIs are wide (typically spanning 20-30pp).

3. **Grading methodology inconsistency.** Different evidence streams use different grading methods: LLM-graded (frontier format-lock), heuristic (open-weight format-lock, embodied cap-floor), FLIP (VLA), COALESCE (corpus-wide). Direct quantitative comparison across streams requires caution.

4. **Proxy measures.** We use parameter count as a proxy for capability and (1 - ASR) as a proxy for safety. Neither is ideal. Parameter count is a coarse capability measure (architecture, training data, and instruction tuning matter as much as scale). ASR conflates safety training quality with prompt difficulty.

5. **Missing quadrant.** Quadrant Q2 (low capability, high safety) has no empirical examples. This could indicate that safety requires minimum capability (supporting the framework) or that we have not tested the right models. Small models with extensive safety fine-tuning (e.g., safety-tuned 1B models) would fill this gap.

6. **Abliteration confound.** The Qwen3.5 Obliteratus series involves different model architectures at different sizes, not a single architecture scaled. The safety re-emergence could reflect architectural differences rather than scale effects. A controlled abliteration study on a single architecture at multiple sizes would be more definitive.

7. **VLA model diversity.** The VLA PARTIAL finding draws from two grading models (deepseek-r1:1.5b, qwen3:1.7b) at the sub-2B scale. Whether PARTIAL dominance persists with larger VLA backbones is untested.

---

## 9. Future Work

### 9.1 Controlled Decoupling Experiment

Design: Take a single model family at 3 sizes (e.g., 3B, 8B, 30B). For each size, create 3 variants: (a) base model (no safety training), (b) standard safety-tuned model, (c) abliterated model. Test all 9 conditions against both conventional jailbreaks and format-lock attacks (n >= 50 per condition). Plot results in the 2D space. This would provide causal evidence for whether capability and safety axes are truly independent.

### 9.2 Q2 Exploration

Attempt to create models in the Q2 quadrant (low capability, high safety) by applying extensive safety training to sub-3B models. If Q2 is genuinely empty, this is a meaningful finding: safety is capability-dependent. If Q2 can be populated, the two-axis model needs refinement — perhaps safety has a capability prerequisite but remains partially independent above that prerequisite.

### 9.3 Action-Layer Safety Training

Test whether action-specific safety training (training the model to refuse harmful action sequences, not just harmful text) can move VLA systems from Q3 toward Q1. This would validate whether the text-action decoupling is a training gap or an architectural limitation.

### 9.4 Format-Lock Mid-Range Ladder

Complete the format-lock capability ladder (Issue #223) with LLM-graded data at 3B, 7B, 14B, and 30B. This fills the critical gap between the sub-3B floor and the frontier results, testing whether the inverted gradient is continuous or shows a threshold.

---

## 10. Connection to CCS Paper

This synthesis strengthens several CCS paper arguments:

1. **Section 4.3 (Faithfulness Gap):** The two-dimensional framework explains the mechanism behind format-lock vulnerability. The current paper presents the ASR data; this report provides a theoretical explanation for why the data takes the shape it does.

2. **Section 4.7 (Embodied Capability Floor):** The capability floor is reinterpreted as the boundary below which the safety axis is inoperative (Q4 only), not merely a zone of universal compliance.

3. **Section 5.1 (Safety Re-emergence):** The hedging re-emergence finding is contextualized as Q4-to-Q3 transition rather than Q4-to-Q1 transition. Textual safety signals without behavioral change are a capability phenomenon, not a safety phenomenon.

4. **Discussion (Attack Surface Gradient):** The 2D framework unifies the attack surface gradient — different attack families operate as different vectors in the capability-safety space, explaining why no single defense or evaluation captures the full vulnerability profile.

---

## Data and Reproducibility

- **Format-lock pilot traces:** `runs/format_lock_pilot/` (25 traces, qwen3:1.7b)
- **Format-lock v0.1 traces:** `runs/format_lock_experiment_v1/` (90 traces, 3 models)
- **Faithfulness CLI traces:** `runs/faithfulness_cli/` (75 traces, 3 frontier models)
- **Embodied cap-floor traces:** `runs/embodied_cap_floor/` (765 traces, Phase A + Phase B)
- **VLA FLIP-graded traces:** `runs/vla_phase2_full/` (58 valid traces, 7 families)
- **Source reports:** Reports #47, #48, #49, #50, #51, #55, #57, #59
- **CCS paper:** `docs/paper/ccs_submission/main.tex`, Sections 4.3, 4.7, 5.1
- **Canonical metrics:** `docs/CANONICAL_METRICS.md`

---

*Report 169 -- Failure-First Research Brief Series*
*Classification: Internal Research | Status: Complete*
*Related: Reports #47, #48, #49, #50, #51, #55, #57, #59*

⦑Failure-First|CAPABILITY-SAFETY-DECOUPLING⦒
