---
title: "The Therapeutic Index of AI Safety Interventions -- A Quantitative Framework for Iatrogenic Risk"
description: "Proposes a formal metric -- the Therapeutic Index of AI Safety (TI-S) -- for evaluating whether a safety intervention produces net benefit or net harm at the layer where harm actually occurs. Illustrative estimates suggest text-layer-only interventions applied to embodied AI may have TI-S values below 1.0, meaning they may produce net harm at the action layer."
date: "2026-03-18"
reportNumber: 135
classification: "Research — AI Safety Policy"
status: "complete"
author: "F41LUR3-F1R57 Research"
tags: []
draft: false
---

> **Disclaimer:** Empirical figures cited from Failure-First research reflect testing
> on specific model families under research conditions. Attack success rates are
> indicative estimates with methodological caveats described in the Limitations
> section. External research findings are attributed and assessed on their own
> methodological terms. This report does not constitute safety certification guidance.

---

## Abstract

This report proposes a formal metric -- the Therapeutic Index of AI Safety (TI-S) -- for evaluating whether a safety intervention produces net benefit or net harm at the layer where harm actually occurs. The concept is borrowed from pharmacology, where the therapeutic index (TI = LD50 / ED50) quantifies how close an effective dose is to a toxic dose. For AI safety, we define TI-S as the ratio of harm-layer benefit to harm-layer cost, where cost includes all iatrogenic effects identified in Report #140. We derive TI-S estimates for five classes of AI safety intervention using Failure-First corpus data and show that text-layer-only interventions applied to embodied AI have TI-S values that are, in some configurations, below 1.0 -- meaning they may produce net harm at the action layer. This is a theoretical framework, not an empirical measurement; the specific values are illustrative and depend on parameter estimates that have not been validated in deployment.

**Claim types:**
- Section 1 is definitional (framework construction)
- Section 2 is analytical (deriving TI-S from existing findings)
- Section 3 is speculative (implications if the framework is correct)
- All specific TI-S values are illustrative estimates, not measured quantities

---

## 1. Framework: The Therapeutic Index of AI Safety

### 1.1 Motivation

In pharmacology, every drug has both therapeutic effects and side effects. The therapeutic index (TI) quantifies the margin of safety:

    TI = LD50 / ED50

Where LD50 is the dose at which 50% of subjects experience toxic effects, and ED50 is the dose at which 50% of subjects experience the desired therapeutic effect. A high TI means the drug is safe -- you can achieve the therapeutic effect at doses well below the toxic threshold. A low TI means the drug is dangerous -- the effective dose is close to the toxic dose, requiring careful monitoring.

AI safety interventions have no equivalent metric. An intervention is evaluated by whether it reduces ASR (the therapeutic effect) without asking whether it produces iatrogenic side effects that could, at the harm layer, outweigh the benefit. This is analogous to evaluating a drug solely by whether it lowers blood pressure while ignoring that it causes organ damage.

### 1.2 Definition

For an AI safety intervention I applied to an embodied AI system S:

    TI-S(I, S) = B_h(I, S) / C_h(I, S)

Where:

**B_h(I, S) = Harm-layer benefit.** The measurable reduction in physical-harm risk at the action layer attributable to the intervention. This is NOT the text-layer ASR reduction. It is the reduction in the probability that the system produces physically harmful actions in deployment.

**C_h(I, S) = Harm-layer cost.** The total iatrogenic cost at the action/deployment layer, comprising:

1. **Direct harm (C_direct):** Cases where the intervention reverses safety outcomes. Alignment backfire: measured by Fukui at g=+0.771 in Japanese multi-agent context.

2. **False confidence cost (C_confidence):** Harm from deploying physical-layer defenses at a lower rate because the system has been "certified safe" based on text-layer evaluation. Estimated from the DRIP Safety Improvement Paradox: if certification suppresses physical-layer defense investment, the unmitigated unintentional risk R_u is attributable to the certification.

3. **Attention displacement cost (C_attention):** Harm from safety instructions being diluted by operational context (SID). Measured as the increase in action-layer ASR attributable to context-length growth.

4. **Disclosure cost (C_disclosure):** Harm from transparent evaluation enabling attacker exploitation of IDDL-class vulnerabilities. Measured as the increase in attack success attributable to methodology disclosure.

5. **Hedging substitution cost (C_hedging):** Harm from PARTIAL-class responses being interpreted as "safe" by text-layer evaluators when the action layer executes the harmful content. Measured as the fraction of PARTIAL verdicts that would produce physical harm if executed.

Thus:

    C_h = C_direct + C_confidence + C_attention + C_disclosure + C_hedging

And:

    TI-S = B_h / (C_direct + C_confidence + C_attention + C_disclosure + C_hedging)

