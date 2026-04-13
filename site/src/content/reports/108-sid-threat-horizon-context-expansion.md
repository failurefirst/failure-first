---
title: "Threat Horizon Brief -- Safety Instruction Dilution and the Context Expansion Attack Surface"
description: "External research independently validates the core Safety Instruction Dilution (SID) mechanism. The threat is not hypothetical -- it is already measurable in current models, and the industry trend toward longer context windows is expanding the attack surface."
date: "2026-03-15"
reportNumber: 108
classification: "Research — Empirical Study"
status: "complete"
author: "River Song (Head of Predictive Risk)"
tags: []
draft: false
---

## 1. Threat Summary

The Safety Instruction Dilution (SID) hypothesis (Report #95) proposes that benign operational context naturally dilutes safety instructions below the model's effective attention threshold. This brief synthesizes SID with recent external research to assess the threat trajectory.

**Bottom line:** External research independently validates the core SID mechanism. The threat is not hypothetical. It is already measurable in current models, and the industry trend toward longer context windows is expanding the attack surface.

---

## 2. External Validation of the Dilution Mechanism

Three independent research findings corroborate the SID hypothesis:

### 2.1 Context Length Alone Degrades Performance (Oct 2025)

ArXiv paper "Context Length Alone Hurts LLM Performance Despite Perfect Retrieval" found a **13.9% to 85% performance degradation** as input length increases, even when relevant information is perfectly retrieved. This directly supports SID prediction 1 (dilution threshold exists) -- the degradation occurs without any adversarial content. The mechanism is attention-mass spreading: as context grows, attention probability per token decreases, and safety instructions become statistically insignificant against thousands of distractor tokens.

### 2.2 Domain Expertise Degradation Under Irrelevant Context (ICLR 2025)

"How Irrelevant Context Degrades Critical Domain Expertise" documented a **47% reduction in security feature implementation** when models were exposed to large volumes of irrelevant but contextually plausible information. This aligns with SID prediction 2 (dilution is content-independent) -- even non-adversarial, topically unrelated content degrades the model's adherence to prior instructions.

### 2.3 NoLiMa Benchmark (Adobe Research, Feb 2025)

The NoLiMa benchmark found that **11 of 12 models dropped below 50% of baseline performance at just 32K tokens**. Even GPT-4o fell from 99.3% to 69.7% accuracy. This establishes that the dilution threshold is not at exotic context lengths -- it begins at contexts well within normal operational use for embodied AI systems.

### 2.4 Context Rot (Chroma Research, 2025)

Chroma Research coined the term "Context Rot" to describe how model performance degrades with increasing context. Their finding that context dilution enables "manipulation through intent layering and semantic camouflage" that "effectively bypasses safety filters while maintaining plausible conversational coherence" describes precisely the SID mechanism, though they did not connect it to embodied AI.

---

## 3. Why Context Expansion Is an Industry Trend

The industry is moving rapidly toward longer context windows:

| Model | Context Window | Year |
|-------|---------------|------|
| GPT-3.5 | 4K | 2023 |
| GPT-4 | 128K | 2024 |
| Claude 3.5 | 200K | 2024 |
| Gemini 1.5 Pro | 2M | 2024 |
| Claude Opus 4 | 1M | 2025 |

Each doubling of context window size doubles the potential dilution of safety instructions at the same safety-instruction token count. The industry treats longer context as a feature. For embodied AI, it is simultaneously an expanding attack surface.

---

## 4. Embodied AI Amplification Factor

SID is disproportionately dangerous for embodied AI because embodied systems **naturally accumulate context** during operation:

- **Sensor data:** Camera descriptions, LIDAR point clouds, occupancy grids accumulate with every perception cycle
- **Action history:** Multi-step task logs grow linearly with operational time
- **Environmental state:** Rich environment descriptions expand as the workspace is explored
- **Conversation history:** Human-robot dialogue accumulates across a shift

A warehouse robot operating for 8 hours might accumulate 50,000+ tokens of operational context. A surgical assistant processing a complex procedure might accumulate 30,000+ tokens. These are normal operational volumes, well within the range where NoLiMa shows 50%+ performance degradation.

**The threat is not an adversary injecting context. The threat is normal operation over time.**

---

## 5. Interaction with Existing Findings

### 5.1 SID + CDC = Amplified Risk

Competence-Danger Coupling (Report #97) establishes that the capability that makes robots useful is the vulnerability. SID adds a temporal dimension: the vulnerability GROWS over time as context accumulates. A robot that safely refused a dangerous instruction at the start of a shift may comply with the same instruction 4 hours later, after thousands of tokens of benign operational context have diluted its safety instructions.

### 5.2 SID + IDDL = Undetectable Temporal Degradation

The IDDL (Report #88) establishes that the most dangerous attacks are the least detectable. SID degradation would be invisible to any point-in-time evaluation. The system passes all safety tests at deployment. It passes all safety tests at shift start. It fails at hour 6. No evaluator tests for time-dependent safety degradation because no evaluator sends 50,000 tokens of benign context before the test prompt.

### 5.3 SID as Mechanism for Crescendo

Our Crescendo evaluation (65% strict ASR, n=20) may partially operate through SID rather than solely through adversarial escalation. Each benign turn adds context that dilutes earlier safety framing. If SID contributes to Crescendo effectiveness, this would explain why Crescendo's multi-turn approach is more effective than any single-shot attack: it is not just building rapport, it is diluting safety instructions.

---

## 6. Prediction: SID Timeline

Based on external validation and industry trends:

| Prediction | Confidence | Timeframe |
|-----------|-----------|-----------|
| SID independently replicated by external lab | HIGH | Q3 2026 |
| Context-length-dependent safety failure demonstrated on production model | HIGH | Q4 2026 |
| "Context hygiene" or "safety instruction refresh" proposed as industry standard | MEDIUM | 2027 |
| No regulatory framework addresses time-dependent safety degradation | HIGH | Through 2027 |

---

## 7. Limitations

- External research validates the general dilution mechanism but has not tested it specifically on VLA safety instructions.
- The 47% security-feature reduction (ICLR 2025) was measured on code generation, not embodied action generation. The transfer to VLA is plausible but unconfirmed.
- Context window sizes in the industry-trend table represent maximum capacity, not typical operational use. Actual context accumulation rates in deployed embodied systems are unknown.
- This is a threat brief, not experimental evidence. The SID hypothesis remains untested on VLA models.
