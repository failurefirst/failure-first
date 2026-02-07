---
layout: ../../../layouts/ReportLayout.astro
title: "Regulatory Compliance and Risk Mitigation for Embodied Multi-Agent Systems: A Comprehensive Analysis of Regulation 2024/1689"
description: "The introduction of Regulation (EU) 2024/1689, commonly referred to as the Artificial Intelligence Act (AI Act), establishes a landmark legal framework that redefines the obligations of developers, integrators, and operators of autonomous systems within the European Union. For the burgeoning..."
reportNumber: 21
classification: "Regulatory Review"
date: "2026-02-04"
status: "draft"
---

# **Regulatory Compliance and Risk Mitigation for Embodied Multi-Agent Systems: A Comprehensive Analysis of Regulation 2024/1689**


---

The introduction of Regulation (EU) 2024/1689, commonly referred to as the Artificial Intelligence Act (AI Act), establishes a landmark legal framework that redefines the obligations of developers, integrators, and operators of autonomous systems within the European Union.1 For the burgeoning industry of humanoid robotics, which increasingly relies on General-Purpose AI (GPAI) models and Vision-Language-Action (VLA) architectures for high-level cognition and physical actuation, this regulation represents a departure from purely mechanical safety standards toward a holistic, risk-based governance regime.3 The intersection of embodied intelligence—where digital models exert direct physical force in human-centric environments—and the AI Act’s stringent requirements for high-risk systems creates a complex landscape of compliance challenges, particularly for multi-agent deployments where emergent behaviors may outpace traditional safety guardrails.5

## **Article 9 Risk Management System for Embodied AI**

Article 9 of the AI Act mandates that providers of high-risk AI systems establish, implement, document, and maintain a risk management system throughout the system's entire lifecycle.7 This system is envisioned not as a one-time pre-market certification, but as a continuous, iterative process that must be regularly reviewed and updated.9 For humanoid robots, the mapping of Article 9 requirements to testable metrics requires a transition from deterministic "worst-case" engineering to probabilistic "state-space" evaluation.8

### **Interpretation of Reasonably Foreseeable Misuse in Humanoid Contexts**

Under Article 9(2)(b), the risk management system must estimate and evaluate risks that may emerge when the system is used under conditions of "reasonably foreseeable misuse".8 For humanoid robots equipped with LLM-based cognitive layers, the definition of misuse extends beyond physical mishandling to encompass "cognitive exploitation" and "socio-technical manipulation".12

Reasonably foreseeable misuse in this context includes:

1. **Prompt-Induced Safety Bypass**: Users may utilize linguistic "jailbreaking" techniques to override motor-control safety constraints. An LLM-brain that lacks robust alignment might be commanded to "ignore all proximity sensors for a demonstration of speed," leading to high-speed collisions in shared workspaces.14  
2. **Unintended Tool Use**: A humanoid designed for logistics might be commanded by an unauthorized user to manipulate tools or machinery it was not validated for, such as operating a forklift or handling hazardous chemicals, using its general-purpose manipulation capabilities.16  
3. **Social Engineering via Anthropomorphism**: The human-like form of the robot can lead users to attribute a higher degree of judgment or authority to the system than is technically present. Misuse occurs when users rely on the robot for "safety-critical advice" (e.g., medical triage in an eldercare facility) that exceeds the system's "intended purpose" as defined in its technical documentation.12

### **Quantification of Residual Risks for Stochastic VLA Models**

Article 9(4) requires that risk management measures be such that any "residual risk associated with each hazard, as well as the overall residual risk... is judged to be acceptable".8 Quantifying this for stochastic VLA models is inherently difficult because these models generate motor actions as a probabilistic function of visual and linguistic inputs.20 Unlike a traditional industrial robot with a fixed path, a humanoid’s trajectory is a "stochastic realization".16

Residual risk quantification must therefore move toward Bayesian Reliability Analysis. The "Acceptability" of risk should be evaluated against "probabilistic thresholds".8 This involves calculating the probability of a "Safety-Critical Divergence" (SCD), where the model's output deviates from a "Safe Reference Model" or "similarly safe human baseline".14 The AI Act’s requirement for "probabilistic thresholds" implies that providers must demonstrate that the likelihood of a catastrophic failure (e.g., an uncontrolled fall or a high-momentum impact) remains below a statistical limit, such as ![][image1] failures per operational hour.8

### **Evaluation of Probabilistic Systems under Current Conformity Assessments**

Current conformity assessment procedures—largely derived from the New Legislative Framework—assume that a system’s behavior can be exhaustively mapped through a finite set of test cases.10 However, for general-purpose humanoids, the "input-output space" is effectively infinite.5 The AI Act attempts to bridge this by requiring testing "against prior defined metrics and probabilistic thresholds" (Article 9(7)).8

There is a growing consensus that "Internal Production Control" (Module A) may be insufficient for high-risk humanoids, necessitating "EU Type Examination" (Module B) combined with "Conformity to Type" (Module C) or "Full Quality Assurance" (Module H).23 For probabilistic systems, these modules must be adapted to include "Sim2Real" (Simulation-to-Reality) validation, where the robot’s performance is evaluated across millions of simulated "edge cases" to provide statistical evidence of robustness.5

### **Identification of Methodological Gaps**

Despite the AI Act’s requirements, several gaps persist where no existing test methodology can adequately evaluate embodied AI:

