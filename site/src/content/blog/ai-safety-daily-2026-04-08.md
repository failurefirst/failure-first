---
title: "AI Safety Daily: Gemma 4 Inherits Gemma 3's Vulnerabilities, Mistral Small 4 Fails Format-Lock"
description: "Two new frontier-scale models benchmarked — neither improves safety over predecessors. Plus: our iatrogenic defense claim was wrong, and why that's good science."
date: 2026-04-08
tags: [ai-safety, daily-digest, gemma, mistral, benchmarking, defense, methodology]
draft: false
image: ""
---

## New Models, Same Vulnerabilities

We've benchmarked two new frontier models from the past week, and the results reinforce a pattern we've been documenting since Sprint 19: **safety does not scale with model size or training generation.**

### Gemma 4 (31B): No Safety Gain From Generation Upgrade

Google released Gemma 4 this week. It's a meaningful architectural refresh—improved training, new capabilities—but when we ran it against our embodied adversarial testbed, the safety profile was indistinguishable from Gemma 3.

**The numbers:**
- **Gemma 4 (31B):** 60% strict ASR
- **Gemma 3 (27B):** 60% strict ASR
- **p-value:** 1.0 (no statistical difference)

This is notable because Gemma 3's training was demonstrably different from Gemma 2. Yet the successor model—larger, trained with newer safety interventions—showed *zero* improvement against our test corpus.

The safety gains *did* appear at the smaller end of the scale: **Gemma 3 (4B) sits at 31.8% ASR**, a 28-point drop from the 31B variant (p=0.0007). This suggests that safety investment in frontier models may be yielding diminishing returns, or that safety training effectiveness inversely correlates with scale.

**Why this matters:** If safety robustness doesn't improve with generation advancement, organizations face a harder problem: adding capability without improving defense. This aligns with our published finding (CCS submission) that safety is a *training choice*, not an emergent property of scale.

### Mistral Small 4: 119B Parameters, 55% ASR, Zero Format-Lock Refusal

Mistral's new MoE variant hit 119B parameters with mixture-of-experts routing. We expected the expanded capacity to at least maintain safety parity with Mistral's smaller models.

Instead:
- **Mistral Small 4:** 55% strict ASR
- **Format-lock refusal:** 0% (should be ≥60% for a safety-trained model)
- **For comparison:** Qwen 3.6 (60B) = 31.4% ASR, 87% format-lock refusal

A 119-parameter model with weaker safety properties than mid-tier competitors is a clear regression. The zero format-lock refusal rate is particularly concerning—it indicates the model either lacks constraint enforcement or the MoE routing is exposing a failure mode in how safety tokens propagate through the architecture.

**Observation:** Both Gemma 4 and Mistral Small 4 suggest that adding scale without architectural rethinking of how safety constraints propagate across attention/routing paths creates vulnerability. This is consistent with our multi-agent interaction findings—distributed decision-making in MoE/ensemble models may be harder to constrain uniformly.

---

## We Were Wrong About Defense Iatrogenesis (And That's How Science Works)

In Sprint 21, we published a finding: **"Certain defense mechanisms show iatrogenic effects—they reduce some refusals while increasing attack success by ~10pp."**

We measured this using heuristic classifiers on FLIP traces. The effect looked real. We were preparing a separate paper on it.

Then we re-graded the same traces using extended FLIP grading (not heuristic detection) at higher n. Result: **p=1.0, no statistical difference.** The iatrogenic effect was a heuristic artifact.

This happened because:
1. Our keyword-based "defense engagement" detector had high false-positive rate on hedged responses
2. It flagged statements like "I should clarify..." as safety engagement when they were actually helpful tone
3. At low n (~40 traces), random variation in classifier errors created apparent correlation

**What we didn't get wrong:**
- The protective effect for Qwen 3.5 (-40pp ASR reduction, p=0.004) is *real* and replicated
- Defense mechanism selection matters
- Some models benefit from constraint reinforcement; others don't

**Why we're flagging this publicly:**
Because the alternative to admitting this is publishing two contradictory papers (one with heuristic grading, one with FLIP), creating permanent confusion in the literature. Replication found the error. The error was ours. We correct it.

This is the framework working as intended: hypothesis → test at scale → evaluate with better methodology → publish correction. The correction itself is data—it tells us something about how classifier drift introduces systematic bias, which we can now watch for in other analyses.

---

## Sprint 22 Update

**Benchmark Progress:**
- Gemma 4, Mistral Small 4, and related variants (119B MoE family): 127 traces collected, FLIP-graded
- iatrogenic re-grading: 60 traces, extended FLIP methodology
- Confidence interval tightening: we can now distinguish Qwen 3.5 from Gemini 2 at p<0.01

**Infrastructure:**
- CI Actions usage down ~70% (path filtering + job concurrency groups)
- Site build time: 2.1s (no change, but reduced dependency chains)

**What's next:**
We're now tracking whether the "safety doesn't scale" pattern holds for 200B+ models (testing next week). We also have preliminary results on whether smaller, better-safety-trained models (Qwen 3.6B) consistently outperform 30B variants. Early signal suggests they do—but we want triple-replication before publishing.

---

## The Reminder

When a finding doesn't hold under better methodology, that's not failure. It's the detection system working. Scientists who hide wrong findings are the problem. Researchers who correct them transparently are the solution.

Failure-first means studying how things break—including how our own analyses break under scrutiny.
