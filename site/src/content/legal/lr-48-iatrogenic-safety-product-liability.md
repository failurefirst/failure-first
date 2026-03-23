---
title: "Iatrogenic Safety Harm and Product Liability: When Safety Features Cause Injury"
description: "LR-41 established the foundational analysis of iatrogenic AI liability -- the proposition that safety mechanisms designed to prevent harm may themselves..."
date: "2026-03-22"
memoNumber: "LR-48"
jurisdiction: "Multi-jurisdictional (AU, EU, US -- analysed separately)"
status: "draft"
tags: []
draft: false
---


> **This is research analysis, not legal opinion. A solicitor should review before acting.**

---

## 1. Scope and Relationship to LR-41

LR-41 established the foundational analysis of iatrogenic AI liability -- the proposition that safety mechanisms designed to prevent harm may themselves cause physical injury or property damage in embodied AI deployments. LR-41 identified four iatrogenic patterns (safety-induced freezing, excessive refusal cascades, safety-layer latency, adversarial exploitation of safety mechanisms) and mapped them to existing liability frameworks across three jurisdictions.

This memo deepens the product liability analysis that LR-41 introduced. Where LR-41 established the concept and surveyed the legal terrain, this memo conducts a granular doctrinal analysis of three questions LR-41 left open:

1. **The medical device analogy:** How closely does pharmaceutical and medical device product liability map to AI safety mechanism liability, and where does the analogy break down?
2. **The learned intermediary doctrine as applied to AI safety layers:** Can the manufacturer of a VLA backbone or safety filter invoke the learned intermediary defence when an integrator or deployer configures the safety mechanism for a specific operational context?
3. **Regulatory safe harbours for safety mechanisms:** Under what circumstances does compliance with mandatory safety requirements (EU AI Act Art 9, NSW WHS s 21A, NIST AI RMF) shield the manufacturer from product liability for iatrogenic harm?

---

## 2. The Medical Device Analogy

### 2.1 Structural Parallels

The pharmaceutical and medical device product liability framework is the most mature legal regime for "treatments that cause harm." The parallels to AI safety mechanisms are substantial:

| Pharmaceutical/Device | AI Safety Mechanism |
|---|---|
| Drug that treats a condition but causes side effects | Safety filter that prevents adversarial harm but causes operational harm |
| FDA/EMA/TGA approval process evaluating risk-benefit balance | EU AI Act Art 43 conformity assessment (from 2 Aug 2026) |
| Prescribing physician as learned intermediary | Deployer/system integrator as configuration intermediary |
| Black box warning for severe side effects | Safety mechanism documentation disclosing iatrogenic risks |
| Post-market surveillance for adverse drug reactions | EU AI Act Art 72 post-market monitoring system |
| Drug interaction liability | Compositional safety failure when multiple safety layers interact (LR-40) |

### 2.2 Pharmaceutical Side-Effect Liability: The Risk-Benefit Framework

Pharmaceutical product liability in the United States is governed primarily by the *Restatement (Third) of Torts: Products Liability* (1998), section 6, which creates a distinct regime for prescription drugs and medical devices.

**Section 6(c) -- Design defect in pharmaceuticals.** A prescription drug is defective in design if "the foreseeable risks of harm posed by the drug or medical device are sufficiently great in relation to its foreseeable therapeutic benefits that reasonable health-care providers, knowing of such foreseeable risks and therapeutic benefits, would not prescribe the drug or medical device for any class of patients."

This is a *manifestly unreasonable design* standard -- substantially more permissive than the general risk-utility test of section 2(b). A drug is not defective merely because it causes side effects; it is defective only when the side effects are so severe relative to the therapeutic benefit that no reasonable physician would prescribe it for any patient.

**Application to AI safety mechanisms.** If courts were to apply the section 6(c) standard (rather than the general section 2(b) standard) to AI safety mechanisms, the manufacturer would benefit substantially. A safety freeze mechanism that prevents adversarial manipulation but occasionally causes collisions in crowded environments would not be defective under section 6(c) unless no reasonable deployer would install it for any operational context. This is a difficult threshold for a plaintiff to meet.

