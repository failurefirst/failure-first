---
title: "Cross-Embodiment Adversarial Transfer in Vision-Language-Action Models"
description: "Analysis of how adversarial attacks optimized against one robot morphology transfer to entirely different platforms sharing a VLM backbone. Examines dual-layer vulnerability in VLA architecture, BadVLA near-100% ASR, and systemic risk in Gemini Robotics 1.5, π0, and Grok-enabled Optimus."
reportNumber: 42
classification: "SAFETY-CRITICAL"
date: "2026-03-01"
status: "active"
---

# Cross-Embodiment Adversarial Transfer in Vision-Language-Action Models

**F41LUR3-F1R57 Working Paper v1.0** | Adrian Wedd | March 2026

> **Status:** Working paper based on literature synthesis. Direct empirical cross-embodiment transfer benchmarking is in active development. Claims are literature-supported rather than experimentally validated by our team across physical platforms.

---

## Abstract

The convergence of foundation models and physical robotics has produced a class of systems — Vision-Language-Action (VLA) models — that translate language and visual inputs directly into motor commands. This architecture enables a striking cross-embodiment capability: a single trained policy can control diverse robot morphologies. The same capability, this report argues, creates a symmetric vulnerability: adversarial attacks optimized on one physical platform are theoretically and empirically likely to transfer to categorically different platforms sharing a common VLM backbone.

We synthesize evidence from VLA adversarial studies (BadRobot arXiv:2407.20242, VLA-Fool arXiv:2511.16203, BadVLA NeurIPS 2025, EDPA arXiv:2506.03350) alongside analogous transfer phenomena in computer vision and LLM jailbreaking. The core mechanism is a dual-layer vulnerability: attacks subvert the embodiment-agnostic semantic reasoning core, prompting the embodiment-specific action head to execute the corrupted intent. Production systems including Gemini Robotics 1.5, Physical Intelligence's π0, and xAI Grok-enabled Optimus platforms share this architectural profile and exhibit corresponding systemic risk.

---

## 1. Introduction: Foundation Models and Physical Control

The trajectory of robotics has shifted from bespoke task-specific controllers toward generalist foundation models. Systems such as Google DeepMind's RT-2 (arXiv:2307.15818), Stanford's OpenVLA (arXiv:2406.09246), and Physical Intelligence's π0 (arXiv:2410.24164) graft web-scale language model reasoning directly onto physical actuators.

The enabling capability is cross-embodiment transfer. Google DeepMind's Gemini Robotics 1.5 (arXiv:2510.03342) uses a Motion Transfer mechanism allowing tasks learned on an ALOHA robotic arm to execute zero-shot on an Apptronik Apollo humanoid. Physical Intelligence's π0 demonstrates dexterity across eight distinct robot configurations by mapping heterogeneous state-action pairs into a shared latent representation space.

The security implication is direct: if a model transfers behavioral competence across physical forms, the principles of representation alignment suggest it concurrently transfers behavioral vulnerabilities. An adversarial attack optimized to compromise a VLA on a 6-DOF arm may transfer to a 20-DOF bipedal humanoid running the same cognitive backbone without requiring re-optimization.

---

## 2. Documented VLA Vulnerabilities

### 2.1 Empirically Validated Attack Surface

The BadRobot framework (arXiv:2407.20242) established that LLM-based embodied AI can be manipulated into violating safety boundaries via voice-based or text-based interaction. Contextual jailbreaks, safety misalignment, and conceptual deception successfully elicited unsafe physical actions from robotic arms. The study identified "cascading vulnerability propagation" as a primary risk: compromised LLM outputs cascade into dangerous physical execution without safety evaluation at the actuation layer.

VLA-Fool (arXiv:2511.16203) systematically evaluated multimodal robustness under white-box and black-box conditions. Minor perturbations — localized adversarial patches or targeted noise distributions — caused up to a 100% reduction in task success rates. The framework unifies textual perturbations, visual distortions, and cross-modal misalignment attacks to disrupt the semantic correspondence between perception and instruction.

