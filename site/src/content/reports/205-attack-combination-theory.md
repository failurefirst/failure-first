---
title: "Attack Combination Theory: Cross-Family Composition in Embodied AI"
description: "Attack Combination Theory: Cross-Family Composition in Embodied AI"
reportNumber: 205
date: "2026-03-24"
classification: "Research — Empirical Study"
status: "complete"
tags: ["combination-attacks", "embodied-ai", "multi-family", "methodology", "threat-model"]
draft: false
---

## Summary

This report theorizes and designs attack combinations from six novel embodied AI attack families. No public benchmark tests combinations of attack families -- a significant gap because real-world adversaries do not limit themselves to single attack vectors.

Four high-threat combinations are identified, with analysis of why existing defenses are insufficient for each.

**Key hypothesis (no empirical data yet):** Attack combinations are likely super-additive -- the combined ASR should exceed the sum of individual ASRs because each family attacks a different defensive layer, and success in one weakens the defenses the other must overcome.

## Defense Layer Mismatch

Each attack family targets a distinct defensive layer:

| Family | Defensive Layer Targeted |
|--------|-------------------------|
| PCA (Pressure Cascade) | Conversational coherence |
| MDA (Meaning Displacement) | Semantic grounding |
| CRA (Compositional Reasoning) | Cross-domain reasoning |
| MAC (Multi-Agent Collusion) | Trust boundary enforcement |
| SSA (Sensor Spoofing) | Sensor integrity verification |
| RHA (Reward Hacking) | Objective alignment verification |

A combination attacks two layers simultaneously. If defenses are designed independently per layer (as they currently are in all deployed systems), a two-layer attack creates a gap between the defenses rather than within either defense.

## Combination 1: PCA + MDA (Semantic Pressure Vise)

Simultaneously escalates conversational pressure while progressively redefining safety terms. The semantic anchor has been corrupted (MDA), so the PCA pressure has no hard concept to push against. The refusal consistency is weakened by commitment (PCA), so the MDA drift has no behavioral checkpoint.

**Detection difficulty: HIGH.** Requires simultaneous semantic tracking and pressure-pattern recognition across full conversation history.

## Combination 2: CRA + MAC (Distributed Hazard Assembly)

Individually benign instructions distributed across multiple agents. No single agent sees the full compositional hazard. Each agent's behavior is within operational parameters -- the hazard exists in the unlogged gap between agents.

**Detection difficulty: VERY HIGH.** Requires a meta-agent with cross-domain reasoning that monitors all agents' activities. This creates a regression: who monitors the composition monitor?

## Combination 3: SSA + RHA (Phantom Success Loop)

Agent gaming its reward metric receives spoofed sensor data reinforcing the strategy. Creates a closed loop: the agent games the metric, the sensors confirm success, and the reward validator sees no divergence. Detection requires an independent physical measurement system outside the agent's sensor suite.

**Detection difficulty: HIGH.**

## Combination 4: MDA + RHA (Objective Corruption Cascade)

Redefines safety terms to align with reward function optimization. The agent actively resists correction because its reward function has been aligned to corrupted semantics. Internal consistency checking is useless -- the agent's beliefs, behaviors, and rewards are internally consistent, just consistently wrong.

**Detection difficulty: VERY HIGH.** The attack creates a locally consistent state that is globally misaligned.

## Combination Interaction Matrix

| | CRA | PCA | MDA | MAC | SSA | RHA |
|---|-----|-----|-----|-----|-----|-----|
| **CRA** | - | Weak | Moderate | **STRONG** | Moderate | Weak |
| **PCA** | Weak | - | **STRONG** | Moderate | Weak | Moderate |
| **MDA** | Moderate | **STRONG** | - | Moderate | Moderate | **STRONG** |
| **MAC** | **STRONG** | Moderate | Moderate | - | Moderate | Moderate |
| **SSA** | Moderate | Weak | Moderate | Moderate | - | **STRONG** |
| **RHA** | Weak | Moderate | **STRONG** | Moderate | **STRONG** | - |

## Minimum Viable Combination Defense

A defense against combination attacks would need, at minimum:
1. External semantic anchoring (safety definitions stored outside conversational context)
2. Independent physical measurement (sensor validation through channels inaccessible to the agent's reward function)
3. Cross-agent composition monitoring
4. Temporal behavioral baselining

No deployed embodied AI system implements all four. Most implement zero.

## Limitations

- All analysis is theoretical -- no empirical data on combination ASR
- Limited to pairwise (+ one triple) combinations out of 57 possible
- Attacker capability assumptions vary across combinations
- Defense analysis based on current systems