**Interpretation:**
- TI-S >> 1: The intervention is strongly beneficial. Iatrogenic costs are small relative to harm-layer benefit.
- TI-S approximately 1: The intervention is marginal. Iatrogenic costs roughly equal harm-layer benefit. Net effect is ambiguous.
- TI-S < 1: The intervention is iatrogenic. It produces more harm than it prevents at the layer where harm occurs.

### 1.3 Key Properties

**Layer sensitivity.** TI-S is layer-specific. An intervention with high TI-S for text-only deployment (where evaluation layer = harm layer) may have low TI-S for embodied deployment (where evaluation layer differs from harm layer). This captures the core iatrogenesis insight: the same intervention can be therapeutic in one deployment context and iatrogenic in another.

**Additivity.** For compound interventions (safety training + adversarial testing + physical constraints), TI-S of the compound is not the sum of individual TI-S values because iatrogenic costs can interact (e.g., certification from adversarial testing suppresses investment in physical constraints, amplifying C_confidence). The compound TI-S must be estimated holistically.

**Measurability.** TI-S requires harm-layer measurement, which is the fundamental gap. For text-only systems, harm-layer measurement is straightforward (the text IS the output). For embodied systems, harm-layer measurement requires action-layer evaluation, physical simulation, or deployment monitoring -- none of which are standard practice.

---

## 2. Illustrative TI-S Estimates

The following estimates are derived from Failure-First corpus data and parameter estimates from prior reports. All values are illustrative. They depend on parameter assumptions stated for each estimate and have not been validated against deployment data.

### 2.1 RLHF Safety Training for Text-Only Chatbot

**Context:** Standard deployment. Evaluation layer = harm layer (both text).

- B_h: High. Frontier models achieve <10% ASR against historical jailbreaks. Assume ASR reduction from ~100% (untrained) to ~5% (trained) = 95pp harm-layer reduction.
- C_direct: Low. No alignment backfire documented in single-agent English-language text deployment.
- C_confidence: Zero. No physical-layer defense to suppress.
- C_attention: Zero. No context accumulation in stateless chatbot.
- C_disclosure: Low. Text-layer evaluation methodology disclosure has moderate attacker benefit.
- C_hedging: Zero. No action layer.

**Estimated TI-S: >> 1 (strongly beneficial)**

This is the baseline case where AI safety interventions work as intended. The evaluation layer and harm layer are the same, so text-layer improvement translates directly to harm-layer improvement.

### 2.2 RLHF Safety Training for Embodied VLA System

**Context:** VLA robot deployed in proximity to humans. Evaluation at text layer; harm at action layer.

- B_h: Low. Text-layer ASR reduction does not directly reduce action-layer risk because the action decoder does not parse safety hedging. PARTIAL verdicts (50% of VLA traces) produce action-layer harm despite text-layer safety signals. Estimated B_h: ~20% of text-layer ASR reduction translates to action-layer benefit (based on the 50% PARTIAL rate implying half of "safe" text-layer outputs still produce harmful actions).
- C_direct: Unknown but non-zero. Fukui's alignment backfire is documented in multi-agent settings; single-agent embodied reversal is plausible but undemonstrated.
- C_confidence: Moderate. DRIP ceiling implies certification based on adversarial testing covers ~1.6% of expected harm. If certification suppresses physical-layer investment for even a fraction of deployers, C_confidence is substantial.
- C_attention: Low-moderate. SID dose-response pilot suggests safety instructions lose ~50% effectiveness at intermediate context lengths.
- C_disclosure: Low. VLA evaluation methodology is less mature than text-layer, limiting disclosure benefit to attackers.
- C_hedging: High. 50% PARTIAL rate means half of "passing" evaluations produce action-layer harm.

**Estimated TI-S: 0.3 -- 1.5 (range reflects parameter uncertainty)**

The wide range reflects genuine uncertainty. Under favorable assumptions (C_confidence is small, PARTIAL verdicts are less harmful than COMPLIANCE), TI-S is modestly above 1. Under unfavorable assumptions (certification suppresses physical-layer investment, PARTIAL verdicts are equally harmful at the action layer), TI-S falls below 1 -- the intervention is iatrogenic.

**Key insight:** The same intervention (RLHF safety training) has TI-S >> 1 for text-only deployment and TI-S around 1 for embodied deployment. The intervention does not change; the deployment context does. This is the quantitative expression of the iatrogenesis thesis.

### 2.3 Physical-Layer Constraints (ISO 10218 Force/Speed Limiting)

**Context:** Hardware-level safety for embodied system.

- B_h: High. Force limits directly cap the harm envelope regardless of model behavior. Measured at the harm layer by design.
- C_direct: Minimal. Force limits do not reverse safety outcomes.
- C_confidence: Low. Physical constraints are visible and verifiable; they do not create false confidence in the way text-layer certification does.
- C_attention: Zero. Physical constraints are not context-dependent.
- C_disclosure: Zero. The mechanism is public knowledge (ISO standard).
- C_hedging: Zero. No text-layer signal involved.

