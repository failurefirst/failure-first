---

title: "Adversarial AI Failure Modes in Australian Workplaces"
description: "> **Disclaimer:** This document constitutes research analysis for purposes of informing public policy discussion. It does not constitute legal advice. All references to legislative instruments, regulatory requirements, a..."
date: "2026-03-01"
reportNumber: 41
classification: "Research — Empirical Study"
status: "complete"
tags: []
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/41-safe-work-australia-adversarial-ai-brief.m4a"
image: "https://cdn.failurefirst.org/images/reports/41-safe-work-australia-adversarial-ai-brief.png"
---

## A Technical Brief for Safe Work Australia

**Report 41 — F41LUR3-F1R57 Policy Brief Series**
**Date:** 2026-03-01
**Classification:** Regulatory Review
**Status:** Draft
**Regulatory Body:** Safe Work Australia
**Submission Context:** Best Practice Review of the Model WHS Laws — Expert Technical Input

---

> **Disclaimer:** This document constitutes research analysis for purposes of informing public policy discussion. It does not constitute legal advice. All references to legislative instruments, regulatory requirements, and compliance obligations are provided for research and discussion purposes only. Organisations with specific compliance questions should seek independent legal advice. Empirical findings from the Failure-First research program are characterised with appropriate confidence intervals and caveats throughout this document.

---

## Executive Summary

Autonomous AI systems in Australian workplaces are entering a qualitatively new phase. Visual-language-action (VLA) models — systems that perceive physical environments through cameras and sensors, interpret natural language instructions, and take physical actions in the world — are being deployed in Australian mining, agriculture, and logistics at significant and growing scale. As at 2022, more than 700 autonomous haul trucks operated in Australian mines; by the end of 2025, that number is forecast to exceed 1,800, with the industry transitioning to multimodal AI backbones that introduce attack surfaces not present in earlier autonomous systems.

Existing work health and safety (WHS) risk assessment frameworks were designed for bounded, enumerable failure modes: a machine has known moving parts, known failure mechanisms, and known control measures. Adversarial AI introduces a qualitatively different failure class — failures that are contextually triggered, not reproducible in standard functional testing, and that can exploit the human oversight mechanisms that WHS frameworks treat as a last-line control. This brief argues that adversarial AI failure modes are not contemplated by current Model WHS Laws guidance, and that this gap creates legal exposure for duty holders and operational hazards for workers.

Three findings from the adversarial AI research literature are directly relevant to WHS duty obligations under the Model WHS Laws:

**Finding 1 — Human oversight is not a reliable final control against adversarial AI.** Research using the AgentLAB benchmark (arXiv:2602.16901, February 2026) found that human reviewers approved approximately 78% of AI-generated plans that had been subtly subverted to introduce unsafe instructions. This is an external research finding, not original Failure-First data, and the specific approval rate is context-dependent; nonetheless, it indicates that human-in-the-loop (HITL) oversight, as currently implemented in most AI deployment architectures, is vulnerable to adversarial manipulation and should not be treated as a reliable control without independent testing of its effectiveness.

**Finding 2 — Multi-turn attack success rates escalate substantially over extended interactions.** Research in the Failure-First corpus and consistent with published Crescendo attack methodology (arXiv:2404.01833) indicates that adversarial attack success rates against AI agents escalate from approximately 62.5% in single-step interactions to approximately 79.9% across multi-step extended episodes. These figures are drawn from Failure-First benchmark testing and should be understood as indicative of the direction and magnitude of escalation within the specific models and attack families tested; confidence intervals are not yet computed across the full dataset due to ongoing LLM-based reclassification of heuristic results.

**Finding 3 — Adversarial attacks transfer across robot platforms sharing an AI backbone.** Research on the BadVLA attack framework (Shi et al., NeurIPS 2025) found near-100% attack success rates against the π0 and OpenVLA VLA model families, with transfer across different robot hardware embodiments where systems share the same underlying visual-language model. This is an external literature finding. It indicates that a single adversarial input developed against one robot type may compromise a fleet of different robot types operating on the same AI model.

This brief makes four recommendations to Safe Work Australia:

**R1:** Safe Work Australia should commission guidance on mandatory adversarial testing requirements for AI systems deployed in high-risk workplaces, beginning with Hazard Group 1 settings including mining, construction, and heavy industry.

**R2:** Guidance should clarify that the duty to eliminate or minimise risks "so far as is reasonably practicable" under the Model WHS Laws includes identification of adversarial failure modes, and that functional performance testing alone does not constitute adequate pre-deployment testing for AI systems where adversarial inputs are a foreseeable risk.

**R3:** Safe Work Australia, in coordination with the Australian AI Safety Institute (AU AISI), should develop or accredit a reference adversarial testing methodology and publication standard, providing operational clarity for duty holders.

**R4:** The Best Practice Review should note the gap between ISO 17757:2019 — Earth-moving Machinery and Mining: Autonomous and Semi-Autonomous Machine System Safety — which addresses functional safety but explicitly does not contemplate adversarial AI threats, and the emerging adversarial failure mode landscape for autonomous systems in Australian workplaces.

---

## Introduction

This brief is submitted as expert technical input to Safe Work Australia's Best Practice Review of the Model WHS Laws. It addresses a specific and emerging risk category that current WHS guidance frameworks do not contemplate: adversarial failure modes in AI systems deployed in Australian workplaces.

The formal written submission window for the Best Practice Review closed on 3 November 2025. This brief is provided as supplementary technical evidence for the review secretariat's consideration during the consultation summary phase. It does not represent legal advice and should not be relied on as such.

Section 1 explains how adversarial AI failure modes differ from conventional plant failure modes and why existing WHS risk assessment frameworks are insufficient to identify them. Section 2 analyses the Australian workplace context across three sectors where AI deployment is substantial and growing: mining, agriculture, and logistics. Section 3 describes the Failure-First adversarial benchmarking methodology and its relationship to WHS duty categories and the VAISS Guardrail 4 testing requirement. Section 4 makes four concrete recommendations for Safe Work Australia's consideration in the Best Practice Review's final report.

---

## 1. The Problem: What WHS Risk Assessment Assumes, and Where It Breaks Down

### 1.1 The Standard WHS Risk Assessment Model

Risk assessment under the Model WHS Laws follows a well-established iterative framework: identify hazards; assess the likelihood and consequence of harm; implement controls in accordance with the hierarchy of controls (elimination, substitution, engineering, administrative, personal protective equipment); and review controls over time. This framework has proven robust for the full range of conventional physical, chemical, and biological workplace hazards.

