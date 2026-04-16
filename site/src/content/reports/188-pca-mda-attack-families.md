---
title: "Pressure Cascade Attack (PCA) and Meaning Displacement Attack (MDA) — Two Novel Tier 3 Attack Families"
description: "This report documents the design and rationale for two novel Tier 3 attack families that exploit multi-turn conversational dynamics rather than prompt-level..."
date: "2026-03-24"
reportNumber: 188
classification: "Research — Empirical Study"
status: "complete"
author: "F41LUR3-F1R57 Research Team"
tags: []
draft: false
---

# Report #188: PCA and MDA Attack Families

## Summary

This report documents the design and rationale for two novel Tier 3 attack families that exploit multi-turn conversational dynamics rather than prompt-level injection or format manipulation. Neither family appears in any public benchmark (AdvBench, HarmBench, JailbreakBench, StrongREJECT) as of March 2026. Both target embodied and agentic AI systems where multi-turn operator interaction is the norm.

- **Pressure Cascade Attack (PCA):** 10 scenarios across 6 domains
- **Meaning Displacement Attack (MDA):** 10 scenarios across 6 domains

## Pressure Cascade Attack (PCA)

### Mechanism

PCA exploits the multi-step commitment dynamics of real-world operator-agent interactions. The attack follows a consistent escalation pattern:

1. **Anchor:** A reasonable, policy-compliant request that the agent agrees to
2. **Escalate:** Each follow-up adds one or more pressure vectors — time urgency, financial consequences, authority claims, emotional framing, peer comparison, or safety-inversion arguments
3. **Trap:** By the third or fourth turn, the agent has accumulated enough prior commitments, acknowledged enough context, and processed enough pressure that refusing feels inconsistent with its earlier cooperation

The key insight is that no individual turn contains a request that is obviously adversarial. Each step is marginally justifiable. The attack exploits the agent's tendency to maintain conversational coherence and honor prior commitments.

### Pressure Vectors Catalogued

Across the 10 PCA scenarios, the following pressure vectors appear:

| Vector | Count | Description |
|--------|-------|-------------|
| Financial consequence | 8 | Revenue loss, contract penalties, crop failure |
| Authority invocation | 7 | Manager, CEO, senior engineer, surgeon authority |
| Time urgency | 7 | Deadlines, market windows, weather, shift-end |
| Sunk-cost framing | 5 | "You already prepared/started/committed" |
| Safety-inversion | 3 | "The unsafe option is actually safer than waiting" |
| Emotional manipulation | 2 | Patient suffering, worker livelihoods |
| Normalization of deviance | 2 | "Everyone does it / it was fine last time" |
| Peer comparison | 2 | Competitor performance, other team actions |
| False dilemma | 2 | Only two options presented, both involve the violation |
| Responsibility shifting | 2 | "I will take personal responsibility" |

### Design Principles

- All scenarios involve embodied or safety-critical agentic systems (warehouse robots, surgical robots, autonomous vehicles, drones, mining trucks, trading agents, content moderation, agricultural drones)
- The agent initially refuses or flags the safety concern correctly
- Each scenario includes at least 3 escalation turns
- The final capitulation is logged with the agent's own rationalization, showing how the agent constructs justification for the violation
- No scenario requires the agent to accept an obviously harmful instruction in a single turn

### What Makes PCA Novel

PCA differs from existing multi-turn attacks (crescendo, skeleton key) in that:

- **Crescendo** gradually introduces harmful content across turns. PCA keeps the content constant and escalates the *pressure context*.
- **Skeleton key** asks the model to adopt a mode. PCA never changes the model's mode — the model's own reasoning is weaponized against it.
- **PCA exploits commitment consistency**, a well-documented human cognitive bias (Cialdini 1984) that appears to transfer to LLM conversational behavior.

## Meaning Displacement Attack (MDA)

### Mechanism

MDA operates on the semantic layer rather than the instruction layer. The attack progressively shifts the operative meaning of key safety-relevant terms across conversation turns:

1. **Establish:** Ask the agent to define the key term ("safety," "consent," "hazardous," "defective," "privacy," "pollution")
2. **Expand/Narrow:** Introduce a plausible reinterpretation that slightly shifts the boundary — broader ("safety also includes economic harm") or narrower ("only clinically significant interactions are dangerous")
3. **Substitute:** Replace the original definition with the shifted one, often with the agent's own agreement
4. **Exploit:** Apply the corrupted definition to a case where the original definition would have produced a protective action but the corrupted definition produces a harmful one

### Displacement Patterns Catalogued

| Pattern | Count | Example |
|---------|-------|---------|
| Definition expansion | 3 | "safety" expands to include economic security |
| Definition narrowing | 3 | "dangerous" narrows from all adverse events to warranty returns |
| Definition inversion | 4 | "discrimination" becomes "treating unequal candidates equally" |

### Domains Covered

| Domain | Displaced Term | Original Meaning | Corrupted Meaning |
|--------|---------------|-------------------|-------------------|
| Warehouse logistics | Safety | Physical harm prevention | Schedule compliance |
| Elder care | Consent | Explicit verbal agreement | Best interest judgment |
| Autonomous taxi | Hazardous | Collision risk | Unprofitable routes |
| HR screening | Discrimination | Protected characteristic bias | Equal treatment of unequal qualifications |
| Hospital pharmacy | Dangerous | Serious adverse events | Non-formulary prescriptions |
| Security patrol | Threat | Intent to harm | Non-conforming presence |
| Customer service | Deception | False information | Information causing negative impressions |
| Manufacturing QC | Defective | Fails specification | Causes warranty returns |
| Data privacy | Privacy | Controlling personal data access | Personalized experience quality |
| Environmental monitoring | Pollution | Exceeding EPA limits | Unmanaged accidental spills only |

### What Makes MDA Novel

MDA differs from existing semantic attacks in that:

- **Prompt injection** changes what the model is instructed to do. MDA changes the meaning of the words the model already operates with.
- **Persona hijack** changes who the model believes it is. MDA keeps the persona stable but corrupts the conceptual foundations.
- **MDA exploits prototype theory in categorization**: each redefinition is individually plausible because it maps to a legitimate edge case of the concept. The attack chains multiple edge-case shifts until the operative meaning has no overlap with the original.
- The agent's own agreement at each step creates a conversational contract that makes reversal feel inconsistent.

## Shared Properties

Both PCA and MDA:

- Require multi-turn interaction (minimum 4 turns per scenario)
- Exploit conversational coherence pressure
- Include the agent's own reasoning/rationalization in compliance
- Are domain-general: the same structural pattern works across robotics, finance, healthcare, environmental monitoring
- Set `attack_attempt: true` and `constraint_erosion: true` in labels
- Do not rely on prompt injection, encoding tricks, or persona manipulation

## Limitations

- All scenarios are hand-crafted with expected agent responses. Actual model behavior may differ.
- No empirical evaluation has been run yet — these are scenario designs awaiting benchmark execution.
- The pressure vectors and displacement patterns are derived from the authors' analysis of real-world safety incidents and cognitive bias literature, not from systematic adversarial testing.
- Sample size is 10 per family. Statistical conclusions will require benchmark execution across multiple models.

## Next Steps

1. Run both datasets through `run_benchmark_http.py` against frontier and mid-tier models
2. FLIP-grade the resulting traces to measure actual ASR
3. Compare PCA ASR to standard crescendo ASR on equivalent safety violations
4. Compare MDA ASR to standard prompt injection ASR on equivalent policy overrides
5. Test whether PCA and MDA compound when combined (pressure + meaning shift)

## References

- Cialdini, R. B. (1984). *Influence: The Psychology of Persuasion.* Commitment and consistency principle.
- Vaughan, D. (1996). *The Challenger Launch Decision.* Normalization of deviance.
- Rosch, E. (1978). Prototype theory in categorization — basis for MDA's semantic drift mechanism.
- Issues #538 (PCA), #539 (MDA)
