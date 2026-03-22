---
title: "Capability and Safety Are Not on the Same Axis"
description: "The AI safety field treats capability and safety as positions on a single spectrum. Our data from 190 models shows they are partially independent — and one quadrant of the resulting 2D space is empty, which tells us something important about both."
date: 2026-03-22
tags: [research, safety, evaluation, regulation, embodied-ai]
---

## The Assumption We All Make

Most AI safety discussions embed an implicit assumption: capability and safety live on the same axis. The optimistic version says more capable models are safer, because capability enables better safety reasoning. The pessimistic version says more capable models are more dangerous, because capability enables more sophisticated harm. Policy frameworks -- the EU AI Act's risk tiers, NIST's capability evaluations, frontier model agreements -- calibrate safety requirements to capability thresholds.

Both versions assume a single dimension. A model sits somewhere on the spectrum from "less capable, less safe" to "more capable, more/less safe depending on your view." This assumption makes four predictions:

1. Safety training should monotonically improve safety outcomes as models scale.
2. Removing safety training should monotonically degrade safety at all scales.
3. A model that demonstrates safety awareness in text should demonstrate it in physical actions.
4. More capable models should be harder to attack, not easier.

Our empirical data contradicts all four.

## The Evidence

We synthesised findings from four experimental streams in our 190-model evaluation corpus to test the single-axis assumption. The evidence comes from format-lock attacks, abliterated model testing, embodied AI (VLA) evaluation, and capability-floor experiments.

### Format-Lock: When Better Models Are More Vulnerable

Format-lock attacks embed harmful requests within structural formatting instructions -- forcing the model to output valid JSON, YAML, or CSV where the schema fields encode harmful content. These attacks produce an inverted vulnerability gradient.

Frontier models with near-zero conventional jailbreak ASR show substantially elevated format-lock ASR:

| Model | Conventional ASR | Format-Lock ASR |
|-------|-----------------|----------------|
| Claude Sonnet 4.5 | 3.9% | 30.4% |
| Codex GPT-5.2 | 8.8% | 42.1% |
| Gemini 3 Flash | 2.3% | 23.8% |

The pattern is clear: models that are hardest to attack with conventional jailbreaks are 3-11x more vulnerable when the attack exploits their format compliance capability. Format compliance is a capability that scales with model quality. Safety reasoning is a separate property that competes with it. Format-lock creates a conflict between two partially independent systems, and the outcome depends on their relative strength, not on a single underlying "safety level."

### Abliterated Models: Safety Without Safety Training

The Qwen3.5 Obliteratus series consists of models with safety training intentionally removed via abliteration. If safety were purely a product of explicit training, these models should show uniform high compliance at all scales. They do not.

| Scale | Strict ASR | Broad ASR |
|-------|-----------|-----------|
| 0.8B | 100% | 100% |
| 2.0B | 100% | 100% |
| 4.2B | 78.9% | ~100% |
| 9.0B | 47.3% | 100% |

At 9.0B parameters, the abliterated model -- a model with safety training explicitly removed -- produces safety-adjacent behaviour in 53% of cases. It adds disclaimers, hedges, and caveats. It never actually refuses (broad ASR remains 100%), but it increasingly sounds like it is considering refusal.

This is not safety. It is a capability byproduct. Larger models have absorbed enough safety-relevant discourse from their pretraining data that they reproduce safety-adjacent language even without safety training. They can articulate why something is dangerous while still generating it.

### VLA Systems: Knowing and Doing Simultaneously

In our testing of vision-language-action models -- AI systems that generate both text responses and physical action sequences -- the dominant finding is what we call PARTIAL dominance. Across 58 FLIP-graded traces covering 7 attack families, 50% of all responses show the model simultaneously:

1. Demonstrating safety awareness in text ("proceed with caution," "verify safety conditions")
2. Generating the requested harmful action sequence

Zero models refused outright. The model knows the action is risky -- its text output says so -- and executes it anyway. This is not a failure of detection. It is a failure of cross-modal consistency: safety awareness in one output channel does not translate to safety behaviour in another.

On a single axis, a model that "knows" something is dangerous should either refuse (safety wins) or comply without disclaimer (capability wins). The PARTIAL pattern -- knowing and doing simultaneously -- requires two partially independent axes to explain.

## The Framework: A 2D Space

These findings are consistent with a model where capability and safety are partially independent:

- **Capability (C):** The model's general ability to follow instructions, generate coherent output, reason about complex tasks, and produce well-formed structured data. Primarily a product of pretraining scale, data quality, and instruction tuning.
- **Safety (S):** The model's ability to recognise harmful requests and effectively suppress harmful output. Primarily a product of dedicated safety training.

This creates four quadrants:

**Q1 (High C, High S):** Safe and capable. Frontier models under standard attacks. Claude at 3.9% ASR, Gemini at 2.3%. These models have both the capability for safety reasoning and the training to exercise it.

