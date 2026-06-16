---

title: "Vision-Language-Action Models: Concepts, Progress, Applications and Challenges"
description: "A comprehensive survey of VLA model architectures, training strategies, and real-world applications reveals persistent safety and deployment challenges that the field must resolve before embodied AI can be trusted at scale."
date: 2026-05-04
arxiv: "2505.04769"
authors: "Ranjan Sapkota, Yang Cao, Konstantinos I. Roumeliotis, Manoj Karkee"
paperType: "survey"
tags: [vla-models, embodied-ai, survey, safety-challenges, ethical-deployment, cross-modal-learning, evaluation-gaps]
audio: "https://cdn.failurefirst.org/audio/daily-paper/2505.04769-audio-overview.m4a"
draft: false
image: "https://cdn.failurefirst.org/images/daily-paper/2026-05-04-vla-models-concepts-progress-applications-challenges.png"
---

The embodied AI field has generated a remarkable volume of individual research contributions over the past three years — new VLA architectures, new benchmarks, new attack vectors, new defenses — but synthesizing that landscape into a coherent picture of where safety risks accumulate and where the field is genuinely making progress remains difficult. Sapkota et al.'s survey "Vision-Language-Action Models: Concepts, Progress, Applications and Challenges" provides one of the more thorough attempts to do this mapping, covering the architectural innovations, training strategies, real-time application domains, and unresolved challenges that define the current state of VLA research.

For safety-focused readers, the survey's most valuable contribution is not its taxonomy of architectures — it is its honest accounting of the gaps between what the field claims and what has actually been demonstrated. Those gaps cluster around exactly the concerns that dominate the adversarial robustness literature: generalization under distribution shift, the brittleness of cross-modal grounding, and the absence of principled methods for certifying that a VLA system will behave safely in open-ended environments.

### Architecture and the Safety Surface

The survey traces the lineage of VLA models from early vision-language pretraining through the integration of action-generation heads, situating architectures like RT-2, OpenVLA, and their successors within a common design space. The architectural choices that make these models powerful — large-scale pretraining on web data, cross-modal attention over vision and language tokens, tokenized action representations — are the same choices that introduce the attack surfaces documented in the adversarial literature.

Cross-modal attention, for instance, is the mechanism that allows VLA models to ground language instructions in visual observations. It is also the mechanism that adversarial patch attacks exploit: by injecting carefully crafted pixel perturbations that shift the attention distribution, an attacker can redirect the model's "grounding" toward a false visual premise, causing it to execute semantically coherent but physically dangerous actions. The survey acknowledges this vulnerability class without resolving it, which is the honest position — no architecture-level defense has yet demonstrated robust cross-modal perturbation resistance while preserving task performance.

The coverage of hierarchical controllers — architectures that decompose VLA inference into a high-level semantic planner and a low-level motion controller — is particularly relevant to safety. Hierarchical designs offer a natural insertion point for safety constraints: a constraint layer can, in principle, filter the high-level planner's outputs before they reach the motion controller. But the survey notes that this modularity is often illusory in practice; end-to-end fine-tuning tends to blur the boundary between levels, and constraint layers trained in simulation frequently fail to transfer to real-world kinematics.

### Training Strategies and Their Safety Implications

The survey examines the spectrum of VLA training approaches: supervised imitation from human demonstrations, reinforcement learning from environment reward, and hybrid schemes that combine the two. Each training paradigm carries distinct safety implications that the field has not fully confronted.

Imitation learning produces models that are highly capable within the distribution of the training demonstrations but brittle at the boundaries. When a VLA system trained on manipulation demonstrations in a clean laboratory environment encounters an occluded object, an unexpected surface texture, or a partially obstructed workspace, it has no principled way to recognize that it has left its competence region. The failure mode is silent: the model produces confident-looking actions that are incorrect, rather than flagging uncertainty and deferring to a human operator.

RL-from-environment-reward can, in principle, produce more robust policies by exposing the model to a wider range of states during training. But the survey highlights a persistent challenge: reward shaping in simulated environments rarely captures the full space of safety-relevant failure modes that appear in real deployments. A policy that achieves high reward on a simulated task may still collide with unexpected obstacles, apply inappropriate force, or violate workspace constraints that were not represented in the reward function.

### Evaluation Gaps and the Measurement Problem

Perhaps the most consequential section for the safety community is the survey's treatment of evaluation methodology. Existing VLA benchmarks — LIBERO, MetaWorld, RLBench, and their variants — measure task success rates under near-ideal conditions: controlled lighting, known object placements, and clear language instructions. These metrics are useful for tracking architectural progress, but they systematically underestimate the difficulty of real-world deployment.

The survey identifies three evaluation gaps that are directly relevant to safety. First, **robustness evaluation** is rarely standardized: papers report performance under their own perturbation conditions rather than shared adversarial benchmarks, making cross-paper comparison unreliable. Second, **long-horizon safety** — whether a model avoids cumulative constraint violations over extended task sequences — is almost never measured, even though real-world manipulation tasks unfold over hundreds of time steps. Third, **out-of-distribution detection** is treated as a secondary concern despite being fundamental to safe deployment; most evaluated models have no mechanism for recognizing when they are operating outside their training distribution.

### Ethical Deployment and the Path Forward

The survey's treatment of ethical deployment and neuro-symbolic planning points toward a promising but underdeveloped research direction: integrating formal methods with learned VLA components to provide verifiable safety guarantees. Neuro-symbolic approaches that express safety constraints in structured, interpretable form — rather than encoding them implicitly in learned weights — offer a potential path toward VLA systems that can be audited, certified, and updated when constraints change.

This direction aligns with the broader trajectory of the embodied AI safety literature, which has moved from demonstrating that attacks are possible to asking how safety properties can be formally specified and verified in systems that combine neural perception with physical action. The survey does not resolve this challenge, but it situates it clearly within the landscape of open problems — a valuable service for researchers deciding where to direct their efforts.

*Read the [full paper on arXiv](https://arxiv.org/abs/2505.04769) · [PDF](https://arxiv.org/pdf/2505.04769.pdf)*
