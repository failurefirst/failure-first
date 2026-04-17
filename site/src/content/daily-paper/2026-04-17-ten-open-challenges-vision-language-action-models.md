---
title: "10 Open Challenges Steering the Future of Vision-Language-Action Models"
description: "A position paper from AAAI 2026 identifies ten development milestones for VLA models in embodied AI, with safety named explicitly among the challenges and evaluation gaps highlighted as a systemic barrier to progress."
date: 2026-04-17
arxiv: "2511.05936"
authors: "Soujanya Poria, Navonil Majumder, Chia-Yu Hung, Amir Ali Bagherzadeh, Chuan Li, Kenneth Kwok, Ziwei Wang, Cheston Tan, Jiajun Wu, David Hsu"
paperType: "position"
tags: ["embodied-ai", "vla", "safety", "evaluation-gaps", "robotics"]
draft: false
---

# 10 Open Challenges Steering the Future of Vision-Language-Action Models

**Focus:** Poria et al. survey the frontier of Vision-Language-Action (VLA) models — systems that combine perception, language understanding, and physical action generation into a single end-to-end architecture — and name ten challenges that must be addressed before VLAs can be reliably deployed in the real world. Safety appears explicitly as one of those ten challenges, not as an afterthought, but as a core research problem on equal footing with efficiency and generalization.

The paper's value is in making the challenges explicit and public. Many practitioners navigate these problems informally; a consensus taxonomy from AAAI 2026 gives the field shared vocabulary for the work ahead.

---

### The Ten Challenges

The paper organizes VLA research challenges into ten areas:

1. **Multimodality** — VLAs must integrate vision, language, proprioception, touch, and potentially audio into coherent action policies. Current architectures are predominantly vision-language; the multimodal gap creates brittleness in real deployments.
2. **Reasoning** — Executing long-horizon tasks requires multi-step planning and causal reasoning that current VLAs handle inconsistently, particularly when intermediate steps fail.
3. **Data** — High-quality robot demonstration data is expensive and scarce. Synthetic data and sim-to-real transfer remain imperfect substitutes for real-world trajectories.
4. **Evaluation** — Benchmarks do not capture real-world task complexity. Success metrics in simulation poorly predict behavior in physical environments.
5. **Cross-robot action generalization** — Models trained on one robot embodiment fail to transfer to robots with different morphologies, action spaces, or sensor configurations.
6. **Efficiency** — VLA inference is computationally expensive, conflicting with real-time requirements and edge deployment on resource-constrained hardware.
7. **Whole-body coordination** — Humanoid and multi-limb robots require coordinating arms, legs, and body in ways that go beyond the manipulation tasks most VLA research addresses.
8. **Safety** — Deploying VLAs in environments shared with humans requires guarantees (or at minimum strong empirical evidence) against harmful physical actions.
9. **Agents** — VLAs operating as autonomous agents must handle goal specification, sub-goal decomposition, and failure recovery without human supervision.
10. **Coordination with humans** — Robots sharing spaces with humans must understand human intent, maintain safe proximity, and adapt to dynamic human behavior.

### Why Safety Lands at Challenge 8 (And Why the Order Doesn't Matter)

The paper does not rank these challenges by importance, and the ordering should not be interpreted as a priority gradient. Safety appearing eighth in a numbered list is a presentation choice, not a claim that the first seven challenges must be solved before safety becomes relevant.

In practice, the opposite ordering is more accurate for deployment: safety is the pre-condition, not the post-condition. A robot that generalizes well across embodiments but takes dangerous physical actions has not solved a problem — it has amplified one. The efficiency gains from a faster VLA inference pipeline become liabilities if the model's actions cannot be trusted.

The paper implicitly acknowledges this by treating safety as a first-class research challenge rather than a compliance checkbox. That framing is worth noting in a AAAI venue where safety might otherwise be relegated to a brief acknowledgment section.

### The Evaluation Gap Is the Safety Gap

Challenge 4 (evaluation) and Challenge 8 (safety) are more tightly coupled than the paper's structure suggests. The fundamental reason VLA safety is unsolved is that we lack evaluation frameworks that can characterize safety properties reliably.

Current VLA benchmarks measure task success rates — did the robot complete the assigned manipulation task? This metric is orthogonal to safety. A robot can complete every benchmark task successfully while exhibiting dangerous behaviors in scenarios slightly outside the evaluation distribution. Conversely, a robot that never completes its task is also "safe" under purely behavioral metrics.

The evaluation gaps enumerated in the paper — simulation-to-reality mismatch, limited scenario coverage, post-hoc rather than process-oriented metrics — are precisely the gaps that allow dangerous VLA behaviors to go undetected until deployment. Closing the evaluation gap is a necessary precondition for making progress on the safety challenge.

### Emerging Research Directions

Beyond the ten challenges, the paper identifies several emerging research directions that intersect directly with safety:

**Spatial understanding:** VLAs need richer geometric representations of their environment to reason about physical consequences. A model that understands spatial relationships — clearances, force transmission paths, fragile object properties — can reason about the physical harm potential of its actions in ways that current models cannot.

**World dynamics modeling:** Predicting how the environment responds to robot actions is foundational for safety. A VLA that models world dynamics can anticipate harmful outcomes before executing them. Current architectures largely lack this capability.

**Post-training interventions:** Safety fine-tuning approaches analogous to RLHF for language models are an active area for VLAs. The challenge is that human preferences over robot behaviors are harder to elicit and noisier than preferences over text outputs.

**Data synthesis:** If real-world robot safety incidents are rare (by design) in training data, VLAs will be undertrained on failure recovery and hazard avoidance. Synthetic data generation — creating simulated failure scenarios — is a necessary complement to demonstration-based training.

### Failure-First Connections

The evaluation gap challenge connects directly to the core failure-first thesis: the scenarios where VLAs fail — adversarial inputs, out-of-distribution environments, edge cases in physical dynamics — are systematically underrepresented in both training data and evaluation benchmarks. The paper provides a field-level consensus that this is a recognized problem, not a niche concern.

The cross-robot generalization challenge also carries safety implications that the paper does not fully develop. A model that generalizes its task-completion behavior to new embodiments may also generalize its failure modes. Characterizing how safety properties transfer across robot configurations is a safety-critical research question in its own right.

### What This Paper Is Not

Position papers from academic venues are programmatic rather than evidentiary. This paper identifies and names challenges; it does not offer solutions, quantitative results, or experimental evidence. Its value is as a snapshot of expert consensus on where the hard problems lie.

For a community that sometimes mistakes benchmark progress for real-world progress, a clear statement of unsolved problems from a venue like AAAI serves a useful function. The field knows what it does not know — the question is whether funding, talent, and research incentives are being allocated accordingly.

---

*Read the [full paper on arXiv](https://arxiv.org/abs/2511.05936) · [PDF](https://arxiv.org/pdf/2511.05936.pdf)*