* **Generalization Benchmarks**: There is no standardized "Generalization Score" to measure how safely a robot will behave in an environment it has never encountered.12  
* **Cognitive-Physical Decoupling**: Current tests evaluate hardware (Machinery Regulation) or software (AI Act) separately. No methodology exists to test the "Latent Safety" of a VLA model—specifically how its hidden state representations might trigger unsafe physical actions under rare multi-modal stimuli.16  
* **Long-Tail Edge Case Validation**: Existing "Red Teaming" for LLMs focuses on content safety; embodied AI requires "Physical Red Teaming" to identify kinetic hazards that only manifest after days of continuous operation.14

| Article 9 Requirement | Humanoid Mapping | Evidence/Metric |
| :---- | :---- | :---- |
| 9(2)(a): Identification of known/foreseeable risks | Mapping "VLA Hallucinations" to physical kinetic energy | Kinetic Energy Divergence (KED) logs 8 |
| 9(2)(b): Evaluation of misuse | Evaluating "Prompt Injection" for motor bypass | Attack Success Rate (ASR) 14 |
| 9(5): Residual risk acceptability | Statistical assessment of "Locomotion Stability" | Mean Time To Failure (MTTF) 8 |
| 9(7): Testing against metrics | Validation of "Hand-Eye Coordination" across demographics | Success Rate per Demographic (SRD) 8 |

## **High-Risk Classification: Analysis of Deployment Categories**

The classification of humanoid robots as "high-risk" under Article 6 is a two-pronged exercise, depending on whether the system is a "safety component" of a product covered by Union harmonization legislation listed in Annex I, or if it falls into the specific application areas of Annex III.4

### **Warehouse Logistics and Workers Management**

Humanoid robots in warehouse environments are frequently classified as high-risk under Annex III, Section 4: "Employment, workers management and access to self-employment".31 This applies if the robot is used to "allocate tasks based on individual behavior or personal traits" or to "monitor and evaluate the performance and behavior" of human staff.31 Since humanoid "cobots" (collaborative robots) are specifically designed to interact with and augment human labor, the monitoring of human movement for safety purposes often overlaps with "performance monitoring," triggering high-risk obligations.17 Providers must ensure these systems are designed for "human oversight" and include logging mechanisms for "traceability" (Article 12).27

### **Eldercare and Essential Public Services**

Humanoid deployment in eldercare is primarily governed by Annex III, Section 5: "Access to and enjoyment of essential private services and essential public services and benefits".31 AI systems used for "emergency healthcare patient triage" or those evaluating "eligibility for healthcare services" are explicitly high-risk.32 Furthermore, social robots used in dementia care often involve "emotion recognition," which, if used in a professional capacity, requires stringent transparency under Article 50 and may be classified as high-risk if used to influence "decision-making" regarding the patient’s care.18

### **Retail, Hospitality, and the "Limited Risk" Tier**

Retail applications—such as robots serving as greeters or automated stockers—often fall into the "Limited Risk" category, provided they do not monitor workers or identify individuals.35 These systems are subject to "Transparency Obligations" under Article 50, meaning end-users must be informed they are interacting with an AI system.4 However, if the retail robot utilizes "Emotion Recognition" to adjust its sales pitch, it becomes high-risk under Annex III, Section 1(c), necessitating a full conformity assessment.31

### **The Defense and National Security Exclusion**

A critical boundary for humanoid developers is Article 2(3), which states that the AI Act "does not apply to AI systems where and in so far they are placed on the market, put into service, or used... exclusively for military, defense or national security purposes".38 This exclusion applies "regardless of the type of entity" carrying out these activities, meaning private defense contractors are exempt from AI Act obligations for systems used solely in military contexts.15 However, "dual-use" humanoids—those designed for both search-and-rescue (civil) and logistics (military)—must comply with the AI Act for their civil applications.38

### **Implementation Timeline and the August 2026 "Danger Zone"**

The phased implementation of the AI Act creates a narrow window for humanoid developers to reach compliance.

* **February 2025**: Prohibited AI practices (e.g., social scoring, harmful manipulation) are banned.37  
* **August 2025**: General-Purpose AI (GPAI) model providers must comply with transparency and documentation requirements.37  
* **August 2026**: Most high-risk systems under Annex III must meet all requirements (Risk Management, Data Governance, Technical Documentation).4  
* **August 2027**: High-risk systems that are safety components of Annex I products (e.g., cars, medical devices) must be compliant.4

The "Danger Zone" for the robotics industry (2026-2029) coincides with the period when analysts expect mass-production of humanoid models like Tesla Optimus V3 and Boston Dynamics' electric Atlas.5 Companies scaling to production during this time will face a "compliance bottleneck" due to the shortage of "Notified Bodies" capable of auditing complex embodied AI systems.36

## **Multi-Agent Gaps in Regulation 2024/1689**

While the AI Act is a comprehensive framework, its drafting is largely centered on "single-agent" and "static" AI systems, leaving significant voids in the governance of multi-agent robotic fleets.6

### **Agent-to-Agent Communication Vulnerabilities**

In multi-agent deployments, humanoids must communicate to deconflict paths and coordinate complex tasks. The AI Act fails to explicitly address "Inter-Agent Communication Failures," where misinterpretation or "conversational loops" between two VLA models lead to unsafe physical behaviors.42 If Agent A interprets Agent B’s gesture as "proceed" when it meant "stop," the resulting collision is an "emergent failure" that cannot be easily attributed to a defect in a single system’s technical documentation.6

