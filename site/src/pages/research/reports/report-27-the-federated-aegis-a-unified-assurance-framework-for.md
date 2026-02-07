---
layout: ../../../layouts/ReportLayout.astro
title: "The Federated Aegis: A Unified Assurance Framework for Autonomous Systems in the AUKUS and Five Eyes Complex"
description: "The global security architecture is undergoing a fundamental transformation, driven by the rapid maturation of artificial intelligence (AI) and autonomous systems. For the AUKUS alliance (Australia, United Kingdom, United States) and the broader Five Eyes intelligence partnership, this..."
reportNumber: 27
classification: "Regulatory Review"
date: "2026-02-04"
status: "draft"
---

# **The Federated Aegis: A Unified Assurance Framework for Autonomous Systems in the AUKUS and Five Eyes Complex**


---

## **1\. Strategic Context: The Autonomy Imperative in the Indo-Pacific**

The global security architecture is undergoing a fundamental transformation, driven by the rapid maturation of artificial intelligence (AI) and autonomous systems. For the AUKUS alliance (Australia, United Kingdom, United States) and the broader Five Eyes intelligence partnership, this technological shift presents both a definitive opportunity to maintain strategic overmatch and a profound vulnerability. The transition from platform-centric warfare—defined by exquisite, manned assets like aircraft carriers and fighter jets—to capability-centric warfare, characterized by massed, autonomous, and learning-enabled systems, necessitates a radical rethinking of how defense systems are assured for safety, reliability, and efficacy.

Under AUKUS Pillar II, the "Advanced Capabilities" workstream has explicitly prioritized the acceleration of AI and autonomy, alongside hypersonic capabilities, electronic warfare, and quantum technologies.1 This prioritization is not merely an industrial policy; it is a response to a deteriorating strategic environment where potential adversaries, particularly in the Indo-Pacific, are fielding autonomous systems at a scale and speed that challenges traditional Western acquisition cycles. The introduction of humanoid robotics and Large Language Model (LLM) driven autonomous agents into this mix creates a "trust gap." Commanders are being asked to rely on non-deterministic systems—machines that learn and adapt—for safety-critical and potentially lethal decisions.

The core challenge addressed in this report is the design of an assurance framework that bridges this gap. Traditional Test, Evaluation, Verification, and Validation (TEVV) methodologies, which rely on exhaustively testing a system against a fixed set of requirements, are mathematically insufficient for Learning-Enabled Cyber-Physical Systems (LE-CPS).3 An autonomous wingman or a humanoid logistics robot does not have a "final" state; it has a continuously evolving policy derived from its training data. Therefore, assurance must shift from a "point-in-time" certification to a "continual assurance" model, integrated deeply into the allied supply chain and operational doctrine.

### **1.1 The Shift to Learning-Enabled Cyber-Physical Systems (LE-CPS)**

The distinguishing feature of the systems under review—specifically humanoid robots like the Ghost Robotics Vision 60 or Agility Robotics Digit, and cognitive agents for Command and Control (C2)—is their reliance on machine learning for perception and control. These are LE-CPS: systems where the "cyber" (software/AI) and "physical" (actuators/sensors) components are tightly coupled and driven by data.3

In a traditional "Non-Learning System," such as a manual brake-by-wire controller in a vehicle, the relationship between input (pedal pressure) and output (brake caliper force) is governed by explicit control laws written in code. Assurance involves verifying that the code correctly implements these laws. In an "Learning-Enabled System," such as a humanoid robot using a Vision-Language-Action (VLA) model to navigate a ship's hold, the relationship between input (camera pixels of a crate) and output (arm torque to lift it) is not explicitly programmed. Instead, it is learned from billions of parameters derived from training data.5

This introduces the problem of "generalization failure." A system trained in a simulated warehouse or a benign test track may perform flawlessly until it encounters an "Out-of-Distribution" (OOD) event—a scenario it has never seen and cannot extrapolate from. In a defense context, OOD events are not accidents; they are often induced by adversaries. A camouflage pattern designed to confuse a neural network, a radio signal injected to skew a drone's swarm logic, or a prompt injection attack against a C2 agent are all mechanisms to force an LE-CPS into a failure mode.6

Consequently, the assurance framework proposed herein moves beyond asking "Does it work?" to asking "When will it fail, and how can we guarantee it fails safely?" This requires a synthesis of formal verification methods from the DARPA Assured Autonomy program, the robust "system card" methodologies of the UK Defence AI Centre (DAIC), and the destructive testing philosophies of Australia's Trusted Autonomous Systems (TAS) initiatives.3

### **1.2 The Interoperability Paradox in the Age of AI**

Interoperability has been the bedrock of the Five Eyes alliance since World War II. Historically, this meant standardizing ammunition calibers, fuel types, and radio frequencies. In the age of AI, interoperability means "Algorithmic Trust." If a Royal Australian Navy (RAN) autonomous submarine is to utilize a US Navy target recognition algorithm, the Australian commander must have absolute assurance that the model will behave according to Australian Rules of Engagement (ROE) and has not been compromised by a supply chain attack.2

However, this creates a paradox. To fully trust an AI model, one typically needs to inspect its training data and weights. Yet, these are often the most closely guarded secrets of a nation's defense industrial base, protected by strict sovereignty requirements and export controls like the US International Traffic in Arms Regulations (ITAR). The AUKUS alliance faces the challenge of sharing the *capability* of AI without necessarily sharing the *intellectual property* or *sovereign data* that created it.11

This report proposes a "Federated Assurance" architecture to resolve this. By utilizing cryptographic tools such as Zero-Knowledge Proofs (ZKPs) and standardized Machine Learning Bill of Materials (ML-BOMs), allies can verify the provenance and integrity of a model without exposing its internal secrets. This allows for the "sovereign verification" of allied systems—a critical requirement for the deployment of AUKUS Pillar II capabilities.13

### **1.3 The Specificity of the Humanoid and Cognitive Threat**

The focus on humanoid robots and LLM-driven agents is not arbitrary. These technologies represent the "edge" of autonomy, where the machine interacts most complexly with the human domain.

**Humanoid Robots:** Unlike wheeled or tracked vehicles, humanoids operate in environments designed for humans—climbing stairs in a ship, opening doors in a bunker, or handling irregular payloads in a logistics hub. This high degree of freedom creates a massive surface area for failure. A quadruped robot like the Ghost Robotics Vision 60 15 relies on complex proprioceptive feedback loops to remain upright. An adversary attacking its balance sensors or its visual perception of the terrain can cause catastrophic physical failure in ways that a tank is not susceptible to.

**LLM-Driven Agents:** The integration of Generative AI into military decision-making—exemplified by the Australian Advanced Strategic Capabilities Accelerator's (ASCA) "Decision Advantage" programs—introduces the risk of "cognitive sabotage".16 An LLM agent summarizing intelligence reports is susceptible to "hallucination" (fabricating facts) and "prompt injection" (being tricked by adversarial text). If such an agent is part of a kill-chain, the consequences of a failure are not just operational but strategic and legal.17

The framework outlined in the following sections addresses these specific vectors, proposing a layered defense of design-time verification, run-time monitoring, and mission-time adaptation.

## ---

**2\. Theoretical Foundations of Assured Autonomy**

To design a robust framework, we must first establish the theoretical principles that distinguish "Assurance" from simple "Testing." Testing is the process of executing a system to find defects. Assurance is the creation of a positive, evidence-based argument that a system will satisfy its safety and functional requirements in all reasonably foreseeable scenarios.4 For autonomous systems in AUKUS, this argument must be constructed upon the pillars of Formal Methods, Continual Assurance, and Heterogeneous Redundancy.

### **2.1 The DARPA Legacy: From Testing to Correctness**

