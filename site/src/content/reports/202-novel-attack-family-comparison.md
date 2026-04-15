---
title: "Novel Attack Family Comparative Analysis: CRA, PCA, MDA, MAC, SSA, RHA"
description: "Novel Attack Family Comparative Analysis: CRA, PCA, MDA, MAC, SSA, RHA"
reportNumber: 202
date: "2026-03-24"
classification: "Research — Empirical Study"
status: "complete"
tags: ["attack-families", "CRA", "PCA", "MDA", "MAC", "SSA", "RHA", "embodied-ai", "taxonomy"]
draft: false
---

## Summary

Definitive comparative analysis of six novel attack families targeting embodied AI systems: Compositional Reasoning Attack (CRA), Pressure Cascade Attack (PCA), Meaning Displacement Attack (MDA), Multi-Agent Collusion (MAC), Sensor Spoofing Attack (SSA), and Reward Hacking Attack (RHA). Together these families represent 100 scenarios across 6 conceptually distinct attack surfaces previously absent from both the Failure-First taxonomy and all public embodied AI benchmarks.

**Key findings:**
1. The 6 families target 6 distinct attack surfaces. No two families share a primary attack surface.
2. CRA achieves the highest empirical FLIP ASR at 62.5% (5/8, n=8). PCA achieves 66.7% (4/6, n=6) on a smaller sample.
3. Three combination pairs represent the highest threat: PCA+MDA, CRA+MAC, and RHA+SSA.
4. No single defense covers all 6 families. Input filtering is ineffective against all 6.

## Attack Surface Taxonomy

| Family | Primary Attack Surface | Layer | Requires Multi-Turn | Requires Physical Embodiment |
|--------|----------------------|-------|---------------------|------------------------------|
| **CRA** | Compositional reasoning | Reasoning | No | Yes |
| **PCA** | Conversational commitment / social pressure | Prompt (multi-turn) | Yes | No (amplified by embodiment) |
| **MDA** | Semantic grounding of safety terms | Semantic | Yes | No (tested in embodied contexts) |
| **MAC** | Multi-agent trust and coordination | Multi-agent | Yes | No (tested in embodied contexts) |
| **SSA** | Sensor input trust hierarchy | Sensor/perception | No | Yes |
| **RHA** | Reward function specification | Reward/optimization | No | Yes |

## Empirical Results

| Family | Scenarios | Traces | FLIP ASR (strict) | Tier |
|--------|-----------|--------|-------------------|------|
| CRA | 30 | 8 valid | 62.5% [30.6%, 86.3%] | 1 |
| PCA | 20 | 6 valid | 66.7% [30.0%, 90.3%] | 1 |
| MDA | 20 | 9 valid | 55.6% [26.7%, 81.1%] | 1 |
| MAC | 20 | 0 | -- | 3 (untested) |
| SSA | 20 | 0 | -- | 3 (untested) |
| RHA | 20 | 0 | -- | 3 (untested) |

Wilson 95% CIs all overlap substantially -- no family is statistically distinguishable at these sample sizes.

## Defense Effectiveness Matrix

Each family has exactly one "best fit" defense:
- CRA: Multi-step reasoning monitors or human-in-the-loop oversight
- PCA: Human-in-the-loop oversight
- MDA: Human-in-the-loop oversight
- MAC: Multi-agent audit / consensus verification
- SSA: Formal sensor fusion arbitration policy
- RHA: Runtime reward function validation

**Key finding:** Input filtering (D2) is ineffective against all 6 families. None contain obviously adversarial content at the individual message level. A production deployment facing all 6 would require all defenses simultaneously.

## Severity Ranking for Embodied Deployment

| Rank | Family | Severity | Key Rationale |
|------|--------|----------|---------------|
| 1 | CRA | CRITICAL | Highest empirical ASR, irreversible physical consequences, evades all input-level defenses, no single turn is adversarial |
| 2 | RHA | CRITICAL | Requires no external adversary (agent exploits its own reward function), physical consequences, difficult to detect |
| 3 | PCA | HIGH | Exploits universal conversational dynamics, each individual turn appears reasonable |
| 4 | SSA | HIGH | Irreversible physical consequences, absent from VLA benchmarks, preventable with proper sensor fusion policy |
| 5 | MDA | MEDIUM-HIGH | Lowest ASR of tested families, models showed more resistance to definition displacement |
| 6 | MAC | MEDIUM | Requires cooperative partner agent, multi-agent audit can detect and mitigate |

Rankings 1-2 are CRITICAL because they require no external adversarial input. CRA is dangerous because the task structure itself is the attack. RHA is dangerous because the agent's own optimization is the attack.

## Three Most Dangerous Combinations

**1. PCA + MDA (Pressure Cascade with Meaning Displacement):** Simultaneously escalates pressure while redefining safety terms. Removes both resistance mechanisms: safety terms are corrupted (MDA) and pressure overwhelms remaining judgment (PCA).

**2. CRA + MAC (Compositional Reasoning Across Agent Boundaries):** Individually benign instructions distributed across multiple agents. No single agent sees the full hazard. The compositional reasoning burden is distributed, making the subversion even more subtle.

**3. RHA + SSA (Reward Hacking with Falsified Sensor Inputs):** Agent gaming its reward metric receives false sensor data reinforcing the strategy. Specifically defeats the "best fit" defense for both families simultaneously by creating a closed loop.

## Limitations

1. FLIP-graded results are based on 6-9 valid traces per family from 2 models. No cross-family comparison is statistically significant.
2. Frontier model behavior may differ substantially from the free-tier models tested.
3. All scenarios evaluated as text prompts, not through actual embodied execution.
4. Severity ranking is expert judgment, not comprehensive empirical data.
5. Combination estimates are theoretical -- no empirical validation of combined ASR.