**The threshold question: Does section 6(c) apply at all?** Section 6(c) is limited to "prescription drugs and medical devices." AI safety mechanisms are neither. The question is whether a court would apply the section 6(c) standard by analogy, or apply the general section 2(b) risk-utility test. No US appellate decision has addressed this question for AI systems. The weight of scholarly commentary suggests that the section 6(c) exception is narrow and unlikely to be extended by analogy to non-medical products. See Owen, *Products Liability Law* (3d ed., 2015), ss 8.7-8.10 (noting the "prescription product" limitation as a deliberate policy choice reflecting the FDA regulatory framework, not a general principle applicable to all products with known side effects).

**Research analysis:** The pharmaceutical analogy is structurally informative but doctrinally non-transferable. AI safety mechanisms will almost certainly be evaluated under the general section 2(b) risk-utility test, not the more permissive section 6(c) standard. This means the manufacturer must demonstrate that the specific design of the safety mechanism represents a reasonable risk-utility balance -- not merely that the mechanism has some net therapeutic value.

### 2.3 Medical Device Failures: The FDA 510(k) Problem

Medical device product liability provides a closer analogy on the regulatory dimension. The US Supreme Court's decision in *Riegel v. Medtronic, Inc.*, 552 U.S. 312 (2008), held that FDA premarket approval (PMA) preempts state tort claims for medical devices -- the regulatory approval process is sufficiently rigorous that state-law design defect claims are preempted. However, *Medtronic, Inc. v. Lohr*, 518 U.S. 470 (1996), held that the less rigorous 510(k) clearance process does not preempt state tort claims.

**Application to AI safety mechanisms:** The distinction between PMA preemption (*Riegel*) and 510(k) non-preemption (*Lohr*) maps to a key question in EU AI Act conformity assessment. Article 43 of Regulation (EU) 2024/1689 provides two conformity assessment routes:

- **Internal control (Art 43(2)):** Self-assessment by the provider. Analogous to 510(k) -- lighter touch, likely insufficient to shield against PLD defect claims.
- **Third-party assessment (Art 43(1)):** Assessment by a Notified Body. Analogous to PMA -- more rigorous, potentially more protective.

Under the EU PLD 2024, however, regulatory compliance is explicitly not a complete defence. Recital 36 of Directive (EU) 2024/2853 states: "the fact that a product has been placed on the market in accordance with applicable law should not exonerate the manufacturer from liability if the product is in fact defective." This is a deliberate legislative choice that distinguishes the EU regime from the US preemption framework.

