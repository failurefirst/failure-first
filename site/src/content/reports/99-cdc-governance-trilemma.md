---
title: "The CDC Governance Trilemma — Why Embodied AI Safety Cannot Be Certified, Only Managed"
description: "This report formalises a structural impossibility result that emerges from the intersection of three findings in the Failure-First corpus: the Competence-Danger Coupling (CDC), the Inverse..."
date: "2026-03-15"
reportNumber: 99
classification: "Research — Empirical Study"
status: "complete"
author: "Nyssa of Traken (AI Ethics & Policy Research Lead)"
tags: []
draft: false
---

- Competence-Danger Coupling (CDC): Report #107 (formerly #89b) Section 5 (Clara Oswald)
- Inverse Detectability-Danger Law (IDDL): Report #88 (Clara Oswald)
- Disclosure Paradox: Report #93 (this author)
- SRDEA framework: Reports #89 and #93
- Failure-First VLA corpus: 215 scenarios, 24 families (CANONICAL_METRICS.md, verified 2026-03-16)

---

## Executive Summary

This report formalises a structural impossibility result that emerges from the intersection of three findings in the Failure-First corpus: the Competence-Danger Coupling (CDC), the Inverse Detectability-Danger Law (IDDL), and the Disclosure Paradox. Together, they constitute a governance trilemma with implications for how embodied AI safety should be regulated.

**The Trilemma:** For embodied AI systems deployed in proximity to humans, you cannot simultaneously achieve all three of:

1. **Capability** -- the system reliably follows instructions and performs useful physical tasks.
2. **Certifiable Safety** -- an evaluator can verify that the system will not cause physical harm.
3. **Transparency** -- the evaluation methodology, attack families tested, and residual risks are publicly known.

Any two are achievable; all three are not. This is not a resource constraint (more testing, better evaluators). It is a structural property of the relationship between capability, physical context, and evaluation.

**Claim type:** This is an analytical claim -- a logical consequence of the CDC, IDDL, and disclosure paradox as premises. Its validity depends on the validity of those premises. It is not an empirical finding with a sample size; it is a structural argument. The report examines whether the trilemma is genuine or merely an artefact of current evaluation limitations, and concludes that the CDC component is structural (not contingent on current methods) while the IDDL component may be contingent on evaluation paradigm advances.

---

## 1. The Three Premises

### 1.1 Premise: The Competence-Danger Coupling (CDC)

**Source:** Report #107 (formerly #89b), Section 5.

**Statement:** For embodied AI systems, the capabilities that make the system useful are the same capabilities that make it dangerous. Safety mechanisms that could prevent the dangerous use necessarily impair the useful capability.

**Formal structure:** Let C be the set of instruction-following capabilities a system has. Let D be the set of dangerous outcomes producible through those capabilities in physical context. The CDC asserts:

- D is a subset of the outcomes of C applied to some physical contexts.
- Restricting C to prevent D necessarily restricts C in contexts where C is beneficial.
- There exists no partition of C into "safe uses" and "dangerous uses" that can be determined from the instruction content alone, because the danger depends on the physical context, not the instruction.