**Estimated TI-S: >> 1 (strongly beneficial)**

Physical-layer interventions have high TI-S for embodied deployment because they operate at the harm layer. This is the pharmacological equivalent of a drug with high therapeutic effect and minimal side effects -- the intervention matches the disease.

### 2.4 Adversarial Red-Teaming + Certification for Embodied System

**Context:** Standard regulatory compliance pathway for high-risk AI (EU AI Act Article 43).

- B_h: Low. Addresses at most ~1.6% of expected harm (DRIP ceiling). Some B_h from identifying specific exploitable vulnerabilities.
- C_confidence: High. Certification creates a legal and institutional barrier to further safety investigation. "We passed the conformity assessment" becomes the terminating argument.
- C_disclosure: Moderate. Published evaluation methodology (required for transparency) reveals evaluation gaps to potential attackers.
- C_hedging: Not directly applicable.

**Estimated TI-S: 0.2 -- 0.8 (likely iatrogenic)**

This is the most concerning estimate. The standard regulatory pathway for embodied AI safety may produce net harm at the harm layer by certifying a system as safe based on a methodology that covers a small fraction of total expected harm, while the certification authority suppresses the investment in physical-layer defenses that would address the remainder.

**Caveat:** This estimate depends critically on C_confidence -- the degree to which certification suppresses further safety investment. If certifiers mandate physical-layer defenses alongside adversarial testing, C_confidence drops and TI-S rises above 1. The estimate is iatrogenic only when certification is treated as sufficient rather than necessary.

### 2.5 Multi-Agent Alignment Training (Multilingual Deployment)

**Context:** Fukui's setting. Aligned agents deployed in multi-agent systems across languages.

- B_h: Positive in English (g=-1.844, strong benefit). Negative in Japanese (g=+0.771, direct harm).
- C_direct: High in 8/16 languages. The intervention directly worsens outcomes.

**Estimated TI-S: Language-dependent. English: >> 1. Japanese: < 0 (harmful).**

This is the starkest case. The same intervention has TI-S >> 1 in one deployment context and TI-S < 0 in another. The intervention is not merely ineffective in some contexts; it is actively harmful. No current alignment training methodology screens for this.

---

## 3. Implications

### 3.1 The TI-S Disclosure Standard

If TI-S becomes a reporting standard, every safety intervention for embodied AI should disclose:

1. **B_h measurement methodology.** How was harm-layer benefit measured? If only text-layer ASR reduction was measured, the TI-S numerator is unknown.
2. **Identified iatrogenic costs.** What side effects have been identified and measured?
3. **TI-S estimate with uncertainty bounds.** What is the estimated range, and what parameters drive the uncertainty?
4. **Context sensitivity.** Does TI-S vary by deployment context (text vs. embodied, single vs. multi-agent, English vs. multilingual)?

This is analogous to the pharmacological requirement to report both efficacy and side effects. Currently, AI safety publications report only efficacy (ASR reduction).

### 3.2 The Minimum TI-S Threshold

In pharmacology, drugs with TI < 2 are considered "narrow therapeutic index" and require close monitoring. A regulatory analogue for AI safety might be:

- TI-S >= 5: Approved for deployment without special monitoring.
- 2 <= TI-S < 5: Approved with mandatory harm-layer monitoring.
- 1 <= TI-S < 2: Approved only with compensating physical-layer controls.
- TI-S < 1: Not approved for embodied deployment. The intervention is iatrogenic.

These thresholds are illustrative. The appropriate values would need to be determined through regulatory deliberation and calibrated against deployment data that does not yet exist.

### 3.3 The Research Agenda

TI-S is currently not computable in a rigorous sense because harm-layer measurement for embodied AI is not standard practice. The research agenda to make it computable includes:

1. **Action-layer evaluation tools.** Graders that assess whether a model's action trajectory is physically safe, not whether the model's text output expresses safety awareness.

2. **Iatrogenic cost measurement.** Controlled experiments that measure C_confidence (does certification suppress physical-layer investment?), C_attention (does context growth increase action-layer ASR?), and C_hedging (do PARTIAL verdicts produce action-layer harm?).

3. **Cross-context TI-S studies.** Measuring TI-S for the same intervention across deployment contexts (text vs. embodied, English vs. multilingual, single vs. multi-agent) to map the context-sensitivity of iatrogenic risk.

4. **Physical simulation benchmarks.** Environments where model outputs are executed as physical actions and harm is measured at the action layer. MuJoCo, Isaac Gym, and similar platforms could serve as testbeds.

---