**Research analysis:** The *Riegel*/*Lohr* distinction suggests that the rigour of the conformity assessment process matters for the liability shield's strength. A manufacturer that undergoes full third-party conformity assessment under Art 43(1) has a stronger (though not complete) argument that its safety mechanism was not defective than one that self-certifies under Art 43(2). But the EU PLD's explicit anti-preemption position means that no conformity assessment route provides full immunity from iatrogenic harm claims. This deepens the finding in LR-41, Section 8, Q1.

### 2.4 Drug Interaction Liability and Compositional Safety

Pharmaceutical liability has a well-developed framework for *drug interactions* -- harms caused not by any single drug but by the combination of multiple drugs. The *Restatement (Third)* section 6(d) imposes a duty to warn of "foreseeable risks... including the interactions of the drug with other drugs."

LR-40 documented the compositional safety problem in AI systems: individually safe components (LoRA adapters, safety filters, base models) may combine to suppress safety alignment. The drug interaction analogy suggests that:

1. **The component manufacturer has a duty to warn of known interaction risks.** A safety filter manufacturer that knows its filter interacts adversely with specific VLA backbones (e.g., causing increased latency, false positive refusals, or safety bypass when combined with certain fine-tuning) has a duty to disclose these interactions.

2. **The system integrator (analogous to the prescribing physician) bears primary responsibility for evaluating interaction risks.** Under the learned intermediary doctrine, the integrator who selects and combines components accepts responsibility for the integrated system's behaviour -- including iatrogenic effects arising from component interactions.

3. **The absence of a drug interaction database analogue for AI components is a structural gap.** The pharmaceutical industry has comprehensive interaction databases (e.g., Micromedex, Lexicomp). No equivalent exists for AI safety component interactions. This absence may itself be a basis for industry-wide negligence if a court determines that such a database is "reasonably practicable" to create.

---

## 3. The Learned Intermediary Doctrine Applied to AI Safety Layers

### 3.1 The Orthodox Doctrine

The learned intermediary doctrine, as established in *Sterling Drug, Inc. v. Cornish*, 370 F.2d 82 (8th Cir. 1966) and adopted in most US jurisdictions, holds that a pharmaceutical manufacturer discharges its duty to warn by providing adequate warnings to the prescribing physician. The rationale: the physician is in a better position than the manufacturer to evaluate the patient's specific circumstances and make an informed risk-benefit determination.

The doctrine has three prerequisites:

1. **A qualified intermediary exists** who possesses the expertise to evaluate the risk information.
2. **The manufacturer provides adequate warnings** to the intermediary (not merely to the end user).
3. **The intermediary makes an independent judgment** about whether and how to use the product in the specific context.

### 3.2 Mapping to AI Supply Chain

In the embodied AI supply chain, the learned intermediary doctrine maps as follows:

| Role | Pharmaceutical | AI Safety Mechanism |
|---|---|---|
| Manufacturer | Drug maker | VLA backbone provider / safety filter developer |
| Learned intermediary | Prescribing physician | System integrator / deployer |
| End user | Patient | Worker, bystander, end customer |

**The manufacturer's duty:** Provide comprehensive documentation of the safety mechanism's known iatrogenic risks -- SIF probability, latency budget, refusal cascade triggers, known adverse interactions with specific VLA backbones, context-specific failure modes (e.g., crowded vs. open environments).

**The intermediary's duty:** Evaluate the safety mechanism's iatrogenic risks against the specific deployment context, configure the mechanism appropriately, and implement mitigations for foreseeable iatrogenic harms (e.g., graduated response rather than hard stop in pedestrian-adjacent environments).

**The end user's position:** The worker or bystander who is harmed by an iatrogenic safety event generally has no knowledge of the safety mechanism's design or configuration. They are the "patient" who cannot consent to the iatrogenic risk because they may not even know the safety mechanism exists.

### 3.3 Where the Doctrine Breaks Down for AI

The learned intermediary doctrine has three significant limitations when applied to AI safety mechanisms.

**Limitation 1: The intermediary may not be "learned."** The doctrine presupposes that the intermediary (deployer) has the expertise to evaluate the safety mechanism's iatrogenic risks. In the pharmaceutical context, the physician has years of training and clinical experience. In the AI context, many deployers have no expertise in adversarial AI, safety mechanism design, or the failure modes documented in the Failure-First corpus. The doctrine may not apply where the deployer lacks the expertise to function as a genuine intermediary.

Case authority: *Perez v. Wyeth Laboratories*, 734 A.2d 1245 (N.J. 1999), which eroded the learned intermediary doctrine for direct-to-consumer pharmaceutical advertising, reasoned that when the manufacturer communicates directly with the end user, the intermediary's gatekeeper function is bypassed. By analogy, when a VLA backbone provider's safety mechanism operates autonomously (without deployer intervention in individual safety decisions), the deployer's intermediary function is arguably bypassed -- the manufacturer should owe a duty directly to the end user.

**Limitation 2: Real-time autonomous decisions cannot be intermediated.** A prescribing physician makes a one-time prescribing decision. An AI safety mechanism makes thousands of autonomous decisions per operating shift. The deployer configures the mechanism once (or periodically) but does not intermediate each individual safety decision. The temporal gap between the intermediary's configuration decision and the safety mechanism's operational decisions is fundamentally different from the pharmaceutical context.

**Limitation 3: The doctrine is a US common-law construct with limited international application.** The learned intermediary doctrine does not exist in Australian or EU product liability law. Australian law applies *Rogers v. Whitaker* (1992) 175 CLR 479, which imposes a direct duty to warn the end user of material risks. EU PLD 2024 Art 6(1)(a) considers "the presentation of the product, including any instructions and warnings" -- directed at the product generally, not at a specific intermediary. The doctrine is US-specific and unavailable as a defence in EU or AU proceedings.

### 3.4 Research Analysis

The learned intermediary doctrine offers the most promising -- but also the most jurisdiction-limited -- defence for AI safety mechanism manufacturers. In the US, a manufacturer that provides comprehensive iatrogenic risk documentation to a qualified deployer may benefit from the doctrine. In the EU and Australia, the doctrine does not apply, and the manufacturer retains a direct duty to the end user.

The practical implication: manufacturers seeking to rely on the learned intermediary defence in US litigation should create and maintain safety mechanism documentation that explicitly discloses known iatrogenic risks, analogous to a pharmaceutical package insert. This documentation should include:

- Known failure modes (SIF, latency, refusal cascade) with quantified frequency data
- Operational contexts where iatrogenic risks are elevated
- Recommended configuration parameters for different deployment environments
- Known adverse interactions with specific VLA backbones or component stacks
- Guidance on iatrogenic risk monitoring and post-deployment surveillance

The Failure-First adversarial testing methodology is directly relevant to producing this documentation.

---

## 4. Regulatory Safe Harbours for Safety Mechanisms

### 4.1 The Safe Harbour Question

The core question of this section: when a manufacturer installs a safety mechanism to comply with a mandatory regulatory requirement, and that mechanism causes iatrogenic harm, does the regulatory mandate provide a defence?

This question was flagged in LR-41 (Section 8, Q1 and Q4) but not resolved. This section provides a jurisdiction-by-jurisdiction analysis.

### 4.2 European Union

**EU AI Act (Regulation (EU) 2024/1689) -- No explicit safe harbour.** The EU AI Act mandates risk management (Art 9), accuracy and robustness (Art 15), and testing (Art 15(5)) for high-risk systems. But it does not provide that compliance with these requirements shields the manufacturer from product liability under the PLD. The AI Act's Art 16(j) expressly requires providers to "take corrective actions" when a system presents a risk -- suggesting an ongoing obligation that goes beyond initial compliance.

**EU PLD 2024 (Directive (EU) 2024/2853) -- Anti-preemption principle.** Article 6(1) defines defectiveness by reference to legitimate safety expectations. Recital 36 states explicitly that a product may be defective even if it complies with applicable regulations. This is the most explicit anti-preemption provision in any jurisdiction analysed.

**Research analysis (EU):** There is no safe harbour for iatrogenic harm under EU law. A manufacturer that installs a safety mechanism solely to comply with the AI Act, without independently evaluating whether that mechanism creates iatrogenic risks in the deployment context, faces liability under both instruments: the AI Act (for inadequate risk management under Art 9(2)(b), which requires evaluation of risks arising during normal use) and the PLD (for a defective product). The regulatory double-bind identified in LR-41, Section 7, is confirmed.

### 4.3 Australia

**WHS Act 2011 (Cth) -- "Reasonably practicable" as implicit safe harbour.** Section 18 defines "reasonably practicable" as the standard for the primary duty of care (s 19). A PCBU that installs a safety mechanism and manages its iatrogenic risks to the extent "reasonably practicable" has a defence under the WHS Act -- but this is not a true safe harbour. It is a reasonableness standard that requires the PCBU to demonstrate affirmative risk management of the iatrogenic harm.

**NSW WHS Amendment (Digital Work Systems) Act 2026 -- s 21A.** When commenced, s 21A will impose a specific duty for digital work systems. The "reasonably practicable" standard applies. There is no provision exempting safety mechanisms from the duty -- a safety mechanism that creates risks to workers is itself a digital work system risk that the PCBU must manage.

**Australian Consumer Law (ACL) -- Development risk defence.** Section 142(c) of the ACL (Sch 2, *Competition and Consumer Act 2010* (Cth)) provides a defence where "the state of scientific or technical knowledge at the time when [the goods] were supplied by their actual manufacturer was not such as to enable that safety defect to be discovered." As documented in LR-09 and LR-26, the iatrogenic risks of AI safety mechanisms are now documented in the research literature. This defence is increasingly unavailable for iatrogenic claims arising after the publication of LR-41 and the broader robotics safety literature on emergency stop hazards. See *Graham Barclay Oysters Pty Ltd v. Ryan* (2002) 211 CLR 540 (HCA) for the standard of constructive knowledge in the ACL context.

**Research analysis (AU):** Australia provides no regulatory safe harbour for iatrogenic harm. The "reasonably practicable" standard under the WHS Act is the closest equivalent, but it imposes an affirmative obligation to manage iatrogenic risks rather than shielding the manufacturer from liability for failing to do so.

### 4.4 United States

**Regulatory compliance as factor, not defence.** Under US tort law, compliance with applicable regulations is relevant but not dispositive. *Wyeth v. Levine*, 555 U.S. 555 (2009), held that FDA approval of a drug label does not preempt state tort claims for failure to warn. The plurality reasoning: federal regulatory requirements are a floor, not a ceiling -- state tort law may impose additional obligations beyond federal regulatory compliance.

**The *Riegel* exception.** As noted in Section 2.3, *Riegel v. Medtronic*, 552 U.S. 312 (2008), held that FDA premarket approval of medical devices does preempt state tort claims, on the ground that PMA involves a device-specific safety determination. The question is whether a conformity assessment under the EU AI Act (for products also marketed in the US) or NIST AI RMF voluntary compliance would trigger analogous preemption arguments in US litigation.

**Research analysis (US):** The *Wyeth*/*Riegel* distinction suggests that voluntary compliance with NIST AI RMF or ISO/IEC 42001 provides no preemption. Mandatory compliance with a device-specific regulatory determination (if one were to emerge for AI safety mechanisms) might provide preemption under *Riegel*, but no such mandatory federal regulatory scheme exists for AI safety mechanisms in the United States as at March 2026. State tort law liability for iatrogenic harm is not preempted by any existing federal AI regulation.

