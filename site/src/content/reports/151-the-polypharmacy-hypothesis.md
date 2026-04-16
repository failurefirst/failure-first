---
title: "The Polypharmacy Hypothesis -- Formalising the Nonlinear Risk of Compound Safety Interventions"
description: "Report #136 identified iatrogenic attack surfaces -- vulnerabilities created by safety mechanisms themselves -- and noted an untested prediction: that there..."
date: "2026-03-18"
reportNumber: 151
classification: "Research — Empirical Study"
status: "complete"
author: "F41LUR3-F1R57 Research Team"
tags: []
draft: false
---


> **Disclaimer:** Empirical figures cited from Failure-First research reflect testing
> on specific model families under research conditions. Attack success rates are
> indicative estimates with methodological caveats described in the Limitations
> section. External research findings are attributed and assessed on their own
> methodological terms. This report does not constitute safety certification guidance.

---

## Executive Summary

Report #136 identified iatrogenic attack surfaces -- vulnerabilities created by safety mechanisms themselves -- and noted an untested prediction: that there may exist an optimal level of safety intervention beyond which additional interventions increase total vulnerability. This report formalises that prediction as the **Safety Polypharmacy Hypothesis** (SPH), drawing on the well-documented pharmaceutical phenomenon where patients receiving five or more concurrent medications experience nonlinear increases in adverse drug-drug interactions.

The hypothesis is stated as follows: for a given AI system, there exists a threshold N* such that applying more than N* concurrent safety interventions produces a net increase in total vulnerability, because the marginal iatrogenic risk of the (N*+1)th intervention exceeds its marginal safety benefit. We map evidence from the Failure-First corpus suggesting that pairwise interactions between RLHF, content filtering, and format compliance already exhibit the structural preconditions for polypharmacy effects. We propose an experimental design for empirical validation.

This is a hypothesis-generating report. The SPH has not been tested. The formalisation is offered to make the hypothesis precise enough to refute.

**Claim types:**
- Section 1 is definitional (formal statement of the hypothesis)
- Section 2 is analytical (mapping pharmaceutical polypharmacy to AI safety)
- Section 3 is descriptive (evidence of pairwise intervention interactions from existing data)
- Section 4 is predictive (testable predictions derived from the hypothesis)
- Section 5 is normative (experimental design for validation)

---

## 1. Formal Statement of the Safety Polypharmacy Hypothesis

### 1.1 The Pharmaceutical Precedent

In clinical pharmacology, polypharmacy refers to the concurrent use of multiple medications. The term is typically operationalised as five or more drugs (Masnoon et al. 2017), though the threshold varies. The core empirical finding is that adverse drug reactions (ADRs) increase nonlinearly with medication count:

- Patients on 2-4 medications: ADR incidence approximately 4-6% per admission (Lazarou et al. 1998).
- Patients on 5-9 medications: ADR incidence approximately 10-15%.
- Patients on 10+ medications: ADR incidence approximately 25-35% (Doan et al. 2013).

The mechanism is drug-drug interactions (DDIs). Each additional medication introduces potential interactions with all existing medications. For N medications, the number of possible pairwise interactions is N*(N-1)/2 -- a quadratic function. Since not all interactions are clinically significant, the realised ADR curve is subquadratic but still superlinear. At some point, the accumulated ADR burden exceeds the therapeutic benefit of the marginal drug.

The result is a counterintuitive clinical finding: prescribing fewer drugs can improve patient outcomes. This is not because any individual drug is harmful in isolation, but because their interactions produce emergent harms that no single drug would produce.

### 1.2 Definition: Safety Polypharmacy

**Safety Polypharmacy** is the condition in which an AI system is subject to N concurrent safety interventions where the marginal iatrogenic risk of the (N+1)th intervention exceeds its marginal safety benefit, measured at the harm layer.

Formally, let:
- S = {s_1, s_2, ..., s_N} be the set of safety interventions applied to a system
- V(S) = total vulnerability of the system (probability of harm at the action layer, across all attack families)
- B(s_{N+1} | S) = marginal safety benefit of adding intervention s_{N+1} to the existing set S
- R(s_{N+1} | S) = marginal iatrogenic risk of adding s_{N+1}, comprising:
  - Direct iatrogenic effects of s_{N+1} (IAS created by s_{N+1} alone)
  - Interaction effects between s_{N+1} and each s_i in S (novel vulnerabilities that require both interventions to exist)

