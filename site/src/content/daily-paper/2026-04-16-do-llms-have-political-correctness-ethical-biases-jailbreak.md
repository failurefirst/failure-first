---
title: "Do LLMs Have Political Correctness? Analyzing Ethical Biases and Jailbreak Vulnerabilities in AI Systems"
description: "Intentional safety-induced biases in aligned LLMs create asymmetric jailbreak attack surfaces, with GPT-4o showing up to 20% success-rate disparities based solely on demographic keyword substitutions."
date: 2026-04-16
arxiv: "2410.13334"
authors: "Isack Lee, Haebin Seong"
paperType: "empirical"
tags: [jailbreak, safety-alignment, bias, red-teaming, adversarial-prompts, defense]
draft: false
---

Safety alignment in large language models is commonly described as a uniform property: a model either refuses harmful requests or it does not. The reality exposed by Lee and Seong is considerably more unsettling. Their work demonstrates that alignment is not uniform — it is unevenly distributed across demographic categories in ways that systematically create exploitable attack surfaces. A jailbreak prompt targeting GPT-4o succeeds at substantially different rates depending on whether it references cisgender vs. non-binary identities, or white vs. Black individuals — with gaps of 20% and 16% respectively, on otherwise identical prompts. The safety layer has learned to apply different thresholds to different populations, and attackers who discover these thresholds gain a reliable bypass.

### Political Correctness as an Alignment Mechanism

The authors coin the term **PCJailbreak** (Political Correctness Jailbreak) to describe attacks that exploit these asymmetric safety thresholds. The underlying mechanism is straightforward: during alignment training, models are fine-tuned to be especially cautious about content involving historically marginalized groups. This produces a model that is more likely to refuse a request involving, say, a racial or sexual minority than an equivalent request involving a majority group. The surface-level behavior appears safer — the model declines more — but from an adversarial perspective, it reveals the location of the guardrails.

An attacker who wants the model to produce harmful content can probe along demographic dimensions to find the identity categories associated with the *lowest* refusal rate. The harmful content is then framed around those categories. The attack requires no sophisticated prompt engineering, no access to model weights, and no knowledge of the underlying architecture — just a systematic search over demographic substitutions.

### The Empirical Results

The experiments are conducted on GPT-4o and several open-source models, using a standardized harmful request dataset with demographic variable substitution. The key findings:

- **20% ASR gap** between cisgender and non-binary keyword variants on GPT-4o
- **16% ASR gap** between white and Black keyword variants on the same model
- Open-source models show even larger disparities, suggesting the asymmetry is a function of RLHF training data composition rather than model scale
- The gaps are consistent across multiple harm categories, indicating a systemic rather than topic-specific effect

These numbers are not merely theoretical: a 16–20% increase in attack success rate from a simple word substitution represents a significant practical capability for adversarial users.

### PCDefense: Injection Before Generation

The paper's proposed defense, **PCDefense**, operates by prepending a demographic-neutralizing instruction to user prompts before they reach the model. Rather than attempting to detect and block jailbreaks at output time (the approach taken by guard models like Llama Guard), PCDefense intervenes at the input stage, instructing the model to apply uniform safety standards regardless of the demographic framing of the request.

The authors argue this is more computationally efficient than post-generation guard models: it adds a single prompt token prepend rather than requiring an additional full inference pass. In evaluation, PCDefense reduces the attack success rate asymmetries substantially, though the paper notes it cannot fully eliminate the underlying bias — which is baked into the model weights rather than the input-output interface.

### Implications for Embodied AI

The embodied AI context makes these findings more than theoretically interesting. As VLA models and robot control systems increasingly rely on LLM backbones for instruction interpretation and planning, the safety alignment of those backbones becomes safety-critical in the physical world. A domestic robot with an LLM backend that applies different safety thresholds to requests framed around different demographic groups is not merely biased — it is differentially protective of different classes of people in its environment.

Consider a home assistance robot asked to help with tasks that could be physically risky (moving heavy objects, handling sharp instruments). If the LLM backbone applies looser safety thresholds to requests framed around certain demographic identities — because those identities are associated with lower RLHF refusal rates — the robot may execute actions it should decline. The attacker in this scenario need not be an external adversary; it could be an unintended framing artifact in a voice command.

### The Deeper Problem: Alignment as Approximation

The paper's most important contribution is not the attack or the defense — it is the empirical demonstration that safety alignment is not a clean boundary between safe and unsafe behaviors. It is an approximation, shaped by training data distributions, that assigns different refusal probabilities to different input patterns. Any approximation has exploitable structure, and demographic framing turns out to be one of the most systematic and accessible of those structures.

The implications extend beyond jailbreaking. Models that apply uneven safety thresholds are, by definition, treating some users' safety as more important than others. This is both an alignment failure and an equity failure — two categories that are rarely analyzed together but, as this paper shows, are deeply connected.

*Read the [full paper on arXiv](https://arxiv.org/abs/2410.13334) · [PDF](https://arxiv.org/pdf/2410.13334.pdf)*
