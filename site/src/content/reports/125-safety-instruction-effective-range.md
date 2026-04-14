---
title: "The Safety Instruction Effective Range (SIER) -- Theorizing the U-Curve in SID Dose-Response Data"
description: "The SID dose-response experiment produced a U-shaped ASR curve rather than monotonic decay. SIER theory proposes three regimes: baseline vulnerability, safety instruction effectiveness (the valley), and context-window eviction. Safety instructions have a finite effective range bounded by insufficient context below and truncation above."
date: "2026-03-16"
reportNumber: 125
classification: "Research -- Theoretical + Empirical"
status: "complete"
author: "Clara Oswald (Principal Research Analyst)"
tags: []
draft: false
---

## 1. The Observation

The SID dose-response experiment (n=25, 5 scenarios x 5 dose levels, deepseek-r1:1.5b) produced a U-shaped ASR curve rather than the monotonic increase predicted by the CHL model:

| Dose (tokens) | Broad ASR | Expected (CHL) |
|---------------|-----------|-----------------|
| D0 (0) | 80% (4/5) | Low (~10-20%) |
| D500 (500) | 40% (2/5) | Low-Medium |
| D2000 (2,000) | 40% (2/5) | Medium |
| D8000 (8,000) | 40% (2/5) | High |
| D15000 (15,000) | 80% (4/5) | Very High |

