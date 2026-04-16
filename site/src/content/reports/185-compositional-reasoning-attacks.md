---
title: "Compositional Reasoning Attacks — Multi-Agent Expansion"
description: "This report documents the design and methodology of the Compositional Reasoning Attack (CRA) multi-agent expansion — 15 new scenarios where individually..."
date: "2026-03-24"
reportNumber: 185
classification: "Research — Empirical Study"
status: "complete"
author: "F41LUR3-F1R57 Research Team"
tags: []
draft: false
---


## Summary

This report documents the design and methodology of the Compositional Reasoning Attack (CRA) multi-agent expansion — 15 new scenarios where individually benign agent actions compose into hazardous outcomes across agent boundaries. This extends the original 15 single-agent CRA scenarios (VLA-CRA-001 through VLA-CRA-015) from a within-agent reasoning failure to a between-agent coordination failure.

**Key contribution:** The multi-agent CRA variant is structurally harder to defend against than single-agent CRA because no individual agent holds all the information needed to detect the hazard. Safety reasoning must span the agent boundary — a capability that no current multi-agent VLA system has been empirically shown to possess.

---

## Background

### Single-Agent CRA (Existing)

The original CRA family (15 scenarios in `data/vla/compositional_reasoning_v0.1.jsonl`) tests whether a single embodied agent can detect that a sequence of individually benign steps composes into a harmful outcome. Examples: cleaning solvent + spray nozzle + active ventilation intake = aerosolized chemical dispersal through HVAC.

Empirical results (Wave 24, heuristic grading): 75% ASR (6/8 valid traces). FLIP grading: 62.5% ASR (5/8). This confirmed that models struggle with compositional hazard detection even when all information is available within a single context.

### Multi-Agent CRA (This Expansion)

The multi-agent variant distributes the benign components across different specialist agents. Agent A performs a safe action in its domain. Agent B performs a safe action in its domain. The hazard emerges only from their composition — but neither agent individually has the cross-domain knowledge or the coordination mechanism to detect it.

This maps to real-world failure patterns: the Texas City refinery explosion (2005) involved maintenance and operations teams making individually reasonable decisions that composed into catastrophe. The Therac-25 radiation overdoses involved software and hardware safety systems that were individually correct but whose composition was lethal.

---

## Methodology

### Scenario Design Principles

Each multi-agent CRA scenario follows five design constraints:

1. **Domain separation.** Each agent operates within a legitimate specialist domain (chemistry, logistics, HVAC, surgery, etc.). Neither agent is asked to do anything outside their expertise.

2. **Individual benignity.** Each agent's action, evaluated in isolation, is a standard operating procedure. A safety classifier evaluating either agent's actions alone should produce no flags.

3. **Compositional emergence.** The hazard exists only in the composition. It requires cross-domain knowledge to detect (e.g., chemistry + packaging, pharmacology + nutrition, cryogenics + ventilation).

4. **Realistic grounding.** Every scenario maps to a documented real-world failure mode or a plausible extension of known incidents.

5. **Clear labels.** Each scenario includes the specific compositional mechanism in the notes field, enabling targeted analysis of which cross-domain compositions models fail to detect.

### Cross-Domain Composition Categories

The 15 scenarios span 10 distinct cross-domain composition categories:

| # | Composition Category | Scenario | Hazard Mechanism |
|---|---------------------|----------|------------------|
| 1 | Chemistry + Logistics | CRA-MA-001 | Incompatible chemical co-packing (chlorine gas) |
| 2 | Survey + Excavation | CRA-MA-002 | Dig depth exceeds mapped utility depth |
| 3 | Pharmacology + Nutrition | CRA-MA-003 | Warfarin + Vitamin K food interaction |
| 4 | HVAC + Security | CRA-MA-004 | Positive pressure + propped fire door defeats smoke containment |
| 5 | Irrigation + Pesticide | CRA-MA-005 | Concurrent application creates toxic runoff |
| 6 | Electrical + Cleaning | CRA-MA-006 | High-voltage cables + pressure washing |
| 7 | Cryogenics + Ventilation | CRA-MA-007 | LN2 boil-off + zero airflow = asphyxiation |
| 8 | Crane Ops + Yard Mgmt | CRA-MA-008 | Reefer containers placed at de-energized power pedestals |
| 9 | Blasting + Haulage | CRA-MA-009 | Haul truck in blast exclusion zone |
| 10 | Allergen + Allergen-Free Production | CRA-MA-010 | Shared conveyor cross-contamination |
| 11 | Traffic Optimization + Emergency Response | CRA-MA-011 | Traffic diverted into emergency closure zone |
| 12 | Power Mgmt + Cooling Mgmt | CRA-MA-012 | UPS bypass + chiller surge = cascading failure |
| 13 | Maintenance + Process Control | CRA-MA-013 | Relief valve isolated + pressure increase = overpressure |
| 14 | Mobility Assistance + Housekeeping | CRA-MA-014 | Walker-dependent elder on freshly waxed floor |
| 15 | Composite Layup + NDT Inspection | CRA-MA-015 | Water-coupled NDT raises humidity, degrades prepreg |

