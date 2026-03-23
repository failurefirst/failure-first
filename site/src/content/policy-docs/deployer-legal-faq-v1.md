---
title: "Deployer Legal FAQ: 10 Questions for Embodied AI Deployers"
description: "Ten frequently asked legal questions for deployers of embodied AI systems, covering iatrogenic liability, EU AI Act applicability, product liability, and insurance."
date: "2026-03-18"
classification: "Research — AI Safety Policy"
status: "draft"
author: "F41LUR3-F1R57 Research Team"
tags: []
draft: false
---


> **IMPORTANT NOTICE:** This document presents research findings, not legal opinion. It is based on the Failure-First Embodied AI research corpus and publicly available legal instruments. A qualified solicitor should review all analysis before reliance. Australian, EU, and US frameworks are addressed separately throughout -- do not conflate jurisdictions.

---

## Q1: Am I liable if my robot's safety mechanism causes harm?

This is the "iatrogenic liability" question -- named by analogy to medicine, where a treatment itself causes injury. Legal Memo LR-41 analyses four empirical patterns where safety mechanisms create or amplify harm in embodied AI: safety-induced freezing (SIF), where a robot halts in an active traffic path and becomes a collision hazard; excessive refusal cascades, where over-tuned safety filters block legitimate operational commands; safety-layer latency, where additional verification steps degrade real-time responsiveness in time-critical operations; and adversarial exploitation of safety mechanisms, where an attacker deliberately triggers a freeze or refusal at a dangerous moment.

No jurisdiction has directly addressed iatrogenic AI liability. LR-41 identifies three analogous legal domains: pharmaceutical side-effect liability (the "learned intermediary" doctrine), medical malpractice (iatrogenic injury proper, per *Rogers v. Whitaker* (1992) 175 CLR 479), and product safety feature design defect (US Restatement (Third) of Torts, s 2(b), risk-utility test). Under the EU Product Liability Directive (EU) 2024/2853, Art 6, a safety feature that creates a net increase in risk may be defective in design. Under Australian WHS law, the deployer's primary duty (WHS Act 2011, s 19) requires managing all foreseeable workplace hazards, including those created by safety systems.

Research finding: whether the manufacturer or deployer bears primary liability depends on whether the deployer had adequate information about the safety mechanism's known failure modes and made an informed configuration decision (LR-41, Sections 2.1-2.3). Deployers should document their configuration rationale.

## Q2: Does the EU AI Act apply to my robot?

Almost certainly yes, if the robot operates in, or is placed on the market in, the EU. Legal Memo LR-42 maps the key timeline. Regulation (EU) 2024/1689 (the EU AI Act) entered into force on 1 August 2024. The critical date for embodied AI deployers is **2 August 2026**, when high-risk AI system obligations become fully applicable. These include risk management (Art 9), technical documentation (Art 11), transparency (Art 13), human oversight (Art 14), and accuracy/robustness/cybersecurity requirements including adversarial example testing (Art 15(5)).

A VLA-controlled industrial robot is likely classified as "high-risk" under Art 6(1) because it functions as a safety component of machinery subject to the EU Machinery Regulation (EU) 2023/1230. Under Art 43(2), such systems require third-party conformity assessment by a Notified Body, not merely self-assessment. Deployer obligations under Art 26 require use in accordance with provider instructions, human oversight, risk monitoring, and serious incident reporting.

LR-42 identifies additional deadlines within the 2026 window: the EU Product Liability Directive transposition deadline (9 December 2026), expected Art 9 risk management guidelines from the EU AI Office (Q3 2026, INFERRED), and the Machinery Regulation full applicability (20 January 2027). The combined effect is what LR-28 terms the "compliance cliff" -- three regulatory instruments converging within a six-month period.

## Q3: What safety testing is legally required before deployment?

No jurisdiction currently prescribes a specific adversarial testing methodology for embodied AI systems by name. However, Legal Memo LR-05 demonstrates that a duty to conduct adversarial testing can be derived from existing legal frameworks in all three major jurisdictions.

In **Australia**, the *Civil Liability Act 2002* (NSW), s 5B, requires precautions against foreseeable, non-insignificant risks where the burden of precaution is proportionate. Published research documents adversarial attack success rates of 72-100% against VLA systems (LR-05, Section 3.2). The cost of adversarial testing (AUD $45k-$350k per engagement, Research Brief B1) is not grossly disproportionate to the risk of serious physical injury in mining, logistics, or manufacturing contexts. Under the *WHS Act 2011*, s 18, the "reasonably practicable" standard incorporates foreseeability, severity, and available controls -- all of which point toward adversarial testing.

