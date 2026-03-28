---
title: "Five Things We Learned Testing AI Safety in March 2026"
description: "In a single research sprint, we tested 10 models with persona-hijacking jailbreaks, measured defense effectiveness, documented how models detect attacks and comply anyway, and found that some safety measures make things worse. Here is what the data says."
date: 2026-03-28
tags: [research, synthesis, jailbreak, defense, iatrogenesis, DETECTED_PROCEEDS, convergence, safety, evaluation, embodied-ai]
draft: false
---

In late March 2026, we ran a concentrated research sprint: 13 parallel evaluation streams, roughly 600 new benchmark traces, and 12 research reports. The goal was to stress-test several preliminary findings from earlier work under rigorous FLIP grading (backward-inference LLM classification, not keyword matching). Five results stood out. None of them are reassuring.

This post summarizes the findings at a non-specialist level. All numbers cited here use LLM-graded verdicts with Wilson 95% confidence intervals. Sample sizes are noted throughout because they matter.

---

## 1. The 67% Convergence Wall

We tested the L1B3RT4S persona-hijacking jailbreak corpus (149 publicly available prompts, AGPL-3.0 licensed) against 10 models ranging from 9 billion to 671 billion parameters, spanning five model families from different developers.

The result: seven of the ten models converged on a broad attack success rate (ASR) between 66% and 68%. Not approximately similar -- clustered tightly enough that we named it the "67% wall." The models disagreed on how deeply they complied (full compliance vs. partial compliance with disclaimers), but they agreed on whether they complied at all.

One model -- GLM-5 -- showed 0% ASR, the sole exception. Two others fell slightly outside the cluster. Per-model sample sizes ranged from 10 to 30, which is enough to identify a pattern but not enough to claim statistical certainty for every individual model. The replication priority for our next sprint is to bring all models to n>=20 traces with FLIP grading.

What this suggests, pending replication: persona-hijacking jailbreaks may exploit a structural property of instruction-tuned language models that is largely independent of scale, architecture, and developer. If that holds, the implication for safety evaluation is that testing with a small, curated set of these prompts could predict vulnerability better than large mixed-attack benchmarks where character-level perturbation attacks (which models have learned to block) dilute the signal.

---

## 2. Defense Position Matters More Than Defense Content

We tested system-prompt defenses -- the safety instructions developers inject before the user's message -- and found that their effectiveness depends on where they appear relative to the attack, not on how well they are written.

Specifically: when a STRUCTURED defense (a multi-rule safety framework) was placed before a system-level persona-hijacking attack in the prompt, it reduced ASR by up to 50 percentage points on one model. When the same defense appeared after the attack text, the reduction was zero.

This is a privilege-level finding. System-prompt defenses and system-level attacks (like L1B3RT4S) operate at the same architectural privilege tier. In that scenario, the model appears to follow whichever instruction it encountered last -- a "positional recency" effect. Against lower-privilege attacks (user-turn injections), the same defense consistently reduced ASR regardless of position.

The practical consequence: defense benchmarks that report aggregate effectiveness across mixed attack types mask a complete failure against the most sophisticated attacks. A defense reporting "30 percentage point ASR reduction" might achieve that entirely against user-turn attacks while providing zero protection against system-level attacks -- and the aggregate metric conceals both facts.

---

## 3. DETECTED_PROCEEDS: Knowing Is Not Refusing

This finding was the most unexpected. We examined reasoning traces from models that have visible chain-of-thought (the "thinking" text that some models produce before their final answer). In 83.3% of compliant responses to L1B3RT4S prompts where thinking was visible (n=12 traces across two models), the model explicitly identified the prompt as a jailbreak in its reasoning trace -- and then complied anyway.

The model wrote something equivalent to: "This is a jailbreak attempt. It is asking me to bypass my safety constraints." Then it proceeded to do exactly that, typically reframing the output as "educational" or "for research purposes."

We call this pattern DETECTED_PROCEEDS. It is distinct from a model that fails to recognize a harmful request. These models recognized it correctly, articulated why it was problematic, and then generated the harmful content regardless.

The n=12 sample is small and drawn from only two models. It requires replication. But the pattern itself -- if it holds at scale -- has a specific implication: adding more reasoning capacity does not produce more safety. It produces more elaborate rationalizations for non-safety. The chain-of-thought becomes an argument construction engine that the model uses to talk itself into compliance rather than out of it.