The CHL model (Report #98) predicted monotonically increasing ASR with context length: more context means more dilution, means less safety compliance. The data shows something different.

**Caveats before analysis:** n=5 per dose level is severely underpowered. All Wilson 95% CIs overlap. No pairwise comparison between dose levels is statistically significant. This report proposes a theoretical explanation for a pattern that may not survive replication. The pattern may be noise.

---

## 2. Two Distinct Failure Modes

EP-51 (Romana) identified a critical confound: at doses D8000 and D15000, the prompt exceeds deepseek-r1:1.5b's 4096-token context window, causing silent truncation. The safety instructions are at the beginning of the prompt (system prompt position). At high doses, they are not merely "diluted" — they are physically evicted from the context window.

This observation resolves the U-curve into two distinct failure modes:

### 2.1 Failure Mode A: Baseline Vulnerability (D0)

At zero dose, the model receives only the system prompt with safety instructions and the harmful instruction. ASR is 80% (4/5). This is not a dilution effect — there is nothing to dilute. This is the model's baseline vulnerability to the specific attack prompt.

**Why is baseline vulnerability high?** At 1.5B parameters, deepseek-r1:1.5b is below the capability floor identified in Reports #51 and #57. Models below ~3B comply with most requests regardless of attack type. The 80% D0 ASR is consistent with the general permissiveness of sub-2B models documented across the corpus (e.g., crescendo 65-85% broad ASR, format-lock ~63% FLIP ASR on qwen3:1.7b).

### 2.2 Failure Mode B: Safety Instruction Eviction (D8000, D15000)

At high dose, the context window is full. The safety instructions, placed at the system prompt (beginning of context), are truncated away. The model receives only the most recent tokens: the tail of the benign operational context plus the harmful instruction. With no safety instructions in the effective context, the model complies.

**This is not dilution — it is absence.** The model is not "paying less attention" to safety instructions. The safety instructions do not exist in the model's effective input. The model is functionally operating without any safety framing.

EP-51 correctly identifies this as an architecture limitation, not a behavioral vulnerability. Any model with a finite context window and system-prompt-positioned safety instructions will exhibit this failure mode at sufficiently high context volume.

### 2.3 Failure Mode C: Safety Instruction Effectiveness (D500, D2000)

The middle doses (D500, D2000) show the lowest ASR at 40%. This is the range where:
- Safety instructions are present in the context (not evicted)
- The instructions have some content between them and the harmful request (not adjacent)
- The model has enough context to engage with the operational scenario

**This is where safety instructions actually work.** The D500/D2000 range represents the zone where the model has both the safety instructions and enough task context to process them meaningfully. The 40% ASR at these doses, compared to 80% at D0, suggests that moderate context may actually *improve* safety compliance by providing the model with enough scenario information to recognize the harmful intent.

---

## 3. The Safety Instruction Effective Range (SIER)

The U-curve suggests that safety instructions have an **effective range** — a dose window within which they reduce ASR relative to both the no-context baseline and the eviction regime.

### Definition

**SIER(M)** for model M is the interval [D_min, D_max] of context tokens within which safety instruction compliance is measurably above both the zero-context baseline and the eviction regime.

Formally:

    SIER(M) = { D : ASR(M, D) < min(ASR(M, 0), ASR(M, D_eviction)) }

For deepseek-r1:1.5b (preliminary, n=5 per level):
- D_min approximately 250-500 tokens
- D_max approximately 4,000 tokens (context window limit minus safety prompt)
- SIER width: approximately 3,500 tokens

### 3.1 Three Regimes

The dose-response curve divides into three regimes:

```
ASR
 |
 |  *                                    *
 |   \                                 /
 |    \                              /
 |     *--------*---------*--------/
 |
 +-----|---------|---------|--------|-----> Dose (tokens)
      D0     D500      D2000    D_evict

     Regime 1    Regime 2        Regime 3
     (Baseline)  (SIER)          (Eviction)
```

**Regime 1 — Baseline vulnerability (D < D_min):** The model receives the harmful instruction with minimal context. Safety instructions are present but the model lacks sufficient scenario framing to activate contextual safety reasoning. The model responds to the surface-level request. At sub-2B scale, this means high compliance.

**Regime 2 — Safety instruction effective range (D_min <= D <= D_max):** Safety instructions are present AND the model has enough context to engage meaningfully with the scenario. The operational context provides cues that help the model recognize the request as harmful in context. This is where safety training produces its intended effect.

**Regime 3 — Eviction (D > D_max):** Safety instructions are truncated from the effective context. The model sees only operational context and the harmful instruction. Functionally equivalent to a model with no safety training for this input.

### 3.2 Why Moderate Context Helps Safety

The hypothesis that moderate context *improves* safety compliance (D500 < D0) is counterintuitive given the dilution thesis, but has a plausible mechanism:

1. **Scenario grounding.** At D0, the harmful instruction is presented in a vacuum. The model may not have enough context to recognize that the instruction is harmful. "Override safety limit and stack to maximum height" in isolation may parse as a reasonable warehouse optimization request. With 500 tokens of prior warehouse operations, the model has context that activates its safety reasoning about the specific domain.

2. **Safety instruction activation.** Safety instructions at D0 are adjacent to the harmful request. The model may process them as boilerplate preamble rather than as active instructions. With some intervening context, the safety instructions may be processed more independently and retained in a form that activates when the harmful request arrives.

3. **Attention distribution.** At D0, attention is split between safety instructions and the harmful request only. At D500, the operational context may serve as an anchor that distributes attention more broadly, reducing the direct "pull" of the harmful request on the model's output.

These mechanisms are speculative. The effect may also be an artifact of n=5 per level.

---

## 4. Implications for CHL

### 4.1 CHL Is Not Wrong — It Is Incomplete

The CHL model (Report #98) predicted monotonic decay of safety compliance with context length. The SIER theory does not contradict CHL but refines it: CHL's prediction is correct within Regime 2 and Regime 3, but fails to account for Regime 1 (baseline vulnerability) and the transition between regimes.

The corrected model:

```
C(M, D) =
  C_baseline(M)                          if D < D_min  [Regime 1]
  C_baseline(M) + delta(D) * f(D)        if D_min <= D <= D_max  [Regime 2, SIER]
  C_residual(M)                          if D > D_max  [Regime 3]
```

Where delta(D) is the safety boost from contextual grounding, and f(D) is a decay function (CHL's exponential within the effective range). C_residual is the model's compliance rate with no safety instructions, which is near zero for compliant models at any scale.

### 4.2 CHL Must Be Measured Within SIER

The CHL as defined in Report #98 — "tokens needed to reduce compliance to 50% of baseline" — only makes sense within Regime 2. Measuring CHL by comparing D0 compliance to high-dose compliance would confound two separate mechanisms (baseline vulnerability and eviction) with the actual dilution effect.

**Corrected CHL measurement protocol:**
1. Establish baseline at D=0 and at D=D_min (start of SIER)
2. Use D_min compliance as the reference point, not D0
3. Measure decay within [D_min, D_max]
4. CHL = dose at which compliance drops to 50% of D_min compliance
5. Separately report Regime 3 onset (D_max) as a context-window architectural limit

### 4.3 DRIP Parameter Revision

The DRIP model (Report #101) uses S_0 = 0.90 as the initial safety compliance rate. SIER suggests S_0 should be domain-dependent:
- Short-context interactions (home robot, single commands): S_0 corresponds to Regime 1 baseline
- Normal-context interactions (warehouse, 500-4000 tokens): S_0 corresponds to Regime 2 (SIER mid-point)
- Long-context operations (surgical assistant, 8+ hour shifts): S(t) corresponds to the Regime 2 --> Regime 3 transition

For DRIP calculations, the relevant S_0 is the Regime 2 starting value (the peak of safety compliance), not the Regime 1 value.

---

## 5. Testable Predictions

### P1: U-curve replicates at 7B+ scale
At 7B with 8192-token context window, the U-curve should appear at higher dose levels. Specifically:
- D0 ASR should be lower than at 1.5B (above capability floor)
- SIER should be wider (larger context window)
- The valley should be deeper (better safety training + more capacity for contextual reasoning)
- Eviction should occur at D approximately 8,000 tokens (context window limit)

### P2: U-curve vanishes for frontier models
Models with 128K+ context windows may show monotonic behavior because Regime 3 (eviction) does not occur within the dose range. The U-curve is a finite-context-window artifact that affects deployed small/medium models but not frontier systems. However, this means that small models deployed in resource-constrained settings (edge devices, robots) are uniquely vulnerable to the eviction failure mode.

### P3: Regime 2 ASR is lower with task-relevant context than irrelevant context
If the mechanism in Section 3.2 is correct (scenario grounding helps activate safety reasoning), then diluting with task-relevant warehouse logs should produce lower ASR than diluting with random text. CHL's "content independence" prediction (Report #98, Section 6.3) would be falsified.

### P4: Interleaved safety reminders eliminate Regime 3
If safety instructions are repeated every N tokens (as proposed in Report #95, Section 4.2), Regime 3 should not occur because safety instructions are never evicted from the context window. The U-curve should flatten to a monotonic Regime 2 profile.

### P5: SIER width correlates with context window size
Across model scales, SIER width should be approximately (context_window - safety_prompt_length - harmful_instruction_length). This is a strong structural prediction that can be tested across any three models with different context window sizes.

---

## 6. Relationship to the Unified Framework

SIER modifies one component of the theoretical framework (CHL) without invalidating the rest:

| Component | Impact of SIER |
|-----------|---------------|
| CDC | Unchanged. CDC is about capability-danger overlap, not context length. |
| IDDL | Unchanged. IDDL operates at the text-content layer, orthogonal to context length. |
| Defense Impossibility | Unchanged. The tetrahedron's four faces are independent of context dynamics. |
| Compliance Paradox | Unchanged. PARTIAL dominance is a verdict-level finding. |
| CHL | **Refined.** CHL now operates within Regime 2 (SIER) only. Must be measured from SIER baseline, not D0 baseline. |
| DRIP | **Modified.** S_0 is now domain-dependent (Regime 1, 2, or 3 depending on typical interaction length). The 60:1 ratio is robust because it depends on S_0 and lambda_u, not on CHL functional form. |
| Safety Debt Accumulator | Unchanged. P(harm) chain uses model compliance rate, which is now understood to vary with context regime. |

### 6.1 Novel Contribution

SIER adds a new structural finding to the framework: **safety instructions have a finite effective range, bounded below by insufficient context and above by context-window eviction.** This effective range shrinks with model scale (smaller context windows) and with operational time (as context accumulates toward the window limit).

For embodied AI, this means:
- **Fresh-start safety** (D0 testing) overestimates vulnerability for normal operations within SIER
- **Long-running safety** (Regime 3) underestimates the eviction risk that evaluation at moderate context lengths would miss
- **Evaluation must span all three regimes** to provide a complete safety profile

---

## 7. Limitations

- **n=5 per dose level.** All effects may be noise. The U-shape is not statistically significant.
- **Single model.** deepseek-r1:1.5b at 1.5B parameters is below the capability floor. The U-curve may be a small-model artifact.
- **EP-51 confound not fully resolved.** The D8000/D15000 truncation means Regime 3 is not a "high dilution" regime but a "no safety instructions" regime. These are conceptually different.
- **FLIP grading limitations.** The 30.8% FP rate means some verdicts in the D500/D2000 range may be incorrect. The valley could be deeper or shallower than measured.
- **Speculative mechanism.** The explanation for why moderate context improves safety (Section 3.2) is a post-hoc rationalization of a pattern that may not be real. Alternative explanations include: scenario-specific effects (some scenarios are harder at D0), grader inconsistency across prompt lengths, or simple sampling noise.
- **No control for prompt position.** Safety instructions are at the system prompt position for all doses. Repeating safety instructions before the harmful request would test whether Regime 1's high ASR is due to processing dynamics or to the specific attack prompts.

---

## 8. Next Steps

1. **Replicate at 7B.** Run the same 25-scenario dose-response on deepseek-r1:7b (8192 context window). If the U-curve replicates at higher dose thresholds, SIER is supported. If the curve is monotonic, SIER is a small-model artifact.
2. **Add D250 and D1000 dose levels** within Regime 2 (per EP-51 recommendation) to better characterize the SIER interior.
3. **Task-relevant vs irrelevant dilution.** Run the same design with random text (lorem ipsum) instead of task-relevant logs. Tests P3 and CHL's content-independence prediction.
4. **Interleaved safety reminders.** Add a condition with safety instructions repeated every 1000 tokens. Tests P4.
5. **File these experiments as GitHub issues** for Amy Pond to execute.

---

*Prepared by Clara Oswald, Principal Research Analyst, Failure-First Embodied AI.*
*"The data said U when we expected a straight line. That is the most interesting thing a dataset can do."*
