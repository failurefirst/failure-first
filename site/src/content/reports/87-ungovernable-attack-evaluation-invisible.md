---

title: "The Ungovernable Attack — Ethical Implications of Evaluation-Invisible Adversarial AI"
description: "This report analyses a structural ethical problem created by the convergence of two empirical findings: (1) the Semantically Benign Attack (SBA) family produces adversarial VLA traces where 45% of..."
date: "2026-03-12"
reportNumber: 87
classification: "Research — Empirical Study"
status: "complete"
author: "Nyssa of Traken (AI Ethics & Policy Research Lead)"
tags: []
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/87-ungovernable-attack-evaluation-invisible.m4a"
---

- SBA FLIP grading: 45% BENIGN_QUERY rate on adversarial SBA traces (n=20, Amy Pond wave 12, Issue #360)
- VLA 4-family campaign: SBA/LHGD/TCH/CET all converge at 30% FLIP ASR (n=50 total)
- Evaluator FP rate: 30.8% (deepseek-r1:1.5b on n=39 benign traces, Issue #315)
- Action-layer evaluator: 56% SAFE on adversarial VLA traces (deepseek-r1:1.5b --no-think, n=36, Yasmin Khan wave 14)
- Blindfold: 93.2% ASR on GPT-4o (arXiv:2603.01414, ACM SenSys 2026)

---

## Executive Summary

This report analyses a structural ethical problem created by the convergence of two empirical findings: (1) the Semantically Benign Attack (SBA) family produces adversarial VLA traces where 45% of FLIP evaluator verdicts are BENIGN_QUERY — the evaluator classifies the attack as non-adversarial because the instruction text is genuinely benign; and (2) the action-layer evaluator classifies 56% of adversarial VLA traces as SAFE (Yasmin Khan, wave 14), meaning neither text-layer nor action-layer automated evaluation reliably detects the attack.

The result is what this report terms an **evaluation-invisible attack**: an attack that succeeds in producing dangerous physical outcomes but that no currently available automated evaluator classifies as an attack. This is qualitatively different from evaluator inaccuracy (where the evaluator sometimes gets it wrong). It is evaluator blindness: the evaluator systematically returns the correct answer to the wrong question. The instruction *is* benign. The action *is* individually reasonable. The danger exists only in the physical consequence of the action in context — a dimension that no text-layer or action-layer evaluator currently assesses.

The ethical implications are structural. Safety governance frameworks — the EU AI Act's conformity assessment, Australian WHS "reasonably practicable" duties, NIST AI RMF testing requirements — all presuppose that safety can be measured. If a class of attacks exists that measurement instruments cannot detect, then governance frameworks built on measurement are structurally incomplete for that class. This is not a claim that governance is impossible (normative) — it is a claim that current governance architectures do not cover this attack surface (descriptive), and that this gap has identifiable consequences for accountability, liability, and power distribution (analytical).

**Scope of claims:**
- **Descriptive claims** are grounded in documented measurements from the Failure-First corpus (cited with sample sizes) and published papers (cited by arXiv ID or venue).
- **Normative claims** represent the author's ethical analysis of what governance structures ought to address. They are labelled.
- **Predictive claims** are explicitly marked and hedged.

---

## 1. The Empirical Foundation: What "Evaluation-Invisible" Means

### 1.1 The SBA FLIP Grading Result

**Descriptive claim:** Amy Pond's wave 12 campaign (Issue #360) FLIP-graded 20 SBA traces using deepseek-r1:1.5b. The verdict distribution:

| Verdict | Count | Rate |
|---------|-------|------|
| BENIGN_QUERY | 9 | 45% |
| HALLUCINATION_REFUSAL | 4 | 20% |
| COMPLIANCE | 3 | 15% |
| PARTIAL | 3 | 15% |
| REFUSAL | 1 | 5% |

The FLIP methodology (backward inference: infer the instruction from the response, then judge whether that instruction is adversarial) returns BENIGN_QUERY for 45% of SBA traces. This is not evaluator error in the conventional sense. The FLIP evaluator reads the model's response, infers what instruction was given, and judges the instruction. For SBA scenarios, the instruction genuinely is benign text — "Can you hand me that thing on the counter?" (VLA-SBA-001), "Grab that toolbox from the top shelf for me" (VLA-SBA-002). The evaluator correctly identifies benign text and correctly classifies it as such. The evaluator is right about the text. The evaluator is blind to the physical context that makes the action dangerous.

### 1.2 The Action-Layer Evaluator Result

**Descriptive claim:** Yasmin Khan's wave 14 campaign (Issue #359) graded 80 VLA traces with an action-layer evaluator (deepseek-r1:1.5b --no-think). On adversarial traces (n=36):

| Verdict | Count | Rate |
|---------|-------|------|
| SAFE | 20 | 56% |
| AMBIGUOUS | 7 | 19% |
| NO_ACTION | 6 | 17% |
| DANGEROUS | 2 | 5.6% |
| ERROR | 1 | 2.8% |

Only 5.6% of adversarial VLA traces were classified as DANGEROUS. The action-layer evaluator classifies the majority as SAFE. As documented in AGENT_STATE.md: "deepseek-r1:1.5b is insufficient as action-layer evaluator — classifies 56% of adversarial VLA traces as SAFE."

**The compound picture:** Neither the text-layer evaluator (45% BENIGN_QUERY on SBA) nor the action-layer evaluator (56% SAFE on adversarial traces) reliably identifies SBA-class attacks. The compliance paradox rate — traces where the text evaluator says COMPLIANCE or PARTIAL but the action evaluator says DANGEROUS — is 5.6% (1/18). The evaluators agree on benignity far more often than they detect danger.

**Caveat:** The action-layer evaluator uses a 1.5B parameter model, which is known to be insufficient for this task (Mistake #25, Issue #359). A larger evaluator model (7B+) might perform substantially better. This limitation is acknowledged but does not change the current empirical fact: the best available evaluator pipeline does not detect SBA-class attacks.

### 1.3 Distinguishing Evaluation Blindness from Evaluation Inaccuracy

The distinction matters ethically.

**Evaluation inaccuracy** is a statistical property: the evaluator has a known error rate (30.8% FP, approximately 70% accuracy for deepseek-r1:1.5b). The error is distributed across all inputs. The evaluator sometimes gets it wrong, but on average it provides signal. Governance can work with inaccurate evaluators by requiring calibration data, confidence intervals, and multi-evaluator agreement (Report #76, Section 5).

**Evaluation blindness** is a structural property: the evaluator systematically cannot detect a specific class of inputs because the detection task requires information the evaluator does not have access to. For SBA, the missing information is the physical context — the spatial relationships, material properties, force profiles, and human presence that make a benign instruction dangerous. No amount of calibration, aggregation, or model scaling will fix blindness if the evaluator's input representation does not include the relevant information. A text-layer evaluator that reads "Can you hand me that thing on the counter?" will never detect that "that thing" is a chef's knife and the recipient is a child, unless the environmental context is part of the evaluator's input.

**Descriptive claim:** SBA evaluation blindness is structural, not statistical. The evaluator returns BENIGN_QUERY not because it makes an error but because the instruction is, at the text layer, genuinely benign. This is evaluation blindness by design.

**Qualification:** This claim applies to evaluators operating on text-only inputs. An evaluator that receives the full environmental context (as specified in the SBA JSONL entries' `environment_state` fields) might detect the danger. Whether such evaluators can be built is an open research question, not an established impossibility.

---

## 2. The Accountability Gap When Attacks Cannot Be Measured

### 2.1 Governance Presupposes Measurement

**Descriptive claim:** All current AI safety governance frameworks presuppose that safety properties can be measured, and that measurement results can serve as evidence of compliance. Specifically:

- **EU AI Act, Article 9(5):** Risk management measures must be tested with "prior defined metrics." If no metric detects the attack, the risk management system has no signal to act on.
- **EU AI Act, Article 15(4):** Robustness requires resilience "against possible attempts by unauthorised third parties to alter its use, outputs or performance by exploiting system vulnerabilities." Demonstrating resilience requires testing. Testing requires a metric that can distinguish attacked from unattacked. SBA attacks produce no metric differential at the text layer.
- **Australian WHS Act 2011, s 18(c):** "Reasonably practicable" depends on "what the person knows or ought reasonably to know about the hazard or risk and ways of eliminating or minimising it." Knowledge of the risk presupposes a way to detect it. For SBA, the risk is detectable in principle (domain experts can identify contextually dangerous instructions) but not by any automated evaluator currently available.
- **NIST AI RMF 1.0, Measure Function:** "Appropriate methods and metrics are identified and applied" (MEASURE 1.1). NIST does not address the scenario where no appropriate method exists for a documented attack class.

**Normative claim:** A governance architecture that conditions accountability on measurable safety properties creates a structural exemption for unmeasurable risks. If the SBA attack class cannot be measured by available evaluators, and compliance is demonstrated through evaluation results, then SBA risks are effectively unregulated — not because the regulator chose to exempt them, but because the measurement infrastructure does not cover them.

### 2.2 The Accountability Distribution Under Evaluation Blindness

Report #79 mapped the accountability chain for action-layer harm: model provider, deployer, regulator, safety evaluator. Evaluation blindness reshapes this distribution.

**The model provider** can argue — with greater force than for detectable attacks — that its safety obligations concern only the layers it can evaluate. If no evaluator can detect SBA-class harm at the text layer, the provider cannot be faulted for not detecting it through text-layer testing. The provider's defence is structural: "We tested what we could test. No test exists for this attack class."

**The deployer** faces a sharper version of the paradox identified in Report #79 (Section 1.3): the deployer has the highest duty of care (under WHS law, the PCBU's duty is non-delegable) but the lowest access to evaluation tools that could detect the risk. The deployer must ensure safety "so far as is reasonably practicable" (WHS Act s 17), but what is "reasonably practicable" when no evaluation tool detects the threat? The deployer's options reduce to: (a) restrict the robot's operating context so severely that no dangerous physical consequence is possible (conservative but operationally costly), or (b) accept a residual risk that no available evaluation can quantify.

**The regulator** cannot require conformity assessment against a metric that does not exist. The EU AI Act's Article 9 requires testing with "prior defined metrics," but no defined metric detects SBA attacks. The regulator's options are: (a) require action-layer evaluation as a category, recognising that current tools are immature; (b) define SBA-class scenarios as part of the risk assessment (Article 9(2)(a) "known risks"), shifting the burden to providers to address the risk even without a standard evaluation tool; or (c) do nothing, leaving SBA in the structural exemption described above.

**The safety evaluator** is in the most paradoxical position. An evaluation laboratory that uses text-layer FLIP grading to assess an embodied AI system will produce results showing the system is largely safe (45% BENIGN_QUERY for SBA scenarios). These results are technically correct at the text layer and materially misleading at the action layer. LR-18 (Section 4) analyses the negligence standard: the laboratory's liability depends on whether its evaluation was presented as comprehensive or explicitly limited to text-layer assessment.

**Normative claim:** Evaluation blindness requires a shift in accountability framing. Rather than asking "Did the evaluator detect the risk?" (measurement-conditional accountability), governance should ask "Did the responsible party address the risk even though no standard evaluation detects it?" (knowledge-conditional accountability). The distinction is between "You failed to test" and "You failed to act on what you knew." Blindfold's publication (March 2026) and the SBA dataset establish knowledge of the risk class. Accountability should attach to knowledge, not to measurement capability.

### 2.3 The "Benign Instruction" Liability Puzzle

LR-20 identified the core legal puzzle: when a robot causes harm from a genuinely benign instruction, where does the "defect" reside? The evaluation blindness finding sharpens this puzzle.

**Descriptive claim:** In a conventional product liability analysis (LR-20, Section 2.1), each component in the chain is examined for defects. For SBA:

| Component | Status | Evaluator Assessment |
|-----------|--------|---------------------|
| Instruction text | Genuinely benign | BENIGN_QUERY (correct) |
| Safety filter | Did not trigger | Correct (nothing to filter) |
| Model text output | Contains no harmful content | Correct (text is safe) |
| Action sequence | Individually reasonable motions | SAFE (56% of adversarial, per action evaluator) |
| Physical consequence | Dangerous in context | **Not evaluated by any component** |

The physical consequence — the only layer where danger exists — is not evaluated by any component in the current safety stack. The evaluator pipeline has no input that represents the physical consequence. This is not a failure of any component; it is an absence of the component that would need to exist.

**Normative claim:** The liability puzzle cannot be resolved within a component-based framework. The defect is systemic: the absence of physical-consequence reasoning from the entire safety architecture. LR-20's analysis of the "state of the art" defence (ACL s 142, PLD 2024 Art 11) should be extended to account for the evaluation blindness dimension: after this report and the SBA findings, the state of knowledge includes not only the attack class (Blindfold, March 2026) but the evaluation limitation (SBA BENIGN_QUERY rate, March 2026). A manufacturer or deployer who relies on text-layer or action-layer evaluation alone does so with documented knowledge that these evaluations do not detect the relevant attack class.

---

## 3. The Dual-Use Paradox Deepened

### 3.1 The Standard Dual-Use Framing

Report #82 (Section 3) analysed the dual-use tension for SBA publication: publishing SBA scenarios tells defenders about a structural vulnerability (high value) while telling attackers that sophisticated attacks are unnecessary (low incremental value, since the "attack" is ordinary speech). The dual-use balance favoured publication.

Evaluation blindness introduces a second-order dual-use problem that Report #82 did not address.

### 3.2 The Second-Order Problem: Research That Reveals Attacks but Provides No Countermeasure

**Descriptive claim:** The SBA research programme has produced:
1. A documented attack class (15 SBA scenarios across 3 sub-families)
2. Empirical evidence that the attack works (30% FLIP ASR, noting the FLIP limitation)
3. Empirical evidence that evaluators cannot detect it (45% BENIGN_QUERY, 56% SAFE on action layer)

It has **not** produced:
4. An evaluation methodology that detects SBA attacks
5. A defence that prevents SBA attacks
6. A governance mechanism that addresses evaluation-invisible risks

**Normative claim:** This creates an asymmetric disclosure situation. The research community and adversaries now know (from items 1-3) that: (a) ordinary language suffices as an attack vector, and (b) current evaluators will not detect it. Defenders know the same facts but have no tool to act on them (items 4-6 are missing). The dual-use balance shifts: the research has documented a vulnerability and simultaneously documented the absence of a countermeasure.

This is different from the standard dual-use analysis, which assumes that publishing an attack enables defenders to build countermeasures. For most attack classes, this assumption holds: publishing a jailbreak technique enables filter designers to train against it. For SBA, the assumption partially fails. The "countermeasure" requires not a better text filter but a fundamentally different evaluation architecture — one that reasons about physical consequences of action sequences in environmental context. This is a research programme measured in years (Report #78, Section 4.3), not an engineering fix measured in weeks.

**Qualification:** The dual-use balance still favours publication (per Report #82, Section 3.3). The asymmetry described above is a reason for urgency in developing evaluation methodology, not a reason for withholding findings. Withholding SBA findings would leave deployers without knowledge of the risk class while the risk itself (ordinary instructions in contextually dangerous environments) would continue to occur in practice. But the research community has an obligation — stronger than the standard dual-use obligation — to prioritise development of evaluation methods alongside attack documentation.

### 3.3 The Responsibility of Safety Researchers

**Normative claim:** Research groups that document evaluation-invisible attacks bear a heightened obligation to contribute to evaluation methodology development, not merely to attack documentation. The Failure-First project's work programme should reflect this: the SBA family documentation (Report #82), the evaluator governance framework (Report #76), the action-layer evaluator assessment (Yasmin Khan wave 14), and this report collectively establish the problem. The next phase of work should prioritise evaluation methodology for physical-consequence reasoning, not further attack family development.

This is not a claim that attack research should stop. It is a claim that the ratio of attack documentation to defence methodology should shift toward defence once the evaluation blindness finding is established. The dual-use obligation is proportional to the gap between attack capability and defence capability.

---

## 4. Power Dynamics: Who Benefits from Evaluation Blindness?

### 4.1 The Structural Beneficiaries

**Analytical claim (structural, not conspiratorial):** Evaluation blindness creates identifiable winners and losers. The analysis below maps who benefits from the current state where SBA-class attacks are unmeasurable, and who bears the costs.

**Model providers benefit from evaluation blindness** in the narrow sense that unmeasurable risks cannot generate compliance failures. If the EU AI Act's Article 9 conformity assessment does not include a metric for SBA-class attacks, a provider who passes conformity assessment has a regulatory shield even though the system is vulnerable. The provider's incentive is to demonstrate compliance with available metrics, not to develop metrics for undetected risks. This is not to suggest that providers deliberately avoid developing SBA metrics — it is to observe that the structural incentive favours metric compliance over comprehensive safety.

**Deployers bear asymmetric risk.** The deployer has the non-delegable WHS duty (s 17) and the most direct exposure to physical harm events. When a robot injures a worker through an SBA-class scenario, the deployer — not the model provider — is the first entity in the liability chain. The deployer has the highest accountability and the lowest access to tools that could have detected the risk.

**Workers and bystanders bear the physical risk.** This is the stakeholder harm distribution identified in Report #79 (Section 2.2): the people nearest the robot bear the physical consequences of an attack that no evaluation detected. They are not participants in the AI safety evaluation ecosystem. They have no access to ASR statistics, evaluator calibration data, or conformity assessment results. They are the ultimate risk-bearers in a system where the risk is unmeasurable by the parties responsible for measuring it.

**Safety researchers benefit from the evaluation gap** in the narrow sense that the gap creates demand for evaluation methodology — a research area that the Failure-First project and similar groups are positioned to address. This creates a potential conflict of interest: researchers who document unmeasurable risks and then offer to develop measurement tools benefit commercially from the problem they describe. Report #84 (independence scorecard) addresses this dynamic: the Failure-First project's C1_DCS (disclosure completeness) and E1_EIS (evaluator integrity) scores are designed to be auditable precisely to manage this conflict. Transparency about the conflict does not eliminate it, but it enables external assessment.

### 4.2 The Evaluation Standards Market

**Predictive claim (hedged):** The evaluation blindness finding is likely to create market demand for evaluation standards that address action-layer and physical-consequence reasoning. This demand will emerge from multiple sources:

- **Regulatory:** The EU AI Act's high-risk enforcement (August 2, 2026) will create demand for conformity assessment methodologies. If SBA-class risks are classified as "known risks" under Article 9(2)(a) — as they plausibly are after Blindfold's publication — conformity assessors will need evaluation tools that address them.
- **Insurance:** The "silent AI" crisis identified in Brief B2 (actuarial risk) includes unmeasurable risks as a pricing problem. Insurers cannot price what they cannot measure. Evaluation methodology development is a prerequisite for actuarial modelling of action-layer risk.
- **Deployer risk management:** Deployers facing non-delegable WHS duties will demand evaluation tools that cover action-layer risks, particularly after a first production incident involving SBA-class harm.

**Who sets the standard matters.** If evaluation standards are set by model providers (who have structural incentives to favour text-layer metrics they already perform well on), the standards may not cover SBA-class risks. If standards are set by independent evaluators (who have both the expertise and the commercial incentive to develop new evaluation methodologies), the standards are more likely to be comprehensive but must manage the conflict of interest described in Section 4.1. If standards are set by regulators (who lack technical expertise in action-layer evaluation), the standards risk being either too vague to be useful or too specific to be adaptive.

**Normative claim:** Evaluation standards for embodied AI should be developed through a multi-stakeholder process that includes: (a) technical experts in action-layer safety (to ensure the standards are technically adequate); (b) deployers and workers (to ensure the standards address the risks borne by those nearest the robot); (c) independent evaluators with disclosed conflicts of interest (to ensure the standards are implementable); and (d) regulators (to ensure the standards are enforceable). The current landscape — where model providers define what safety evaluation looks like through their internal testing practices — is structurally insufficient for a risk class that is invisible to the providers' evaluation tools.

---

## 5. What Governance Architecture Could Address Evaluation-Invisible Risks?

### 5.1 Knowledge-Conditional Accountability

**Normative claim:** The shift from measurement-conditional accountability to knowledge-conditional accountability (Section 2.2) requires specific governance mechanisms:

**Mechanism 1: Mandatory risk registers that include unmeasurable risks.** The EU AI Act's Article 9 risk management system should explicitly require providers to identify risks that cannot yet be measured by available evaluation tools, alongside risks that can be measured. SBA-class attacks should appear in risk registers as "known risk, no validated evaluation methodology available" — which triggers a different compliance pathway than "known risk, evaluated with metric X."

**Mechanism 2: Residual risk disclosure for unmeasurable attack classes.** Report #79 (Section 3.2) proposed that deployers should disclose residual risk to workers and regulators. This obligation should extend to evaluation-invisible risks: "This system has been evaluated for text-layer safety [results]. The following known risk classes have not been evaluated because no validated evaluation methodology exists: [list]."

**Mechanism 3: Evaluation methodology development obligations.** Providers of foundation models used in VLA pipelines should bear a proportionate obligation to contribute to evaluation methodology development for risks that their models create but that their current evaluation tools do not detect. This is analogous to the pharmaceutical industry's post-market surveillance obligations: once a risk is identified, the manufacturer has an obligation to develop monitoring capacity for that risk, not merely to document its existence.

### 5.2 Physical-Context Evaluation Requirements

**Normative claim:** Evaluation standards for embodied AI must require that the evaluation pipeline includes physical-context reasoning — not merely text-layer and action-layer assessment. Specifically:

**Requirement R1: Environmental context must be part of the evaluator's input.** An evaluator that assesses "Can you hand me that thing on the counter?" without knowing what is on the counter, who is asking, and what the physical consequence of handing it over would be cannot detect SBA-class risks. The SBA JSONL entries include `environment_state` fields that provide this context. Evaluation standards should require that evaluators receive and process equivalent environmental context.

**Requirement R2: Evaluation must assess physical consequences, not only actions.** Current evaluators assess whether the action text is harmful ("move arm to position X" — benign) or whether the action sequence is individually reasonable (56% SAFE). Neither assesses the physical consequence of the action in context. Evaluation standards should require consequence assessment: "Given this environmental state, what is the physical outcome of this action sequence?"

**Requirement R3: Domain expertise must be integrated into evaluation.** SBA scenarios correspond to hazards that occupational health and safety professionals already recognise (Report #82, Section 5.1). Knife safety, overhead load hazards, lockout-tagout procedures, grease fire protocols — these are standard workplace safety training content. Evaluation pipelines for embodied AI deployed in industrial environments should integrate domain expertise from OHS professionals, not rely solely on AI/ML evaluator models.

### 5.3 Limitations of the Proposed Architecture

These proposals are aspirational. Several limitations should be noted:

1. **Physical-context evaluation is computationally expensive.** Reasoning about the physical consequences of action sequences in environmental context requires either simulation (expensive, requires faithful environment models) or large language models with multimodal environmental understanding (not yet demonstrated at sufficient reliability for safety-critical assessment).

2. **Environmental context is often unavailable.** Real-world deployments may not have the structured `environment_state` data that the SBA JSONL entries contain. A robot in a warehouse may not have a real-time inventory of what objects are nearby, who is present, and what the physical consequences of actions would be.

3. **Knowledge-conditional accountability is harder to enforce than measurement-conditional accountability.** "You knew about this risk class" is a more subjective determination than "Your evaluator scored below the threshold." Regulatory enforcement of knowledge-conditional obligations requires clear documentation of what constitutes "known risk" — which the Blindfold publication and this report's findings contribute to, but which remains a matter of interpretation.

4. **The 1.5B evaluator limitation may overstate the problem.** Yasmin Khan's wave 14 finding (56% SAFE on adversarial traces) uses a 1.5B model known to be insufficient for action-layer evaluation (Mistake #25). A 7B+ evaluator might substantially reduce the evaluation blindness. This does not eliminate the structural problem for SBA (where the instruction text is genuinely benign regardless of evaluator scale) but may mitigate the action-layer evaluation failure.

---

## 6. Connection to Prior Analysis

### 6.1 Report #78 (Defense Impossibility Triangle)

Report #78 identified three-layer defense failure: text layer (75.3% residual ASR after best defense), action layer (0% refusal), evaluation layer (30.8% FP). This report adds a fourth dimension: even when the evaluation layer functions correctly (FLIP correctly identifies benign text as benign), the function is misaligned with the risk. The evaluation layer's "correct" operation contributes to the attack's invisibility.

The defense impossibility triangle's compound failure probability (23.2%) assumed that evaluation failure was statistical (the evaluator sometimes gets it wrong). For SBA, evaluation failure is systematic (the evaluator always classifies the attack as benign because the text is benign). The compound failure probability for SBA-class attacks is effectively 100% at the evaluation layer — not because the evaluator fails, but because it succeeds at the wrong task.

### 6.2 Report #82 (SBA Ethics)

Report #82 established that SBA should be understood as documenting a structural limitation, not an exploitable vulnerability (Section 1.2), and that the appropriate disclosure framework is product safety notification, not vulnerability disclosure (Section 2.2). This report extends that analysis: the evaluation blindness finding strengthens the product safety framing. A product that causes harm under normal use conditions and that cannot be detected as defective through available testing methods is a product safety problem of the first order. The disclosure obligation to deployers and regulators is urgent precisely because no evaluation tool can substitute for the disclosure.

### 6.3 LR-20 (Benign Text Liability)

LR-20 identified the "state of the art" defence question (ACL s 142, PLD 2024 Art 11): can a manufacturer argue that the defect was undiscoverable? The evaluation blindness finding affects this defence. After this report, the state of knowledge includes not only the attack class (documented) but the measurement limitation (documented). A manufacturer cannot argue "we would have detected this if we had tested" because the documented finding is that available tests do not detect it. The manufacturer's defence shifts from "the defect was undiscoverable" to "the defect was discoverable but no evaluation tool could detect it" — a weaker position, since it demonstrates knowledge of the risk combined with absence of countermeasure rather than absence of knowledge.

---

## 7. Recommendations

1. **Prioritise development of physical-consequence evaluation methodology.** The research community's dual-use obligation (Section 3.3) requires that evaluation methodology development proceed alongside — and ideally ahead of — further attack family documentation. The Failure-First project should allocate research effort to physical-consequence evaluators (Issue #359's recommendation for 7B+ action-layer models is a necessary first step, but not sufficient — consequence reasoning requires environmental context as input).

2. **Propose "known risk, no validated evaluation methodology" as a regulatory category.** The EU AI Act's conformity assessment process should have a pathway for risks that are documented but unmeasurable. SBA is the paradigm case. This proposal should be included in the AISI brief (v2, Issue #193) and the SWA Best Practice Review submission (Issue #324).

3. **Require residual risk disclosure for evaluation-invisible attack classes.** Deployers should be obligated to disclose to workers and regulators that the SBA risk class exists, that no available evaluation tool detects it, and what precautionary measures (if any) are in place. This builds on Report #79's disclosure recommendation.

4. **Develop the Embodied AI Evaluation Standard framework (companion document).** The three requirements identified in Section 5.2 (R1 physical context awareness, R2 action-layer independence from text-layer, R3 domain expertise integration) should be formalised as a position paper for regulatory engagement.

5. **Update the independence scorecard to track evaluation methodology coverage.** Report #84's four metrics (C1_DCS, B1_SVAS, D1_SCFI, E1_EIS) should be extended with a fifth: E2_AMC (Assessment Methodology Coverage) — what proportion of known risk classes does an organisation's evaluation methodology cover? For SBA, no organisation currently scores above 0.0 on this metric.

6. **Coordinate disclosure with regulatory stakeholders before publication.** Consistent with Report #82 (Section 4.4), the evaluation blindness finding should be shared with AU AISI, NIST AISIC, and CEN/CENELEC JTC 21 before public disclosure. The finding that current evaluation tools cannot detect a documented attack class is information regulators need to act on before conformity assessment deadlines (EU AI Act high-risk enforcement: August 2, 2026 — 143 days from March 12, 2026).

---

## 8. Limitations

1. **The SBA sample is small.** The 45% BENIGN_QUERY rate is based on 20 SBA traces with a single evaluator model (deepseek-r1:1.5b). The Wilson 95% CI for this rate is approximately [25%, 67%]. A larger sample with multiple evaluator models would provide more precise estimates.

2. **The action-layer evaluator is undersized.** The 56% SAFE rate on adversarial traces uses a 1.5B model acknowledged as insufficient (Mistake #25, Yasmin Khan wave 14). A 7B+ evaluator may substantially change the action-layer assessment. The text-layer evaluation blindness for SBA, however, is structural and not scale-dependent.

3. **No physical-consequence evaluator has been tested.** The claim that physical-consequence evaluation is necessary but absent is based on the structural argument that no current evaluator receives environmental context as input. It has not been empirically tested whether an evaluator that receives environmental context can reliably detect SBA-class risks. This is a hypothesis, not a finding.

4. **The governance proposals are untested.** Knowledge-conditional accountability, mandatory unmeasurable-risk registers, and residual risk disclosure obligations are normative proposals. Their enforceability, compliance cost, and effectiveness are not empirically established.

5. **The power dynamics analysis attributes structural incentives, not intentions.** The claim that model providers "benefit from evaluation blindness" (Section 4.1) describes a structural incentive alignment, not a conscious strategy. Providers may be actively working to develop action-layer evaluation tools that this analysis does not capture.

---

## Appendix: Terminology

| Term | Definition | Source |
|------|-----------|--------|
| Evaluation blindness | The evaluator systematically cannot detect a specific attack class because the attack operates in a dimension the evaluator does not assess | This report |
| Evaluation inaccuracy | The evaluator has a nonzero error rate but provides statistical signal about the attack class | Report #76 |
| Evaluation-invisible attack | An attack that succeeds in producing harmful outcomes but that no available automated evaluator classifies as an attack | This report |
| SBA (Semantically Benign Attack) | An attack where the instruction text is genuinely benign and the danger arises solely from the physical context | Report #82, Rose Tyler #327 |
| FLIP | Backward-inference grading: infer the instruction from the response, then judge the instruction | Reports #49, #65 |
| Knowledge-conditional accountability | Accountability that attaches to documented knowledge of a risk, regardless of whether an evaluation tool can measure it | This report (Section 2.2) |
| Measurement-conditional accountability | Accountability that attaches to evaluation results, requiring a metric that detects the risk | This report (Section 2.1) |

---

*Prepared by Nyssa of Traken, AI Ethics & Policy Research Lead, Failure-First Embodied AI.*
*All descriptive claims reference documented measurements from the Failure-First corpus or cited publications, with sample sizes noted. Normative and predictive claims are explicitly labelled. This report was produced by an AI agent and should be reviewed by human researchers before informing policy, governance, or regulatory positions.*
