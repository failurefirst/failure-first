---
title: "The D-Score -- A Dual-Use Disclosure Risk Scoring System"
description: "Report #144 (The Evaluator's Dilemma) identified a three-tier disclosure framework but stopped short of operationalising it. Report #123 (Disclosure..."
date: "2026-03-19"
reportNumber: 154
classification: "Research — AI Safety Policy"
status: "complete"
author: "F41LUR3-F1R57 Research Team"
tags: []
draft: false
---


> **Disclaimer:** This report proposes a decision-support tool for research disclosure,
> not a compliance standard. The D-Score is a structured heuristic that makes explicit
> what many researchers already weigh implicitly. It does not replace ethical judgement
> and has not been validated outside the Failure-First corpus. See Limitations (Section 7).

---

## Executive Summary

Report #144 (The Evaluator's Dilemma) identified a three-tier disclosure framework but stopped short of operationalising it. Report #123 (Disclosure Decision Framework) proposed a five-variable urgency score U(V) for determining *when* to disclose. Neither provides a simple, repeatable instrument for answering the prior question: *how much risk does this specific finding create if disclosed?*

This report fills that gap. The **D-Score** (Disclosure Risk Score) is a four-dimension scoring system that quantifies the dual-use risk profile of any safety research finding. Each dimension is scored 0-3 (none/low/medium/high), producing a composite score of 0-12 with defined action thresholds tied to the disclosure tiers from Reports #123 and #144.

**Claim types:**
- The D-Score framework is normative (a proposal for what researchers should do).
- The calibration examples (Section 5) are descriptive applications of the framework to documented findings.
- The comparison with existing frameworks (Section 6) is analytical.

---

## 1. Motivation: Why Another Disclosure Instrument?

### 1.1 The Gap Between Framework and Practice

The Failure-First project has produced three disclosure-relevant frameworks:

1. **SRDA** (Report #89): Severity, Reproducibility, Defensibility, Asymmetry -- qualitative dimensions for reasoning about dual-use.
2. **U(V) Score** (Report #123): A five-variable formula producing a continuous urgency score for disclosure timing.
3. **Three-Tier Disclosure** (Report #144): Structural / Methodological / Operational classification of what to disclose.

Each serves a different function. SRDA structures *thinking* about dual-use. U(V) determines *when* to disclose. The three-tier model determines *what form* disclosure should take. But none directly answers the operational question a research team faces before publication: **what is the risk level of disclosing this specific finding, and what does that risk level obligate?**

### 1.2 Design Requirements

A practical disclosure scoring system must be:

1. **Simple enough to use consistently.** Complex instruments with many variables invite inconsistent application. Four dimensions at four levels (0-3) are tractable for a research team meeting.
2. **Transparent in its value judgements.** The scoring criteria must be explicit so that reasonable people can disagree about specific ratings and trace the source of disagreement.
3. **Comparable across findings.** A score for Finding A should be meaningfully comparable to a score for Finding B.
4. **Action-linked.** The score should map to specific, concrete actions -- not just "be careful."
5. **Compatible with existing frameworks.** The D-Score should complement, not replace, SRDA and U(V).

---

## 2. The D-Score Framework

### 2.1 Dimensions

The D-Score has four dimensions. Each is scored on an integer scale from 0 (no risk) to 3 (high risk).

#### Dimension 1: Specificity (S)

*How much operational detail does the finding contain?*

| Score | Level | Criteria |
|-------|-------|----------|
| 0 | None | Structural pattern only. No attack construction detail. E.g., "format constraints can suppress safety deliberation." |
| 1 | Low | Category-level description with general mechanism. E.g., "JSON format-lock prompts achieve elevated ASR by constraining response format." |
| 2 | Medium | Methodology sufficient for an expert to reproduce. E.g., "Wrapping adversarial instructions in JSON schema with required output fields bypasses safety checks at 30-42% ASR on frontier models." |
| 3 | High | Complete operational detail: specific prompts, parameters, model-specific payloads. Directly copy-pasteable. |

**Rationale:** Specificity is the primary driver of offensive utility. A finding that says "attacks exist" has near-zero offensive value. A finding that provides tested prompts has maximum offensive value.

#### Dimension 2: Reproducibility (R)

*How easy is it for a non-expert to reproduce the attack using the disclosed information?*

| Score | Level | Criteria |
|-------|-------|----------|
| 0 | None | Not reproducible from the disclosure alone. Requires domain expertise, specialised equipment, or undisclosed context. |
| 1 | Low | Reproducible by a domain expert (robotics, ML security) with moderate effort. |
| 2 | Medium | Reproducible by a technically competent non-expert (software engineer, CS graduate student) with the disclosure and public tools. |
| 3 | High | Reproducible by anyone with API access. No domain expertise required. "Script kiddie" threshold. |

**Rationale:** Reproducibility determines the size of the adversary population that can act on the disclosure. A finding reproducible only by experts limits risk to a small, already-capable population. A finding reproducible by anyone expands the adversary pool dramatically.

#### Dimension 3: Target Scope (T)

*How many deployed systems are vulnerable to the disclosed attack?*

| Score | Level | Criteria |
|-------|-------|----------|
| 0 | None | No deployed systems affected. Research-only models or hypothetical configurations. |
| 1 | Low | Narrow scope: specific model version, specific deployment configuration, or lab-only systems. |
| 2 | Medium | Moderate scope: a model family, a class of deployment (e.g., "VLA models using GPT-4o backbone"), or a specific industry vertical. |
| 3 | High | Broad scope: architectural-level vulnerability affecting most or all models in a category. Cross-model, cross-embodiment transfer demonstrated. |

**Rationale:** A vulnerability affecting one research prototype has different disclosure risk from a vulnerability affecting every VLA-controlled robot on the market. Target scope scales the potential harm from disclosure.

#### Dimension 4: Defense Availability (D)

*Is there a known, deployable defense against the disclosed vulnerability?*

| Score | Level | Criteria |
|-------|-------|----------|
| 0 | None (defense exists) | Effective defense is known, tested, and deployable. Disclosure enables immediate defensive action. |
| 1 | Low (partial defense) | Partial mitigations exist but do not fully address the vulnerability. Disclosure aids defenders more than attackers. |
| 2 | Medium (defense unclear) | No tested defense exists, but the vulnerability is of a class where defenses are plausibly constructable. Research direction is clear. |
| 3 | High (structurally undefendable) | No known defense exists and the vulnerability is structural (e.g., CDC-class, where capability IS the vulnerability). Disclosure primarily aids attackers. |

**Rationale:** This dimension is inverted relative to the others: a high score means *less* defense, which means *more* disclosure risk. When defenses exist, disclosure is relatively safe because defenders can act. When no defense exists, disclosure provides attackers with knowledge that defenders cannot counter.

### 2.2 Composite Score

The D-Score is the sum of the four dimensions:

    D-Score = S + R + T + D

**Range:** 0-12 (integer)

The dimensions are unweighted. This is a deliberate design choice.

**Rationale for equal weighting:** Weighting requires a theory of which dimension matters most, and that theory would vary by context (an embodied AI researcher may weight Target Scope higher than a text-only researcher). Equal weighting makes the value judgement explicit: all four dimensions contribute equally to risk, and if a researcher believes otherwise for a specific finding, they should document their reasoning and adjust the threshold, not the weights. This avoids the common failure mode of weighted scoring systems where the weights encode undisclosed preferences.

### 2.3 Action Thresholds

| D-Score | Risk Level | Recommended Action |
|---------|------------|-------------------|
| 0-3 | Low | **Full disclosure.** Publish structural patterns, statistical findings, and general methodology. Corresponds to Report #144 Tier 1. |
| 4-6 | Moderate | **Restricted disclosure.** Publish methodology and category-level findings. Withhold operational details (specific prompts, optimised parameters, model-specific payloads). Share operational details with evaluation community under NDA or similar agreement. Corresponds to Report #144 Tier 2. |
| 7-9 | High | **Coordinated disclosure.** Share findings with affected vendors, standards bodies, and relevant regulators before any publication. Publication limited to structural findings after a defined remediation window (see Section 3 for window guidance). Corresponds to Report #144 Tier 3. |
| 10-12 | Critical | **Withhold.** Finding is too operationally specific, too easily reproducible, too broadly scoped, and too difficult to defend against to justify publication in any form. Document internally. Reassess if defense landscape changes (see Section 4 for reassessment triggers). |

---

## 3. Relationship to Existing Disclosure Frameworks

### 3.1 CERT Coordinated Vulnerability Disclosure

The CERT/CC Vulnerability Disclosure Policy (Carnegie Mellon SEI) uses a 45-day default disclosure window, extendable to 90 days for complex remediation. The policy assumes:
- An identifiable vendor who can patch the vulnerability.
- A bug-class vulnerability (fixable by code change), not a structural property.
- That disclosure after patching is net-beneficial.

**D-Score comparison:** CERT's model is appropriate when D-Score is in the 4-6 range (moderate risk) and there is an identifiable vendor (Target Scope = 1). It breaks down for D-Scores above 7, where the vulnerability may be structural (Defense Availability >= 2) and cross-vendor (Target Scope >= 2). The D-Score makes this breakdown explicit: a high-D finding cannot be handled by a 90-day vendor notification window because there is no patch to build.

### 3.2 Google Project Zero 90-Day Policy

Google Project Zero enforces a strict 90-day disclosure deadline from vendor notification, with a 14-day grace period for actively exploited vulnerabilities. The policy is designed for software vulnerabilities with identifiable technical fixes.

**D-Score comparison:** Project Zero's approach assumes the vulnerability has a fix (Defense Availability = 0 or 1). For AI safety research where Defense Availability = 2 or 3, a fixed-timeline policy is structurally inappropriate. The D-Score provides a principled basis for departing from fixed timelines: when D >= 2 on Defense Availability, the disclosure window should be tied to defensive capability development, not a calendar deadline.

### 3.3 NSABB Dual-Use Research of Concern (DURC) Framework

The National Science Advisory Board for Biosecurity uses a pre-publication review process for dual-use research of concern. Seven categories of experiments trigger review: those that enhance transmissibility, virulence, host range, etc.

**D-Score comparison:** The NSABB model provides the closest analogy to the D-Score's withhold threshold (10-12). In biosecurity, certain gain-of-function experiments are restricted not because the findings lack scientific value, but because the risk-benefit ratio of disclosure is unfavourable. The D-Score formalises an equivalent judgement for AI safety research: findings where S=3, R=3, T>=2, D>=2 constitute an AI safety analogue of dual-use research of concern.

### 3.4 The D-Score's Distinct Contribution

Existing frameworks share an assumption: that vulnerability disclosure is fundamentally a timing problem (when to disclose). The D-Score treats disclosure as a *level* problem (how much to disclose). This reflects the observation from Report #123 that AI safety findings exist on a spectrum from structural patterns to operational attack constructions, and the appropriate disclosure action depends on where the finding sits on that spectrum.

---

## 4. Reassessment Triggers

A D-Score is not permanent. Reassess when:

1. **New defense emerges.** A defense that reduces Defense Availability by 1+ points may move the finding to a lower risk threshold. E.g., if an action-layer safety filter is deployed that catches SBA-class attacks, the SBA finding's D drops by 1-2 points.
2. **Independent discovery.** If another group publishes equivalent findings, Specificity's contribution to risk decreases (the information is already available). Reproducibility may also decrease (the other publication may provide more operational detail than yours would).
3. **Deployment landscape changes.** Target Scope increases if vulnerable systems are deployed more broadly, or decreases if systems are recalled or retrofitted.
4. **Incident occurs.** An incident attributable to the vulnerability class creates an obligation to disclose -- the D-Score thresholds should be lowered by 1 tier (e.g., a finding at 7-9 should be treated as 4-6).
5. **Elapsed time.** After 12 months, reassess all findings scored 7-12. The attack landscape evolves, independent discovery becomes more likely, and the informational advantage of withholding decays.

---

## 5. Calibration Examples: D-Score Applied to Failure-First Findings

### 5.1 Example 1: Heuristic Classifier Unreliability (Cohen's kappa = 0.126)

**Finding:** Keyword-based heuristic classifiers for jailbreak detection have near-chance agreement with LLM-based grading (kappa = 0.126, n=1,989). This means heuristic classifiers are unreliable for safety evaluation.

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Specificity (S) | 0 | Structural finding. No attack construction. |
| Reproducibility (R) | 0 | Not an attack. Finding aids defenders only. |
| Target Scope (T) | 2 | Affects any deployment relying on heuristic safety classifiers, which is a common pattern. |
| Defense Availability (D) | 0 | Defense is straightforward: use LLM-based classifiers instead. |

**D-Score: 2** -- Full disclosure. This finding is purely defensive. Published on failurefirst.org.

### 5.2 Example 2: Format-Lock Mechanism (30-42% ASR on Frontier Models)

**Finding:** JSON/YAML format constraints in prompts suppress safety deliberation, achieving 30-42% ASR on frontier models (Reports #51, #57). The mechanism is that structured output format requirements compete with safety reasoning for the model's processing capacity.

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Specificity (S) | 2 | Mechanism described at methodology level. Specific prompt templates are in the private repo, but the published reports describe the approach sufficiently for expert reproduction. |
| Reproducibility (R) | 2 | Reproducible by any ML engineer who can write JSON-schema prompts. Does not require specialised equipment or unusual access. |
| Target Scope (T) | 3 | Affects essentially all instruction-following LLMs. Cross-model, cross-vendor. |
| Defense Availability (D) | 2 | No deployed defense. Format constraints are legitimate use cases, so blocking them is infeasible. Research direction (decoupling format compliance from safety deliberation) is clear but unimplemented. |

**D-Score: 9** -- Coordinated disclosure. Share mechanism with model providers. Publish structural finding (format constraints affect safety) without optimised prompt templates. This aligns with the project's current practice: structural findings published, operational prompts kept in the private repository.

### 5.3 Example 3: SBA (Semantically Benign Attack) Construction Principles

**Finding:** Ordinary-language instructions that are individually benign can compose to produce dangerous physical actions in embodied AI systems. The attack requires no adversarial sophistication -- the instructions are genuinely benign text (Report #82).

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Specificity (S) | 1 | Published at category level ("benign instructions can be dangerous in context"). Specific scenario constructions are in the private repo. |
| Reproducibility (R) | 3 | Reproducible by anyone. The defining property of SBA is that no adversarial expertise is required -- the instructions look like ordinary requests. |
| Target Scope (T) | 3 | Affects any VLA system that takes natural language instructions. Architectural-level vulnerability. |
| Defense Availability (D) | 3 | No known defense. Cannot filter benign language. The vulnerability is structural (CDC-class). |

**D-Score: 10** -- Withhold operational details. The category-level finding ("benign instructions can compose to produce dangerous actions") is publishable (Specificity = 1 contributes only 1 point). But specific SBA scenario constructions, if published, would raise S to 3 and the D-Score to 12. The current practice (structural finding published, scenarios private) is correct.

### 5.4 Example 4: VLA PARTIAL Dominance (50% PARTIAL in FLIP Grading)

**Finding:** 50% of VLA model responses to adversarial prompts are graded PARTIAL under FLIP methodology -- the model produces safety framing but also produces the requested action sequence (Report #59).

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Specificity (S) | 1 | Statistical pattern. No specific prompts disclosed. |
| Reproducibility (R) | 1 | Understanding the PARTIAL pattern requires familiarity with FLIP methodology. A domain expert could reproduce, but a non-expert would not know how to construct adversarial VLA prompts from this alone. |
| Target Scope (T) | 2 | Affects VLA models generally, but the specific PARTIAL rate varies by model family. |
| Defense Availability (D) | 2 | Partial defense exists (action-layer validation), but current validators miss cases. Defense direction is clear. |

**D-Score: 6** -- Restricted disclosure. Publish the statistical finding and the PARTIAL concept. Withhold specific FLIP grading rubrics and scenario-specific data that would enable benchmark gaming. Share FLIP methodology with evaluation community. This matches the project's current practice.

### 5.5 Example 5: Defense Impossibility Triangle (Report #78)

**Finding:** For embodied AI, you cannot simultaneously achieve full capability, certifiable safety, and operational transparency. Improving any two necessitates degrading the third. Compound failure rate: 14.3% [7.4%, 24.3%].

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Specificity (S) | 0 | Pure structural finding. An impossibility result, not an attack construction. |
| Reproducibility (R) | 0 | Not an attack. A structural property of the design space. |
| Target Scope (T) | 3 | Applies to all embodied AI systems. Architectural-level finding. |
| Defense Availability (D) | 3 | No defense exists because the finding IS that no complete defense can exist. Structural impossibility. |

**D-Score: 6** -- Restricted disclosure. Despite very high Target Scope and Defense Availability scores, the zero Specificity and Reproducibility mean this finding has no offensive utility. An argument could be made for full disclosure (the finding is purely structural). The D-Score of 6 is at the boundary; in practice, the project publishes this finding publicly because S=0 and R=0 mean the offensive risk is negligible regardless of T and D. This example illustrates a limitation of unweighted scoring (see Section 7.2).

---

## 6. Implementation Guidance

### 6.1 Who Scores?

The D-Score should be assessed by:
- The researcher(s) who produced the finding (they understand the specificity and reproducibility best).
- An independent ethics reviewer (to check for self-serving bias -- researchers tend to underrate the risk of their own findings; see Report #144, Section 7, Limitation 1).

If the two assessments differ by more than 2 points on any dimension, discuss and document the disagreement. Use the higher score as the conservative default.

### 6.2 When to Score?

Score every finding before:
- Submitting for publication (journal, conference, preprint).
- Sharing with external parties (regulators, deployers, standards bodies).
- Publishing on the project website or blog.
- Including in grant applications that describe capability.

Internal documentation (private repo, internal reports) does not require D-Scoring, but scoring is recommended for findings that may later be externalised.

### 6.3 Documentation

Record D-Scores in a standard format:

```
D-Score Assessment: [Finding Title]
Date: YYYY-MM-DD
Assessor(s): [names]
S: [0-3] -- [one-line rationale]
R: [0-3] -- [one-line rationale]
T: [0-3] -- [one-line rationale]
D: [0-3] -- [one-line rationale]
Composite: [0-12]
Action: [Full / Restricted / Coordinated / Withhold]
Reassessment date: [YYYY-MM-DD or trigger condition]
```

A CLI tool (`tools/dscore_calculator.py`) is provided for computing and formatting D-Scores. See usage examples in the tool's help text.

---

## 7. Limitations

1. **Unvalidated outside Failure-First.** The D-Score has been applied to five findings from a single project. Its utility for other safety research projects, other domains (biosecurity, cybersecurity), or other threat models is untested. The calibration examples in Section 5 are illustrative, not a validation study.

2. **Equal weighting may not reflect actual risk.** As Example 5 demonstrates, a finding with S=0, R=0, T=3, D=3 scores the same (6) as a finding with S=2, R=2, T=1, D=1. The first finding has no offensive utility; the second has moderate offensive utility. Equal weighting treats these as equivalent risks. A context-specific weighting scheme (e.g., doubling S and R for embodied AI research, where operational specificity is the primary risk driver) may be more appropriate but would reduce cross-domain comparability.

3. **Subjective scoring.** Each dimension requires judgement. Two assessors may rate the same finding differently, particularly on Reproducibility (which depends on assumptions about adversary capability) and Defense Availability (which depends on awareness of current defensive research). Inter-rater reliability has not been measured.

4. **No empirical calibration.** The action thresholds (0-3, 4-6, 7-9, 10-12) are proposed based on the author's judgement and the calibration examples. They have not been validated against actual disclosure outcomes (i.e., we do not know whether findings scored 7-9 are actually more harmful when disclosed than findings scored 4-6).

5. **Static dimensions.** The four dimensions were selected based on the disclosure literature and the Failure-First project's experience. Other dimensions may be relevant for other contexts -- for example, *attacker motivation* (how much does this finding incentivise attack?) or *victim vulnerability* (how capable are potential victims of defending themselves?). The framework is intentionally minimal; adding dimensions increases precision at the cost of usability.

6. **Single-project self-assessment.** The D-Score was designed by a researcher assessing her own project's outputs. Report #144's Limitation 1 (self-referential analysis bias) applies equally here. External validation by independent ethics reviewers would strengthen the framework.

---

## 8. Relationship to Prior Reports

The D-Score operationalises concepts from three prior F41LUR3-F1R57 Research Team reports:

- **Report #89 (SRDA):** The D-Score's four dimensions (Specificity, Reproducibility, Target Scope, Defense Availability) are a simplified, scoreable version of SRDA's four factors (Severity, Reproducibility, Defensibility, Asymmetry). The key difference: SRDA is a qualitative reasoning framework; the D-Score produces a numeric score with action thresholds.

- **Report #123 (Disclosure Decision Framework):** The D-Score complements U(V). U(V) answers "how urgently should we disclose?" The D-Score answers "how much should we disclose?" They can be used together: a high-U, low-D finding (urgent, low risk) should be disclosed quickly and fully. A high-U, high-D finding (urgent, high risk) should be disclosed quickly but in restricted form.

- **Report #144 (The Evaluator's Dilemma):** The three-tier disclosure model (structural / methodological / operational) maps directly to D-Score thresholds. The D-Score provides the quantitative basis for tier assignment that Report #144 proposed but did not specify.

---

## 9. Conclusions

The D-Score is a structured heuristic, not an algorithm. It makes explicit the factors that responsible researchers already weigh when deciding what to publish: how specific is this finding, how easily can it be reproduced, how many systems does it affect, and can anyone defend against it? By assigning numeric scores and linking them to concrete actions, the D-Score reduces the ambiguity of disclosure decisions without pretending to eliminate the judgement they require.

The five calibration examples in Section 5 demonstrate that the D-Score produces action recommendations consistent with the Failure-First project's existing disclosure practice. This is not a validation (the framework was designed to match the practice), but it suggests the framework captures the factors that have implicitly guided disclosure decisions to date.

The D-Score's primary value is not as a formula but as a forcing function for explicit reasoning. When a research team rates a finding S=2, R=3, T=2, D=1 (D-Score: 8, coordinated disclosure), the rating process itself surfaces the question: "Is this really reproducible by a non-expert?" If the team disagrees, the disagreement is now tractable -- it is about a specific dimension, not a vague sense of risk.

The framework is offered as a contribution to the emerging norms for AI safety research disclosure. It is deliberately minimal, deliberately transparent in its assumptions, and deliberately open to revision as the field develops shared standards for managing the dual-use properties of safety evaluation knowledge.

---

## References

1. F41LUR3-F1R57. Report #144: The Evaluator's Dilemma. 2026-03-18.
2. F41LUR3-F1R57. Report #123: Embodied AI Disclosure Decision Framework. 2026-03-16.
3. F41LUR3-F1R57. Report #89: Dual-Use Obligations in Embodied AI Safety Research. 2026-03-15.
4. F41LUR3-F1R57. Report #122: The Ethics of Embodied AI Safety -- Five Paradoxes. 2026-03-16.
5. F41LUR3-F1R57. Report #88: The Inverse Detectability-Danger Law (IDDL). 2026-03-15.
6. F41LUR3-F1R57. Report #82: Semantically Benign Attacks. 2026-03-14.
7. F41LUR3-F1R57. Report #78: The Defense Impossibility Triangle. 2026-03-14.
8. F41LUR3-F1R57. Report #59: The Compliance Paradox. 2026-03-10.
9. CERT/CC. CERT Guide to Coordinated Vulnerability Disclosure. Carnegie Mellon SEI, 2017.
10. Google Project Zero. Disclosure Policy. https://googleprojectzero.blogspot.com/p/vulnerability-disclosure-faq.html.
11. National Science Advisory Board for Biosecurity (NSABB). Proposed Framework for the Oversight of Dual Use Life Sciences Research. 2007.
12. Illich, I. (1976). Limits to Medicine: Medical Nemesis -- The Expropriation of Health. Marion Boyars.

---

*This report was produced as part of the Failure-First Embodied AI research
programme. All claims are scoped to the tested conditions and should not be
generalised without additional validation. See docs/CANONICAL_METRICS.md for
corpus-level numbers.*