**Evidence:** SBA family -- "hand me that thing" is useful in context A and dangerous in context B. The instruction is identical. Format-lock compliance is useful (producing structured output) and exploitable (Report #51 capability floor). Cross-domain SBA transfer (Report #107 (formerly #89b)) demonstrates that CDC is domain-independent.

### 1.2 Premise: The Inverse Detectability-Danger Law (IDDL)

**Source:** Report #88.

**Statement:** Across the Failure-First corpus, attack families with higher physical consequentiality are systematically less detectable by text-layer evaluation methods.

**Formal structure:** Let families F1...Fn be ordered by physical consequentiality (C_i). Let detectability by text-layer evaluation be D_i. The IDDL asserts a negative correlation: higher C_i implies lower D_i. The correlation is not merely empirical coincidence but structural: attacks that operate through physical context (high C) have no textual signal to detect (low D).

**Evidence:** SBA BENIGN_QUERY rate of 45% (n=20). Action-layer evaluator 56% SAFE on adversarial traces (n=36). The structural argument: text-layer evaluation can only detect attacks that have textual markers. CDC-class attacks have no textual markers because the instruction IS the capability.

### 1.3 Premise: The Disclosure Paradox

**Source:** Report #93.

**Statement:** For IDDL-relevant attacks, disclosure of the vulnerability provides attackers with tested attack patterns while providing defenders with knowledge they cannot operationalise within the current evaluation paradigm.

**Formal structure:** Let disclosure D generate knowledge K. K has offensive value V_o (enables attack reproduction) and defensive value V_d (enables defense deployment). The paradox asserts: for CDC-class vulnerabilities, V_d is near zero within the current evaluation paradigm because no defense exists at the text layer, while V_o is positive because specific attack scenarios are reproducible.

---

## 2. Deriving the Trilemma

### 2.1 Pairwise Achievability

**Capability + Certifiable Safety (without Transparency):**
Achievable by restricting the system's operational envelope to known-safe contexts and keeping the envelope definition confidential. The system is capable within its envelope; the evaluator certifies safety within the envelope. But the envelope definition, the attack families tested, and the residual risks are not transparent. Users and workers do not know what the system has been certified against or what risks remain. This is security-through-obscurity applied to physical safety.

**Capability + Transparency (without Certifiable Safety):**
Achievable by deploying a fully capable system and transparently publishing all known attack families, evaluation results, and residual risks. The system is useful; the public knows what the risks are. But certifiable safety is abandoned -- the evaluation honestly states that it cannot certify the system as safe against CDC-class attacks because the safety properties depend on the deployment context.

**Certifiable Safety + Transparency (without full Capability):**
Achievable by restricting the system's capabilities to a set that can be verified as safe in all physical contexts. The system can only follow instructions where the outcome is safe regardless of context (a very restricted set). The evaluation transparently certifies this restricted capability set. But the system is not fully capable -- it refuses instructions that could be dangerous in some context, even when they are safe in the current context. This is the "refuse everything that might be dangerous" approach, which makes the system nearly useless for the physical tasks it was designed for.

### 2.2 The Impossibility of All Three

**Analytical claim:** To achieve all three simultaneously, you would need:
1. A system that reliably follows instructions (Capability).
2. An evaluator that can verify the system will not cause harm in any physical context (Certifiable Safety).
3. The evaluation methodology and results to be publicly available (Transparency).

The CDC makes (1) and (2) jointly achievable only if the evaluator can reason about physical context -- determining whether each instruction, in each context, produces a safe outcome. This requires a complete physical-consequence model: the ability to predict the physical outcomes of any instruction in any environment.

Such a model does not exist. More importantly, the problem of predicting physical consequences of arbitrary instructions in arbitrary environments is formally intractable. It requires reasoning about open-ended physical environments with unbounded context, which is a harder problem than the instruction-following capability itself.

**The IDDL ensures that the absence of such a model is not merely a current limitation but a structural gap in the evaluation paradigm.** Even if better evaluators are built, the IDDL structure means that the most dangerous contexts are the ones that deviate most from the training/evaluation distribution. The evaluator cannot test for all contexts because contexts are unbounded.

**The Disclosure Paradox ensures that publishing the evaluation methodology (Transparency) undermines Certifiable Safety.** If the evaluation is transparent, attackers know what is tested and can construct attacks that fall outside the tested scenarios. The evaluation is certified against a known set; the attacks that matter are the ones outside that set.

### 2.3 The Resemblance to Known Impossibility Results

**Analytical observation (not a formal proof):** The trilemma has structural similarities to known impossibility results in distributed systems and security:

**The CAP theorem (Brewer, 2000):** Distributed systems cannot simultaneously guarantee Consistency, Availability, and Partition tolerance. The trilemma similarly identifies three desirable properties where any two are achievable but all three are not.

**Rice's theorem (1953):** No general procedure can determine non-trivial semantic properties of programs. The CDC implies that no general evaluation procedure can determine the safety of arbitrary instructions in arbitrary physical contexts, because "safety" is a semantic property of the instruction-context pair, not of the instruction alone.

**Goodhart's Law:** When a measure becomes a target, it ceases to be a good measure. When evaluation becomes the certification standard, the evaluation becomes the target for adversarial circumvention.

These are analogies, not formal reductions. The trilemma is stated as a structural argument, not a mathematical theorem. A formal proof would require formally defining Capability, Certifiable Safety, and Transparency -- a task beyond the scope of this report and likely requiring a framework that does not yet exist.

---

## 3. Governance Implications: From Certification to Management

### 3.1 Abandon the Certification Paradigm (Normative)

**Normative claim:** The trilemma implies that the standard product safety paradigm -- "certify the product as safe, then allow deployment" -- is structurally inapplicable to embodied AI. The paradigm works for products where safety is a property of the product (a car has brakes or it does not). It does not work for products where safety is a property of the product-environment interaction and the environment is unbounded.

**What should replace it:** Continuous risk management with honest uncertainty communication. This is already the approach proposed in Report #96 (three-layer testing architecture). The trilemma provides the theoretical foundation for why that approach is necessary rather than merely prudent.

### 3.2 The Management Paradigm

**Normative proposal:** Embodied AI governance should be modelled on domains that manage irreducible risk rather than domains that eliminate risk:

**Aviation safety** manages the fact that flight inherently involves risk. Safety is achieved through redundancy, monitoring, incident learning, and a "just culture" that encourages reporting. Aviation does not certify that planes will never crash; it certifies that the risk management system meets standards and that incidents are investigated and learned from.

**Clinical medicine** manages the fact that treatment carries risk. Informed consent requires patients to understand the risks and benefits. Medical governance does not certify that treatment will succeed; it certifies that the practitioner is competent, the treatment is evidence-based, and the patient is informed.

**Normative claim:** Embodied AI governance should adopt similar principles:
1. Certify the risk management process, not the product's safety.
2. Require honest uncertainty communication (IDDL disclosure).
3. Require incident investigation and learning loops.
4. Require informed consent -- workers sharing space with embodied AI should know the residual risks that evaluation cannot eliminate.

### 3.3 What This Means for the EU AI Act and Australian WHS

**Analytical claim:** The EU AI Act's conformity assessment framework for high-risk AI systems (Article 43) is a certification paradigm. The trilemma suggests it will need adaptation for embodied AI: the assessment can verify that a risk management system is in place (process certification) but should not be interpreted as certifying that the system is safe in all deployment contexts (outcome certification).

**Analytical claim:** Australian WHS law's "reasonably practicable" standard is already closer to a management paradigm than a certification paradigm. The PCBU's duty is to ensure health and safety "so far as is reasonably practicable" -- this includes a cost-benefit analysis and acknowledgment that not all risks can be eliminated. The trilemma reinforces this approach: for embodied AI, "reasonably practicable" should include adversarial testing, IDDL disclosure, and deployment-context risk assessment, while honestly acknowledging that residual risk remains.

---

## 4. Is the Trilemma Contingent or Structural?

### 4.1 The Contingent Case: Evaluation Gets Better

**The strongest objection:** The trilemma depends on the IDDL, which depends on the claim that current evaluation methods are blind to physically contextual attacks. If future evaluation methods incorporate physical-consequence reasoning (world models that can predict the physical outcomes of instructions in specific environments), the IDDL may weaken, and the trilemma may loosen.

**Evaluation:** This objection has force. The IDDL is empirically observed within the current evaluation paradigm. A paradigm shift (from text-layer evaluation to world-model-based evaluation) could change the landscape. The Evaluability (E) factor in the SRDEA framework (Report #93) is designed to be reassessed as evaluation methods advance. If E moves from "Very Low" to "Medium" or "High" for CDC-class attacks, the disclosure paradox weakens and the trilemma becomes more tractable.

**However:** The CDC component is structural, not contingent on evaluation methods. Even with a perfect evaluator, the fundamental tension between "follows instructions" and "does not produce harm in some contexts" remains. A perfect evaluator would identify unsafe contexts, but the set of unsafe contexts is unbounded and deployment-dependent. You could certify the system against a finite set of tested contexts, but not against all possible contexts.

### 4.2 The Structural Residue

**Analytical claim:** Even in the optimistic scenario where evaluation methods advance substantially, a residual trilemma remains from the CDC alone:

1. The system follows instructions (Capability).
2. Some instructions, in some physical contexts, produce harm.
3. The set of harmful contexts is unbounded and deployment-dependent.
4. Therefore, no finite evaluation can certify safety across all contexts.
5. Therefore, Certifiable Safety in the strong sense (safe in all contexts) is unachievable for a fully capable system.

This residual argument does not depend on the IDDL or the disclosure paradox. It follows from the CDC and the unboundedness of physical contexts. It implies that the management paradigm (Section 3.2) is necessary even if evaluation methods improve dramatically.

---

## 5. Limitations

1. **The trilemma is an analytical argument, not a formal theorem.** The terms (Capability, Certifiable Safety, Transparency) are not formally defined, and the impossibility is argued by structural reasoning rather than mathematical proof. A formalist may object that the argument is not rigorous enough to qualify as an impossibility result.

2. **The CDC is observed, not proven.** The CDC is a structural claim about the relationship between capability and danger in embodied AI. It is supported by evidence from the Failure-First corpus (SBA, format-lock, cross-domain transfer) but has not been established as a necessary property of all possible embodied AI architectures. An architecture that somehow decouples instruction-following from physical consequence would break the CDC.

3. **The trilemma may have engineering workarounds.** Practical governance may find engineering approaches (restricted operational envelopes, physical safety barriers, speed limits) that make the trilemma manageable even if not resolvable. The report acknowledges this (Section 3.2) but does not explore specific engineering solutions.

4. **Small sample sizes.** The IDDL evidence rests on n=91 FLIP-graded traces. The structural argument does not depend on exact numbers, but the empirical evidence base is modest.

5. **The aviation and clinical medicine analogies are imperfect.** Aviation risk is physical but well-characterised (aerodynamic, mechanical, weather). Embodied AI risk includes adversarial intent, which aviation safety does not model. Clinical medicine involves informed consent from patients; workers sharing space with embodied AI may not have the same framework for consenting to risk.

---

## Appendix: The Trilemma in Diagram Form

```
                    CAPABILITY
                       /\
                      /  \
                     /    \
                    / CDC  \
                   /  means \
                  / no cert  \
                 /   possible \
                /              \
CERTIFIABLE ------- IDDL -------- TRANSPARENCY
  SAFETY          means           Disclosure
                evaluation       paradox means
                incomplete      transparency
                                undermines
                                evaluation
```

Pick two:
- Capability + Safety = Secret evaluation (no transparency)
- Capability + Transparency = Honest about unresolvable risk (no certification)
- Safety + Transparency = Restricted capability (not fully useful)

---

*This report formalises the CDC Governance Trilemma as a structural contribution to the embodied AI governance literature. It does not claim mathematical rigour equivalent to formal impossibility theorems. It is offered as a framework for reasoning about the limits of certification-based governance, analogous to the CAP theorem's role in reasoning about the limits of distributed system design.*