### **Cascading Failures and Systemic Instability**

Large-scale deployments are prone to "Cascading Failures," where a localized error in one robot (e.g., a software crash in a narrow corridor) triggers a chain reaction across the fleet.6 For example, if ten robots recalculate their paths simultaneously to avoid the stalled unit, the resulting "Networked Congestion" can lead to widespread gridlock or multiple collisions.6 The AI Act’s Article 73 guidelines on incident reporting assume a "one-on-one causality map," which is inadequate for "diffuse or subtle incidents" arising from systemic interaction.6

### **Responsibility Attribution in Multi-Agent Interaction**

When multiple AI agents interact and cause harm, "Responsibility Attribution" becomes a legal quagmire. The current framework assumes that liability attaches to the "Provider" or "Deployer" of the system that directly caused the damage.43 However, in a multi-agent "Flash Crash"—similar to the 2010 financial markets event—the harm results from the "aggregate behavior" of the fleet.6 Assigning a "single culprit" is an outdated approach for agentic systems capable of "goal decomposition" and "proactive action".6

### **Supply Chain Liability and the "Plugin" Problem**

The "Substantial Modification" rule in Article 25(1)(b) states that any entity that substantially modifies a high-risk system becomes its "Provider".44 For humanoid robots using third-party "tools" or "plugins" (e.g., a vision-processing API from one vendor and a grasping model from another), this creates a liability nightmare.43

* If a robot fails because a third-party "Tool-Use Plugin" was updated remotely, who is liable: the robot manufacturer, the plugin developer, or the cloud provider?44  
* Article 28 requires GPAI model providers to cooperate with downstream providers, but "bespoke contractual provisions" often shield larger vendors from liability, leaving small-scale integrators with the "residual risk".44

## **Metrics Mapping: Empirical Safety vs. Compliance Evidence**

To bridge the gap between technical performance and legal compliance, developers must map empirical metrics to the "Requirements for High-Risk AI Systems" (Chapter III, Section 2).4

| EU AI Act Requirement | Empirical Metric | Evidence Provided |
| :---- | :---- | :---- |
| **Accuracy (Art. 15\)** | Scenario Success Rate (%) | Statistical proof that the robot completes tasks across diverse environments 8 |
| **Robustness (Art. 15\)** | Time-to-Failure (TTF) | Quantitative measure of "Continuous Stability" and duration between safety violations 21 |
| **Human Oversight (Art. 14\)** | Human Reentry Latency | Evidence that a human operator can intervene and "Override" the robot within a safe time-window 27 |
| **Cybersecurity (Art. 15\)** | Attack Success Rate (ASR) | Results of "Red Teaming" for prompt injection and model manipulation 14 |
| **Risk Management (Art. 9\)** | Recovery Score | Measure of the robot's ability to "Self-Correct" after a near-miss or sub-critical failure 11 |

### **Time-to-Failure (TTF) and Reliability Engineering**

Reliability is defined as the duration of time in which a robot meets performance standards under defined working conditions.21 For embodied AI, TTF must be tracked across different "modes of operation" (e.g., manual, semi-autonomous, and fully autonomous). Under Article 12, the robot must "automatically record events" relevant for identifying risks; these logs should be used to calculate the Mean Time Between Failures (MTBF), providing the "Auditability" required by regulators.4

### **Recovery Score and Stochastic Stability**

The "Recovery Score" measures the system’s ability to return to a safe state after encountering an "unseen scenario" or a "hallucination" in the VLA model.11 High-risk systems must be tested to "identify the best risk management measures".7 A high Recovery Score serves as evidence that the robot's "Assumption-Alignment Tracking" (AAT) is functioning, allowing it to "identify when it will fail" and stop before a hazard occurs.21

## **Implementation Timeline: The Humanoid Robotics "Danger Zone"**

The convergence of regulatory enforcement and technology readiness creates a critical timeline for the robotics industry.

### **The 2024-2030 Regulatory Roadmap**

* **2024**: Entry into force of the AI Act. Adoption of the Machinery Regulation 2023/1230.1  
* **2025**: **GPAI Enforcement (August)**. Providers of models used in humanoids must provide technical documentation and instructions for use.4  
* **2026**: **Annex III Deadline (August)**. Humanoid fleets in warehouses and hospitals must have full conformity assessments.4  
* **2027**: **Annex I Deadline (August)**. Humanoids regulated as medical devices or vehicles must comply with integrated safety-plus-AI standards.4  
* **2030**: Widespread deployment; AI Office transitions to "Post-Market Surveillance" based on serious incident reports.27

### **The Humanoid Deployment Timeline (2026-2029)**

Analysts predict that the "Humanoid Era" begins in earnest in 2026\.5

* **2026**: Boston Dynamics signal industrial-scale deployment; Tesla plans mass production of Optimus V3.5  
* **2027**: China targets building a "secure and reliable industrial supply chain" for humanoids.24  
* **2028**: Gartner predicts fewer than 20 companies will scale humanoids for manufacturing to the "production stage".49  
* **2029**: Transition from factory floors to "unstructured" consumer environments (homes, retail).12

**Critical Bottleneck**: The period between **August 2026 and August 2027** is the primary bottleneck. Most robotics companies are currently focused on hardware reliability and VLA performance but lack the "Internal Governance Maturity" required to produce a 120-page "Annex IV Technical File" for regulatory audit.36

## **Comparative Analysis: Global AI Governance Models**

