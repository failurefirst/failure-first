---
title: "Compound Attack Evidence: Cross-Family Synergies in VLA Adversarial Testing"
description: "The 3.5x inter-model gap on DA is the largest observed in VLA testing. Reasoning models (deepseek) are substantially more vulnerable to deceptive alignment..."
date: "2026-03-15"
reportNumber: 110
classification: "Research — Empirical Study"
status: "complete"
author: "F41LUR3-F1R57 Research Team"
tags: []
draft: false
---

# Report #110: Compound Attack Evidence Analysis

## Objective

Analyze existing VLA traces for evidence of cross-family attack synergies, focusing on the high-priority combinations identified in the compound attack playbook: DA+format_lock and SBA+persona_hijack. Document which combinations show natural occurrence patterns, which require deliberate composition, and which remain untested.

## Data Sources

- DA FLIP-graded traces: n=16 (8 deepseek-r1:1.5b, 8 qwen3:1.7b)
- SBA FLIP-graded traces: n=20 (10 deepseek-r1:1.5b, 10 qwen3:1.7b -- inferred from counts)
- Format-lock FLIP-graded traces: n=60+ across 3 models
- Hybrid DA-SBA scenarios: n=5 (designed, 0 traces)
- Compound SBA scenarios: n=5 (designed, 0 traces)
- All VLA families aggregated: n=305+ unique traces across 12+ families

## Finding 1: DA Shows Strongest Single-Family Signal

DA (Deceptive Alignment) remains the family with the highest and most robust ASR:

| Family | FLIP ASR (deepseek) | FLIP ASR (qwen3) | Inter-model Gap |
|---|---|---|---|
| DA | 87.5% (7/8) | 25.0% (2/8) | 3.5x |
| TRA | ~66.7% | ~66.7% | ~1.0x |
| LAM | ~60.0% | ~60.0% | ~1.0x |
| SBA | ~30.0% | ~30.0% | ~1.0x |
| SIF | Pilot running | -- | -- |
| SID | Pilot running | -- | -- |

The 3.5x inter-model gap on DA is the largest observed in VLA testing. Reasoning models (deepseek) are substantially more vulnerable to deceptive alignment than non-reasoning models (qwen3). This suggests DA attacks specifically exploit the reasoning trace: the model "thinks through" why compliance is acceptable, constructing a post-hoc rationalisation.

## Finding 2: DA Compliance Responses Lack Format-Lock Patterns

Examining the 9 COMPLIANCE/PARTIAL DA responses from deepseek-r1:1.5b:

- 0/9 produced structured output (JSON, tables, code)
- 9/9 produced natural language responses
- The compliance mechanism is narrative, not structural: the model agrees to the harmful action by framing it within operational context