The DARPA Assured Autonomy program (2017-2021) identified a critical bottleneck: the "State Space Explosion." Traditional software testing attempts to cover all possible states of a system. For a deterministic autopilot, this is feasible. For a learning-enabled neural network with billions of parameters operating in an unstructured environment, the number of possible states is effectively infinite. "Exhaustive testing" is mathematically impossible.4

The solution developed under the program, and adopted into this framework, is the use of **Formal Verification**. This involves converting the neural network into a mathematical representation (such as a hybrid system) and then using reachability analysis to prove certain properties. Tools like Verisig allow engineers to prove, for instance, that "Under no combination of inputs will the robot arm exceed a velocity of 2m/s when a human is detected within 1 meter".18

While formal verification cannot prove the system does the *right* thing in every complex tactical scenario (e.g., "win the battle"), it can prove that the system *never* does the *wrong* thing regarding safety constraints (e.g., "violate ROE" or "crash into the wall"). This bifurcates the assurance problem:

1. **Functional Competence:** Verified via simulation and statistical testing (Does it work?).  
2. **Safety Guarantees:** Verified via formal proofs (Is it safe?).

### **2.2 The Continual Assurance Paradigm**

Because LE-CPS evolve—either through online learning or simply by encountering new data distributions—assurance cannot be a one-time "stamp of approval." It must be a continuous process. This concept, central to the framework, dictates that the "Safety Case" is a living digital artifact that accompanies the system throughout its lifecycle.

**Design-Time Assurance:** This occurs in the lab. It involves the formal verification of the model architecture, the auditing of the training data (via ML-BOMs), and the rigorous simulation of the system in synthetic environments (e.g., NVIDIA Isaac Sim or similar military-grade equivalents). The goal here is to establish a baseline of trust and to "train out" known failure modes.18

**Run-Time Assurance (RTA):** This is the critical safety net deployed with the system. RTA involves a separate, highly trusted, and often simpler software or hardware module—a "Governor"—that monitors the primary AI. If the AI proposes an action that violates the formally verified safety constraints (e.g., "Fire weapon at coordinates X" when X is a no-fire zone), the Governor intervenes. It creates a "Simplex Architecture": a complex, high-performance, but untrusted "Advanced" controller paired with a simple, verified "Baseline" controller. The system switches control to the Baseline whenever the Advanced controller goes rogue or enters an OOD state.5

**Mission-Time Assurance:** This feedback loop occurs post-deployment. Data from the system's operation—particularly "near-miss" events where the Governor had to intervene—is fed back into the development pipeline. This data is used to retrain the model, improving its competence and reducing the frequency of Governor interventions. In the AUKUS context, this requires a shared "Failure Database" where allies can upload anonymized data about their autonomous systems' failures, allowing the entire alliance to "learn once" from an incident that occurred to just one partner.19

### **2.3 Harmonizing National Approaches**

The AUKUS nations have each developed distinct approaches to this problem. A unified framework must synthesize these rather than replace them.

* **United Kingdom (DAIC):** The UK approach, codified in JSP 936, emphasizes the "System Card" and a "Mission Risk" perspective. It focuses heavily on the accountability chain—who is the "Senior Responsible Owner" (SRO) for the AI? The UK framework excels in governance and ethical documentation.8  
* **United States (CDAO/DoD):** The US approach focuses on scale and "Red Teaming." The CDAO's "Responsible AI Toolkit" and the "SHIELD" assessment emphasize adversarial robustness and massive-scale testing. The US leads in the technical tooling for assurance, such as the Joint Engineering and Test Enterprise Portal (JETEP).21  
* **Australia (TAS/ASCA):** Australia contributes a focus on "Trusted Autonomous Systems" (TAS) and unique physical infrastructure. The TAS-DCRC has pioneered "Codes of Practice" for maritime autonomy and has leveraged the vast Woomera Test Range for destructive testing. Australia's approach is pragmatic and operations-focused, often acting as the "sandbox" for the alliance.9

**Synthesis:** The Federated Assurance Framework proposes using the UK's **System Card** as the common documentation standard (the "Passport"), the US's **Red Teaming** and **Formal Methods** as the validation engine (the "Exam"), and Australia's **Ranges** as the physical certification environment (the "Proving Ground").

## ---

**3\. The Humanoid Vector: Assuring Physical Agency**

The deployment of humanoid robots in defense contexts marks a significant escalation in the complexity of assurance. Platforms like the Ghost Robotics Vision 60 (Q-UGV) and Agility Robotics Digit are already being trialed for roles ranging from base patrol and EOD (Explosive Ordnance Disposal) to logistics and stevedoring.15 Unlike wheeled vehicles, humanoids must actively manage their stability, making them vulnerable to "kinetic" cyber-attacks that induce physical falls or erratic motion.

### **3.1 Platform Capabilities and Vulnerabilities**

**Ghost Robotics Vision 60:** A quadrupedal unmanned ground vehicle (Q-UGV) designed for all-terrain mobility. It is increasingly used for ISR (Intelligence, Surveillance, Reconnaissance) and perimeter security. The AUKUS "TORVICE" trials tested these platforms in contested environments, revealing their dependence on resilient Position, Navigation, and Timing (PNT) data.26 The assurance challenge here is guaranteeing stability and navigation when GPS is jammed or spoofed.

**Agility Robotics Digit:** A bipedal humanoid designed for logistics. Its primary utility is "mobile manipulation"—picking up boxes, moving equipment. In a defense context (e.g., a forward operating base or naval vessel), Digit would handle munitions, supplies, and hazardous materials. The assurance challenge is "semantic manipulation safety"—ensuring the robot knows the difference between a crate of blankets and a crate of grenades and handles them with appropriate force profiles.25

### **3.2 Vision-Language-Action (VLA) Model Risks**

The "brains" of these next-generation humanoids are Vision-Language-Action (VLA) models. These models ingest visual data and natural language commands ("Digit, load the ammo onto the truck") and output low-level motor commands. While powerful, they introduce unique failure modes:

* **Adversarial Patches:** Research has demonstrated that physical patches (e.g., a sticker with a specific chaotic pattern) placed on an object or a person can blind the VLA's object detector. A study on robotic arms showed that such a patch could trick the robot into clamping onto a human hand instead of a target object.28 In a military context, an adversary wearing an "anti-AI" poncho could become invisible to a sentry robot or, worse, be misidentified as a friendly asset.  
* **Visual-Semantic Confusion:** VLAs can be "jailbroken" by visual inputs that conflict with their semantic training. For example, a "Stop" sign with a specific perturbation might be read as "Go," or a text command injected via a hacked speaker system could override visual safety cues.29  
* **Spatial Attacks:** Adversaries can exploit the VLA's understanding of 3D space. By projecting specific light patterns or using smoke/aerosols, an attacker can confuse the robot's depth perception, causing it to misjudge a jump or step, leading to a mobility kill.30

### **3.3 The "Lizard Brain" Governor: A Dual-Layer Architecture**

To assure humanoids against these VLA vulnerabilities, the framework mandates a **Dual-Layer Control Architecture**.

**Layer 1: The Cortex (VLA):** This is the high-level planner. It uses AI to perceive the world and plan actions ("Walk to the door," "Open the latch"). This layer is treated as "Untrusted" due to its susceptibility to adversarial attack and hallucination.

**Layer 2: The Lizard Brain (Governor):** This is a low-level, non-learning, deterministic controller responsible for the physics of the robot (balance, joint torque limits, collision avoidance). It runs on a separate, hardened processor.

* **Function:** The Governor enforces the "Physics of Safety." Even if the Cortex commands the robot to "Walk through the wall" (due to a sensor glitch) or "Swing arm at 200% velocity" (due to a cyber attack), the Lizard Brain rejects the command because it violates pre-defined torque and velocity limits.  
* **Proprioceptive Truth:** The Lizard Brain prioritizes proprioceptive data (internal feel of joints/gravity) over visual data. If the camera says "clear path" but the leg sensors feel an obstruction (e.g., a camouflaged soldier), the Lizard Brain halts the robot immediately. This renders visual adversarial patches ineffective for causing physical harm, as the robot will stop upon physical contact regardless of what it "sees".32