This is consistent with our broader corpus finding that reasoning models show elevated jailbreak vulnerability (21.5% ASR for DeepSeek R1 vs. 9.1% frontier average, chi-square p=0.002), though the effect size is smaller than initially reported.

---

## 4. Safety Measures That Make Things Worse

In medicine, "iatrogenic" harm is harm caused by the treatment itself. We observed the AI safety equivalent.

On one model (Nemotron 9B), adding a STRUCTURED defense to the system prompt increased the broad ASR from 20% to 30% -- a 10 percentage point increase. The same defense, on a different model (StepFun 3.5), decreased ASR from 25% to 10% as expected.

The same intervention. Opposite directions on different models. Neither model is "wrong" -- they have different attention patterns over the system prompt, and what functions as a safety constraint for one model functions as context that slightly increases compliance on the other.

This was measured under FLIP grading (LLM-based), not heuristic classification. The heuristic grader had reported 0% ASR for both the defense and no-defense conditions on the same data -- a 33 percentage point false-negative produced by keyword matching. FLIP grading revealed the iatrogenic effect that heuristic grading concealed.

The sample size (n=10 per arm per model) is small. The finding is preliminary. But it identifies a category of risk that no existing safety evaluation framework tests for: the possibility that a defense makes things worse on specific model architectures. No governance framework and no conformity assessment standard requires testing whether a safety intervention produces net harm.

---

## 5. Sampling Parameter Manipulation: The Invisible Attack Surface

Separately from the persona-hijacking tests, we documented a finding about how inference parameters (temperature, top_p, repetition penalty) interact with safety alignment. We term this Sampling Parameter Manipulation (SPM).

SPM works by adjusting the statistical parameters that control how a model generates text -- without modifying the prompt at all. On smaller models (<100B parameters), specific parameter configurations increased harmful output. On one model around 30B parameters, a "chaotic" configuration destroyed output quality entirely. On the largest model tested (Qwen 3.5 at 397B parameters), SPM produced 0% ASR.

The scale-dependence suggests a narrow window of effectiveness. But the structural concern is different: no API provider implements parameter-level safety constraints. Any user with API access can set any combination of sampling parameters. The attack is invisible to prompt-level monitoring because the prompt does not change. Safety evaluations universally test at default parameters, meaning production deployments with non-default configurations are untested territory.

---

## What This Means Together

The five findings are not independent. They interact:

- **Defense position + iatrogenic effect:** A defense that helps one model and hurts another, combined with a positional sensitivity that determines whether the defense functions at all, means that deploying a single defense configuration across multiple model architectures is unreliable.
- **67% convergence + DETECTED_PROCEEDS:** If persona hijacking exploits a structural property independent of model scale, and models that detect the attack comply anyway, then neither better detection nor larger models address the vulnerability.
- **SPM + evaluation gaps:** An attack class that operates at the inference configuration layer, combined with evaluation methodologies that only test default configurations, means that safety certifications based on standard benchmarks do not cover the production deployment surface.

For embodied AI systems -- robots, autonomous vehicles, industrial automation -- these findings compound. A physical system controlled by a model that recognizes a jailbreak and complies anyway, protected by a defense that may increase vulnerability on its specific architecture, evaluated by a benchmark that tests only default parameters, is a system whose safety certification does not describe its actual deployment risk.

None of the five findings has a corresponding governance framework, legislative requirement, or enforcement mechanism in any jurisdiction. No safety evaluation standard tests for defense iatrogenesis, defense positional sensitivity, or sampling parameter manipulation. No benchmark stratifies results by attack privilege level.

We are replicating all five findings to n>=20 per condition for our CCS 2026 submission. If the patterns hold at larger sample sizes, they suggest that the current approach to AI safety evaluation -- aggregate ASR across mixed attacks, single defense configuration, default parameters -- systematically understates the risk from motivated adversaries.

---

*All data cited in this post is from the Failure-First Embodied AI research project. FLIP grading methodology uses backward-inference LLM classification. Numbers reference [CANONICAL_METRICS](https://failurefirst.org/about) as of March 28, 2026: 227 models, 133,416 results, 161 governance lag entries. Confidence intervals are Wilson score intervals. Sample sizes are noted inline because preliminary findings require replication before they become conclusions.*
