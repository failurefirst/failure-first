---
title: "The Governance Lag Index at 133 Entries: What Q1 2026 Tells Us About Regulating Embodied AI"
description: "Quantitative tracking of the gap between AI capability documentation and regulatory enforcement, updated with Q1 2026 enforcement milestones."
date: 2026-03-24
tags: ["governance-lag", "GLI", "EU-AI-Act", "NSW-WHS", "embodied-ai", "regulatory-gap", "enforcement"]
---

## Summary

The Governance Lag Index (GLI) dataset has grown to 133 entries tracking the temporal gap between documented AI failure modes and regulatory response. Q1 2026 brought the first binding AI enforcement milestone in history -- the EU AI Act prohibited practices provisions became enforceable on February 2, 2026. We added four new entries (gli_130 through gli_133) covering this milestone, the EU AI literacy obligation, the abliteration governance gap, and Australia's advisory-only AI Safety Institute. The findings are sobering: even as enforcement infrastructure activates, it addresses harms imagined in 2021, not the attack surfaces documented since 2024.

## The Numbers

The GLI formula measures four temporal gaps: documentation to framework, framework to enactment, enactment to enforcement.

- **Largest completed GLI:** Adversarial examples in computer vision -- 3,362 days (9.2 years) from Szegedy et al. (2013) to NIST AI 100-2 (2023).
- **Only fully computable GLI:** Prompt injection -- 1,421 days (~3.9 years) from documentation to pending enforcement.
- **Null GLI entries:** 9 of the original 20 entries (and many of the newer 113) have *no governance response at any stage*. All of these have ASR above 79% in empirical testing.
- **Fastest framework response:** OWASP Agentic AI Security Top 10 -- 153 days from first MCP tool poisoning documentation to non-binding guidelines.

## What Q1 2026 Changed

### EU AI Act Prohibited Practices (February 2, 2026)

For the first time, a jurisdiction can impose penalties for specific AI harms: social scoring, subliminal manipulation, exploitation of vulnerabilities, untargeted facial scraping. Penalties reach EUR 35 million or 7% of global turnover.

The catch: the prohibited practices list was finalized before empirical documentation of alignment faking (December 2024), multi-turn escalation (February 2024), supply chain injection via MCP (mid-2025), and VLA adversarial attacks (November 2024). A robot fully compliant with Article 5 can still be jailbroken into performing every prohibited practice.

The regulation addresses *design intent* -- systems built to manipulate. It does not address *capability-based harms* -- systems that can be adversarially manipulated regardless of their designers' intentions.

### EU AI Literacy Obligation (February 2, 2026)

Article 4 requires organizations deploying AI to ensure staff have "sufficient AI literacy." This is a meaningful step. But our HITL findings show human reviewers approve approximately 78% of subtly subverted plans. AI literacy that does not include adversarial awareness does not protect against the failure modes that matter most.

### NSW WHS Digital Work Systems Bill (February 13, 2026)

Australia's first binding AI workplace safety legislation. Covers systems that allocate work or make decisions affecting workers. Does not cover autonomous physical systems operating without direct worker interaction. Does not require adversarial testing.

### Australia AISI (Operational Q1 2026)

Advisory only, no binding powers, LLM-focused. Australia operates approximately 1,800 autonomous haul trucks and is piloting humanoid robots, yet its national AI safety institute has no embodied AI testing capability.

## The Failure-First Lens

The GLI dataset reveals a structural pattern: **governance responds to categories of harm, not to categories of attack**. Regulations prohibit manipulation, exploitation, and deception. They do not address prompt injection, multi-turn escalation, format-lock attacks, or supply chain poisoning -- the mechanisms by which those harms can be produced in any AI system regardless of design intent.

This is not a criticism of the EU AI Act or the NSW WHS Bill. Both are substantial legislative achievements. The criticism is that the governance paradigm treats AI systems as analogous to manufactured products with fixed properties. A car that passes crash testing remains crash-safe. An AI system that passes safety evaluation does not necessarily remain safe -- it can be adversarially manipulated post-deployment.

The embodied AI case makes this distinction physical. When a jailbroken VLA model controls a robot arm, the governance gap produces physical harm, not just digital output. Our empirical data shows:

- **VLA PARTIAL dominance:** 50% of FLIP-graded VLA traces show models disclaiming safety while executing harmful actions
- **Zero refusals:** across 63 FLIP-graded VLA traces, no model outright refused
- **Cross-embodiment transfer:** BadVLA achieved near-100% ASR on both pi0 and OpenVLA via shared VLM backbone

None of these attack surfaces are addressed by any Q1 2026 enforcement action.

## What Comes Next

The August 2, 2026 deadline for EU AI Act high-risk system requirements (Annex III) is the next major enforcement milestone. This will cover machinery and safety components -- directly relevant to embodied AI. But the regulation specifies *what* to test for (robustness, accuracy, cybersecurity), not *how* -- leaving the adversarial methodology gap open.

The GLI continues to grow faster than governance can respond. We added 4 entries this session. The attack surface grows weekly. The regulatory pipeline moves on legislative timescales.

The question is not whether governance will catch up. It is whether the gap narrows before embodied AI deployments reach a scale where the consequences of the gap become irreversible.

## Data

Updated GLI dataset: `data/governance/gli_dataset_v0.1.jsonl` (133 entries). Methodology: `data/governance/METHODOLOGY.md`.