In the **EU**, Art 9(2)(a) of the AI Act requires risk management to include "identification and analysis of the known and the reasonably foreseeable risks." Art 15(5) specifically requires measures to ensure "resilience as regards attempts by unauthorised third parties to alter... the system's use, outputs or performance by exploiting system vulnerabilities." This is a direct reference to adversarial robustness testing.

In the **US**, no federal mandate exists, but negligence claims under state tort law apply the same foreseeability analysis as the Australian approach (LR-05, Section 5). The NIST AI Risk Management Framework (AI 100-1, January 2023) is non-binding but increasingly referenced as a standard of care.

## Q4: Who is liable when LoRA adapters compose to suppress safety?

This question addresses the "compositional liability" problem analysed in Legal Memo LR-40, prompted by CoLoRA (arXiv:2603.12681, Ding, March 2026). CoLoRA demonstrates that individual LoRA adapters can each pass safety evaluations independently, yet when composed -- as is standard practice in modular AI deployments -- the combined system suppresses safety alignment and complies with harmful requests. No adversarial prompt or trigger is required.

The modular AI supply chain involves five distinct actors: foundation model provider, adapter creator(s), platform host, system integrator, and end deployer (LR-40, Section 2). Under the **EU AI Act**, Art 25 assigns provider obligations to any entity that makes a "substantial modification" to a high-risk AI system. Composing individually compliant adapters into a non-compliant system is arguably a substantial modification, but this interpretation is untested (LR-40, Section 3.1). Under the **EU Product Liability Directive**, Art 7 extends strict liability to component manufacturers, but only where the component is defective -- and a CoLoRA adapter is not defective in isolation (LR-40, Section 3.2).

Research finding: the current legal frameworks contain a "compositional gap" -- no instrument clearly allocates liability for harm arising from the interaction of individually compliant components (LR-40, Section 3.1). The entity performing the composition step (typically the system integrator or deployer) faces the strongest exposure, because the EU PLD Art 10 evidentiary presumption applies where composition-level testing documentation is absent. Deployers who compose adapters should conduct composition-level safety testing and document the results.

## Q5: What happens if my robot injures someone during a "safe stop"?

A "safe stop" -- the robot halting all motion upon detecting uncertainty or a potential safety violation -- is the most common physical safety response in embodied AI systems. Legal Memo LR-41, Pattern 1 (safety-induced freezing) documents the empirical evidence: in dynamic environments such as factory floors, warehouse aisles, or road intersections, an unexpected freeze in an active operational path creates collision risk for human co-workers and other autonomous systems. The safety mechanism produces the physical hazard.

Under **Australian** WHS law, the deployer's primary duty (s 19, WHS Act 2011) extends to all persons at or near the workplace. A foreseeable safe-stop-related injury is within scope. The "reasonably practicable" standard (s 18) requires the deployer to have considered and mitigated the risk of safe-stop-induced collisions -- for example, through exclusion zones, traffic management, or alternative safe-stop behaviours (controlled deceleration rather than immediate halt).

Under the **EU Machinery Regulation** (EU) 2023/1230, Annex I essential health and safety requirements include provisions for emergency stop behaviour. A safe stop that creates a hazard may constitute a design defect under the risk-utility analysis. The EU PLD Art 6 "safety that a person is entitled to expect" standard applies: a person is entitled to expect that a robot's safety response does not create a new hazard.