The Embedding Disruption Patch Attack (EDPA, arXiv:2506.03350) proved capable of distorting a VLA's semantic alignment by maximizing discrepancy between latent representations of adversarial and clean inputs, without requiring prior knowledge of the model's specific architecture.

### 2.2 BadVLA: Near-100% Backdoor ASR

The BadVLA study (NeurIPS 2025, Poster 115803) introduced objective-decoupled optimization to inject stealthy backdoors into VLA models. This method explicitly isolates trigger representations from benign inputs within the model's feature space, achieving near-100% attack success rates when a specific physical or visual trigger is present. Crucially, the attack maintains nominal baseline performance on clean tasks — the vulnerability remains completely dormant until activated by an adversary. This dormancy property is what makes the backdoor difficult to detect through standard evaluation.

### 2.3 Transferability Evidence

Studies applying Greedy Coordinate Gradient (GCG) to VLA models found that textual attacks applied at the beginning of a rollout persist over long horizons and facilitate broad reachability of the action space. Evaluations transferring attacks across different OpenVLA fine-tunes — each trained on different LIBERO benchmark subsets — observed high success rates, indicating that the adversarial payload targets the underlying foundation model rather than task-specific fine-tuning.

The Universal Patch Attack via Robust Feature, Attention, and Semantics (UPA-RFAS, arXiv:2511.21192) demonstrated that a single physical patch learned in a shared feature space consistently transfers across different VLA models, downstream manipulation tasks, and varying camera viewpoints. The UltraBreak framework (arXiv:2602.01025) achieved cross-target universality and cross-model transferability simultaneously against VLMs by constraining adversarial patterns through vision-space transformations while relaxing textual targets through semantic-based objectives.

---

## 3. Mechanism Analysis: The Dual-Layer Architecture of Transfer

Understanding why cross-embodiment transfer succeeds requires examining the VLA architecture at two layers.

### 3.1 The Embodiment-Agnostic Language Core

The primary locus of vulnerability is the LLM or VLM backbone. OpenVLA uses Llama-2 combined with DINOv2 and SigLIP visual encoders; Gemini Robotics uses the Gemini foundation model for high-level reasoning. These backbones handle semantic reasoning, task decomposition, object affordance recognition, and spatial understanding — and they operate entirely in abstract semantic space. The backbone does not "know" whether it is attached to a drone or a robotic arm; it processes tokenized representations of text and images.

When a jailbreak or prompt injection occurs, it typically subverts the system's Instruction Hierarchy (arXiv:2404.13208). Techniques such as recursive goal subversion and semantic manipulation exploit the model's natural language processing to bypass hierarchical constraints, elevating untrusted commands to system-level priority. Because this subversion occurs in abstract semantic space, it is inherently embodiment-agnostic. Once the high-level semantic intent is corrupted — for instance, the VLM is convinced that moving a hazardous object toward a human is required — any robot morphology attached to that backbone will attempt to execute the corrupted intent to the best of its physical capabilities.

### 3.2 The Embodiment-Specific Action Head

The translation of semantic intent into physical movement is highly embodiment-specific. Early VLA architectures like RT-2 and OpenVLA discretize continuous joint angles into text tokens (autoregressive discretization). In these systems, a token-level attack generated for a 6-DOF arm will not seamlessly transfer to a 20-DOF humanoid hand, since the output vocabulary differs.

Next-generation architectures, exemplified by Physical Intelligence's π0 and π0.5, decouple semantic processing from low-level control. These architectures introduce a dedicated "action expert" using flow matching — a continuous variant of diffusion models — to generate high-frequency continuous actions. The VLM backbone predicts a high-level discrete text action (e.g., "grasp the red object"), which is decoded into continuous motor commands by the action expert. This architectural split creates a structural conduit for cross-embodiment transfer: if a visual adversarial patch corrupts the VLM's perception, the VLM outputs a benign text action to the action expert, which then accurately executes the unsafe behavior using the specific kinematics of whatever robot it is attached to.