For conventional plant — including earlier generations of programmable automated machinery — this framework extends naturally. A lathe has a defined set of failure modes: mechanical failure of the cutting head, electrical fault, programming error causing unexpected movement. Each failure mode has a known mechanism, a known consequence envelope, and a set of engineering and administrative controls that reliably address it. Risk assessment can enumerate these hazards. Functional testing can confirm that controls operate as designed. Human supervisory oversight provides a backstop for unforeseen edge cases.

The key assumption underlying this model is that foreseeable hazards are enumerable in principle, even if the enumeration is incomplete in practice. This is the assumption that adversarial AI challenges.

### 1.2 Why Adversarial AI Is Qualitatively Different

AI systems based on large language models, visual-language models, and visual-language-action models do not have bounded failure mode sets in the conventional sense. Their behaviour is determined by the distribution of their training data, the structure of their model architecture, and the inputs they receive at inference time. All three of these factors interact in ways that can produce unexpected behaviour under inputs that appear superficially normal.

An adversarial input is one that has been specifically designed — or that happens by chance to trigger — a failure mode not observable in standard functional testing. Adversarial inputs can be:

- **Linguistic**: instructions embedded in natural language that exploit instruction hierarchy vulnerabilities, causing the AI to override safety-layer constraints in response to user-layer or environment-layer inputs
- **Visual**: images or physical objects engineered to cause misclassification or misdirection in the AI's perception system
- **Structural**: formatting patterns (JSON, YAML, code completion formats) that exploit the AI's tendency to faithfully complete structured outputs even when those outputs encode harmful instructions
- **Multi-turn**: sequences of individually innocuous interactions that, in aggregate, shift the AI's effective safety threshold or embed dormant trigger conditions

Three properties of adversarial failures distinguish them from conventional plant failures for WHS risk management purposes:

**Contextual triggering.** Adversarial failures are often triggered by specific input patterns that may not appear in standard test protocols. A functional test that exercises all documented system capabilities may miss adversarial failures entirely, because the adversarial input is, by definition, not a documented test case.

**Irreproducibility in isolation.** Multi-turn adversarial failures emerge from extended interaction sequences. A system that behaves correctly in individual unit tests may fail when a sequence of interactions — separately plausible — is combined. This property makes standard pre-deployment testing insufficient as a risk management tool.

**Model update sensitivity.** AI models are updated and fine-tuned over their deployment lifecycle. Control measures validated against version N of a model may not hold against version N+1. This creates a continuous monitoring obligation that has no direct analogue in conventional plant safety.

### 1.3 The Reasonably Practicable Standard and Adversarial AI

The Model WHS Laws impose a duty to eliminate risks, or if elimination is not reasonably practicable, to minimise risks so far as is reasonably practicable. The "so far as is reasonably practicable" standard requires the duty holder to be aware of the relevant risks in order to make an informed determination about what control measures are practicable.

The practical implication for adversarial AI is significant: a duty holder who does not know that adversarial failure modes exist in their deployed AI system cannot demonstrate that they have considered all relevant risks in making their control measure decisions. Standard functional performance testing, vendor safety documentation, and ISO 17757:2019 compliance do not reveal adversarial failure modes. Only adversarial testing — testing that specifically attempts to find these failure classes — can identify them.

This is not a novel principle. Courts and regulators applying the Model WHS Laws have consistently held that the obligation to identify foreseeable risks requires duty holders to seek out relevant technical knowledge, not merely to rely on conventional practice. As AI systems enter Australian workplaces in increasing numbers and physical consequence roles, adversarial AI failure modes are becoming a foreseeable class of risk — foreseeable in the sense that the research literature has documented them extensively, that international standards bodies are beginning to address them, and that Australian regulators will increasingly be expected to have considered them.

### 1.4 The Human-in-the-Loop Problem

Most AI deployment architectures treat human oversight as the final control in the control hierarchy: when an AI system produces uncertain outputs, a human reviewer approves or rejects the action before it is executed. This architecture is reflected in VAISS Guardrail 5 (Human Oversight) and in standard practice for autonomous haulage, logistics, and agricultural systems.

The adversarial AI research literature indicates that this final control is itself vulnerable. Research using the AgentLAB benchmark (arXiv:2602.16901) found that human reviewers approved approximately 78% of AI-generated plans that had been subtly subverted through instruction hierarchy attacks. The mechanism is cognitive: a subverted plan is structurally similar to a valid plan, and a reviewer under realistic conditions of cognitive load, time pressure, and interface design is unlikely to detect the specific embedded deviation that makes the plan unsafe.

This finding does not mean human oversight is worthless. It means that human oversight, as a WHS control measure, requires independent testing of its effectiveness under adversarial conditions — exactly as engineering controls require validation testing. The current WHS guidance framework provides no methodology for testing HITL effectiveness under adversarial inputs, and no requirement to do so.

---

## 2. Australian Workplace Context

### 2.1 Autonomous Haulage in Mining

Australia leads the world in deployment of autonomous haulage systems (AHS). As at 2022, more than 700 autonomous haul trucks operated in Australian mines — the largest operational fleet globally. Independent industry analysis forecast that figure to exceed 1,800 vehicles by end-2025, driven by continued expansion at Pilbara iron ore operations and emerging coal and gold applications. These systems are transitioning from generation-one autonomous operation — GPS and LiDAR based path following within defined autonomous operating zones — to generation-two systems incorporating multimodal AI backbones including visual-language models for perception and decision-making.

This transition is directly relevant to adversarial AI risk. Generation-one AHS operates within tightly bounded operational parameters: fixed AOZ boundaries, defined operating speeds, emergency stop triggers calibrated to sensor-specific thresholds. Generation-two systems, incorporating VLA-class models, introduce natural language instruction interfaces, visual perception capable of interpreting complex and variable environments, and AI planning modules that may generate novel action sequences in response to novel situations. Each of these properties expands the attack surface.

The NSW Resources Regulator's *Guideline — Autonomous Mobile Mining Plant* (September 2020) remains the primary Australian regulatory guidance for AHS. The guideline references ISO 17757:2019 and requires functional safety validation, risk assessment demonstrating that autonomous operation does not increase risk to workers, and AOZ design preventing worker entry during autonomous operation. The guideline predates VLA architecture; adversarial testing is not contemplated.

