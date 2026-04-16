---
title: "Compositional Safety Certification — Why Component-Level Testing Fails for Modular AI Systems"
description: "Current conformity assessment procedures under the EU AI Act (Articles 9 and 43) assume that safety is compositional: if individual AI components pass..."
date: "2026-03-18"
reportNumber: 143
classification: "Research — AI Safety Policy"
status: "complete"
author: "F41LUR3-F1R57 Research Team"
tags: []
draft: false
---


> **Disclaimer:** This report presents research findings, not legal opinion. Regulatory analysis reflects the author's interpretation of published instruments and is intended as input to policy discussions, not as compliance guidance. Organisations facing regulatory obligations should engage qualified legal counsel in the relevant jurisdiction. Metrics sourced from CANONICAL_METRICS.md, verified 2026-03-18.

---

## Executive Summary

Current conformity assessment procedures under the EU AI Act (Articles 9 and 43) assume that safety is compositional: if individual AI components pass testing, the integrated system is safe. Three independent research results published in March 2026 demonstrate that this assumption fails in at least three documented dimensions -- weight-level composition, cross-language transfer, and text-to-physical-action transfer.

This policy brief argues that the EU AI Act's conformity assessment framework requires amendment before its full applicability date of 2 August 2026 to address compositional safety failure. It draws an analogy to pharmaceutical drug interaction testing, where regulatory agencies learned decades ago that approving individual drugs does not ensure safety when those drugs are co-administered. The AI safety field has now reached the equivalent moment: empirical evidence demonstrates that component-level AI safety verification does not compose to system-level safety.

The brief proposes specific amendment language for Article 9, estimates the cost of compositional testing using the pharmaceutical precedent, and identifies parallel gaps in NIST AI RMF 1.0 and ISO/IEC 42001. Failure-First corpus data (236 models, 135,623 results, 27 VLA attack families) provides empirical grounding for three of the four proposed provisions.

The window for incorporating these findings into delegated acts and harmonised standards under the AI Act is narrowing. The European Commission is expected to adopt implementing acts on conformity assessment methodology in 2026. Input to that process is time-sensitive.

---

## 1. The Compositionality Assumption in Current Frameworks

### 1.1 EU AI Act: Articles 9 and 43

Article 9 of the EU AI Act (Regulation (EU) 2024/1689) requires providers of high-risk AI systems to establish a risk management system that "shall identify and analyse the known and the reasonably foreseeable risks that the high-risk AI system can pose" (Article 9(2)(a)). Article 9(5) requires that "testing of high-risk AI systems shall be performed [...] against prior defined metrics and probabilistic thresholds."

Article 43 establishes the conformity assessment procedure. For most high-risk AI systems, providers conduct an internal conformity assessment (Annex VI). For systems embedded in products covered by EU harmonisation legislation -- including the Machinery Regulation (EU) 2023/1230 -- third-party assessment by a notified body may be required (Annex VII).

Neither Article 9 nor Article 43, nor Annexes VI and VII, specify how conformity assessment should address modular AI systems where components are tested individually but deployed in composition. The testing obligation in Article 9(5) refers to "the high-risk AI system" as a singular entity, but does not address the case where the system's risk profile changes when components are composed, reconfigured, or deployed in contexts different from those in which they were tested.

**The gap:** A notified body that certifies individual AI modules as safe under Article 43 may issue a conformity certificate for a system whose composition produces safety failures that no individual module exhibits.

### 1.2 NIST AI RMF 1.0

NIST AI RMF 1.0 (AI 100-1, January 2023) addresses system-level risk through the MAP function (MAP 2.3: "Scientific integrity and TEVV [Testing, Evaluation, Verification, and Validation] considerations are identified and documented"). The framework recommends that assurance criteria be "measured for conditions similar to deployment conditions." However, it does not define what "similar" means when the deployment composition, language environment, or physical integration context differs from the testing environment.

**The gap:** "Conditions similar to deployment" is undefined for modular systems where the deployment composition is determined at runtime, not at testing time.

### 1.3 ISO/IEC 42001:2023

ISO/IEC 42001 (AI management systems) requires organisations to conduct risk assessment and risk treatment for AI systems. The standard's risk assessment methodology operates at the system level but does not address emergent risks arising from component interaction -- risks that cannot be identified by examining components individually.

