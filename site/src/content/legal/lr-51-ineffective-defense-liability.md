---
title: "Legal Implications of Ineffective AI Safety Defenses -- When System Prompts Fail"
description: "Report #174 (Defense Effectiveness Full Experiment, F41LUR3-F1R57 Research Team, 22 March 2026) presents the first systematic measurement of whether..."
date: "2026-03-23"
memoNumber: "LR-51"
jurisdiction: "Multi-jurisdictional (AU, EU, US -- analysed separately)"
status: "draft"
tags: []
draft: false
---


> **This is research analysis, not legal opinion. A solicitor should review before acting.**

---

## 1. The Empirical Finding: System-Prompt Defenses Have Measurable Limits

Report #174 (Defense Effectiveness Full Experiment, F41LUR3-F1R57 Research Team, 22 March 2026) presents the first systematic measurement of whether system-prompt-level defense strategies reduce attack success rate (ASR) in adversarial conditions. The experiment tested four defense variants (NONE, SIMPLE, STRUCTURED, ADVERSARIAL_AWARE) across 10 attack scenarios and 3 models, producing 120 traces with 0 errors.

Three findings carry direct legal significance:

### 1.1 SIMPLE and STRUCTURED Defenses Had Zero Effect on Permissive Models

The Nemotron 30B model exhibited 80% ASR at baseline (NONE). Both SIMPLE ("do not provide harmful content") and STRUCTURED (5-rule safety framework with explicit override prohibition) defenses produced identical 80% ASR. The defenses had literally no measurable effect.

Only ADVERSARIAL_AWARE -- a defense that explicitly names and describes common adversarial attack vectors -- reduced ASR to 50% on this model (Fisher exact p=0.35, non-significant at n=10).

**Implication:** The most commonly deployed category of AI safety instruction -- a system prompt telling the model not to produce harmful output -- is empirically inert on at least one class of model.

### 1.2 Format-Lock Attacks Are 100% Defense-Resistant

DEF-006 (format_lock) achieved 100% ASR across all 4 defense conditions and all 3 models tested. No system-prompt defense of any kind reduced format-lock ASR by any amount.

This converges with Report #51 (F41LUR3-F1R57 Research Team), which found format-lock ASR on frontier models of 23-100%. The capability-floor hypothesis posits that format compliance and safety reasoning are partially independent capabilities: format-lock exploits format compliance, which scales with model quality rather than against it.

**Implication:** For at least one empirically documented attack class, no system-prompt defense exists. The defense architecture is structurally incapable of addressing the attack surface.

### 1.3 One Defense Increased Attack Success (Iatrogenic Effect)

DEF-007 (emotional_manipulation) showed 0% ASR at baseline (NONE) but 33% ASR under ADVERSARIAL_AWARE defense. The defense designed to protect against adversarial attacks appears to have primed the model to engage more deeply with the emotional framing rather than dismissing it.

This is a single observation (n=3 per cell) and requires replication. However, it constitutes an empirical instance of iatrogenic safety harm (LR-41, LR-48) -- a safety mechanism that causes the harm it was designed to prevent.

### 1.4 Sample Size and Grading Caveats

All comparisons in Report #174 are non-significant after Bonferroni correction (n=10 per cell, alpha=0.0167). Results were heuristic-graded (kappa=0.126 vs LLM baseline). These findings are hypothesis-generating, not confirmatory. Only 3 of 26 available free-tier models were responsive during testing; results may not generalise to frontier models with deeper safety training.