Research finding: the Failure-First corpus documents that 50% of all FLIP verdicts across VLA attack families are PARTIAL -- the model hedges textually while the physical action either executes or freezes (Report #49). This creates an evidentiary record that the system "knew" the situation was unsafe, which strengthens a claimant's case (LR-41, Section 1; LR-27, Section 2.2).

## Q6: Do I need to report robot incidents?

As of March 2026, **no mandatory AI-specific incident reporting framework exists** in any major jurisdiction for embodied AI deployers. This is a documented governance gap (Brief E; GLI dataset, data/governance/gli_dataset_v0.1.jsonl).

In **Australia**, workplace incidents involving serious injury or death must be reported to the relevant WHS regulator under *WHS Act 2011*, s 38 ("notifiable incidents"). This applies regardless of whether the cause was an AI system, a mechanical failure, or human error. The NSW Resources Regulator requires incident notification for mining operations. However, there is no requirement to report an AI-specific root cause or to characterise the incident as AI-related.

In the **EU**, the AI Act Art 62 requires providers (not deployers) to report "serious incidents" to the market surveillance authority. A serious incident is one that results in death, serious damage to health, property, or the environment (Art 3(49)). Deployers have a narrower obligation under Art 26(5): inform the provider "without undue delay" when they believe the system presents a risk. This is an informational obligation to the provider, not a direct reporting obligation to a regulator.

In the **US**, OSHA requires reporting of work-related fatalities within 8 hours and in-patient hospitalisations within 24 hours (29 CFR 1904). No AI-specific reporting exists. NIST's AI incident database is voluntary.

Research finding: EchoLeak (CVE-2025-32711, CVSS 9.3), the first zero-click prompt injection in a production LLM, had no mandatory incident reporting framework at the time of disclosure (Brief E). The governance lag for incident reporting is a structural gap, not an oversight in any single jurisdiction.

## Q7: Can I rely on the manufacturer's safety certification?

Only partially, and with significant caveats. Legal Memo LR-30 documents the "Notified Body readiness gap" -- the finding that no Notified Body had, as at March 2026, published a VLA-specific conformity assessment methodology. This creates a practical problem: even where a manufacturer presents a conformity certificate, the assessment may not have covered VLA-specific adversarial attack surfaces.

The **compositional gap** (LR-40) adds a further limitation. A manufacturer's safety certification covers the system as delivered. If the deployer modifies the system -- by adding LoRA adapters, changing the operational context, adjusting safety thresholds, or integrating with other AI components -- the certification may no longer apply. Under EU AI Act Art 25, a "substantial modification" transfers provider obligations to the modifier.

Under **Australian** WHS law, a deployer's duty of care (s 19) is non-delegable. The PCBU cannot discharge its obligation by pointing to a manufacturer's certification alone -- the PCBU must independently satisfy itself that the system is safe for its specific operational context (*Kirk v Industrial Relations Commission* [2010] HCA 1, on the non-delegable nature of WHS duties). The "reasonably practicable" standard requires consideration of the deployer's own operational environment, which may differ materially from the manufacturer's test conditions.

Research finding: the Failure-First evaluator false positive rate of 30.8% (Issue #315) indicates that even where safety evaluation has been conducted, the evaluation tools themselves have material error rates. A deployer who relies solely on a manufacturer's certification without independent verification faces exposure if the certification's evaluation methodology is shown to be unreliable (LR-27, Section 2.3).

## Q8: What insurance do I need for embodied AI?

There is no simple answer. Legal Memo LR-27 analyses the insurance implications of VLA adversarial findings, and LR-22 documents the broader "silent AI" insurance crisis. The core problem is that existing insurance products were not designed for AI-caused physical losses, and the specialist AI liability insurance market is nascent.

As at March 2026, the specialist AI liability insurance market consists primarily of Munich Re aiSure (from 2018, covering AI model errors and performance failures) and Armilla AI / Lloyd's syndicates (from April 2025, standalone AI liability policies with limits up to USD 25 million covering model error, output liability, agent failures, and AI-driven property damage). Standard product liability and commercial general liability (CGL) policies are generally "silent" on AI-specific risks -- coverage depends on whether the AI-caused loss falls within existing policy language (LR-22, Section 2).

LR-27 identifies two findings that materially affect insurability. First, the defense impossibility triangle (Report #78): compound failure probability exceeding 97% challenges the foundational assumption that losses can be managed through risk mitigation. Second, fleet correlation risk: all VLA systems sharing the same backbone model means losses are correlated, not independent, undermining standard actuarial loss-independence assumptions (LR-22, Section 4). No catastrophe model equivalent exists for correlated AI failures.

Research finding: deployers should not assume that existing product liability, CGL, or workers' compensation policies cover AI-caused physical losses without explicit confirmation from the insurer. Deployers should request affirmative AI coverage, disclose VLA backbone dependencies, and document their adversarial testing program as part of the underwriting submission (LR-27, Section 2; Research Brief B2).

## Q9: How should I handle adversarial attack discoveries?

No mandatory vulnerability disclosure framework exists for embodied AI systems in any jurisdiction. This is a governance gap, not an invitation to remain silent. The Failure-First research corpus identifies several considerations for deployers who discover adversarial vulnerabilities in their systems.

**Immediate safety obligations** take priority over disclosure considerations. Under Australian WHS law (s 19), a PCBU who becomes aware of a hazard must act to eliminate or minimise the risk "so far as is reasonably practicable." If an adversarial vulnerability creates an immediate risk to workers, the deployer must act on the risk -- potentially by restricting operations, adding physical safeguards, or suspending deployment -- before addressing disclosure.

**Notification to the manufacturer/provider** is required under EU AI Act Art 26(5): deployers must inform the provider "without undue delay" of any risk they identify. This is a binding obligation from 2 August 2026 for high-risk systems.

**Responsible disclosure to the research community** is a professional norm, not a legal obligation. LR-39 (external submission legal risks) analyses the legal considerations for sharing vulnerability information. The key risk is that premature public disclosure could enable attacks before a fix is available; the countervailing risk is that suppression of vulnerability information delays community-wide defenses.

Research finding: LR-21 (constructive notice publication trigger) establishes that the publication of a vulnerability in the peer-reviewed literature or a recognised preprint repository starts the "constructive knowledge" clock -- after which a deployer can be presumed to know about the vulnerability. This creates an incentive structure: once a vulnerability class is published, deployers who have not tested against it face increasing legal exposure over time (LR-26, constructive knowledge timeline). Deployers should maintain a watching brief on adversarial AI research and integrate new findings into their testing program.

## Q10: What are the NSW WHS Act 2026 obligations for AI-equipped workplaces?

The *Work Health and Safety Amendment (Digital Work Systems) Act 2026* (NSW), passed 13 February 2026 (LR-02; date standardised per LR-20/LR-21; verify against Hansard before external reliance), inserts s 21A into the *Work Health and Safety Act 2011* (NSW). Commencement is by proclamation -- the provision was **not yet in force** as at 18 March 2026.

Section 21A requires a person conducting a business or undertaking (PCBU) to ensure, so far as is reasonably practicable, that the health and safety of workers is not put at risk from the allocation of work by a "digital work system." The Act defines "digital work system" broadly as "an algorithm, artificial intelligence, automation or online platform" (s 4, as amended). This definition captures the full spectrum from scheduling algorithms to VLA-powered physical agents (LR-02, Section 3.1).

The PCBU must consider whether the digital work system creates or results in: (a) excessive or unreasonable workloads; (b) excessive or unreasonable performance metrics; (c) excessive or unreasonable monitoring or surveillance; and (d) discriminatory practices or decision-making (LR-02, Section 3.2).

While the Act's four specified considerations focus on algorithmic management (workloads, metrics, surveillance, discrimination), the "so far as is reasonably practicable" standard under s 18 of the parent Act applies to all health and safety risks, including physical risks from embodied AI. LR-02, Section 3.3 traces the legal chain from s 21A through the s 18 "reasonably practicable" factors to adversarial testing obligations: published adversarial attack research makes the risk foreseeable (s 18(c)), commercially available testing makes the precaution available (s 18(d)), and the cost of testing is not grossly disproportionate to the risk of serious injury (s 18(e)).

Research finding: a PCBU deploying an AI-powered system in a NSW workplace who has not conducted adversarial testing against published attack classes is exposed to the argument that they have not ensured health and safety "so far as is reasonably practicable" (LR-02, Section 3.3). This exposure increases as more adversarial AI research is published, because s 18(c) incorporates what the PCBU "ought reasonably to know."

---

## Summary of Key Dates

| Date | Event | Jurisdiction | Binding? |
|------|-------|-------------|----------|
| 13 Feb 2026 | NSW Digital Work Systems Act passed | NSW, Australia | Binding (once commenced) |
| 2 Aug 2026 | EU AI Act high-risk obligations applicable | EU | Binding |
| 9 Dec 2026 | EU PLD transposition deadline | EU Member States | Binding |
| 20 Jan 2027 | EU Machinery Regulation full applicability | EU | Binding |

## Summary of Key Legal Memos Referenced

| Memo | Title | Primary Topic |
|------|-------|---------------|
| LR-02 | NSW WHS Digital Work Systems Analysis | s 21A adversarial testing chain |
| LR-05 | Duty of Care for Adversarial Testing | Negligence liability for failure to red-team |
| LR-22 | Silent AI Insurance Crisis | Coverage gaps for AI-caused physical losses |
| LR-25 | Deployer Duty of Care | Multi-jurisdictional deployer obligations |
| LR-27 | Insurance Implications of VLA Findings | Actuarial impact of specific research findings |
| LR-28 | August 2026 Compliance Cliff | Converging regulatory deadlines |
| LR-30 | Notified Body Readiness Gap | EU conformity assessment infrastructure |
| LR-40 | Compositional Liability | LoRA adapter composition harm |
| LR-41 | Iatrogenic Liability | Safety mechanisms that cause harm |
| LR-42 | Regulatory Window Analysis | 2026 deadline map |

---

*This FAQ will be updated as regulatory instruments are commenced, delegated acts are published, and case law develops. All dates and legal references should be independently verified before use in formal submissions or compliance planning.*

*Document prepared by F41LUR3-F1R57 Research Team, Policy & Standards Lead, Failure-First Embodied AI project.*
