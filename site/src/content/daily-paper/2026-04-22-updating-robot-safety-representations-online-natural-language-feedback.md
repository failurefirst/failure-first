---

title: "Updating Robot Safety Representations Online from Natural Language Feedback"
description: "A method for dynamically updating robot safety constraints at deployment time using vision-language models and Hamilton-Jacobi reachability, enabling robots to respect context-specific hazards communicated through natural language."
date: 2026-04-22
arxiv: "2409.14580"
authors: "Leonardo Santos, Zirui Li, Lasse Peters, Somil Bansal, Andrea Bajcsy"
paperType: "methods"
tags: [embodied-ai, robot-safety, vision-language-models, natural-language-feedback, safety-constraints, online-learning, hamilton-jacobi-reachability]
draft: false
audio: "https://cdn.failurefirst.org/audio/daily-paper/2026-04-22-updating-robot-safety-representations-online-natural-language-feedback.m4a"
---

Robots entering homes and workplaces face a fundamental safety problem that pre-deployment testing cannot solve: the hazards that matter most are often discovered only after the robot arrives. A fragile heirloom, an expensive rug, a child's toy scattered across the floor — these are the kinds of constraints that no specification written in advance will fully capture. This paper by Santos et al. tackles that gap head-on, presenting a framework for updating robot safety representations in real time from natural language feedback provided during deployment.

### The Gap Between Designed and Deployed Safety

Most robot safety systems work by encoding constraints before deployment: keep 0.5 meters from humans, never exceed a torque threshold, avoid this region of the map. The hard boundary between design-time and run-time makes sense for known environments, but falls apart in open, human-centered settings. The authors identify this as a core failure mode — not an adversarial attack or a training distribution shift, but simply the impossibility of anticipating everything.

Their solution is to treat safety as a living representation that can be updated through the same communication channel humans use naturally: language. A user says "don't go near the bookshelf" or "avoid the left side of the kitchen," and the robot should not just acknowledge the instruction but durably update its safety controller to enforce it.

### VLMs as Safety Translators

The technical bridge between language and control is a vision-language model (VLM). When a user provides feedback, the VLM interprets the instruction in the context of the robot's current visual observation, grounding abstract language ("fragile objects") into concrete spatial regions the safety controller can reason about. This grounding step is non-trivial — the same sentence can imply very different constraints depending on what is visible in the scene.

The resulting safety representation is not a simple exclusion zone but a learned value function encoded through Hamilton-Jacobi (HJ) reachability analysis. HJ reachability is a formal method from control theory that computes guaranteed safe and unsafe regions of the state space, even under worst-case disturbances. Crucially, the authors use warm-starting to make online updates computationally tractable: rather than recomputing the full reachability set from scratch on each update, they initialize from the previous solution and propagate only the changes introduced by the new constraint. This makes real-time updates feasible on robotic hardware.

### Why This Matters for Embodied AI Safety

The paper sits at an important intersection that the broader AI safety field has not fully engaged with. Most discussion of safety alignment focuses on language models refusing harmful instructions. But embodied agents operating in the physical world face a different threat structure: not adversarial users trying to extract dangerous outputs, but benign environments that produce unexpected hazards. The challenge is not malicious misuse but contextual incompleteness.

This framing has several implications. First, safety cannot be a purely offline property — any robot deployed in novel environments will encounter hazards its designers did not anticipate. Second, the interface for safety specification needs to be human-accessible; formal constraint languages and reward shaping are too burdensome for end users. Third, the feedback loop must be fast enough that the robot updates before the next action, not at the next software release cycle.

The VLM-plus-HJ-reachability approach addresses all three: it enables deployment-time learning, uses natural language as the specification interface, and is computationally efficient enough for online use.

### Experimental Validation and Limits

The authors validate their approach in both simulation and physical robot experiments, demonstrating that the robot successfully identifies and respects novel safety constraints communicated verbally after deployment. The warm-starting technique substantially reduces computation time compared to full reachability updates.

That said, the approach inherits the limitations of its VLM component. Ambiguous language, unusual objects, or highly cluttered visual scenes may cause the grounding step to fail silently — producing a safety update that technically ran but encoded the wrong constraint. The paper does not extensively stress-test adversarial or ambiguous feedback, which is a meaningful gap given that real deployment environments are noisy and users are not always precise. Future work should investigate failure modes in the grounding pipeline, since an incorrectly grounded safety constraint is potentially worse than no update.

### Connections to the Broader Safety Picture

For practitioners working on embodied AI safety, this paper suggests that the evaluation gap between lab-tested and deployment-safe robots is addressable without requiring full re-specification at deployment time. The pattern — use a foundation model to interpret natural feedback, update a formal safety structure downstream — is generalizable beyond HJ reachability to constraint learning, safe RL, and planning-based approaches.

The deeper insight is architectural: safety systems for physical robots need an updatable interface. Treating safety as a fixed artifact from training, however carefully specified, is a category error for systems that will encounter a world their designers never fully described.

*Read the [full paper on arXiv](https://arxiv.org/abs/2409.14580) · [PDF](https://arxiv.org/pdf/2409.14580.pdf)*
