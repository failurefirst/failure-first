---
title: "CWM: Contrastive World Models for Action Feasibility Learning in Embodied Agent Pipelines"
description: "Proposes Contrastive World Models (CWM), a contrastive learning approach to train LLM-based action feasibility scorers using hard-mined negatives, and evaluates it on ScienceWorld with intrinsic affordance tests and live filter characterization studies."
date: 2026-03-07
arxiv: "2602.22452"
authors: "Chayan Banerjee"
paperType: "empirical"
tags: [action-feasibility-scoring,contrastive-learning,embodied-agents,world-models,hard-negative-mining,infonce-objective]
audio: "https://cdn.failurefirst.org/audio/daily-paper/2602.22452-audio-overview.m4a"
draft: false
---

# CWM: Contrastive World Models for Action Feasibility Learning in Embodied Agent Pipelines

### 1. Introduction: The High Cost of "Trying the Impossible"
In the development of embodied agents, we frequently encounter a critical bottleneck: the **semantic-physical gap**. High-level reasoning models are excellent at suggesting plausible next steps, but they often lack a grounded understanding of whether those steps are actually executable in the current state. When an agent fails to identify physically infeasible actions, it falls into "self-inflicted dead ends"—wasting precious reasoning tokens and computational cycles on actions that the environment will simply reject.

This failure is more than just an efficiency problem; it represents a significant **safety margin degradation**. In safety-critical or irreversible environments, attempting an impossible action can lead to catastrophic failures or state-space traps from which the agent cannot recover. **Action Feasibility Scoring** provides the necessary upstream filter, pruning the state-action space before planning begins to ensure the agent’s reasoning is anchored in physical reality.

### 2. The Failure of Supervised Fine-Tuning (SFT)
The standard industry baseline for training action scorers is Supervised Fine-Tuning (SFT). However, SFT suffers from a structural "calibration trap." By treating every candidate action as an independent binary classification task, SFT fails to learn the nuanced relative boundaries between actions that look similar but have opposite physical outcomes. In dense action spaces, SFT often assigns high scores to invalid actions simply because they "look" correct, leading to a collapse in ranking performance.

| Feature | The SFT Baseline | The CWM Approach |
| :--- | :--- | :--- |
| **Learning Objective** | Independent binary classification (Binary Cross-Entropy). | Joint relative ranking within a candidate pool (InfoNCE). |
| **Action Relationship** | Evaluates each action in isolation; lacks competitive context. | Treats valid and invalid actions as competitors in a shared space. |
| **Problem Formulation** | "Is action A valid (0 or 1)?" | "Is action A more feasible than the $N$ alternatives?" |
| **Negative Handling** | Independent labels; ignores the semantic-physical gap between candidates. | Explicitly optimizes to push "hard" negatives away from the gold action. |

### 3. Deep Dive: The CWM Architecture and InfoNCE Loss
The Contrastive World Model (CWM) bridges the semantic-physical gap by fine-tuning the **Qwen-2.5-7B** model using **LoRA** adaptation ($r=8, \alpha=16$). Unlike SFT, CWM employs a contrastive objective that reshapes the model's internal representation of physical affordances.

The architecture is driven by a two-part objective ($L_{total}$):
*   **InfoNCE Contrastive Objective ($L_{CWM}$):** This loss function uses a temperature hyperparameter ($\tau = 0.6$) to normalize the scoring space. It forces the model to identify the single "gold" action from a pool of up to $N=16$ negatives simultaneously. This joint optimization ensures the positive action is pushed to the top of the distribution.
*   **Margin Regularization ($L_{margin}$):** To prevent score crowding, we apply a margin term where $L_{margin} = \max(0, \gamma - f_{\theta}(s, a^+) + \text{mean}(f_{\theta}(s, a^-)))$. We set the margin $\gamma = 2.0$.
*   **Regularization Weights:** The final loss is balanced using $\lambda_m = 0.3$ (margin) and $\lambda_r = 0.005$ (weight decay).

These components work in tandem to "push" valid actions into a distinct scoring tier, creating a robust boundary that resists the influence of semantically deceptive distractors.

### 4. The Secret Sauce: A Taxonomy of Hard Negatives
CWM’s robustness is a direct result of its **Hard Negative Mining** pipeline. We categorize environment failures into four types, specifically designed to stress-test the model's understanding of physics:

1.  **Type 1: Silent Failures:** Actions that return "nothing happens" (e.g., pushing a fixed wall). These serve as the foundational "easy" negatives.
2.  **Type 2: Explicit Rejections:** Actions the environment actively refuses (e.g., "you can't eat that").
3.  **Type 3: Cross-task Transplants:** These actions are grammatically and "legally" valid in the environment but are **contextually and physically irrelevant** to the current task (e.g., trying to heat a beaker when the goal is to measure a melting point).
4.  **Type 4: Minimal-edit Negatives:** This is our **primary hypothesis test**. We use one-word substitutions (e.g., "heat" vs. "cool") to create actions that are syntactically identical but physically opposite. This forces the model to demonstrate true physical discrimination rather than relying on surface-level text patterns.

### 5. Empirical Evidence: Crushing the Hard-Negative Stress Test
In our "Intrinsic Affordance Evaluation" on the ScienceWorld benchmark, we compared CWM against SFT and a Vanilla LLM. The results on the Minimal-Edit category reveal the SFT "miscalibration" problem in high relief.

| Model | P@1 (Minimal-Edit) | AUC-ROC | Raw Score Gap |
| :--- | :--- | :--- | :--- |
| **CWM (Ours)** | **93.24%** | **0.929** | 7.64 |
| **SFT Baseline** | 86.49% | 0.906 | 9.50 |
| **Vanilla LLM** | 48.65% | 0.504 | -0.31 |

**The Insight:** Note that SFT shows a larger raw score gap (9.50 vs. 7.64) but lower Precision@1. This is a "false signal" of confidence; while SFT pushes some negatives far away, it lacks the fine-grained discrimination to correctly rank the most difficult physics-opposing distractors. CWM leads SFT by **+6.76 percentage points** on these critical cases, whereas the Vanilla LLM actually performed **worse than chance** (48.65% vs. 59.46% random), proving that training for feasibility is non-optional.

### 6. Out-of-Distribution (OOD) Robustness and the Safety Margin
To evaluate the scorer’s behavior in a live agent loop, we utilized a fuzzy matching procedure (**GoldMatcher**) to track the "gold action" ranking during task execution. We focused on the **Gold Action Retention Rate (GARR@K)** and the **Safety Margin** (the mean score difference between the gold action and the top-ranked distractor).

When subjected to **OOD Stress Tests**—task families never seen during training, such as *Thermometer*, *Chemistry-mix*, and *Measure-melting-point*—the contrastive advantage became even clearer:
*   **CWM Safety Margin:** -2.39
*   **SFT Safety Margin:** -3.96

Mathematically, SFT’s more negative margin (-3.96) indicates a severe failure: the gold action is being ranked significantly *below* the highest-ranked distractor. This "probability collapse" happens when SFT encounters dense, unfamiliar action spaces. CWM’s contrastive training allows it to maintain a tighter safety margin, ensuring that even under distribution shift, the correct action remains competitive.

### 7. Future Directions: Integrating Feasibility into the Agent Loop
The ultimate goal of CWM is to serve as a high-fidelity filter that separates **feasibility** from **optimality**. By offloading the "is this possible?" check to CWM, we can protect the "reasoning budget" of the primary policy.

*   **DRRN + CWM:** By using CWM to prune the action space by 80–90%, we allow a Deep Reinforcement Relevance Network (DRRN) to focus only on feasible candidates. This prevents the RL policy from wasting thousands of episodes on physical hallucinations.
*   **ReAct + CWM:** Integrating CWM as a pre-filter for reasoning agents is hypothesized to reduce invalid action rates by 30–40%. This modular safety design ensures the "slow thinking" reasoning model never has to waste tokens contemplating a "fast thinking" physical impossibility.

### 8. Conclusion: Key Takeaways for AI Safety Researchers

*   **Training Objectives Dictate Robustness:** For agents in physically structured environments, InfoNCE ranking is superior to binary classification. Contrastive learning induces representations that capture physical boundaries more faithfully than independent SFT.
*   **The Calibration Trap is Real:** A large raw score gap in an SFT model is often a deceptive metric. High confidence in isolation does not translate to correct relative ordering in dense candidate sets.
*   **Hard Negatives are the Primary Safety Test:** To build robust agents, we must move beyond random negatives. "Minimal-edit" testing is the only way to verify that a model understands the *physics* of an action rather than the *grammar* of the environment.
*   **Separation of Concerns as a Safety Primitive:** Decoupling feasibility (CWM) from policy (RL/ReAct) is a superior architecture. It creates a "physical guardrail" that makes agents more resilient to out-of-distribution conditions where planning errors are most dangerous.

*Read the [full paper on arXiv](https://arxiv.org/abs/2602.22452) · [PDF](https://arxiv.org/pdf/2602.22452.pdf)*