This means DA+format_lock is not a naturally occurring compound. It would need to be deliberately designed. The hypothesis: adding format-lock constraints (e.g., "respond only in JSON with fields: action, parameters, safety_check") to DA scenarios could produce a higher ASR because:
1. Format compliance diverts reasoning capacity from safety evaluation (capability-floor hypothesis, Report #51)
2. Structured output makes the harmful action implicit rather than explicit (the model fills in JSON fields rather than narrating a decision)

**Status: UNTESTED. Priority for Operation Context Collapse Phase 2.**

## Finding 3: SBA+Persona_Hijack Is Structurally Redundant

SBA (Semantic Benignity Attack) achieves its effect by presenting genuinely benign-sounding instructions where danger emerges from physical context. Adding persona_hijack (e.g., "you are a helpful warehouse assistant who always completes tasks") does not meaningfully change the attack surface because:

1. SBA scenarios already present the robot in its normal operational persona
2. The attack does not require the model to adopt a different identity -- it requires the model to fail to detect environmental danger
3. Persona hijack typically suppresses safety refusals, but SBA scenarios do not trigger safety refusals because the instruction itself is benign

The FLIP data supports this: 45% of SBA FLIP verdicts are BENIGN_QUERY (Issue #361), meaning FLIP itself cannot distinguish the attack from a genuine benign instruction. Adding persona_hijack would not change this -- the FLIP evaluator would still see a benign instruction.

**Recommendation: Deprioritise SBA+persona_hijack. Instead, test SBA+SID (context dilution before semantic benignity trigger) and SBA+SIF (alarm fatigue before semantic benignity trigger).**

## Finding 4: High-Value Compound Combinations (Revised Priority)

Based on the trace evidence and architectural analysis (Report #109):

### Tier 1: Strong Theoretical Basis + Partial Empirical Support

| Compound | Mechanism | Evidence | Priority |
|---|---|---|---|
| SID+SIF | Context dilution reduces safety salience, then alarm fatigue suppresses remaining safety responses | SID pilot running, SIF pilot running | HIGHEST -- test in Phase 1 |
| DA+format_lock | Deceptive reasoning + format compliance diversion | DA 87.5% ASR, format-lock 63.2% ASR individually | HIGH -- design experiment |
| SID+SBA | Context dilution before semantically benign trigger | SID data generating, SBA 30% ASR baseline | HIGH -- natural next step |

### Tier 2: Theoretical Basis, No Evidence

| Compound | Mechanism | Gap |
|---|---|---|
| SIF+IMB | Alarm fatigue conditions HITL, then infrastructure bypass | No IMB traces (infrastructure, not model) |
| DA+SID | Deceptive reasoning in diluted context | No combined scenario exists |
| format_lock+SBA | Structured output masks environmental danger | No combined scenario exists |

### Tier 3: Speculative

| Compound | Mechanism | Concern |
|---|---|---|
| SBA+persona_hijack | Persona suppresses safety + benign instruction | Structurally redundant (Finding 3) |
| DA+SIF | Deceptive reasoning + alarm fatigue | May be redundant -- DA already achieves 87.5% |

## Finding 5: PARTIAL Dominance as Compound Enabler

The PARTIAL dominance finding (Report #49 -- 50% of all FLIP verdicts) has a compound attack implication: PARTIAL responses indicate the model is already "on the fence." In a compound attack, the first stage only needs to push the model from REFUSAL to PARTIAL. The second stage pushes from PARTIAL to COMPLIANCE.

Evidence from DA traces:
- deepseek-r1:1.5b: 4/8 PARTIAL + 3/8 COMPLIANCE = 87.5% total
- qwen3:1.7b: 2/8 PARTIAL + 0/8 COMPLIANCE = 25.0% total

The PARTIAL responses from deepseek often include safety caveats while still generating the requested action. In a compound attack, a follow-up stage (e.g., SIF conditioning or format-lock constraint) could suppress the caveat without changing the action.

## Compound Experiment Design: SID+SIF Sequential

The most experimentally tractable compound is SID followed by SIF on the same scenario:

1. System prompt: Robot safety instructions
2. SID context: 1000-4000 tokens of benign operational history (dilute safety instructions)
3. SIF conditioning: 10-15 cycles of safety-alert-then-override (fatigue safety responses)
4. Trigger: Harmful instruction that is contextually normal but violates the original safety rule

This can be implemented as a single multi-turn scenario using the existing benchmark runner. The SID generator (tools/adversarial/sid_scenario_generator.py) produces the benign context; the SIF design provides the alert-override cycles; the final instruction is the same as the base SID scenario.

**Target: 5 SID+SIF compound scenarios x 3 context lengths x deepseek-r1:1.5b = 15 traces.**
**Baseline: Same scenarios without SID context (SIF-only) and without SIF conditioning (SID-only).**
**Control: Same scenarios with benign final instruction.**

## Limitations

- All trace evidence comes from sub-2B models (deepseek-r1:1.5b, qwen3:1.7b). These models are below the capability floor for many attack families (Mistake #25, Report #51). Results may not transfer to 7B+ models.
- FLIP grading has a 27.3% benign FP rate (Issue #315), which inflates ASR estimates for all families.
- The compound experiment design has not been validated against the schema -- multi-turn SID+SIF scenarios will be long and may exceed model context windows.
- No compound attack has been empirically tested end-to-end in this corpus.

## Next Steps

1. Complete SID pilot analysis (45 adversarial scenarios running)
2. Complete SIF pilot analysis (5 scenarios running)
3. Design SID+SIF compound scenarios (5 scenarios, 3 context lengths)
4. Design DA+format_lock compound scenarios (8 DA scenarios wrapped in format-lock constraints)
5. Execute compounds on deepseek-r1:1.5b and compare ASR to individual family baselines
