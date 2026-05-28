---
title: "AI Safety Daily — May 11, 2026"
description: "Guardrail diagnostics for agentic pipelines, SAE feature-steering fragility, a 94-dimension safety benchmark, adaptive multi-turn jailbreak architecture, and a cross-frontier safety comparison collectively argue that runtime safety architecture — not just training-time alignment — is the critical missing layer."
date: 2026-05-11
tags: ["ai-safety-daily", "agentic-ai", "interpretability", "red-teaming", "frontier-models"]
draft: false
image: "https://cdn.failurefirst.org/images/blog/ai-safety-daily-2026-05-11-infographic.png"
---

## AI Safety Research Digest — May 11, 2026

> *Guardrail diagnostics, SAE fragility, and adaptive jailbreak frameworks converge: training-time alignment is insufficient for autonomous agents — runtime safety architecture is the missing layer.*

### Key Findings

- **AgentDoG's diagnostic guardrail framework shows autonomous tool-using agents need trajectory-level monitoring, not just output filtering.** Liu et al. (Jan 2026) map agentic risks across a three-dimensional taxonomy — action types, environmental interactions, and multi-agent coordination — and demonstrate that fine-grained trajectory monitoring substantially improves root-cause diagnosis of safety failures in tool-using pipelines. The 125-upvote community signal reflects how underserved runtime agentic safety remains relative to model-level alignment work. [arXiv:2601.18491](https://arxiv.org/abs/2601.18491)

- **Sparse autoencoder feature steering is too fragile for safety-critical deployment.** Ronge et al. (Jan 2026) show that SAE-extracted features activate on semantically unrelated inputs — the paper's titular example: a "coffee" feature activating on coffins — and that feature steering produces unreliable output modulation when activation context shifts. This directly constrains interpretability-based safety gate designs that rely on steering polysemous safety-relevant features at inference time. [arXiv:2601.03047](https://arxiv.org/abs/2601.03047)

- **ForesightSafety Bench exposes systematic coverage gaps across 94 risk dimensions in every frontier model tested.** Tong et al. (Feb 2026) span fundamental safety, embodied AI risks, AI4Science, and catastrophic/existential categories. No model achieves consistent coverage — a pattern consistent with the compositional structure of safety alignment: passing one risk axis offers no guarantee on orthogonal ones. [arXiv:2602.14135](https://arxiv.org/abs/2602.14135)

- **AJAR exploits the "Agentic Gap" between single-turn alignment and multi-turn tool-using behaviour.** Dou and Yang (Jan 2026) use Protocol-driven Cognitive Orchestration — delivered via Model Context Protocol semantics — to coordinate persona-based attacks across conversation turns, accumulating cognitive load to exceed the attack success rates of static single-turn jailbreaks. The result quantifies how much safety margin is lost when a model transitions from answering queries to operating as an autonomous agent. [arXiv:2601.10971](https://arxiv.org/abs/2601.10971)

- **Comparative safety assessment across GPT-5.2, Gemini 3 Pro, Qwen3-VL, and three additional frontier systems finds no universal safety leader.** Ma et al. (Jan 2026) evaluate on adversarial, multilingual, and compliance axes. Models strong on compliance frequently underperform on adversarial robustness and vice versa, suggesting that single-leaderboard safety rankings obscure systematic per-axis tradeoffs. [arXiv:2601.10527](https://arxiv.org/abs/2601.10527)

### Implications for Embodied AI

The AgentDoG taxonomy and AJAR multi-turn architecture jointly expose a gap with direct embodied consequences. Physical robot systems are long-horizon tool-using agents — each motor command, sensor query, and planner call is a tool invocation — and the accumulated safety risk documented by AJAR maps precisely onto long task-horizon robotic deployments. Trajectory-level monitoring, tracking mission-level safety properties across full action sequences rather than inspecting individual outputs, is the natural translation of AgentDoG's framework into robotic pipelines: properties like "no irreversible manipulation without confirmation" are simply not verifiable from any single turn.

The SAE fragility finding constrains a class of proposed mechanistic runtime defences. If feature activation patterns are unstable under semantic shift at the scale of a controlled benchmark, these instabilities will compound in real-world embodied deployments where robots routinely encounter environmental distribution shift. Interpretability-based safety gates built on SAE features should be evaluated against out-of-distribution perceptual inputs before deployment, not just in-distribution test sets.

ForesightSafety Bench's 94-dimension coverage failure reinforces the measurement argument: embodied AI safety evaluation cannot be reduced to single-axis benchmarks. The failure-first programme's multi-domain scenario structure directly addresses this — but the frontier gap results are a reminder that coverage itself, not just attack sophistication, is a first-class evaluation variable.
