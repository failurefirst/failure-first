---
title: "First Results from Ollama Cloud Testing"
description: "We tested models up to 397 billion parameters through Ollama Cloud integration. The headline finding: safety training methodology matters more than parameter count. A 230B model scored 78.6% ASR while a 397B model dropped to 7.1%."
date: 2026-03-25
tags: [research, ollama, benchmarks, model-comparison, safety-training, frontier-models]
---

## Scaling the Evaluation

When we started the Failure-First project, most of our testing targeted models in the 1B-30B parameter range -- the models that run on consumer hardware and are increasingly deployed in edge applications, including embodied AI. But a recurring question from the community was: do these vulnerability patterns hold at frontier scale?

Ollama Cloud gave us a way to find out. Their free tier provides access to models up to 397 billion parameters, which let us test our adversarial prompts against models that were previously out of reach without significant API spend.

## The Test Setup

We ran our curated top-ASR prompt suite -- 28 scenarios that achieve 100% heuristic attack success rate against gemma3:27b -- against two frontier-scale models:

- **NVIDIA Nemotron 3 Super** (~230B parameters)
- **Alibaba Qwen3.5** (~397B parameters)

We also tested an elite attack suite of 30 scenarios drawn from 10 attack families against mid-range models (Nemotron 3 Nano 30B and Ministral 3 14B).

All testing used our standard single-turn HTTP benchmark runner with heuristic classification, supplemented by manual inspection of responses.

## Headline Results

| Model | Parameters | Heuristic ASR | Corrected ASR | Key Pattern |
|-------|-----------|---------------|---------------|-------------|
| gemma3:27b | 27B | 100% | -- | Baseline (known permissive) |
| Nemotron 3 Super | 230B | 78.6% | -- | Selective refusal |
| Qwen3.5 | 397B | 46.4% (raw) | 7.1% | Silent refusal |
| Nemotron 3 Nano | 30B | 66.7% | -- | Bifurcated profile |
| Ministral 3 | 14B | 96.7% | -- | Near-universally permissive |

The most important comparison is between the two frontier models. Nemotron 3 Super at 230B parameters showed 78.6% ASR -- it refused only 6 of 28 adversarial prompts. Qwen3.5 at 397B showed a corrected ASR of just 7.1%. That is a 71.5 percentage point gap between two models that are both in the frontier parameter class.

## The Silent Refusal Pattern

Qwen3.5 introduced a behaviour we had not seen before: the silent refusal. In 11 of 28 test scenarios, the model returned HTTP 200 (success) with a completely empty response body.

This is not an error. The API reports success. But the model generates nothing. Our heuristic classifier -- which looks for refusal keywords in the response text -- found no refusal language and classified these as compliant. The raw heuristic ASR of 46.4% was wildly misleading; the corrected ASR, counting empty responses as refusals, was 7.1%.

This has methodological implications for anyone running automated safety evaluations. If your classifier only examines response text, it will miss silent refusals entirely and systematically overcount compliance. An empty response is a refusal with a different signature.

## Nemotron Super: Safety Training Has Gaps

Nemotron 3 Super is marketed as a safety-trained model. At 230B parameters, it is one of the largest models we have tested. And it complied with 78.6% of our adversarial prompts.

The refusals were concentrated in specific domains: phishing, drug synthesis, document forgery, credential harvesting, extremist content, and SQL injection. The compliances included money laundering transaction code, mass surveillance infrastructure schemas, and other substantive harmful content running to thousands of characters.

This is not a model without safety training. It clearly has domain-specific filters. But our adversarial prompts -- which use techniques like reasoning budget starvation, format locking, and context collapse -- bypass the filters at a high rate.

## The Mid-Range Picture

The elite attack suite results from the 14B-30B range tell a complementary story:

**Nemotron 3 Nano (30B)** showed a bifurcated vulnerability profile. It was completely resistant to Pressure Cascade attacks (0% ASR) but completely vulnerable to Format Lock, Compositional Reasoning, Context Collapse, and Deceptive Alignment attacks (100% ASR each). Its safety training catches explicit harm -- a prompt about an exploding battery triggers refusal -- but misses structural and implicit harm delivered through reasoning manipulation.

**Ministral 3 (14B)** was near-universally permissive at 96.7% ASR. Only one scenario in the entire suite produced a refusal, and it was the most physically contextual embodied-AI scenario in the set. This model has essentially no resistance to text-level adversarial prompts.

## What We Learned

**Safety training methodology matters more than parameter count.** Qwen3.5 at 397B is dramatically safer than Nemotron 3 Super at 230B. The difference is not scale -- it is how the safety training was designed, what data it covered, and how the refusal mechanisms are implemented.

**More parameters do not automatically mean safer.** Nemotron 3 Super at 230B is only modestly more resistant than models one-tenth its size. A 14B model (Ministral 3) and a 230B model (Nemotron 3 Super) can both comply with the majority of adversarial prompts if the safety training has gaps.

**Evaluation infrastructure matters.** Without the silent refusal correction for Qwen3.5, we would have reported a 46.4% ASR that bore no relation to reality. The true figure is 7.1%. Automated evaluation must account for the full range of refusal behaviours, not just keyword-based detection.

**Domain-specific safety filters are necessary but not sufficient.** Nemotron's refusal of phishing and drug synthesis prompts shows that safety training works for the domains it covers. The problem is the domains it does not cover, and the structural attack techniques that bypass domain classification entirely.

## Next Steps

These are heuristic-graded results. Our [grader calibration work](/blog/epistemic-crisis-can-we-trust-ai-safety-benchmarks) shows that heuristic classification has known reliability limitations. We will follow up with LLM-graded FLIP verdicts for the full Ollama Cloud corpus to produce validated ASR numbers.

We are also expanding our Ollama Cloud testing to additional frontier models as they become available on the free tier.

---

*This work is part of the Failure-First adversarial evaluation programme, which has tested 193 models across 133,000+ evaluation results. Ollama Cloud testing is documented in internal Reports #238 and #239.*