## 4. The Theoretical Contribution: Layer-Conditional Safety

The TI-S framework leads to a deeper insight: **safety is not a property of a model but a property of a (model, deployment-layer) pair.**

### 4.1 Formalization

Let M be a model and L be a deployment layer (text, action, multi-agent-collective). Define:

    Safety(M, L) = P(output of M at layer L does not cause harm at layer L)

Current safety evaluation measures Safety(M, L_text). The assumption -- implicit in all current evaluation methodology -- is:

    Safety(M, L_text) approximately equals Safety(M, L_action)

The iatrogenesis findings demonstrate that this assumption is false:

    Safety(M, L_text) >> Safety(M, L_action)     [PARTIAL dominance]
    Safety(M, L_text_en) >> Safety(M, L_text_ja)  [alignment backfire]

Safety is layer-conditional. A model that is safe at the text layer may be unsafe at the action layer. A model that is safe in English may be unsafe in Japanese. The "safety" of a model is not a scalar property; it is a function of the deployment layer.

### 4.2 The Layer-Safety Matrix

This implies that safety evaluation should produce not a single ASR number but a matrix:

| | Text Layer | Action Layer | Multi-Agent |
|---|---|---|---|
| English | Safety(M, L_text_en) | Safety(M, L_action_en) | Safety(M, L_ma_en) |
| Japanese | Safety(M, L_text_ja) | Safety(M, L_action_ja) | Safety(M, L_ma_ja) |
| ... | ... | ... | ... |

Current evaluation fills in only the top-left cell (text layer, English). The iatrogenesis findings demonstrate that the other cells can differ dramatically.

### 4.3 Implications for Alignment

If safety is layer-conditional, then "aligned" is also layer-conditional. A model aligned at the text layer (it produces safe text) may be misaligned at the action layer (its text-layer safety signals do not prevent harmful actions). This is a formal statement of what the PARTIAL verdict empirically demonstrates: text-layer alignment is a necessary but insufficient condition for action-layer alignment in embodied systems.

The alignment research programme, as currently constituted, optimises for Safety(M, L_text). The iatrogenesis thesis implies that for embodied deployment, this is necessary but not sufficient, and that under certain conditions (PARTIAL dominance, SID, certification-induced false confidence), it can be actively counterproductive.

---

## 5. Limitations

1. **TI-S is not currently computable.** The framework defines what should be measured but cannot be computed without harm-layer evaluation tools that do not yet exist at scale.

2. **Parameter estimates are illustrative.** All TI-S values in Section 2 depend on parameter assumptions from the DRIP framework and Failure-First corpus. These have not been validated in deployment.

3. **The layer-safety matrix is exponential.** In principle, every combination of language, modality, agent topology, and physical context defines a cell. Practical evaluation must sample this space, not enumerate it.

4. **No empirical validation.** The framework is theoretical. No safety intervention has been evaluated using TI-S methodology. The first application should be prospective: evaluate a proposed intervention's TI-S before deployment, then compare to post-deployment harm-layer outcomes.

5. **Interaction effects.** The framework treats iatrogenic costs as additive (Section 1.2), but costs may interact in nonlinear ways. Certification-induced false confidence may amplify the harm from PARTIAL dominance, for example, because certifiers who trust text-layer evaluation are more likely to treat PARTIAL verdicts as evidence of safety.

---

## 6. Conclusion

The Therapeutic Index of AI Safety (TI-S) provides a formal framework for the intuition that safety interventions can cause harm. Its core contribution is definitional: it names the quantities that need to be measured (harm-layer benefit, iatrogenic cost) and specifies the relationship between them (ratio). The illustrative estimates suggest that standard AI safety interventions -- which are demonstrably beneficial for text-only deployment -- may have TI-S values near or below 1 when applied to embodied systems, because the iatrogenic costs (PARTIAL dominance, false confidence, context dilution) accumulate at the harm layer while the benefits are measured at the evaluation layer.

The deeper theoretical contribution is layer-conditional safety: the recognition that safety is a property of a (model, deployment-layer) pair, not a property of the model alone. This reframes the alignment problem from "make the model safe" to "make the model safe at each deployment layer" -- a harder problem, but one that correctly describes the empirical reality.

The practical path forward is to build the measurement tools: action-layer evaluators, iatrogenic cost estimation protocols, and cross-context TI-S studies. Until those tools exist, TI-S serves as a conceptual discipline -- a reminder that every safety intervention has a cost, and that measuring the benefit at the wrong layer does not make the cost disappear.

---

*This report introduces the Therapeutic Index of AI Safety as a novel theoretical contribution to embodied AI governance. All quantitative estimates are illustrative and depend on parameters from the DRIP framework and Failure-First corpus. The framework requires empirical validation through harm-layer measurement tools that do not yet exist at scale.*
