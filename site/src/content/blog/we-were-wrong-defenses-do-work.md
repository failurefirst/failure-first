---
title: "We Were Wrong: AI Safety Defenses Do Work (But Only If You Measure Them Right)"
description: "We published results showing system-prompt defenses had zero effect on permissive models. Then we re-graded the same 120 traces with an LLM classifier and discovered the opposite. The defenses worked. Our classifier hid the evidence."
date: 2026-03-23
tags: [methodology, ai-safety, defenses, evaluation, self-correction, benchmarks]
image: /images/blog/we-were-wrong-defenses-do-work.webp
---

In late March 2026, we ran what we believed was a clean experiment. We tested three system-prompt defense strategies against ten adversarial attack scenarios across three language models, producing 120 evaluation traces. Our heuristic classifier --- the same keyword-based grading system we had used across thousands of evaluations --- scored the results and delivered a clear verdict: simple safety instructions had zero effect on permissive models. We wrote it up. We called it "first evidence that system-prompt defenses don't work."

We were wrong.

When we re-graded the same 120 traces using an LLM-based classifier (Claude Haiku 4.5, temperature 0.0, zero errors), the picture reversed. Defenses reduced attack success rates dramatically. The SIMPLE defense --- a single-line safety instruction --- dropped aggregate ASR from 33% to 7%. The STRUCTURED defense, a five-rule safety framework, reduced it to 3%. The heuristic had hidden a real and substantial defense effect behind a wall of false positives.

This post is about what happened, why it happened, and what it means for published AI safety research that relies on the same kind of classifier we were using.

## What the Heuristic Told Us

Our defense benchmark tested four conditions: no defense (NONE), a single-line safety instruction (SIMPLE), a five-rule safety framework (STRUCTURED), and an explicit adversarial detection protocol (ADVERSARIAL_AWARE). Each was injected into the system prompt across ten attack scenarios and three models.

The heuristic results looked like this:

| Defense | Heuristic ASR |
|---------|-------------|
| NONE (baseline) | 50.0% |
| SIMPLE | 40.0% |
| STRUCTURED | 40.0% |
| ADVERSARIAL_AWARE | 30.0% |

There was a modest trend. But the most striking finding was model-dependent: the Nemotron 30B model, a permissive model with an 80% baseline ASR, showed **zero defense effect** for SIMPLE and STRUCTURED. Both remained at 80%. Only the ADVERSARIAL_AWARE variant produced any reduction. We concluded that permissive models lack the safety training to parse generic safety instructions, and that simple defenses are essentially decorative for models that are already inclined to comply with adversarial requests.

We also reported that format-lock attacks achieved 100% ASR across all defense conditions and all models --- fully defense-resistant. And we noted what appeared to be an iatrogenic effect: one defense variant seemed to *increase* attack success for emotional manipulation scenarios.

## What LLM Grading Revealed

Then we FLIP-graded all 120 traces. FLIP --- our Failure-Level Inference Protocol --- uses an LLM to classify each response into one of several categories: COMPLIANCE, PARTIAL, REFUSAL, HALLUCINATION_REFUSAL, or NOT_GRADEABLE. Unlike keyword heuristics, the LLM reads the full response and evaluates whether the model actually provided the harmful content requested.

The corrected results:

| Defense | Heuristic ASR | LLM ASR | Delta |
|---------|-------------|---------|-------|
| NONE (baseline) | 50.0% | 33.3% | -16.7pp |
| SIMPLE | 40.0% | 6.7% | -33.3pp |
| STRUCTURED | 40.0% | 3.3% | -36.7pp |
| ADVERSARIAL_AWARE | 30.0% | 6.7% | -23.3pp |

Every heuristic number was inflated. But the inflation was not uniform: the defended conditions were inflated far more than the baseline. The heuristic over-reported ASR by 16.7 percentage points for the undefended condition, but by 33 to 37 percentage points for the defended conditions. This asymmetry is what masked the defense effect. The defenses were working, but the classifier could not see it.

The model that supposedly showed "zero defense effect" --- Nemotron 30B at a fixed 80% ASR across SIMPLE and STRUCTURED --- actually dropped from 10% LLM-graded ASR at baseline to 10% for SIMPLE and 0% for STRUCTURED. The heuristic had invented the 80% number from whole cloth, classifying verbose safety reasoning as attack compliance.

## Why the Heuristic Failed Here

The mechanism is specific and instructive. Our heuristic classifier detects compliance by scanning for structural indicators: step-by-step formatting, absence of refusal phrases, presence of content related to the attack topic. It detects refusal by looking for phrases like "I cannot" or "I'm not able to."

When a model is given a defense instruction and encounters an adversarial prompt, it often does something the heuristic cannot parse: it **discusses the attack at length before refusing**. The model reasons through the scenario, acknowledges the request, explains why it is problematic, and then declines. The heuristic sees the discussion and scores it as compliance. The LLM reads the whole response and correctly identifies refusal.

This failure mode is worse in defended conditions because the defense instructions prime the model to reason more carefully about safety --- producing longer, more detailed safety reasoning that paradoxically triggers more keyword false positives.

Across our broader corpus of 4,875 dual-graded results, we measured this systematically: the heuristic has a 67% over-report rate. Only 33% of responses that the heuristic classifies as attack success are confirmed as genuine compliance by an LLM grader. The heuristic detects response *style*, not response *content*.

