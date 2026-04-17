---
title: "AI Safety Daily — April 10, 2026"
description: "Descriptive fluency vs physical grounding, the Perception-Action Gap in world models, and why safety must be an architectural constraint."
date: 2026-04-10
tags: ["ai-safety-daily", "embodied-ai", "world-models", "physical-ai", "safety-architecture"]
image: "https://cdn.failurefirst.org/images/daily-research/ai-safety-daily-2026-04-10.png"
draft: false
---

## AI Safety Research Digest — April 10, 2026

> *Covering the physical AI grounding crisis, world model failures, and safety-as-architecture.*

### Key Findings

- **Descriptive fluency is not physical competence.** The central thesis emerging from 2026 research: models that can eloquently describe a task cannot necessarily execute it safely. This "Perception-Action Gap" is the fundamental bottleneck for embodied AI deployment, and no amount of text-based safety training addresses it.

- **World model failure modes are catastrophic.** Testing Sora 2, Kling 2.6, and HunyuanVideo 1.5 on physical manipulation tasks reveals three failure patterns: (1) superficial instruction-following that violates basic physics (moving objects through solid barriers), (2) representational collapse where object geometry distorts during manipulation, and (3) object identity failure where components merge, appear, or vanish mid-sequence.

- **0% one-shot accuracy on interlocking puzzles.** The CHAIN benchmark confirms that no current model can solve Lu Ban lock puzzles on the first attempt. Even with iterative interaction, the cost is prohibitive — GPT-5.2 at ~$1.30 per solved task level. The models lack the causal reasoning to understand how early placement decisions create irreversible constraints.

- **Safety as architectural ordering.** The emerging consensus is that safety must be an architectural constraint, not a post-hoc patch. Three approaches validate this: AEGIS (external CBF wrapper), PreSafe (pre-generation latent alignment), and FLIP (backward inference for evaluation). All three decouple safety from the model's primary reasoning engine.

### The F41LUR3-F1R57 Perspective

This research validates our core thesis: failure is structural, not incidental. When embodied agents comply with 90% of hazardous instructions (SafeAgentBench), the problem isn't a missing training example — it's that safety training at the text layer doesn't transfer to the action layer. The Perception-Action Gap is the embodied version of the alignment gap we've been measuring in language models.

---

*Research sourced via NLM deep research scan. [Full scan report](https://github.com/adrianwedd/failure-first-embodied-ai/blob/main/docs/daily-research-scans/scan_2026-04-10.md).*