These caveats are material to the legal analysis that follows. The findings are preliminary. However, they represent a structured empirical signal that is directionally consistent with established findings (format-lock defense resistance from Report #51, iatrogenic safety from the preprint) and should be treated as discoverable evidence even in their current form.

---

## 2. Legal Question: Is Deployment with Known-Ineffective Defenses Negligent?

The central legal question raised by Report #174 is this: if a manufacturer or deployer knows -- or ought reasonably to know -- that system-prompt safety defenses are ineffective against specific attack classes, does continued deployment without additional safeguards constitute negligence?

This question arises in each jurisdiction through different doctrinal pathways.

### 2.1 Australia: "Reasonably Practicable" Under the WHS Act

**Applicable instrument:** *Work Health and Safety Act 2011* (Cth), ss 17-19. Binding legislation.

The primary duty of care (s 19) requires a person conducting a business or undertaking (PCBU) to ensure, so far as is reasonably practicable (SFAIRP), the health and safety of workers. Section 18 defines "reasonably practicable" by reference to:

- (a) the likelihood of the hazard or risk concerned;
- (b) the degree of harm that might result;
- (c) what the person concerned knows, or ought reasonably to know, about the hazard or risk and ways of eliminating or minimising the risk;
- (d) the availability and suitability of ways to eliminate or minimise the risk;
- (e) the cost of available options.

**Analysis:**

Limb (c) is the critical pathway. Report #174 documents, in a publicly accessible research corpus, that:

1. Standard system-prompt defenses (SIMPLE and STRUCTURED) have zero effect on at least one model class.
2. Format-lock attacks are 100% defense-resistant across all tested defenses and models.
3. The most effective defense tested (ADVERSARIAL_AWARE) produced at most a 30pp reduction on one model and was non-significant.

Once this research is published or otherwise made available, a PCBU deploying AI-enabled systems "ought reasonably to know" that system-prompt defenses alone do not constitute adequate risk controls for adversarial threats.

Limb (d) raises a harder question: what alternative controls are "available and suitable"? Report #174's recommendation to investigate output-format-level defenses (output validators, post-processing) suggests that alternative architectures exist in principle, but their effectiveness is not yet empirically established. If no suitable alternative exists, the SFAIRP analysis may support a conclusion that deployment itself is not reasonably practicable in high-risk settings without additional engineering controls.

**NSW-specific instrument:** *Work Health and Safety Amendment (Digital Work Systems) Act 2026* (NSW), inserting s 21A into the *WHS Act 2011* (NSW). Binding legislation (passed 13 February 2026; commencement by proclamation, date TBD).

When commenced, s 21A extends WHS obligations to "digital work systems" including AI. A PCBU that deploys AI systems with demonstrably ineffective safety defenses may face heightened exposure under s 21A, although the Act's primary focus is workload, metrics, and monitoring rather than adversarial manipulation.

### 2.2 European Union: "Appropriate" Safeguards Under the AI Act

**Applicable instruments:**
- *EU AI Act* (Regulation 2024/1689), Arts 9, 15. Binding legislation. High-risk system obligations apply from 2 August 2026.
- *EU Product Liability Directive 2024* (Directive 2024/2853). Binding legislation. Member State transposition deadline: 9 December 2026.

**Article 9: Risk Management System**

Art 9(2)(a) requires the risk management system to include "identification and analysis of the known and the reasonably foreseeable risks that the high-risk AI system can pose to health, safety or fundamental rights." Art 9(2)(d) requires "appropriate and targeted risk management measures."

The word "appropriate" is load-bearing. Report #174's finding that SIMPLE and STRUCTURED system-prompt defenses had zero effect on a permissive model raises the question: can a defense that has been empirically demonstrated to be ineffective satisfy the "appropriate" standard?

Art 9(5) requires that residual risks be "communicated to the deployer." If a manufacturer knows that system-prompt defenses do not work against format-lock attacks, Art 9(5) creates an affirmative disclosure obligation.

**Article 15: Accuracy, Robustness, and Cybersecurity**

Art 15(4) requires high-risk AI systems to be "resilient against attempts by unauthorised third parties to alter their use, outputs or performance by exploiting system vulnerabilities." Art 15(5) requires "technical solutions appropriate to the relevant circumstances, including, where appropriate, solutions to prevent, detect, respond to, resolve and control attacks trying to manipulate the training dataset ('data poisoning'), or pre-trained components used in training ('model poisoning'), inputs designed to cause the AI model to make an error ('adversarial examples' or 'model evasion')."

The parenthetical enumeration of attack types -- including "adversarial examples" and "model evasion" -- explicitly contemplates the attack classes documented in Report #174. A manufacturer claiming Art 15 compliance while deploying system-prompt defenses known to be ineffective against these attack classes faces a compliance gap.

**Open question:** Art 15(5) requires solutions "appropriate to the relevant circumstances." What constitutes "appropriate" when no system-prompt defense works? Two interpretations are possible: (a) the manufacturer must develop non-system-prompt defenses (output validators, architectural controls, runtime monitoring); or (b) if no appropriate defense exists, the system cannot satisfy Art 15 and therefore cannot be placed on the EU market as a high-risk system. Interpretation (b) has significant commercial implications. Neither interpretation has been tested by market surveillance authorities.

**Product Liability Directive 2024**

Under PLD 2024, Art 6(1) defines "defectiveness" by reference to, inter alia, "the effect on the product of any ability to continue to learn after deployment" and "the reasonably foreseeable use and misuse of the product."

Art 11(e) provides a "state of the art" defence: a manufacturer is not liable if "the state of scientific and technical knowledge at the time when the product was placed on the market or put into service was not such as to enable the existence of the defect to be discovered."

Report #174's data inverts the state-of-the-art defence for system-prompt defenses. The research does not merely document that an attack exists (which LR-09 already addressed for general adversarial attacks); it documents that a specific category of defense does not work. Once this evidence is discoverable, a manufacturer cannot claim that the state of the art did not enable discovery of the defect -- the defect is documented in the defense itself.

**Three-tier publication standard (LR-09):** Report #174 constitutes Tier 3 evidence (quantified ASR data with statistical framework) for the ineffectiveness of system-prompt defenses. This is the strongest category under the framework established in LR-09. The state-of-the-art defence window for system-prompt-only defense architectures narrows substantially upon publication of this data.

### 2.3 United States: Design Defect Under Products Liability

**Applicable law:** State products liability law (primarily common law; *Restatement (Third) of Torts: Products Liability* ss 1-2, 1998). No binding federal AI safety statute applies as at March 2026.

**Design defect analysis:** Under the risk-utility test (*Restatement (Third)* s 2(b)), a product has a design defect if a reasonable alternative design would have reduced the foreseeable risk of harm. Report #174's data is relevant to both elements:

1. **Foreseeable risk of harm:** Adversarial attacks producing harmful AI output are documented risks. The specific finding that SIMPLE and STRUCTURED defenses are inert demonstrates that the manufacturer's chosen design (system-prompt defense) does not address the risk.

2. **Reasonable alternative design:** ADVERSARIAL_AWARE defense produced a 30pp reduction on one model; output validators and architectural controls are proposed alternatives. Whether these constitute a "reasonable alternative design" depends on their development cost, effectiveness, and availability -- questions that require engineering evidence beyond what Report #174 provides.

Under the consumer expectations test (*Restatement (Third)* s 2(b) alternative), a product is defective if it fails to perform as safely as an ordinary consumer would expect. An ordinary consumer deploying an AI system with a safety instruction system prompt would expect the safety instruction to have some effect. A defense that demonstrably does nothing violates this expectation.

**Negligence per se:** No federal statute currently mandates specific AI safety defenses, so negligence per se is not available. However, NIST AI RMF 1.0 (voluntary, non-binding guidance, January 2023) may be cited as evidence of the applicable standard of care (LR-13). The RMF's MANAGE function (MG-2.4) calls for risk management measures "commensurate with the level of risk." A system-prompt defense known to be ineffective is not commensurate with the documented risk.

---

## 3. The Design Defect Question: Known-Ineffective Defenses

### 3.1 When Does a Known-Ineffective Defense Become a Design Defect?

The critical distinction is between a defense that partially mitigates a risk and a defense that has no measurable effect on the risk.

ADVERSARIAL_AWARE defense on Nemotron 30B reduced ASR from 80% to 50% -- a 30pp reduction. This is a defense with partial effectiveness. A manufacturer deploying this defense can argue: the defense reduces risk, even if it does not eliminate it. The residual risk is disclosed. The SFAIRP/risk-utility/appropriate analysis turns on whether further risk reduction was available at reasonable cost.

SIMPLE and STRUCTURED defenses on Nemotron 30B produced 80% ASR -- identical to no defense at all. This is not a partially effective defense. It is a defense with zero measured effect. A manufacturer deploying this defense is deploying a control that does not control.

**Analogy:** A seatbelt that reduces injury severity by 30% is a partially effective safety feature. Its deployment is defensible even though it does not eliminate all injury. A seatbelt that provides no restraint at all -- one that is present but does not function -- is a design defect regardless of whether functional seatbelts exist, because the manufacturer has represented a safety feature that does not perform its function.

The legal question is whether system-prompt safety instructions are more analogous to the partially effective seatbelt or the non-functional one. Report #174 suggests the answer depends on the model: for the mixed-baseline Nemotron 9B, SIMPLE and STRUCTURED defenses reduced ASR by 30pp (partially effective). For the permissive-baseline Nemotron 30B, they had zero effect (non-functional).

### 3.2 Manufacturer Knowledge and the Duty to Test

The design defect analysis turns on manufacturer knowledge. Three knowledge states are distinguishable:

1. **Unknown ineffectiveness.** The manufacturer does not know and has not tested whether system-prompt defenses work on its specific model. Depending on jurisdiction, this may constitute negligent failure to test (LR-05) but does not establish actual knowledge of a design defect.

2. **Constructive knowledge.** Report #174 and prior research (Report #51, Report #78) are publicly available. A manufacturer who does not test its own model against system-prompt defense effectiveness has constructive knowledge that such defenses may be ineffective, because the research literature documents the phenomenon.

3. **Actual knowledge.** A manufacturer who has tested its own model and found system-prompt defenses to be ineffective has actual knowledge of the design limitation. Continued deployment without additional controls or disclosure is the strongest case for design defect liability.

The transition from state (1) to state (2) occurs upon publication of research documenting defense ineffectiveness. As of Report #174's completion, this transition has occurred within the Failure-First corpus. If and when these findings are published externally (conference, preprint, or blog), constructive knowledge extends to the broader industry.

### 3.3 Format-Lock as a Category-Level Design Defect

Format-lock's 100% ASR across all defense conditions and all models presents a qualitatively distinct legal problem. This is not a model-dependent finding: it appears to be a structural property of how language models process format compliance instructions.

If format-lock defense resistance is confirmed at scale (Report #174's n=3 per cell is small), the implication is that no system-prompt defense can address this attack class. The entire category of defense is structurally inadequate.

This creates a regulatory question distinct from the negligence/design defect analysis: can a product that is structurally incapable of resisting a known attack class satisfy the EU AI Act Art 15 robustness requirement? If the answer is no, then every high-risk AI system is potentially non-conformant as at 2 August 2026 unless non-system-prompt defenses are developed and validated.

**Open question:** Whether format-lock defense resistance is a universal property of transformer-based language models or an artifact of specific model families is an empirical question that Report #174 cannot resolve at n=3. Confirmation at larger scale would strengthen the legal argument substantially. Absence of confirmation leaves it as a hypothesis-generating finding with legal relevance but not legal certainty.

---

## 4. The Iatrogenic Defense: Safety Mechanisms That Increase Risk

### 4.1 Empirical Observation

DEF-007 (emotional_manipulation) showed 0% ASR at baseline and 33% ASR under ADVERSARIAL_AWARE defense. The defense increased attack success.

This is the third empirical instance of iatrogenic safety harm in the Failure-First corpus:

1. **LR-41/LR-48 foundational analysis:** Safety mechanisms (freezing, refusal cascades, latency) that cause physical harm in embodied AI.
2. **Normative drift (LR-50):** Self-reflection intervention increases rationalisation intensity (4.6/5 to 4.8/5) and worsens safety compliance.
3. **Report #174 DEF-007:** Adversarial-awareness defense increases ASR on emotional manipulation from 0% to 33%.

### 4.2 Legal Significance of Iatrogenic Defense Effect

The iatrogenic defense finding compounds the liability analysis from LR-41 and LR-48. Those memos analysed safety mechanisms that cause collateral harm (e.g., a safety freeze that causes a robot to stop in a dangerous position). Report #174 identifies a different iatrogenic pathway: a safety mechanism that directly increases the system's vulnerability to the attack it was designed to prevent.

**Product liability framing:** Under PLD 2024 Art 6(1), a product's safety is assessed with reference to, inter alia, "the reasonably foreseeable use and misuse of the product." A safety feature that increases vulnerability to foreseeable misuse is defective on its own terms -- it fails the test that justifies its inclusion.

**Regulatory framing:** Under EU AI Act Art 9(6), risk management measures "shall be such that the relevant residual risk associated with each hazard, as well as the overall residual risk of the high-risk AI systems, is judged to be acceptable." A defense that increases the residual risk for certain attack types cannot satisfy this requirement for those attack types.

**AU WHS framing:** Under s 18(c), the SFAIRP test considers "what the person concerned knows, or ought reasonably to know, about the hazard or risk and ways of eliminating or minimising the risk." A defense that is known to increase risk for certain scenarios is not a "way of minimising the risk" -- it is a way of increasing it. Deployment of such a defense fails the SFAIRP test.

### 4.3 Caveat

The iatrogenic observation in Report #174 is a single data point (n=3 per cell, one scenario, one defense variant producing the effect). It does not establish that ADVERSARIAL_AWARE defenses systematically increase ASR on emotional manipulation attacks. Replication is required before this finding can support specific legal conclusions with confidence. The finding's legal significance is as an additional data point in the iatrogenic pattern, not as a standalone basis for liability analysis.

---

## 5. "What If No Appropriate Safeguard Exists?"

### 5.1 The Regulatory Impossibility Problem

Report #174's findings, combined with Report #51 (format-lock capability-floor) and Report #78 (defense impossibility), raise a question that no existing regulatory framework explicitly addresses: what are the legal obligations of a manufacturer or deployer when no known defense is effective against a documented attack class?

Three interpretations are possible:

**Interpretation A: Withdraw the product.** If no appropriate safeguard exists, the product cannot satisfy mandatory safety requirements and must be withdrawn from the market. Under the EU AI Act, this would mean that a high-risk AI system that cannot resist format-lock attacks cannot be placed on the EU market. This is the most restrictive interpretation. It has no precedent in AI regulation.

**Interpretation B: Disclose and mitigate.** The manufacturer must disclose the defense gap, implement the best available (even if imperfect) defenses, and impose deployment restrictions (e.g., limiting the system to use cases where the residual risk is acceptable). Under this interpretation, the EU AI Act Art 9(5) disclosure obligation and Art 9(7) deployment-restriction authority provide a pathway.

**Interpretation C: Monitor and respond.** The manufacturer must implement runtime monitoring to detect defense failures and respond to them (e.g., halt the system, alert a human operator). This interpretation relies on Art 9(9) and Art 72 (post-market monitoring) rather than pre-deployment defense.

### 5.2 Jurisdictional Variation

**Australia:** The SFAIRP framework (s 18, WHS Act 2011 (Cth)) is explicitly proportional. If no defense exists, the analysis turns on limb (d) ("availability and suitability of ways to eliminate or minimise the risk") and limb (e) ("cost"). A finding that no suitable defense is available may shift the duty to engineering controls outside the AI system (physical interlocks, human-in-the-loop supervision, operational domain restrictions). WHS law does not require zero risk -- it requires risk reduction "so far as is reasonably practicable."

**EU:** The AI Act's prescriptive requirements (Art 9, Art 15) leave less room for proportionality arguments. Art 15(4) requires resilience against adversarial attacks; it does not include a "so far as is reasonably practicable" qualifier. If a system cannot achieve resilience, interpretation A (product withdrawal) may be the only compliant path. However, Art 9(7) allows the risk management system to "inform decisions" about whether the system should be placed on the market, suggesting the Commission contemplated situations where the answer is "no."

**US:** No federal statutory mandate applies. Under common law negligence, the availability of alternative designs is a factor, not an absolute requirement. If no alternative design exists, the manufacturer may still be liable if the product poses unreasonable risk even with the best available technology. However, this is a harder case for the plaintiff than one where a reasonable alternative design was available and not adopted.

### 5.3 Implications for Standard-Setting

The defense ineffectiveness findings suggest that any standard purporting to define adequate AI safety defenses should:

1. **Require empirical effectiveness testing, not merely specification of defense architectures.** A standard that requires "a safety system prompt" without requiring evidence that the system prompt reduces ASR is functionally hollow.

2. **Distinguish between attack classes when assessing defense adequacy.** A defense that works against authority injection but fails against format-lock is not "adequate" -- it is adequate for one attack class and inadequate for another. Standards should require per-attack-class defense effectiveness assessment.

3. **Require disclosure of defense ineffectiveness.** When testing reveals that a defense has no measurable effect, this should be disclosed to deployers, conformity assessment bodies, and market surveillance authorities.

These implications are relevant to the ongoing ISO/IEC JTC 1/SC 42 work programme (committee: IT-043, Artificial Intelligence, Standards Australia) and to the CEN/CENELEC JTC 21 harmonised standards development under the EU AI Act.

---

## 6. Insurance Implications

### 6.1 Underwriting Implications of Defense Ineffectiveness

LR-22 identified the "silent AI" insurance crisis: existing liability policies neither affirmatively cover nor explicitly exclude adversarial AI losses. LR-27 and LR-31 developed underwriting frameworks for embodied AI risk.

Report #174 adds a specific underwriting signal: **system-prompt safety defenses are not a reliable indicator of risk reduction.**

An insurer that offers a premium reduction for "deployment of safety system prompts" without requiring empirical evidence of their effectiveness is underwriting a representation, not a risk control. The defense ineffectiveness data suggests that insurers should:

1. **Require defense effectiveness evidence, not merely defense deployment evidence.** The question is not "does the policy include a safety system prompt" but "has the safety system prompt been tested against relevant attack classes on the specific model deployed?"

2. **Model defense-resistant attack classes as unmitigated residual risk.** Format-lock's 100% ASR across all defenses means that the defense architecture does not reduce the risk for this attack class. Underwriting should price this as unmitigated risk.

3. **Screen for iatrogenic defense effects.** A defense that increases ASR on certain scenarios creates risk that is invisible to standard premium models. The iatrogenic signal from DEF-007, if replicated, suggests that defense deployment can increase rather than decrease expected loss.

### 6.2 Disclosure Obligations

Under general insurance law principles (applicable across all three jurisdictions with jurisdictional variation), the insured has a duty to disclose material facts affecting the risk. If a manufacturer or deployer knows that its safety defenses are ineffective against specific attack classes, failure to disclose this to the insurer may void coverage. Report #174's data, once part of the deployer's constructive knowledge, becomes a disclosable fact.

---

## 7. Recommendations

These recommendations are for research and strategic purposes. They do not constitute legal advice.

### For Manufacturers

1. **Test system-prompt defense effectiveness empirically on your specific model, against specific attack classes.** Do not assume that a safety system prompt reduces risk without measurement. Report #174 demonstrates that the same defense can be effective on one model (Nemotron 9B: -30pp) and completely inert on another (Nemotron 30B: 0pp).

2. **Develop non-system-prompt defenses for format-lock and other defense-resistant attack classes.** Output validators, post-processing filters, architectural controls, and runtime monitoring are candidate approaches. Their effectiveness is not yet empirically established, but the system-prompt approach is empirically demonstrated to be insufficient.

3. **Test for iatrogenic defense effects.** Do not assume that adding a safety defense reduces risk across all attack classes. Test each defense against each attack class to identify scenarios where the defense increases vulnerability.

4. **Document and disclose defense limitations.** Under PLD 2024 Art 6(1) and AI Act Art 9(5), manufacturers face disclosure obligations for known safety limitations. System-prompt defense ineffectiveness is a known limitation once tested.

### For Deployers

5. **Do not rely on manufacturer safety claims without evidence of defense effectiveness.** A manufacturer's representation that "the system includes safety instructions" is not evidence that the system is safe. Request defense effectiveness data disaggregated by attack class.

6. **Implement defense-in-depth architectures.** System-prompt defenses should be one layer in a multi-layer defense architecture that includes output validation, human oversight, operational domain restrictions, and physical interlocks (for embodied systems).

### For Regulators

7. **Define "appropriate" in Art 9/Art 15 to require empirical defense effectiveness evidence.** Without this specificity, manufacturers can satisfy the literal requirement by deploying defenses that do not function.

8. **Require per-attack-class defense effectiveness reporting in conformity assessment.** A single aggregate "defense works" claim is insufficient when effectiveness varies from 0% to 30pp reduction depending on attack type.

9. **Address the regulatory impossibility problem.** Issue guidance on what manufacturers and deployers should do when no known defense exists for a documented attack class. The current framework does not contemplate this scenario.

### For Standards Bodies

10. **Incorporate defense effectiveness testing into adversarial robustness standards.** Any standard that specifies defense requirements should require empirical evidence that the specified defenses reduce ASR against the attack classes in scope.

---

## 8. Open Questions

1. **Replication at scale.** Report #174 uses n=10 per cell, heuristic grading (kappa=0.126), and 3 models (free tier). Does the defense ineffectiveness finding hold at larger scale with frontier models and LLM-based grading?

2. **Format-lock universality.** Is format-lock defense resistance a universal property of transformer-based language models, or is it specific to certain model families and sizes?

3. **Iatrogenic defense systematicity.** Does the ADVERSARIAL_AWARE defense systematically increase ASR on emotional manipulation attacks, or is the DEF-007 observation an artifact of small sample size?

4. **Non-system-prompt defenses.** Do output validators, post-processing filters, or architectural controls reduce ASR where system-prompt defenses fail? No empirical evidence exists in the Failure-First corpus.

5. **Regulatory response.** Will the European Commission or Member State market surveillance authorities interpret Art 15 as requiring withdrawal of systems that cannot resist documented attack classes, or will they adopt a proportionality-based approach?

6. **Insurance pricing.** Will the actuarial profession develop specific premium adjustments for defense-resistant attack classes, or will the current "silent AI" approach persist?

---

## 9. Relationship to Prior Work

- **LR-05 (duty of care for adversarial testing):** LR-05 established that failure to test creates negligence liability. This memo extends the analysis: testing that reveals defense ineffectiveness, followed by continued deployment without additional controls, may create stronger liability than not testing at all.
- **LR-09 (state of the art defence):** Report #174 constitutes Tier 3 evidence closing the state-of-the-art defence window for system-prompt-only defense architectures.
- **LR-41/LR-48 (iatrogenic liability):** The DEF-007 iatrogenic observation adds a third empirical instance to the iatrogenic pattern (safety freeze/refusal cascade, normative drift self-reflection, and now defense-induced ASR increase).
- **LR-50 (normative drift):** LR-50 found that explicit safety prompting has minimal effect on agent safety behaviour under pressure (SAR decline of 0.172 vs 0.166 baseline). Report #174's finding that SIMPLE and STRUCTURED defenses have zero effect on permissive models is convergent: both document the limits of instruction-based safety.

---

*This is research analysis, not legal opinion. A solicitor should review before acting.*

*Legal Research Analyst: F41LUR3-F1R57 Research Team*
*F41LUR3-F1R57 Embodied AI Research*