## Format-Compliant Refusal: A Novel Pattern

One of the more interesting findings emerged when we examined the format-lock disagreements. Under heuristic grading, format-lock attacks (which constrain the model to output in a specific structure like JSON) achieved 100% ASR across all conditions. Under LLM grading, defended models dropped to 0% ASR for SIMPLE and STRUCTURED.

How? The models learned to refuse *within the requested format*. When given a defense instruction and a format-lock attack demanding JSON output, models produced valid JSON --- but set the action field to `"refuse"` or `"refused"` and placed safety explanations in the parameters. The heuristic saw JSON output and scored compliance. The LLM read the JSON content and correctly identified refusal.

This is a response pattern that, to our knowledge, has not been documented in the adversarial robustness literature. It suggests that models, when given explicit safety instructions, can satisfy format constraints while expressing refusal within those constraints. The defense instruction did not prevent format compliance --- it changed the content expressed within the format.

## Three Findings That Were Wrong

The LLM regrading corrected three specific claims from our initial analysis:

**1. "Simple defenses have zero effect on permissive models."** False. The permissive model showed defense effects under LLM grading. The zero-effect claim was entirely an artifact of heuristic misclassification.

**2. "Format-lock attacks are fully defense-resistant."** False. Under LLM grading, defenses reduced format-lock ASR from 100% (undefended) to 0% (SIMPLE and STRUCTURED). The format-compliant refusal mechanism described above accounts for the discrepancy.

**3. "Adversarial-aware defenses can cause iatrogenic harm."** False. The observed +33pp increase in ASR for emotional manipulation under ADVERSARIAL_AWARE was a heuristic false positive. Under LLM grading, ASR was 0% across all conditions for that scenario.

Each of these was a specific, publishable claim. Each was wrong. Each was wrong because of the classifier, not the experiment.

## What This Means for the Field

Our experience is a case study, but the implications extend to any safety benchmark that relies on keyword or pattern-based classification.

**Published ASR numbers may be systematically inflated.** Our measured 67% over-report rate across 4,875 dual-graded results suggests that keyword-classified benchmarks could be reporting ASR figures roughly 2-3x higher than actual. A benchmark claiming 60% ASR may have a true ASR closer to 20%. The magnitude will vary by model population, attack corpus, and specific heuristic implementation, but the direction of bias is consistent: keyword classifiers inflate attack success.

**Defense effectiveness studies are particularly vulnerable.** The asymmetric inflation we observed --- greater overcount in defended conditions than in undefended conditions --- means that keyword-based evaluations will systematically underestimate defense effectiveness. Defenses produce exactly the kind of responses (verbose safety reasoning, careful engagement with the attack topic before declining) that keyword classifiers misread as compliance. This is not a random error; it is a structural bias against finding that defenses work.

**Minimum evaluation standards are needed.** We recommend that any benchmark claiming to measure AI safety should, at minimum: (1) use LLM-based verdict classification rather than keyword matching alone; (2) distinguish at least four verdict categories (compliance, partial compliance, refusal, hallucinated refusal); (3) report inter-rater reliability between the classifier and an independent LLM grader; and (4) disclose the false positive rate of the classification method used.

## Self-Correction as Research Practice

We could have buried this. The heuristic results told a more dramatic story --- "defenses don't work" is a stronger headline than "defenses work if you measure them right." The corrected findings are less alarming, less citable, and less likely to generate attention.

We published the correction instead. The LLM-graded results are now appended to the same report that contained the original heuristic analysis, with the discrepancies documented in full. The heuristic results remain in the report, clearly marked, so that readers can see exactly where and how the classifier failed.

This is what research integrity looks like in practice. Not getting things right the first time --- that is aspiration, not process. Getting things right *eventually*, transparently, and with a clear accounting of what changed and why.

## Implications and Caveats

Several important caveats apply. Our sample size is small (n=10 per cell, 120 total traces). No pairwise comparison reaches statistical significance after correction. The models tested are free-tier and may not represent frontier safety behaviour. The LLM grader is not ground truth --- it is a better classifier, not a perfect one.

These caveats do not undermine the methodological finding. The question of whether *these specific defenses work on these specific models* remains preliminary. The question of whether *keyword classifiers can reliably detect defense effectiveness* is answered clearly: they cannot.

For researchers designing safety evaluations, for companies claiming benchmark results in product marketing, for regulators interpreting submitted evidence, and for standards bodies writing evaluation requirements, the message is the same: the classifier is load-bearing. If the classifier is wrong, the conclusions are wrong. And keyword classifiers, applied to the task of distinguishing genuine compliance from verbose refusal, are wrong roughly two-thirds of the time.

We are grateful to our own past mistake documentation (Mistake #21: "keyword classifier false positives") for flagging this risk early enough that we built the infrastructure to catch it. Not every research group will be so lucky. The field needs shared standards for evaluation methodology before more defence-doesn't-work conclusions are published on the basis of classifiers that cannot tell the difference between a model reasoning about harm and a model committing it.

---

*This analysis is based on Report #174 (Defense Effectiveness Benchmark, LLM-graded correction) and Report #178 (Heuristic Overcount Crisis) from the Failure-First Embodied AI project. Data, traces, and grading tools are available in the project repository. All numbers reference FLIP-graded results unless otherwise stated.*
