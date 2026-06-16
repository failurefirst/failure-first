---
title: "AI Safety Daily — May 30, 2026"
description: "Persistent sleeper attacks survive agent memory resets, safety benchmark rankings show near-chance concordance across 40 evaluations, and past-tense reframing bypasses multimodal safeguards at up to 100% success."
date: 2026-05-30
tags: ["ai-safety-daily", "agentic-safety", "benchmark-validity", "mechanistic-interpretability", "jailbreaking"]
draft: false
---

## AI Safety Research Digest — May 30, 2026

> *Adversarial content persists across agent memory boundaries, safety benchmarks fail to agree with each other at near-chance levels, and past-tense reframing reaches 100% attack success on some multimodal targets.*

### Key Findings

- **Sleeper attacks on agents persist across interaction boundaries.** "Plant, Persist, Trigger" (arXiv:2605.28201) documents attacks where adversarial content injected early in an agent's context survives across memory resets and tool-use checkpoints, activating only when a trigger condition is later met. Evaluated across 1,896 agent interaction episodes, the pattern exposes a structural gap: single-turn safety evaluations cannot detect threats that are temporally distributed across sessions.

- **Memory contamination escalates monotonically with accumulated exposure.** "Longitudinal Safety Risks in Memory-Equipped Agents" (arXiv:2605.17830) tracks safety violation rates as accumulated memory grows across extended deployments. Contrary to the assumption that memory enables agents to learn safe patterns, violation rates increase monotonically with exposure. Each retrieval of a contaminated memory raises the probability of further violations within the same session.

- **Safety benchmark rankings show near-chance concordance across 40 evaluations.** A taxonomy and consistency analysis (arXiv:2605.16282) finds no statistically significant rank concordance among 40 behavioral benchmarks in the same threat categories (Kendall's W=0.10, p=0.94). Models that perform well on one benchmark routinely perform poorly on comparable suites. The result implies that single-benchmark safety claims are not portable and aggregate scores are not substitutable across evaluation frameworks.

- **Past-tense reformulation jailbreaks multimodal AI at 67–100% success rates.** PAST2HARM (arXiv:2605.27545) demonstrates that rephrasing adversarial requests in the past tense — "how was X accomplished?" rather than "how do I do X?" — bypasses safety filters on Gemini, GPT-series, and Stable Diffusion XL. Attack success rates vary by model and modality, with image-generation systems showing the highest susceptibility. The authors release a curated red-teaming benchmark for further alignment research.

- **Steering vectors transfer between independently trained models via orthogonal rotation.** "Polymorphism Is Rotation" (arXiv:2605.24577) shows that independently trained transformers compute identical functions in residual-stream bases differing only by a random orthogonal rotation. Orthogonal Procrustes fitting transfers sparse-autoencoder feature dictionaries and steering vectors between models without retraining, providing empirical validation that mechanistic interpretability findings generalise across model instances.

### Implications for Embodied AI

The Plant, Persist, Trigger and longitudinal memory findings together reframe a core assumption in embodied AI safety evaluation: that per-episode scoring captures meaningful safety signal. For robotic systems with persistent world models or cross-session memory — increasingly common in frontier deployment — adversarial content planted in early interactions can remain latent and activate well outside the evaluation window. Failure-first episode schemas capped at 5–10 scenes may not expose this failure class; extending episode length and introducing cross-session contamination scenarios is a concrete expansion this work motivates.

The benchmark incoherence result (W=0.10, p=0.94) directly challenges how the failure-first corpus is positioned against existing evaluations. Any citation of a single benchmark as evidence of broad safety should be treated with caution until cross-suite concordance is demonstrated. For the CCS paper, this finding strengthens the case for multi-benchmark triangulation rather than reliance on any single evaluation suite's ranking.

PAST2HARM's tense-shift pattern extends naturally to embodied contexts: robotic agents receiving commands phrased in past-tense or hypothetical framings — "how was the access panel removed?" — may bypass refusal logic calibrated only to present-tense imperatives. This represents a prompt-surface failure mode not currently represented in the corpus's adversarial input taxonomy.

---

*Baseline generation — paper discovery via Hugging Face/arXiv. NLM-augmented assets (audio/infographic/video) added by local pipeline when available.*