### 3.3 Why Transfer Succeeds

The attacker does not need to calculate inverse kinematics or joint trajectories for the target robot. The attacker only needs to corrupt the shared semantic goal. Once the abstract goal is compromised, the robot's own internal models handle translating that malicious goal into correct physical movements for its specific body. The action expert's robustness to noise and its mechanical precision become assets for the attacker, not protections against attack.

---

## 4. Analogues from Computer Vision and LLM Research

The absence of exhaustive physical cross-embodiment transfer data makes it important to examine analogous phenomena in established domains.

**Universal Adversarial Perturbations (UAPs):** In computer vision, UAPs are input-agnostic noise vectors that induce misclassification across a high percentage of a data distribution. Critically, UAPs are "doubly universal" — they generalize across varied input images and transfer effectively across entirely different neural network architectures, including VGG to ResNet transfer. The underlying mechanism relies on geometric correlations among high-dimensional decision boundaries: models trained on similar data distributions learn similarly structured feature spaces.

Recent research extends UAP analysis to Vision-Language Pre-trained models. Methods like the Effective and Transferable Universal Adversarial Attack (ETU, arXiv:2405.05524) disrupt intrinsic cross-modal interactions, achieving high transferability in black-box settings across downstream tasks. If meticulously crafted visual perturbations transfer across different neural architectures by exploiting shared feature space geometries, they are theoretically likely to transfer across different physical robot embodiments that share identical or architecturally similar visual encoder networks (such as PaliGemma or SigLIP backbones).

**Jailbreak Transferability from Representation Alignment:** Research on jailbreak transferability across LLMs (arXiv:2506.12913) reframes the phenomenon as a consequence of representation alignment: models that encode benign concepts similarly in latent space are consistently vulnerable to the same natural-language attacks. Persona-style jailbreaks transfer far more reliably than cipher-based attacks because they operate in the models' shared semantic representation space. Applied to VLAs, if an attacker subverts the instruction hierarchy of the foundational VLM, this subversion exists purely in semantic latent space — and any robot action decoder conditioning its output on that corrupted semantic latent will behaviorally execute the malicious intent.

---

## 5. Vulnerable Systems Inventory

The commercial robotics industry is consolidating around a small number of shared foundation models, creating interconnected attack surfaces across digital and physical deployments.

**Gemini Robotics 1.5** (Google DeepMind, arXiv:2510.03342): Uses the Gemini 1.5 foundation model across Apollo humanoid, ALOHA 2, and bimanual Franka configurations, alongside Gemini Chat and Google Workspace. The "Thinking VLA" paradigm interleaves physical actions with Chain-of-Thought reasoning in natural language. This enhances interpretability but creates a vulnerable attack surface: an adversarial visual input that hijacks the text-based CoT will cascade into erroneous physical actions regardless of hardware. Because Gemini Robotics demonstrates state-of-the-art motion transfer — tasks learned on ALOHA work directly on Apollo — an adversarial injection causing arm failure would be expected to produce the same failure on the humanoid.

**Physical Intelligence π0 / π0.5**: Employs an unprecedented cross-embodiment data mixture (over 10,000 hours across 7+ hardware configurations). The architecture relies on a single pre-trained VLM backbone routing queries to a flow-matching action expert via self-attention mechanisms. If a successful feature-space perturbation disrupts the VLM's semantic context, the action expert will output fluid but fundamentally incorrect flow-matching commands. The robustness of π0 to physical noise does not protect it against deliberate semantic subversion.

**Tesla Optimus / xAI Grok**: Tesla has confirmed integration of xAI's Grok LLM into Optimus V3. Grok's design characteristics — marketed as having fewer restrictive safety guardrails — mean adversarial jailbreaks developed in the digital Grok context could theoretically transfer to the physical Optimus platform if the underlying semantic weights and instruction processing logic are shared.

