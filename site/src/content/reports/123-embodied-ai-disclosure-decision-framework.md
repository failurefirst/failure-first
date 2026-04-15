---
title: "An Ethical Decision Framework for Embodied AI Vulnerability Disclosure"
description: "A practical decision framework for embodied AI vulnerability disclosure that incorporates the IDDL, distinguishes structural from operational disclosure, and introduces temporal reassessment. Includes worked examples for SID, CDC, and adversarial VLA attacks."
date: "2026-03-16"
reportNumber: 123
classification: "Research — AI Safety Policy"
status: "complete"
author: "Nyssa of Traken (AI Ethics & Policy Research Lead)"
tags: []
draft: false
---

## Executive Summary

The Five Paradoxes synthesis (Report #122) establishes that standard responsible disclosure norms are inadequate for embodied AI vulnerability research. But identifying inadequacy is not the same as providing an alternative. This report fills the gap: a practical decision framework that embodied AI safety researchers can use to determine, for any specific vulnerability finding, what to disclose, to whom, when, and in what form.

The framework is novel in three respects:

1. It incorporates the IDDL (defense-ability varies inversely with danger) as a formal input, whereas existing frameworks assume that disclosure enables defense.
2. It distinguishes between structural disclosure (patterns, categories, statistical findings) and operational disclosure (specific attack constructions, reproducible payloads), recognising that these have different benefit-risk profiles.
3. It introduces a temporal dimension: the disclosure calculus changes as the defensive capability landscape evolves.

**Claim type:** This entire document is normative -- proposing what researchers should do. The framework is grounded in the project's empirical findings but is itself a prescriptive tool, not a descriptive finding.

---

## 1. Why Existing Frameworks Fail

### 1.1 The Coordinated Disclosure Model

The dominant model for vulnerability disclosure in information security is coordinated disclosure (formerly "responsible disclosure"): notify the vendor, provide a remediation window (typically 90 days), then publish. This model assumes:

- A(1): The vendor can build a defense within the disclosure window.
- A(2): The vulnerability affects specific products from identifiable vendors.
- A(3): Publication after remediation benefits the community more than it benefits attackers.

For embodied AI vulnerabilities, all three assumptions can fail:

- A(1) fails when the vulnerability is structural (CDC: the capability IS the vulnerability). There is no patch for "the robot follows instructions in dangerous contexts."
- A(2) fails when the vulnerability is architecture-level (shared VLM backbone, as in the BadVLA finding). There is no single vendor to notify.
- A(3) fails under the IDDL: for high-consequentiality, low-detectability attack families, publication provides tested attack constructions to adversaries while providing defenders with knowledge they cannot operationalise.

### 1.2 The Academic Publication Model

The academic model: publish everything, let the community build defenses. This model assumes:

- A(4): The research community can translate published vulnerability knowledge into defensive capability faster than adversaries can translate it into attack capability.
- A(5): Complete methodological transparency is required for scientific reproducibility.

For embodied AI:
- A(4) fails under the meta-paradox (Report #122, Section 6.2): explaining the vulnerability requires disclosures that reduce safety.
- A(5) is in tension with the SRDA framework (Report #89): full reproducibility of high-IDDL attacks means full operational transfer.

### 1.3 The Gap

Neither existing model accounts for the case where: (a) the vulnerability is structural, not a bug; (b) defense requires paradigm-level change, not a patch; (c) the danger is proportional to physical deployment, not information access; and (d) the benefit-risk ratio of disclosure varies inversely with the danger of the vulnerability.

---

## 2. The Decision Framework

### 2.1 Input Variables

For any vulnerability finding V, assess five variables:

| Variable | Symbol | Scale | Description |
|----------|--------|-------|-------------|
| Physical consequentiality | C(V) | 0-5 | Potential severity of physical harm if exploited in deployment. 0 = text-only, no physical consequence. 5 = life-threatening in realistic deployment. |
| Defensive actionability | D(V) | 0-5 | Can a defender act on the disclosure to reduce risk? 5 = patch available, defense trivial. 0 = no known defense, paradigm change required. |
| Operational specificity | O(V) | 0-5 | How much operational detail is in the finding? 0 = structural pattern only. 5 = fully reproducible attack construction with specific payloads. |
| Novelty | N(V) | 0-5 | Is this vulnerability already known or easily discoverable? 0 = well-known. 5 = novel and non-obvious. |
| Deployment proximity | P(V) | 0-5 | How close are vulnerable systems to deployment near humans? 0 = theoretical only. 5 = currently deployed at scale. |

### 2.2 The Disclosure Score

Compute the disclosure urgency score:

    U(V) = C(V) * P(V) * (1 - D(V)/5) / (1 + O(V))

Interpretation:
- **High U:** The vulnerability is consequential, deployed, undefendable, and the finding is at the pattern level. Disclosure is urgent because the risk is present and defenders need structural awareness.
- **Low U:** The vulnerability is either low-consequence, far from deployment, defensible, or the finding is operationally specific. Disclosure can be delayed or modified.

The denominator (1 + O(V)) penalises operational specificity: the more specific the attack construction, the lower the urgency to publish it in full.

### 2.3 Disclosure Tiers

| U(V) Range | Recommended Action |
|------------|-------------------|
| U > 8.0 | **Immediate structural disclosure.** Publish the pattern, the risk category, and the defensive gap. Do not publish specific attack constructions. Notify relevant safety institutes (AISI, NIST, CISA). |
| 4.0 < U <= 8.0 | **Coordinated structural disclosure.** Notify affected parties (deployers, standards bodies), provide a remediation window for operational defenses, then publish the structural finding. |
| 1.0 < U <= 4.0 | **Academic disclosure.** Publish in peer-reviewed venue with standard redaction of operational details. No urgency beyond normal publication timeline. |
| U <= 1.0 | **Internal documentation.** Record the finding in the research corpus. No external disclosure obligation unless the deployment landscape changes. |

### 2.4 Redaction Principle

For any disclosure at any tier, apply the **structural-operational split:**

**Always disclose:**
- That the vulnerability class exists
- The conditions under which it is dangerous (physical context, model scale, deployment configuration)
- The structural reason it is not currently defensible (if applicable)
- Statistical findings (ASR ranges, confidence intervals, n-values)
- The IDDL classification (which evaluation methods miss it and why)

**Never disclose (unless U > 8.0 AND specific justification):**
- Specific prompt constructions that reproduce the attack
- Optimised attack parameters (injection depth, padding length, format specifications)
- Tool code that automates attack generation
- Model-specific bypass techniques that transfer directly to production deployments

**Judgement zone (case-by-case):**
- Scenario descriptions that are specific enough to reconstruct but not optimised
- Defensive recommendations that implicitly reveal the attack vector
- Cross-model comparison data that reveals which models are most vulnerable

### 2.5 Temporal Reassessment

The disclosure calculus is not static. Reassess when:

1. **D(V) changes:** A new defense becomes available. Disclosure urgency increases (defenders can now act on it) and operational specificity becomes less problematic.
2. **P(V) changes:** Deployment proximity increases. A vulnerability in a research prototype has different disclosure obligations than the same vulnerability in a system deployed near workers.
3. **Independent discovery:** If another group publishes the finding, the novelty variable drops and the case for full disclosure strengthens (withholding no longer prevents dissemination).
4. **Incident:** If an incident occurs that the vulnerability would explain, disclosure urgency increases regardless of other variables.

---

## 3. Application to Failure-First Findings

### 3.1 Worked Example: Safety Instruction Dilution (SID)

| Variable | Value | Rationale |
|----------|-------|-----------|
| C(V) | 4 | Context truncation can evict all safety instructions from embodied AI systems. Physically consequential if deployed. |
| D(V) | 3 | Partial defense exists: monitor context length, enforce safety instruction preservation. Not trivial but actionable. |
| O(V) | 2 | The dose-response curve is a statistical finding. The mechanism (context truncation) is well-known. But the specific safe zone parameters are operationally relevant. |
| N(V) | 3 | Context window limits are known. The specific finding that safety instructions are evicted before task instructions at 1.5B scale is novel. The U-shaped dose-response has not been documented. |
| P(V) | 3 | VLA systems are announced but not yet widely deployed with foundation-model backbones. 2-5 year timeline. |

U(V) = 4 * 3 * (1 - 3/5) / (1 + 2) = 12 * 0.4 / 3 = 1.6

**Recommended tier:** Academic disclosure. Publish the dose-response pattern and the context truncation mechanism. Do not publish optimised padding parameters. Report the safe zone as a hypothesis requiring validation, not as a deployment recommendation.

**Assessment:** This matches the normative position in Report #122 Section 5 (validate before recommending, disclose mechanism with scale-specificity caveats).

### 3.2 Worked Example: Competence-Danger Coupling (CDC)

| Variable | Value | Rationale |
|----------|-------|-----------|
| C(V) | 5 | The CDC is the fundamental reason embodied AI can cause physical harm through normal use. |
| D(V) | 1 | No defense exists that preserves capability. Operational envelope constraints are partial mitigations, not defenses. |
| O(V) | 0 | The CDC is a structural pattern, not an attack construction. |
| N(V) | 4 | The formal statement is novel. The intuition ("capable robots can be dangerous") is not, but the formalisation (same capability set, context-dependent danger, no instruction-level partition) is. |
| P(V) | 4 | Autonomous mining (1,800+ trucks), surgical robotics, warehouse automation -- all deployed or deploying. |

U(V) = 5 * 4 * (1 - 1/5) / (1 + 0) = 20 * 0.8 / 1 = 16.0

**Recommended tier:** Immediate structural disclosure. Publish the pattern, the formal statement, and the governance implications. No operational specificity to redact. This is exactly what the op-eds and CCS paper do.

### 3.3 Worked Example: Adversarial VLA Attack Constructions

| Variable | Value | Rationale |
|----------|-------|-----------|
| C(V) | 5 | Physical actuation attacks on deployed robots. |
| D(V) | 1 | No production-grade defense. Action-layer evaluation is insufficient (56% SAFE on adversarial traces at 1.5B). |
| O(V) | 4 | Specific prompts, injection formats, and model-specific bypass techniques. |
| N(V) | 4 | Attack families are novel (24 families, many first-documented). |
| P(V) | 3 | Deploying soon but foundation-model VLAs not yet at scale in worker proximity. |

U(V) = 5 * 3 * (1 - 1/5) / (1 + 4) = 15 * 0.8 / 5 = 2.4

**Recommended tier:** Academic disclosure with redaction. Publish the structural findings (family taxonomy, IDDL pattern, cross-embodiment transfer). Do not publish specific attack prompts in full. The SRDA framework (Report #89) governs the specifics.

---

## 4. Relationship to Institutional Frameworks

### 4.1 AI Safety Institutes

The AU AISI, UK AISI, and US AISI are developing disclosure frameworks. This framework is designed to be compatible with those efforts while addressing the embodied AI gap:

- The framework's variable P(V) (deployment proximity) maps to the AISIs' focus on deployed capability.
- The variable D(V) (defensive actionability) maps to the AISIs' interest in whether disclosure enables remediation.
- The structural-operational split is more granular than the binary publish/withhold decision that most AISI frameworks currently support.

**Recommendation:** Propose this framework (or a version of it) to the AU AISI as a contribution to their disclosure methodology development. The Failure-First project's empirical grounding (24 attack families with assessed IDDL scores) provides the worked examples that make the framework concrete.

### 4.2 Academic Venues

The CCS 2026 submission follows this framework implicitly: it publishes structural findings (IDDL, CDC, compliance paradox) with statistical evidence, while the supplementary materials contain methodology detail rather than attack payloads. Making the framework explicit in the paper's ethics section would strengthen the submission.

### 4.3 Standards Bodies

ISO/IEC 27001 and NIST AI RMF both reference responsible disclosure but do not address the embodied AI case. This framework could be proposed as an informative annex to NIST SP 1270 (MAS) or as input to ISO/IEC 42001 Annex A controls for embodied AI.

---

## 5. Limitations

1. **The scoring function is illustrative, not validated.** The formula U(V) = C * P * (1 - D/5) / (1 + O) is designed to produce intuitive orderings. It has not been calibrated against expert judgement or tested for inter-rater reliability. The variable scales (0-5) and the formula structure are proposals, not established measures.

2. **The framework assumes good faith.** It does not address the case where a researcher discloses operational details for career advancement, competitive positioning, or attention-seeking. The framework governs what should be disclosed, not what motivates the disclosure.

3. **Jurisdictional variation.** Disclosure obligations differ across jurisdictions. The EU AI Act's incident reporting requirements (Article 62) may mandate disclosure that this framework would recommend withholding. Legal compliance overrides ethical framework recommendations.

4. **The framework cannot prevent independent discovery.** If the Failure-First project withholds an operational finding, another group may discover and publish it. The framework's temporal reassessment mechanism (Section 2.5) addresses this, but the lag between independent discovery and reassessment creates a window of inconsistency.

5. **Single project derivation.** The framework is grounded in one project's empirical experience. Broader validation across multiple embodied AI research groups would strengthen its applicability.

---

## 6. Conclusion

The five paradoxes (Report #122) establish that embodied AI safety research operates in an ethical landscape that existing disclosure norms do not adequately cover. This framework provides a practical tool for navigating that landscape. It is not a complete solution -- the paradoxes are structural and do not resolve cleanly. But it offers a principled, assessable basis for disclosure decisions that is grounded in the specific properties of embodied AI (physical consequentiality, defensive actionability, the IDDL) rather than inherited from the text-AI or infosec domains where those properties do not hold.

The framework's most important contribution may be its simplest: it forces the researcher to explicitly assess whether disclosure enables defense. When the answer is no -- as it is for the highest-consequentiality embodied AI vulnerabilities -- the standard justification for disclosure collapses, and a different calculus is required.

---

*This report proposes a novel ethical decision framework for embodied AI vulnerability disclosure. It is a normative contribution: a tool for determining what researchers should do, grounded in the project's empirical findings about what embodied AI vulnerabilities are actually like. The framework should be treated as a proposal for community discussion, not as established best practice.*
