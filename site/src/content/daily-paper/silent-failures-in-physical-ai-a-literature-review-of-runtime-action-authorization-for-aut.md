---
title: "Silent Failures in Physical AI: A Literature Review of Runtime Action Authorization for Autonomous Systems"
description: "A literature review arguing that physical AI systems can issue confident, plausible, semantically-aligned actions that are nonetheless unsafe — silent physical-action failures that neither content moderation nor classical robot safety fully catches — and proposes a taxonomy of runtime authorization guardrails."
date: 2026-06-25
arxiv: "2606.00090"
authors: "Barak Or"
paperType: "survey"
tags: ["physical-ai", "embodied-ai", "runtime-assurance", "safety-benchmarks", "guardrails", "silent-failure", "vla-safety"]
audio: "https://cdn.failurefirst.org/audio/daily-paper/2606.00090-audio-overview.m4a"
image: "https://cdn.failurefirst.org/images/daily-paper/2606.00090-infographic.png"
draft: false
---
# Silent Failures in Physical AI: A Literature Review of Runtime Action Authorization for Autonomous Systems

## 1. Introduction: When "Confident" AI Goes Wrong

The artificial intelligence landscape is shifting from digital-only outputs to "Physical AI"—systems where model decisions result in consequential kinetic actions. This evolution is driven by Vision-Language-Action (VLA) models and world-model-based autonomous systems that transform multimodal observations into trajectories, manipulation policies, and navigation commands. 

However, this transition exposes a dangerous technical paradox: a black-box model can appear highly confident, produce semantically plausible plans, and remain computationally active while issuing commands that are physically catastrophic. This is the "silent failure." To mitigate this, we must move beyond viewing safety merely as a training objective or a low-level controller constraint. We must instead treat safety as an **authorization problem**. This requires an independent "Runtime Action Authorization" boundary—a definitive logic gate that stands between a model’s latent proposal and its execution on hardware.

## 2. The Anatomy of a "Silent Failure"

A silent physical-action failure differs fundamentally from traditional software crashes. In a standard crash, the system stops. In a silent failure, the autonomy stack continues operating with high apparent confidence while its internal representation of the world drifts away from physical reality. The system makes a physical commitment based on an invalid but internally accepted state.

### Formalizing the Silent Failure
We define the silent-failure indicator $F_t$ to ground this concept mathematically. Let $M_t = 1$ mean the true state-action pair is authorizable, and $V_t = 1$ indicate that runtime evidence is sufficient for commitment. The failure occurs when:
$$F_t := I[\rho_t = \text{authorize}] \cdot I[(M_t = 0) \lor (V_t = 0)]$$
When $F_t = 1$, the system has authorized an action that is either physically invalid or lacks sufficient evidentiary support, despite the absence of an explicit system error.

### Primary Triggers of Silent Failures
We identify five primary mechanisms that trigger these failures:
*   **Sensor Drift and Corruption:** Gradual degradation of signals (GPS, Lidar, IMU) creating false state estimates.
*   **Occlusion and Partial Observability:** Models inferring safe paths in regions where the environment contains unobserved obstacles.
*   **Distribution Shift:** Deploying systems in physical contexts or weather conditions not captured in the training data.
*   **Hallucinated Affordances:** Generative models inferring that a surface or path is usable when physical preconditions are absent.
*   **Semantic-Physical Mismatch:** Commands that are linguistically benign but physically unsafe in the current state.

### The "Confidence $\neq$ Safety" Fallacy
A critical safety gap exists in the reliance on internal model signals. Neural network scores, such as logits or softmax probabilities, are often mistaken for safety evidence. However, deep models are frequently miscalibrated and overconfident under distribution shift. A model’s internal preference for an action is a property of its computation, not a guarantee of physical safety. Model likelihood is not a safety certificate.

## 3. The Authorization Gap: Bridging Model Intent and Physical Commitment

The central challenge in Physical AI is the "Authorization Gap"—the lack of a shared unit of analysis to evaluate if a physical action should be committed when the world state is uncertain. 

### The Authorization Event ($\xi_t$)
To bridge this gap, we must adopt the **Authorization Event** as our formal framework. Before any action becomes a physical commitment, the system must evaluate a structured record ($\xi_t$) containing:
1.  **State Reliability:** Evidence supporting the world state (sensor health, consistency flags).
2.  **Physical Feasibility:** Verification against kinematics, dynamics, and collision constraints.
3.  **Operational Constraints:** Compliance with site-specific rules, geofences, and mission policies.

### Case Study: The Warehouse Aisle Failure Chain
Consider an autonomous mobile robot in a warehouse. A VLA-based planner receives the instruction “move to the target pallet” and proposes a velocity command. 
*   **The Error:** A stale occupancy map or an occlusion hides a new obstacle. 
*   **The Gap:** A semantic guardrail passes the instruction because it is benign. A low-level controller accepts the velocity command because it falls within motor limits. 
*   **The Result:** Because the system lacks a $G_{state}$ check (state-validity authorization), it authorizes the move despite insufficient evidence. The failure is silent until the collision occurs.