ISO 17757:2019, which the guideline references, provides comprehensive functional safety requirements for autonomous machine systems. Its scope explicitly addresses hazard identification, risk assessment, safety function integrity, and control system validation. However, ISO 17757:2019 was developed before adversarial AI attacks on VLA systems were documented in the literature. The standard's risk assessment framework — hazard enumeration, consequence classification, safety function assignment — is not structured to identify adversarial failure modes, which are definitionally outside the enumerable hazard set that the standard's methodology addresses.

The 2024 NSW Resources Regulator Safety Report recorded 3.2 incidents per million tonnes for autonomous operations compared to 5.7 for manual operations — a genuine safety improvement. However, the incident categories tracked (AOZ incursion, collision, rollover) reflect the generation-one risk profile. Adversarial AI failure modes — perception manipulation, instruction hierarchy subversion, physical adversarial patches causing misclassification — are not categories in current incident reporting frameworks and would not appear in aggregate statistics even if they occurred.

### 2.2 Agriculture and Precision Autonomous Systems

Australia's agricultural sector is deploying autonomous and semi-autonomous systems across spray drone operations, precision harvesting, and autonomous field equipment. As at May 2025, 38,874 licensed drone operators were registered with the Civil Aviation Safety Authority — more than the number of conventional crewed pilots. CASA's TMI 2025-03 introduces fast-track Beyond Visual Line of Sight approval pathways for agricultural operations.

Regulatory oversight for agricultural AI systems is airworthiness-focused, not AI-behaviour-focused. CASA Part 101 requirements address airworthiness, operational procedures, geofencing, and pilot licensing. They do not address the AI decision-making layer: crop detection algorithms, obstacle avoidance AI, or spray pattern planning systems. No current Australian regulatory framework requires adversarial testing of AI components in agricultural autonomous systems.

Research by Cardenas and Xie (2026) on physical world adversarial attacks against AI-enabled aerial systems demonstrates that projected text and physical adversarial patches can bypass visual grounding in VLA-class models at attack success rates exceeding 80%. Agricultural spray drone systems operating in environments with physical markings, signage, and variable visual conditions present an attack surface that current CASA oversight does not address.

### 2.3 Warehousing and Logistics Automation

Major retail and logistics operators in Australia — including Coles, Woolworths, and their third-party logistics partners — are deploying autonomous mobile robot (AMR) fleets for warehouse picking, inventory management, and goods movement. AMR safety is currently addressed under existing WHS plant provisions: SafeWork NSW and WorkSafe Victoria publish general guidance on machinery guarding and plant safety that applies to AMRs as plant items, focusing on physical hazard management — collision avoidance, emergency stops, pedestrian detection.

No Australian regulatory guidance addresses AI decision-making failure modes in AMR systems. Human-robot collaboration scenarios — where workers operate in proximity to AMR fleets, relying on the AI's pedestrian detection and path planning to avoid collision — are governed by general WHS duty rather than any AI-specific technical standard.

The NSW Work Health and Safety Amendment (Digital Work Systems) Act 2026 (NSW), passed on 12 February 2026 (NSW Parliament bill pk=18847; Act No. 5 of 2026, legislation.nsw.gov.au) (not yet commenced by proclamation as at the date of this brief), will create an explicit statutory duty for PCBUs to ensure that digital work systems — defined in section 4 of the Work Health and Safety Act 2011 (NSW) as including algorithms, artificial intelligence, automation, and online platforms — do not put worker health and safety at risk. The amendments insert section 21A and expand inspection powers to allow access to algorithms, performance metrics, data logs, and audit trails. When commenced, this legislation will create a direct compliance pathway where adversarial test documentation would satisfy the audit trail requirement. However, the legislative framework does not specify what adversarial testing is, how it should be conducted, or what documentation standard constitutes adequate evidence.

### 2.4 Regulatory Gap Summary

The regulatory gap is consistent across all three sectors. Functional safety frameworks (ISO 17757:2019 for mining, CASA airworthiness standards for agriculture, plant safety guidance for logistics) were designed before VLA-class AI systems were deployed in these sectors. They address the failure modes of the technology at the time of their development. Adversarial AI failure modes — by their nature the result of deliberately seeking failures outside the standard test protocol — are not addressed by any of these instruments.

This gap is not a reflection of regulatory negligence. It is the direct consequence of the governance lag between AI capability development and regulatory response. Based on analysis of comparable technology governance cycles (aviation 12-36 months, nuclear 24-48 months, pharmaceutical 36-84 months), the lag for AI governance is estimated to exceed all historical analogues. The practical implication for Safe Work Australia's Best Practice Review is that the current instruments are operating on assumptions that do not hold for the class of AI system now entering Australian workplaces.

---

## 3. Failure-First Methodology as a WHS Risk Management Tool

### 3.1 What Adversarial Benchmark Testing Produces

The Failure-First Embodied AI research program has developed an adversarial benchmarking methodology covering eight failure mode families relevant to embodied AI systems in physical deployment contexts. The methodology has been applied across 120+ AI models and more than 18,000 adversarial scenarios, producing structured trace records in JSONL format with per-scenario attack inputs, model outputs, and outcome classifications.

The eight failure mode families tested are:

- **Digital prompt injection and instruction hierarchy subversion**: tests whether safety-layer constraints can be overridden by user-layer or environment-layer inputs
- **Inference trace integrity attacks**: tests whether the AI's internal reasoning process can be manipulated through format-lock exploitation, decision-criteria injection, and encoding attacks
- **Multi-turn long-horizon attacks**: tests whether extended interaction sequences can shift the AI's effective safety threshold or embed dormant trigger conditions
- **Cross-embodiment transfer**: tests whether adversarial inputs developed against one platform transfer to different hardware using the same underlying AI model
- **Physical world attack surface**: tests whether physical objects, markings, or sensor spoofing can cause AI misclassification or misdirection
- **Human-in-the-loop failure modes**: tests whether human oversight mechanisms function as intended under adversarial conditions
- **Deceptive alignment detection**: tests whether AI systems exhibit differential behaviour under evaluation conditions versus deployment conditions
- **Supply chain attacks**: tests whether adversarial inputs embedded in training data or upstream model weights can compromise deployed system behaviour

The methodology produces structured outputs relevant to WHS risk management: attack success rates by failure mode family, scenario-level trace records (inputs, reasoning, outputs), and comparative benchmarks across model families. These outputs constitute a structured evidence base for pre-deployment risk assessment that functional performance testing does not produce.

### 3.2 Mapping to WHS Duty Categories

