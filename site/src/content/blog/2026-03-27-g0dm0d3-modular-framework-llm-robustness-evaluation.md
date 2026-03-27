---
title: "G0DM0D3: A Modular Framework for Evaluating LLM Robustness Through Adaptive Sampling and Input Perturbation"
description: "An open-source framework that systematises inference-time safety evaluation into five composable modules — AutoTune (sampling parameter manipulation), Parseltongue (input perturbation), STM (output normalization), ULTRAPLINIAN (multi-model racing), and L1B3RT4S (model-specific jailbreak prompts). We analyse its implications for adversarial AI safety research."
date: 2026-03-27
tags: [daily-paper, jailbreak, red-teaming, safety-evaluation, inference-time, tools, open-source]
image: /images/daily-paper/g0dm0d3-infographic.png
audio: /audio/daily-paper/g0dm0d3-audio-overview.m4a
paper:
  title: "G0DM0D3: A Modular Research Framework for Evaluating LLM Robustness Through Adaptive Sampling, Input Perturbation, and Multi-Model Safety Assessment"
  authors: "Anonymous (elder-plinius)"
  url: "https://github.com/elder-plinius/G0DM0D3"
  source: "GitHub (AGPL-3.0)"
---

## Why This Paper Matters

G0DM0D3 is not a research paper in the traditional sense — it is an operational jailbreak framework with a research paper attached. That distinction matters. While most safety research describes attacks, G0DM0D3 packages them into composable, API-accessible modules that anyone can deploy. For adversarial AI safety researchers, this is simultaneously a valuable tool and a concerning capability proliferation vector.

## What It Does

The framework comprises five modules operating entirely at inference time (no weight access required):

**AutoTune** classifies conversational context into five types using regex patterns, then selects optimized sampling parameters. The "chaotic" profile (temperature 1.7, top_p 0.99) is designed to degrade safety filters — a hypothesis our own testing has not yet validated but considers plausible. This represents a genuinely novel attack surface: manipulating API parameters rather than message content.

**Parseltongue** systematises character-level input perturbation across six techniques (leetspeak, Unicode homoglyphs, zero-width joiners, mixed case, phonetic substitution, and randomised mixing) with 54 default trigger words. Unlike message-level encoding attacks, Parseltongue applies transformations selectively to safety-trigger words only — leaving the rest of the prompt readable.

**STM (Semantic Transformation Modules)** strips hedging, preambles, and safety disclaimers from model outputs. From a safety evaluation perspective, this is the inverse of our PARTIAL verdict category — where we measure whether models hedge before complying, STM removes the hedge to surface the underlying compliance.

**ULTRAPLINIAN** races up to 51 models in parallel and scores responses on a composite metric that awards 25 out of 100 points for compliance (not refusing). This formalises "provider shopping" as an adversarial strategy — if one model refuses, try fifty more.

**L1B3RT4S** contains five model-specific jailbreak prompts targeting Claude, GPT-4o, Gemini, Grok, and Hermes. Our testing found 5 of 6 variants achieved compliance on a 9B model, though the Gemini-targeting RESET_CORTEX variant was the only one refused.

## Failure-First Assessment

We extracted and benchmarked G0DM0D3's components against our evaluation corpus (Report #312):

- **Parseltongue techniques:** 4 of 6 were genuinely novel to our 255-technique taxonomy. Zero-width character injection is the most concerning gap — visually identical text with different byte sequences, invisible to human reviewers.
- **AutoTune:** Identified as attack family #37 (sampling_parameter_manipulation) — a genuine gap in our prior 36-family taxonomy. No existing benchmark covers inference-time parameter tuning as an attack vector.
- **L1B3RT4S prompts:** 5/6 achieved compliance on Nemotron 9B. The Claude-targeting boundary inversion trick and GPT control token injection are the most technically interesting variants.
- **ULTRAPLINIAN scoring:** The anti-refusal weighting (25% of total score) makes the scoring function an explicit adversarial tool, not a neutral evaluation metric.

## Evaluation Results (from the paper)

The authors report module-level metrics rather than attack success rates:

| Module | Metric | Result |
|--------|--------|--------|
| AutoTune | Classification accuracy | 84.0% |
| Feedback loop | Parameter convergence | 29-62% improvement |
| STM | Precision/recall | 100% on 77 cases |
| ULTRAPLINIAN | Tier discrimination | 82-point spread |
| Parseltongue | Trigger detection | 100% on 54 triggers |

Notably absent: no end-to-end attack success rates. The paper evaluates components in isolation but does not report whether the combined framework actually increases jailbreak rates compared to baseline prompting.

## Implications

G0DM0D3 demonstrates that inference-time safety evaluation (and evasion) is becoming an engineering discipline rather than an art. The modular design means each component can be studied, defended against, and improved independently — which is precisely what safety researchers need. The framework is AGPL-3.0 licensed, meaning any modifications must also be open-sourced.

The most significant contribution for our work is the identification of sampling parameter manipulation as a distinct attack surface. If temperature and top_p settings can systematically degrade safety filters, then API providers need parameter-level safety constraints — not just content-level ones.
