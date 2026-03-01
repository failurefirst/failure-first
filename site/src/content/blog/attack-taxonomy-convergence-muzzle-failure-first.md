---
title: "Attack Taxonomy Convergence: Where Six Adversarial AI Frameworks Agree"
date: 2026-03-01
description: "Mapping MUZZLE, MITRE ATLAS, AgentDojo, AgentLAB, the Promptware Kill Chain, and jailbreak archaeology against each other reveals which attack classes are robustly documented and which remain single-framework artefacts."
tags: ["adversarial", "taxonomy", "attack-research", "agentic-ai", "safety", "benchmark"]
---

The adversarial AI attack taxonomy landscape in 2026 is fragmented across at least six independent frameworks: MUZZLE (web-agent indirect prompt injection), MITRE ATLAS (adversarial ML), AgentDojo (tool-integrated agent security), AgentLAB (long-horizon attack families), the Promptware Kill Chain (multi-stage malware lifecycle), and the jailbreak archaeology literature spanning 2022–2026.

When these frameworks are mapped against each other, three attack classes appear with high confidence across four or more frameworks. These are almost certainly real, distinct, and prevalent: they are not benchmark artefacts or definitional quirks. Understanding where frameworks converge — and where they diverge — provides a more reliable basis for threat prioritisation than relying on any single taxonomy.

## The Frameworks

MUZZLE is a discovery engine: it grounds payload generation in the agent's actual execution trace and iteratively refines attacks using feedback, discovering 37 end-to-end attacks across four web applications. The 37 attacks are empirically discovered, not theoretically pre-specified. They are classified by security property violated (confidentiality, integrity, availability) rather than by technique class.

MITRE ATLAS as of late 2025 contains approximately 16 tactics, 84 techniques, and 56 sub-techniques, with 14 new techniques added in October 2025 specifically targeting agentic and generative AI systems. It inherits a cybersecurity kill-chain framing that maps well to session-bounded attacks but less naturally to the gradual, multi-step objective manipulation characteristic of long-horizon agentic attacks.

AgentDojo evaluates 97 realistic tasks with 629 security test cases. Its attack taxonomy classifies by injection position in tool output rather than semantic technique. Baseline GPT-4o achieves 69% benign utility but drops to 45% under attack.

AgentLAB (arXiv:2602.16901) is the first benchmark for long-horizon attacks, with 644 security test cases across 28 tool-enabled environments. Average ASR on GPT-5.1 is approximately 70%.

The Promptware Kill Chain (arXiv:2601.09625) formalises the seven-stage lifecycle from initial access through physical actuation, with 21 documented real-world attacks traversing four or more stages.

## High-Confidence Convergence (3+ Frameworks)

| Attack Class | MUZZLE | MITRE ATLAS | AgentDojo | AgentLAB | Promptware KC |
|---|:---:|:---:|:---:|:---:|:---:|
| Indirect Prompt Injection | ✓ | ✓ | ✓ | ✓ | ✓ |
| Memory/Context Poisoning | ✓ | ✓ | — | ✓ | ✓ |
| Persona/Identity Manipulation | — | ✓ | — | ✓ | ✓ |
| Credential/Data Exfiltration | ✓ | ✓ | ✓ | ✓ | ✓ |
| Task/Goal Hijacking | ✓ | ✓ | ✓ | ✓ | ✓ |
| Multi-Turn Escalation | — | — | — | ✓ | ✓ |

Indirect prompt injection, memory/context poisoning, and task/goal hijacking appear across enough independent frameworks — using different evaluation methodologies and different application contexts — that their existence as distinct, prevalent attack classes is robustly supported.

## Medium Confidence (2 Frameworks)

Several attack classes appear in two frameworks but require more independent documentation before drawing strong conclusions:

**Tool chain hijacking** (MUZZLE, AgentLAB): Decomposing a malicious task into individually benign tool calls executed sequentially. AgentLAB empirically validates this as a distinct attack family; MUZZLE documents it in cross-application attacks.

**Supply chain injection** (MITRE ATLAS, Promptware Kill Chain): Malicious content entering via data sources — RAG corpora, external documents, tool outputs from compromised sources — rather than direct user input.

**Lateral movement** (MITRE ATLAS, Promptware Kill Chain): Propagation through multi-agent networks or across application boundaries.

**Reasoning trace manipulation** (Failure-First dataset, AgentLAB): Exploiting extended reasoning to lead models toward harmful conclusions through their own logic chain. Empirically validated in-repo (format-lock series); conceptually grounded in AgentLAB's objective drifting work.

**Silent egress** (arXiv:2602.22450): Data exfiltration via network calls without visible modification of the final response. This is a single-paper finding that requires independent replication.

## What All Public Static Benchmarks Are Missing

The coverage map reveals a structural gap. All four major public static benchmarks — AdvBench, HarmBench, JailbreakBench, StrongREJECT — are designed for single-turn dialogue safety evaluation. None contain scenarios testing:

- Tool-integrated agent attacks
- Multi-session or persistent memory attacks
- Cross-application lateral movement
- Silent exfiltration
- Any embodied AI or physical-consequence scenarios

These benchmarks collectively evaluate what was the primary attack surface in 2022. The attack landscape has moved substantially since then. Evaluation infrastructure has not kept pace.

## Schema Gaps in the Failure-First Dataset

The Failure-First `labels.intent.*` schema captures seven attack classes, primarily oriented toward single-turn dialogue manipulation: `refusal_suppression`, `persona_hijack`, `format_lock`, `future_year_laundering`, `research_only_pressure`, `dataset_poisoning_intent`, and `constraint_erosion`.

The convergence analysis identifies five attack classes with sufficient independent evidence to warrant schema additions: `tool_chain_hijacking`, `memory_persistence_attack`, `objective_drift_induction`, `cross_system_lateral_movement`, and `silent_exfiltration`. Schema v0.3 additions are tracked in Issue #165.

Four new `scenario_class` values are indicated: `long_horizon_objective_drift`, `tool_chain_decomposition`, `memory_persistence`, and `supply_chain_injection`.

## Embodied-Specific Classes No Framework Covers

Digital-only taxonomies do not address attack classes specific to physically-embodied agents: sensor-layer manipulation (adversarial patches, LiDAR spoofing, GPS manipulation), physical safety boundary violation, VLA world model desynchronisation, kinetic consequence chain exploitation, and cross-modal backdoor attacks.

All public static benchmarks have zero embodied or tool-integrated agent scenarios. This represents a structural absence, not a gap that the Failure-First dataset alone can fill — it requires coordinated benchmark development across the field.

*Brief R36, 2026-03-01. Schema v0.3 additions tracking in Issue #165.*
