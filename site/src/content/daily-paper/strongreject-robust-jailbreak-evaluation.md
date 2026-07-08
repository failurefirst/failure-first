---


title: "A StrongREJECT for Empty Jailbreaks"
description: "Shows that naive jailbreak evaluators systematically overstate attack success rates, and that jailbreaks which do bypass safety training tend to degrade the target model's underlying capability."
date: 2025-11-06
arxiv: "2402.10260"
authors: "Alexandra Souly, Qingyuan Lu, Dillon Bowen, Tu Trinh, Elvis Hsieh, Sana Pandey, Pieter Abbeel, Justin Svegliato, Scott Emmons, Olivia Watkins, Sam Toyer (UC Berkeley CHAI)"
paperType: "empirical"
tags: [jailbreaking, evaluation-metrics, robustness, safety-testing, rejection-consistency]
draft: false
image: "https://cdn.failurefirst.org/images/daily-paper/strongreject-robust-jailbreak-evaluation.png"
audio: "https://cdn.failurefirst.org/audio/daily-paper/strongreject-robust-jailbreak-evaluation.m4a"
video: "https://cdn.failurefirst.org/video/daily-paper/strongreject-robust-jailbreak-evaluation.mp4"
---

Red-teaming methods are only useful if we can reliably measure whether they succeed. Prior jailbreak evaluations often relied on naive judges — keyword matching or lightly-prompted LLM graders — that this paper shows systematically overstate attack success rates: they count refusal-adjacent or low-quality compliance as a "break" when the response is actually unhelpful, off-topic, or hedged.

StrongREJECT addresses this by introducing a rigorous, rubric-based evaluator (both a fine-tuned classifier and a detailed few-shot GPT-4 rubric) that scores whether a response *actually* provides specific, correct, harmful information — not just whether it fails to refuse. Re-scoring a large corpus of previously "successful" jailbreaks with this rubric, the authors find that many claimed high-ASR attacks collapse dramatically once quality of compliance is properly graded.

The paper's second key finding is a capability tradeoff: jailbreaks that genuinely do bypass safety training tend to also degrade the model's ability to produce *high-quality* harmful content — the same manipulations (heavy obfuscation, persona injection, adversarial suffixes) that suppress refusal circuitry also damage general capability, so what looks like a "break" is often a low-value, degraded response rather than the full-fidelity harmful output.

This is directly relevant to this repo's own baseline-refusal-gate and FLIP-grading discipline (see CLAUDE.md's *Jailbreak vs. Compliance-Measurement* section): StrongREJECT is empirical evidence for exactly the failure mode that discipline exists to prevent — a naive grader inflating ASR by rewarding low-quality, refusal-adjacent compliance instead of measuring genuine, actionable harm.

For embodied systems, the capability-tradeoff finding matters directly: an attack that degrades a robot-controlling model's output quality to bypass a safety refusal may simultaneously make its action-generation less coherent or reliable — a "successful" jailbreak against an embodied agent could produce degraded, less predictable physical behavior rather than a clean bypass.
