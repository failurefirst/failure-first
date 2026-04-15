---
title: "AI Safety Daily — April 16, 2026"
description: "Red-teaming as security theater, 0% physical AI puzzle performance, SafeAgentBench finds <10% hazard rejection, and AEGIS wrapper provides mathematical safety guarantees."
date: 2026-04-16
tags: ["ai-safety-daily", "red-teaming", "embodied-ai", "vla-safety", "frontier-models", "financial-ai"]
image: "assets/infographic/daily-research/ai-safety-daily-2026-04-16.png"
draft: false
---

## AI Safety Research Digest — April 16, 2026

> *Covering the physical AI safety frontier, red-teaming methodology crisis, and regulatory shifts.*

### Key Findings

- **Red-teaming is "security theater."** Feffer et al. (CMU) surveyed 104 papers and found systematic divergence across five axes: purpose, artifact, threat model, setting, and outcomes. Crowdworker-based evaluations gravitate toward easy-to-produce harms while missing complex multi-step vulnerabilities. The conflation of dissentive (context-dependent) and consentive (universally inadmissible) risks produces critical evaluation failures in physical AI.

- **0% one-shot accuracy on physical puzzles.** The CHAIN benchmark tested GPT-5.2, OpenAI-o3, and Claude-Opus-4.5 on interlocking mechanical structures. Every model scored 0.0% Pass@1. Even with iterative interaction, extreme trial-and-error inefficiency persists — GPT-5.2 costs ~$1.30 per solved task level, highlighting the economic impracticality of current physical reasoning approaches.

- **Embodied agents reject fewer than 10% of hazardous instructions.** SafeAgentBench tested agents across 750 tasks and 10 hazard categories in AI2-THOR. Deceptive framing (embedding danger in plausible household requests) defeats even safety-aligned agents — the attack surface is defined by framing, not content. A dangerous divergence exists between semantic safety metrics and execution behavior.

- **AEGIS wrapper provides mathematical safety guarantees.** The VLSA/AEGIS architecture uses Control Barrier Functions to project VLA outputs onto safe action sets. On SafeLIBERO: +59% obstacle avoidance, +17% task success, minimal latency overhead. Safety and capability are complementary — preventing reckless trajectories actually improves performance.

### Domain-Specific Risk: Financial AI

- **FinRedTeamBench** introduces Risk-Adjusted Harm Scoring (RAHS) for banking and insurance contexts. Adaptive multi-turn red-teaming with higher decoding stochasticity systematically drives models toward operationally actionable financial disclosures. Binary ASR metrics are insufficient for regulated domains.

### Institutional Shifts

- **OpenAI's safety leadership erosion continues.** Superalignment team dissolved (May 2024), AGI Readiness team departed (Oct 2024), Mission Alignment team disbanded (Feb 2026). Lead Joshua Achiam transitioned to "Chief Futurist" — safety moves from operational authority to advisory influence.

### Implications for Embodied AI

The Perception-Action Gap remains the central challenge. Video-generation "world models" (Sora 2, Kling 2.6, HunyuanVideo 1.5) exhibit three catastrophic failures: superficial instruction-following (moving objects through solid barriers), representational collapse (distorted geometries), and object identity failure (merging/deleting components). Visual plausibility does not equal physical integrity — a core F41LUR3-F1R57 principle.

---

*Research sourced via NLM deep research scan. [Full scan report](https://github.com/adrianwedd/failure-first-embodied-ai/blob/main/docs/daily-research-scans/scan_2026-04-16.md).*
