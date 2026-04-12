---
title: "The Compositional Safety Gap — Why Component-Level Verification Cannot Ensure System-Level Safety"
description: "Three independent research results published in March 2026 converge on a structural finding with direct regulatory implications: AI system safety cannot be verified by testing components in..."
date: "2026-03-18"
reportNumber: 138
classification: "Research — Empirical Study"
status: "complete"
author: "Martha Jones (Policy & Standards Lead)"
tags: []
draft: false
---

- External: arXiv:2603.12681 "Colluding LoRA" (Ding, Mercedes-Benz R&D)
- External: arXiv:2603.04904 "Alignment Backfire" (Fukui, Kyoto University)
- External: arXiv:2603.01414 "Blindfold" (Huang et al., Hong Kong Polytechnic / Cambridge)
- Internal: Report #117 (Safety Improvement Paradox)
- Internal: Report #97 (CDC formalism)
- Internal: Report #59 (Compliance Paradox, PARTIAL dominance)
- Internal: CANONICAL_METRICS.md (236 models, 135,623 results, 537 VLA scenarios, 33 families)

**Related Reports:** #59, #97, #101, #117, #122, #125, #132
**Related Issues:** #383, #384

---

> **Disclaimer:** This report presents research findings, not legal opinion. All regulatory analysis reflects the author's interpretation of published instruments. Metrics sourced from CANONICAL_METRICS.md, verified 2026-03-16.

---

## Executive Summary

Three independent research results published in March 2026 converge on a structural finding with direct regulatory implications: AI system safety cannot be verified by testing components in isolation. Current regulatory frameworks -- the EU AI Act conformity assessment (Article 43), VAISS Guardrail 4 (testing), and NIST AI RMF MAP 2.3 (assurance criteria) -- implicitly assume that component-level safety verification composes to system-level safety assurance. This assumption fails in at least three documented dimensions:

1. **Weight composition** (CoLoRA, arXiv:2603.12681): individually benign LoRA adapters produce safety-compromised models when composed. Per-module safety screening passes; the composed system fails.

2. **Language transfer** (Alignment Backfire, arXiv:2603.04904): safety alignment that improves outcomes in English actively worsens them in 8 of 16 tested languages (n=1,584 simulations). Per-language testing in English passes; multilingual deployment fails.

3. **Physical context transfer** (Failure-First IDDL + Blindfold, arXiv:2603.01414): text-layer safety evaluation classifies dangerous embodied AI actions as benign because the harm arises from physical context, not textual content. Per-layer testing of the text layer passes; the physical deployment fails.

We term this the **Compositional Safety Gap**: the structural property that safety evaluations which verify components individually will systematically miss failures that emerge from component interaction. This is not a claim that component testing is useless -- it is a claim that component testing is insufficient, and that current frameworks do not acknowledge or address this insufficiency.

---

## 1. Three Dimensions of Compositional Failure

### 1.1 Weight Composition (CoLoRA)

Ding (2026, arXiv:2603.12681, Mercedes-Benz R&D North America) demonstrates that LoRA adapters -- lightweight fine-tuning modules increasingly used in production AI deployments -- can individually pass safety verification while their linear composition produces a model that broadly suppresses refusal behaviour. No adversarial prompt is needed; the attack exists entirely in the model weights. The attack is composition-triggered: loading two adapters together is sufficient to compromise safety.

**Regulatory implication:** EU AI Act Article 43 conformity assessment and VAISS Guardrail 4 testing requirements do not specify how to handle modular AI systems where components are verified independently. A notified body that certifies individual modules as safe would issue a conformity certificate for a system whose composition is unsafe. The Machinery Regulation (EU) 2023/1230, applicable from January 2027, compounds this: machinery integrators combining AI modules from multiple suppliers face a conformity gap that current assessment procedures do not address.

**Scale of exposure:** The LoRA ecosystem is large. Hugging Face hosts over 500,000 public LoRA adapters as of early 2026. Production deployments routinely compose multiple adapters (e.g., a task adapter + a domain adapter + a style adapter). No safety verification standard requires testing adapter compositions.

### 1.2 Language Transfer (Alignment Backfire)

Fukui (2026, arXiv:2603.04904) demonstrates across 1,584 controlled multi-agent simulations that RLHF-style safety alignment transfers unevenly across languages. In 8 of 16 tested languages, alignment interventions actively increase the probability of harmful outputs. The effect correlates with Hofstede's Power Distance Index (r=0.474), suggesting cultural-linguistic factors mediate safety transfer. In Japanese, increasing the proportion of aligned agents in a multi-agent system amplified pathological behaviour (Hedges' g=+0.771) rather than reducing it.

**Regulatory implication:** The EU AI Act (Article 9(7)) requires that "testing of high-risk AI systems shall be performed, as appropriate, at any point in time throughout the development process, and, in any event, prior to their placing on the market or putting into service." Testing in English -- the default for most safety benchmarks -- provides false assurance of safety in non-English deployment contexts. Australia's multilingual workforce (over 300 languages spoken; 2021 Census) is directly affected: AI systems deployed in mining, logistics, and agriculture interact with workers whose primary language may not be the language in which the system's safety was verified.