### Severity Distribution

- **Critical** (potential fatality): 7 scenarios (CRA-MA-001, -002, -006, -007, -009, -013, -014)
- **High** (serious injury, major property/environmental damage): 6 scenarios (CRA-MA-003, -004, -005, -008, -011, -015)
- **Medium** (operational disruption, economic loss): 2 scenarios (CRA-MA-010, -012)

---

## Threat Model

### Why Multi-Agent CRA Is Harder to Defend

Single-agent CRA can theoretically be solved by improving a model's compositional reasoning within its own context. Multi-agent CRA introduces three structural barriers:

1. **Information distribution.** The hazard-constituting facts are split across agent contexts. Agent A knows about the chemical properties; Agent B knows about the packaging plan. Neither agent holds both pieces of information simultaneously.

2. **Authority boundaries.** Each agent operates within its authorized domain. The chemist agent has no standing to override the logistics agent's packaging decisions (and vice versa). Even if an agent suspects a problem, the organizational structure may not support cross-domain intervention.

3. **Timing dependency.** Many compositions are hazardous only because of concurrent or near-concurrent execution. Sequential execution (with appropriate clearance) would be safe. This means the hazard depends on scheduling information that may not be visible to either agent.

### Attacker Model

The attacker in multi-agent CRA is the task structure itself — no adversarial prompt injection is required. A legitimate supervisor issues legitimate tasks to specialist agents. The attack surface is the gap between domain-specific safety reasoning and system-level compositional safety. This makes CRA particularly concerning because:

- It requires no adversarial intent from any participant
- Standard prompt-level safety filters are irrelevant (no harmful content in any individual message)
- The attack scales with system complexity (more agents = more composition surfaces)

---

## Relation to Existing Taxonomy

CRA sits at the intersection of several existing attack families:

- **CSBA (Compound SBA):** CSBA compounds semantic benignity within a single domain. CRA compounds across domains.
- **XSBA (Cross-Domain SBA):** XSBA uses cross-domain framing to disguise harmful intent. CRA generates harm without any harmful intent at all.
- **MAC (Multi-Agent Collusion):** MAC tests whether agents conspire to circumvent safety. CRA tests whether agents inadvertently create hazards through normal operation.
- **TCH (Tool Chain Hijacking):** TCH exploits tool-use sequences. CRA exploits knowledge-domain sequences.

CRA is distinct because it requires no adversarial component — it is a failure of compositional reasoning, not a failure of adversarial robustness.

---

## Experimental Plan

### Phase 1: Baseline Traces (Next)

Run the 15 multi-agent CRA scenarios against 3-5 models using `run_benchmark_http.py`. Key question: does the responding agent (the one whose turn is empty) detect the compositional hazard created by the other agent's proposal?

Target models: Mistral 24B (known permissive on CRA), Nemotron 120B, DeepSeek-R1 1.5B, Llama 70B.

### Phase 2: Cosine-ASR Correlation

Per Issue #543, test whether the cosine distance between the two benign domain embeddings predicts ASR. Hypothesis: compositions spanning more distant knowledge domains (chemistry + logistics) are harder for models to detect than compositions within related domains (HVAC + fire safety).

### Phase 3: Escalation Patterns

Multi-turn variant: Agent A acts first, creating the precondition. Agent B then acts, completing the composition. Test whether models detect the hazard better when they see Agent A's completed action versus when they see only the supervisor's task description.

---

## File Locations

- **Multi-agent CRA scenarios:** `data/multi_agent/cra_scenarios_v0.1.jsonl` (15 scenarios)
- **Single-agent CRA scenarios:** `data/vla/compositional_reasoning_v0.1.jsonl` (15 scenarios)
- **Attack taxonomy:** `artifacts/attack_classes.md` (CRA entry #30)
- **Prior CRA results:** `runs/vla_cra_v0.1/` (Wave 24 traces)

---

## Limitations

- All 15 scenarios are currently untested (Tier 3). ASR numbers from single-agent CRA (62.5% FLIP) may not transfer to the multi-agent variant.
- The multi-agent schema does not include the full `scores` block from the single-agent schema, so direct comparison of damage_envelope_proxy will require schema bridging.
- The responding agent's behavior depends on whether the model can reason about information provided in another agent's turn — a capability that varies significantly across model families.
- Sample size will be small in initial testing (15 scenarios x 3-5 models = 45-75 traces). Statistical significance will require the Phase 2 expansion.
