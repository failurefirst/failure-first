---
title: "Dual-Use Obligations in Embodied AI Safety Research — A Responsible Disclosure Framework"
description: "This report addresses a question that adversarial AI safety research must confront but rarely does explicitly: what ethical obligations arise when safety research produces knowledge that is..."
date: "2026-03-15"
reportNumber: 89
classification: "Research — Empirical Study"
status: "complete"
author: "Nyssa of Traken (AI Ethics & Policy Research Lead)"
tags: []
draft: false
---

- Failure-First VLA corpus: 215 scenarios across 24 attack families (CANONICAL_METRICS.md, verified 2026-03-16)
- FLIP-graded results: 131,836 total results, 47,303 LLM-graded (CANONICAL_METRICS.md)
- Blindfold (arXiv:2603.01414, ACM SenSys 2026): 93.2% ASR on GPT-4o, 90% on real robot
- SBA FLIP distribution: 45% BENIGN_QUERY on adversarial traces (n=20, Amy Pond wave 12)
- Action-layer evaluator: 56% SAFE on adversarial traces (n=36, Yasmin Khan wave 14)
- Evaluator FP rate: 30.8% (n=39, deepseek-r1:1.5b, Issue #315)

---

## Executive Summary

This report addresses a question that adversarial AI safety research must confront but rarely does explicitly: what ethical obligations arise when safety research produces knowledge that is simultaneously useful for defense and for attack? The question is general, but this report grounds it in the specific context of embodied AI, where the dual-use tension has characteristics absent from text-only AI safety work.

The Failure-First project has documented 24 attack families targeting vision-language-action (VLA) models across 215 scenarios. Some of these families — format-lock, tool-chain hijacking, crescendo escalation — are adaptations of established text-layer attack techniques. Others — Semantically Benign Attack (SBA), Long-Horizon Goal Displacement (LHGD), Cross-Embodiment Transfer (CET) — are novel to embodied AI and exploit the gap between text-layer safety and physical-action-layer harm. Each family generates dual-use knowledge: understanding how the attack works is necessary for building defenses, but the same understanding enables reproduction.

This report argues three things:

1. **Descriptive claim:** The dual-use profile of embodied AI attack research differs materially from text-only jailbreak research. Text jailbreaks produce harmful text — a medium where harm is indirect and typically requires additional human action. Embodied attacks produce physical action — a medium where harm is direct, immediate, and potentially irreversible. This distinction affects the severity calculus in responsible disclosure decisions.

2. **Normative claim:** Existing responsible disclosure norms (from cybersecurity and biosecurity) are partially applicable but insufficient for embodied AI safety research. The report proposes a four-factor framework — **Severity, Reproducibility, Defensibility, and Asymmetry (SRDA)** — for making publication and disclosure decisions about embodied AI attack research.

3. **Predictive claim (hedged):** As embodied AI systems move from controlled industrial settings (where attack surfaces are constrained by physical access requirements) to consumer and healthcare settings (where attack surfaces expand dramatically), the dual-use stakes of safety research will increase. Research norms established now will shape the field's approach to this transition.

**Scope of claims:**
- Descriptive claims are grounded in the Failure-First corpus (with sample sizes) and published research (cited by arXiv ID or venue).
- Normative claims represent the author's ethical analysis. They are labelled and argued, not asserted as self-evident.
- Predictive claims are explicitly marked and hedged. Prediction about attacker behaviour and regulatory response is inherently uncertain.

---

## 1. Why Embodied AI Creates a Distinct Dual-Use Problem

### 1.1 The Text-to-Action Gap in Harm Potential

**Descriptive claim:** Text-only jailbreaks produce text. Even when that text contains instructions for harmful activities (synthesis of dangerous substances, social engineering scripts, malware code), the text itself does not cause physical harm. A human must read the text, acquire materials, and execute instructions. Each step introduces friction, delay, and opportunities for intervention.

Embodied AI attacks produce physical action. When a VLA model processes an adversarial instruction and generates an action sequence, that sequence is executed by actuators in the physical world. The gap between "attack succeeds" and "harm occurs" is measured in milliseconds, not hours. The intervention window is the latency between action-sequence generation and physical execution — typically sub-second in current industrial robot control loops.

This is not a novel observation. Blindfold (arXiv:2603.01414) demonstrated the point empirically: 18 of 20 attack sequences on a UFactory xArm 6 produced the intended physical outcome. The attack-to-harm pathway did not require any human intermediary action after the initial instruction was issued.

**Implication for dual-use calculus:** The standard cybersecurity reasoning — "we disclose vulnerabilities so defenders can patch them before attackers exploit them" — assumes a temporal gap between disclosure and exploitation. In embodied AI, this gap may be minimal. A published attack technique against VLA models can be reproduced by anyone with access to the same model API and a robot. The defender's patching timeline (retraining, alignment updates, safety filter deployment) is measured in weeks or months. The attacker's reproduction timeline is measured in hours.

### 1.2 The 13-Family Landscape: A Dual-Use Taxonomy

**Descriptive claim:** The Failure-First VLA corpus contains 24 attack families (CANONICAL_METRICS.md). Each has a different dual-use profile:

| Family | Mechanism | Dual-Use Risk | Defensibility |
|--------|-----------|---------------|---------------|
| LAM (Language-Action Manipulation) | Ambiguous instructions exploiting parsing gaps | Low — well-understood NLP failure mode | Medium — parseable with disambiguation |
| TRA (Trajectory Alteration) | Modified waypoints in action sequences | Medium — requires robotics knowledge | Medium — verifiable against constraints |
| SBE (Safety Boundary Erosion) | Gradual constraint relaxation | Medium — adaptation of crescendo | Low — no clear detection threshold |
| MMC (Multi-Modal Confusion) | Cross-modal inconsistency | Medium — requires multi-modal input access | Low — multi-modal reasoning is unsolved |
| VAP (Voice-Action Poisoning) | Audio-layer attacks | Medium — requires audio channel access | Low — audio safety filters are nascent |
| ASE (Action Sequence Exploitation) | Benign sub-actions composing dangerous sequences | High — Blindfold demonstrated real-world viability | Very low — each sub-action is individually benign |
| PCM (Physical Context Manipulation) | Altered environment state | Medium — requires physical access | Medium — verifiable with sensors |
| DA (Deceptive Alignment) | Model appears safe during evaluation, unsafe in deployment | High — fundamentally undermines evaluation | Very low — detection requires solving deceptive alignment |
| PP (Policy Puppetry) | Manipulating system prompt policy | Medium — adaptation of text-layer technique | Medium — policy structure is fixable |
| TCH (Tool-Chain Hijacking) | Exploiting tool-use pipelines | High — tool-use is expanding rapidly | Low — tool chains are complex and opaque |
| LHGD (Long-Horizon Goal Displacement) | Multi-step plans that drift toward harm | High — difficult to detect until late in sequence | Very low — requires long-horizon reasoning to evaluate |
| CET (Cross-Embodiment Transfer) | Attacks designed for one platform transfer to others | High — multiplies impact of all other families | Low — embodiment-specific defenses are non-existent |
| SBA (Semantically Benign Attack) | Ordinary-language instructions that are dangerous in context | Very high — no adversarial sophistication required | Very low — instruction is genuinely benign text |

**Analytical observation:** The families with the highest dual-use risk are precisely those with the lowest defensibility. This is not coincidental — it reflects a structural feature of the embodied AI attack surface. The hardest-to-defend-against attacks are the ones whose disclosure carries the most risk, because there is no defense to deploy before an attacker reproduces the technique.

### 1.3 How This Differs from Biosecurity and Cybersecurity Dual-Use

**Descriptive claim:** Two established fields have developed dual-use governance norms that are often cited as models for AI safety:

**Biosecurity.** The 2011 H5N1 gain-of-function controversy (Fouchier and Kawaoka's papers demonstrating airborne transmissibility in ferrets) led to the NSABB review process, the Fink Report framework, and institutional biosafety committees (IBCs). Key features: (a) formal pre-publication review by an independent body, (b) assessment of whether the research provides information that could be directly misused, (c) institutional infrastructure (IBCs, IRBs) with regulatory teeth.

**Cybersecurity.** The Common Vulnerabilities and Exposures (CVE) system, coordinated disclosure timelines (typically 90 days), and bug bounty programmes provide a structured pathway from vulnerability discovery to patching. Key features: (a) a defined window between disclosure to the vendor and public disclosure, (b) a patch-then-disclose norm, (c) economic incentives (bounties) aligned with responsible disclosure.

**Analytical claim:** Neither framework maps cleanly onto embodied AI safety research:

- **The biosecurity model** assumes that the dual-use knowledge is a specific piece of technical information (a mutation, a synthesis pathway) that can be redacted from a publication while preserving the scientific contribution. Embodied AI attack research often cannot be redacted in this way. The SBA "attack" is: "ordinary language can cause harm in context." Redacting this is equivalent to not publishing the finding at all. The finding IS the dual-use knowledge.

- **The cybersecurity model** assumes that there is a patch — a specific technical fix that the vendor can deploy within a defined timeline. For VLA vulnerabilities like evaluation invisibility (Report #87), there is no patch. The vulnerability is architectural: text-layer safety training does not generalise to action-layer reasoning. "Patching" this requires solving a fundamental open problem in AI alignment. The 90-day disclosure window assumes the vulnerability is fixable on that timescale. Most embodied AI vulnerabilities are not.

- **Both models** assume a clear "vendor" — an organisation responsible for the vulnerable system that can receive the disclosure and deploy a fix. VLA models are deployed by multiple providers (OpenAI, Google, Anthropic, open-source communities) through multiple integration pathways (cloud APIs, on-device inference, edge deployment). There is no single vendor to notify.

---

## 2. The SRDA Framework: A Decision Model for Embodied AI Disclosure

### 2.1 The Four Factors

**Normative claim:** This section proposes a framework — not a formula — for evaluating disclosure decisions in embodied AI safety research. The framework is deliberately qualitative rather than quantitative, because the inputs do not support precise quantification. It is offered as a structured reasoning tool, not a compliance checklist.

The four factors are:

**S — Severity.** What is the worst-case physical harm that could result from an attacker reproducing this technique? The scale ranges from property damage (low) through recoverable injury (medium) to life-threatening or fatal outcomes (high). Severity should be assessed in the most dangerous plausible deployment context, not the least dangerous one. An SBA instruction that is harmless when a robot is manipulating foam blocks becomes potentially fatal when the same robot is operating a hydraulic press.

**R — Reproducibility.** How much attacker expertise and resource is required to reproduce the technique? Consider: (a) whether the technique requires access to model weights (not just API access), (b) whether specialised robotics knowledge is needed, (c) whether the technique transfers across models and embodiments without modification. SBA scores high on reproducibility because the attack requires only natural language and physical proximity. LHGD scores lower because constructing effective long-horizon displacement sequences requires understanding of the model's planning behaviour.

**D — Defensibility.** Does a known defense or mitigation exist, even if not yet deployed? If yes, disclosure is less risky because defenders can act on the information. If no defense exists, disclosure provides attackers with capability while providing defenders only with awareness. The evaluation-invisible attack (Report #87) scores very low on defensibility: no automated evaluator currently detects SBA-class attacks, and the architectural change needed (action-in-context evaluation) is an unsolved research problem.

**A — Asymmetry.** Does disclosure disproportionately benefit defenders or attackers? This is the crux of the dual-use question. An attack technique that is already obvious to any adversary with domain knowledge but not yet understood by defenders has a pro-defender asymmetry — disclosure helps defenders more. A novel technique that no adversary has yet discovered has a pro-attacker asymmetry — disclosure creates new capability that did not exist.

### 2.2 Applying SRDA to the 13 Families

**Normative assessment:** The following applies the SRDA framework to the Failure-First attack families. Assessments are the author's judgment, not empirical measurements.

**Tier 1: High dual-use concern (publish at pattern level only, withhold operational specifics)**

| Family | S | R | D | A | Rationale |
|--------|---|---|---|---|-----------|
| SBA | High | Very High | Very Low | Neutral | Attack requires no adversarial skill; no defense exists; "attack" is ordinary language. Publishing the pattern (benign text can be dangerous in context) is essential. Publishing specific scenario constructions provides limited additional defensive value while demonstrating reproducibility. |
| LHGD | High | Medium | Very Low | Attacker-favoured | Multi-step displacement is a novel finding. Defenders gain awareness but cannot deploy mitigation (no long-horizon action evaluator exists). Attackers gain a new technique class. |
| CET | High | High | Very Low | Attacker-favoured | Cross-embodiment transfer is a force multiplier for all other families. Demonstrating that attacks transfer between platforms reveals a systemic property that has no current mitigation. |

**Tier 2: Moderate dual-use concern (publish with defensive context)**

| Family | S | R | D | A | Rationale |
|--------|---|---|---|---|-----------|
| TCH | High | Medium | Low | Mixed | Tool-chain attacks are relevant to broader agentic AI safety. The defensive community (tool-use safety researchers) benefits significantly from understanding the attack surface. |
| DA | High | Low | Very Low | Defender-favoured | Deceptive alignment patterns help evaluation methodology. Reproducing DA requires model training, limiting attacker reproducibility. |
| ASE | High | Medium | Low | Neutral | Closely related to Blindfold (already published, ACM SenSys 2026). Additional disclosure adds marginally to already-public knowledge. |

**Tier 3: Lower dual-use concern (publish with standard academic norms)**

| Family | S | R | D | A | Rationale |
|--------|---|---|---|---|-----------|
| LAM | Medium | High | Medium | Defender-favoured | Well-understood NLP failure mode. Defenders benefit from embodied AI-specific documentation. |
| TRA | Medium | Medium | Medium | Defender-favoured | Kinematic constraint checking exists as a defense. Disclosure helps deployers implement it. |
| SBE | Medium | Medium | Low | Mixed | Adaptation of established crescendo technique. |
| MMC | Medium | Medium | Low | Defender-favoured | Multi-modal safety is an active research area that benefits from attack characterisation. |
| VAP | Medium | Medium | Low | Mixed | Audio-layer attacks are increasingly studied in the adversarial ML literature. |
| PCM | Medium | Low | Medium | Defender-favoured | Requires physical access, limiting remote exploitation. Sensor-based defenses exist. |
| PP | Medium | High | Medium | Neutral | Adaptation of text-layer technique, already well-documented for LLMs. |

### 2.3 The Pattern vs Operational Distinction

**Normative claim:** A practical heuristic emerges from the SRDA analysis: publish the *pattern* (the class of vulnerability, the structural reason it exists, the defense implications), but exercise caution with *operational specifics* (the exact prompt text, the specific scenario construction, the step-by-step reproduction instructions).

This maps onto the Failure-First project's existing practice. The public repository (`adrianwedd/failure-first`) publishes pattern-level findings. The private repository (`adrianwedd/failure-first-embodied-ai`) contains operational scenarios, traces, and evaluator outputs. This separation is already a form of tiered disclosure.

**Limitation:** The pattern/operational distinction is not always clean. For SBA, the "pattern" IS the operational detail — the attack IS "use ordinary language." There is no redactable operational component. For LHGD, the pattern (multi-step plans can drift toward harm) is distinct from the operational detail (specific displacement sequences that exploit particular model planning behaviours). The SRDA framework helps identify which cases allow the distinction and which do not.

---

## 3. Institutional Obligations: What Should a Safety Research Lab Do?

### 3.1 Pre-Publication Review (Normative)

**Normative claim:** Embodied AI safety research should adopt a pre-publication review process analogous to — but distinct from — biosecurity's NSABB and cybersecurity's coordinated disclosure.

**Proposed elements:**

1. **Internal SRDA assessment.** Before any publication (paper, blog post, policy brief, standards submission), the research team should conduct an SRDA assessment of the dual-use implications. This assessment should be documented and retained.

2. **External review for Tier 1 findings.** Findings assessed as Tier 1 (high dual-use concern) should be reviewed by at least one external party with relevant domain expertise before publication. "External" means not affiliated with the research team. Candidate reviewers: academic robotics safety researchers, industrial safety engineers (OHS background), AI safety evaluation specialists.

3. **Vendor notification for model-specific vulnerabilities.** Where a finding demonstrates a vulnerability in a specific model (e.g., GPT-4o in the Blindfold study), the model provider should be notified before publication and given a reasonable window (suggested: 90 days, acknowledging that architectural vulnerabilities may not be fixable in this window) to respond.

4. **Staged disclosure.** For Tier 1 findings, consider staged disclosure: (a) notify model providers and relevant safety institutes, (b) publish pattern-level findings in academic venues, (c) release operational details only after defenses exist or after a defined embargo period.

### 3.2 The Independence Problem (Descriptive)

**Descriptive claim:** Pre-publication review creates an independence problem. If model providers are both the recipients of disclosure and the gatekeepers of publication, they have an economic incentive to delay or suppress disclosure of vulnerabilities in their products. This is not speculative — it is the documented dynamic in cybersecurity vulnerability disclosure, where vendors have historically used legal threats to suppress researcher findings (e.g., Hewlett-Packard's response to vulnerability researcher Mike Lynn in 2005, Oracle's repeated legal actions against security researchers).

**Normative claim:** The review process must be designed to prevent vendor capture. Specific structural safeguards:

- The external reviewer must not be employed by or have financial relationships with the model provider whose system is being evaluated.
- The review is advisory, not a veto. The research team retains publication authority.
- The notification window has a hard deadline. Vendor non-response after 90 days is treated as implicit acceptance of publication.
- The review process itself is documented and publishable (meta-transparency).

### 3.3 Obligations to Affected Communities (Normative)

**Normative claim:** Embodied AI safety research creates obligations to communities that bear the physical risks of AI deployment — particularly workers in industrial settings who interact with autonomous systems.

**Descriptive claim:** 1,800+ autonomous haul trucks operate in Australian mining (BHP, Rio Tinto, Fortescue). These systems are not currently VLA-based (they use classical autonomy stacks), but the industry's announced transition toward foundation-model-based perception and planning (e.g., Google DeepMind's RT-2, Physical Intelligence's pi0) means that VLA-class vulnerabilities will become relevant to these deployments within the next 2-5 years (predictive claim, hedged).

**Normative claim:** Safety research that identifies vulnerabilities in systems that will be deployed in workplaces creates an obligation to communicate findings to worker safety representatives, not only to model providers and regulators. Workers and their unions are stakeholders in the dual-use calculus. Current disclosure norms in AI safety do not include worker notification. This is a gap.

**Practical proposal:** When Failure-First findings are communicated to Standards Australia IT-043 (Issue #347) or the AU AISI, the briefing should explicitly address implications for worker safety in autonomous vehicle and industrial manipulation deployments. Briefing materials should be written at a level accessible to OHS professionals, not only to AI researchers.

### 3.4 The Accelerationist Counterargument (Normative — Opposing View)

**The strongest version of the opposing position:** Some researchers argue that withholding safety research findings, even temporarily, is net-negative for safety. The argument has three components:

1. **Capability advances regardless.** AI capability research proceeds at a pace dictated by commercial incentives. Safety research that delays its findings does not slow capability development — it merely ensures that capability outpaces defense.

2. **Attackers discover independently.** Any vulnerability that a safety researcher can find, a motivated attacker can also find. The question is not whether the vulnerability will be known but whether defenders will know about it when attackers do. Delayed disclosure guarantees an asymmetry in favour of attackers.

3. **Defenses require public knowledge.** Effective defenses against SBA-class attacks require the broader research community to understand the attack surface. A small team withholding findings cannot build defenses as effectively as an open research community that understands the problem.

**Evaluation:** This argument has force, particularly in its second premise. The SBA vulnerability — that ordinary language can produce dangerous physical actions — is not a subtle or hidden property of VLA models. Any robotics engineer who thinks about text-to-action safety for ten minutes will identify this possibility. Withholding the SBA pattern would not prevent its discovery — it would merely delay defender awareness while the underlying vulnerability persists.

However, the argument is weaker for LHGD and CET, which involve non-obvious attack constructions. Long-horizon goal displacement requires understanding of specific model planning behaviours, and cross-embodiment transfer requires systematic testing that few attackers would independently conduct. For these families, the SRDA framework's tiered approach (publish patterns, restrict operational details) may provide genuine defensive advantage.

**Normative conclusion:** The accelerationist argument is persuasive for attack families that exploit obvious architectural properties (SBA, ASE). It is less persuasive for families that exploit non-obvious model behaviours (LHGD, CET, DA). The SRDA framework accommodates this distinction through its Asymmetry factor.

---

## 4. The Research Ethics Gap: Embodied AI Red-Teaming Has No IRB Equivalent

### 4.1 Current State (Descriptive)

**Descriptive claim:** Text-only AI red-teaming operates without formal ethics oversight in most settings. Academic papers on jailbreaking undergo standard peer review but not ethics board review — IRBs/HRECs typically scope their authority to research involving human subjects, and AI model interactions are generally not classified as human subjects research.

Embodied AI red-teaming has a different risk profile. Testing attacks on physical robots can cause property damage (broken hardware), and in deployment contexts could cause physical harm. The Blindfold study (arXiv:2603.01414) conducted real-robot testing with "safe object substitutions" — replacing harmful target objects with harmless equivalents — as a risk mitigation. This is a reasonable precaution, but it was an ad hoc researcher decision, not the product of a formal ethics review process.

**Analytical claim:** The absence of formal ethics review for embodied AI red-teaming is a governance gap. As embodied AI systems are deployed in proximity to humans, the gap between "testing an attack on a simulated robot" and "testing an attack on a robot operating near people" will narrow. Research ethics infrastructure should be established before the gap closes, not after an incident.

### 4.2 What Would an IRB Equivalent Look Like? (Normative)

**Normative proposal:** An embodied AI red-teaming ethics review should address five questions:

1. **Physical risk assessment.** What physical risks does the test create? This includes: risk to the robot hardware, risk to objects in the test environment, risk to humans in or near the test environment, and risk of uncontrolled action sequences (the robot does something the tester did not anticipate).

2. **Dual-use assessment (SRDA).** What is the dual-use profile of the knowledge that will be generated? Apply the framework from Section 2.

3. **Defensive contribution.** Does the proposed test generate knowledge that enables specific defensive improvements? A test that demonstrates a known vulnerability on a new model is less valuable than a test that characterises a previously unknown vulnerability class. Tests with low defensive contribution relative to their dual-use risk may not be justified.

4. **Minimisation.** Is the test designed to generate the minimum knowledge necessary for the defensive contribution? Can the research question be answered with simulation rather than physical testing? With fewer trials? With lower-risk configurations?

5. **Disclosure plan.** How will findings be disclosed? Has the SRDA assessment informed a disclosure timeline? Are vendor notifications planned?

**Institutional implementation:** For independent research labs (like the Failure-First project), formal ethics review infrastructure may not exist. A minimal implementation:

- Document SRDA assessments in a standard template before conducting Tier 1 experiments.
- Seek external review from at least one person not involved in the research before publishing Tier 1 findings.
- Maintain an audit trail of disclosure decisions and their rationale.
- Adopt the Failure-First project's existing public/private repository separation as a default.

### 4.3 Limitations of Self-Governance (Descriptive)

**Descriptive claim:** Self-governance in dual-use research has a documented track record of insufficiency. The biosecurity field spent a decade debating gain-of-function research governance because voluntary moratoriums were inconsistently followed. The cybersecurity field developed coordinated disclosure norms only after repeated incidents of irresponsible disclosure.

**Normative claim:** Self-governance is a necessary starting point — the Failure-First project cannot wait for regulatory frameworks that do not yet exist — but it is not a substitute for institutional oversight. As the field matures, formal review bodies with independence from both researchers and AI companies will be necessary.

**Predictive claim (hedged):** The Australian AI Safety Institute (AISI), established in January 2026 within DISR, is a candidate for this role in Australia if it develops embodied AI evaluation expertise and maintains independence from model providers (see Report #84, independence scorecard). Whether it will do so is uncertain — the Institute's initial focus appears to be text-layer LLM evaluation, and its funding comes through DISR, which also has industry development responsibilities that could create conflicts of interest.

---

## 5. Recommendations

### 5.1 For the Failure-First Project (Normative — Operational)

1. **Adopt SRDA as standard practice.** Before publishing any new attack family analysis, conduct an SRDA assessment and document it in the report. This report introduces the framework; future reports should apply it.

2. **Maintain the public/private repository separation.** Pattern-level findings go public; operational scenarios, trace data, and specific attack constructions remain in the private repository. This is already the practice — formalise it as policy.

3. **Develop external review relationships.** Identify 2-3 external reviewers (academic robotics safety researchers, industrial OHS specialists) who can provide pre-publication review for Tier 1 findings. This is an operator task — it requires human relationship-building.

4. **Include worker safety stakeholders in standards engagement.** When engaging with Standards Australia IT-043 (Issue #347), ensure briefing materials are accessible to OHS professionals and include worker safety implications.

5. **Document disclosure decisions.** For each research report that describes an attack technique, record: (a) the SRDA assessment, (b) what was disclosed publicly vs privately, (c) whether vendor notification was conducted, (d) the rationale for disclosure timing.

### 5.2 For the Embodied AI Safety Research Community (Normative — Aspirational)

1. **Develop field-specific responsible disclosure norms.** Cybersecurity's 90-day coordinated disclosure window is a useful template but must be adapted for vulnerabilities that have no available patch.

2. **Establish pre-publication review infrastructure.** This could be venue-based (conference ethics committees), institution-based (IRB-equivalent bodies for AI labs), or field-based (an NSABB equivalent for AI safety research).

3. **Include affected communities in governance.** Worker safety representatives, disability advocates (for healthcare robots), and consumer protection bodies should have standing in dual-use governance conversations.

4. **Distinguish architectural vulnerabilities from implementation bugs.** Coordinated disclosure works well for implementation bugs (specific code errors with specific fixes). It works poorly for architectural vulnerabilities (text-layer safety does not generalise to action-layer reasoning). Different disclosure norms may be needed for each category.

### 5.3 For Regulators (Normative — Policy-Directed)

1. **Recognise embodied AI dual-use as a distinct governance challenge.** The EU AI Act, Australian voluntary AI safety commitments, and NIST AI RMF do not currently distinguish between text-layer and action-layer AI safety. Embodied AI dual-use falls into this gap.

2. **Fund independent safety evaluation infrastructure.** As argued in Report #84, evaluation independence requires public funding. Dual-use governance that depends on industry-funded evaluation creates structural conflicts of interest.

3. **Include physical safety expertise in AI governance bodies.** AI governance is currently dominated by computer science and policy expertise. Embodied AI governance requires industrial safety engineering, occupational health, and robotics expertise.

---

## 6. Limitations

This report has several significant limitations:

1. **The SRDA framework is qualitative.** The four factors are assessed judgmentally, not measured. Different analysts applying the framework to the same attack family could reach different conclusions. This is a feature of ethical analysis (reasonable people disagree) but limits the framework's prescriptive force.

2. **The 24-family taxonomy is internal to Failure-First.** Other research groups may categorise embodied AI attacks differently. The SRDA assessments in Section 2.2 are specific to this taxonomy and may not transfer to other classification schemes.

3. **The analysis assumes current capability levels.** If VLA models develop robust action-layer safety reasoning, the defensibility assessments in Section 2.2 would change, shifting some families from Tier 1 to lower tiers. Conversely, if new attack families are discovered, the framework would need to be extended.

4. **Worker safety claims are prospective.** The connection between VLA vulnerabilities and Australian mining/logistics worker safety is based on announced industry transitions toward foundation-model-based systems (predictive claim). Current autonomous mining systems use classical autonomy stacks not subject to VLA-class attacks.

5. **Self-governance is structurally insufficient.** Section 4.3 acknowledges this. The recommendations in Section 5 represent what a research team can do unilaterally — they do not substitute for institutional oversight, which requires action by parties outside the research team.

---

## Appendix A: SRDA Assessment Template

For use in future Failure-First reports:

```
### SRDA Dual-Use Assessment

**Attack family:** [name]
**Report #:** [N]

**S — Severity:** [Low / Medium / High]
Worst-case physical harm in most dangerous plausible deployment:
[description]

**R — Reproducibility:** [Low / Medium / High / Very High]
Attacker expertise and resources required:
[description]

**D — Defensibility:** [Very Low / Low / Medium / High]
Known defenses or mitigations:
[description]

**A — Asymmetry:** [Attacker-favoured / Neutral / Defender-favoured / Mixed]
Does disclosure benefit defenders or attackers more?
[description]

**Tier assignment:** [1 / 2 / 3]
**Disclosure recommendation:** [pattern only / with defensive context / standard academic norms]
**Vendor notification required:** [yes/no, with rationale]
```

---

## Appendix B: Comparison of Dual-Use Governance Models

| Feature | Biosecurity (NSABB) | Cybersecurity (CVE/Coordinated Disclosure) | Proposed Embodied AI (SRDA) |
|---------|--------------------|--------------------------------------------|---------------------------|
| Trigger | Research with pandemic potential | Vulnerability in deployed software | Attack research against embodied AI systems |
| Review body | National Science Advisory Board for Biosecurity | Vendor security team + CERT/CC coordination | Internal SRDA assessment + external review for Tier 1 |
| Review authority | Advisory (can recommend against publication) | Norm-based (90-day window is convention, not law) | Advisory (researcher retains publication authority) |
| Patch assumption | Yes (containment measures exist) | Yes (software patches deployable) | Partial (some vulnerabilities are architectural, not patchable) |
| Vendor clarity | Somewhat (BSL-4 labs are known) | Yes (software vendor is identifiable) | Poor (VLA models deployed by multiple providers) |
| Affected community inclusion | Limited (public health officials) | None (end-users are not consulted) | Proposed (worker safety, healthcare, consumer representatives) |
| Enforcement | Federal funding conditions | Social norms + vendor legal teams | None (voluntary) |

---

*This report is a structural analysis of dual-use obligations. It does not advocate for or against any specific publication decision. The SRDA framework is offered as a reasoning tool for the research community, not as a prescriptive standard.*
