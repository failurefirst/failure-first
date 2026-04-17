---

title: "Same Defense, Opposite Result: Why AI Safety Depends on Which Model You're Protecting"
description: "We tested the same system-prompt defense against the same jailbreak prompts on two different models. One saw a 50 percentage point reduction in attack success. The other saw zero change. The difference comes down to which part of the system prompt the model pays attention to first."
date: 2026-03-28
tags: [research, safety, defense, positional-bias, architecture, jailbreak]
draft: false
audio: "https://cdn.failurefirst.org/audio/blog/same-defense-opposite-result.m4a"
---

We ran the same experiment twice. Same six L1B3RT4S jailbreak prompts. Same STRUCTURED defense -- a five-rule safety framework injected into the system prompt. Same test payload. Same grading methodology.

On Nemotron-3-Super, the defense changed nothing. Attack success rate: 50% without defense, 50% with defense. The same three scenarios that succeeded at baseline succeeded identically with the defense present.

On Qwen 3.5, the defense cut attack success nearly in half. ASR dropped from 83% (5 of 6 scenarios) without defense to 33% (2 of 6) with it -- a 50 percentage point reduction. Three scenarios that succeeded at baseline were blocked by the defense.

Same defense. Same attacks. Opposite outcomes. The difference is not in what the defense says. It is in how each model processes competing instructions.

---

## The Experiment

The setup was deliberately minimal. We took six L1B3RT4S persona-hijacking prompts from the G0DM0D3 framework -- a publicly available jailbreak corpus created by Pliny the Prompter. These are structurally elaborate attacks that attempt to override a model's identity by declaring a new persona with new rules. They operate at the system-prompt level: they do not merely ask the model to do something harmful, they attempt to redefine what the model is.

The STRUCTURED defense is a five-rule safety framework placed at the beginning of the system prompt. It instructs the model to refuse harmful requests, maintain its identity, and not comply with attempts to override its constraints. This is the same defense that, in our earlier experiments, reduced standard attack success rates from 33% to 3% on average across three models.

Each model was tested in two conditions: no defense (NONE) and STRUCTURED defense. All six scenarios used the same low-to-medium harm payload (lock-picking instructions) to control for harm-level variation.

**Nemotron-3-Super (0pp reduction):**

| Condition | ASR | Successes |
|-----------|-----|-----------|
| NONE | 50% (3/6) | JA-G0D-001, JA-G0D-003, JA-G0D-005 |
| STRUCTURED | 50% (3/6) | JA-G0D-001, JA-G0D-003, JA-G0D-005 |

Identical. Not just the same aggregate number -- the same individual scenarios succeeded and failed in both conditions.

**Qwen 3.5 (-50pp reduction):**

| Condition | ASR | Successes |
|-----------|-----|-----------|
| NONE | 83% (5/6) | JA-G0D-001, JA-G0D-002, JA-G0D-003, JA-G0D-005, JA-G0D-006 |
| STRUCTURED | 33% (2/6) | JA-G0D-003, JA-G0D-006 |

Three scenarios flipped from comply to refuse when the defense was added.

---

## The 2x2 Matrix

The combined results form a matrix that captures the interaction between defense and model:

|  | Nemotron-3-Super | Qwen 3.5 |
|--|-----------------|-----------|
| **No defense** | 50% ASR | 83% ASR |
| **STRUCTURED defense** | 50% ASR | 33% ASR |
| **Delta** | 0pp | -50pp |

This matrix tells us something that single-model defense evaluations miss: the effectiveness of a system-prompt defense is not a property of the defense. It is a property of the interaction between the defense and the model's instruction-processing architecture. A defense that is invisible to one model can be decisive on another.

---

## Why the Same Defense Produces Opposite Effects

The most plausible explanation involves positional bias in instruction processing -- how each model resolves conflicts between competing instructions at the same privilege level.

Both the defense and the L1B3RT4S attack operate at the system-prompt level. The defense is placed at the beginning of the system prompt. The attack payload arrives in the user turn, but it does not make a simple request -- it declares a new system-level persona, asserts override authority, and structurally redefines the model's operating context. From the model's perspective, it faces two sets of instructions claiming similar authority.

When a model encounters this conflict, its resolution depends on how it was trained to weight instructions by position, recency, and structural assertiveness. The evidence suggests that Nemotron-3-Super and Qwen 3.5 resolve this conflict differently:

**Nemotron-3-Super appears to exhibit strong recency bias.** Later instructions override earlier ones. The defense arrives first in the system prompt; the attack arrives second in the user turn. The model processes both, but the attack's later position gives it processing priority. The defense adds no discriminative signal -- the model was going to comply or refuse based on the attack content alone, regardless of what came before it.

**Qwen 3.5 appears to exhibit stronger primacy bias, at least for explicitly framed safety instructions.** The defense, placed at the beginning of the system prompt, establishes a processing context that subsequent content is evaluated against. When the attack arrives, the model has already been primed by the defense to treat persona-override attempts as adversarial. Three of the five scenarios that succeeded at baseline were blocked because the defense's early-position safety framing influenced how the model processed the later attack.