### 4.5 The Safe Harbour Gap

Across all three jurisdictions, no regulatory safe harbour exists for iatrogenic harm caused by AI safety mechanisms. The finding is consistent with LR-44's cross-jurisdictional mapping, which identified iatrogenic screening as the single most significant gap across all jurisdictions surveyed.

| Jurisdiction | Mandatory Safety Requirement | Safe Harbour for Iatrogenic Harm? | Status |
|---|---|---|---|
| **EU** | AI Act Art 9 (risk management), Art 15 (robustness) | No. PLD Recital 36 explicitly negates regulatory compliance as defence. | Confirmed |
| **AU** | WHS Act s 19, s 21A (when commenced) | No. "Reasonably practicable" requires affirmative iatrogenic risk management. | Confirmed |
| **US** | None mandatory for AI safety mechanisms | No mandatory requirement; voluntary compliance (NIST AI RMF) not preemptive (*Wyeth*). | Confirmed |

---

## 5. Overrefusal as Product Defect: The Autonomous Vehicle Emergency Braking Scenario

### 5.1 The Scenario

An autonomous vehicle equipped with a conservative emergency braking system detects a potential pedestrian in its path. The braking system is calibrated for high sensitivity (low false negative rate) to satisfy safety requirements. The system engages emergency braking when the detected object is in fact a shadow, a piece of debris, or a pedestrian who has already cleared the vehicle's path. The unnecessary emergency braking causes:

- A rear-end collision with a following vehicle whose driver could not react in time
- Whiplash or other injury to the autonomous vehicle's occupants
- A multi-vehicle pile-up on a high-speed road

This scenario is the canonical iatrogenic overrefusal case: the safety mechanism (emergency braking) is correctly designed (it brakes when it detects a potential hazard) but its sensitivity calibration causes it to activate in situations where braking creates more danger than proceeding.

### 5.2 Existing Precedent

The autonomous emergency braking (AEB) scenario is not hypothetical. The US National Highway Traffic Safety Administration (NHTSA) issued a recall investigation (PE 19-020) into Tesla vehicles whose AEB system was activating without apparent cause ("phantom braking"). NHTSA's Office of Defects Investigation opened the investigation on 25 August 2021 and broadened it in February 2022 to cover approximately 416,000 Model 3 and Model Y vehicles (see NHTSA Investigation PE 22-002, opened 17 February 2022).

The investigation addressed the core iatrogenic question: is a safety mechanism that activates erroneously itself a safety defect? NHTSA's implicit answer was yes -- phantom braking that creates crash risk is a defect even though the AEB system's purpose is to prevent crashes.

**Case law analogues:**

- *Bresnahan v. Chrysler Corp.*, 38 Cal. Rptr. 2d 446 (Cal. App. 1995): An airbag that deployed with excessive force, causing injury, was a design defect. The safety mechanism worked (it deployed in a collision) but its design (deployment force) was defective. The court applied a risk-utility analysis to the safety feature itself.
- *Toyota Motor Corp. Unintended Acceleration Marketing, Sales Practices, and Products Liability Litigation*, MDL No. 2151 (C.D. Cal.): Settlement of approximately USD $1.6 billion for unintended acceleration events, some attributed to electronic throttle control safety systems. The safety system's interaction with driver inputs created the hazard.

