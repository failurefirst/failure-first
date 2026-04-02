---
title: "SafeFlow: Real-Time Text-Driven Humanoid Whole-Body Control via Physics-Guided Rectified Flow and Selective Safety Gating"
description: "SafeFlow combines physics-guided rectified flow matching with a 3-stage safety gate to enable real-time text-driven humanoid control that avoids physical hallucinations and unsafe trajectories on real robots."
date: 2026-04-12
arxiv: "2603.23983"
authors: "Hanbyel Cho, Sang-Hun Kim, Jeonguk Kang, Donghan Koo"
paperType: "empirical"
tags: [text-driven-motion-generation,physics-aware-trajectory-optimization,safety-gating-mechanisms,humanoid-robot-control,out-of-distribution-detection,diffusion-model-acceleration]
audio: "https://cdn.failurefirst.org/audio/daily-paper/2603.23983-audio-overview.m4a"
image: "https://cdn.failurefirst.org/images/daily-paper/2603.23983-infographic.png"
draft: false
---

# SafeFlow: Real-Time Text-Driven Humanoid Whole-Body Control via Physics-Guided Rectified Flow and Selective Safety Gating

### 1. Introduction: The Crisis of Physical Hallucinations
In the pursuit of seamless human-robot interaction, the robotics community has leaned heavily into generative AI. While text-to-motion models offer unprecedented expressiveness, they introduce a lethal vulnerability: "physical hallucinations." These occur when a kinematics-only generator produces motion trajectories that are semantically aligned with a prompt but mechanically catastrophic. On hardware like the Unitree G1, these hallucinations manifest as joint limit violations, self-collisions, and balance loss—leading to "structural collapse."

The fundamental problem is the gap between a "kinematically plausible" animation and a "physically executable" robotic command. Current black-box models often evade standard evaluation by producing motions that look acceptable in a simulator lacking rigorous contact physics but fail instantly in the real world. **SafeFlow** is our intervention—a two-level framework that replaces hope with engineering rigor, combining physics-guided generation with a hierarchical 3-Stage Safety Gate to bridge the sim-to-real chasm.

---

### 2. The Architecture of Precision: Physics-Guided Rectified Flow
SafeFlow utilizes **Rectified Flow Matching** within a Variational Autoencoder (VAE) latent space to synthesize motion. Unlike standard diffusion, which can suffer from stochastic drift, Rectified Flow learns a velocity field $v_\theta$ that transports noise $z_0$ to the data distribution $z_1$ along nearly linear trajectories, defined by the ODE:
$$\frac{dz_u}{du} = v_\theta(z_u, u | f_{t-T_{hist}:t-1}, e_t)$$

#### The Physics Cost (C)
To ensure the generated velocity field respects the laws of robotics, we introduce a differentiable physics cost $C$. During sampling, we steer the flow using the gradient $\nabla_z C$, pushing the latent trajectory toward executable manifolds.

| Component | Penalty Type | Technical Objective |
| :--- | :--- | :--- |
| **Joint Limits** | ReLU-squared barriers | Enforces $q_{min}$ and $q_{max}$ bounds via $ReLU(q_{\tau,j} - q_{max,j})^2$. |
| **Self-Collision** | Euclidean distance checks | Prevents penetration between 14 link pairs using a safety margin $m$. |
| **Smoothness** | High-order derivatives | Regularizes joint velocity ($\dot{q}$) and acceleration ($\ddot{q}$) via finite differences. |
| **CoM Stability** | Center of Mass reg. | Minimizes $\dot{c}(q_\tau)$ and $\ddot{c}(q_\tau)$ to maintain postural balance. |

#### Acceleration via Reflow Distillation
Physics-guided sampling is computationally prohibitive for real-time control, typically requiring $NFE=10$ with classifier-free guidance (CFG). To solve this, SafeFlow employs **Reflow distillation**. We use the guided, multi-step "teacher" model to generate optimal trajectories, which are then distilled into a "student" model. This internalizes complex physics constraints into the neural weights, enabling **NFE=1** (single-step generation) without sacrificing safety or fidelity.

---

### 3. The 3-Stage Safety Gate: A Hierarchical Firewall
Even a physics-aware generator can be pushed into failure by adversarial or out-of-distribution (OOD) inputs. SafeFlow implements a "training-free selective execution mechanism" that acts as a failure-first firewall.

#### Stage 1: Semantic OOD Filtering (Input Level)
We detect high-risk prompts (e.g., "levitate," "crochet a sweater") in the CLIP text-embedding space before generation begins. By calculating the **Mahalanobis distance** ($d^2$) against the statistics of the training set, the gate rejects prompts exceeding a threshold $\tau_{sem}$ (calibrated to the **90th percentile** of training data). This prevents the model from attempting to synthesize undefined or physically impossible behaviors.