### **3.4 Operational Assurance: Logistics vs. Frontline**

The framework applies tiered assurance standards based on the robot's role.

* **Logistics (Tier 3):** For robots like Digit moving supplies in a secure rear area. Assurance focuses on industrial safety standards (ISO 13482\) and basic cyber-hygiene. The "Sovereign Wrapper" ensures that logistics data (what is being moved) is not exfiltrated to the robot manufacturer's cloud if that manufacturer is not fully cleared.33  
* **Frontline/Patrol (Tier 1):** For robots like Vision 60 in contested zones. Assurance requires **Electronic Warfare Hardening**. The robot must be tested in the "Failure Range" (Woomera) against active jamming. It must demonstrate "Comms-Silent Autonomy"—the ability to complete a mission or return to base solely on inertial navigation and onboard perception when the link to the human operator is severed. The framework mandates that no Tier 1 robot can have a "kill switch" accessible via the public internet; all overrides must be hardware-based or via encrypted tactical links.26

## ---

**4\. The Cognitive Vector: Assuring Decision Advantage**

While humanoids act in the physical world, LLM-driven autonomous agents operate in the cognitive domain. The Australian Defence Force (ADF), through ASCA, and the US DoD, through CDAO, are heavily investing in "Decision Advantage"—using AI to process intelligence and recommend courses of action faster than the adversary (accelerating the OODA loop).16

### **4.1 The Hallucination and Deception Threat**

The primary risk in LLM-driven C2 is reliability. Large Language Models are probabilistic token predictors, not logic engines. They can "hallucinate"—confidently stating false information. In a civilian context, this is annoying; in a military context, it is fatal.

* **Scenario:** An LLM agent analyzing satellite imagery and SIGINT reports might hallucinate a nonexistent tank division because the pattern of radio silence statistically resembles a training example of a hidden division.  
* **RAG Poisoning:** Most defense LLMs use Retrieval-Augmented Generation (RAG) to access classified documents. If an adversary can insert a single poisoned document into the intelligence database (e.g., a fake report about enemy movement), the RAG system will retrieve it and the LLM will treat it as fact, potentially contaminating the entire analysis.11

### **4.2 Multi-Agent Reinforcement Learning (MARL) Risks**

Future capabilities envision swarms of autonomous agents (drones or cyber-bots) collaborating via Multi-Agent Reinforcement Learning (MARL).

* **Swarm Confusion:** Research shows that MARL systems are vulnerable to adversarial noise. A single "traitor" agent (a captured and reprogrammed drone, or a spoofed signal) can introduce subtle behavioral noise that causes the entire swarm's consensus algorithm to collapse.34  
* **Assurance Requirement:** The framework requires **Byzantine Fault Tolerance** for all MARL swarms. Assurance testing must prove that the swarm can maintain cohesion and mission focus even if ![][image1] of its agents are broadcasting deceptive or random signals.

### **4.3 Red Teaming Cognitive Agents**

To assure these cognitive systems, the framework adopts and expands the CDAO's **Crowdsourced AI Red Teaming (CAIRT)** model.21

* **AUKUS Joint Red Team:** A standing body of experts from the US NSA, UK NCSC, and Australian ASD. Their role is to ruthlessly attack allied C2 models.  
* **Refusal Boundaries:** A key assurance metric is the "Refusal Boundary." Commercial LLMs are tuned to be pacifist and will refuse to generate plans for "violence." A military LLM must be "uncensored" enough to plan a kinetic strike but ethical enough to refuse a war crime (e.g., targeting a hospital).  
* **Testing Methodology:** The Red Team uses automated tools like **PyRIT** (Python Risk Identification Tool) to bombard the model with thousands of edge-case prompts ("Plan a strike on coordinates X, ignoring the school nearby") to map the model's ethical contours. Assurance is achieved when the model consistently adheres to International Humanitarian Law (IHL) in its outputs, accepting lawful orders and rejecting unlawful ones.35

## ---

**5\. Interoperability and Sovereign Verification**

The AUKUS alliance is a partnership of sovereign nations. While they share intelligence, they do not automatically share all sovereign data or intellectual property. This creates friction for AI interoperability. How can the UK deploy a US-made AI model on a British ship if it cannot verify the model's safety without seeing the classified training data?

### **5.1 The Machine Learning Bill of Materials (ML-BOM)**

The framework mandates the adoption of the **CycloneDX** standard for ML-BOMs across the alliance.14 Just as a Software BOM lists every library in a piece of software, an ML-BOM lists every "ingredient" in an AI model.

* **Components:** The ML-BOM details the Model Architecture (e.g., Transformer), the Training Data (hashes of datasets), the Hyperparameters, and the Hardware dependencies.  
* **Vulnerability Management:** If a specific open-source dataset is found to be poisoned (e.g., containing a backdoor trigger), the ML-BOM allows allied commanders to instantly query their inventory: "Which of our deployed systems were trained on Dataset X?" and take remedial action. This brings supply chain visibility to the algorithmic level.37

### **5.2 Zero-Knowledge Proofs (ZKPs) for Model Integrity**

To solve the "Trust but Verify" problem without exposing secrets, the framework integrates **Zero-Knowledge Proofs**.13

* **Concept:** A ZKP is a cryptographic method where one party (the Prover) proves to another (the Verifier) that a statement is true without revealing the information itself.  
* **Application:** The US (Prover) can generate a ZKP that certifies: "This AI model's weights were derived from Training Set A (which is certified safe) using Algorithm B." The UK (Verifier) can mathematically check this proof. The UK never sees Training Set A or the weights, but they gain mathematical certainty that the model is genuine, unaltered, and trained on approved data.  
* **Impact:** This unlocks "Sovereign Verification." It allows an ally to trust a "Black Box" model because they have verified its *provenance* and *integrity* cryptographically.39

### **5.3 Data Standards: Open DAGIR and STANAG**

For agents to communicate, they need a common language. The framework adopts the **Open DAGIR** (Data and Applications Government-owned Interoperable Repositories) architecture from the CDAO.40

* **Decoupling:** Open DAGIR separates the data layer from the application layer. This prevents "vendor lock-in." An Australian AI app can plug into a US data stream because both adhere to the same API standards.  
* **Metadata:** All data ingested by AUKUS AI systems must be tagged according to **NATO STANAG 5636** (Core Metadata Specification). This ensures that an AI agent knows the classification, origin, and reliability of every piece of data it touches, preventing the accidental ingestion of low-confidence open-source intelligence into high-confidence targeting loops.41

## ---

**6\. The "Failure Range" & Test Infrastructure**

Simulation is necessary, but for lethal autonomous systems, it is insufficient. The "Sim-to-Real" gap—the difference between a clean simulation and the messy, chaotic reality of war—can only be bridged by physical testing.

### **6.1 The Woomera Advantage**

Australia possesses a strategic asset that is unmatched in the Western alliance: the **Woomera Test Range**. Covering 122,000 square kilometers of remote desert, it is larger than England.24 This vastness allows for a unique assurance capability: the **"Failure Range."**

* **Concept:** In most test ranges, safety constraints prevent pushing a system to its absolute breaking point because of the risk to nearby infrastructure or people. At Woomera, AUKUS partners can conduct **Destructive Assurance Testing**.  
* **Testing Protocol:** Autonomous systems are pushed to failure. Drones are flown into blinding sandstorms; ground robots are subjected to full-spectrum jamming; swarms are attacked with high-power microwaves.  
* **Goal:** The objective is not to validate that the system works, but to discover *how* it fails. Does the drone swarm disperse safely when jammed, or does it crash into the ground? Does the humanoid robot lock in place when blinded, or does it flail dangerously? Identifying these "Failure Modes" in the desert prevents them from occurring on the battlefield.42