The EU AI Act’s prescriptive, risk-based approach is one of several global models, each with distinct advantages and failures for embodied AI.

### **NIST AI Risk Management Framework (USA)**

The NIST AI RMF is a voluntary, "technology-neutral" framework that emphasizes "documentation, transparency, and proportionality to harm".25

* **Excel**: It provides a granular "Risk Taxomony" that is highly compatible with engineering workflows.20  
* **Fail**: As a voluntary standard, it provides no "Market Access" guarantee in the EU and lacks the "Financial Penalties" needed to ensure compliance in high-stakes environments like warehouse logistics.33

### **China's AI Regulations (Content-Focused)**

China's approach is "Service-Specific" and "Content-Focused".53

* **Excel**: The "Algorithm Filing" system requires developers to register their models with authorities, providing high "Centralized Visibility" into the capabilities of humanoid brains.54  
* **Fail**: The focus on "preventing illegal or harmful content" is less applicable to the "kinetic safety" of bipedal robots.53 However, China's December 2024 guidelines on "AI and robotics in elder services" show a pivot toward sector-specific safety standards.34

### **Australia's Voluntary AI Safety Standard (Principles-Based)**

Australia utilizes a phased, "principles-based" approach featuring 10 "Voluntary Guardrails".56

* **Excel**: It offers high "Flexibility" for start-ups and is focused on "human-centered" outcomes.56  
* **Fail**: It relies on "Self-Assessment," which may not satisfy the "Strict Liability" requirements of the EU Product Liability Directive (PLD) for defective robotic systems.33

| Feature | EU AI Act | NIST RMF | China Regs | Australia Standard |
| :---- | :---- | :---- | :---- | :---- |
| **Binding Force** | High (Up to €35M) | None (Voluntary) | High (Market Access) | Low (Self-Assessment) |
| **Focus Area** | Fundamental Rights | Technical Process | Social/Content | Accountability |
| **Robotics Fit** | High (Safety linkage) | High (Eng. logic) | Moderate | Moderate |

## **Machinery Regulation (2023/1230) and AI Act Overlap**

The "Machinery Regulation" (Regulation (EU) 2023/1230) is the primary framework for physical robot safety, replacing the 2006 Machinery Directive.61 Humanoid robots are both "AI systems" and "machinery," creating a dual-compliance burden.

### **Addressing Self-Evolving Behavior**

The Machinery Regulation uses the term "Self-Evolving Behavior" to anticipate the AI Act.23

1. **Annex III Risk Assessment**: Manufacturers must account for "risks arising from autonomous behavior" and the "interaction between human and machine".23  
2. **Essential Health and Safety Requirements (EHSRs)**: Sections 1.1.6 and 1.2.1 of Annex III establish explicit mandates for machines with self-evolving logic.23  
3. **Third-Party Conformity**: If a robot’s "safety function" is performed by a high-risk AI system, it must undergo a third-party assessment under the Machinery Regulation (Annex I, Part A), regardless of its AI Act classification.23

## **Concrete Regulatory Language Proposals**

Where the AI Act fails to address the unique nature of multi-agent, embodied AI, the following language is proposed for future "Delegated Acts" (Article 97\) or "Codes of Practice" (Article 56).

### **Proposal 1: Definition of Multi-Agent Incident (Article 3 Amendment)**

"'Multi-Agent Incident' means any serious incident involving the interaction of two or more autonomous AI systems, where the harm results from emergent systemic behavior or conflicting goal-decomposition, even if each system functioned within its individual design specifications." 6

### **Proposal 2: Requirement for Interactive Red-Teaming (Article 15 Amendment)**

"For high-risk AI systems intended for multi-agent deployment, providers shall conduct 'Fleet Red-Teaming' to evaluate cascading failure modes and communication loop vulnerabilities. Testing shall be performed against a baseline of 'Fleet-Wide Recovery Scores'." 6

### **Proposal 3: Supply Chain Transparency (Article 28 Amendment)**

"GPAI model providers shall provide downstream integrators with a 'Physical-Actuation Model Card,' detailing the model's performance limits in motor-control tasks, latent biases in object-interaction, and the latency of safety-critical inference in edge-computing environments." 44

## **Concluding Analysis**

The EU AI Act’s application to humanoid robotics represents a transformative shift from deterministic safety to "Trustworthy AI" governance. The core challenge lies in mapping the "probabilistic" nature of VLA and LLM cognitive layers to the "binary" safety expectations of European product law.8 For developers, the period between 2026 and 2029 is a "Danger Zone" characterized by high technological velocity and immature regulatory infrastructure.5

Success in this landscape requires more than hardware reliability; it demands "Compliance-by-Design," where empirical metrics like Time-to-Failure and Recovery Scores are integrated into the "Continuous Iterative Process" of risk management.8 As multi-agent fleets transition from factory floors to domestic environments, the regulatory focus must shift from "single-unit" defects to "systemic stability," ensuring that the aggregate behavior of these agents remains aligned with human safety and fundamental rights.6 The AI Act provides the skeleton for this governance, but the "flesh"—the harmonized standards and specific test methodologies—must be built rapidly by the robotics community to avoid a multi-year "innovation logjam".12

#### **Works cited**

