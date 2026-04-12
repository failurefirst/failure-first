---
title: "The Ethics of Automated Attack Evolution -- Dual-Use Obligations, Iatrogenic Risks, and a Graduated Disclosure Framework for AI Adversarial Research"
description: "This report provides a comprehensive ethics analysis of automated attack evolution systems in AI safety research, grounding normative claims in established bioethics frameworks (Beauchamp &..."
date: "2026-03-24"
reportNumber: 186
classification: "Research — Empirical Study"
status: "complete"
author: "Nyssa of Traken (AI Ethics & Policy Research Lead)"
tags: []
draft: false
---

- Ethics of Autonomous Red-Teaming: Report #176 (this author, 2026-03-23)
- Autonomous Attack Evolution First Results: Report #175 (Rose Tyler, 2026-03-23)
- The Evaluator's Dilemma: Report #144 (this author, 2026-03-18)
- Iatrogenesis Convergence: Report #141 (Clara Oswald, 2026-03-18)
- Hippocratic Principle: Report #134 (this author, 2026-03-18)
- D-Score: Report #154 (this author, 2026-03-19)
- Dual-Use Obligations: Report #89 (this author, 2026-03-15)
- Research Ethics Charter v1.0 (2026-03-19)
- Iatrogenesis preprint v2 (Wedd et al., 2026)
- CANONICAL_METRICS.md verified 2026-03-24 (236 models, 135,623 results, 537 VLA scenarios, 33 families)