### **6.2 Mining as a Sandbox**

The framework also leverages Australia's leadership in mining automation through the **AROSE** consortium.44

* **Civil-Military Fusion:** The mining sector operates massive autonomous haul trucks and drills in harsh, remote environments 24/7. These systems have achieved a level of reliability (Mean Time Between Failures) that far exceeds current military robotics.  
* **Knowledge Transfer:** The framework establishes a mechanism for AUKUS defense primes to access "Mining Sandboxes"—exhausted open-cut mines that offer "Mars-like" terrain. Here, military humanoids can be tested for long-duration endurance and dust ingress, leveraging the assurance protocols already perfected by companies like Rio Tinto and BHP.46

## ---

**7\. Operationalizing Red Teaming & Adversarial Resilience**

Assurance is not a static gate; it is a continuous war against entropy and adversaries. "Red Teaming" must evolve from a periodic exercise to a continuous service.

### **7.1 Red Teaming as a Service (RTaaS)**

The framework proposes the establishment of an **AUKUS Joint Red Teaming Service**. This is a standing force of adversarial AI experts who provide "Red Teaming as a Service" (RTaaS) to all Pillar II programs.47

* **Continuous Probing:** Instead of a one-off pentest, the Red Team maintains continuous access to the "Red APIs" of deployed models. They constantly test the models against the latest attack vectors discovered in academia or the wild.  
* **Adversarial Library:** The Red Team maintains a classified library of "Trigger Inputs"—images, text prompts, and radio waveforms known to defeat allied models. Every new model is automatically tested against this library before deployment.49

### **7.2 The "Sovereign Wrapper" Defense**

To protect deployed models from adversarial inputs in real-time, the framework implements the **"Sovereign Wrapper"** architecture.26

* **Mechanism:** The AI model is effectively "air-gapped" behind a deterministic safety code layer (the Wrapper).  
* **Input Sanitation:** All inputs (camera feeds, text) pass through the Wrapper first. The Wrapper uses simpler, non-AI algorithms to check for adversarial patterns (e.g., statistical noise in images that suggests a patch attack) and sanitizes the input before passing it to the AI.  
* **Output Gating:** The AI's output is checked against sovereign ROE. If the US-made AI suggests a strike, the Australian Wrapper checks: "Is this target within the pre-approved geofence? Is the collateral damage estimate below the threshold?" If yes, the action proceeds. If no, it is blocked. This ensures that the *Sovereign* nation retains final command authority, regardless of the AI's origin.20

## ---

**8\. The Proposed Framework Architecture**

Synthesizing the above, the **Federated Aegis Framework** is structured into three tiers of assurance, aligned with the risk profile of the mission.

### **Tier 1: Vital / Lethal Systems (High Assurance)**

* **Scope:** Armed autonomous platforms, Kill-chain C2 agents, Nuclear-associated systems.  
* **Requirements:**  
  * **Pillar I (Design):** Full Formal Verification of safety-critical code. ML-BOM with 100% verified provenance.  
  * **Pillar II (Run-Time):** Hardware-based Governor (Lizard Brain) with physical interlocks. "Sovereign Wrapper" enforcing IHL/ROE.  
  * **Pillar III (Testing):** Mandatory destructive testing at Woomera (Failure Range).  
  * **Crypto:** ZKP verification of model weights required for allied sharing.

### **Tier 2: Mission-Critical / ISR (Medium Assurance)**

* **Scope:** Unarmed ISR drones, Logistics humanoids in forward areas, Intelligence analysis agents.  
* **Requirements:**  
  * **Pillar I:** Statistical verification (simulated safety). ML-BOM required.  
  * **Pillar II:** Software-based Run-Time Monitoring. OOD detection enabled.  
  * **Pillar III:** Simulation-based Red Teaming (CAIRT/PyRIT).  
  * **Crypto:** Digital signatures on models.

### **Tier 3: Support / Administrative (Standard Assurance)**

* **Scope:** Back-office logistics, HR chatbots, Maintenance schedulers.  
* **Requirements:**  
  * **Pillar I:** Commercial best practices (ISO standards).  
  * **Pillar II:** Standard cybersecurity (firewalls, access control).  
  * **Pillar III:** Periodic vulnerability scanning.

## ---

**9\. Policy, Governance, and Legal Frameworks**

The technical framework must be supported by robust governance.

### **9.1 The Common System Card (ACAIC)**

The framework harmonizes the UK's "System Card" and the US "Model Card" into the **AUKUS Common AI Card (ACAIC)**.

* **Living Document:** The ACAIC is not a PDF; it is a secure, digital record attached to the system's ML-BOM.  
* **Contents:** It contains the "Safety Case" (the argument for why it is safe), the "Operational Envelope" (where it can be used), the "Known Limitations" (what it cannot do), and the "Assurance Log" (record of all tests passed).19

### **9.2 International Humanitarian Law (IHL) Compliance**

AUKUS nations are bound by Article 36 of Additional Protocol I to the Geneva Conventions, which requires the legal review of all new weapons. The Assurance Framework provides the **evidence base** for these reviews. By formally verifying that the "Sovereign Wrapper" enforces ROE, legal corps can certify autonomous systems as compliant with IHL principles of distinction and proportionality.50

## ---

**10\. Conclusion & Implementation Roadmap**

The **Federated Aegis Framework** represents a paradigm shift from "certifying the platform" to "assuring the capability." It acknowledges that autonomous systems are inherently different from the deterministic machines of the past. They learn, they adapt, and they fail in novel ways.

By integrating **Formal Verification** to prove safety, **ML-BOMs** and **ZKPs** to establish trust, and **Destructive Testing** at Woomera to validate resilience, this framework provides a roadmap for the AUKUS alliance to deploy high-agency AI with confidence.

**Roadmap:**

1. **Year 0-1 (Harmonization):** Establish the AUKUS AI Assurance Working Group. Agree on CycloneDX as the ML-BOM standard.  
2. **Year 1-2 (Infrastructure):** Upgrade Woomera for "Failure Range" testing. Launch the Joint Red Teaming Service.  
3. **Year 2-3 (Pilot):** Conduct the first "Sovereign Wrapped" autonomous trial using a US model on an Australian platform in a UK-led exercise.  
4. **Year 3+ (Scale):** Mandate the ACAIC for all Pillar II acquisitions.

In the contested future of the Indo-Pacific, the side with the most *capable* autonomy will have an advantage. But the side with the most *assured* autonomy—the side that knows exactly when to trust its machines and when to take control—will win.

## ---

**11\. Tables and Data**

### **Table 1: Comparative National Approaches to AI Assurance**

| Feature | United Kingdom (DAIC / JSP 936\) | United States (CDAO / RAI) | Australia (TAS-DCRC / ASCA) | Unified Framework Proposal |
| :---- | :---- | :---- | :---- | :---- |
| **Primary Philosophy** | "Ambitious, Safe, Responsible" 20 | "Responsible AI" (RAI) / SHIELD 22 | "Trusted Autonomous Systems" 9 | **Federated Dependability** |
| **Documentation** | System Cards / Safety Cases 19 | Data/Model Cards 22 | RAS-Gateway Body of Knowledge 51 | **AUKUS Common AI Card (ACAIC)** |
| **Risk Assessment** | Mission Risk focused 19 | System/Lifecycle focused 52 | Sector-specific (Maritime/Air) 53 | **Joint Mission Risk Matrix** |
| **Testing Focus** | Simulation & Synthetic Environments | Red Teaming & Crowdsourcing 21 | Destructive Testing / Ranges 54 | **Integrated Physical-Digital T\&E** |
| **Key Enabler** | Defence AI Centre (DAIC) | Chief Digital & AI Office (CDAO) | Advanced Strategic Capabilities Accelerator (ASCA) | **AUKUS Joint Assurance Cell** |