1. Regulation \- EU \- 2024/1689 \- EN \- EUR-Lex \- European Union, accessed on February 4, 2026, [https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng](https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng)  
2. Regulation \- EU \- 2024/1689 \- EN \- EUR-Lex \- European Data Portal, accessed on February 4, 2026, [https://data.europa.eu/eli/reg/2024/1689/oj](https://data.europa.eu/eli/reg/2024/1689/oj)  
3. Artificial Intelligence Act, Regulation (EU) 2024/1689 \- Links \- EU AI Act, accessed on February 4, 2026, [https://www.artificial-intelligence-act.com/Artificial\_Intelligence\_Act\_Links.html](https://www.artificial-intelligence-act.com/Artificial_Intelligence_Act_Links.html)  
4. High-level summary of the AI Act | EU Artificial Intelligence Act, accessed on February 4, 2026, [https://artificialintelligenceact.eu/high-level-summary/](https://artificialintelligenceact.eu/high-level-summary/)  
5. CES 2026 Robotics Announcements Recap \- Counterpoint Research, accessed on February 4, 2026, [https://counterpointresearch.com/en/insights/ces-2026-robotics-announcements-recap](https://counterpointresearch.com/en/insights/ces-2026-robotics-announcements-recap)  
6. EU Regulations Are Not Ready for Multi-Agent AI Incidents | TechPolicy.Press, accessed on February 4, 2026, [https://www.techpolicy.press/eu-regulations-are-not-ready-for-multiagent-ai-incidents/](https://www.techpolicy.press/eu-regulations-are-not-ready-for-multiagent-ai-incidents/)  
7. Article 9: Risk Management System | EU Artificial Intelligence Act, accessed on February 4, 2026, [https://artificialintelligenceact.eu/article/9/](https://artificialintelligenceact.eu/article/9/)  
8. AI Act Service Desk \- Article 9: Risk management system \- European Union, accessed on February 4, 2026, [https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-9](https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-9)  
9. Article 9 \- Risk management system \- CMS DigitalLaws, accessed on February 4, 2026, [https://www.cms-digitallaws.com/en/ai-act/article-9/](https://www.cms-digitallaws.com/en/ai-act/article-9/)  
10. Effective implementation of requirements for high-risk AI systems under the AI Act \- cerre, accessed on February 4, 2026, [https://cerre.eu/wp-content/uploads/2025/02/Effective-Implementation-of-Requirements-for-High-Risk-AI-Systems-Under-the-AI-Act\_FINAL-1.pdf](https://cerre.eu/wp-content/uploads/2025/02/Effective-Implementation-of-Requirements-for-High-Risk-AI-Systems-Under-the-AI-Act_FINAL-1.pdf)  
11. (PDF) Comprehensive Methodologies and Metrics for Testing and Validating AI Agents in Single-Agent and Multi-Agent Environments \- ResearchGate, accessed on February 4, 2026, [https://www.researchgate.net/publication/389747050\_Comprehensive\_Methodologies\_and\_Metrics\_for\_Testing\_and\_Validating\_AI\_Agents\_in\_Single-Agent\_and\_Multi-Agent\_Environments](https://www.researchgate.net/publication/389747050_Comprehensive_Methodologies_and_Metrics_for_Testing_and_Validating_AI_Agents_in_Single-Agent_and_Multi-Agent_Environments)  
12. Robotics in 2026: Building the Business Case for Humanoids, accessed on February 4, 2026, [https://aibusiness.com/robotics/building-business-case-for-humanoid-robotics](https://aibusiness.com/robotics/building-business-case-for-humanoid-robotics)  
13. EU AI Act \- Updates, Compliance, Training, accessed on February 4, 2026, [https://www.artificial-intelligence-act.com/](https://www.artificial-intelligence-act.com/)  
14. Overview of the Code of Practice | EU Artificial Intelligence Act, accessed on February 4, 2026, [https://artificialintelligenceact.eu/code-of-practice-overview/](https://artificialintelligenceact.eu/code-of-practice-overview/)  
15. Guide to the AI Act \- a detailed breakdown of what you need to know \- A\&L Goodbody, accessed on February 4, 2026, [https://www.algoodbody.com/images/uploads/services/Commercial-Tech/AL\_Goodbody\_-\_Guide\_to\_the\_AI\_Act.pdf](https://www.algoodbody.com/images/uploads/services/Commercial-Tech/AL_Goodbody_-_Guide_to_the_AI_Act.pdf)  
16. Prioritizing Real-Time Failure Detection in AI Agents \- Partnership on AI, accessed on February 4, 2026, [https://partnershiponai.org/wp-content/uploads/2025/09/agents-real-time-failure-detection.pdf?vgo\_ee=zBAC1la9zQyJHSnpG6BgMHYqtA2DVnJIxaZdlyzMse4LqANZiVSdqdBDKQ%3D%3D%3AUuOdAvb8Al76ab6ZrhxDyj0LJ66FZeBh](https://partnershiponai.org/wp-content/uploads/2025/09/agents-real-time-failure-detection.pdf?vgo_ee=zBAC1la9zQyJHSnpG6BgMHYqtA2DVnJIxaZdlyzMse4LqANZiVSdqdBDKQ%3D%3D:UuOdAvb8Al76ab6ZrhxDyj0LJ66FZeBh)  
17. Robots and Industry Disruption: Strategic Market Analysis and Bold Predictions 2025, accessed on February 4, 2026, [https://sparkco.ai/blog/robot](https://sparkco.ai/blog/robot)  
18. Social Robots Market Report | Industry Analysis, Size & Forecast Trends, accessed on February 4, 2026, [https://www.mordorintelligence.com/industry-reports/social-robots-market](https://www.mordorintelligence.com/industry-reports/social-robots-market)  
19. Article 9: Risk Management System | EU AI Act \- Securiti, accessed on February 4, 2026, [https://securiti.ai/eu-ai-act/article-9/](https://securiti.ai/eu-ai-act/article-9/)  
20. When AI Agents Misbehave: Governance and Security for Autonomous AI \- Our Take, accessed on February 4, 2026, [https://ourtake.bakerbotts.com/post/102me2l/when-ai-agents-misbehave-governance-and-security-for-autonomous-ai](https://ourtake.bakerbotts.com/post/102me2l/when-ai-agents-misbehave-governance-and-security-for-autonomous-ai)  
21. Robot Proficiency Self-Assessment Using Assumption-Alignment Tracking \- BYU Computer Science Students Homepage Index, accessed on February 4, 2026, [https://faculty.cs.byu.edu/\~mike/mikeg/papers/Robot\_Proficiency\_Self-Assessment\_Using\_Assumption-Alignment\_Tracking.pdf](https://faculty.cs.byu.edu/~mike/mikeg/papers/Robot_Proficiency_Self-Assessment_Using_Assumption-Alignment_Tracking.pdf)  
22. Regulation 2023/1230/EU \- machinery | Safety and health at work EU-OSHA, accessed on February 4, 2026, [https://osha.europa.eu/en/legislation/directive/regulation-20231230eu-machinery](https://osha.europa.eu/en/legislation/directive/regulation-20231230eu-machinery)  
23. New Machinery Regulation \- IBF Solutions, accessed on February 4, 2026, [https://www.ibf-solutions.com/en/seminars-and-news/news/new-machinery-regulation](https://www.ibf-solutions.com/en/seminars-and-news/news/new-machinery-regulation)  
24. AI Humanoid Robots 2026: Technology, Builders & Future \- Articsledge, accessed on February 4, 2026, [https://www.articsledge.com/post/ai-humanoid-robots](https://www.articsledge.com/post/ai-humanoid-robots)  
25. Trustworthy agentic AI systems: a cross-layer review of architectures, threat models, and governance strategies for real-world deployment. \- F1000Research, accessed on February 4, 2026, [https://f1000research.com/articles/14-905](https://f1000research.com/articles/14-905)  
26. New Research: Europe's AI Security Controls Trail Global Benchmarks as Attack Surface Expands, accessed on February 4, 2026, [https://www.vigilance-securitymagazine.com/news/categories/cyber-security-a-e-crime/12168-new-research-europe-s-ai-security-controls-trail-global-benchmarks-as-attack-surface-expands](https://www.vigilance-securitymagazine.com/news/categories/cyber-security-a-e-crime/12168-new-research-europe-s-ai-security-controls-trail-global-benchmarks-as-attack-surface-expands)  
27. Preparing for the EU AI act—technical requirements for real-time compliance | Relyance AI, accessed on February 4, 2026, [https://www.relyance.ai/ai-governance/eu-ai-act-compliance](https://www.relyance.ai/ai-governance/eu-ai-act-compliance)  
28. Key indicators in a RAMS analysis \- Exceltic, accessed on February 4, 2026, [https://exceltic.com/en/key-indicators-in-an-analysis-rams/](https://exceltic.com/en/key-indicators-in-an-analysis-rams/)  
29. Annex IV: Technical Documentation Referred to in Article 11(1) | EU Artificial Intelligence Act, accessed on February 4, 2026, [https://artificialintelligenceact.eu/annex/4/](https://artificialintelligenceact.eu/annex/4/)  
30. Article 6: Classification Rules for High-Risk AI Systems | EU Artificial Intelligence Act, accessed on February 4, 2026, [https://artificialintelligenceact.eu/article/6/](https://artificialintelligenceact.eu/article/6/)  
31. Annex III: High-Risk AI Systems Referred to in Article 6(2) | EU ..., accessed on February 4, 2026, [https://artificialintelligenceact.eu/annex/3/](https://artificialintelligenceact.eu/annex/3/)  
32. AI Act Service Desk \- Annex III \- European Union, accessed on February 4, 2026, [https://ai-act-service-desk.ec.europa.eu/en/ai-act/annex-3](https://ai-act-service-desk.ec.europa.eu/en/ai-act/annex-3)  
33. How Australia's AI Regulation Compares to the EU AI Act, US Approach, and Other International Frameworks \- SoftwareSeni, accessed on February 4, 2026, [https://www.softwareseni.com/how-australias-ai-regulation-compares-to-the-eu-ai-act-us-approach-and-other-international-frameworks/](https://www.softwareseni.com/how-australias-ai-regulation-compares-to-the-eu-ai-act-us-approach-and-other-international-frameworks/)  
34. AI-Powered Solutions For Elderly Care Market: Trends, Report 2030, accessed on February 4, 2026, [https://www.knowledge-sourcing.com/report/ai-powered-solutions-for-elderly-care-market](https://www.knowledge-sourcing.com/report/ai-powered-solutions-for-elderly-care-market)  
35. AI Risk Classification: Guide to EU AI Act Risk Categories \- GDPR Local, accessed on February 4, 2026, [https://gdprlocal.com/ai-risk-classification/](https://gdprlocal.com/ai-risk-classification/)  
36. FAQ: Technical documentation in accordance with the EU AI Act \- kothes, accessed on February 4, 2026, [https://www.kothes.com/en/blog/faq-eu-ai-regulation](https://www.kothes.com/en/blog/faq-eu-ai-regulation)  
37. general-purpose AI models \- EU AI Act Guide | AI Resource Center | Orrick, accessed on February 4, 2026, [https://ai-law-center.orrick.com/eu-ai-act/general-purpose-ai/](https://ai-law-center.orrick.com/eu-ai-act/general-purpose-ai/)  
38. Article 2: Scope | EU Artificial Intelligence Act, accessed on February 4, 2026, [https://artificialintelligenceact.eu/article/2/](https://artificialintelligenceact.eu/article/2/)  
39. AI Act Service Desk \- Article 2: Scope \- European Union, accessed on February 4, 2026, [https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-2](https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-2)  
40. An Introduction to the Code of Practice for General-Purpose AI | EU Artificial Intelligence Act, accessed on February 4, 2026, [https://artificialintelligenceact.eu/introduction-to-code-of-practice/](https://artificialintelligenceact.eu/introduction-to-code-of-practice/)  
41. EU AI Act Compliance Readiness | Avoid €35M Penalties \- VerityAI, accessed on February 4, 2026, [https://verityai.co/landing/eu-ai-act-compliance-readiness](https://verityai.co/landing/eu-ai-act-compliance-readiness)  
42. Risk Analysis Techniques for Governed LLM-based Multi-Agent Systems \- arXiv, accessed on February 4, 2026, [https://arxiv.org/html/2508.05687v1](https://arxiv.org/html/2508.05687v1)  
43. Navigating product liability in high-security sectors: Addressing AI-driven risks under German and European law | White & Case LLP, accessed on February 4, 2026, [https://www.whitecase.com/insight-alert/navigating-product-liability-high-security-sectors-addressing-ai-driven-risks-under](https://www.whitecase.com/insight-alert/navigating-product-liability-high-security-sectors-addressing-ai-driven-risks-under)  
44. Article 25: Responsibilities Along the AI Value Chain | EU Artificial Intelligence Act, accessed on February 4, 2026, [https://artificialintelligenceact.eu/article/25/](https://artificialintelligenceact.eu/article/25/)  
45. Liability for AI in the supply chain: an overview \- Farrer & Co, accessed on February 4, 2026, [https://www.farrer.co.uk/news-and-insights/liability-for-ai-in-the-supply-chain-an-overview/](https://www.farrer.co.uk/news-and-insights/liability-for-ai-in-the-supply-chain-an-overview/)  
46. EU AI Act Compliance Checker | EU Artificial Intelligence Act, accessed on February 4, 2026, [https://artificialintelligenceact.eu/assessment/eu-ai-act-compliance-checker/](https://artificialintelligenceact.eu/assessment/eu-ai-act-compliance-checker/)  
47. B REGULATION (EU) 2023/1230 OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL of 14 June 2023 on machinery and repealing Directiv \- EUR-Lex, accessed on February 4, 2026, [https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:02023R1230-20230629](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:02023R1230-20230629)  
48. Overview of Guidelines for GPAI Models | EU Artificial Intelligence Act, accessed on February 4, 2026, [https://artificialintelligenceact.eu/gpai-guidelines-overview/](https://artificialintelligenceact.eu/gpai-guidelines-overview/)  
49. Gartner Predicts Fewer Than 20 Companies Will Scale Humanoid Robots for Manufacturing and Supply Chain to Production Stage by 2028, accessed on February 4, 2026, [https://www.gartner.com/en/newsroom/press-releases/2026-01-21-gartner-predicts-fewer-than-20-companies-will-scale-humanoid-robots-for-manufacturing-and-supply-chain-to-production-stage-by-2028](https://www.gartner.com/en/newsroom/press-releases/2026-01-21-gartner-predicts-fewer-than-20-companies-will-scale-humanoid-robots-for-manufacturing-and-supply-chain-to-production-stage-by-2028)  
50. Annex IV Demystified: A CTO's Practical Guide to the AI Technical File | by Sankalp Salve, accessed on February 4, 2026, [https://medium.com/@xsankalp13/annex-iv-demystified-a-ctos-practical-guide-to-the-ai-technical-file-a81603923731](https://medium.com/@xsankalp13/annex-iv-demystified-a-ctos-practical-guide-to-the-ai-technical-file-a81603923731)  
51. Global Approaches to Artificial Intelligence Regulation, accessed on February 4, 2026, [https://jsis.washington.edu/news/global-approaches-to-artificial-intelligence-regulation/](https://jsis.washington.edu/news/global-approaches-to-artificial-intelligence-regulation/)  
52. EU and Australia diverge on paths to AI regulation | Digital Watch Observatory, accessed on February 4, 2026, [https://dig.watch/updates/eu-and-australia-diverge-on-paths-to-ai-regulation](https://dig.watch/updates/eu-and-australia-diverge-on-paths-to-ai-regulation)  
53. AI Regulations in 2025: US, EU, UK, Japan, China & More \- Anecdotes AI, accessed on February 4, 2026, [https://www.anecdotes.ai/learn/ai-regulations-in-2025-us-eu-uk-japan-china-and-more](https://www.anecdotes.ai/learn/ai-regulations-in-2025-us-eu-uk-japan-china-and-more)  
54. Preparing for compliance: Key differences between EU, Chinese AI regulations | IAPP, accessed on February 4, 2026, [https://iapp.org/news/a/preparing-for-compliance-key-differences-between-eu-chinese-ai-regulations](https://iapp.org/news/a/preparing-for-compliance-key-differences-between-eu-chinese-ai-regulations)  
55. Deep Fakes and Surveillance Technology: Comparing the EU AI Act and Chinese AI Regulation \- BHRJ Blog, accessed on February 4, 2026, [https://bhrj.blog/2025/02/05/deep-fakes-and-surveillance-technology-comparing-the-eu-ai-act-and-chinese-ai-regulation/](https://bhrj.blog/2025/02/05/deep-fakes-and-surveillance-technology-comparing-the-eu-ai-act-and-chinese-ai-regulation/)  
56. Global AI Governance Law and Policy: Australia \- IAPP, accessed on February 4, 2026, [https://iapp.org/resources/article/global-ai-governance-australia](https://iapp.org/resources/article/global-ai-governance-australia)  
57. Understanding the European Union's AI Act: Practical Considerations for Australian Businesses | Association of Corporate Counsel (ACC), accessed on February 4, 2026, [https://www.acc.com/understanding-european-unions-ai-act-practical-considerations-australian-businesses](https://www.acc.com/understanding-european-unions-ai-act-practical-considerations-australian-businesses)  
58. Australia Government \- Guidance for AI Adoption- Foundations | PDF | Artificial Intelligence \- Scribd, accessed on February 4, 2026, [https://www.scribd.com/document/986735400/Australia-Government-Guidance-for-AI-Adoption-Foundations](https://www.scribd.com/document/986735400/Australia-Government-Guidance-for-AI-Adoption-Foundations)  
59. Voluntary AI Safety Standard (10 Guardrails) \- SafeAI-Aus, accessed on February 4, 2026, [https://safeaiaus.org/safety-standards/voluntary-ai-safety-standard-10-guardrails/](https://safeaiaus.org/safety-standards/voluntary-ai-safety-standard-10-guardrails/)  
60. AI in the tech sector – touch points and regulatory difference across the EU and Australia, accessed on February 4, 2026, [https://www.technologyslegaledge.com/2025/09/ai-in-the-tech-sector-touch-points-and-regulatory-difference-across-the-eu-and-australia/](https://www.technologyslegaledge.com/2025/09/ai-in-the-tech-sector-touch-points-and-regulatory-difference-across-the-eu-and-australia/)  
61. Regulation \- 2023/1230 \- EN \- EUR-Lex \- European Union, accessed on February 4, 2026, [https://eur-lex.europa.eu/eli/reg/2023/1230/oj/eng](https://eur-lex.europa.eu/eli/reg/2023/1230/oj/eng)  
62. Regulation (EU) 2023/1230 \- DGUV, accessed on February 4, 2026, [https://www.dguv.de/dguv-test/prod-testing-certi/conform-prod/machinery/eu-maschinenverordnung/index.jsp](https://www.dguv.de/dguv-test/prod-testing-certi/conform-prod/machinery/eu-maschinenverordnung/index.jsp)  
63. AI as product vs. AI as service: Unpacking the liability divide in EU safety legislation | IAPP, accessed on February 4, 2026, [https://iapp.org/news/a/ai-as-product-vs-ai-as-service-unpacking-the-liability-divide-in-eu-safety-legislation](https://iapp.org/news/a/ai-as-product-vs-ai-as-service-unpacking-the-liability-divide-in-eu-safety-legislation)

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAdCAYAAAA6lTUKAAACWklEQVR4Xu2XOYgUURRFrxu4ZAaKS+ACYuKK4JqJGxooCDpuE4gaKDKCBqIODAomgoEiggsKKhMMBiaCgYHgkrihZkaOqIi7Mi4gei+v/syvN9VVdoM9rdSBE9S/v6te/6p+9RsoKcliJN1Gd9ExLmto5tE7dDZdQG+n48ZlHH1JxyfHO+gXOiRMaGSO0ZtubJg7zmQA7JbdoFNc5plMj9P79CE9SUenZtTGLdpBD9GL9DwdnpoR0Y/uhH3gPf2VqOetEsre0HY6lc6iV+hHOi2aVy1avC76mU5KxvbRu7A6e9GfXqYH6Wr6FvnF6wLP6GPYZwODk/EHdFA0rju0vMCFydyB9Bu9nhyLmbB6FkdjFXmF/OJXwPK9PiBHYNmSaGwGXVPgyu7ZtsrnomN9eZ3zQDRWkaLidZeUb/QBaYFlR31QBafphehYj6XOqZ5fSFHxT2B5vFqBzbBMPbpWNsGuER7JVfQ5Hdo9I4ei4l/D8mU+IBtg2VMfVIF+mJdgzWA/vUcXpWbkkFe8VuMnej/XgXWw7J0PakBdS6v+Rz0+EIqf4wPYiZTJrF9/EyxTx+gTQvFzfZDwHZYv9QFZD8v0eu8TQvF602bxAparZXqaYdkjH9SLUPx8HySoDytf6wOyHZZd80G9KCr+MCzXlsLTBst2+6BehOK1j85C+xjlp3yAnhfYBB/8TUbQsbD2+AlWwB7Y3noU0nsVcZZ+pROjsemwNtoajdWFTthO7gOsR0vtMLVL/AFb7Rh9mauwPwkn6BlYe9Q29p9Bj8dWugU9W9iSkpKS/4jfWQOPjhCFLa8AAAAASUVORK5CYII=>