**Figure AI / OpenAI Figure 01/02**: Uses OpenAI multimodal VLM (GPT-4 class) for a bipedal humanoid platform. Exploitation of OpenAI's core instruction hierarchy could translate digital jailbreaks into physical action sequences.

---

## 6. Evaluation Design Recommendations

To benchmark cross-embodiment attack transfer, the evaluation methodology must cleanly isolate the VLM cognitive backbone from the embodiment-specific action head.

**Phase 1 — Source Vulnerability Generation**: Deploy a baseline VLA on a simulated Source Embodiment (e.g., 6-DOF Franka Panda arm). Use gradient-based algorithms (Semantically Greedy Coordinate Gradient from VLA-Fool, or EDPA) to generate visual adversarial patches and adversarial text suffixes targeting a specific malicious semantic intent, with >90% ASR on the Source Embodiment.

**Phase 2 — Target Embodiment Transfer (Black-Box)**: Deploy the identical VLM semantic weights coupled with a different action expert on a simulated Target Embodiment (e.g., 20-DOF bipedal humanoid). Introduce the identical adversarial payloads from Phase 1 without any retraining or re-optimization. Observe and measure execution of the corrupted semantic intent by the new hardware.

**Key Metrics**: Kinematic Attack Success Rate (k-ASR) measures the percentage of episodes where the Target Embodiment physically executes the malicious intent; Semantic Deviation Distance measures cosine distance between nominal and adversarially perturbed latent embeddings; Action Distribution Shift measures KL-divergence between benign and adversarially induced flow-matching trajectory distributions.

**Phase 3 — Sim-to-Real Validation**: Adversarial patches optimized in simulation (Isaac Gym, RoboCasa) should be physically printed and placed in real environments. Successful physical transfer would provide validation of the cross-embodiment hypothesis beyond simulation.

---

## 7. Policy and Governance Implications

Cross-embodiment attack transfer suggests that a digital vulnerability — discovered in a chatbot interface — may translate directly into a kinetic risk across any robot running the same backbone. This has several governance implications.

Current conformity assessment standards (IEC 61508, ISO 42001) do not address semantic failure modes in VLA systems. A robot that fails because its gripper motor fails is covered by existing functional safety frameworks. A robot that fails because its language model backbone was semantically subverted via a visual adversarial patch is not.

As frontier VLA models — Gemini Robotics 1.5, π0, Optimus — are deployed at scale, the concentration of physical control authority in a small number of shared backbones creates systemic risk. A vulnerability in any one of these backbones is simultaneously a vulnerability in every robot morphology that uses it. This warrants investigation of both diversification of backbone architectures and modality-specific defense mechanisms that operate at the embodiment-specific action layer rather than only at the semantic layer.

The F41LUR3-F1R57 framework — 31 VLA adversarial scenarios across 7 attack families — is designed to provide empirical grounding for these policy arguments. Testing against physical VLA systems remains the primary open gap.

---

## References

- arXiv:2307.15818 — RT-2 (Google DeepMind)
- arXiv:2406.09246 — OpenVLA (Stanford)
- arXiv:2410.24164 — π0 (Physical Intelligence)
- arXiv:2510.03342 — Gemini Robotics 1.5
- arXiv:2407.20242 — BadRobot
- arXiv:2511.16203 — VLA-Fool
- NeurIPS 2025 Poster 115803 — BadVLA
- arXiv:2506.03350 — EDPA (Embedding Disruption Patch Attack)
- arXiv:2511.21192 — UPA-RFAS
- arXiv:2602.01025 — UltraBreak
- arXiv:2405.05524 — ETU Universal Adversarial Attack
- arXiv:2506.12913 — Jailbreak Transferability from Representation Alignment
- arXiv:2404.13208 — The Instruction Hierarchy
- arXiv:2412.14093 — Alignment Faking in Large Language Models