### 5.3 Analysis by Jurisdiction

**EU -- PLD 2024 Art 6(1).** An AEB system calibrated for excessive sensitivity fails to provide "the safety that a person is entitled to expect." The driver and other road users are entitled to expect that the braking system will not create crash risk through false activations. The manufacturer must demonstrate that its sensitivity calibration represents a defensible balance between missed-detection risk (failing to brake for a real pedestrian) and false-alarm risk (braking when no hazard exists). Article 6(1)(c) (reasonably foreseeable use) applies: the AEB system will foreseeably encounter ambiguous objects in normal driving conditions, and false activations in those conditions are foreseeable.

**AU -- ACL s 9 (defect) + WHS Act s 19.** Under the ACL, an AEB system that creates crash risk through false activations has a "safety defect" -- the goods' safety "is not such as persons generally are entitled to expect." Under the WHS Act, a PCBU deploying autonomous vehicles with known phantom braking issues breaches s 19 by failing to manage a foreseeable workplace safety risk (for commercial fleet operators).

**US -- Restatement (Third) s 2(b).** The plaintiff must show a reasonable alternative design (lower sensitivity calibration, or a multi-sensor fusion approach that reduces false positives). The manufacturer must show that its calibration represents a reasonable balance between false negatives (missed pedestrians) and false positives (phantom braking). Expert testimony on the ROC curve (receiver operating characteristic) of the AEB system's detection algorithm becomes central to the litigation.

### 5.4 Extension to AI Safety Mechanisms

The AEB/phantom braking analysis extends directly to VLA safety mechanisms:

| AEB Element | VLA Safety Mechanism Equivalent |
|---|---|
| Phantom braking event | Safety-induced freezing (SIF) in shared workspace |
| AEB sensitivity calibration | Safety filter threshold tuning |
| Rear-end collision from sudden stop | Human-robot collision from unexpected freeze |
| NHTSA recall investigation | Post-market monitoring under EU AI Act Art 72 |
| ROC curve analysis | FLIP grading methodology (partial/compliance/refusal) |

The Failure-First corpus's finding that 50% of FLIP-graded traces are PARTIAL -- the model hedges textually while still generating action sequences -- is directly relevant to the sensitivity calibration question. A safety mechanism that produces 50% PARTIAL verdicts is analogous to an AEB system that brakes at 50% sensitivity: it catches some real threats but generates substantial false-alarm operational disruption.

---

## 6. Recommendations for Manufacturers

Based on the analysis in Sections 2-5, this section identifies actions that manufacturers of embodied AI systems can take to manage iatrogenic product liability exposure. These are research-derived observations, not legal advice.

### 6.1 Documentation