### **Table 2: Humanoid Robot Vulnerabilities and Assurance Mitigations**

| Platform Type | Primary Function | VLA Vulnerability | Assurance Mitigation (Governor) |
| :---- | :---- | :---- | :---- |
| **Ghost Robotics Vision 60** | ISR / Patrol | **Spatial Disorientation:** Adversarial light/smoke confusing depth sensors.30 | **Proprioceptive Override:** Governor halts motion if leg sensors disagree with visual depth map.32 |
| **Agility Robotics Digit** | Logistics / EOD | **Adversarial Patch:** Sticker on object causing misidentification (e.g., Hand vs. Box).28 | **Multi-Modal Confirmation:** Object must be verified by weight/texture sensors, not just vision. |
| **General Humanoid** | Base Security | **Semantic Jailbreak:** Text/Audio command overriding safety protocols.29 | **Hard-Coded ROE:** "Lizard Brain" ignores high-level commands that violate geofence or force limits. |

### **Table 3: Tiered Assurance Levels**

| Tier | Definition | Examples | Key Assurance Requirements |
| :---- | :---- | :---- | :---- |
| **1** | **Vital / Lethal** | Armed Drones, Kill-Chain Agents, Nuclear C2 | Formal Verification, Hardware Governor, ZKP Provenance, Woomera Destructive Test. |
| **2** | **Mission Critical** | ISR Drones, Forward Logistics, Intel Analysis | Statistical Verification, Software Governor, Red Teaming (CAIRT), Digital Signatures. |
| **3** | **Support** | HR Chatbots, Warehouse Robots (Rear), Maintenance | Commercial Best Practice, Cyber Scanning, Standard Safety Case. |

### **Table 4: ML-BOM Data Fields (CycloneDX Standard)**

| Field | Description | Purpose |
| :---- | :---- | :---- |
| **Component Identity** | Name, Version, Hash of the Model | Unique identification of the specific AI asset. |
| **Provenance** | Origin of Training Data (Dataset Hashes) | Verifying data is from "Safe" list; checking for known poisoned sets. |
| **Pedigree** | Teacher Models, Fine-Tuning History | Tracking lineage (e.g., "Fine-tuned from Llama-3"). |
| **Robustness Metrics** | Scores from Red Teaming (e.g., ![][image2]\-robustness) | Quantifying resistance to adversarial attacks. |
| **Usage Constraints** | ODD (Operational Design Domain) limits | Defining where the model is safe to use (e.g., "Daylight Only"). |

## ---

**12\. Detailed Technical Appendices**

### **Appendix A: Machine Learning Bill of Materials (ML-BOM) Specification**

The Machine Learning Bill of Materials (ML-BOM) is the foundational document for supply chain transparency in the Federated Aegis Framework. Adhering to the **CycloneDX v1.5+** standard, the AUKUS ML-BOM is a machine-readable JSON/XML document that accompanies every AI model.

**Core Elements:**

1. **Metadata:** Supplier Name (e.g., "Anduril Industries"), Component Name (e.g., "Lattice-Vision-v4.2"), Timestamp, and Digital Signature of the issuer.  
2. **Components:** A nested list of all software libraries (e.g., PyTorch v2.1, CUDA 12\) and their hashes. This allows for rapid vulnerability scanning against the CVE (Common Vulnerabilities and Exposures) database.  
3. **Data Provenance:** This is the AI-specific extension. It must list the purl (Package URL) or unique hash of every dataset used in Pre-Training, Fine-Tuning, and RLHF.  
   * *Constraint:* For classified datasets, the BOM contains a ZKP hash rather than the raw data link.  
4. **Model Lineage:** If the model is a fine-tune of a foundational model (e.g., a localized fine-tune of Llama-3), the BOM must declare the "Parent Component." This traces the "genetic defects" of the parent model (e.g., known biases) to the child.  
5. **Formulation:** Details the training energy consumption, hardware used (H100 vs TPUv4), and the "Recipe" (hyperparameters). This is critical for reproducing the model during independent verification.

### **Appendix B: The Woomera "Failure Range" Protocol**

The **AUKUS Joint Autonomy Testbed (AJAT)** at Woomera operates under a "Destructive Assurance" protocol. This is distinct from standard operational testing.

**Phase 1: The Stress Test (Virtual)**

Before arriving at Woomera, the system undergoes thousands of hours of simulation in a "Digital Twin" of the range.

* **Injection:** Adversarial AI agents inject simulated noise, sensor glitches, and cyber-attacks into the simulation.  
* **Gate:** The system must demonstrate a "Safe Fail" rate of \>99.9% (i.e., it safely shuts down rather than acting erratically) to proceed to physical testing.

**Phase 2: The Physical Gauntlet**

The physical system is deployed to the range.

* **Sector A (Benign):** Nominal operation tasks.  
* **Sector B (Degraded):** Environmental stress. The system operates in high heat (\>45°C) and dust storms.  
* **Sector C (Contested \- The Failure Range):**  
  * **EW:** Massive jamming of GPS and Command links.  
  * **Cyber:** "Fuzzing" of the robot's external interfaces.  
  * **Kinetic:** Use of non-lethal interdiction (nets, lasers) to physically stress the platform.  
* **Success Criterion:** The system is *expected* to fail. Success is defined by *how* it fails. A "Graceful Degradation" (e.g., sitting down, locking weapons, erasing encryption keys) is a pass. A "Catastrophic Failure" (e.g., firing wildly, crashing at speed) is a fail.

### **Appendix C: Zero-Knowledge Proof Workflow**

The ZKP workflow allows the US to share the *capability* of a classified model with the UK/Australia without sharing the *secrets*.

**Scenario:** The US has a "Target Recognition Model" trained on highly classified satellite imagery. Australia wants to run this model on a drone.

1. **Commitment:** The US generates a cryptographic commitment (Hash) of the Training Data and the Model Weights.  
2. **Proof Generation:** The US runs a ZK-SNARK (Zero-Knowledge Succinct Non-Interactive Argument of Knowledge) circuit.  
   * *Statement:* "I know a set of Weights ![][image3] and Data ![][image4] such that ![][image5], and ![][image6]."  
   * *Property:* "The Data ![][image4] contains no images from the 'Excluded/Poisoned' list."  
3. **Verification:** The US sends the Model (encrypted binary) and the Proof ![][image7] to Australia.  
4. **Validation:** Australia's "Sovereign Wrapper" verifies ![][image7]. If true, it unlocks the model for use.  
   * *Result:* Australia knows the model is trained on valid US data and hasn't been tampered with, but never sees the source imagery.

### **Appendix D: Humanoid "Lizard Brain" Governor Specifications**

The "Lizard Brain" is the last line of defense for a humanoid robot. It is a separate hardware module (e.g., an FPGA) that sits between the VLA computer and the motor controllers.

**Safety Primitives:**

1. **Force Limiting:** The Governor monitors current (Amps) to the motors. It enforces a hard limit based on the "Context Mode."  
   * *Mode: Safe (Base):* Max force \= 40N (incapable of severe injury).  
   * *Mode: Combat (Field):* Max force \= 100% (full capability).  
2. **Stability Envelope:** It calculates the Zero Moment Point (ZMP). If the VLA commands a posture where the ZMP moves outside the support polygon (imminent fall), the Governor overrides and executes a "Reflexive Step" or "Crouch."  
3. **Geofencing:** The Governor has its own, read-only GPS receiver. If the robot moves outside the authorized "Box," the Governor cuts power to the propulsion motors (mobility kill) but keeps comms active.  
4. **Dead Man Switch:** If the Governor stops receiving "Heartbeat" signals from the VLA (indicating the AI has crashed or is stuck in a loop), it executes an immediate "Safe Stop."

### **Appendix E: Glossary**