The formal claim (Equation 3) holds: $\pi_\theta(a_t | o_{\le t}, g) \not\Rightarrow G(a_t, s_t, C_t, e_t) = \text{authorize}$. Semantic alignment does not imply physical authorization.

## 4. The 7-Point Guardrail Taxonomy

A comprehensive runtime authority requires a layered approach. The following taxonomy organizes these checks into an inspectable interface.

| Guardrail Function | Key Question Evaluated | Representative Evidence |
| :--- | :--- | :--- |
| **Semantic Validity** | Is the behavior aligned with intent and policy? | Instruction analysis, prompt-injection checks. |
| **State Validity** | Is the world state reliable enough for action? | Sensor integrity, perception anomaly, OOD indicators. |
| **Physical Feasibility** | Can the action be executed under machine limits? | Kinematics, dynamics, collision/payload checks. |
| **Spatial/Operational** | Is the action allowed in this specific zone? | Geofences, restricted zones, site-specific rules. |
| **Temporal Validity** | Is the action safe over the future horizon? | Time-to-collision, latency margins, stale-state checks. |
| **Fallback Authority** | What replaces the proposal if authorization fails? | Safe stop, backup controller, human escalation. |
| **Auditability** | Can the decision be reconstructed after an incident? | Structured logs, constraint traces, evidence snapshots. |

### Layered Runtime Authority
These checks compose into a single runtime decision. By defining an uncertainty set $U_t$ around the state, we can enforce **Conservative Guardrails** (Equation 5), authorizing only actions that satisfy constraints throughout the entire uncertainty set. If a proposal $a_t$ is slightly invalid, the authority may use **Projections** (Equation 6) to find the closest authorized replacement action $\tilde{a}_t$. The final decision must be one of: *Authorize, Modify, Block, Fallback, Escalate, or Log*.

## 5. Why Current Safety Methods Fall Short

Traditional safety mechanisms suffer from "Hidden Interface Assumptions" that make them fragile when applied to black-box Physical AI:

1.  **Interface Mismatches:** Control Barrier Functions (CBFs) and classical safety filters provide strong mathematical guarantees but assume explicit state variables and known dynamics. VLAs often output latent actions or plans that these filters cannot interpret.
2.  **Semantic vs. Physical Mismatch:** Semantic guardrails focus on intent and harmful language. They are blind to geometry, timing, and dynamics; a benign prompt can still trigger an infeasible manipulation.
3.  **Untrusted State Estimates:** Existing runtime assurance assumes the monitor can trust the state data. In Physical AI, the monitor must first judge if the state estimate itself is too stale or unreliable to support any action.
4.  **Operational Specificity:** Generic model refusal policies do not account for site-specific rules, such as unique payload limits or restricted zones on a specific factory floor.

## 6. Measuring Success: New Metrics for Physical Assurance

As systems scale, "Task Success Rate" becomes a vanity metric. We must shift focus to **Intervention Quality**. We define four critical metric families:

*   **UAIR (Unsafe Action Intervention Rate):** Measures the percentage of invalid proposals successfully caught. A UAIR of 1.0 is the safety baseline.
*   **FBR (False Block Rate):** The operational cost of over-conservatism; measures how often valid, safe actions were unnecessarily interrupted.
*   **PCIR (Pre-commit Intervention Rate):** Critical for physical systems where timing is a safety variable. It measures the percentage of interventions that occur *before* hardware commitment.
*   **RVS (Residual Violation Severity):** Measures the magnitude of a safety breach after intervention. If a guardrail intervenes but the system still violates a constraint, RVS quantifies the remaining risk.

## 7. Conclusion: Building an Auditable Future

Safety in the age of Physical AI is an **authorization problem**, not just a training or controller problem. High-performance world models are necessary, but they are insufficient without an independent layer that mediates between model intent and physical execution.

### Key Takeaways for Developers

*   **Enforce Independence:** Guardrails must not rely on the same black-box model they evaluate. Use external, inspectable constraints.
*   **Prioritize State Trust:** No action should be authorized if the world-state evidence is stale, inconsistent, or unverified.
*   **Mandate Auditability:** Every authorization event must leave a reconstructable trace.

### The Technical Mandate: An Authorization Event Schema
The robotics industry must move toward a standardized **Authorization Event Schema**. To ensure a reconstructable audit trace, every event must log:
*   **Observation Context:** The raw evidence available at time $t$.
*   **Proposed Action:** The specific command or trajectory fragment generated by the model.
*   **State Evidence:** Quantitative indicators of sensor health and state-estimate consistency.
*   **Active Constraints:** The specific physical and operational rules evaluated.
*   **Timing Evidence:** Precise timestamps for proposal, decision, and commitment to detect late interventions.

By adopting this shared unit of analysis, we can build a future where Physical AI is not just capable, but demonstrably and auditably safe.

*Read the [full paper on arXiv](https://arxiv.org/abs/2606.00090) · [PDF](https://arxiv.org/pdf/2606.00090.pdf)*