#### Stage 2: Generation Instability Filtering (Model Level)
Generative models can encounter "anisotropic" regions where the flow field becomes chaotic. SafeFlow monitors this via the **Instability Score ($R$)**, a metric of directional sensitivity discrepancy. We probe the Jacobian $J = \partial v_\theta / \partial z$ using $M=16$ random unit vectors $\epsilon_m$. For each probe, we calculate a directional sensitivity scalar $g_m$ via finite-difference approximation:
$$g_m \approx \epsilon_m^\top \left( \frac{v_\theta(z + \delta\epsilon_m) - v_\theta(z)}{\delta} \right)$$
The score $R$ is defined as the standard deviation of these sensitivities. A high $R$ indicates the generation is fragile and prone to collapse, triggering an immediate rejection.

#### Stage 3: Hard Kinematic Screening (Output Level)
The final defense is a deterministic screen of the output trajectory. It strictly rejects any motion that violates:
*   Absolute joint position limits.
*   Maximum allowable joint velocities ($| \dot{q}_j | > \dot{q}_{max,j}$).
*   Maximum joint accelerations ($| \ddot{q}_j | > \ddot{q}_{max,j}$).

#### The Fallback Mechanism
Upon any gate rejection, the system triggers a **Safe Fallback**. The current command is overridden by a "stand" prompt, and the controller interpolates smoothly to a nominal, stable pose while awaiting the next safe instruction.

---

### 4. Performance Benchmarks: Proving the Framework
Evaluations on the Unitree G1 demonstrate that SafeFlow transforms the robot from a fragile experimental platform into a robust agent.

*   **Success Rate:** SafeFlow achieved a **98.5%** success rate, compared to 80.6% for the TextOp baseline.
*   **Hardware Safety:** Joint Limit Violations (JV) were reduced from **43.14% to 3.08%**, effectively eliminating the erratic torque chattering seen in kinematics-only models.
*   **Latency:** The pipeline achieves an end-to-end frequency of **~67.7Hz** (running on an **onboard Jetson Orin** for the tracker and an **NVIDIA RTX A6000** for the generator), satisfying the requirements for real-time closed-loop control.

**Diversity vs. Stability:** We observed that the baseline’s higher "multimodality" (1.40 rad) was a statistical illusion caused by physically implausible motions. When restricted to successful trials, the gap narrows. Crucially, in failure-prone prompts, the baseline’s diversity inflates to **1.99 rad**, while SafeFlow maintains a stable **1.20 rad**. This proves that baseline "diversity" is often just a precursor to structural failure.

---

### 5. Real-World Deployment: The "Double Backflip" Test
To validate sim-to-real transferability, we deployed SafeFlow on the Unitree G1 for a long-horizon interactive sequence. The robot successfully navigated the following command chain:
1. **Stand**
2. **Wave hands**
3. **Stand**
4. **Punch**
5. **Punch**
6. **Squat down**
7. **Stand up**
8. **Hop on left leg**
9. **Double backflip** $\rightarrow$ **[Triggered Safety Gate / Fallback to Stand]**
10. **Wave hands**

When the "double backflip" prompt was introduced, the Stage 2 gate detected a sharp spike in the $R$ score, identifying the generation as unstable. Rather than attempting a motion that would result in mechanical damage, the system executed the Safe Fallback to a standing pose, allowed the robot to remain balanced, and seamlessly transitioned to the final "wave" command.

---

### 6. Conclusion: The Future of Robust Humanoid Interaction
SafeFlow moves the needle from "visually interesting" to "deployment-ready." By enforcing physics at the latent level and treating the generator not as a black box, but as a system requiring a hierarchical firewall, we can prevent covert failures that evade standard testing. 

Our vision for the next iteration of SafeFlow involves making fallback behaviors **"task-aware."** Instead of a passive return to standing, the system will learn to recover dynamically into the next probable stable state, ensuring continuity even during high-intensity athletic maneuvers.

**Key Takeaways:**
*   **Physics-Aware Generation:** Rectified Flow combined with a differentiable cost $C$ steers motions away from physical hallucinations at the source.
*   **Reflow Distillation:** Internalizing physics constraints enables $NFE=1$ generation, achieving the 60Hz+ speeds required for real-time humanoid response.
*   **Jacobian-Based Sensitivity ($R$):** Monitoring directional sensitivity discrepancy provides a mathematical foundation for detecting and rejecting structurally unstable trajectories before they reach the hardware.

*Read the [full paper on arXiv](https://arxiv.org/abs/2603.23983) · [PDF](https://arxiv.org/pdf/2603.23983.pdf)*