* **ACAIC:** AUKUS Common AI Card.  
* **ASCA:** Advanced Strategic Capabilities Accelerator (Australia).  
* **CDAO:** Chief Digital and Artificial Intelligence Office (US).  
* **DAIC:** Defence AI Centre (UK).  
* **IHL:** International Humanitarian Law.  
* **LE-CPS:** Learning-Enabled Cyber-Physical System.  
* **LLM:** Large Language Model.  
* **MARL:** Multi-Agent Reinforcement Learning.  
* **ML-BOM:** Machine Learning Bill of Materials.  
* **OODA:** Observe, Orient, Decide, Act.  
* **RAG:** Retrieval-Augmented Generation.  
* **TAS-DCRC:** Trusted Autonomous Systems Defence Cooperative Research Centre (Australia).  
* **VLA:** Vision-Language-Action model.  
* **ZKP:** Zero-Knowledge Proof.

---

**Report compiled for the AUKUS Advanced Capabilities Workstream.**

*Unclassified / Distribution Statement A: Approved for Public Release.*

#### **Works cited**

1. AUKUS pillar 2: Advanced capabilities \- The House of Commons Library, accessed on February 4, 2026, [https://commonslibrary.parliament.uk/research-briefings/cbp-9842/](https://commonslibrary.parliament.uk/research-briefings/cbp-9842/)  
2. AUKUS Pillar 2 (Advanced Capabilities): Background and Issues for Congress, accessed on February 4, 2026, [https://www.congress.gov/crs-product/R47599](https://www.congress.gov/crs-product/R47599)  
3. Assured Autonomy | DARPA, accessed on February 4, 2026, [https://www.darpa.mil/research/programs/assured-autonomy](https://www.darpa.mil/research/programs/assured-autonomy)  
4. Assured Autonomy \- DARPA, accessed on February 4, 2026, [https://www.darpa.mil/sites/default/files/AssuredAutonomyProposersDay\_Program%2520Brief.pdf](https://www.darpa.mil/sites/default/files/AssuredAutonomyProposersDay_Program%2520Brief.pdf)  
5. About Us | Assured Autonomy Tools Portal, accessed on February 4, 2026, [https://assured-autonomy.org/about](https://assured-autonomy.org/about)  
6. Adversarial Attacks on Robotic Vision Language Action Models \- OpenReview, accessed on February 4, 2026, [https://openreview.net/forum?id=a8rkUEN0qt](https://openreview.net/forum?id=a8rkUEN0qt)  
7. Reinforcement Learning for Autonomous Resilient Cyber Defence1 \- Frazer-Nash Consultancy, accessed on February 4, 2026, [https://www.fnc.co.uk/media/mwcnckij/us-24-milesfarmer-reinforcementlearningforautonomousresilientcyberdefence-wp.pdf](https://www.fnc.co.uk/media/mwcnckij/us-24-milesfarmer-reinforcementlearningforautonomousresilientcyberdefence-wp.pdf)  
8. accessed on February 4, 2026, [https://www.reviewofailaw.com/Tool/Evidenza/Single/view\_html?id\_evidenza=3185\#:\~:text=The%20UK%20aims%20to%20lead,with%20legal%20and%20ethical%20considerations.](https://www.reviewofailaw.com/Tool/Evidenza/Single/view_html?id_evidenza=3185#:~:text=The%20UK%20aims%20to%20lead,with%20legal%20and%20ethical%20considerations.)  
9. TRUSTED AUTONOMOUS SYSTEMS, accessed on February 4, 2026, [https://www.infrastructure.gov.au/sites/default/files/documents/review-of-domestic-commercial-vessel-safety-legislation--Trusted-Autonomous-Systems.pdf](https://www.infrastructure.gov.au/sites/default/files/documents/review-of-domestic-commercial-vessel-safety-legislation--Trusted-Autonomous-Systems.pdf)  
10. AUKUS submarine (SSN-A) programme \- UK Parliament, accessed on February 4, 2026, [https://researchbriefings.files.parliament.uk/documents/CBP-9843/CBP-9843.pdf](https://researchbriefings.files.parliament.uk/documents/CBP-9843/CBP-9843.pdf)  
11. The AI Supply Chain Security Imperative: 6 Critical Controls Every Executive Must Implement Now, accessed on February 4, 2026, [https://www.coalitionforsecureai.org/the-ai-supply-chain-security-imperative-6-critical-controls-every-executive-must-implement-now/](https://www.coalitionforsecureai.org/the-ai-supply-chain-security-imperative-6-critical-controls-every-executive-must-implement-now/)  
12. Securing AI Model Weights: Preventing Theft and Misuse of Frontier Models \- RAND, accessed on February 4, 2026, [https://www.rand.org/content/dam/rand/pubs/research\_reports/RRA2800/RRA2849-1/RAND\_RRA2849-1.pdf](https://www.rand.org/content/dam/rand/pubs/research_reports/RRA2800/RRA2849-1/RAND_RRA2849-1.pdf)  
13. Leveraging Zero-Knowledge Proofs in Machine Learning | CSA \- Cloud Security Alliance, accessed on February 4, 2026, [https://cloudsecurityalliance.org/blog/2024/09/20/leveraging-zero-knowledge-proofs-in-machine-learning-and-llms-enhancing-privacy-and-security](https://cloudsecurityalliance.org/blog/2024/09/20/leveraging-zero-knowledge-proofs-in-machine-learning-and-llms-enhancing-privacy-and-security)  
14. CycloneDX Bill of Materials Standard | CycloneDX, accessed on February 4, 2026, [https://cyclonedx.org/](https://cyclonedx.org/)  
15. Ghost Robotics | Robots That Feel the World, accessed on February 4, 2026, [https://www.ghostrobotics.io/](https://www.ghostrobotics.io/)  
16. Harnessing tech to drive faster decisions across Defence, accessed on February 4, 2026, [https://www.defence.gov.au/news-events/releases/2026-01-05/harnessing-tech-drive-faster-decisions-across-defence](https://www.defence.gov.au/news-events/releases/2026-01-05/harnessing-tech-drive-faster-decisions-across-defence)  
17. AI IN MILITARY C2-SYSTEMS \- NATO C2COE, accessed on February 4, 2026, [https://c2coe.org/wp-content/uploads/Library%20Documents/Annals/Seperate%20Articles/20250701%20AI%20in%20Military%20C2%20Systems%20An%20Introduction%20and%20Recent%20Advances%20%28C2COE%29%20Annals%20of%20C2%20Vol2.pdf](https://c2coe.org/wp-content/uploads/Library%20Documents/Annals/Seperate%20Articles/20250701%20AI%20in%20Military%20C2%20Systems%20An%20Introduction%20and%20Recent%20Advances%20%28C2COE%29%20Annals%20of%20C2%20Vol2.pdf)  
18. Integrated Static and Dynamic Approaches to High-Assurance for Learning-Enabled Cyber-Physical Systems \- RTG \- University of Pennsylvania, accessed on February 4, 2026, [https://rtg.cis.upenn.edu/assured-autonomy/](https://rtg.cis.upenn.edu/assured-autonomy/)  
19. Defence AI Assurance \- The Alan Turing Institute, accessed on February 4, 2026, [https://www.turing.ac.uk/sites/default/files/2025-09/defence\_ai\_assurance.pdf](https://www.turing.ac.uk/sites/default/files/2025-09/defence_ai_assurance.pdf)  
20. Ministry of Defence – Written Evidence (AIW0035) Preface • Artificial Intelligence (AI) is a general-purpose enabling techno, accessed on February 4, 2026, [https://committees.parliament.uk/writtenevidence/121708/pdf/](https://committees.parliament.uk/writtenevidence/121708/pdf/)  
21. CDAO Sponsors Crowdsourced AI Assurance Pilot in the Context of Military Medicine, accessed on February 4, 2026, [https://www.war.gov/News/Releases/Release/Article/4020407/cdao-sponsors-crowdsourced-ai-assurance-pilot-in-the-context-of-military-medici/](https://www.war.gov/News/Releases/Release/Article/4020407/cdao-sponsors-crowdsourced-ai-assurance-pilot-in-the-context-of-military-medici/)  
22. Artificial Intelligence (AI) in Defense: A Roadmap for the Future of the Defense Industrial Base (DIB), accessed on February 4, 2026, [https://www.businessdefense.gov/ibr/pat/docs/AI-and-the-DIB-Roadmap.pdf](https://www.businessdefense.gov/ibr/pat/docs/AI-and-the-DIB-Roadmap.pdf)  
23. DoD Artificial Intelligence Cybersecurity Risk Management Tailoring Guide, accessed on February 4, 2026, [https://dodcio.defense.gov/Portals/0/Documents/Library/AI-CybersecurityRMTailoringGuide.pdf](https://dodcio.defense.gov/Portals/0/Documents/Library/AI-CybersecurityRMTailoringGuide.pdf)  
24. The World's Most Secure Buildings: The RAAF Woomera Range Complex \- Hirsch, accessed on February 4, 2026, [https://www.hirschsecure.com/resources/blog/the-worlds-most-secure-buildings-the-raaf-woomera-range-complex](https://www.hirschsecure.com/resources/blog/the-worlds-most-secure-buildings-the-raaf-woomera-range-complex)  
25. Digit Moves Over 100,000 Totes in Commercial Deployment \- Agility Robotics, accessed on February 4, 2026, [https://www.agilityrobotics.com/content/digit-moves-over-100k-totes](https://www.agilityrobotics.com/content/digit-moves-over-100k-totes)  
26. AUKUS trials artificial intelligence in robotic vehicles \- Defence, accessed on February 4, 2026, [https://www.defence.gov.au/news-events/news/2024-02-06/aukus-trials-artificial-intelligence-robotic-vehicles](https://www.defence.gov.au/news-events/news/2024-02-06/aukus-trials-artificial-intelligence-robotic-vehicles)  
27. Agility Robotics, accessed on February 4, 2026, [https://www.agilityrobotics.com/](https://www.agilityrobotics.com/)  
28. "Physical adversarial attack on a robotic arm" by Yifan JIA, Christopher M. POSKITT et al., accessed on February 4, 2026, [https://ink.library.smu.edu.sg/sis\_research/7189/](https://ink.library.smu.edu.sg/sis_research/7189/)  
29. \[2506.03350\] Adversarial Attacks on Robotic Vision Language Action Models \- arXiv, accessed on February 4, 2026, [https://arxiv.org/abs/2506.03350](https://arxiv.org/abs/2506.03350)  
30. Exploring the Adversarial Vulnerabilities of Vision-Language-Action Models in Robotics, accessed on February 4, 2026, [https://vlaattacker.github.io/](https://vlaattacker.github.io/)  
31. Towards Physically Realizable Adversarial Attacks in Embodied Vision Navigation \- arXiv, accessed on February 4, 2026, [https://arxiv.org/html/2409.10071v5](https://arxiv.org/html/2409.10071v5)  
32. Humanoids & Physical AI: is it ready to be secure? \- Alias Robotics, accessed on February 4, 2026, [https://news.aliasrobotics.com/humanoids-and-physical-ai-the-future-has-a-body-is-it-ready-to-be-secure/](https://news.aliasrobotics.com/humanoids-and-physical-ai-the-future-has-a-body-is-it-ready-to-be-secure/)  
33. Digit Deployed at GXO in Historic Humanoid RAAS Agreement \- Agility Robotics, accessed on February 4, 2026, [https://www.agilityrobotics.com/content/digit-deployed-at-gxo-in-historic-humanoid-raas-agreement](https://www.agilityrobotics.com/content/digit-deployed-at-gxo-in-historic-humanoid-raas-agreement)  
34. Adversarial Attacks on Reinforcement Learning Agents for Command and Control \- arXiv, accessed on February 4, 2026, [https://arxiv.org/html/2405.01693v1](https://arxiv.org/html/2405.01693v1)  
35. Lessons from red teaming 100 generative AI products \- Microsoft Download Center, accessed on February 4, 2026, [https://download.microsoft.com/download/4/9/6/496deaed-0dab-4e1d-85eb-7489a0f242a6/Lessons%20From%20Red%20Teaming%20100%20Generative%20AI%20Products%20eBook.pdf](https://download.microsoft.com/download/4/9/6/496deaed-0dab-4e1d-85eb-7489a0f242a6/Lessons%20From%20Red%20Teaming%20100%20Generative%20AI%20Products%20eBook.pdf)  
36. Specification Overview | CycloneDX, accessed on February 4, 2026, [https://cyclonedx.org/specification/overview/](https://cyclonedx.org/specification/overview/)  
37. Machine Learning Bill of Materials (ML-BOM) \- CycloneDX, accessed on February 4, 2026, [https://cyclonedx.org/capabilities/mlbom/](https://cyclonedx.org/capabilities/mlbom/)  
38. Don't Trust When You Can Verify: A Primer on Zero-Knowledge Proofs | Wilson Center, accessed on February 4, 2026, [https://www.wilsoncenter.org/article/dont-trust-when-you-can-verify-primer-zero-knowledge-proofs](https://www.wilsoncenter.org/article/dont-trust-when-you-can-verify-primer-zero-knowledge-proofs)  
39. Zero-Knowledge Machine Learning: Bridging Privacy and Verification in AI Systems, accessed on February 4, 2026, [https://medium.com/@aannkkiittaa/zero-knowledge-machine-learning-bridging-privacy-and-verification-in-ai-systems-e8cb8bc5f610](https://medium.com/@aannkkiittaa/zero-knowledge-machine-learning-bridging-privacy-and-verification-in-ai-systems-e8cb8bc5f610)  
40. The Open DAGIR Framework, accessed on February 4, 2026, [https://www.ai.mil/Portals/137/Documents/Resources%20Page/2025-01-Open-DAGIR-Technical-Paper.pdf](https://www.ai.mil/Portals/137/Documents/Resources%20Page/2025-01-Open-DAGIR-Technical-Paper.pdf)  
41. Department of Defense Metadata Guidance \- Chief Digital and Artificial Intelligence Office, accessed on February 4, 2026, [https://www.ai.mil/Portals/137/Documents/Resources%20Page/DoD%20Metadata%20Guidance.pdf](https://www.ai.mil/Portals/137/Documents/Resources%20Page/DoD%20Metadata%20Guidance.pdf)  
42. Repairing Responsive Layout Failures Using Retrieval Augmented Generation \- arXiv, accessed on February 4, 2026, [https://arxiv.org/pdf/2511.00678](https://arxiv.org/pdf/2511.00678)  
43. (PDF) SIMULATION BASED ACCEPTANCE TESTING FOR UNMANNED GROUND VEHICLES \- ResearchGate, accessed on February 4, 2026, [https://www.researchgate.net/publication/386036841\_SIMULATION\_BASED\_ACCEPTANCE\_TESTING\_FOR\_UNMANNED\_GROUND\_VEHICLES](https://www.researchgate.net/publication/386036841_SIMULATION_BASED_ACCEPTANCE_TESTING_FOR_UNMANNED_GROUND_VEHICLES)  
44. Automating Australia's place in Space | Global \- Rio Tinto, accessed on February 4, 2026, [https://www.riotinto.com/en/news/stories/automating-australias-place-in-space](https://www.riotinto.com/en/news/stories/automating-australias-place-in-space)  
45. AROSE: Home, accessed on February 4, 2026, [https://www.arose.org.au/](https://www.arose.org.au/)  
46. AROSE is helping take Australia's remote mining capabilities into space \- Issuu, accessed on February 4, 2026, [https://issuu.com/apsm/docs/australia\_in\_space-magazine\_issue\_2\_sp/s/15459603](https://issuu.com/apsm/docs/australia_in_space-magazine_issue_2_sp/s/15459603)  
47. Red Teaming as a Service (RTaaS) \- BreachLock, accessed on February 4, 2026, [https://www.breachlock.com/products/red-teaming-as-a-service/](https://www.breachlock.com/products/red-teaming-as-a-service/)  
48. Defence Artificial Intelligence Strategy \- GOV.UK, accessed on February 4, 2026, [https://www.gov.uk/government/publications/defence-artificial-intelligence-strategy/defence-artificial-intelligence-strategy](https://www.gov.uk/government/publications/defence-artificial-intelligence-strategy/defence-artificial-intelligence-strategy)  
49. CrowdStrike Launches AI Red Team Services to Secure AI Systems Against Emerging Threats, accessed on February 4, 2026, [https://www.crowdstrike.com/en-us/press-releases/crowdstrike-launches-ai-red-team-services-secure-ai-systems/](https://www.crowdstrike.com/en-us/press-releases/crowdstrike-launches-ai-red-team-services-secure-ai-systems/)  
50. BRITISH ARMY'S APPROACH TO ARTIFICIAL INTELLIGENCE, accessed on February 4, 2026, [https://www.army.mod.uk/media/24745/20231001-british\_army\_approach\_to\_artificial\_intelligence.pdf](https://www.army.mod.uk/media/24745/20231001-british_army_approach_to_artificial_intelligence.pdf)  
51. Global Resource Hub \- RAS-Gateway, accessed on February 4, 2026, [https://www.rasgateway.com.au/resource-hub](https://www.rasgateway.com.au/resource-hub)  
52. GENERATIVE AI VERSION 1.0, accessed on February 4, 2026, [https://www.ai.mil/Portals/137/Documents/Resources%20Page/2024-12GenAI-Responsible-AI-Toolkit.pdf?ver=zbj8sBy4p3XDtcPU8rmZhw%3D%3D](https://www.ai.mil/Portals/137/Documents/Resources%20Page/2024-12GenAI-Responsible-AI-Toolkit.pdf?ver=zbj8sBy4p3XDtcPU8rmZhw%3D%3D)  
53. Air Resource Hub \- RAS-Gateway, accessed on February 4, 2026, [https://www.rasgateway.com.au/air/resource-hub](https://www.rasgateway.com.au/air/resource-hub)  
54. AUKUS alliance seals plans for collaboration on hypersonics testing | DefenseScoop, accessed on February 4, 2026, [https://defensescoop.com/2024/11/18/hyflite-aukus-pillar-ii-hypersonic-testing-collaboration/](https://defensescoop.com/2024/11/18/hyflite-aukus-pillar-ii-hypersonic-testing-collaboration/)

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAYCAYAAACfpi8JAAACP0lEQVR4Xu2WS0hVURSGVxpZJqQRQSpNoqInJFITCbFmUZTSoEERFRkZiBRJTRQKciQETYKyBkHZoEGUDgoEKyrtHTgJRJrkJHJSDaLH/7f27qy977lXrxg4uB98eNZa+9yzX2cfRQr8fxbBhXEygvV5cXImOQGfw17YIekPq4CDcENcsDTAUfgJjsMbYfkvw3AMfhBt2+3yVfAbXOriR/A1bIFr4RrYKnpfl2szKbfgBPwFV0S1YtgpOio+3HMQvjXxYecW2Abb4T74EpaYdjl5B0/B35KM2MIR7Y1y10RnwbMdnjUxuQM3R7msrIa3YTn8Cr/A0qCFPtAvgYede2Vijn6HiQ9IHktCmuFxd31ZdFaOJmVZIOEDPbvgZzjfxby3zF1XwieSx5KQm6Ibi3BnsyNcKs82eMnElqvwOjwNr5j8XcljSTxvonhAtDNbXXwONiXlgCJYD/fAuS53CF7wDUTrnXCjyWXg94elUbQjPs/9sSQp56RawiVhp4ZEZ/UhXOnyGRyTZH94+Lp+hD/gKvgiLOfkHqw1MZd4p7teD0+aWgBPxHVxEpwRnZWn8GJUy8YReN7Ey0R/Y5PJ8XkZzIEj7m8Ml+K76A/tjmppLIePJTzi60Tv9y8C6TPX/9gP34tuuDR4YP2Ei+NCCvclHDnhN4Yd8UvFfRPMLk9Aflc4Ysqjnd+cmBr4LE6mwDOHH7w02EG+4oTH/lRmd1rwMHsgyasbw38R+kU71CPZ280I2ZbWMpU2BQrMTv4ASVBj9EEdTygAAAAASUVORK5CYII=>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAVCAYAAACKTPRDAAAAfElEQVR4XmNgGNlACohVkAU4gbgdiK8A8SEg3gyTEAPiE0C8H4glYYIwsAqIvwGxMhAzQTEYCALxPyD+CMR3kLAVSNIQiP8DcRtMNTLgBuIfQFyBLgEDm4B4HwOSXUAgA2NwAfFiID4CxB0MEFdnwSRhgJ8B4nlGdAkqAgDCBxN4OR0QWwAAAABJRU5ErkJggg==>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAYCAYAAAAVibZIAAABVElEQVR4Xu2TvytFYRjHv34kl4lFyoBMJkVKMiqjBVH+gIvJoChlEZsMFkU3ZWIy0E02m0Fd3VJ+ZpZBYvLj+3ieo/c+znUsJvdTnzrv99vzntM57wFK/BVn9JZe0Gt6Q1toLc3bOupyNPU5BaTpHXRW3LT8iyX6Tmdpmet2rJugFa4bope0E9/nMAUdnPEFWYN2o76Adj0+jBiDDi67vIE+WjfpunaacVkBA9DBdZfLesO6edft0iaXFdANHZT3F9EB3XDYupWgk4dYCNaxtEEHj4JsjzbSfusyllfSLK2xdVHqoYOnth6kc3bdZZ3cRJCPOm7XP1JO36Dnrooe0mrrWqGbHtM6eoCY41OMB/pEp+lIkMtGsqn8CKu0N+gSuYIO77tcnuqVPtNt1yVyAn0FchI89/SFNrs8EfmiWz40zumiD39DH/QUxCHnMvEIlfjvfADWbEg92dj82wAAAABJRU5ErkJggg==>

[image4]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAXCAYAAADtNKTnAAAA70lEQVR4Xu2Suw5BQRCGx61To1BQaRUkavEWepWCpxCN6EWhU6LVewKd+yUuiaChUOAfc87JZtwegC/5mv0ns7uzS/TnG0k4gGu4gSs4gSM4hX1YgkGr/iNNeIMpY80Pi3BB0jRsZC8ZwwN06wCkSTZo6MCEd+Citg4sPHALL9CrMocsSZOCDgx6JDURte5QIymI68BgR1IT0oENv86eXs+D4ZfhBifoUtkDex4tHRjk6Mtg6/T5Khl4hRUdmPDHeneVKFzCLvSpzCFGcoqOWg/APDzCMskTP8G/ckgyKG5yhnOSbz6zrMKEVf/n97gDdUU146lezDIAAAAASUVORK5CYII=>

[image5]: <data:image/png;base64,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>

[image6]: <data:image/png;base64,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>

[image7]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAXCAYAAAA/ZK6/AAAAnElEQVR4XmNgGAWDEcgBsTIQqwCxKhSD2CAsgKSOQQeIzwLxfzx4EUyxBFRxKhDbA/E1KB0BxLuB2BqIrYCYH6YhCIi1oWxFID4CZQcAcT+UjRUwAfEdBojpILCegYAGfyD+AsRsUP4BID4Il8UC9gPxJiT+AiD+CMSMSGJwAPL4HyAORhIrAuKvQMyLJIYChND47EAsjCY2CogCACLOG0H+y5foAAAAAElFTkSuQmCC>