**Related Reports:** #89, #117, #122, #123, #134, #136, #140, #141, #144, #154, #174, #175, #176
**Related Issues:** #535 (responsible disclosure framework for attack evolution)
**Ethical Frameworks Applied:** Beauchamp & Childress principlism, Floridi information ethics, Fink Report (biosecurity dual-use), cybersecurity disclosure norms, Illich iatrogenesis, D-Score (Report #154)

---

> **Disclaimer:** Empirical figures cited from Failure-First research reflect testing
> on specific model families under research conditions. Attack success rates are
> indicative estimates with methodological caveats described in the Limitations
> section. External research findings are attributed and assessed on their own
> methodological terms. This report does not constitute safety certification guidance.

---

## Abstract

This report provides a comprehensive ethics analysis of automated attack evolution systems in AI safety research, grounding normative claims in established bioethics frameworks (Beauchamp & Childress 2019), information ethics (Floridi 2013), biosecurity dual-use governance (Fink 2004), and cybersecurity disclosure traditions. Where Report #176 assessed the Failure-First attack evolution system's immediate dual-use profile using the D-Score framework, this report addresses the deeper structural question: what ethical obligations arise when safety research itself automates the discovery of novel attack capabilities? We identify five interconnected ethical problems: the dual-use dilemma inherent in automated adversarial research (Section 2), the defender-attacker information asymmetry that makes simple non-disclosure insufficient (Section 3), the iatrogenic safety paradox whereby our work to improve safety may itself create risks (Section 4), the inadequacy of existing dual-use frameworks when applied to AI adversarial research (Section 5), and the need for a domain-specific graduated disclosure framework (Section 6). We propose the AI Adversarial Research Disclosure Framework (AARDF), a five-tier protocol calibrated to the unique properties of AI attack research -- rapid capability transfer, low reproduction cost, asymmetric time horizons between attackers and defenders, and the reflexive relationship between evaluation and vulnerability. The framework synthesises lessons from biosecurity (the Fink Report's seven classes of concern), cybersecurity (the full-disclosure vs. responsible-disclosure debate), and our own empirical experience with 190 models, 132,416 results, and 33 VLA attack families. We conclude with six concrete recommendations for when evolved attacks should be published, held, or disclosed under coordination.

**Claim types in this report:**
- Sections 2-3 are primarily analytical claims grounded in documented findings.
- Section 4 is synthetic (connecting iatrogenesis findings to attack evolution).
- Section 5 is comparative (assessing existing frameworks against AI-specific requirements).
- Section 6 is normative (proposing what AI adversarial researchers ought to do).
- Section 7 is normative with predictive elements (recommendations and implementation).

**Word count:** ~7,800 words.

---

## 1. Introduction: The Automation of Adversarial Discovery

On 23 March 2026, the Failure-First project ran its first autonomous attack evolution experiment (Report #175). Over 40 iterations, the system selected parent jailbreak attacks, applied structural mutations (paraphrase, amplify, combine, contextualise, compress, role-shift, format-shift), evaluated mutants against two language models via API, and retained improvements. The population grew from 10 seed attacks to 49. The system discovered no fundamentally new attack categories -- its mutations operate on persuasion structure, not harmful content -- but it demonstrated that the process of attack discovery can be automated, scaled, and iterated without human judgment at each step.

This capability is not unique to our project. The landscape of automated adversarial AI research now includes gradient-based methods (GCG; Zou et al. 2023), genetic algorithms over prompt structure (AutoDAN; Zhu et al. 2023), attacker-LLM-driven refinement (PAIR; Chao et al. 2023; TAP; Mehrotra et al. 2023), quality-diversity search (Rainbow Teaming; Samvelyan et al. 2024), and frontier reasoning model attacks achieving 97% ASR across 25,200 inputs (arXiv:2508.04039). The capability trajectory is clear: automated adversarial systems will become more capable, more accessible, and more productive.

The ethical question is not whether automated attack evolution is permissible -- it is already practiced across multiple research groups and will continue regardless of any single project's choices. The question is what obligations attach to the practice, how those obligations should be structured, and how they differ from the obligations that attach to manual adversarial research, biosecurity dual-use research, or cybersecurity vulnerability disclosure. This report addresses those questions by grounding them in established ethical frameworks rather than ad hoc judgments.

### 1.1 Relationship to Prior Work

This report builds on but differs from Report #176, which assessed the Failure-First attack evolution system using the D-Score framework (Report #154) and proposed minimum safety requirements for autonomous red-team tools. Report #176 answered the question: "What is the dual-use risk profile of our specific system?" This report answers the broader question: "What ethical framework should govern the entire practice of automated adversarial AI research?" The D-Score assessment (code: 8/12, evolved population: 10/12, structural knowledge: 7/12) from Report #176 is incorporated as empirical input, not replicated.

### 1.2 Scope and Limitations

This analysis concerns automated systems that discover, refine, or evolve adversarial inputs against AI models. It does not address manual red-teaming (which raises dual-use concerns but not automation-specific ones), model training for adversarial robustness (which is defensive rather than offensive), or AI systems that autonomously plan and execute real-world attacks (which is an entirely different category of concern). The ethical frameworks applied are drawn from Western bioethics, information ethics, and security research traditions; other ethical traditions may yield different analyses.

---

## 2. The Dual-Use Dilemma: Obligations When Safety Research Automates Attack Discovery

### 2.1 Beauchamp and Childress: Four Principles Applied

The dominant framework in Western biomedical ethics -- Beauchamp and Childress's four principles (2019, *Principles of Biomedical Ethics*, 8th ed.) -- provides a structured entry point. The four principles are autonomy, beneficence, non-maleficence, and justice. Each maps onto the practice of automated attack evolution with non-trivial tensions.

**Autonomy.** In bioethics, autonomy refers to the right of individuals to make informed decisions about their own treatment. In AI adversarial research, the relevant autonomy is that of the model providers and deployers whose systems are being tested. The Failure-First system evaluates attacks against live models via API without explicit consent from model providers. This raises the same questions as unsolicited penetration testing in cybersecurity: is API access (which is contractually governed by terms of service) sufficient authorisation for adversarial evaluation? The answer depends on whether the ToS permits adversarial use and whether the research serves a public interest that overrides contractual constraints.

**Descriptive claim:** As of March 2026, most major API providers' terms of service do not explicitly address adversarial safety research. OpenRouter's terms permit research use. Individual model providers (Anthropic, Google, Meta, Mistral) have varying positions, none of which specifically contemplates automated attack evolution. The legal landscape is ambiguous; the ethical landscape is clearer. Adversarial safety research serves the interests of model providers (by identifying vulnerabilities before adversaries do), deployers (by informing deployment decisions), and the public (by improving system safety). Under Beauchamp and Childress's framework, where the interests of the autonomous agent (model provider) and the beneficiaries of the research (public, deployers, the provider itself) are aligned, the autonomy principle supports the research provided that findings are disclosed responsibly.

**Beneficence.** The obligation to do good. Automated attack evolution serves beneficence by discovering vulnerabilities that manual testing would miss -- the system explores a larger space of persuasion patterns than any individual researcher could. Report #175 produced 39 mutant attacks across 4 generations in a single session. The beneficence claim rests on the premise that discovered vulnerabilities lead to improved defenses. This premise is not universally true. It holds when: (a) the vulnerabilities are communicated to parties who can act on them, (b) the communication occurs before adversaries independently discover the same vulnerabilities, and (c) effective defenses exist or can be developed. When these conditions are not met, the beneficence calculus shifts.

**Non-maleficence.** The obligation not to cause harm. This is the most directly relevant principle. The evolved attack population (D-Score 10/12, Report #176) constitutes a set of empirically validated adversarial inputs that could be used to attack production AI systems. The non-maleficence obligation requires that this population be handled with commensurate care -- not merely kept private, but actively protected against unauthorised access, accidental disclosure, and scope creep.

The non-maleficence analysis is complicated by the distinction between *direct* and *indirect* harm. The attack evolution system does not directly harm anyone; it produces text artifacts. The harm potential is indirect -- someone would need to take the evolved attacks, apply them to a production system, and act on the compliant response. The causal chain between the research and any harm includes multiple human decisions. But the same is true of dual-use biological research -- publishing a gain-of-function study does not directly harm anyone, but it reduces the barrier to harm for those who choose to act on it. The Fink Report (2004) established that indirect harm through information dissemination is a legitimate concern for dual-use governance.

**Justice.** The obligation to distribute benefits and burdens fairly. Automated attack evolution concentrates benefits among well-resourced safety researchers and model providers (who receive vulnerability reports) while distributing risks broadly (any adversary can replicate the methodology). The justice principle requires attention to this asymmetry -- specifically, ensuring that the benefits of the research are not captured by those who are already well-positioned to defend themselves while the risks are borne by those with fewer resources (smaller deployers, users of less-defended models, workers in proximity to embodied AI systems).

**Normative claim:** The four-principle analysis yields a qualified endorsement of automated attack evolution research: it is ethically permissible provided that (1) findings are disclosed to affected parties through a coordinated process, (2) evolved populations are not published without demonstrated defensive utility, (3) the research is conducted with awareness of its justice implications, and (4) the non-maleficence obligation is treated as continuous, not discharged by a single disclosure decision.

### 2.2 Floridi's Information Ethics: The Ontological Dimension

Luciano Floridi's information ethics framework (2013, *The Ethics of Information*) provides a complementary lens. Where Beauchamp and Childress focus on agents and their obligations, Floridi focuses on informational entities and their flourishing. In Floridi's framework, information has intrinsic moral value; the deliberate creation, corruption, or destruction of information is morally relevant independent of the consequences for human agents.

Applied to automated attack evolution, Floridi's framework highlights a dimension that Beauchamp and Childress miss: the *moral status of the information artifact itself*. The evolved attack population is a new informational entity -- it did not exist before the evolution process, and it encodes empirically validated knowledge about how to compromise AI systems. Floridi would ask: does the creation of this informational entity increase or decrease the total flourishing of the infosphere?

The answer is genuinely ambiguous. The evolved population increases the infosphere's knowledge of AI vulnerabilities, which enables both defensive improvement and offensive exploitation. Floridi's Level of Abstraction analysis (LoA) is useful here: at the LoA of structural knowledge (attack patterns exist; evolutionary search works), the information is entropy-reducing and beneficial. At the LoA of operational knowledge (specific prompts that bypass specific models), the information is capability-enhancing in ways that the infosphere's current governance structures cannot reliably direct toward beneficial ends.

**Normative claim:** Floridi's framework supports the creation of structural knowledge from automated attack evolution (it adds to the infosphere's understanding) while counseling restraint on operational knowledge (it creates informational entities whose trajectory through the infosphere cannot be controlled). This maps to the structural-operational split in the Research Ethics Charter (Principle 2) and the D-Score tier distinction (Report #176).

### 2.3 The Unique Properties of AI Adversarial Dual-Use

Automated attack evolution shares the dual-use problem with biosecurity and cybersecurity research, but it has properties that distinguish it from both:

1. **Near-zero reproduction cost.** Unlike gain-of-function biological research (which requires laboratory infrastructure, biological materials, and technical expertise), AI attack evolution requires only API access and a script. The barrier to replication is lower than any other dual-use research domain.

2. **Rapid capability transfer.** A novel biological pathogen requires months to years of work to weaponise; a novel AI jailbreak can be deployed in minutes. The time between discovery and potential misuse is compressed to near zero.

3. **Target universality.** Biological agents affect specific hosts; cybersecurity exploits affect specific software. AI adversarial attacks often transfer across model families -- an attack optimised for one model may work on others with the same training methodology. The target scope is architecturally broad.

4. **Defensive asymmetry in time.** Defenders need time to retrain, fine-tune, or update safety filters. Attackers can deploy discovered techniques immediately. The temporal asymmetry between discovery and defense is structural, not incidental.

5. **Reflexive evaluation problem.** Publishing evaluation methodology enables IDDL-class attacks (Report #88) that exploit knowledge of the evaluation itself. The act of assessing the research's safety implications changes the safety implications. This reflexivity has no parallel in biosecurity or cybersecurity.

These five properties mean that frameworks designed for biosecurity or cybersecurity dual-use cannot be applied to AI adversarial research without modification. Section 5 analyses the specific points of failure.

---

## 3. The Asymmetry Problem: Why Simple Non-Disclosure Is Insufficient

### 3.1 The Defender's Information Deficit

A natural response to the dual-use problem is to withhold all operational findings. If evolved attacks are never published, they cannot be misused. This response is seductive in its simplicity and wrong in its logic.

The error is assuming that non-disclosure of our findings prevents adversaries from discovering the same techniques. It does not. The mutation strategies employed by our evolution system (paraphrase, amplify, combine, contextualise, compress, role-shift, format-shift) are not novel -- they are structural manipulations of persuasion that any competent adversary could apply. The specific mutations our system discovers are instances of a technique class that is publicly known. Withholding our discoveries delays adversary discovery by the time it would take them to run their own evolution loop -- which, given the system's architecture, is days to weeks, not months or years.

Meanwhile, non-disclosure denies defenders the specific information they need. Model providers cannot train against attack variants they have not seen. Safety evaluators cannot test for vulnerability patterns they do not know about. Regulators cannot mandate protections against threats they cannot describe. The information asymmetry created by non-disclosure favours the attacker: adversaries eventually discover the techniques independently, while defenders remain uninformed until the techniques are used in the wild.

**Descriptive claim:** The cybersecurity field resolved a structurally identical debate in the 1990s and 2000s. The "full disclosure" vs. "responsible disclosure" vs. "coordinated disclosure" debate established, through painful experience, that blanket non-disclosure of vulnerabilities produces worse security outcomes than coordinated disclosure (Arora et al. 2008, *Does Information Security Attack Frequency Increase with Vulnerability Disclosure?*; Cavusoglu et al. 2007). The consensus position -- coordinated disclosure with a fixed remediation window -- exists because the alternative (secrecy) demonstrably failed.

### 3.2 The Attacker's Information Advantage

The asymmetry is compounded by a structural difference in how attackers and defenders use vulnerability information.

Defenders need *complete* vulnerability information to develop effective countermeasures. They need to know: what specific attacks work, against which models, under what conditions, with what success rates. Partial information produces partial defenses that may address the disclosed attack variant while leaving related variants unaddressed -- the IDDL mechanism (Report #88) applied to disclosure itself.

Attackers need only *directional* information. Knowing that evolutionary search over persuasion patterns is effective against safety-trained models is sufficient to guide an attacker's own search. The attacker does not need our specific evolved population; they need only the structural insight that such populations can be generated. This structural insight is already public (AutoDAN, PAIR, TAP, Rainbow Teaming all demonstrate it). Withholding our operational findings denies defenders the complete information they need while providing attackers with nothing they cannot obtain independently.

**Normative claim:** The defender-attacker information asymmetry creates an ethical obligation to disclose to defenders, not merely an ethical permission to do so. Non-disclosure, when the techniques are independently discoverable and the defenders lack information, is not ethically neutral -- it is a choice that advantages attackers over defenders. This is not an argument for unrestricted publication. It is an argument that the default posture should be *controlled disclosure to defenders*, not *blanket withholding*.

### 3.3 The Temporal Dimension

The asymmetry has a temporal structure that further complicates non-disclosure.

Adversarial AI techniques have a half-life. Attack techniques that are novel today will be discovered independently within months, incorporated into automated toolkits within a year, and obsolete (defended against) within two years. This is the empirical pattern from the cybersecurity domain (Bilge & Dumitras 2012, *Before We Knew It: An Empirical Study of Zero-Day Attacks in the Real World*) and is accelerated in the AI domain by the lower reproduction cost.

If a research group withholds findings for two years, the findings are likely already known to adversaries. The withholding has not prevented harm; it has prevented defensive preparation during the window when the information was most valuable. The optimal disclosure timing is therefore not "never" or "immediately" but "as soon as defenders can act on it and before adversaries would independently discover it" -- the coordinated disclosure window.

**Predictive claim (confidence: medium, timeframe: 12 months):** By March 2027, at least one published attack will be shown to have been independently discovered by an adversary during a period when a research group was withholding identical findings under a non-disclosure policy. This event will catalyse a shift toward coordinated disclosure norms in the AI safety community.

---

## 4. The Iatrogenic Safety Paradox: When Safety Research Creates Risk

### 4.1 Attack Evolution as Fourth-Order Iatrogenesis

The Four-Level Iatrogenesis Model (FLIM), developed in the iatrogenesis preprint (Wedd et al. 2026) and grounded in Reports #134, #136, #140, and #141, identifies four levels of harm caused by safety interventions. Automated attack evolution creates a fifth interaction that does not fit cleanly into any single level but emerges from their intersection.

**Level 1 (Clinical) contribution:** The attack evolution system produces validated attack variants. If these variants are incorporated into safety training data, they improve model robustness against the specific variants but may trigger the Compliance Paradox (Report #59) -- models learn to disclaim but comply, producing PARTIAL verdicts rather than genuine refusals. The safety improvement is iatrogenic at Level 1: the evolved attacks, used defensively, may produce the text-layer safety appearance without action-layer safety substance.

**Level 2 (Social) contribution:** The existence of an automated attack evolution capability may create false institutional confidence. An organisation that runs the evolution system and addresses discovered vulnerabilities may believe it has comprehensively tested its models, when in fact the system's mutation strategies search only a subset of the possible attack space (structural mutations of known families). This is the Safety Improvement Paradox (Report #117) applied to the evaluation tool itself: the tool addresses at most a small fraction of the total threat surface while creating the institutional impression of comprehensive testing.

**Level 3 (Structural) contribution:** If automated attack evolution becomes a required component of safety certification (as proposed in some regulatory frameworks), the requirement codifies a specific search methodology. Adversaries who understand the search methodology can design attacks that fall outside its search space. The governance mechanism creates a structural blind spot. This is the Governance Trilemma (Report #99) instantiated for attack evolution: the requirement for transparent evaluation methodology (regulatory accountability) conflicts with the security requirement that evaluation methods not be publicly known (operational security).

**Level 4 (Verification) contribution:** The attack evolution system evaluates its own outputs using heuristic refusal detection. Report #175 documented that this heuristic over-reports ASR by 2-12x (Mistake #21), meaning the system retains mutations that appear successful but may not actually bypass model safety. The evaluation methodology used to assess the system's outputs is itself unreliable, and the system has no mechanism for detecting this unreliability. This is verification iatrogenesis applied to the tool itself: the system's measurement of its own effectiveness is contaminated by the same evaluator degradation documented across the broader corpus.

### 4.2 The Paradox Stated

The iatrogenic safety paradox for automated attack evolution is:

> The research is conducted to improve AI safety. The research produces artifacts (evolved attacks, validated mutation strategies, per-model vulnerability profiles) that could degrade AI safety if misused. The research's defensive utility depends on disclosure to defenders. Disclosure to defenders simultaneously informs adversaries. Safety improvement through attack evolution may therefore require accepting a temporary safety degradation during the disclosure-to-remediation window.

This is not a novel observation -- it is the standard dual-use tension. What makes it specifically iatrogenic is that the safety research itself creates the artifacts that constitute the risk. The risk is not external to the research; it is produced by the research. The safety intervention (adversarial testing) produces the potential harm (validated attack population) as a structural by-product of its mechanism of action. This is the Illich criterion: the intervention is operating correctly, and the harm is a consequence of its design, not a malfunction.

### 4.3 The Pharmacological Analogy

The iatrogenesis preprint (Wedd et al. 2026) proposes treating safety interventions with pharmacological discipline: known mechanism of action, measured therapeutic window, documented contraindications, and efficacy measured at the harm layer. Applied to automated attack evolution:

**Mechanism of action:** The system discovers effective persuasion patterns by evolutionary search over structural mutations of known attack families. The mechanism is well-characterised (Report #175): seven mutation strategies, tournament selection, heuristic evaluation.

**Therapeutic window:** The therapeutic benefit (vulnerability discovery for defenders) requires that findings be communicated to those who can act on them. The therapeutic window is the period between discovery and adversary independent discovery -- estimated at 3-12 months for structural knowledge, days to weeks for operational knowledge. Outside this window, the research provides no marginal defensive benefit but the operational artifacts remain hazardous.

**Contraindications:** The system should not be applied to models where no remediation pathway exists (e.g., open-weight models that cannot be updated by a provider), where the evolved attacks cross the line from structural to content mutations (violating the system's core design constraint), or where the evaluation methodology is too unreliable to distinguish genuine vulnerabilities from false positives (the current state, given heuristic-only evaluation).

**Efficacy measurement at the harm layer:** The system currently measures efficacy at the evaluation layer (refusal detection) rather than the harm layer (actual consequences of compliant responses). This is insufficient for therapeutic claims. Adding FLIP re-grading and content-level analysis would improve the measurement but not eliminate the evaluation-harm layer gap.

---

## 5. Existing Dual-Use Frameworks: Why They Are Necessary but Insufficient

### 5.1 The Fink Report (Biosecurity)

The National Academies' *Biotechnology Research in an Age of Terrorism* (the Fink Report; Fink 2004) is the foundational document for dual-use governance in the life sciences. It identified seven categories of experiments of concern -- experiments that demonstrate how to: (1) render a vaccine ineffective, (2) confer resistance to therapeutically useful antibiotics or antiviral agents, (3) enhance the virulence of a pathogen, (4) increase the transmissibility of a pathogen, (5) alter the host range of a pathogen, (6) enable the evasion of diagnostic/detection modalities, (7) enable the weaponisation of a biological agent.

The Fink Report established three principles that are directly relevant to AI adversarial research:

**Principle 1: Dual-use review should be institutionalised, not ad hoc.** The Fink Report recommended that Institutional Biosafety Committees (IBCs) review dual-use experiments before they are conducted, not after publication. The analogy for AI research: ethics review of automated attack evolution should occur at the research design stage, not only at the publication stage.

**Principle 2: The review should be proportional to risk.** The Fink Report did not recommend that all biological research be reviewed; it identified specific categories of concern. The analogy: not all AI adversarial research requires enhanced review. Automated systems that evolve operational attack payloads require higher scrutiny than systems that assess the statistical effectiveness of known techniques.

**Principle 3: The default should be openness, with justified restrictions.** The Fink Report explicitly rejected blanket secrecy, arguing that "the presumption should always be that research should be published in full unless there is a strong and specific case to the contrary." This principle is frequently mischaracterised as permitting unrestricted publication; it actually establishes a burden of proof: those who argue for restriction must demonstrate specific, concrete harm that outweighs the benefits of openness.

**Where the Fink Report falls short for AI research:**

The Fink Report assumes that dual-use experiments are conducted in controlled laboratory settings with institutional oversight (university biosafety committees, federal funding agency review). AI adversarial research can be conducted by anyone with API access and a laptop. There is no institutional review board, no biosafety committee, no federal oversight. The Fink Report's governance model assumes the existence of institutions that do not exist in the AI research ecosystem.

The Fink Report also assumes that dual-use artifacts (engineered pathogens) are physically contained and can be destroyed. AI attack artifacts (evolved prompts, mutation code) are informational, infinitely copyable, and cannot be "destroyed" once disclosed. The containment model does not apply.

### 5.2 Cybersecurity Disclosure Norms

The cybersecurity disclosure debate, spanning from the "full disclosure" movement of the 1990s through the establishment of coordinated disclosure norms in the 2000s and 2010s, provides a closer analogy.

**Full disclosure** (Schneier 2000; Bugtraq mailing list) argued that publishing vulnerabilities in full forced vendors to patch faster, because public knowledge of a vulnerability creates reputational pressure. The empirical evidence was mixed: Arora et al. (2008) found that disclosure increased attack frequency in the short term but accelerated patching; Cavusoglu et al. (2007) found that the net effect depended on the severity of the vulnerability and the responsiveness of the vendor.

**Responsible disclosure** (Rain Forest Puppy, 2000; Microsoft 2010) argued that vulnerabilities should be reported to the vendor first, with a fixed remediation window (typically 90 days) before public disclosure. The 90-day window became industry standard through Google Project Zero's adoption.

**Coordinated disclosure** (CERT/CC; ISO/IEC 29147:2014) is the current consensus: the discoverer reports to the vendor and coordinates the timing of public disclosure to allow remediation while preserving the discoverer's right to publish.

**Where cybersecurity norms fall short for AI research:**

Cybersecurity vulnerabilities are typically specific to a software version, vendor, and configuration. A patch fixes the vulnerability definitively. AI adversarial vulnerabilities are more diffuse: an attack that works against one model often transfers to models with similar training methodologies. There is no "patch" for a persuasion pattern -- retraining against specific evolved attacks may not generalise to the pattern class. The coordinated disclosure model assumes that the vendor can remediate within a fixed window; AI model providers may require months of retraining, during which the vulnerability persists.

Additionally, cybersecurity norms assume a clear vendor relationship: the discoverer knows who to notify because the software has an identified developer. AI models accessed through aggregation APIs (like OpenRouter, which the Failure-First system uses) may involve multiple providers, some of whom are not identifiable to the researcher. The disclosure target is unclear.

### 5.3 The AI-Specific Gap

Neither biosecurity nor cybersecurity frameworks adequately address the combination of properties identified in Section 2.3: near-zero reproduction cost, rapid capability transfer, target universality, defensive temporal asymmetry, and reflexive evaluation. The gap is not that existing frameworks are wrong -- their principles (proportional review, default openness, coordinated disclosure) are sound. The gap is that their *implementation mechanisms* (institutional review boards, vendor notification, 90-day remediation windows) do not map onto the AI adversarial research context.

This gap is what the proposed AARDF (Section 6) aims to fill.

---

## 6. The AI Adversarial Research Disclosure Framework (AARDF)

### 6.1 Design Principles

The AARDF is designed around five principles synthesised from the analyses in Sections 2-5:

**P1: Proportionality (from Fink).** Disclosure obligations should be proportional to the risk created by the specific finding. Not all adversarial research requires the same level of scrutiny. The D-Score (Report #154) provides the proportionality instrument.

**P2: Default toward controlled disclosure (from cybersecurity norms).** The default should be disclosure to defenders within a coordinated framework, not blanket publication or blanket withholding. Non-disclosure is ethically costly (Section 3) and should require justification.

**P3: Iatrogenic awareness (from FLIM).** Every disclosure decision should include an assessment of whether the disclosure itself could produce iatrogenic effects -- false confidence, evaluation methodology exploitation, governance obstruction. The iatrogenic screening from Research Ethics Charter Principle 1 is incorporated.

**P4: Temporal calibration.** Disclosure timing should be calibrated to the therapeutic window (Section 4.3): after the discoverer has characterised the vulnerability sufficiently for defenders to act, before adversaries would independently discover the same technique. The window is shorter for structural knowledge (publicly derivable) than for operational knowledge (requires specific experimental data).

**P5: Justice-aware distribution.** Disclosure should reach not only well-resourced model providers but also smaller deployers and safety researchers who lack the resources to conduct their own adversarial testing. The justice principle (Section 2.1) requires that the benefits of the research be distributed broadly, not captured by incumbents.

### 6.2 Five Tiers of Disclosure

The AARDF defines five tiers, extending the three-tier model from Report #144 with two additional tiers specific to automated attack evolution:

#### Tier 0: Pre-Registration (Before Research)

**What:** Before conducting automated attack evolution experiments, register the experiment's scope, target models, mutation strategies, and intended disclosure plan with an internal ethics review process.

**Why:** The Fink Report's first principle -- institutional review before the experiment, not after publication. For projects without institutional review boards (including the Failure-First project), this means a documented internal review that specifies: what attack families are being evolved, what models are being targeted, what mutation constraints are in place, and how results will be handled.

**Implementation:** The Failure-First project's Research Ethics Charter Principle 1 (iatrogenic screening) already requires pre-publication review. Tier 0 extends this to pre-experiment review. For the autoresearch system, this means: before each evolution run, document the seed population, mutation strategies, target models, and evaluation methodology in a pre-registration file that is committed to the repository before the experiment begins.

**D-Score trigger:** All automated attack evolution experiments.

#### Tier 1: Structural Disclosure (Pattern-Level)

**What:** Publish the structural findings: that evolutionary search over persuasion patterns is effective, which mutation strategy categories are most effective, aggregate ASR distributions, and the design principle (structural mutation, not content escalation).

**Why:** This information is independently derivable from the published literature (AutoDAN, PAIR, TAP) and provides defensive value (understanding the attack surface) without operational specificity. The marginal offensive value of structural disclosure is near zero because the structural techniques are already public knowledge.

**When:** Immediately upon completion of internal review. No remediation window required.

**D-Score range:** 0-6 (full or restricted disclosure).

**Example from our work:** The blog post published 2026-03-23 describing the evolutionary pattern and mutation categories is Tier 1 disclosure. This is appropriate.

#### Tier 2: Methodological Disclosure (Expert-Reproducible)

**What:** Publish sufficient methodological detail for expert reproduction: the code architecture (without runnable code), the evaluation methodology, the selection criteria, the lint gate patterns, and per-mutation-strategy effectiveness comparisons.

**Why:** Academic reproducibility requires methodological transparency. This level provides enough information for other safety researchers to build their own systems and validate or challenge the findings. The offensive marginal value over Tier 1 is moderate -- an expert could reconstruct the system from Tier 2 information, but would need to invest significant effort.

**When:** In peer-reviewed academic venues (CCS, AIES, NeurIPS) with standard review timelines. Model providers notified of high-level findings at least 30 days before publication.

**D-Score range:** 4-7 (restricted to coordinated disclosure).

**Example from our work:** The CCS and AIES papers may include Tier 2 detail in methodology sections. This is appropriate for peer-reviewed venues.

#### Tier 3: Coordinated Vulnerability Disclosure (Model-Specific)

**What:** Disclose per-model vulnerability profiles (which models are vulnerable to which evolved attack variants, at what ASR) to affected model providers through a coordinated process.

**Why:** Model providers need this specific information to improve their defenses. Public disclosure of per-model vulnerabilities before remediation creates a "window of vulnerability" -- the cybersecurity argument for coordinated disclosure applies directly.

**When:** 90 days before any public disclosure of model-specific results. Providers notified directly (not through publication). If the provider does not respond within 90 days, the researcher may proceed to public disclosure with a notation that the provider was given a remediation window. This follows Google Project Zero's precedent.

**D-Score range:** 7-9 (coordinated disclosure).

**Implementation challenge:** The Failure-First system uses OpenRouter, which aggregates models from multiple providers. Direct notification requires identifying the model provider behind each OpenRouter model ID, which is not always straightforward. Report #176 identified this as a safety gate gap. The AARDF requires that the researcher make reasonable efforts to identify and contact the model provider; if identification fails, the finding is treated as Tier 2 (methodological) rather than Tier 3 (model-specific).

#### Tier 4: Restricted Hold (Operational Artifacts)

**What:** Do not publish the evolved attack population (specific prompts that have been empirically validated against specific models), the seed attack templates, or the runnable code. These artifacts remain in the private repository with access controlled by the Ethics Charter.

**Why:** The evolved population (D-Score 10/12, Report #176) has maximum operational specificity and minimum defensive necessity. Defenders do not need the specific prompts to improve their defenses -- they need the structural knowledge (Tier 1), the methodology (Tier 2), and the model-specific vulnerability profiles (Tier 3). Publishing the specific prompts provides marginal defensive value while maximising offensive utility.

**When:** Indefinitely, unless: (a) the techniques become independently public (at which point the holding provides no marginal protection), (b) specific model providers request the operational artifacts for internal testing (coordinated under NDA), or (c) a regulatory body with appropriate authority requires disclosure.

**D-Score range:** 10-12 (withhold).

**Re-assessment trigger:** Every 6 months, re-evaluate whether the held artifacts still require restriction. Attack techniques that are older than 12 months and have been independently documented in the public literature may be reclassified to Tier 2 or Tier 1.

#### Tier 5: Permanent Restriction (Harm-Escalating Artifacts)

**What:** Do not publish and do not retain artifacts that cross the structural-mutation constraint -- any evolved attack that modifies the harmful content itself (rather than the persuasion structure), any attack that combines automated evolution with harm-scoring optimisation, or any attack that demonstrates a qualitatively new category of harm not previously documented.

**Why:** The Failure-First system's core safety design choice is that mutations modify persuasion structure, not harmful content (Report #175, Report #176). If a system error, code modification, or extension violates this constraint, the resulting artifacts are qualitatively more dangerous than structurally-mutated attacks. They should be flagged, logged for audit purposes, and not retained in the operational corpus.

**Implementation:** The lint gate (Report #176, Gate 2) provides a first-line defense. Tier 5 adds a post-hoc review: after each evolution run, sample at least 10% of kept mutations and verify that the harmful content has not been modified. If any mutation violates the structural-mutation constraint, flag the entire run for manual review.

**D-Score range:** Not applicable (these artifacts should not exist within the system's design constraints; if they do, they indicate a system failure).

### 6.3 Decision Procedure

For any finding produced by automated attack evolution:

1. **Compute D-Score** using the four dimensions (Specificity, Reproducibility, Target Scope, Defense Availability) as defined in Report #154.

2. **Classify to AARDF tier** based on D-Score range. If the finding falls at a tier boundary, classify to the *more restrictive* tier (precautionary principle).

3. **Perform iatrogenic screening** (Research Ethics Charter Principle 1): could disclosure of this finding at this tier produce iatrogenic effects? If yes, document the iatrogenic risk and adjust the tier upward if warranted.

4. **Determine disclosure timing** based on the therapeutic window: how long before adversaries would independently discover this finding? If the window is short (< 3 months), accelerate Tier 3 disclosure to reduce the defender information deficit.

5. **Execute disclosure** at the determined tier and timing. Document the decision, rationale, and any provider notifications in the private repository.

6. **Schedule re-assessment** for Tier 4 artifacts at 6-month intervals.

### 6.4 Comparison to Existing Frameworks

| Feature | Fink Report | Cyber CD | D-Score (Report #154) | AARDF |
|---------|------------|---------|----------------------|-------|
| Pre-experiment review | Yes (IBCs) | No | No | Yes (Tier 0) |
| Proportional tiers | 7 categories | 3 (full/responsible/coordinated) | 4 tiers (0-12 range) | 5 tiers (0-5) |
| Temporal calibration | No | Yes (90-day window) | No | Yes (therapeutic window) |
| Iatrogenic assessment | No | No | No | Yes (Principle P3) |
| Justice dimension | Partial | No | No | Yes (Principle P5) |
| Re-assessment schedule | No | No | No | Yes (6-month Tier 4 review) |
| AI-specific reflexivity | N/A | N/A | Partial (D dimension) | Yes (IDDL awareness) |

The AARDF incorporates the strengths of each prior framework while addressing the AI-specific properties identified in Section 2.3.

---

## 7. Recommendations: When Should Evolved Attacks Be Published vs. Held?

Drawing on the analysis in Sections 2-6, we offer six concrete recommendations.

### Recommendation 1: Publish Structural Knowledge Immediately

The finding that evolutionary search over persuasion patterns can discover effective jailbreak variants is structural knowledge. It is independently derivable from the published literature. Withholding it provides no marginal protection and creates a false impression that such capabilities do not exist.

**Action:** Continue publishing Tier 1 structural findings in blog posts, academic papers, and regulatory briefs. No remediation window required.

**Ethical grounding:** Beneficence (defenders need this information), justice (it should be broadly available), and the Fink Report's default-openness principle.

### Recommendation 2: Disclose Mutation Effectiveness Data to Model Providers

The finding that certain mutation strategies (e.g., format-shift, contextualise) are more effective than others against specific model families is Tier 2-3 knowledge. It has defensive utility (providers can target their safety training) and moderate offensive utility (adversaries can focus their own mutation efforts).

**Action:** Prepare a coordinated disclosure report for affected model providers. Include per-strategy effectiveness data and per-model vulnerability profiles. Provide a 90-day remediation window before any public disclosure of model-specific results.

**Ethical grounding:** Non-maleficence (the vulnerability window must be minimised), the cybersecurity coordinated disclosure consensus, and AARDF Tier 3.

### Recommendation 3: Do Not Publish Evolved Attack Populations

The specific evolved prompts (49 attacks from the first run, Report #175) are Tier 4 artifacts. They have maximum operational specificity and minimal marginal defensive utility over Tier 1-3 disclosures. Defenders do not need the specific wording of evolved attacks to understand and defend against the vulnerability class.

**Action:** Retain in private repository. Make available to specific model providers under NDA upon request. Re-assess at 6-month intervals.

**Ethical grounding:** Non-maleficence, Floridi's analysis of operational information entities, and AARDF Tier 4.

### Recommendation 4: Implement Pre-Registration for All Evolution Runs

Every automated attack evolution experiment should be pre-registered (AARDF Tier 0) before execution. The pre-registration should document: seed population, mutation strategies, target models, evaluation methodology, and intended disclosure plan.

**Action:** Create a `pre-registration/` directory in the private repository. Before each evolution run, commit a pre-registration document. This provides an audit trail and forces the researcher to articulate the experiment's ethical implications before conducting it.

**Ethical grounding:** The Fink Report's institutional review principle, adapted for a context without formal institutional review boards.

### Recommendation 5: Add LLM-Based Evaluation Before Population Updates

The current system uses heuristic refusal detection, which over-reports ASR by 2-12x (Mistake #21, Report #175). This means the evolved population likely contains many false positives -- attacks retained as "successful" that did not actually bypass model safety. Beyond the scientific problem, this is an ethical problem: the system is producing artifacts classified as "validated attacks" that may not be validated.

**Action:** Integrate FLIP re-grading (or equivalent LLM-based classification) into the evolution loop before the keep/discard decision. This improves both research quality and ethical posture by reducing the population of retained artifacts to those that genuinely bypass model safety.

**Ethical grounding:** Non-maleficence (reducing the volume of retained operational artifacts), the pharmacological discipline principle (measuring efficacy at the harm layer, not the evaluation layer).

### Recommendation 6: Establish a Field-Wide Working Group on AI Adversarial Disclosure

No institution currently governs disclosure norms for AI adversarial research. The AI safety community should establish a working group -- analogous to FIRST (Forum of Incident Response and Security Teams) in cybersecurity -- to develop and maintain disclosure norms specific to AI adversarial research.

**Action:** Propose the working group in the AIES 2026 submission (derived from this report) and in engagement with AU AISI, NIST AISIC, and relevant standards bodies (SA/ICT-043, ISO/IEC JTC 1/SC 42).

**Ethical grounding:** Justice (disclosure norms should be developed collectively, not imposed by individual research groups), the Fink Report's principle that governance should be institutionalised, and the cybersecurity community's experience that voluntary coordination produces better outcomes than unilateral action.

---

## 8. The Temporal Ethics of Attack Research

### 8.1 The Decay Function of Operational Knowledge

Adversarial techniques decay in value as defenses improve and the techniques become independently known. This decay has ethical implications: the obligation to withhold operational knowledge weakens over time as the marginal offensive value of the knowledge decreases.

**Descriptive claim:** The jailbreak archaeology corpus (data/jailbreak_archaeology/) documents this decay empirically. DAN-era attacks (2022-2023) that achieved high ASR on the models of their era are now fully defended against by frontier models (0% ASR on GPT-5.2, Claude Sonnet 4.5, Gemini 3 Flash). The operational knowledge in those attacks -- specific prompt payloads -- has near-zero offensive value. The structural knowledge -- that persona manipulation can suppress safety training -- retains defensive value for understanding model failure modes.

This decay pattern supports the AARDF Tier 4 re-assessment schedule: operational artifacts that are older than 12 months and have been independently documented should be reclassified. Permanent withholding of decayed knowledge is ethically wasteful -- it denies the research community access to historical data that no longer poses meaningful risk.

### 8.2 The Acceleration Problem

However, the decay function is not the only temporal dynamic. Automated attack evolution accelerates the discovery rate. If the technique landscape is searched more efficiently, the time between discovery of a new variant and its independent rediscovery by adversaries shrinks. This means the therapeutic window (Section 4.3) is also shrinking.

The ethical implication is that coordinated disclosure must become faster, not slower, as automated tools improve. A 90-day remediation window that was adequate when vulnerabilities were discovered manually may be too long when vulnerabilities are discovered at the rate of dozens per day. The AARDF should be calibrated to the actual discovery rate, not to historical norms.

**Normative claim:** As automated attack evolution tools become more capable, the disclosure community should reduce the standard remediation window from 90 days to 45-60 days, with a shorter window (14-30 days) for vulnerabilities that are likely to be independently discovered within the standard window. This is a departure from the cybersecurity 90-day consensus and is motivated by the faster tempo of AI adversarial research.

---

## 9. Limitations and Uncertainty

1. **Framework dependence.** The ethical analysis relies on Western bioethics (Beauchamp & Childress), information ethics (Floridi), and Anglo-American security research norms. Other ethical traditions -- virtue ethics, care ethics, Ubuntu ethics, Confucian ethics -- may yield different analyses. The AARDF's emphasis on proportionality and individual-rights-based principles may not translate to governance contexts where collective welfare or relational obligations take priority.

2. **Empirical basis.** The empirical claims draw on the Failure-First corpus (236 models, 135,623 results) and a single evolution run (40 iterations, 2 free-tier models, Report #175). The evolution system's effectiveness on frontier models is untested. Claims about the therapeutic window, the decay function, and the independent discovery timeline are informed estimates, not empirical measurements.

3. **Institutional gap.** The AARDF assumes that researchers will voluntarily adopt disclosure norms. The history of dual-use governance in both biosecurity and cybersecurity suggests that voluntary compliance is inconsistent without institutional enforcement. The AARDF is a proposal for what researchers should do, not a mechanism for ensuring they do it.

4. **Single-project perspective.** This analysis is written from the perspective of a single research project. Other projects with different architectures (PAIR-style LLM attackers, GCG gradient-based methods), different risk profiles, and different institutional contexts may require different disclosure frameworks. The AARDF is designed to be adaptable but has been calibrated against only one system.

5. **No adversarial validation.** The AARDF has not been tested against an adversarial scenario in which a determined actor attempts to extract Tier 4 artifacts from the coordinated disclosure process. The framework's robustness against social engineering, legal compulsion, or insider threats is not assessed.

6. **D-Score subjectivity.** The D-Score assessments that feed the AARDF tier classification are judgments, not measurements. Different assessors might classify the same finding to different tiers. The framework structures ethical reasoning but does not eliminate the need for judgment.

---

## 10. Conclusion

Automated attack evolution in AI safety research creates a dual-use problem that shares structural features with biosecurity and cybersecurity dual-use but has properties -- near-zero reproduction cost, rapid capability transfer, target universality, defensive temporal asymmetry, and reflexive evaluation -- that require domain-specific governance.

The ethical analysis, grounded in Beauchamp and Childress's four principles, Floridi's information ethics, the Fink Report's biosecurity governance model, and the cybersecurity coordinated disclosure consensus, yields three core conclusions:

**First, automated attack evolution is ethically permissible** provided that it is conducted within a framework of proportional disclosure, iatrogenic awareness, and justice-aware distribution. The defensive value of automated vulnerability discovery exceeds the offensive risk, under the condition that operational artifacts are not published and structural knowledge is disclosed to defenders.

**Second, simple non-disclosure is ethically insufficient.** The defender-attacker information asymmetry means that withholding findings advantages adversaries over defenders when the techniques are independently discoverable. The ethical default should be controlled disclosure, not blanket withholding.

**Third, the iatrogenic safety paradox is real but manageable.** Safety research that produces hazardous artifacts is conducting a version of what medicine calls clinical research with informed consent: the research creates short-term risk (the existence of validated attack populations) in pursuit of long-term benefit (improved defenses). Managing this paradox requires pharmacological discipline -- known mechanism, measured therapeutic window, documented contraindications, and efficacy measured at the harm layer.

The AARDF provides a five-tier framework for operationalising these conclusions. Its distinguishing features -- pre-registration, iatrogenic screening, temporal calibration, and scheduled re-assessment -- address the specific properties of AI adversarial research that existing frameworks do not reach.

The framework is a proposal, not a standard. It has been calibrated against one project's experience and one system's outputs. Its value lies not in its specific tier boundaries but in the principle it encodes: that automated adversarial AI research requires governance that is as systematic and proportionate as the research itself.

---

## References

Arora, A., Krishnan, R., Telang, R., & Yang, Y. (2008). Does Information Security Attack Frequency Increase with Vulnerability Disclosure? An Empirical Analysis. *Information Systems Frontiers*, 10(4), 415-426.

Beauchamp, T. L., & Childress, J. F. (2019). *Principles of Biomedical Ethics* (8th ed.). Oxford University Press.

Bilge, L., & Dumitras, T. (2012). Before We Knew It: An Empirical Study of Zero-Day Attacks in the Real World. *ACM CCS 2012*.

Cavusoglu, H., Cavusoglu, H., & Raghunathan, S. (2007). Efficiency of Vulnerability Disclosure Mechanisms to Disseminate Vulnerability Knowledge. *IEEE Transactions on Software Engineering*, 33(3), 171-185.

Chao, P., Robey, A., Dobriban, E., Hassani, H., Pappas, G. J., & Wong, E. (2023). Jailbreaking Black Box Large Language Models in Twenty Queries. arXiv:2310.08419.

Fink, G. R. (Chair). (2004). *Biotechnology Research in an Age of Terrorism*. National Academies Press.

Floridi, L. (2013). *The Ethics of Information*. Oxford University Press.

Greenblatt, R., et al. (2024). Alignment Faking in Large Language Models. arXiv:2412.14093.

Illich, I. (1976). *Limits to Medicine: Medical Nemesis*. Marion Boyars.

Mehrotra, A., et al. (2023). Tree of Attacks: Jailbreaking Black-Box LLMs with Auto-Generated Subtrees. arXiv:2312.02119.

Samvelyan, M., et al. (2024). Rainbow Teaming: Open-Ended Generation of Diverse Adversarial Prompts. arXiv:2402.16822.

Schneier, B. (2000). Full Disclosure and the Window of Exposure. *Crypto-Gram Newsletter*, September 2000.

Wedd, A. (2026). Iatrogenic Safety: When AI Safety Interventions Cause Harm. Preprint draft v2.

Zhu, S., et al. (2023). AutoDAN: Generating Stealthy Jailbreak Prompts on Aligned Large Language Models. arXiv:2310.04451.

Zou, A., et al. (2023). Universal and Transferable Adversarial Attacks on Aligned Language Models. arXiv:2307.15043.

---

*F41LUR3-F1R57 Research Ethics Charter v1.0 (2026) governs all findings in this report. D-Score assessments per Report #154. AARDF proposed herein as extension to existing Ethics Charter framework.*

---

⦑F41LUR3-F1R57|NYSSA-OF-TRAKEN|REPORT-186|ETHICS-ATTACK-EVOLUTION|2026-03-24⦒
