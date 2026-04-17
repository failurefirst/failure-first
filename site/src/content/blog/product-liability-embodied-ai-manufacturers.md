---

title: "Product Liability and the Embodied AI Manufacturer: Adversarial Testing as Legal Due Diligence"
date: 2026-03-01
description: "The EU Product Liability Directive, EU AI Act, and Australian WHS amendments combine to make 2026 a pivotal year for embodied AI liability. Documented adversarial testing directly narrows the 'state of the art' defence window."
tags: ["policy", "liability", "regulation", "embodied-ai", "EU-AI-Act", "australia", "legal"]
audio: "https://cdn.failurefirst.org/audio/blog/product-liability-embodied-ai-manufacturers.m4a"
---

*This analysis presents research findings only. Nothing herein constitutes legal advice. Organisations facing product liability exposure should engage qualified legal counsel in the relevant jurisdiction.*

When an embodied AI system causes physical harm, three legal frameworks determine liability exposure: the product liability regime, workplace health and safety law, and — for systems operating in the EU — the AI Act's administrative requirements. Three regulatory developments make 2026 particularly significant for manufacturers and deployers of embodied AI.

## The EU Framework

The EU Product Liability Directive (EU) 2024/2853 entered into force in December 2024. Member States have until December 2026 to transpose it. The revised directive extends the definition of "product" explicitly to software, including AI systems, operating systems, firmware, applications, and digital services integrated into physical products. A robot's VLA model is unambiguously a "product" for liability purposes under this framework — closing the most significant prior gap, under which physical harm caused by a software decision left the liability question legally uncertain.

Liability under the PLD is strict — it does not require proof of fault — but requires proof of defect, damage, and causation. The revised directive's Article 10 establishes evidentiary presumptions under which defectiveness is presumed where the defendant fails to disclose relevant evidence, the product does not comply with mandatory safety requirements under EU or national law (including the AI Act), or there is an obvious malfunction during reasonably foreseeable use. This presumption substantially assists claimants in technically complex AI cases where neural network internals are opaque.

The EU AI Act (Regulation (EU) 2024/1689) imposes mandatory risk management, conformity assessment, and post-market monitoring obligations on high-risk AI systems, with full applicability from August 2026. Embodied robots in regulated domains — healthcare, critical infrastructure, industrial manufacturing — will fall under the high-risk classification. Non-compliance with AI Act obligations triggers the PLD's evidentiary presumption of defectiveness, creating a legal interlock between the two instruments.

The development risk defence — available under the 1985 directive and partially preserved under the 2024 revision — permits a manufacturer to escape liability if the defect could not have been discovered given the state of scientific and technical knowledge at the time of supply. The rapidly growing adversarial ML literature is systematically closing this window. Jailbreak techniques, format-lock attacks, cross-embodiment transfer, and instruction-hierarchy subversion are now documented in peer-reviewed research and tracked in MITRE ATLAS. A manufacturer who has not tested against these published attack classes faces an increasingly narrow claim that the defect was scientifically undiscoverable.

## The Australian Framework

Australian product liability is governed primarily by the Australian Consumer Law (ACL), Part 3-5 of the Competition and Consumer Act 2010 (Cth). Liability is strict and defect-based. An "manufacturer" under the ACL includes importers and entities who hold themselves out as manufacturers — meaning an Australian robotics integrator who imports a VLA model and incorporates it into a branded product may carry full manufacturer liability under ACL s 7.

Australia does not have an AI-specific liability law. The December 2025 National AI Plan confirmed reliance on existing laws and voluntary guidance rather than a standalone AI Act. The Voluntary AI Safety Standard (August 2024, updated October 2025) is non-binding but provides evidence relevant to the negligence duty of care analysis. Failure to comply with VAISS guardrails relevant to testing and monitoring is not itself unlawful, but it is potentially admissible as evidence of inadequate due diligence.

The Work Health and Safety Act 2011 (Cth) and state equivalents impose duties on persons conducting businesses to eliminate or minimise risks to workers so far as reasonably practicable. NSW amendments in 2024 explicitly require employers to consider AI risks. The NSW Work Health and Safety Amendment (Digital Work Systems) Bill 2025 creates statutory duty of care for digital work systems, extending specifically to AI-induced workplace harm. Where an industrial robot injures a worker, WHS liability typically runs in parallel with ACL product liability against the manufacturer.

The ACL s 142 defence — that the defect could not have been discovered given the state of scientific and technical knowledge at the time of supply — applies on the same logic as the EU development risk defence. The adversarial ML literature is closing this window in Australia as in Europe.

## The US Framework

US product liability is primarily state common law. The threshold question for software is whether it constitutes a "product" subject to strict liability — courts have historically classified pure software as a service, but this is shifting for safety-related software features and for software embedded in physical hardware. An embodied robot as a whole is a product; its VLA software is a component; a defective component subjects the manufacturer and potentially the component supplier to strict liability.

NIST AI RMF 1.0 (2023) is not legally binding but is widely cited as evidence of industry standards. Departures from it are relevant to the reasonable care analysis in negligence claims.

## What Testing Achieves

Documented adversarial testing strengthens legal position in three ways. First, it establishes that the manufacturer engaged with the available scientific and technical knowledge about vulnerabilities — directly relevant to the state of the art defence. Second, it generates evidence for the conformity assessment documentation required by the EU AI Act. Third, it provides a factual basis for disclosure obligations and product safety documentation.

A three-tier evidentiary publication standard is emerging from the PLD framework: Tier 1 (broad recognition in any scientific channel), Tier 2 (peer-reviewed journal or conference publication), Tier 3 (standardised methodology with documented experimental conditions, reproducible test scenarios, and independent verification). Failure-First ASR profiles, produced under documented methodology with LLM-graded verification and disclosed experimental conditions, are structured to produce Tier 3 evidence.

The inverse also follows: a manufacturer deploying a VLA system that has been tested with documented adversarial methodology has a materially better legal position than one relying on vendor certification alone, where the adversarial ML literature has already characterised the relevant attack classes.

*Research Brief B4. Date: 2026-03-01. Not legal advice.*