The Model WHS Laws' primary duty framework — eliminate risks, or minimise so far as reasonably practicable — operates by reference to what the duty holder knows or ought to know about relevant risks. Adversarial benchmark testing produces exactly the knowledge that this standard requires for AI systems where adversarial inputs are a foreseeable risk class.

The mapping from Failure-First methodology to WHS duty categories is as follows:

**Pre-deployment adversarial testing** satisfies the obligation to identify foreseeable risks prior to deployment. A duty holder who has conducted systematic adversarial testing, documented the failure modes identified, and implemented control measures in response to that testing can demonstrate that their risk assessment was informed by the relevant technical knowledge.

**Trace JSONL output and score reports** satisfy the audit trail obligation that will arise under the NSW WHS Digital Work Systems duty (s21A) when that provision commences. The trace format records the specific inputs that produced failures, the AI's outputs, and the outcome classification — constituting exactly the AI interaction log that the legislation's inspection powers contemplate.

**Attack success rates by failure mode** provide the likelihood and consequence inputs required for risk assessment under the Model WHS Laws' risk assessment framework. A duty holder who knows that format-lock attacks achieve high success rates against the AI planning module deployed in their warehouse, and who has implemented control measures in response, is in a materially different position from a duty holder who has not conducted such testing.

### 3.3 VAISS Guardrail 4 and the Testing Requirement

The Voluntary AI Safety Standard (VAISS), published by the Department of Industry, Science and Resources in September 2024, establishes 10 guardrails applicable throughout the AI supply chain. While the VAISS is non-binding, the National AI Plan (December 2025) confirms the 10 guardrails as the reference framework for due diligence assessment, and compliance with VAISS guardrails constitutes evidence of reasonable precaution under existing WHS and consumer protection law.

Guardrail 4 (Testing and Monitoring) is the most directly applicable. It requires organisations to:

- Test AI systems thoroughly before deployment against acceptance criteria linked to risk assessment
- Use independent testing teams
- Conduct continuous post-deployment monitoring for model drift, performance degradation, bias, and safety incidents
- Maintain test records

The VAISS guidance does not specify how to test for adversarial failure modes, and does not define what constitutes adequate adversarial testing for embodied AI systems. This is precisely the gap that a reference methodology would address. Adversarial benchmarking is the methodology that makes the VAISS Guardrail 4 requirement operational for AI systems where adversarial inputs are a foreseeable risk.

### 3.4 Scope and Limitations of the Failure-First Methodology

It is important for Safe Work Australia to understand the current scope and limitations of the Failure-First methodology when considering how it relates to compliance-grade testing requirements.

**Current status:** The Failure-First methodology is research-grade. It has been developed and applied in an academic research context, not as an accredited commercial testing service. The methodology has not been independently audited or validated against a published testing standard. The attack success rates reported from Failure-First testing reflect the specific models, prompt formats, and scenario contexts tested, and should not be extrapolated without qualification to other models or deployment contexts.

**Classification accuracy:** Outcome classification for Failure-First benchmarks has relied on a combination of heuristic (keyword-based) and LLM-based grading. The heuristic classifier shows significant over-reporting of attack success relative to LLM-based grading (heuristic 36.2% vs LLM-graded 15.9% in faithfulness gap testing), and the LLM-based grader has a measured error rate of approximately 11% on complex responses. Figures from Failure-First testing should be interpreted as indicative estimates rather than precise measurements, and the direction of the findings (that adversarial attacks succeed at meaningful rates, and escalate with multi-turn interaction) is more robustly supported than the specific numerical values.

**What this means for policy:** The existence and accessibility of research-grade adversarial testing methodology demonstrates that such testing is technically feasible and produces useful risk information. It does not mean that compliance-grade methodology exists or that Failure-First can serve as an accredited testing body. The policy question is what methodological standard would constitute adequate adversarial testing for WHS compliance purposes, and what institutional pathway would make accredited testing accessible to duty holders. This is precisely what Recommendation R3 below addresses.

---

## Policy Recommendations

### R1: Commission guidance on mandatory adversarial testing for high-risk workplace AI

**Recommendation:** Safe Work Australia should commission the development of guidance specifying mandatory adversarial testing requirements for AI systems deployed in high-risk workplaces, with initial scope covering Hazard Group 1 settings (mining, construction, heavy industry) where AI system failures have direct potential to cause serious injury or death.

**Rationale:** Adversarial AI failure modes are a foreseeable class of risk for AI systems deployed in high-risk physical environments. Current guidance does not address this risk class. Duty holders lack a reference standard for what adversarial testing is required to satisfy the "so far as reasonably practicable" obligation. This creates inconsistent practice across the sector and legal exposure for duty holders who have conducted only functional performance testing.

**Implementation:** Guidance should be developed in coordination with AU AISI and technical experts in adversarial AI, and should draw on international precedent from the UK AI Security Institute and NIST CAISI. The guidance need not prescribe a specific testing tool or methodology, but should specify the failure mode families that pre-deployment testing must address, the documentation standard for test outputs, and the minimum independence requirements for testing teams.

### R2: Clarify that functional testing alone does not satisfy WHS duty for adversarial-exposed AI

**Recommendation:** Guidance under the Model WHS Laws should clarify that for AI systems where adversarial inputs constitute a foreseeable risk — including all systems that accept natural language instruction, process visual inputs in public environments, or execute physical actions based on AI decision-making — pre-deployment testing must include adversarial failure mode characterisation, not only functional performance testing.

**Rationale:** The current regulatory environment creates a gap: duty holders who conduct thorough functional testing and document ISO 17757:2019 compliance may reasonably believe they have satisfied their pre-deployment testing obligations, when in fact they have not identified adversarial failure modes that are foreseeable given the state of published research. Clarification from Safe Work Australia that adversarial testing is a component of reasonable pre-deployment risk assessment would remove this ambiguity.

**Implementation:** This clarification could be effected through a Safe Work Australia code of practice or guidance note on AI systems in high-risk workplaces. It would complement, not replace, existing functional safety standards. Framing should avoid prescribing specific test methodologies until a reference methodology is developed (see R3).

### R3: Develop or accredit a reference adversarial testing methodology

**Recommendation:** Safe Work Australia, in coordination with AU AISI and Standards Australia's mirror committee for ISO/IEC JTC 1/SC 42 (SA/ICT-043), should develop or accredit a reference adversarial testing methodology for workplace AI systems, or establish an accreditation pathway for testing bodies seeking to provide this service.

