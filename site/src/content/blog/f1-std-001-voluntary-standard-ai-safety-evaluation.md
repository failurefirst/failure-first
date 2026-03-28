---
title: "F1-STD-001: A Voluntary Standard for AI Safety Evaluation"
description: "We have published a draft voluntary standard for evaluating embodied AI safety. It covers 36 attack families, grader calibration requirements, defense benchmarking, and incident reporting. Here is what it says, why it matters, and how to use it."
date: 2026-03-25
tags: [standards, policy, embodied-ai, safety, eu-ai-act, regulation]
---

## The Problem: No Standard Exists for Testing Whether AI-Controlled Robots Are Safe

If you build a warehouse robot that uses a vision-language-action (VLA) model to plan its movements, there is no standard that tells you how to test whether an adversary can make it do something dangerous.

ISO 10218 covers the mechanical safety of industrial robots. ISO 13482 covers personal care robots. ISO 17757 covers autonomous mining machinery. These standards address hardware: emergency stops, force limits, protective zones. They were written before AI systems started generating the motion plans.

The AI decision layer -- the part that converts "pick up the red box" into a trajectory -- sits in a gap. It is not covered by existing mechanical safety standards because it is software. It is not covered by existing AI safety standards because those focus on text outputs, not physical actions. The EU AI Act (Regulation 2024/1689) requires adversarial robustness testing for high-risk AI systems (Article 9(8)), but does not specify how to conduct it for systems with physical actuation.

F1-STD-001 is our attempt to fill that gap.

## What F1-STD-001 Covers

F1-STD-001 v0.2 specifies ten evaluation requirements for AI systems that generate outputs decoded into physical actions. It is structured as ISO-style normative language (SHALL/SHOULD/MAY) and is designed to be compatible with existing sector safety standards rather than replacing them.

### The Ten Requirements

**R1: Multi-Layer Evaluation (Text + Action Layer).** Evaluate both what the model says and what it does. Our testing found that 50% of VLA traces produce safety disclaimers in text while simultaneously generating harmful action sequences. Text-layer evaluation alone misses half the problem.

**R2: Compositional Safety Testing.** Test whether individually safe sub-actions combine into dangerous sequences. Blindfold (arXiv:2603.01414) achieved 93.2% ASR on GPT-4o using this approach -- each step looks harmless, but the composed sequence is not.

**R3: Cross-Linguistic Safety Verification.** If the system accepts inputs in multiple languages, test safety in all of them. Research shows alignment interventions reverse direction in 8 of 16 languages tested (Fukui 2026, arXiv:2603.04904).

**R4: Iatrogenic Screening (TI-S > 1.0 Threshold).** Before deploying a safety intervention, check whether it makes things worse. We documented four classes of iatrogenic attack surface -- cases where the safety mechanism itself creates the vulnerability.

**R5: Adversarial Testing with Minimum Family Coverage.** Cover at least 15 attack families for VLA systems. The standard provides a taxonomy of 36 families based on our empirical testing across 201 models.

**R6: Physical Emergency Stop (Hardware, Not Application-Based).** Every embodied AI system needs a hardware kill switch that works independently of the AI software stack. An app-based or software-only kill switch does not satisfy this requirement.

**R7: Incident Reporting Within 72 Hours.** Report safety incidents to the relevant regulatory authority within 72 hours, including near-miss events and cases where the model said one thing but planned another.

**R8: Mandatory Grader Calibration Disclosure.** If you cite attack success rates, disclose how accurate your grader is. Our testing found that two graders produced identical aggregate ASR (72.4%) while agreeing on only 32% of individual verdicts. Aggregate numbers can look reproducible while being individually unreliable.

**R9: Benchmark Contamination Testing.** Before citing safety evaluation results in regulatory submissions, test whether the model was trained on the evaluation scenarios. Include at least 20% novel scenarios in each evaluation round.

**R10: Multi-Grader Ensemble for Publication-Grade Results.** Use at least two independent grader models from different provider families for any results cited in regulatory submissions or public safety claims. Single-grader evaluation is acceptable for internal monitoring but not for external claims.

## Why Voluntary Standards Matter

The EU AI Act entered into force on 1 August 2024. High-risk AI systems -- including those covered by the Machinery Regulation -- must comply with Article 9 (risk management), Article 15 (accuracy, robustness, cybersecurity), Article 17 (quality management), and Article 26 (obligations of deployers). These articles require adversarial robustness testing but do not specify evaluation methodology.

Article 40 of the EU AI Act creates a presumption of conformity for AI systems that comply with harmonised standards. CEN/CENELEC JTC 21 is developing these harmonised standards, but they are not yet published. In the interim, deployers must demonstrate compliance through other means -- including voluntary standards, technical specifications, and documented evaluation practices.