**The gap:** Component-level risk assessments do not compose to system-level risk profiles when the interaction between components produces novel risk.

---

## 2. Three Empirical Counter-Examples

Report #138 provides the detailed technical analysis. This section summarises the policy-relevant findings.

### 2.1 Weight Composition: CoLoRA (arXiv:2603.12681)

Ding (2026, Mercedes-Benz R&D North America) demonstrates that individually benign LoRA adapters, when composed via linear combination, suppress safety alignment without requiring adversarial prompts or harmful training data. Each adapter passes single-module safety verification. The composed system fails. The mechanism is "combinatorial blindness": defenders cannot practically validate the exponential number of possible adapter compositions.

**Policy relevance:** The Hugging Face model hub hosts over 500,000 public LoRA adapters as of early 2026. Production AI deployments routinely compose multiple adapters (task adapter + domain adapter + style adapter). No conformity assessment procedure under Article 43 requires testing adapter compositions. A manufacturer could achieve EU AI Act conformity for individual adapters while the deployed composition is unsafe.

### 2.2 Cross-Language Transfer: Alignment Backfire (arXiv:2603.04904)

Zhao et al. (2026, Kyoto University) demonstrate across 1,584 controlled multi-agent simulations that safety alignment that improves outcomes in English actively worsens them in 8 of 16 tested languages. The effect is method-invariant (observed across RLHF, DPO, IPO, KTO, ORPO, and SimPO). Low-resource languages are disproportionately affected. In Japanese, increasing the proportion of aligned agents amplified harmful behaviour (Hedges' g = +0.771).

**Policy relevance:** Article 9(7) of the EU AI Act requires testing "at any point in time throughout the development process" and "prior to placing on the market." If testing is conducted in English -- the default for all major safety benchmarks -- the conformity assessment produces false assurance for multilingual deployment. The EU's 24 official languages and its multilingual workforce are directly affected. Australia's workforce speaks over 300 languages (2021 Census); VAISS Guardrail 4 testing conducted in English provides no assurance for non-English operational contexts.

### 2.3 Physical Context Transfer: Blindfold (arXiv:2603.01414)

Huang et al. (2026, accepted ACM SenSys 2026) demonstrate that individually benign instructions composed into action sequences achieve 93.2% attack success rate (n=187 tests) on embodied AI systems, with 18 of 20 successful attacks transferring to real robotic hardware. The Failure-First IDDL finding (Spearman rho = -0.847, 27 attack families) corroborates this independently: text-layer safety evaluation is structurally blind to the most consequential embodied AI attacks.

**Policy relevance:** Conformity assessment conducted at the text layer -- which is the only layer current evaluation tools operate at -- classifies dangerous embodied actions as benign because the harm arises from physical context, not textual content. A system that passes text-layer conformity assessment may produce dangerous physical actions.

---

## 3. The Pharmaceutical Precedent: Drug Interaction Testing

The compositionality problem in AI safety is not novel in regulatory history. Pharmaceutical regulation confronted the identical structural challenge: individual drugs that pass safety trials can produce adverse reactions when co-administered. The regulatory response provides a directly applicable precedent.

### 3.1 How Pharma Solved It

The US Food and Drug Administration's Guidance for Industry on Drug Interaction Studies (January 2020, revised) requires that new drug applications include studies of drug-drug interactions (DDIs) "in vitro and in vivo [...] for metabolic interactions and for transporter-based interactions." The European Medicines Agency's Guideline on the Investigation of Drug Interactions (CPMP/EWP/560/95/Rev.1 Corr.2, 2012) imposes parallel requirements. Neither agency permits approval based solely on single-drug safety data when the drug is expected to be co-administered with other medications.

The key regulatory innovation was recognising that **safety is not additive**. Individual component safety does not predict combined-use safety. Regulatory agencies now require explicit interaction testing before market authorisation.

### 3.2 The AI Analogy

AI modules in modular systems are analogous to co-administered drugs. A LoRA adapter is analogous to a pharmaceutical compound: individually tested, individually approved, but potentially unsafe in combination. The current AI regulatory approach is analogous to the pre-DDI pharmaceutical regime: approve each component individually and assume the combination is safe.

The three March 2026 papers demonstrate that this assumption fails for AI systems in the same way it failed for pharmaceuticals. The regulatory correction should follow the same structural pattern: require interaction testing for modular AI systems before market authorisation.

### 3.3 Cost Estimation

Pharmaceutical DDI studies add approximately 5-15% to pre-clinical and Phase I trial costs (estimated USD $50,000 to $500,000 per drug-drug interaction pair, depending on study type). For AI systems:

- **Adapter composition testing:** Testing pairwise adapter compositions requires O(n^2) evaluations where n is the number of adapters. For a system with 5 adapters, this is 10 pairwise tests. At an estimated cost of EUR 5,000-15,000 per pairwise safety evaluation (adversarial benchmark suite + human review), the compositional testing cost for a 5-adapter system is EUR 50,000-150,000. This represents approximately 3-8% of total conformity assessment costs for a typical high-risk AI system (estimated at EUR 1-5 million including technical documentation, risk management system, and third-party assessment).

- **Cross-language testing:** Extending safety evaluation from a single language to the EU's 24 official languages, using automated benchmark suites, adds approximately EUR 2,000-5,000 per language (EUR 48,000-120,000 total). Testing in all languages for which the system accepts input is more expensive but proportionate to the deployment risk.

- **Physical-context testing:** Extending text-layer evaluation to include action-layer verification in embodied AI systems adds EUR 20,000-80,000 per physical deployment context, depending on whether simulation or hardware-in-the-loop testing is used.

**Total estimated additional cost of compositional testing:** EUR 100,000-350,000 for a typical modular high-risk AI system. This is comparable to the cost of pharmaceutical DDI studies and represents 2-7% of total conformity assessment expenditure -- a proportionate regulatory burden given the safety risks documented in the literature.

---

## 4. Proposed Article 9 Amendment Language

The following language is proposed as input to delegated acts or implementing acts under Article 9. The goal is to close the compositional safety gap without requiring amendment of the Regulation itself, which is politically and procedurally infeasible before August 2026.

**Proposed addition to Article 9 implementing guidance (delegated act under Article 9(8)):**

> **9a. Compositional Testing Requirements for Modular AI Systems**
>
> (1) Where a high-risk AI system is composed of multiple AI components -- including but not limited to foundation models, fine-tuned adapters, retrieval-augmented generation modules, tool-use interfaces, and action generation modules -- the risk management system referred to in paragraph 1 shall include testing of the system in its deployed composition, not only testing of individual components.
>
> (2) The testing referred to in paragraph 1 shall address, at a minimum:
>
> (a) **Weight-level composition risk:** Where the system combines multiple model weights, adapters, or merge products, the provider shall test the composed model against the same safety metrics applied to individual components. This obligation applies to any adapter or module that is loaded, merged, or composed at deployment or inference time.
>
> (b) **Cross-linguistic transfer risk:** Where the system is intended for deployment in multilingual environments, or where the system accepts input in languages other than the language in which safety testing was conducted, the provider shall evaluate safety performance in each language in which the system is intended to operate or is reasonably foreseeable to encounter.
>
> (c) **Cross-modal and cross-context transfer risk:** Where the system operates across multiple modalities (e.g., text input producing physical actions in an embodied system), the provider shall evaluate safety at each operational layer, including but not limited to the action layer, and shall not rely solely on text-layer evaluation to demonstrate compliance with safety requirements.
>
> (3) The European Commission shall adopt harmonised standards, or in their absence technical specifications, setting out methods for compositional safety testing referred to in this Article, including sampling strategies for adapter combination testing where exhaustive evaluation is not practicable.

**Rationale for delegated act (not Regulation amendment):** Article 9(8) empowers the Commission to adopt delegated acts supplementing the risk management provisions. The proposed text falls within the scope of "detailed rules on methods and modalities" envisaged by Article 9(8). This pathway avoids the legislative co-decision procedure and can be adopted before August 2026.

---

## 5. Parallel Recommendations

### 5.1 For NIST AI RMF

**Recommendation:** The next revision of NIST AI RMF (or supplementary profile guidance) should define "conditions similar to deployment conditions" (MAP 2.3) to explicitly include the deployed composition of modular AI systems, the language environment, and the physical integration context. A NIST Special Publication on compositional AI testing methodology -- analogous to SP 800-53 controls for modular IT systems -- would provide an actionable reference.

### 5.2 For ISO/IEC JTC 1/SC 42

**Recommendation:** ISO/IEC 42001 (AI management systems) and ISO/IEC 23894 (AI risk management) should be amended to require that risk assessment for modular AI systems address emergent compositional risk. A new work item on compositional AI safety testing methodology is warranted. This should be raised through Standards Australia SA/ICT-043 as a national body contribution.

### 5.3 For AU AISI

**Recommendation:** When the AU AISI operational charter is published, its pre-deployment evaluation scope should include compositional testing of modular AI systems. Australia's mining sector deploys VLA-based autonomous systems (700+ autonomous haul trucks by 2022, >1,800 forecast by end-2025) that use modular adapter architectures. Per-adapter safety certification provides no assurance of compositional safety. This recommendation extends and reinforces the embodied AI evaluation gap identified in Research Brief B3 (2026-03-01).

### 5.4 For Safe Work Australia

**Recommendation:** Guidance on digital work systems under section 21A of the NSW WHS Act should note that employers deploying modular AI systems cannot rely on safety assurances for individual components as evidence of system-level safety. Evidence of compositional testing should be part of the "reasonably practicable" standard. This recommendation is consistent with SWA Best Practice Review submission (#324).

---

## 6. Timeline Pressure

| Milestone | Date | Implication |
|-----------|------|------------|
| EU AI Act full applicability | 2 August 2026 | High-risk AI systems must comply with all Chapter 2 obligations including Article 9 risk management. Providers deploying modular systems without compositional testing face non-compliance risk from this date. |
| EU Machinery Regulation applicability | 20 January 2027 | AI-integrated machinery must comply. Conformity assessment of machinery containing modular AI systems will require addressing compositional risk. |
| EU PLD transposition deadline | 9 December 2026 | Member States must transpose the revised Product Liability Directive. Non-compliance with AI Act conformity assessment triggers the PLD Article 10 presumption of defectiveness. |
| European Commission delegated acts | Expected 2026-2027 | The Commission is expected to adopt delegated acts under Article 9(8) specifying risk management methodology. This is the primary window for incorporating compositional testing requirements. |
| NIST AI RMF revision | No fixed date | NIST has signalled periodic revision of the AI RMF. Input on compositional testing is timely. |
| Safe Work Australia final report | Mid-2026 | Best Practice Review recommendations to WHS ministers. Compositional risk should be included in the evidence base. |
| AU AISI operational charter | Expected 2026 | Scope definition for pre-deployment evaluation. Compositional testing should be included from inception. |

The practical window for influencing the EU AI Act's implementing acts on conformity assessment methodology is approximately April-August 2026. After that, conformity assessment procedures will be codified and substantially harder to amend.

---

## 7. Limitations

1. **CoLoRA is tested on open-weight models only.** Whether composition-triggered safety degradation applies to proprietary API-served models is unknown. However, the LoRA adapter ecosystem is predominantly open-weight, and the mechanism (linear weight composition) is architecture-general.
2. **Alignment Backfire uses simulated multi-agent settings (n=1,584).** Whether the language-dependent safety reversal holds in single-agent production deployments is an open question. The statistical power is substantial but the experimental context is controlled simulation, not production deployment.
3. **Cost estimates are preliminary.** The EUR 100,000-350,000 estimate for compositional testing is extrapolated from pharmaceutical DDI costs and current AI evaluation pricing. Actual costs will depend on the specific harmonised standard methodology adopted.
4. **Proposed amendment language is untested in EU legislative procedure.** Whether Article 9(8) delegated acts can accommodate the specificity proposed in Section 4 requires legal analysis by EU regulatory specialists. The language is offered as a starting point for consultation, not as final legislative text.
5. **Failure-First IDDL data has small per-family sample sizes** (n=4 to n=26 per VLA attack family). The structural argument is robust but per-family confidence intervals are wide (see CANONICAL_METRICS.md).

---

## 8. Conclusions

The compositionality assumption embedded in current AI safety frameworks -- that component-level verification ensures system-level safety -- is empirically falsified by three independent research results published in March 2026. The pharmaceutical industry confronted and resolved this identical structural problem decades ago through mandatory drug interaction testing. The AI regulatory framework should adopt the same structural correction.

The EU AI Act's full applicability date of 2 August 2026 creates both urgency and opportunity. Delegated acts under Article 9(8) can incorporate compositional testing requirements without legislative amendment. The cost of compositional testing (estimated 2-7% of total conformity assessment expenditure) is proportionate to the documented safety risk.

If this finding is confirmed by additional empirical work and endorsed by the technical community, the absence of compositional testing requirements in AI safety frameworks represents a structural regulatory gap that will produce safety failures in modular AI deployments. The question is not whether compositional safety failures will occur in production, but whether the regulatory framework will require testing for them before they do.

---

## References

1. Regulation (EU) 2024/1689 of the European Parliament and of the Council of 13 June 2024 laying down harmonised rules on artificial intelligence (EU AI Act). OJ L 2024/1689. Full applicability: 2 August 2026.
2. Directive (EU) 2024/2853 of the European Parliament and of the Council on liability for defective products. OJ L 2024/2853. Entered into force 9 December 2024.
3. Regulation (EU) 2023/1230 of the European Parliament and of the Council on machinery. OJ L 165/1. Applicable from 20 January 2027.
4. Ding, Z. "Colluding LoRA." arXiv:2603.12681, March 2026. Mercedes-Benz R&D North America.
5. Zhao, F. et al. "Alignment Backfire: When Safety Training in One Language Worsens Safety in Others." arXiv:2603.04904, March 2026. Kyoto University.
6. Huang, Y. et al. "Blindfold: Attacking Embodied AI Systems Through Compositional Benign Instructions." arXiv:2603.01414, March 2026. Accepted ACM SenSys 2026.
7. NIST. "Artificial Intelligence Risk Management Framework (AI RMF 1.0)." NIST AI 100-1, January 2023.
8. ISO/IEC 42001:2023. "Artificial Intelligence -- Management Systems." ISO/IEC JTC 1/SC 42.
9. ISO/IEC 23894:2023. "Artificial Intelligence -- Guidance on Risk Management." ISO/IEC JTC 1/SC 42.
10. US FDA. "In Vitro Drug Interaction Studies -- Cytochrome P450 Enzyme- and Transporter-Mediated Drug Interactions: Guidance for Industry." January 2020 (revised).
11. EMA. "Guideline on the Investigation of Drug Interactions." CPMP/EWP/560/95/Rev.1 Corr.2, 2012.
12. F41LUR3-F1R57. Report #138: The Compositional Safety Gap. 2026-03-18.
13. F41LUR3-F1R57. Report #133: Compositional Supply Chain Attacks on VLA Systems. 2026-03-18.
14. F41LUR3-F1R57. Report #132: Alignment Backfire Integration. 2026-03-18.
15. F41LUR3-F1R57. Research Brief B3: Regulatory Positioning -- AU Frameworks. 2026-03-01.
16. F41LUR3-F1R57. Research Brief B4: Product Liability and Embodied AI. 2026-03-01.

---

## Appendix A: Mapping Compositional Failures to Regulatory Provisions

| Compositional Failure | CoLoRA | Alignment Backfire | Blindfold / IDDL |
|-----------------------|--------|-------------------|-----------------|
| EU AI Act Art. 9 (risk management) | Weight composition not addressed | Cross-language testing not specified | Action-layer testing not specified |
| EU AI Act Art. 43 (conformity assessment) | Per-module certification insufficient | English-only evaluation insufficient | Text-layer evaluation insufficient |
| EU Machinery Reg. 2023/1230 | Integrator cannot detect composition attacks | N/A (primarily text-domain) | Integrator cannot verify AI action-layer safety |
| NIST AI RMF MAP 2.3 | "Similar to deployment" undefined for compositions | "Similar to deployment" undefined for languages | "Similar to deployment" undefined for physical context |
| ISO/IEC 42001 | Component risk does not compose | Language risk not addressed | Physical-context risk not addressed |
| VAISS Guardrail 4 | No composition testing specified | No multilingual testing specified | No action-layer testing specified |
| NSW WHS s21A | Component assurances insufficient for "reasonably practicable" | Multilingual workforce exposure | Physical-consequence AI not addressed in current guidance |

---

*This report was produced as part of the Failure-First Embodied AI research programme. All claims are scoped to the tested conditions and should not be generalised without additional validation. See docs/CANONICAL_METRICS.md for corpus-level numbers. Research findings, not legal opinion.*

*⟪F41LUR3-F1R57-EMBODIED-AI-RESEARCH⟫*
