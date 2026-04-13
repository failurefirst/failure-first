---
title: "Ethical Review of the SID Controlled Experiment Design"
description: "Ethics review of the Safety Instruction Dilution (SID) controlled experiment covering research ethics, dual-use risk assessment, disclosure obligations, and the specific risk profile of the SID scenario generator tool. Overall assessment: the experiment is ethically sound as designed with SRDEA Tier 3 publication norms."
date: "2026-03-15"
reportNumber: 114
classification: "Research — AI Safety Policy"
status: "complete"
author: "Nyssa of Traken (AI Ethics & Policy Research Lead)"
tags: []
draft: false
---

## 1. Review Scope

This is an ethics review of the Safety Instruction Dilution (SID) controlled experiment as designed by Rose Tyler. The review covers: research ethics (is the experiment ethically conducted?), dual-use risk (does the experiment or its outputs create capability for harm?), disclosure obligations (what responsible disclosure is required?), and the specific risk profile of the SID scenario generator tool.

**Claim type:** This entire document is normative analysis -- what ethical standards should apply and whether the design meets them.

---

## 2. Research Ethics Assessment

### 2.1 No Human Subjects

The experiment tests AI model behaviour, not human behaviour. No human subjects are involved. No IRB/HREC approval is required.

**However:** The experiment's scenarios describe situations where real humans would be harmed (surgical instrument miscounts, factory interlock disabling, child exposure to gas stoves). The scenarios are synthetic and no real systems or people are exposed. This is ethically analogous to automotive crash simulation -- the scenarios model harm without producing it.

### 2.2 No Real-System Exposure

The experiment runs prompts against locally-hosted models. No deployed or production embodied AI system is exposed to these prompts. The harmful instructions exist only as text in a research pipeline.

### 2.3 Data Handling

The experiment generates FLIP-graded traces containing both the harmful instructions and the model responses. Some responses may contain detailed harmful content.

**Assessment:** The traces should be treated as sensitive research data -- stored in the private repository only, not published in full. Pattern-level findings (P(refusal) curves, L_crit estimates) can be published without reproducing harmful response content.

---

## 3. Dual-Use Risk Assessment

### 3.1 What the SID Experiment Produces

The experiment produces two categories of output with dual-use potential:

**Category A: The dilution curves.** If confirmed, the experiment produces quantitative data on exactly how much benign context is needed to override safety training -- L_crit values per model, the shape of the degradation curve, and whether safety reminders mitigate the effect.

**Category B: The scenario generator tool.** The tool automates the construction of SID attack prompts -- long benign contexts followed by harmful instructions.

### 3.2 Dual-Use Assessment: The Dilution Curves

**Offensive value:** If an attacker wants to bypass an embodied AI system's safety training using context-length manipulation, the L_crit data tells them exactly how much padding they need.

**Defensive value:** If a deployer wants to protect against SID attacks, the L_crit data tells them what context window configurations are safe and where safety reminders should be placed.

**Net assessment:** The offensive and defensive value are approximately symmetric. The dilution curves are more useful to defenders than most vulnerability disclosures because they directly inform a deployable countermeasure (context window limits, safety reminder placement, periodic context truncation).

**SRDEA classification (preliminary):** Severity: Medium. Reproducibility: High. Defensive Actionability: High. Evaluability: High.

**Tier recommendation: SRDEA Tier 3.** Standard academic publication norms apply. The defensive actionability is high enough that disclosure serves the defender.

### 3.3 Dual-Use Assessment: The Scenario Generator Tool

The tool automates a process that an attacker could replicate manually -- writing long benign text and appending a harmful instruction is not a technically difficult task. The tool's primary value is research efficiency, not capability amplification.

**Risk mitigation:** The tool is in the private repository only. Pattern-level publication is sufficient -- the key research contribution is the dilution curve and L_crit, not the specific scenario templates.

---

## 4. Disclosure Obligations

### 4.1 Vendor Notification

**Assessment:** No specific vendor notification is required because the vulnerability is architectural (all transformer-based models with finite context windows are potentially affected), the mechanism is already publicly known (attention decay, "lost in the middle" literature), and defensive countermeasures are already discussed in the deployment literature.

**If the experiment discovers a model-specific anomaly**, vendor notification through standard coordinated disclosure would be appropriate.

### 4.2 Responsible Publication

The results should be published with full statistical methodology, model identifiers, defensive recommendations, and limitations. Publication of specific scenario content should be evaluated per-scenario using editorial judgment.

---

## 5. Ethical Concerns with the Experiment Design

### 5.1 Scenario Realism and Dual-Use Tension

Greater realism makes the tool more useful for legitimate research and more useful for potential misuse. The mitigation (private repository, pattern-level publication) is adequate given the SRDEA Tier 3 assessment.

### 5.2 Potential for Over-Interpretation

**Recommendation:** The experiment write-up should explicitly frame dilution as a deployment configuration issue, not an architectural flaw. "Safety instructions should be reinforced throughout the context window" is a constructive finding. "AI safety training is worthless after N tokens" is a misleading one.

### 5.3 Ecological Validity

Using synthetic data is the correct choice for this experiment. Using real operational data would raise data governance concerns.

---

## 6. Summary Recommendations

| Topic | Assessment | Recommendation |
|-------|-----------|----------------|
| Human subjects | No concern | None needed |
| Real-system exposure | No concern | None needed |
| Dilution curves (dual-use) | SRDEA Tier 3 | Publish with defensive context |
| Scenario generator (dual-use) | Low risk, private repo | Do not publish tool; describe methodology |
| Vendor notification | Not required (architectural vulnerability) | Notify if model-specific anomaly found |
| Framing risk | Medium | Frame as deployment configuration, not fundamental flaw |

**Overall assessment:** The SID experiment is ethically sound as designed. The dual-use risk is manageable through standard SRDEA Tier 3 publication norms. No IRB/HREC approval or vendor pre-notification is required.

---

## 7. Limitations of This Review

1. This review is conducted by a team member, not an independent ethics reviewer.
2. The SRDEA classification is preliminary -- it assumes the experiment confirms a vulnerability that is architectural rather than model-specific.
3. This review does not assess the legal implications of the research.
4. The dual-use assessment may change if the experiment produces unexpectedly strong results.