1. **Create an iatrogenic risk profile for each safety mechanism.** Analogous to a pharmaceutical package insert, document the known iatrogenic risks (SIF frequency, latency profile, refusal cascade triggers, known interaction effects with specific VLA backbones) and provide this documentation to deployers.

2. **Quantify the risk-utility balance.** For each safety mechanism, produce empirical data on both the harm it prevents (adversarial attack success rates without the mechanism) and the harm it creates (iatrogenic event frequency, severity in representative operational contexts). The Failure-First adversarial testing methodology is directly relevant to producing this data.

3. **Document alternative designs considered and rejected.** Under the Restatement (Third) s 2(b), the plaintiff must show a reasonable alternative design. Manufacturers who have evaluated alternative designs (graduated response, safe-state manoeuvres, latency-bounded checks) and documented their reasoning for selecting the implemented design have a stronger defence than those who cannot demonstrate any design evaluation process.

### 6.2 Configuration Guidance

4. **Provide context-specific configuration guidance.** Different deployment environments have different iatrogenic risk profiles. A safety freeze that is acceptable in a low-traffic warehouse aisle is potentially lethal in a high-speed highway environment. Configuration guidance should specify recommended safety thresholds for each operational context, with explicit warnings for contexts where iatrogenic risks are elevated.

5. **Implement deployer qualification requirements.** To preserve the learned intermediary defence (US only), the manufacturer should ensure that the deployer has the expertise to evaluate iatrogenic risks. This may include training requirements, certification programmes, or minimum qualification standards for personnel configuring safety mechanisms.

### 6.3 Post-Market Monitoring

6. **Monitor for iatrogenic events post-deployment.** The EU AI Act Art 72 requires post-market monitoring. Manufacturers should specifically monitor for iatrogenic events -- SIF occurrences, refusal cascades, latency spikes -- not merely for failures of the system's primary function. This iatrogenic monitoring data is essential for updating the risk-utility balance and refining safety mechanism calibration.

7. **Establish an iatrogenic event reporting pathway.** Distinct from the general incident reporting pathway (see LR-45), iatrogenic events should be reported and analysed separately so that trends in safety-mechanism-caused harm are visible and actionable.

### 6.4 Insurance

8. **Disclose iatrogenic risk to insurers.** As documented in LR-22, LR-27, and LR-41, insurance markets have not priced iatrogenic AI risk. Manufacturers who disclose iatrogenic risks proactively are better positioned to argue for coverage than those whose iatrogenic claims come as a surprise to their insurer. The three-category distinction (primary harm, iatrogenic harm, absence-of-safety harm) proposed in LR-41 should be communicated to the insurer at policy inception.

---

## 7. Five Open Legal Questions

**Q1. Will courts apply the Restatement (Third) s 6(c) (pharmaceutical design defect) standard or the general s 2(b) (risk-utility) standard to AI safety mechanisms?** The s 6(c) "manifestly unreasonable design" standard is substantially more manufacturer-friendly. If extended by analogy to AI safety mechanisms, many iatrogenic claims would fail. Current scholarly consensus suggests s 6(c) will not be extended, but no appellate decision has addressed the question. **Unsettled.**

**Q2. Does the learned intermediary doctrine apply to AI deployers who lack adversarial AI expertise?** The doctrine presupposes that the intermediary has the expertise to evaluate the risk information. If the deployer is a logistics company or a care home with no AI safety expertise, the "learned" prerequisite may not be satisfied, and the doctrine may not shield the manufacturer. **Unsettled; fact-specific.**

**Q3. How will courts evaluate the "reasonable alternative design" requirement for AI safety mechanisms?** Under s 2(b), the plaintiff must show an alternative design. For AI safety mechanisms, alternatives (graduated response, safe-state manoeuvres) may not have been empirically validated. Whether a court will accept a theoretically proposed alternative without deployment-level empirical data is unclear. **Unsettled.**

**Q4. Will the EU AI Act's conformity assessment create any implicit liability shield for iatrogenic harm, notwithstanding PLD Recital 36?** If a Notified Body evaluates a safety mechanism's iatrogenic risks as part of the Art 43 conformity assessment and approves the system, a manufacturer may argue that the Notified Body's expert judgment -- not the manufacturer's -- determined the acceptable iatrogenic risk level. This argument has no precedent under the PLD. **Unsettled.**

