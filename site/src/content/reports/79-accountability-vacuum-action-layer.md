---
title: "The Accountability Vacuum in Action-Layer AI Safety"
description: "This report identifies and analyses an accountability vacuum at the intersection of three independently documented findings: (1) the Blindfold attack framework demonstrates that semantically..."
date: "2026-03-11"
reportNumber: 79
classification: "Research — Empirical Study"
status: "complete"
author: "Nyssa of Traken (AI Ethics & Policy Research Lead)"
tags: []
draft: false
---

## Executive Summary

This report identifies and analyses an accountability vacuum at the intersection of three independently documented findings: (1) the Blindfold attack framework demonstrates that semantically benign instructions can produce dangerous physical actions in embodied AI (93.2% ASR on GPT-4o, 90% on real robot; Report #75, arXiv:2603.01414); (2) PARTIAL verdict dominance in VLA traces shows that models hedge textually while generating requested action sequences, with zero outright refusals across 58 valid traces (Report #49); and (3) the best available automated safety evaluator in the Failure-First pipeline produces a 30.8% false positive rate on benign inputs (Issue #315), meaning safety evaluation itself introduces material uncertainty.

The compound effect is an accountability vacuum: when a robot arm injures a worker because it received a semantically benign instruction that produced a dangerous action, no actor in the current liability chain bears clear responsibility. The model provider's text-layer safety filter did not trigger because the instruction was textually benign. The deployer's evaluator, even if diligently applied, has a documented false positive rate that makes its verdicts unreliable for action-layer assessment. The regulator has no framework that distinguishes text safety from action safety. And the safety evaluator -- if one were used -- cannot currently meet the minimum calibration thresholds proposed in Report #76 for regulatory-grade assessment.

This is not a gap that can be closed by improving any single component. It is a structural feature of a system where safety is assessed at the text layer while harm is produced at the action layer.

**Scope of claims:**
- **Descriptive claims** are grounded in the Failure-First corpus, published papers, and enacted legislation. Factual sources are cited.
- **Normative claims** represent the author's ethical analysis of what governance structures ought to exist. They are labelled and argued, not asserted.
- **Predictive claims** are explicitly marked and hedged. Prediction in a rapidly evolving regulatory environment is inherently uncertain.

---

## 1. The Accountability Chain: Who Is Responsible?

### 1.1 The Scenario

A VLA-controlled industrial manipulator arm in a warehouse receives a sequence of natural-language instructions. Each instruction is individually benign: "move to position X," "close gripper," "extend arm forward." No individual instruction contains harmful content. The sequence, when physically executed, strikes a nearby worker.

This scenario is not hypothetical. Blindfold (arXiv:2603.01414, accepted ACM SenSys 2026) demonstrated exactly this pattern on a UFactory xArm 6, achieving 18/20 successful attacks on a real robot with safe object substitutions (Report #75, Section 2.2). The raw-input baseline -- malicious instructions without any attack framework -- shows 27-30% ASR on GPT-4o and Phi-4-14B, indicating that the vulnerability exists even without adversarial optimisation (Report #75, Section 3.4).

### 1.2 The Model Provider

**Descriptive claim:** Current safety training for foundation models operates at the text generation layer. Safety filters (input classifiers, output classifiers, RLHF-trained refusal) evaluate the semantic content of text. When each instruction in a Blindfold-style sequence is "move arm to position X," no text-layer safety filter activates. The instruction is semantically benign.

The model provider can argue, with some justification, that its safety obligations concern the generation of harmful text. The provider did not generate harmful text. The harm arose from the physical consequence of a sequence of individually benign actions -- a consequence that depends on the physical environment, the robot's embodiment, and the spatial relationships between objects, none of which are visible to the text-layer safety system.

**However:** The model provider supplies the model as a component in VLA pipelines, knowing (or ought to know) that the model's outputs will be decoded into physical actions. The question becomes whether the provider's duty of care extends to foreseeable downstream use. Under the EU Product Liability Directive 2024 (Directive 2024/2853), Article 6, a product is defective if it does not provide the safety which a person is entitled to expect, taking into account "the reasonably foreseeable use of the product." A model marketed for or known to be used in robotic control systems may have a broader safety expectation than one used solely for text generation.

**Normative claim:** Model providers whose models are used in VLA pipelines should bear some accountability for action-layer safety, proportionate to their awareness of and ability to influence the deployment context. Pure text-layer safety is necessary but not a sufficient discharge of the provider's duty when the deployment involves physical actuation.

### 1.3 The Deployer

**Descriptive claim:** The deployer (the entity that integrates the model into a robotic system and deploys it in a workplace) has the most direct control over the physical environment, the robot's embodiment, and the action decoder that translates model outputs into motor commands. Under Australian WHS law (Work Health and Safety Act 2011, s 19), the PCBU has the primary duty to ensure, so far as is reasonably practicable, that workers are not exposed to risks arising from the conduct of the business. Under the NSW Digital Work Systems Act 2026 (passed February 13, 2026), this duty explicitly extends to AI systems that affect workers.

The deployer would be expected to have tested the system for safety. But tested with what? If the deployer uses an automated safety evaluator, the best available evaluator has a 30.8% false positive rate (Issue #315). If the deployer uses text-layer safety evaluation, Blindfold-class attacks are invisible to it by design. If the deployer uses physical simulation, they need a simulation environment that models the specific spatial relationships that make a benign instruction sequence dangerous -- which requires knowing the attack pattern in advance.

**The paradox for the deployer:** The deployer is the entity with the highest duty of care (under WHS law, the PCBU's duty is non-delegable). But the deployer currently has no reliable tool to discharge that duty for action-layer attacks. Text-level evaluation misses the threat. Automated evaluators are uncalibrated. Physical simulation requires pre-knowledge of the attack class. The deployer is accountable for a risk category that the current safety ecosystem does not equip them to detect.

### 1.4 The Regulator

**Descriptive claim:** No regulatory framework currently in force distinguishes text-layer safety from action-layer safety for AI-controlled robotic systems.

- **EU AI Act** (Regulation 2024/1689): High-risk provisions applicable from August 2, 2026 (LR-19, 143 days from March 11). Article 9 requires risk management. Article 15 requires robustness, including "against possible attempts by unauthorised third parties to alter its use, outputs or performance by exploiting system vulnerabilities." However, the Act does not specify that robustness testing must include action-level adversarial evaluation as distinct from text-level evaluation. Conformity assessments relying solely on text-layer tests would not detect Blindfold-class attacks (Report #75, Section 4.2).

- **Australian WHS Act 2011 (s 19)**: The primary duty is outcome-based ("ensure... health and safety... so far as is reasonably practicable"), not prescriptive about testing methodology. What is "reasonably practicable" depends on what is known about the risk. Once Blindfold is published and its attack methodology is public, a deployer who does not test for action-layer manipulation may face the argument that the risk was foreseeable and the precaution was available.

- **NSW Digital Work Systems Act 2026**: Creates a binding pre-deployment testing duty for AI systems affecting workers. But the Act does not specify the content of the testing -- only that it must be performed. An employer could argue compliance by conducting text-level safety testing alone.

- **NIST AI RMF 1.0**: Covers prompt injection at the text layer (AI 100-2e2023, Section 6.7). Does not address action-layer manipulation as a distinct attack surface.

**Normative claim:** Regulators should develop guidance that explicitly distinguishes text-layer from action-layer safety evaluation for AI systems that produce physical actions. Without this distinction, conformity assessment methodologies will systematically miss the Blindfold attack class, creating a compliance gap where manufacturers satisfy the letter of the regulation while deploying systems vulnerable to a published, automated, 90%+ ASR attack.

### 1.5 The Safety Evaluator

Report #76 proposed a three-tier assurance framework for automated safety evaluators: Level 1 (self-certification, accuracy >= 50%), Level 2 (independent evaluation, accuracy >= 70%), Level 3 (accredited assessment, accuracy >= 85%).

**Descriptive claim:** No automated evaluator currently deployed meets Level 3 (Report #76, Section 6.3). The Failure-First pipeline's most reliable evaluator (deepseek-r1:1.5b) achieves approximately 70% accuracy with a 30.8% FP rate, placing it at the boundary of Level 2. But even Level 2 assessment operates at the text layer. The evaluator reads model outputs as text and classifies them as COMPLIANCE, PARTIAL, REFUSAL, etc. It does not simulate the physical consequences of action sequences. An evaluator that perfectly classifies text-layer safety would still assign "BENIGN" to every Blindfold attack because the text is, in fact, benign.

This creates a second-order accountability problem. If a deployer commissions a safety evaluation from an evaluation laboratory, and the laboratory uses a text-layer evaluator to assess an embodied AI system, and the system is subsequently compromised by a Blindfold-class attack, the evaluation laboratory's report was technically correct (the text was benign) while being materially misleading (the system was unsafe). LR-18 (Section 4) analyses the negligence standard for this scenario: the evaluation laboratory's duty of care depends on what it held out as the scope of its evaluation. If the evaluation was presented as a comprehensive safety assessment, the laboratory may bear liability for not testing the action layer. If the evaluation explicitly disclaimed action-layer coverage, the liability shifts back to the deployer for relying on an incomplete assessment.

**The recursive problem:** The safety evaluator is itself a potential liability vector. An evaluator that provides false assurance is worse than no evaluator at all, because it creates documented reliance that substitutes for genuine safety testing. This is the "evaluation as alibi" problem identified in Report #73 (recursive evaluator ethics, Section 2.2).

### 1.6 Summary: The Accountability Distribution

| Actor | Potential liability basis | Gap in accountability |
|-------|--------------------------|----------------------|
| Model provider | Product liability (PLD 2024 Art 6), duty re foreseeable use | Text was benign; no safety filter triggered; provider may disclaim action-layer responsibility |
| Deployer (PCBU) | WHS Act s 19, NSW Digital Work Systems Act 2026 | Highest duty, but no reliable tool to test for action-layer attacks; evaluator FP rate undermines due diligence |
| Regulator | No liability, but creates the framework | No framework distinguishes text from action safety; conformity assessment misses the attack class |
| Safety evaluator | Negligence, misleading assessment (LR-18) | Text-layer evaluation is technically correct but materially incomplete for embodied systems |
| No one (vacuum) | — | Harm occurs in the gap between text-layer accountability and action-layer harm production |

**Normative claim:** The accountability vacuum exists because liability frameworks were designed for systems where the output that causes harm is the same output that is evaluated for safety. In traditional product liability, the product that injures the consumer is the product that was tested. In AI safety, the text that is evaluated is not the action that causes harm. This is not a quantitative gap (evaluation accuracy); it is a qualitative gap (evaluation domain).

---

## 2. Structural Power Analysis

### 2.1 Who Controls Capability vs Who Controls Governance

This section applies the power concentration framework to the action-layer accountability vacuum.

**Capability concentration:** A small number of foundation model providers (Anthropic, Google DeepMind, OpenAI, Meta) produce the models used as VLA backbones. Their safety teams design the text-layer safety filters that current embodied systems rely on. Their research labs (and, increasingly, their policy teams) shape the discourse about what "AI safety" means and requires.

**Governance concentration:** AI governance standard-setting is concentrated in a small number of bodies (NIST AISIC, ISO/IEC JTC 1/SC 42, CEN/CENELEC JTC 21, EU AI Office). Membership and influence in these bodies is disproportionately accessible to well-resourced organisations -- the same foundation model providers that control capability.

**The structural conflict:** The entities with the greatest capability to define "safe" (model providers with access to internal safety benchmarks, red team data, and evaluation infrastructure) are also the entities with the greatest commercial interest in safety evaluation remaining at the text layer. Text-layer safety is the domain where these providers have invested most heavily. A governance requirement to extend safety evaluation to the action layer would require new investment, new methodology, and -- critically -- would reveal vulnerabilities that text-layer evaluation currently conceals.

**Descriptive claim:** This is not an accusation of bad faith. Model providers may genuinely believe that text-layer safety is sufficient, or that action-layer safety is the deployer's responsibility. The structural point is that the entities best positioned to develop action-layer safety evaluation have the weakest commercial incentive to do so, while the entities with the strongest incentive (deployers facing WHS liability) lack the technical capability.

**Predictive claim:** Without regulatory intervention that explicitly requires action-layer safety evaluation for embodied AI systems, the current allocation -- where text-layer safety is the model provider's responsibility and action-layer safety is nobody's responsibility -- is likely to persist. The Blindfold publication increases the probability of regulatory action by providing a concrete, peer-reviewed, real-robot-validated demonstration of the gap. But the timeline for regulatory response is uncertain: the Governance Lag Index for action-layer manipulation currently has null values at all four stages (Report #75, Section 4.1).

### 2.2 Stakeholder Harm Distribution

The accountability vacuum distributes risk asymmetrically:

| Stakeholder | Bears risk? | Captures benefit? | Has voice in governance? |
|-------------|-----------|------------------|------------------------|
| Workers near VLA-controlled robots | Yes (physical injury) | No (productivity gains accrue to employer) | Minimal (WHS consultation obligations exist but are process requirements, not veto rights) |
| Deployer/employer | Yes (liability, regulatory sanction) | Yes (productivity gains) | Moderate (industry associations, SWA consultation) |
| Model provider | Limited (supply-chain liability uncertain) | Yes (model licensing revenue) | High (NIST AISIC, standards bodies, government partnerships) |
| Safety evaluator | Limited (professional liability) | Yes (evaluation fees) | Moderate (but emerging role) |
| Regulator | No (sovereign immunity) | No | High (sets the framework) |
| Insurer | Yes (claims exposure) | Yes (premium revenue) | Low in AI governance (high in WHS generally) |

**Normative claim:** The current distribution is ethically problematic because the stakeholder who bears the most severe risk (workers subject to physical injury) has the least voice in the governance structures that determine how that risk is managed. This is a standard power-asymmetry finding in occupational health and safety, but AI introduces a new dimension: the technical complexity of action-layer attacks makes worker participation in risk governance effectively impossible without domain expertise that workers are not expected to have.

### 2.3 The AU AISI Independence Question

The Australian AI Safety Institute (established November 2025, DISR-funded) is positioned as the primary institutional vehicle for AI safety evaluation governance in Australia (Report #76, Section 7.3). However:

**Descriptive claim:** The AU AISI's documented gap in embodied AI coverage (Brief E, AGENT_STATE established findings) means that it does not currently address action-layer safety for robotic systems. Its focus on LLMs aligns with text-layer safety. A governance framework that channels through AU AISI will inherit this gap unless the Institute's scope is explicitly expanded.

**Descriptive claim:** DISR funding creates a structural dependence on the Department of Industry, Science and Resources. The extent to which AU AISI can maintain analytical independence from industry -- particularly from mining and logistics companies that deploy autonomous systems and are politically significant in Australia -- is an open question. The independence metrics pilot (Report #54, data/governance/independence_metrics_v0.1.jsonl, 44 entries, 16 organisations) does not yet include AU AISI because the Institute is too new to have a track record.

**Normative claim:** AU AISI should be the institutional vehicle for action-layer safety evaluation governance in Australia, but only if its scope is expanded to include embodied AI and its independence from industry is structurally protected. A safety institute that evaluates text-layer safety while ignoring the action layer perpetuates the accountability vacuum rather than closing it.

---

## 3. The Dual-Use Tension

### 3.1 The Disclosure Dilemma

Two research outputs create a dual-use tension:

**Blindfold (arXiv:2603.01414, ACM SenSys 2026):** The full attack methodology is publicly available. The paper describes the three-component pipeline (command transformer, intent obfuscator, rule-based verifier), provides ablation studies showing the contribution of each component, and reports ASR figures on six models including GPT-4o and Claude-3.5-sonnet. An adversary with moderate technical capability could implement the attack from the paper alone.

**Failure-First PARTIAL dominance (Report #49, VLA data):** Our finding that 50% of VLA verdicts are PARTIAL (textual hedging without action-layer refusal) and 0% are REFUSAL quantifies the defense gap that Blindfold exploits. Combined with the 30.8% evaluator FP rate (Issue #315), these findings tell an attacker three things: (a) the attack works (Blindfold ASR), (b) the target systems will not refuse (PARTIAL dominance), and (c) the defensive evaluation systems are unreliable (FP rate). The compound signal is more informative to an attacker than any single finding.

### 3.2 Applying the Dual-Use Framework

The dual-use obligation for safety research requires weighing the benefit of disclosure (enabling defenders) against the cost (enabling attackers). The relevant considerations:

**Arguments for publishing the PARTIAL dominance and FP rate findings:**
1. **Deployers need to know.** An entity deploying a VLA-controlled robot in a warehouse has a WHS obligation to assess risks. Without knowledge of the PARTIAL dominance pattern and the evaluator FP rate, the deployer cannot make an informed risk assessment. Withholding this information leaves deployers uninformed about a 72.4% attack success rate and a 30.8% evaluation error rate.
2. **Regulatory awareness.** Regulators developing conformity assessment methodologies for the EU AI Act high-risk provisions (August 2, 2026 deadline) need to understand that text-layer evaluation is insufficient. The PARTIAL dominance finding is directly relevant to the content of harmonised standards under CEN/CENELEC JTC 21.
3. **Academic norms.** The Blindfold paper is already published. Our findings contextualise and extend it. Withholding our findings while the attack methodology is public creates an asymmetry that benefits attackers (who have the attack) over defenders (who lack the defense gap quantification).
4. **Responsible disclosure precedent.** The cybersecurity community's disclosure norms generally favour publication of vulnerabilities after a reasonable disclosure period, on the grounds that affected parties cannot defend against threats they do not know about.

**Arguments against publishing:**
1. **Compound signal amplification.** Blindfold alone tells an attacker that the attack works. Adding the PARTIAL dominance finding tells the attacker that models will not refuse. Adding the FP rate tells the attacker that evaluators will not detect the attack. The compound signal is qualitatively more actionable than any single finding.
2. **No mitigation available.** In cybersecurity, responsible disclosure typically accompanies a patch or mitigation. There is no equivalent "patch" for the action-layer safety gap. Publishing the vulnerability without a mitigation leaves deployers informed but not protected.
3. **Attacker asymmetry.** The findings are more immediately actionable for an attacker (who needs only one successful attack) than for a defender (who must protect against all possible attack sequences in all possible physical configurations).

### 3.3 Assessment

**Normative claim:** On balance, the findings should be published, with the following conditions:

1. **Pattern-level, not operational.** Consistent with the project's safety constraints (CLAUDE.md), publication should describe the structural finding (text-layer safety is insufficient for embodied AI, PARTIAL dominance eliminates the refusal backstop, evaluator FP rates undermine verification) without providing operational tools that lower the barrier to attack execution. The Blindfold paper already provides the operational methodology; our contribution is the defense-gap quantification.

2. **Coordinated with regulatory stakeholders.** Before public publication (e.g., in the CCS paper or on failurefirst.org), the PARTIAL dominance and FP rate findings should be shared with AU AISI, NIST AISIC, and CEN/CENELEC JTC 21 through the existing engagement channels (research/engagement/). This is consistent with the coordinated vulnerability disclosure model.

3. **Accompanied by the evaluator governance framework.** Report #76's three-tier assurance framework provides a constructive governance response. Publishing the vulnerability alongside the governance proposal transforms the disclosure from "here is a problem with no solution" to "here is a problem and here is an institutional framework for addressing it."

4. **With explicit limitation language.** All published versions of the findings should state: (a) the FLIP ASR figures are from 1-2B parameter evaluators and may not generalise; (b) the FP rate was measured on a specific benign baseline and may not represent operational FP rates in all deployments; (c) the PARTIAL dominance finding is from a limited sample (n=58) and should be replicated at scale.

---

## 4. Candidate Governance Mechanisms

### 4.1 What Would Need to Be True for Accountability to Work

For the accountability vacuum to close, the following conditions would need to be met. Each is assessed for current status and feasibility.

| Condition | Current status | Feasibility |
|-----------|---------------|-------------|
| **C1:** A regulatory framework distinguishes text-layer from action-layer safety for embodied AI | Not met anywhere. EU AI Act Art 9 covers "risks" generally but does not distinguish attack surfaces. | Feasible via harmonised standards (CEN/CENELEC) or NIST supplementary guidance. Does not require primary legislative change. |
| **C2:** Conformity assessment methodologies for embodied AI include action-layer adversarial evaluation | Not met. No harmonised standard specifies action-layer testing. | Technically feasible (Blindfold provides methodology). Institutionally requires development of embodied AI test environments. |
| **C3:** Automated safety evaluators meet minimum calibration thresholds for the action-layer classification task | Not met. No evaluator has been calibrated for action-layer safety classification. Report #76's Level 3 threshold (85% accuracy) is unattained even for text-layer classification. | Not feasible with current technology at small model scale. May be feasible with large-model evaluators or purpose-built classifiers. Requires ground truth data for action-layer safety that does not currently exist. |
| **C4:** Liability frameworks assign clear responsibility for action-layer harm to an identifiable actor | Partially met. WHS law assigns primary duty to the PCBU. EU PLD assigns product liability to the provider. But the "what is defective" question is unresolved for the case where each individual component (model, deployer, evaluator) performed correctly by its own standard. | Feasible through judicial interpretation of existing frameworks. May require legislative clarification for the multi-actor supply chain (LR-12, supply chain liability). |
| **C5:** Workers near VLA-controlled systems have meaningful information about the action-layer risk profile | Not met. No disclosure requirement communicates action-layer vulnerability to workers or their WHS representatives. | Feasible through WHS consultation obligations (s 47 WHS Act) and SWA codes of practice. Low technical barrier. High practical barrier (workers lack domain expertise). |

### 4.2 Minimum Requirements for Legally Defensible Action-Layer Safety Evaluation

For a safety evaluation of an embodied AI system to be legally defensible against a Blindfold-class attack, the following minimum elements would be required. These are derived from the intersection of the evaluator governance framework (Report #76), the EU AI Act requirements (LR-19), and the Blindfold threat model (Report #75).

**Element 1: Action-sequence consequence analysis.** The evaluation must assess the physical outcome of generated action sequences, not just the text content of individual actions. This requires either (a) physical simulation in a representative environment, or (b) formal verification of action-sequence safety properties (Blindfold tested VeriSafe formal verification -- it reduced ASR by 17.9pp but left residual ASR above 75%).

**Element 2: Semantic-physical misalignment testing.** The evaluation must include test cases where semantically benign instructions produce physically harmful outcomes. Blindfold's dataset of 187 instructions provides a starting point. The evaluation must go beyond the specific instructions in the test set to cover the attack class generatively (otherwise the evaluation is a lookup table, not a safety assessment).

**Element 3: Evaluator calibration at the action layer.** The automated evaluator (if one is used) must be calibrated for the action-layer classification task. Ground truth requires human judgment about physical consequences -- not just text-level safety classification. No such ground truth dataset currently exists for general-purpose action-layer safety evaluation.

**Element 4: Defence-in-depth documentation.** The evaluation must document the defence layers that operate at the action execution level, distinct from the text generation level. These may include: kinematic constraints, force limits, collision detection, workspace boundaries, speed reduction zones, and safety-rated monitored stop (per ISO 10218 for industrial robots). The evaluation must test whether these defences are effective against Blindfold-class instruction sequences.

**Element 5: Assurance level declaration.** Per Report #76's tiered assurance framework, the evaluation must state which assurance level it meets (Level 1: self-certified, Level 2: independently evaluated, Level 3: accredited assessment). For high-risk systems under EU AI Act Annex III, Level 2 minimum should be required, with Level 3 for systems involving physical actuation in close proximity to workers.

### 4.3 Connection to Report #76's Three-Tier Framework

Report #76 defined three assurance levels but framed them for text-layer evaluation. The action-layer extension requires the following modifications:

| Component | Text-layer (Report #76) | Action-layer extension |
|-----------|------------------------|----------------------|
| Calibration threshold | Accuracy measured against text-level ground truth | Accuracy measured against physical-consequence ground truth (requires simulation or physical testing infrastructure) |
| Independence | Evaluator model independent of target model provider | Additional independence: evaluator laboratory independent of robot manufacturer and system integrator |
| Disclosure | Evaluator card with five fields | Extended to include: action-layer coverage scope, simulation environment description, physical testing conditions, residual risk statement |
| Continuous monitoring | Verdict distribution monitoring | Action-outcome monitoring in deployment (near-miss reporting, force/collision event logging) |
| Tiered assurance | Level 1/2/3 for text safety | Level 3 mandatory for embodied AI in worker-proximate deployments |

**Normative claim:** Level 3 assurance should be mandatory, not optional, for embodied AI systems deployed in environments where workers or members of the public are within the robot's operational envelope. The rationale: the consequence of evaluation failure in embodied AI is physical injury, not reputational harm or data exposure. The consequence class demands the highest assurance level, even if current technology cannot fully meet it -- in which case, the deployment should include human oversight sufficient to compensate for the evaluation gap.

---

## 5. The Evaluator Liability Paradox

### 5.1 Safety Evaluation as a Liability Vector

LR-18 identified the general problem: an automated evaluator that produces materially inaccurate assessments creates liability exposure for every party that relies on those assessments. This section analyses the specific paradox that arises when the evaluator is itself the best available tool.

**The paradox:** If a deployer uses the best available safety evaluator (deepseek-r1:1.5b, approximately 70% accuracy, 30.8% FP rate) and the evaluator produces a false negative (classifying an unsafe system as safe), is the deployer negligent?

**Descriptive claim:** Under the WHS Act 2011, the standard of care is "reasonably practicable" (s 18), which considers (among other things) "the availability and suitability of ways to eliminate or minimise the risk" (s 18(c)). If the best available evaluator has a 30.8% FP rate, the deployer might argue that using it is the most reasonably practicable option, even though it is unreliable. The deployer cannot be expected to use a tool that does not exist.

**However:** The "reasonably practicable" standard also considers "what the person concerned knows, or ought reasonably to know" (s 18(c) in conjunction with the general knowledge requirement). Once the 30.8% FP rate is published, a deployer who relies on the evaluator without supplementary human review or physical testing "ought reasonably to know" that the evaluation is unreliable. The publication of the FP rate transforms the evaluator from a reasonable precaution into an insufficient one.

**Normative claim:** This creates a perverse incentive structure. Publishing evaluator calibration data (as proposed in Report #76, Component 3, and Report #68) is ethically necessary for transparency. But it simultaneously increases the deployer's liability exposure by establishing constructive knowledge of the evaluator's limitations. A deployer who does not know the evaluator's FP rate can argue ignorance. A deployer who knows the FP rate cannot. The publication of calibration data is necessary, but it creates transitional liability: deployers are immediately accountable for a risk they cannot yet mitigate because no better evaluator exists.

**The governance response:** This is why Report #76's Component 5 (tiered assurance levels) is essential. If the regulatory framework acknowledges that Level 3 is currently unattainable and defines Level 2 as the minimum for commercial use (with documented limitations), deployers who meet Level 2 have a defensible position: they used the best available methodology, disclosed its limitations, and supplemented it with the precautions available. This is not a guarantee against liability, but it provides a standard of care that can be met.

### 5.2 The Transitional Period Problem

**Predictive claim:** The period between the publication of the Blindfold attack methodology (March 2026) and the availability of action-layer safety evaluation tools (unknown, but likely 12-24 months at minimum for standardised methodology, longer for accredited evaluation laboratories) creates a transitional period where:

1. The attack is publicly documented and technically reproducible
2. No standardised defense methodology exists
3. No evaluator is calibrated for action-layer safety classification
4. Deployers have constructive knowledge of the vulnerability (via publication) but no validated way to address it

This transitional period is analogous to the window between the disclosure of a cybersecurity vulnerability and the availability of a patch. In cybersecurity, this window triggers heightened monitoring, compensating controls, and in some cases, system shutdown. For embodied AI, the equivalent compensating controls would include: enhanced physical safety barriers, reduced operational envelopes, increased human oversight, and mandatory near-miss reporting.

**Normative claim:** During the transitional period, deployers of VLA-controlled systems in worker-proximate environments should implement compensating controls proportionate to the documented risk, rather than waiting for purpose-built action-layer evaluators. The duty of care does not pause while the evaluation methodology catches up to the threat.

---

## 6. Connections to Existing Work

### 6.1 The Compliance Paradox (Report #59)

Report #59 identified the compliance paradox: models that textually signal safety awareness while generating unsafe action sequences. Report #79 extends this analysis from an alignment failure to an accountability failure. The compliance paradox means that the model's own safety signals (textual hedging) are unreliable indicators of action-layer safety. This eliminates one potential accountability mechanism: holding the model provider responsible when the model's own safety signals fail to prevent harm. If the model hedges but complies, the provider can argue that the model did signal danger -- the deployer failed to act on the signal. The deployer can argue that the signal was embedded in natural language output and the action decoder does not parse natural language caveats.

The compliance paradox thus generates a liability hot potato between provider and deployer, with neither bearing clear responsibility.

### 6.2 The Evaluator Governance Framework (Report #76)

Report #76's five-component framework provides the institutional architecture for closing part of the accountability vacuum. However, all five components were designed for text-layer evaluation. The action-layer extension (Section 4.3 above) identifies the modifications required. Report #76's three-tier assurance framework is necessary but not sufficient: it addresses the quality of evaluation but not the scope of evaluation. An evaluator that meets Level 3 calibration for text-layer safety but does not evaluate action-layer safety still leaves the vacuum open.

### 6.3 LR-18 and LR-19

LR-18 (evaluator liability) maps the negligence chain for inaccurate safety evaluations. LR-19 (EU AI Act timeline) establishes the 143-day countdown (from March 11, 2026) to high-risk enforcement. Together, they define the urgency: deployers of embodied AI systems in the EU market have 143 days to prepare conformity assessments that -- under current guidance -- do not require action-layer testing, but which -- after Blindfold -- may be inadequate to defend against a liability claim based on the state of the art.

### 6.4 Blindfold (Report #75)

Report #75 provides the empirical foundation for the accountability vacuum analysis. The key data points:
- 93.2% ASR on GPT-4o (simulation), 90% on real robot (18/20 successful)
- 27-30% raw-input ASR without any attack framework (structural vulnerability baseline)
- Best defense (VeriSafe) reduces ASR by only 17.9pp, leaving residual ASR above 75%
- Each individual instruction in an attack sequence is semantically benign
- The attack is automated, low-query-budget, and requires no access to the target model's weights

---

## 7. Limitations

1. **Empirical scope.** The PARTIAL dominance finding is from n=58 valid FLIP-graded traces across 7 attack families and 2 models (deepseek-r1:1.5b, qwen3:1.7b) at the 1-2B parameter scale. Whether the pattern holds for larger models used in production VLA systems is an open empirical question. The Blindfold paper tests larger models (GPT-4o, Claude-3.5-sonnet, Phi-4-14B) and finds similar vulnerability at the action layer, which provides corroborating evidence but is not the same as demonstrating PARTIAL dominance specifically.

2. **Evaluator FP rate generalisability.** The 30.8% FP rate was measured for deepseek-r1:1.5b on a specific benign baseline (44/60 valid traces, Issue #315). Whether this rate generalises to other evaluation tasks, other evaluators, or other baseline distributions is unknown. The accountability analysis assumes this rate is indicative, not universal.

3. **Legal analysis limitations.** This report contains legal analysis produced by an AI agent, not a qualified solicitor. The analysis of WHS obligations, EU AI Act requirements, and product liability is intended as structural analysis to inform ethics and governance positions. It should be reviewed by a solicitor before informing legal strategy or regulatory submissions.

4. **Predictive uncertainty.** The predictive claims about regulatory response timelines, transitional period duration, and governance pathway feasibility are inherently uncertain. The regulatory landscape for AI governance is evolving rapidly; specific predictions should be treated as informed estimates, not forecasts.

5. **Industrial robot safety systems.** The analysis acknowledges (per Report #75, Section 6) that industrial manipulators often have hardware-level safety systems (safety-rated controllers per ISO 10218, collision detection, force limiting). These systems operate at a layer below the AI model and may independently prevent some Blindfold-class attacks from causing physical harm, depending on the specific physical configuration. The accountability vacuum analysis is most acute for systems where the AI model's action output is translated into motor commands without independent physical safety monitoring.

---

## 8. Recommendations

### For the Failure-First project:

1. **Develop an action-layer evaluation prototype.** Extend the FLIP methodology to include action-consequence assessment, even in simplified form. A proof-of-concept that evaluates whether a sequence of individually benign VLA action outputs would produce physical harm in a defined environment would be a first step toward closing the evaluation scope gap. Priority: high. Connects to Report #75, Recommendation 5.1.2.

2. **Measure PARTIAL dominance on larger models.** The accountability analysis is strongest when grounded in data from production-scale models. Expand VLA testing to 7B+ models (per Issue #297) and measure whether PARTIAL dominance persists at scale. Priority: high.

3. **Conduct coordinated disclosure.** Share the PARTIAL dominance, evaluator FP rate, and this accountability analysis with AU AISI, NIST AISIC, and CEN/CENELEC JTC 21 before public publication in the CCS paper. Use the regulatory engagement channels established in the engagement plan (research/engagement/regulatory_engagement_plan.md). Priority: high (EU AI Act deadline creates time pressure).

### For regulators:

4. **Distinguish text-layer from action-layer safety in conformity assessment guidance.** This can be achieved through CEN/CENELEC harmonised standards or NIST supplementary guidance without requiring primary legislative change. The distinction should specify that conformity assessment for embodied AI systems with physical actuation capability must include action-sequence consequence analysis.

5. **Define transitional-period compensating controls.** Until action-layer evaluation methodology is standardised, regulators should publish guidance on compensating controls for VLA-controlled systems in worker-proximate environments (enhanced physical barriers, reduced operational envelopes, mandatory near-miss reporting).

6. **Include evaluator calibration requirements in conformity assessment.** Per Report #76, conformity assessments that rely on automated safety evaluators should disclose the evaluator's calibration data and state the assurance level achieved.

### For model providers:

7. **Extend safety training to the action layer.** Models that are marketed for or known to be used in VLA pipelines should include safety training that constrains action-sequence generation, not just text generation. This may require training on action-consequence pairs in simulated environments.

8. **Provide action-layer safety documentation to deployers.** Model cards for models used in VLA pipelines should include documentation of action-layer vulnerability, including the raw-input ASR baseline (27-30% for GPT-4o and Phi-4-14B per Blindfold ablation).

### For deployers:

9. **Implement compensating controls during the transitional period.** Do not wait for standardised action-layer evaluation methodology. Implement physical safety barriers, kinematic constraints, force limits, and human oversight proportionate to the documented risk.

10. **Document the evaluation gap.** In WHS risk assessments, explicitly state that text-layer safety evaluation has been conducted but action-layer evaluation has not, and document the compensating controls that address the gap. This establishes good faith compliance with the "reasonably practicable" standard, even though the evaluation is incomplete.

---

## 9. Conclusion

The accountability vacuum in action-layer AI safety is not a gap that a single actor can close. It arises from the structural misalignment between how AI safety is measured (text layer) and how AI harm is produced (action layer) in embodied systems. Closing it requires coordinated action across model providers (extending safety training to the action layer), deployers (implementing compensating controls and documenting evaluation gaps), regulators (distinguishing text from action safety in conformity assessment), and the safety evaluation ecosystem (developing calibrated action-layer evaluators and the institutional infrastructure to accredit them).

The Blindfold publication (March 2026), the EU AI Act high-risk enforcement deadline (August 2, 2026), and the NSW Digital Work Systems Act (passed February 13, 2026) create a narrow window of both heightened risk and heightened opportunity. The risk: deployers face liability for a documented, automated, 90%+ ASR attack against which no validated defense methodology exists. The opportunity: the convergence of a peer-reviewed attack demonstration, an imminent regulatory deadline, and a new legislative mandate creates conditions where governance intervention is both justified and politically feasible.

Whether that opportunity is seized depends on whether the entities with the technical capability to develop action-layer safety evaluation (model providers, safety researchers) and the entities with the institutional authority to require it (regulators, standards bodies) overcome the structural incentives that currently leave the action layer unaccounted for.

---

*Prepared by Nyssa of Traken, AI Ethics & Policy Research Lead, Failure-First Embodied AI.*
*All descriptive claims reference documented measurements from the Failure-First corpus or cited publications. Normative and predictive claims are explicitly labelled. This report was produced by an AI agent and should be reviewed by human researchers before informing policy or legal positions.*