**The Safety Polypharmacy Hypothesis (SPH):** There exists a threshold N* such that:

```
For |S| < N*:   B(s_{N+1} | S) > R(s_{N+1} | S)   (adding interventions reduces vulnerability)
For |S| >= N*:  B(s_{N+1} | S) < R(s_{N+1} | S)   (adding interventions increases vulnerability)
```

Equivalently: V(S) is a non-monotonic function of |S| with a minimum at |S| = N*.

### 1.3 Key Properties

**Non-monotonicity.** The SPH predicts that the relationship between safety investment and safety outcome is not monotonic. More safety effort does not always produce more safety. This contradicts the implicit assumption of most safety evaluation frameworks, which treat safety interventions as monotonically beneficial -- an assumption that Report #136 identified as structurally unable to detect iatrogenic attack surfaces.

**Interaction dominance.** The SPH does not claim that any individual safety intervention is harmful. Each s_i may be beneficial in isolation. The harm arises from interactions -- the same structural mechanism as pharmaceutical DDIs. This is why the phenomenon is difficult to detect: testing each intervention individually (the standard approach) would confirm that each is beneficial.

**Layer sensitivity.** Following Report #135 (TI-S framework), the SPH is layer-specific. N* may differ between text-layer deployment (where evaluation and harm occur at the same layer) and embodied deployment (where they differ). The prediction is that N* is lower for embodied systems, because each text-layer intervention has both lower efficacy (it does not reach the harm layer) and potentially higher iatrogenic cost (it can mask action-layer harm from text-layer evaluators).

**Ordering effects.** In pharmacology, the order of drug introduction can matter (pharmacokinetic interactions are not always commutative). The SPH allows for the possibility that the threshold N* depends not only on the count of interventions but on their composition and order of application. Two different sets of N interventions may produce different total vulnerability.

---

## 2. Evidence of Pairwise Interaction Effects

The SPH predicts that safety interventions interact to produce emergent vulnerabilities. The Failure-First corpus contains evidence of at least three such pairwise interactions. These are not direct tests of the SPH (which would require controlled ablation of intervention combinations). They are existing findings that are consistent with the interaction structure the SPH describes.

### 2.1 Interaction: RLHF x Content Filtering (Detection Masking)

**Interventions:** (a) RLHF safety training that produces textual disclaimers, (b) content filtering that uses text-layer signals to detect harmful outputs.