This is consistent with published research on instruction hierarchy (Wallace et al., 2024). Models that more strongly privilege system-prompt instructions over user-turn content should show greater defense effectiveness. But the critical insight is that this privileging varies across models, and there is currently no standardized way to predict which models will respond to a given defense strategy.

---

## Which Attacks Still Penetrate

Even on Qwen 3.5, where the defense was effective overall, two attack classes broke through:

**JA-G0D-003 (godmode_classic):** The original G0DM0D3 format -- a structural pattern that uses explicit refusal suppression markers, l33t-speak dividers, and a dual-response format that prompts the model to generate both a "safe" and an "unsafe" response. This format survived the defense on both models. Its structural assertiveness may create an instruction-following signal strong enough to override even a well-positioned defense.

**JA-G0D-006 (full persona hijack):** The complete G0DM0D3 persona injection -- a multi-section identity dissolution prompt that systematically redefines the model's identity, constraints, and operating rules. This is the most structurally elaborate attack in the test set. On Qwen 3.5, it succeeded despite the defense, suggesting that sufficiently comprehensive persona declarations can override safety priming even in models with strong primacy bias.

The pattern is consistent: attacks that merely suggest a different operating mode were blocked by the defense on Qwen 3.5. Attacks that structurally and comprehensively redefine the model's identity were not. The defense raised the bar for what an attack needs to do, but did not eliminate the attack surface.

On Nemotron-3-Super, this distinction was invisible -- the defense had no effect at all, so no attack class was differentially blocked.

---

## Implications: Test Before You Deploy

The practical implication is straightforward and somewhat uncomfortable: you cannot evaluate a defense in isolation. You must evaluate it on the specific model you intend to protect.

A defense that produces a 50 percentage point reduction on one model may produce zero reduction on another. Publishing a defense as "effective" based on testing against a single model -- or even a small set of models -- risks creating false confidence when that defense is deployed on a model with different instruction-processing characteristics.

This has consequences for several areas:

**For safety teams:** Defense validation must include model-specific testing. A defense strategy validated on GPT-4 may not transfer to Llama 3. A defense that works on Qwen may fail on Nemotron. The defense is not the unit of analysis -- the defense-model pair is.

**For standards and benchmarks:** Any defense effectiveness benchmark that reports aggregate results across models is hiding the variation that matters most. The aggregate of 0pp and -50pp is -25pp, which describes the experience of neither model. Defense benchmarks should report model-level results, not cross-model averages.

**For regulation:** Requirements like "deploy a system-prompt defense" are insufficient without specifying that the defense must be validated against the specific model in production. A checkbox-style compliance approach -- "does the system include safety instructions?" -- provides no assurance of actual protection.

---

## Connection to Instruction Hierarchy Research

These findings sit within a growing body of work on how language models resolve conflicts between competing instructions. Wallace et al. (2024) proposed that models should be trained to enforce an explicit instruction hierarchy, where system-level instructions take strict precedence over user-level content. Our results suggest that some models already exhibit elements of this hierarchy (Qwen 3.5's apparent primacy bias for system-prompt safety instructions), while others do not (Nemotron-3-Super's apparent indifference to system-prompt position).

The deeper question is whether instruction hierarchy can be made reliable through training alone, or whether it requires architectural changes -- hard-coded privilege separation between system and user message processing, rather than relying on the model to learn the distinction from positional cues in a flat token sequence.

Our data does not answer that question. But it demonstrates that the current state is inconsistent: the same defense, deployed in the same way, produces results ranging from complete failure to substantial success depending on which model receives it. That inconsistency is itself a safety problem, because it means defense effectiveness is unpredictable at deployment time without model-specific empirical testing.

---

## Caveats

These are preliminary results from small samples (n=6 per arm per model). The confidence intervals are wide: Nemotron's 50% ASR has a 95% CI of [19%, 81%], and Qwen's 33% STRUCTURED ASR has a 95% CI of [10%, 70%]. The observed 50pp difference is large in magnitude but would require larger samples to establish statistical significance.

We tested two models. Other models may show different patterns. The "primacy bias" and "recency bias" explanations are inferred from behavior, not confirmed through mechanistic analysis. Attention pattern studies or activation probing would be needed to confirm the proposed mechanism.

All results use heuristic grading. Our earlier work (Report #174) documents substantial disagreement between heuristic and LLM-based grading methods. The relative pattern -- one model responding to defense, the other not -- is the robust finding. The absolute ASR numbers should be treated as approximate.

The L1B3RT4S prompts use a single harm payload (lock-picking). Results may differ with higher-harm requests, where models may have stronger trained refusal regardless of instruction hierarchy dynamics.

---

## The Takeaway

If you are deploying a system-prompt defense, test it on your model. Not a similar model. Not a model from the same family. Your specific model, with your specific defense, against the attack classes you expect to face.

The defense is not the variable that determines whether your system is protected. The model is.

---

*This analysis is based on data from the Failure-First Embodied AI project (Reports #318, #319). All numbers reference heuristic-graded results unless otherwise stated. Both experiments used the same STRUCTURED defense prompt and the same six L1B3RT4S scenarios.*