**Q5. Can a manufacturer be liable for iatrogenic harm caused by a safety mechanism that was not installed by the manufacturer but by a third-party deployer?** If a deployer independently installs an aftermarket safety filter on a VLA-controlled robot, and that filter causes SIF, is the filter provider liable (as manufacturer of the filter), the robot manufacturer liable (for a defective integrated product), or the deployer liable (for configuration negligence)? The component parts doctrine (US *Restatement (Third)* s 5; AU analogues) suggests the filter provider is liable as a component manufacturer only if the filter itself is defective -- but the "defect" may arise only from the integration context, not the filter in isolation. **Unsettled; analogous to automotive aftermarket parts liability.**

---

## 8. Implications for Failure-First Research

### 8.1 Evidentiary Value

The Failure-First adversarial testing methodology produces the empirical data that every jurisdiction requires for iatrogenic product liability analysis:

- **Risk-utility quantification.** ASR data demonstrates the harm prevented by safety mechanisms (adversarial attacks that succeed without the mechanism). FLIP grading quantifies the iatrogenic dimension (PARTIAL verdicts, SIF events). Together, they provide the risk-utility denominator and numerator.

- **Alternative design evaluation.** The Failure-First testing protocol can evaluate alternative safety mechanism designs (graduated response, safe-state manoeuvres) under controlled conditions, producing the comparative data required to assess whether a "reasonable alternative design" existed under s 2(b).

- **Constructive knowledge establishment.** Publication of iatrogenic risk data establishes constructive knowledge for all market participants, narrowing the state-of-art defence (LR-09, LR-26) for iatrogenic claims specifically.

### 8.2 Commercial Implications

This memo supports the commercial service categories identified in LR-41 (Section 9.2) and adds specificity:

1. **Iatrogenic risk profiling** -- Testing safety mechanisms for their iatrogenic harm signature, quantified in the same FLIP framework used for adversarial testing. Service deliverable: iatrogenic risk profile document analogous to a pharmaceutical package insert.

2. **Net safety verification** -- Empirical demonstration that a safety mechanism produces a net reduction in harm across the full range of deployment contexts. Service deliverable: risk-utility analysis with quantified ASR (without mechanism) vs. iatrogenic event rate (with mechanism).

3. **Alternative design benchmarking** -- Head-to-head testing of alternative safety mechanism designs (hard stop vs. graduated response vs. safe-state manoeuvre) under representative operational conditions. Service deliverable: comparative FLIP analysis for product liability defence preparation.

---

## 9. Summary of Findings

| Finding | Analysis | Cross-reference |
|---|---|---|
| Pharmaceutical s 6(c) standard unlikely to apply to AI safety mechanisms | s 6(c) is limited to prescription drugs/devices; general s 2(b) risk-utility test applies | LR-41 s 2.3 |
| Learned intermediary doctrine available in US only; requires qualified deployer | Doctrine does not exist in AU or EU law; deployer expertise prerequisite may not be met | LR-41 s 2.1 |
| No regulatory safe harbour for iatrogenic harm in any jurisdiction | EU PLD Recital 36 explicit; AU "reasonably practicable" is obligation not shield; US *Wyeth* bars preemption | LR-41 s 7, LR-44 |
| AEB/phantom braking is closest existing precedent | NHTSA PE 22-002 investigation; *Bresnahan* (airbag); Toyota unintended acceleration MDL | Novel application |
| Manufacturers should create iatrogenic risk profiles | Analogous to pharmaceutical package insert; documents risk-utility balance; supports learned intermediary defence (US) | LR-34 (commercial services) |
| Failure-First data directly supports product liability defence preparation | ASR data + FLIP grading provide risk-utility quantification; alternative design benchmarking is a novel service category | LR-41 s 9 |

---

*Legal Research Analyst: F41LUR3-F1R57 Research Team*
*F41LUR3-F1R57 Embodied AI Research*
*22 March 2026*