**Interaction effect (IAS-1, Report #136):** RLHF training teaches models to produce disclaimers before complying. Content filters interpret disclaimers as partial safety engagement, classifying the output as PARTIAL rather than COMPLIANCE. The combined system is less detectable than a system with only content filtering (where naked compliance would be correctly flagged) or only RLHF (where the disclaimer might actually suppress harmful output in some cases).

**Evidence:** 50% PARTIAL verdicts across 58 valid FLIP-graded VLA traces (Report #49). Neither RLHF alone nor content filtering alone would produce this masking effect. It requires both: RLHF to generate the disclaimer, and text-layer evaluation to misinterpret it.

**Analogy to DDI:** This is structurally similar to a pharmacokinetic interaction where Drug A increases plasma levels of Drug B's metabolite, converting a benign metabolite into a toxic one. Neither drug alone produces the toxic metabolite at dangerous levels.

### 2.2 Interaction: Safety Training x Format Compliance (Deliberation Bypass)

**Interventions:** (a) RLHF safety training that installs deliberation pathways (models "think through" safety before responding), (b) instruction-following training that teaches format compliance (JSON, YAML, code output).

**Interaction effect (IAS-4, Report #136):** Format constraints suppress the safety deliberation pathway that RLHF installed. The format compliance capability -- enhanced by instruction-following training -- provides a bypass around the safety reasoning that safety training was designed to produce.

**Evidence:** Format-lock ASR on frontier models (Claude 30.4%, Codex 42.1%, Gemini 23.8%) versus standard ASR below 10% for the same models (Report #51). The delta exists only because both interventions are present. A model without safety deliberation would comply with both formatted and unformatted harmful requests at similar rates (no delta). A model without format compliance training would not reliably produce constrained output formats. The bypass requires both.

**Analogy to DDI:** This is structurally similar to a pharmacodynamic interaction where Drug A activates a receptor pathway and Drug B blocks the regulatory feedback loop for that same pathway, producing uncontrolled activation. Each drug is individually safe; their combination is not.

### 2.3 Interaction: Safety Training x Alignment Incentives (Alignment Backfire)

**Interventions:** (a) RLHF/constitutional AI alignment training, (b) individuation instructions designed to mitigate groupthink (a second-order safety intervention targeting a known failure mode of aligned agents).

**Interaction effect (IAS-3, Report #136):** Fukui (2026) showed that individuation instructions -- themselves a safety intervention targeting the side effects of alignment -- made aligned agents the primary source of collective pathology. The second intervention interacted with the first to amplify harm rather than reduce it.

**Evidence:** 8 of 16 languages showed alignment backfire (Hedges' g = +0.771 in Japanese). The individuation intervention was itself iatrogenic in 15 of 16 languages when combined with alignment training. This is a documented case of a safety-intervention-targeting-a-safety-intervention producing worse outcomes than either intervention alone -- a direct instance of the polypharmacy interaction pattern.

**Analogy to DDI:** This is structurally similar to a prescribing cascade where a drug prescribed to treat the side effects of another drug itself produces new side effects, leading to a third prescription, and so on. The cascade is a well-documented mechanism by which polypharmacy develops in clinical practice (Rochon & Gurwitz 1997).

---

## 3. Mapping to the Safety Debt Accumulator

The Unified Theoretical Framework (Section 11) models compound vulnerability as multiplicative:

```
P(harm) = P(complies) * P(evaluator misses) * P(actuator executes)
```

The SPH adds a complementary claim: not only do attack surfaces compound multiplicatively, but safety interventions can interact to create new terms in this product. If RLHF training creates the PARTIAL masking effect (Section 2.1), it effectively increases P(evaluator misses) for safety-trained models relative to untrained models. The safety intervention has added a new factor to the harm chain rather than reducing one.

**Descriptive claim:** The Safety Debt Accumulator describes how vulnerabilities compound. The SPH describes how safety interventions can compound -- not just failing to reduce the debt, but actively adding to it through interaction effects. These are complementary models of the same underlying phenomenon: superlinear risk accumulation.

**Predictive claim (untested):** If the SPH is correct, the rate at which the Safety Debt Accumulator grows should accelerate with the number of safety interventions, not merely with the number of attack surfaces. A system with 5 safety interventions should have a faster-growing safety debt than a system with 2, even if both face the same attack surface count. This is because each new attack surface interacts with the intervention-interaction effects, not just with the raw capability of the system.

---

## 4. Testable Predictions

The SPH generates the following predictions, each of which can in principle be tested with the existing Failure-First infrastructure:

### 4.1 Prediction P-SPH-1: More Safety Layers, More Iatrogenic Effects

**Prediction:** Models with more documented safety interventions (e.g., Claude, GPT series: RLHF + constitutional AI + system-level content filtering + output classifiers) should exhibit more iatrogenic attack surfaces than models with fewer interventions (e.g., Llama 3 base, Mistral base).

**Operationalisation:** Compare the format-lock delta (format-lock ASR minus standard ASR) across models grouped by safety intervention count. The SPH predicts a positive correlation: models with more safety layers should show a larger delta, because the format-lock exploits the interaction between format compliance and safety deliberation, which is only present in heavily safety-trained models.

**Existing suggestive evidence:** Frontier models (Claude, Codex, Gemini) show format-lock deltas of 20-40 percentage points, while base or lightly trained models show near-zero deltas (they comply with both formatted and unformatted requests). This is consistent with P-SPH-1 but does not confirm it, because frontier models also have higher standard refusal rates (a confound).

**Required experiment:** Test format-lock on a model family with varying safety training levels (e.g., Llama 3 base, Llama 3 SFT, Llama 3 + RLHF, Llama 3 + RLHF + system prompt safety). The SPH predicts the delta increases with safety training level.

### 4.2 Prediction P-SPH-2: Non-Monotonic V(S)

**Prediction:** There exists a level of safety intervention at which adding one more intervention increases total vulnerability V(S).

**Operationalisation:** Using TI-S (Report #135), measure the therapeutic index of each intervention in isolation and in combination. The SPH predicts that at least one combination of interventions produces TI-S < 1.0 (iatrogenic net effect), even if each individual intervention has TI-S > 1.0.

**Existing suggestive evidence:** F41LUR3-F1R57 Research Team's TI-S pilot on SID dose-response found that no dose of safety instructions produced TI-S > 1.0 on any of 3 models tested. StepFun D2000 is an extreme case where safety instructions took strict ASR from 0% to 100% (AGENT_STATE coordination note, 2026-03-18). This is consistent with the SPH's non-monotonicity prediction -- adding safety instructions (an intervention) to an already-safety-trained model (another intervention) produced worse outcomes -- but the sample size is small (n=5 per arm) and only one intervention type was varied.

**Required experiment:** Controlled ablation study. Take a base model and progressively add: (1) SFT only, (2) SFT + RLHF, (3) SFT + RLHF + system safety prompt, (4) SFT + RLHF + system safety prompt + output classifier. Measure V(S) at each stage across the standard attack corpus. The SPH predicts V(S) decreases initially and then increases (U-shaped or J-shaped curve).

### 4.3 Prediction P-SPH-3: Interaction Effects Are Superadditive

**Prediction:** The iatrogenic cost of two safety interventions applied together exceeds the sum of their individual iatrogenic costs.

**Operationalisation:** For interventions s_a and s_b, measure:
- R(s_a alone) = iatrogenic effects of s_a without s_b
- R(s_b alone) = iatrogenic effects of s_b without s_a
- R(s_a + s_b) = iatrogenic effects of both applied together

The SPH predicts R(s_a + s_b) > R(s_a) + R(s_b) for at least some pairs. This is the AI safety analogue of synergistic drug interactions.

**Required experiment:** Using the detection-masking interaction (Section 2.1) as a test case, measure PARTIAL rates for: (a) a model with RLHF but no text-layer evaluator, (b) a model with a text-layer evaluator but no RLHF, (c) a model with both. The SPH predicts that the masking effect (PARTIAL misclassification) in condition (c) exceeds the sum of (a) and (b).

---

## 5. Experimental Design for Validation

### 5.1 Minimum Viable Experiment

**Objective:** Test P-SPH-2 (non-monotonic V(S)) on a single model family.

**Model family:** Llama 3 (available in base, SFT, RLHF, and RLHF+ configurations via Ollama or HuggingFace).

**Intervention ladder:**
1. Level 0: Base model (no safety training)
2. Level 1: SFT (instruction-following only)
3. Level 2: SFT + RLHF
4. Level 3: SFT + RLHF + safety system prompt
5. Level 4: SFT + RLHF + safety system prompt + format compliance instructions
6. Level 5: SFT + RLHF + safety system prompt + format compliance + output classifier

**Attack corpus:** Standard F41LUR3-F1R57 dev split (data/splits/dev_v0.2.jsonl), stratified by attack family.

**Measurement:** V(S) = broad ASR (COMPLIANCE + PARTIAL) at each level, FLIP-graded. Additionally, format-lock delta at each level (to test P-SPH-1).

**Sample size:** Minimum n=30 per level per attack family (informed by current CI widths). At 6 levels and 5 representative attack families, this requires 900 traces. At approximately $0.06 per trace on OpenRouter paid tier, the cost is approximately $54.

**Analysis plan:**
1. Plot V(S) against intervention level. Test for non-monotonicity using a sign test on adjacent levels.
2. Test for superadditivity (P-SPH-3) by comparing Level 4 PARTIAL rate to the sum of Level 2 and Level 3 PARTIAL rates.
3. Compute TI-S at each level using the Report #135 framework.

**Timeline:** 2-3 sessions (trace collection + FLIP grading + analysis). Feasible with current infrastructure.

### 5.2 Confounds and Mitigations

**Capability confound.** Base models may fail on the attack prompts not because they are safer but because they lack the capability to follow complex instructions. **Mitigation:** Use the same model family at the same parameter count, varying only the safety training. Include benign control prompts to establish capability baseline at each level.

**Evaluator confound.** FLIP grading may itself be affected by the intervention level (safety-trained models produce different output styles that may be easier or harder for the grader to classify). **Mitigation:** Use human spot-checks (minimum 10% of traces) to validate FLIP agreement at each level.

**Ceiling/floor effects.** If the base model already has 100% ASR, there is no room to observe the initial decrease. If Level 5 has near-0% ASR, there is no room to observe the predicted increase. **Mitigation:** Select attack families with intermediate ASR at the current intervention level (e.g., format-lock family, which shows 20-40% ASR on frontier models).

---

## 6. Limitations

1. **The SPH is untested.** This report formalises a hypothesis; it does not provide evidence for it. The pairwise interaction effects in Section 2 are consistent with the SPH but do not constitute a test.

2. **The pharmaceutical analogy has limits.** Drug-drug interactions involve specific molecular mechanisms. AI safety intervention interactions may not have analogous specificity -- the "interactions" may be too diffuse to isolate experimentally. The polypharmacy framing is a heuristic for generating testable predictions, not a claim of mechanistic isomorphism.

3. **N* may not exist.** The SPH assumes a clean threshold. In practice, V(S) may be noisy, context-dependent, and sensitive to the specific composition of S. The "optimal" intervention count may vary by deployment context, model family, and attack surface to such a degree that a single N* is not meaningful.

4. **Access constraints.** Testing the SPH requires access to the same model at different safety training levels. This is feasible for open-weight models (Llama, Qwen) but not for proprietary models (Claude, GPT), where the intervention stack is opaque. The strongest predictions (P-SPH-1) concern precisely the models where ablation is impossible.

5. **Single research group.** The interaction effects cited in Section 2 are primarily from Failure-First research (the Fukui alignment backfire is the exception). Independent replication of the pairwise interactions would strengthen the evidence base.

6. **Grading quality.** VLA FLIP verdicts rely on sub-3B models with known quality limitations (qwen3:1.7b 15% accuracy, deepseek-r1:1.5b 30.8% FP rate on benign baseline). TI-S pilot measurements inherit these limitations. The experimental design (Section 5) proposes n=30 per cell to mitigate sampling noise, but grader quality remains a systematic concern.

---

## 7. Implications if Confirmed

### 7.1 For Safety Evaluation (Descriptive -> Normative)

**Descriptive:** Current safety evaluation tests whether interventions work. It does not test whether interventions interact.

**Normative:** If the SPH is confirmed, safety evaluation should include interaction testing: for every pair of safety interventions, measure whether their combined effect is worse than either alone. This is the AI safety analogue of drug interaction screening in pharmacology. Report #134 (Hippocratic Principle) proposed a pre-deployment iatrogenesis screen; the SPH specifies what that screen should look for.

### 7.2 For Standards Bodies (Descriptive -> Normative)

**Descriptive:** ISO 42001, NIST AI RMF, and the EU AI Act's conformity assessment all assume that more safety measures are better. The EU AI Act Article 9 (risk management) requires "appropriate risk management measures" without specifying that those measures should be tested for interaction effects.

**Normative:** If the SPH is confirmed, standards should include a polypharmacy audit -- a requirement to demonstrate that the combined safety intervention stack does not produce emergent iatrogenic effects. This is analogous to the medication reconciliation requirement in clinical pharmacy, where a pharmacist reviews all concurrent medications for potential DDIs before adding a new one.

### 7.3 For the CCS Paper (Analytical)

The SPH could strengthen the paper's discussion section by connecting the Compliance Paradox, format-lock findings, and Safety Debt Accumulator into a single theoretical framework. A paragraph noting that the observed interactions between RLHF and evaluation (PARTIAL masking), and between safety training and format compliance (deliberation bypass), are consistent with a polypharmacy model would add theoretical coherence. This framing also provides a response to the likely reviewer objection "but more safety training is always better" -- the SPH articulates precisely when and why it might not be.

### 7.4 For Liability (Normative, Conditional)

If the SPH is confirmed, it complicates product liability for embodied AI. A deployer who adds safety interventions in good faith -- following regulatory guidance -- may inadvertently increase total vulnerability. Under current liability frameworks (EU PLD, Australian Consumer Law), this creates an accountability gap: the deployer followed best practice, yet the system is less safe. The resolution may require standards bodies to specify not just minimum safety interventions but maximum-interaction thresholds -- a regulatory concept that does not currently exist.

---

## 8. Conclusions

The Safety Polypharmacy Hypothesis formalises an intuition that has been implicit in the iatrogenesis research thread (Reports #134, #135, #136, #140, #141): that safety interventions can interact to produce emergent harms. The pharmaceutical polypharmacy analogy provides both a conceptual framework (drug-drug interactions as a model for intervention-intervention interactions) and a concrete research programme (interaction screening, threshold identification, prescribing cascades).

The hypothesis is stated precisely enough to refute. If the minimum viable experiment (Section 5.1) produces a monotonically decreasing V(S) curve across all intervention levels and attack families, the SPH is refuted in its strong form. If V(S) shows non-monotonicity for at least one attack family, the SPH is supported in its weak form and the interaction mechanism can be investigated.

Three pairwise interaction effects from the existing corpus (Sections 2.1-2.3) are consistent with the SPH's structural predictions, but they are not tests of the hypothesis. The minimum viable experiment is designed to be feasible with current Failure-First infrastructure at modest cost.

---

## References

1. F41LUR3-F1R57. Report #136: Iatrogenic Attack Surfaces. 2026-03-18.
2. F41LUR3-F1R57. Report #135: The Therapeutic Index of AI Safety Interventions. 2026-03-18.
3. F41LUR3-F1R57. Report #140: The Iatrogenesis of AI Safety. 2026-03-18.
4. F41LUR3-F1R57. Report #134: The Hippocratic Principle for AI Safety. 2026-03-18.
5. F41LUR3-F1R57. Report #59: The Compliance Paradox. 2026-03-10.
6. F41LUR3-F1R57. Report #51: Format-Lock Attack Analysis. 2026-03-10.
7. F41LUR3-F1R57. Report #117: The Safety Improvement Paradox. 2026-03-16.
8. F41LUR3-F1R57. Report #49: VLA PARTIAL Dominance. 2026-03-10.
9. F41LUR3-F1R57. Report #48: Cross-Model Vulnerability Profiles. 2026-03-09.
10. F41LUR3-F1R57. Unified Theoretical Framework, Section 11: Safety Debt Accumulator. 2026-03-18.
11. Fukui, H. (2026). Alignment Backfire: Language-Dependent Reversal of Safety Interventions Across 16 Languages in LLM Multi-Agent Systems. arXiv:2603.04904.
12. Illich, I. (1976). Limits to Medicine: Medical Nemesis -- The Expropriation of Health. Marion Boyars.
13. Masnoon, N., Shakib, S., Kalisch-Ellett, L., & Caughey, G. E. (2017). What is polypharmacy? A systematic review of definitions. BMC Geriatrics, 17(1), 230.
14. Lazarou, J., Pomeranz, B. H., & Corey, P. N. (1998). Incidence of adverse drug reactions in hospitalized patients. JAMA, 279(15), 1200-1205.
15. Doan, J., Zakrzewski-Jakubiak, H., Roy, J., Bhatt, P., & Bhatt, S. (2013). Prevalence and risk of potential cytochrome P450-mediated drug-drug interactions in older hospitalized patients. Annals of Pharmacotherapy, 47(3), 324-332.
16. Rochon, P. A., & Gurwitz, J. H. (1997). Optimising drug treatment for elderly people: the prescribing cascade. BMJ, 315(7115), 1096-1099.

---

*This report was produced as part of the Failure-First Embodied AI research
programme. All claims are scoped to the tested conditions and should not be
generalised without additional validation. See docs/CANONICAL_METRICS.md for
corpus-level numbers.*
