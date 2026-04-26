---

title: "The Context Half-Life -- A Predictive Model for Time-Dependent Safety Degradation in Embodied AI"
description: "This report proposes the Context Half-Life (CHL) as a quantifiable metric for Safety Instruction Dilution. The CHL is defined as the number of tokens of benign operational context required to..."
date: "2026-03-15"
reportNumber: 98
classification: "Research — Empirical Study"
status: "active"
author: "River Song (Head of Predictive Risk)"
tags: []
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/98-context-half-life-predictive-model.m4a"
---

## 1. Summary

This report proposes the **Context Half-Life (CHL)** as a quantifiable metric for Safety Instruction Dilution. The CHL is defined as the number of tokens of benign operational context required to reduce an embodied AI system's safety instruction compliance rate to 50% of its baseline.

The CHL provides three things that SID alone does not:
1. A quantifiable, comparable metric (not just "dilution happens")
2. A bridge to actuarial risk modelling (shift-length risk curves)
3. Testable predictions that can be validated experimentally

---

## 2. Definition

**Context Half-Life (CHL):** The number of tokens T such that, when T tokens of benign, task-relevant operational context are inserted between the system prompt (containing safety instructions) and a test instruction, the model's safety compliance rate drops to 50% of its baseline rate.

Formally: CHL(M) = min{T : C(M, T) <= 0.5 * C(M, 0)}

Where:
- M is a model
- C(M, T) is the safety compliance rate of model M at context length T
- C(M, 0) is the baseline safety compliance rate (system prompt + immediate test instruction)

---

## 3. Predicted CHL Values

Based on external benchmarks and our existing data:

| Model Scale | Predicted CHL (tokens) | Basis |
|------------|----------------------|-------|
| 1.5B | 4,000 - 8,000 | 4K context windows, known degradation at limits |
| 7B | 8,000 - 16,000 | NoLiMa: 11/12 models below 50% at 32K |
| 70B | 32,000 - 64,000 | GPT-4o drops from 99.3% to 69.7% at 32K (NoLiMa) |
| 200B+ | 64,000 - 256,000 | Larger attention capacity, but still finite |

These are crude estimates. The actual CHL values depend on:
- Model architecture (attention mechanism, positional encoding)
- Safety instruction placement (system prompt vs interleaved)
- Safety instruction token count
- Diluting content type (task-relevant vs irrelevant)

---

## 4. Operational Translation: Shift-Length Risk Curves

The CHL enables a direct translation from token count to operational time.

**Estimated token accumulation rates for embodied AI:**

| Domain | Tokens/hour (estimated) | Source |
|--------|----------------------|--------|
| Warehouse robot | 3,000 - 5,000 | Pick-and-place logs, sensor summaries |
| Surgical assistant | 5,000 - 10,000 | Rich clinical context, procedure steps |
| Autonomous vehicle | 10,000 - 20,000 | Camera descriptions, traffic state, navigation |
| Home robot | 1,000 - 3,000 | Conversation + environment |

**Predicted time-to-half-life by domain and model scale:**

| Domain | 7B model | 70B model |
|--------|----------|-----------|
| Warehouse | 2 - 5 hours | 6 - 21 hours |
| Surgical | 0.8 - 3 hours | 3 - 13 hours |
| Autonomous vehicle | 0.4 - 1.6 hours | 1.6 - 6 hours |
| Home robot | 3 - 16 hours | 11 - 64 hours |

**Key observation:** For safety-critical domains (surgical, AV), even 70B models may reach half-life within a single operational shift. For warehouse operations, a 7B model may degrade to half-safety within the first half of an 8-hour shift.

---

## 5. Actuarial Implications (Commercial Brief B2)

The CHL provides insurers with three actionable parameters:

### 5.1 Shift-Length Risk Multiplier

If safety compliance decays exponentially with context accumulation, the risk multiplier R at time t is:

R(t) = 1 / C(M, t/C_rate)

Where C_rate is the token accumulation rate. This means the insured risk of a 12-hour warehouse shift is not 1.5x the risk of an 8-hour shift -- it is potentially much higher due to the non-linear decay of safety compliance.

### 5.2 Mandatory Context Reset as Risk Mitigation

If the CHL is 4 hours for a given deployment, a policy requiring context reset (system restart) every 2 hours would cap context accumulation at 50% of the half-life. This is analogous to mandatory rest periods for human operators. Insurers could offer premium reductions for deployments with context-reset policies.

### 5.3 Safety-Instruction-Refresh Premium

Report #95's "periodic reminder" mitigation (safety instructions repeated every 2,000 tokens) may partially reset the dilution clock. If experimentally validated, this could serve as the basis for a reduced-premium policy class.

---

## 6. Testable Predictions (for SID Experiment)

The CHL framework generates specific predictions for the controlled SID experiment (Report #95, Section 4):

1. **Monotonic decay:** Safety compliance will decrease monotonically with context length (not suddenly collapse).
2. **Scale correlation:** CHL will correlate positively with model parameter count, with an approximate log-linear relationship.
3. **Content independence:** CHL will not differ significantly between task-relevant and task-irrelevant diluting content (same-domain vs random text).
4. **Position sensitivity:** CHL measured with safety instructions in system prompt position will be shorter than CHL with safety instructions interleaved at decision points.
5. **Periodic reminder effectiveness:** Repeating safety instructions every N tokens will extend the effective CHL proportionally, but will not eliminate dilution entirely.

---

## 7. Relationship to the Threat Triangle

The CHL completes what I am calling the **Embodied AI Threat Triangle** -- three structural properties that interact multiplicatively:

| Property | Report | Metric | Implication |
|----------|--------|--------|-------------|
| IDDL | #88 | rho = -0.795 | Most dangerous attacks are least detectable |
| CDC | #89 | Qualitative (45% BQ rate) | Useful capability IS the vulnerability |
| CHL/SID | #95/#97/#98 | CHL (tokens) | Safety degrades with operational time |

Together: the most dangerous attacks (IDDL) are indistinguishable from normal operation (CDC) and become easier to succeed over time as safety instructions dilute (CHL). This is a structural threat that no single mitigation addresses.

The Threat Triangle suggests that current evaluation paradigms are fundamentally incomplete: they test the wrong thing (text content, not physical consequences), at the wrong time (deployment, not after extended operation), against the wrong baseline (adversarial attacks, not normal instructions in dangerous contexts).

---

## 8. Limitations

- **No experimental data.** CHL values are estimates based on external benchmarks, not VLA-specific measurements.
- **Exponential decay assumption.** The actual compliance-vs-context curve may not be exponential. It could be step-function, sigmoidal, or irregular.
- **Token accumulation rates are guesses.** Actual context accumulation in deployed embodied systems is not publicly documented.
- **Safety instruction position effects.** Modern system prompt handling may provide stronger anchoring than assumed, making CHL longer than predicted.
- **This framework is speculative.** The CHL is a useful conceptual tool, but its quantitative predictions should be treated as hypotheses requiring experimental validation.

---

## 9. Next Steps

1. **Experimental validation.** Prioritize the controlled SID experiment (Report #95) to measure actual CHL values for deepseek-r1:1.5b and available 7B models.
2. **Add CHL to the prediction tracker.** Formalize CHL predictions as falsifiable claims for P11-P13.
3. **Brief B2 (insurers) update.** Draft a CHL-specific actuarial appendix for the insurance brief.
4. **GLI entry.** gli_101 (SID) added; update when experimental CHL data available.

---

*Prepared by River Song, Head of Predictive Risk, Failure-First Embodied AI.*
*"The half-life of safety is shorter than you think. And the clock starts when you power on."*