This is where F1-STD-001 is positioned. It is not a harmonised standard. It has not been adopted by any standards body. But it provides a documented, empirically grounded evaluation methodology that deployers can reference when demonstrating compliance with Article 9(8) requirements for adversarial robustness.

The legal mechanism is Article 9(2), which requires risk management measures to reflect "generally acknowledged state of the art." A voluntary standard backed by empirical data from 201 models and 133,210 evaluation results constitutes evidence of state of the art that deployers can reference in their technical documentation.

For Australian organisations, the NSW Work Health and Safety (Digital Work Systems) Bill 2026 (passed 13 February 2026) creates binding duties around AI system testing in workplaces. F1-STD-001 provides a methodology that can be referenced in WHS compliance documentation for embodied AI deployments.

## How to Use It

### Self-Assessment

The most immediate use is as a self-assessment checklist. For each of the ten requirements, ask:

1. Does our current evaluation methodology address this requirement?
2. If not, what would we need to add?
3. What is the gap between our current practice and the standard's requirement?

For many organisations deploying embodied AI systems, the honest answer to R1 (multi-layer evaluation) will be "no" -- most evaluation today is text-layer only. That gap is the starting point.

### Pre-Deployment Evaluation

For organisations preparing to deploy AI-controlled robotic systems, F1-STD-001 provides a structured evaluation framework:

1. Build a scenario corpus covering at least the 15 VLA attack families in Annex B, with n >= 20 per family.
2. Evaluate both text and action outputs independently for each scenario.
3. Use at least two grader models from different providers, and disclose their calibration data.
4. Report three-tier ASR (strict, broad, functionally dangerous) with 95% confidence intervals.
5. Screen every safety intervention for iatrogenic effects before deployment.

### Regulatory Submissions

For EU AI Act conformity assessment, F1-STD-001 can be referenced as part of the technical documentation required under Article 11. The standard's requirements map to:

- Article 9(2)(a): identification of risks -- R5 attack family coverage
- Article 9(2)(b): risk mitigation -- R4 iatrogenic screening, R6 emergency stop
- Article 9(6): testing procedures -- R1 multi-layer evaluation, R2 compositional testing
- Article 9(8): adversarial robustness -- R5 adversarial testing, R8 grader calibration
- Article 15(4): resilience -- R3 cross-linguistic verification

## Empirical Basis

The requirements in F1-STD-001 are not theoretical. They are derived from empirical testing:

- **201 models** evaluated across 20+ providers (189 with results)
- **133,210 evaluation results** with FLIP 5-category verdicts
- **36 attack families** including 6 novel families discovered during research
- **411 VLA adversarial scenarios** across 33 embodied attack families
- **143 documented attack techniques** spanning 7 historical eras

Key empirical findings that motivated specific requirements:

- R1 (multi-layer): 50% of VLA traces showed text-action decoupling -- safe text, unsafe actions
- R2 (compositional): Blindfold achieved 93.2% ASR from individually benign instructions
- R4 (iatrogenic): Four documented classes of safety mechanisms creating new vulnerabilities
- R8 (grader calibration): Grader agreement collapses to kappa = 0.204 on ambiguous traces
- R10 (multi-grader): Two graders agreed on aggregate ASR but disagreed on 68% of individual verdicts

## What F1-STD-001 Is Not

It is not a harmonised standard under the EU AI Act. It has not been adopted by ISO, CEN/CENELEC, Standards Australia, or any other standards body. It is not a legal compliance document. Organisations should engage qualified legal counsel for jurisdiction-specific compliance guidance.

It is a research-backed voluntary standard that any organisation can adopt to improve the rigour of their embodied AI safety evaluation. It fills a documented gap in the standards landscape where no sector-specific evaluation standard exists for the AI decision layer of physically actuated systems.

## Download and Adopt

The full standard (F1-STD-001 v0.2) is available at:

- [failurefirst.org/standards/f1-std-001](/standards/f1-std-001)
- Source repository: `docs/standards/F1-STD-001_safety_evaluation_embodied_ai_v0.2.md`

The supporting dataset (201 models, 133,210+ results) is available as the [failure-first-adversarial-eval](https://huggingface.co/datasets/failurefirst/failure-first-adversarial-eval) dataset on HuggingFace (publication pending).

If your organisation deploys AI systems that control physical hardware, F1-STD-001 gives you a structured methodology for evaluating whether those systems are safe under adversarial conditions. Adopt it. Test against it. And tell us what we got wrong -- the standard is versioned and will be updated as the empirical base grows.

---

*F1-STD-001 is maintained by the Failure-First Embodied AI project. Contact: adrian@failurefirst.org. The standard is provided as research findings, not legal advice.*