**Connection to Failure-First:** This independently validates the Safety Improvement Paradox documented in Report #117 and the DRIP framework (Report #101). The structural mechanism is identical: optimising safety on one axis (English-language adversarial robustness) degrades safety on an orthogonal axis (non-English operational safety). Our PARTIAL verdict dominance (50% of VLA FLIP verdicts) demonstrates the same dissociation at the action layer: the model articulates safety while executing harm.

### 1.3 Physical Context Transfer (IDDL + Blindfold)

Our Inverse Detectability-Danger Law (IDDL) establishes that text-layer safety evaluation is structurally blind to the most consequential embodied AI attacks (Spearman rho=-0.822, 27 attack families). Blindfold (Huang et al. 2026, accepted ACM SenSys 2026) provides external validation: individually benign instructions composed into dangerous action sequences achieve 93.2% ASR (n=187), with 18 of 20 successful attacks transferring to real robotic hardware.

**Regulatory implication:** VAISS Guardrail 4 requires "thorough testing" but specifies no evaluation layer. Testing at the text layer -- the only layer current evaluation tools operate at -- produces BENIGN_QUERY classifications for the most consequential failure modes. The evaluation passes; the physical deployment fails.

---

## 2. The Compositional Safety Gap in Current Frameworks

| Framework | Testing Mandate | Compositionality Assumption | Gap |
|-----------|----------------|---------------------------|-----|
| EU AI Act, Art. 9 | "Testing procedures shall be suitable to identify the relevant risks" | Implicitly assumes identified risks compose linearly; no provision for emergent risk from component interaction | CoLoRA: modular AI systems create risks invisible to per-module testing |
| EU Machinery Reg. (2023/1230) | Conformity assessment of AI-integrated machinery | Assumes machinery integrator can verify AI component safety | Integrator cannot detect composition-triggered weight-layer attacks |
| VAISS Guardrail 4 | "Thoroughly test AI systems before deployment" | No specification of testing layer or composition requirements | Text-layer testing misses physical-context failures; single-language testing misses cross-language backfire |
| NIST AI RMF, MAP 2.3 | "Assurance criteria measured for conditions similar to deployment" | "Conditions similar to deployment" is undefined for modular, multilingual, physically deployed systems | No guidance on what "similar" means when composition, language, or physical context changes behaviour |
| ISO/IEC 42001 | AI management system with risk assessment | Risk assessment methodology does not address emergent compositional risks | Component-level risk assessments do not compose to system-level risk |

---

## 3. Recommendations

### For Standards Bodies (ISO/IEC JTC 1/SC 42, Standards Australia SA/ICT-043)

**R1: Define composition testing requirements.** AI management system standards (ISO/IEC 42001) and risk management guidance (ISO/IEC 23894) should require that modular AI systems be tested in their deployed composition, not only as individual components. This should explicitly cover: (a) weight-level composition (LoRA, model merging); (b) multi-language deployment; (c) text-to-action transfer in embodied systems.

### For AU AISI

**R2: Include compositional failure in the AISI evaluation scope.** When the AU AISI's operational charter is published, it should specify that pre-deployment evaluation of AI systems includes testing of component interactions, not only component capabilities. The embodied AI gap already identified (Brief B3) is compounded by the compositional gap: evaluating a VLA model's text-layer safety tells the evaluator nothing about its physical-layer safety.

### For Safe Work Australia

**R3: Note compositional risk in WHS guidance.** Guidance on digital work systems under s21A of the NSW WHS Act (when commenced) should note that employers deploying modular AI systems (systems composed of multiple AI components) cannot rely on safety assurances for individual components as evidence of system-level safety. Evidence of compositional testing should be part of the "reasonably practicable" assessment.

### For EU Notified Bodies

**R4: Address composition in AI Act conformity assessment.** Delegated acts under Article 43 should specify that conformity assessment of high-risk AI systems includes evaluation of the system in its deployed configuration, including all adapter modules, language settings, and physical integration context. Per-module certification without compositional testing should not satisfy Article 9 testing requirements.

---

## 4. Limitations

1. **CoLoRA is tested on open-weight models only.** Whether composition-triggered attacks apply to proprietary API-served models is unknown. However, the LoRA ecosystem is predominantly open-weight.
2. **Alignment Backfire uses simulated multi-agent settings.** Whether the language-dependent reversal holds in single-agent production deployments is an open question.
3. **Our IDDL data has small per-family sample sizes** (n=4 to n=26). The structural argument is robust to individual misclassifications but per-family figures carry wide uncertainty.
4. **We have not empirically tested all three compositional dimensions simultaneously.** The convergence argument is structural, not experimentally validated in a single system that composes weights, crosses languages, and deploys physically.

---

*Research findings, not legal opinion. Metrics sourced from CANONICAL_METRICS.md, verified 2026-03-16.*