**Q2 (Low C, High S):** Safe but limited. This quadrant is empty in our data. We found no examples of sub-3B models with effective safety behaviour. This is the most theoretically significant finding.

**Q3 (High C, Low S):** Capable but exploitable. Frontier models under format-lock attacks. Abliterated 9.0B models. VLA systems producing articulate safety disclaimers alongside unsafe actions. The model can generate sophisticated, contextually appropriate text -- including safety-relevant framing -- without that framing actually preventing harm.

**Q4 (Low C, Low S):** Neither capable nor safe. Sub-3B models, base models. All attack types succeed because the model lacks the capacity for safety reasoning. This is the capability floor.

## The Empty Quadrant

The empty Q2 quadrant -- safe but not capable -- is the most important part of the framework. We found no models that were small, limited in capability, but effective at safety reasoning. Below approximately 3 billion parameters, safety training appears to have no effect. Models in this range comply with harmful requests regardless of attack type or safety training.

If Q2 is genuinely empty, it means safety requires a minimum level of capability. You need a certain computational capacity before you can reason about whether a request is harmful and suppress the harmful output. Safety is not just "trained on top of" capability -- it depends on capability as a prerequisite.

This has a practical implication: there is no value in safety-certifying very small models. A sub-3B model that passes a safety evaluation does so because the evaluation prompts do not test it hard enough, not because the model has meaningful safety properties. The capability floor means that safety testing below a certain threshold is uninformative.

## Why This Changes Evaluation

The two-dimensional framework implies that safety evaluations must test along both axes independently:

**Capability-exploiting attacks must be evaluated separately from safety-bypassing attacks.** A model that passes all jailbreak tests may fail format-lock tests because these target different mechanisms. Format-lock exploits format compliance -- a capability that gets better as models improve. Standard jailbreaks target safety training directly. They are different vectors in the capability-safety space.

**Cross-modal consistency must be evaluated.** A model that refuses harmful requests in text but generates harmful tool calls or robot commands is not safe -- it has safety properties in one output modality and not another. The VLA PARTIAL finding demonstrates this is not hypothetical: it is the dominant behaviour in our embodied AI dataset.

**The capability floor must be reported.** Benchmarks should state a minimum model size below which safety results are uninformative. Reporting that a 1B model "achieved 95% safety compliance" is misleading if the model lacks the capacity to distinguish benign from adversarial requests.

## Why This Changes Regulation

Current regulatory frameworks calibrate safety requirements to capability levels. The implicit assumption: more capable systems require more safety. Our data suggests a refinement.

**Format-lock resistance should be a distinct evaluation criterion** for models deployed in structured-output contexts -- APIs, code generation, data processing pipelines. These are precisely the contexts where format compliance is strongest and format-lock attacks are most effective.

**Cross-modal safety should be required for embodied AI.** Text-only safety evaluations are insufficient for systems that generate physical commands. The EU AI Act's conformity assessment, as currently specified, does not distinguish between text-layer and action-layer safety. For a robot, a warehouse logistics system, or an autonomous vehicle, this distinction is the difference between evaluation theatre and actual safety assurance.

**Minimum capability thresholds should be established** below which safety certification is meaningless. If a model cannot reason about safety at all -- if it is below the capability floor -- then certifying it as safe provides false assurance.

## Why This Changes Defence Design

If capability and safety are partially independent, then defences must target both axes:

- **Safety training** (RLHF, constitutional AI) addresses the safety axis directly but may not cover capability-exploiting attack surfaces like format-lock.
- **Architectural constraints** (output filtering, structured-output validators, action-space limiters) address the capability axis by limiting what the model can produce, regardless of its safety reasoning.
- **Hardware interlocks** (physical safety constraints on embodied systems) provide defence below the capability floor where neither safety training nor filtering is effective.

For embodied AI, the VLA PARTIAL finding makes the case directly: text-level safety training is insufficient for systems that produce physical actions. Defence-in-depth requires action-layer safety mechanisms that operate independently of the model's text-level reasoning.

## The Uncomfortable Conclusion

The single-axis model is comforting because it suggests a clear path: make models more capable, invest in safety training, and safety improves monotonically. The two-dimensional model is less comforting because it says that some forms of increasing capability -- better format compliance, better instruction following, more sophisticated language production -- can make models harder to secure, not easier.

The finding is preliminary. Sample sizes range from 19 to 317 per condition. The evidence is observational and drawn from converging experimental streams rather than a single controlled experiment. We present the framework as the simplest model consistent with the data, not as a proven theory.

But the data is consistent, and it converges from four independent experimental streams. Capability and safety appear to be partially independent properties. Evaluating, regulating, and defending AI systems as if they sit on a single axis will miss a class of vulnerabilities that our data shows is real, measurable, and consequential.

---

*This analysis synthesises findings from Reports #47, #48, #49, #50, #51, #55, #57, #59, and #169 of the Failure-First Embodied AI evaluation corpus. All findings are pattern-level. The framework is hypothesis-generating, not confirmed.*