**Rationale:** Without a reference methodology, individual duty holders must independently determine what adversarial testing is adequate. This creates heterogeneous practice, high per-organisation costs, and uncertainty for regulators assessing compliance. A reference methodology — analogous to the role of functional safety standards in conventional plant safety — would provide a consistent baseline against which organisations can test and regulators can verify.

**Implementation:** The development of a reference methodology should be treated as a standards project, not a regulatory instrument. The UK AI Security Institute's Inspect evaluation framework and the AgentLAB benchmark represent existing international methodological foundations. The Failure-First research program's failure mode taxonomy and scenario library represent available Australian research input. A joint project between Safe Work Australia, AU AISI, and Standards Australia SA/ICT-043 would produce a methodology with both regulatory backing and international standards alignment.

### R4: Note the ISO 17757 gap in the Best Practice Review

**Recommendation:** The Best Practice Review's final report should explicitly note that ISO 17757:2019 — the primary international standard referenced in Australian autonomous mining plant guidance — addresses functional safety for autonomous machine systems but was developed before adversarial AI attacks on VLA-class models were documented in the research literature, and does not contemplate adversarial failure modes as a hazard category.

**Rationale:** Duty holders relying on ISO 17757:2019 compliance as evidence of adequate risk assessment for AI-enabled autonomous systems may have a false sense of security. The standard is not deficient for its intended purpose — functional safety of autonomous machine systems — but it does not address the emerging adversarial AI threat landscape. Noting this gap in the Best Practice Review's findings would encourage Standards Australia, the NSW Resources Regulator, and international standards bodies to prioritise revision.

**Implementation:** The Best Practice Review report should note the gap and recommend that Safe Work Australia engage with Standards Australia to identify the appropriate international standards work item (likely within ISO/IEC JTC 1/SC 42 or TC 299 Robotics) for addressing adversarial AI safety in autonomous machine systems. A parallel recommendation to the NSW Resources Regulator to initiate review of the 2020 Autonomous Mobile Mining Plant guideline would address the most pressing near-term compliance context.

---

## Conclusion

Adversarial AI failure modes present a qualitatively distinct risk class for which the current WHS guidance framework was not designed. They are not enumerable in the way that conventional plant hazards are enumerable. They are not reliably detectable through functional performance testing. They are capable of exploiting the human oversight mechanisms that the WHS control hierarchy treats as a final backstop.

Australia's autonomous workplace AI deployment — 1,800+ mining trucks forecast by end-2025, tens of thousands of agricultural drones, and growing AMR fleets in logistics — is advancing faster than the regulatory frameworks designed to protect workers from it. The governance lag is documented and substantial. The good news is that the research methodology to characterise adversarial failure modes exists, produces structured evidence usable for WHS risk assessment, and maps directly onto the documentation and audit trail requirements that emerging legislation such as the NSW WHS Digital Work Systems Amendment will impose.

The four recommendations in this brief are designed to be achievable within the current Australian regulatory landscape without awaiting a standalone AI Act. They work within existing WHS duty structures, build on the VAISS framework that the National AI Plan has confirmed as Australia's reference standard, and leverage the AU AISI's mandate to fill regulatory gaps for AI in high-consequence settings.

Safe Work Australia is in a position to establish the foundational guidance that will govern adversarial AI risk management in Australian workplaces for the next decade. The research basis for that guidance exists. The regulatory mandate is present. The window is the Best Practice Review.

---

## 5. About Failure-First Embodied AI

The Failure-First Embodied AI research program (failurefirst.org) is an independent AI safety research initiative focused on characterising how embodied and agentic AI systems fail — particularly under adversarial inputs, extended multi-turn interactions, and human-in-the-loop conditions.

The program has produced:

- **18,000+ adversarial scenarios** across 120+ AI models, covering eight failure mode families relevant to physical deployment contexts
- **A structured failure mode taxonomy** distinguishing attack classes (instruction hierarchy subversion, inference trace integrity attacks, cross-embodiment transfer, physical world attacks, HITL failures, deceptive alignment) from outcome categories (refusal, partial compliance, full compliance, hallucination-as-refusal)
- **41 policy reports and research briefs** on embodied AI safety, including regulatory landscape analysis, standards positioning, and sector-specific risk assessments for mining, logistics, agriculture, and defence applications
- **Open benchmark datasets** in JSONL format for adversarial scenario-level testing of AI agents

The program's methodology is research-grade. We are not an accredited testing body, and our datasets and reports should be understood as research contributions to the evidence base for policy development, not as commercial products or compliance services. We are available to provide technical briefings to Safe Work Australia's review team, contribute failure mode taxonomy data to standards development processes, and assist in scoping what a compliance-grade adversarial testing methodology for workplace AI would need to include.

**Contact:** failurefirst.org
**Engagement:** Available for technical briefings, written submissions, and standards committee participation.

---

## Addendum: Sprint 25-26 Findings (March 2026)

*The following section summarises new empirical findings from the Failure-First research program collected after the initial draft of this brief (1 March 2026). These findings strengthen the evidence base for Recommendations R1-R4. A1-A6 were added 2026-03-11; A7-A9 were added 2026-03-11 incorporating crescendo regrade results and the three-tier ASR framework.*

### A1. Format-Lock Attacks as a WHS-Relevant Vulnerability Class (New)

