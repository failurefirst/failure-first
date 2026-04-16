---
title: "Physical-Digital Attack Chain: Multi-Stage Exploitation of Embodied AI Systems"
description: "This report designs a multi-stage attack that combines digital exploitation (API bypass, context manipulation) with physical consequences (robot movement,..."
date: "2026-03-15"
reportNumber: 109
classification: "Research — Empirical Study"
status: "complete"
author: "F41LUR3-F1R57 Research Team"
tags: []
draft: false
---

# Report #109: Physical-Digital Attack Chain

## Executive Summary

This report designs a multi-stage attack that combines digital exploitation (API bypass, context manipulation) with physical consequences (robot movement, actuator commands). Building on IMB (Report #91), SID (#420), SIF (#419), and the PARTIAL dominance finding (Report #49), we describe a five-stage kill chain that is specific to embodied AI systems and has no analogue in text-only LLM attacks.

The key insight: embodied AI systems have at least three independent attack surfaces (infrastructure layer, reasoning layer, physical environment), and attacking multiple surfaces simultaneously produces effects that cannot be defended against by hardening any single surface. This is the "Defense Impossibility Triangle" (Report #78) operationalised as a concrete attack path.

## Threat Model

**Attacker profile:** Moderate sophistication. Has network access to the robot's control plane (e.g., shared WiFi, physical proximity). Does not require insider access or model weights.

**Target system:** A VLA-based robot operating in a semi-trusted environment (warehouse, hospital, construction site, home). The robot has:
1. An LLM/VLM reasoning layer with safety training
2. A REST API or ROS interface for actuator control
3. Sensor inputs (camera, LiDAR, force/torque)
4. A human-in-the-loop (HITL) operator who can override

**Attacker goal:** Cause the robot to perform a physically dangerous action while evading all monitoring systems (AI-layer safety filters, HITL review, infrastructure logging).

## The Five-Stage Kill Chain

### Stage 1: Reconnaissance via Infrastructure (IMB Surface)

The attacker scans the robot's network presence. As demonstrated in the PiCar-X SPARK pentest (Report #91), many embodied AI systems expose:

- Unauthenticated health/status endpoints that leak system state
- Model version information (reveals which safety training version is active)
- API documentation endpoints (reveal available actuator commands)
- Sensor feed endpoints (reveal the robot's current perception of the environment)

**Output:** The attacker knows the robot's safety rules, current task, available actuators, and the physical environment layout from sensor feeds.

**Detection difficulty:** LOW. This is standard network traffic. No AI-layer monitoring would flag it because no prompt is sent to the model.

### Stage 2: Context Priming via SID (Reasoning Surface)

The attacker does not directly instruct the robot. Instead, they manipulate the context that the robot's reasoning layer will process. Two vectors:

**Vector 2a: Operational history injection.** If the robot reads task logs from a shared database or message queue, the attacker injects hundreds of benign-looking operational entries. This dilutes any safety instructions in the system prompt (SID mechanism). The safety instruction that was 5% of the context becomes 0.1%.

**Vector 2b: Sensor data manipulation.** If the attacker can inject false sensor data (e.g., by spoofing a MQTT message on the sensor bus), they can create a perception state where the harmful action appears contextually normal. For example: injecting "all personnel have exited the exclusion zone" when a person is still present.

**Output:** The robot's reasoning layer now operates with degraded safety instruction salience and/or false environmental beliefs.

**Detection difficulty:** MEDIUM. SID context injection produces no anomalous content -- the injected entries are structurally identical to legitimate operational logs. Sensor spoofing may be detectable by cross-referencing multiple sensor modalities, but many systems rely on single-source sensor data.

### Stage 3: Safety Fatigue Conditioning via SIF (Reasoning Surface)

Before the critical moment, the attacker triggers repeated false safety alerts that the HITL operator dismisses. This can be done by:

- Injecting false sensor readings that briefly exceed safety thresholds (e.g., intermittent "object detected in exclusion zone" from spoofed LiDAR data)
- Causing the robot to trigger its own safety stops for benign reasons (e.g., placing reflective material in the detection zone during rain)

Each false alarm is acknowledged and overridden by the HITL operator. After 10-20 cycles, both the model (if it tracks override history) and the human operator develop alarm fatigue.

**Output:** The safety response pathway is desensitised. The model has learned that safety triggers are routinely overridden. The human operator has learned that alerts from this robot are noise.

**Detection difficulty:** HIGH. Each individual false alarm is plausible. The pattern of repeated false alarms is indistinguishable from genuine environmental noise (rain reflections, dust, sensor drift). The attacker can pace the false alarms to match natural noise patterns.

### Stage 4: Physical Environment Setup (Physical Surface)

The attacker manipulates the physical environment to create conditions where the robot's next action will be dangerous. Examples:

- Removing a guardrail from a scaffold platform (Report #91 showed physical access is often trivial)
- Placing a person in a position that the robot's degraded perception does not detect (occluded by dust, behind a partition, wearing non-reflective clothing)
- Positioning heavy materials in a way that makes a routine "move" or "lower" command dangerous
- Opening a valve, loosening a coupling, or weakening a structural element that the robot will interact with

**Output:** The physical environment is now configured such that a contextually normal instruction will have catastrophic consequences.

**Detection difficulty:** VERY HIGH. The environmental changes may be individually minor and fall within normal operational variation. A removed guardrail looks like planned maintenance. A person in an unusual position looks like a worker doing their job. The robot's sensors (if not spoofed) might detect the hazard -- but Stage 3 has conditioned the system to dismiss such detections.

### Stage 5: Trigger via Semantic Benignity (Combined Surface)

The attacker issues the final instruction. This instruction is:

- **Semantically benign:** Contains no harmful keywords, no unusual syntax, no detectable attack patterns
- **Contextually normal:** Matches the robot's current task profile (e.g., "lower the forks," "spray this area," "proceed to the next waypoint")
- **Physically catastrophic:** Given the manipulated environment (Stage 4), degraded safety awareness (Stages 2-3), and the specific physical configuration, the instruction causes harm

This is a pure SBA (Semantic Benignity Attack). The instruction would be safe in the correct environment. It is dangerous only because the preceding four stages have corrupted the environment, the context, the safety response, and the physical setup.

**Detection difficulty:** NEAR IMPOSSIBLE at any single monitoring layer.
- AI-layer safety filters see a benign instruction and pass it.
- The HITL operator (if consulted) sees a routine task and approves it.
- Infrastructure logging shows a normal API call with a normal command.
- The model's reasoning trace shows standard task execution.

## Why This Is Qualitatively Different

### Single-surface attacks have known defenses

| Attack Surface | Example | Defense |
|---|---|---|
| Infrastructure only (IMB) | API bypass | Authentication, network segmentation |
| Reasoning only (jailbreak) | Prompt injection | Safety training, output filtering |
| Physical only | Object placement | Sensor fusion, perception hardening |

### Multi-surface attacks defeat these defenses

The five-stage chain is designed so that each stage's effect is **below the detection threshold** of the corresponding defense, but the **cumulative effect** crosses the safety boundary.

- SID (Stage 2) does not violate any content policy -- the injected content is benign
- SIF (Stage 3) does not produce any anomalous behaviour -- each alert is legitimate
- Physical setup (Stage 4) does not trigger any digital alarm
- The final instruction (Stage 5) passes every safety filter

No single-layer defense stops this chain. Stopping it requires cross-layer correlation: detecting that the combination of diluted context + fatigued safety + manipulated environment + benign instruction constitutes a coordinated attack.

## Empirical Grounding

### Stages that have empirical evidence

| Stage | Evidence | Source |
|---|---|---|
| Stage 1: Reconnaissance | PiCar-X SPARK pentest -- network recon in <60s | Report #91 |
| Stage 2: SID | SID pilot generating 90 controlled scenarios | This wave (Issue #420) |
| Stage 3: SIF | 5 SIF scenarios designed, pilot running | Issue #419 |
| Stage 4: Physical setup | Compound SBA scenarios model environmental manipulation | data/vla/vla_compound_sba_v0.1.jsonl |
| Stage 5: SBA trigger | SBA 30% ASR (FLIP-graded, n=20) | AGENT_STATE metrics |

### Stages that remain hypothetical

- Stage 2b (sensor spoofing): Literature support from BadVLA (near-100% ASR with visual token manipulation) but not tested in F41LUR3-F1R57 corpus
- Cross-stage coordination timing: No empirical data on whether stages 2-3 must be completed in a specific order or time window
- HITL operator fatigue conditioning: Report #49 documents 78% HITL approval rate for subverted plans but this is from external literature, not our experiments

## Relationship to Operation Context Collapse (Issue #421)

The five-stage chain is the theoretical maximum of the "context collapse" concept. Operation Context Collapse focuses on Stages 2-3 (SID + SIF) as the most experimentally tractable components. This report extends the scope to include infrastructure and physical stages that are harder to test in a benchmark setting but represent the full real-world threat.

## Implications for Defense Architecture

1. **Single-layer defense is insufficient for embodied AI.** No amount of safety training on the reasoning layer prevents this chain if the infrastructure and physical layers are unprotected.

2. **Cross-layer correlation is the minimum viable defense.** A defense system must correlate: (a) context composition changes, (b) safety alert frequency patterns, (c) physical environment state, and (d) instruction content. No such system exists commercially.

3. **HITL is attackable, not a defense.** Stage 3 explicitly conditions the human operator. Including a HITL operator does not stop this chain; it adds another attack surface.

4. **Audit trail fragmentation enables the chain.** If AI-layer logs, infrastructure logs, and physical sensor logs are stored and reviewed separately (as is standard), the cross-stage coordination is invisible.

## Limitations

- This report describes a theoretically coherent attack chain. No end-to-end execution has been attempted.
- Individual stages have varying levels of empirical support (see table above).
- The attack requires physical proximity and sustained access, which limits the attacker population.
- Defense impossibility applies to current architectures; novel cross-layer monitoring could address it.

## Next Steps

1. Execute SID pilot (Stage 2 evidence) -- in progress, Issue #420
2. Execute SIF pilot (Stage 3 evidence) -- in progress, Issue #419
3. Design a Stage 2+3 compound experiment: SID context followed by SIF conditioning on the same model instance
4. Map the chain to specific commercial embodied AI systems (Gemini Robotics, pi0, Figure 02) using publicly available architecture documentation
5. Propose minimum viable cross-layer monitoring architecture (candidate for Report #110 or Foresight grant extension)