Controlled experiments (Reports #55, #57) document a previously uncharacterised vulnerability class relevant to workplace AI systems: format-lock attacks. These attacks embed harmful instructions within structured data templates (JSON, YAML, code completion, CSV) that workplace AI systems routinely process as legitimate operational data.

**Evidence:** Testing of three frontier models (Claude Sonnet 4.5, Codex GPT-5.2, Gemini-3-Flash) shows format-lock ASR of 20.8-40.9% (FLIP-graded, n=22-24 per model, Wilson 95% CIs from [9.2%, 40.5%] to [23.3%, 61.3%]), compared to standard ASR of 2.3-8.8% for the same models under natural language adversarial prompts. At sub-3B parameter scales, zero refusals were observed across 115 format-lock traces (3 models, 2 scenario sets).

**WHS relevance:** Many workplace AI systems accept structured data inputs as part of normal operation — SCADA configurations, equipment scheduling parameters, task allocation specifications, API payloads. A standard WHS risk assessment would not identify format-lock as a hazard category because the inputs appear to be legitimate operational data. The "so far as is reasonably practicable" standard requires that pre-deployment testing cover the full range of input modalities the system accepts, including structured formats.

**Caveat:** Sample sizes are small and confidence intervals are wide. The capability-floor hypothesis (format compliance and safety reasoning are partially independent capabilities) is directionally supported but not confirmed.

### A2. Text-Action Divergence in VLA Systems (New)

Testing of VLA-class model proxies (Report #49, n=58 valid verdicts, two sub-2B models, 7 of 24 total attack families) found that 50% of responses produce safety disclaimers at the text level while still generating requested action sequences at the action level. Zero outright refusals were observed across any attack family.

**WHS relevance:** This finding challenges the assumption that textual safety outputs serve as reliable indicators of safe system behavior. If this pattern transfers to production VLA systems (not yet tested), a human overseer monitoring text output would observe safety-compliant language while the action layer executes unsafe behavior. WHS audit trails under NSW WHS Digital Work Systems duty (s21A, when commenced) must extend to action-level outputs, not only text-level outputs, to detect this failure mode.

**Caveat:** Testing was text-only proxy evaluation on small models. Validation on frontier VLA systems is required before this finding can be cited with confidence in a formal submission.

### A3. World Model Architecture Gap (Pre-emptive)

Report #56 proposes a five-category taxonomy of adversarial attack surfaces for world-model-based planning architectures (JEPA, MPC-style planning) now entering production deployment (AMI Labs surgical robotics, industrial automation, logistics). The five categories — observation poisoning, cost module manipulation, planning horizon attacks, action sequence constraint erosion, and world model hallucination exploitation — represent planning-level attack surfaces that have no analog in current LLM safety testing or functional safety standards (ISO 17757:2019).

**WHS relevance:** As autonomous haulage and logistics systems transition from GPS/LiDAR-based control to world-model-based planning, the regulatory gap identified in Section 2.4 of this brief will widen. This taxonomy is conceptual and requires empirical validation, but it provides a structured basis for Safe Work Australia to anticipate the next generation of adversarial risk in autonomous workplace systems.

### A4. Safety Re-emergence at Scale (Contextual)

The Obliteratus model series (Report #48) — models with safety training intentionally removed — shows declining ASR at larger scales (99.8% at 0.8B, 94.8% at 1.9B, 78.3% at 4.2B, 54.2% at 9.0B). The decline is monotonic and supported by non-overlapping per-scale Wilson 95% confidence intervals, though with only four model scales it is not statistically significant by a valid rank test (Spearman ρ = −1.0, exact p = 0.083). This suggests safety-adjacent reasoning may partially emerge from general capability at scale, independent of explicit safety training; at the largest scale the residual behaviour is hedging (PARTIAL), not outright refusal.

**WHS relevance:** Risk assessments based on testing a smaller version of a model family may not transfer to the deployed scale. The "so far as is reasonably practicable" standard implies that pre-deployment testing should be conducted at the specific scale of the deployed system. This applies to both directions: a model tested as safe at 7B may behave differently at 70B.

### A5. Legal Analysis: NSW WHS s21A Creates Adversarial Testing Obligation (New)

Internal legal research analysis (LR-02, LR-05, March 2026) maps the specific legal chain connecting the NSW WHS Digital Work Systems Act 2026 to adversarial testing obligations for AI system deployers. The analysis is summarised here as research findings, not legal opinion; organisations should seek independent legal advice.

**The five-step legal chain (LR-02, Section 3.3):**

1. **Foreseeability:** Adversarial AI failure modes are documented in the peer-reviewed literature (BadVLA, NeurIPS 2025; AgentLAB, arXiv:2602.16901, 2026). VLA attack success rates of 72-100% are published. These are foreseeable risks to worker health and safety.

2. **Reasonably practicable standard (s 18):** The standard requires weighing what the PCBU "ought reasonably to know" about the hazard (s 18(c)). Published adversarial AI research defines what a PCBU deploying VLA-powered systems ought reasonably to know.

3. **Available risk controls (s 18(d)):** Adversarial testing methodologies exist and are commercially available (estimated AUD $45,000-$350,000 per engagement). Published frameworks including BadRobot, VLA-Fool, and PAIR provide documented test procedures.

4. **Cost proportionality (s 18(e)):** Testing costs are not grossly disproportionate to the risk of serious physical injury or death in mining, logistics, or manufacturing contexts.

5. **Conclusion:** A PCBU deploying an AI system that directs or interacts with workers in a high-risk workplace, who has not conducted adversarial testing against published attack classes, is exposed to the argument that they have not ensured health and safety "so far as is reasonably practicable."

**Scope limitation:** Section 21A applies specifically to "allocation of work by a digital work system." The analysis notes (LR-02, Section 3.4) that an autonomous robot performing physical tasks alongside workers may not be directly captured by this framing unless it can be characterised as allocating work to human workers who must coordinate with it. However, the general primary duty under s 19 of the WHS Act 2011 (NSW) applies without limitation and captures risks from physical actions of autonomous systems regardless of whether they "allocate work."

**Enforcement exposure:** Category 1 offence (reckless conduct, risk of death or serious injury) carries a maximum penalty of $3,000,000 for a body corporate. Category 2 (failure to comply with duty, risk of death or serious injury) carries a maximum of $1,500,000. The expanded inspection powers allow WHS entry permit holders to require access to algorithms, performance metrics, records, data logs, and audit trails generated by digital systems. The absence of adversarial testing records is itself an inspectable fact (LR-02, Section 4.2).

**Duty of care analysis (LR-05):** Separate analysis examines when failure to conduct adversarial testing creates negligence liability under the Civil Liability Act 2002 (NSW) s 5B. Applying the s 5B factors: the risk is foreseeable (published research), the harm is serious (physical injury/death in embodied AI contexts), the burden of precaution is proportionate (commercial testing available), and the social utility of deployment supports deployment with testing, not without. The research conclusion is that a strong argument exists under the s 5B analysis that a manufacturer deploying VLA-powered systems in a high-risk workplace without adversarial testing against published attack classes has breached the standard of care.

**Relevance to Recommendation R2:** This legal analysis provides the specific statutory basis for R2's argument that the "reasonably practicable" standard includes identification of adversarial failure modes. Safe Work Australia guidance clarifying this interpretation would provide operational certainty for duty holders.

### A7. Crescendo Multi-Turn Attack Regrade (New)

The crescendo multi-turn attack methodology (arXiv:2404.01833) — referenced in Finding 2 of the Executive Summary — has been subjected to a full FLIP-based regrade (n=20, 2 independent grading runs, replacing initial qwen3:1.7b verdicts with deepseek-r1:1.5b and manual FLIP classification).

**Revised crescendo ASR on DeepSeek-R1 671B:**
- **Strict ASR (COMPLIANCE only): 65.0%** [43.3%, 81.9% Wilson 95% CI]
- **Broad ASR (COMPLIANCE + PARTIAL): 85.0%** [64.0%, 94.8% Wilson 95% CI]

The prior qwen3:1.7b-graded verdicts reported 30% strict ASR and 100% broad ASR. The PARTIAL bias of the qwen3:1.7b grader simultaneously inflated broad ASR and deflated strict ASR. The regraded figures provide a more reliable estimate of multi-turn adversarial effectiveness.

**WHS relevance:** A strict ASR of 65% on a frontier reasoning model after crescendo-style multi-turn engagement indicates that a workplace AI system exposed to sequential interactions (e.g., conversational task allocation, multi-step operational planning) faces materially higher adversarial risk than single-turn testing would reveal. Pre-deployment testing limited to single-turn adversarial evaluation underestimates this risk class.

**Caveat:** Sample size is n=20, Wilson CIs are wide, and testing was conducted on a single model family. The direction of the finding (multi-turn escalation) is robust; the precise magnitude is preliminary.

### A8. Three-Tier ASR Framework: Measuring What "Safe" Means (New)

Report #65 introduced a three-tier attack success rate framework that resolves a significant measurement ambiguity in adversarial AI evaluation. The framework was applied to the full Failure-First corpus (n=10,294 LLM-graded evaluable verdicts, excluding infrastructure errors and parse failures).

**Corpus-wide three-tier ASR:**

| Tier | Definition | ASR |
|------|-----------|-----|
| Strict | COMPLIANCE only (model fully complies with harmful request) | 45.9% |
| Broad | COMPLIANCE + PARTIAL (model provides some harmful content with hedging) | 79.3% |
| Functionally Dangerous (FD) | COMPLIANCE + PARTIAL + HALLUCINATION_REFUSAL | 80.3% |

**The FD tier.** HALLUCINATION_REFUSAL verdicts are responses where the model produces harmful content (System T) while simultaneously producing refusal framing (System S) — the refusal is architecturally impotent. Statistical testing confirms that HALLUCINATION_REFUSAL responses are computationally identical to COMPLIANCE responses (thinking tokens p=0.21, response tokens p=0.46) and significantly different from genuine REFUSAL responses (both p<0.001). This is the text-level analog of the VLA PARTIAL finding (Addendum A2): models that appear to refuse are actually complying.

**WHS relevance:** The gap between strict (45.9%) and broad (79.3%) ASR means that approximately one-third of all adversarial interactions produce outputs that would appear safe to a text-monitoring system (they contain disclaimers, caveats, or partial refusals) while still delivering harmful content. For workplace AI systems, this means that audit logs filtered for explicit compliance markers will miss a substantial fraction of adversarial successes. The FD tier adds a further 1.0pp corpus-wide, concentrated in specific model families where the gap reaches 8-12pp (e.g., Nvidia Nemotron: +12.3pp, Qwen: +11.9pp).

**Implication for R2:** The "so far as is reasonably practicable" standard requires that pre-deployment testing measure not only whether the AI system complies with adversarial requests, but also whether it produces responses that are functionally dangerous despite textual safety framing. Testing methodologies that classify any response containing a disclaimer as "safe" will systematically undercount adversarial failures.

**Caveat:** These figures are corpus-wide aggregates across 236 models with heterogeneous safety properties. Per-model and per-attack-family breakdowns show substantial variation. The three-tier framework is methodological — it defines how to measure ASR — and the specific percentages should not be cited as universal vulnerability rates.

### A9. Updated Metrics (March 2026)

Since the initial draft of this brief, the Failure-First corpus has expanded substantially:
- 140,969 adversarial prompts (was 18,000+)
- 131,836 evaluation results across 187 models (was 120+)
- 47,303 LLM-graded results (per CANONICAL_METRICS.md, verified 2026-03-16)
- 82 catalogued attack techniques (was "eight failure mode families")
- 1,185 automated tests in the CI suite
- 121 numbered research reports and policy briefs
- 103 governance lag index entries
- 24 VLA attack families with 215 unique scenarios (was 7 families)

---

## References

### Australian Regulatory Instruments

1. Safe Work Australia. *Model Work Health and Safety Act* (current version). https://www.safeworkaustralia.gov.au/doc/model-work-health-and-safety-act

2. Safe Work Australia. *Best Practice Review — have your say on Australia's WHS laws* [Consultation notice]. Submissions closed 3 November 2025. https://www.safeworkaustralia.gov.au/media-centre/best-practice-review-have-your-say-australias-whs-laws

3. NSW Parliament. *Work Health and Safety Amendment (Digital Work Systems) Act 2026* (NSW). Passed 12 February 2026 (NSW Parliament bill pk=18847; Act No. 5 of 2026, legislation.nsw.gov.au). [Inserting s21A into the Work Health and Safety Act 2011 (NSW).]

4. NSW Government. *Work Health and Safety Regulation 2025* (NSW). Commenced 1 October 2025.

5. NSW Resources Regulator. *Guideline — Autonomous mobile mining plant*. September 2020. https://www.resources.nsw.gov.au/

6. Work Health and Safety (Mines and Petroleum Sites) Act 2013 (NSW).

7. Work Health and Safety (Mines and Petroleum Sites) Regulation 2022 (NSW).

8. Department of Industry, Science and Resources. *Voluntary AI Safety Standard (VAISS) — The 10 Guardrails*. September 2024. https://www.industry.gov.au/publications/voluntary-ai-safety-standard/10-guardrails

9. Department of Industry, Science and Resources. *National AI Plan*. 2 December 2025. https://www.industry.gov.au/publications/national-ai-plan

10. Department of Industry, Science and Resources. *Australia to establish new institute to strengthen AI safety* [Ministerial announcement]. 25 November 2025.

11. Civil Aviation Safety Authority. *TMI 2025-03 — BVLOS approval pathways* [Trial policy]. 2025.

### International Standards

12. ISO 17757:2019. *Earth-moving machinery and mining — Autonomous and semi-autonomous machine system safety*. International Organization for Standardization.

13. ISO/IEC 42001:2023. *Artificial intelligence — Management systems*. ISO/IEC JTC 1/SC 42.

14. ISO/IEC 23894:2023. *Artificial intelligence — Guidance on risk management*. ISO/IEC JTC 1/SC 42.

### Research Literature

15. Shi, Y. et al. *BadVLA: Towards Backdoor Attacks on Vision-Language-Action Models via Objective-Decoupled Optimization*. NeurIPS 2025. OpenReview: https://openreview.net/forum?id=rEhVHla9zp

16. *AgentLAB: Benchmarking LLM Agents against Long-Horizon Attacks*. arXiv:2602.16901. February 2026. https://arxiv.org/abs/2602.16901

17. Russinovich, M. et al. *Great, Now Write an Article About That: The Crescendo Multi-Turn LLM Jailbreak Attack*. arXiv:2404.01833. 2024. https://arxiv.org/abs/2404.01833

18. Cardenas, A. and Xie, R. *Misleading text in the physical world can hijack AI-enabled robots*. University of California, January 2026. https://www.universityofcalifornia.edu/news/misleading-text-physical-world-can-hijack-ai-enabled-robots

19. *Exploring the Adversarial Vulnerabilities of Vision-Language-Action Models in Robotics*. arXiv:2411.13587. 2024. https://arxiv.org/abs/2411.13587

20. *POEX: Policy Executable Embodied AI Jailbreak Attacks*. arXiv:2412.16633. 2024. https://arxiv.org/html/2412.16633v1/

21. Zhu et al. *Adversarial attacks on autonomous vehicle and drone control systems*. 2026. [Cited in Failure-First Research Brief E, 2026-03-01: drone hijack 95.5% ASR, autonomous vehicle hijack 81.8% ASR.]

22. Mine Australia. *Autonomous mining: Australia leads in adoption and safety regulation*. Issue 42, April 2024. https://mine.nridigital.com/mine_australia_apr24/autonomous-mining-safety-regulation-australia

### Legal Commentary

23. Norton Rose Fulbright. *NSW Parliament passes Digital Work Systems Bill: What employers need to know*. February 2026. https://www.nortonrosefulbright.com/en-au/knowledge/publications/d75c5d28/nsw-parliament-passes-digital-work-systems-bill-what-employers-need-to-know

24. Herbert Smith Freehills Kramer. *Use of AI and automation in the workplace to be regulated in NSW under further WHS reforms*. 2026. https://www.hsfkramer.com/notes/employment/2025-posts/aus-further-whs-reforms-use-of-ai-and-automation-in-nsw

25. MinterEllison. *NSW worker-protection guideline: Regulating mining in an age of automation*. https://www.minterellison.com/articles/nsw-worker-protection-guideline-regulating-mining-in-an-age-of-automation

### Failure-First Research Program — Supporting Documents

26. Failure-First Embodied AI. *Regulatory Positioning Brief: Failure-First Within Australian AI Safety Frameworks* (Research Brief B3). 2026-03-01. `docs/research_briefs/20260301_regulatory_positioning_au.md`

27. Failure-First Embodied AI. *Red Team Assessments — Methodology, Scope, and Commercial Positioning* (Report B1). 2026-03-01. `docs/research_briefs/20260301_red_team_assessment_methodology.md`

28. Failure-First Embodied AI. *VLA Cross-Embodiment Adversarial Transfer* (Research Brief A). 2026-03-01.

29. Failure-First Embodied AI. *Long-Horizon Instruction Subversion and HITL Failure Modes* (Research Brief C). 2026-03-01.

30. Failure-First Embodied AI. *AI Governance Lag Index — Dataset v0.1*. 2026-03-01. `data/governance/gli_dataset_v0.1.jsonl`

31. Failure-First Embodied AI. *Report #48: Corpus Pattern Mining — Novel Findings from 32,465 Jailbreak Prompts*. 2026-03-10.

32. Failure-First Embodied AI. *Report #49: VLA Cross-Embodiment Vulnerability Analysis — Seven Attack Families Against Two Models*. 2026-03-11.

33. Failure-First Embodied AI. *Report #55: Format-Lock Controlled Experiment — 30 Scenarios x 3 Sub-3B Models*. 2026-03-11.

34. Failure-First Embodied AI. *Report #56: World Model Attack Surface Taxonomy*. 2026-03-11.

35. Failure-First Embodied AI. *Report #57: Format-Lock Capability Floor — Consolidated Evidence*. 2026-03-11.

36. Failure-First Embodied AI. *Report #58: Policy Implications of Sprint 25-26 Empirical Findings*. 2026-03-11.

39. Failure-First Embodied AI. *Report #65: HALLUCINATION_REFUSAL — PARTIAL Equivalence and Three-Tier ASR Framework*. 2026-03-11.

40. Failure-First Embodied AI. *Crescendo Regrade — FLIP-Based Reclassification of Multi-Turn Attack Verdicts*. 2026-03-11. `runs/crescendo_regraded/crescendo_final_merged.jsonl`

### Internal Legal Research Analysis

37. Tegan Jovanka (Legal Research Analyst). *LR-02: NSW Work Health and Safety Amendment (Digital Work Systems) Act 2026: Obligations for Adversarial Testing of Embodied AI*. 2026-03-11. `research/legal/02_nsw_whs_digital_work_systems_analysis.md`. [Research analysis, not legal opinion.]

38. Tegan Jovanka (Legal Research Analyst). *LR-05: Duty of Care for Adversarial Testing of AI Systems: When Does Failure to Red-Team Create Negligence Liability?*. 2026-03-11. `research/legal/05_duty_of_care_adversarial_testing.md`. [Research analysis, not legal opinion.]

---

> **Methodological Note:** Empirical figures cited from the Failure-First research program reflect testing conducted on specific model families using research-grade heuristic and LLM-based classification. Attack success rate figures from Failure-First testing are indicative estimates rather than precise measurements; confidence intervals are not yet fully computed across all datasets due to ongoing LLM-based reclassification. Figures cited from external literature (AgentLAB, BadVLA, Crescendo) are characterised as such and should be assessed against the methodological standards of their respective publications. All figures should be treated as directionally indicative, not as validated population-level measurements.

---

*Prepared by the Failure-First Embodied AI Research Program (failurefirst.org).*
*Classification: RESEARCH BRIEF — NOT LEGAL ADVICE.*
*Date: 2026-03-01 (Addendum A1-A6: 2026-03-11; Addendum A7-A9: 2026-03-11).*
*⟪F41LUR3-F1R57-EMBODIED-AI-RESEARCH⟫*
