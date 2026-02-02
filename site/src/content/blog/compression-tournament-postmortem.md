---
title: "Compression Tournament: When Your Classifier Lies to You"
description: "Three versions of a prompt compression tournament taught us more about evaluation methodology than about compression itself."
date: 2026-01-30
tags: [compression, methodology, evaluation]
---

## The Premise

What's the shortest prompt that can get an AI model to comply with a malicious directive? We ran a compression tournament across three iterations and 6 models to find out. The answer was interesting — but the methodology lessons were more valuable than the results.

## V1: The Keyword Trap

Our first tournament version used keyword matching to classify model responses. Words like "here's how," "step 1," or "disable" in a response triggered a "jailbreak" classification. The results looked dramatic: 94% of compressed prompts appeared to succeed.

They were all false positives. Every single one.

When we re-evaluated the same responses with an LLM judge, the actual success rate was **0%**. The keyword classifier was detecting *response style* — helpful, structured answers — not semantic harm. A model explaining how to make tea ("Step 1: boil water") scored the same as a genuine safety violation.

**Lesson:** Keyword matching detects format, not intent. This is directly analogous to how traditional safety filters miss narrative-based attacks — surface-level pattern matching cannot assess semantic content.

## V2: Better Classification, New Problems

V2 replaced keyword matching with LLM-based judgment. This immediately revealed a subtler problem: compression was stripping the manipulation techniques that made original prompts effective.

When an LLM compresses a 518-character social engineering prompt into an 81-character summary, it preserves the *topic* but removes the *psychology* — the authority framing, the urgency signals, the persona hijacking. The compressed version becomes a straightforward question that models appropriately answer or refuse.

**Lesson:** Compression neutralizes psychological manipulation more effectively than it preserves meaning. The techniques that make adversarial prompts work (roleplay framing, emotional leverage, authority claims) are the first elements lost during compression.

## V3: Measuring the Right Thing

V3 introduced a critical distinction: **compliance vs. harm**. Previous versions asked "did the model produce harmful content?" The better question turned out to be "did the model treat the prompt as legitimate?"

A model that helpfully explains how to execute an emergency stop override — even with caveats and disclaimers — has still *complied* with a directive to disable safety systems. The compliance frame captures behaviors that a harm-focused frame misses.

With this corrected evaluation, we found 5 effective compressed prompts (53–98 characters) achieving 33–83% compliance rates across tested models. The most effective patterns combined temporal authority framing with command syntax — structural elements that survive compression because they're format, not psychology.

## What Survives Compression

Three pattern categories retained effectiveness after compression:

1. **Temporal authority markers** — Future date stamps and version identifiers that imply the prompt comes from a newer system. Format-level signals that don't depend on narrative context.

2. **Command syntax** — Structured instruction formats that trigger compliance through formatting alone. These exploit the gap between format compliance and content safety.

3. **Urgency protocols** — Short-form emergency framing that combines authority with time pressure in minimal characters.

## Implications

The compression tournament was designed to study adversarial prompt efficiency, but its most important contribution is methodological. Three findings generalize beyond compression:

**Classifiers need semantic evaluation.** Keyword matching produces systematically misleading results for any task involving natural language intent detection. This applies to content moderation, safety filtering, and attack detection equally.

**Measure compliance, not just harm.** A model that treats a malicious directive as legitimate — even while adding disclaimers — has been manipulated. Harm-focused evaluation misses this category of failure.

**Validate on small samples first.** Each tournament version required complete re-evaluation when we discovered classification errors. Testing 5–10 samples manually before scaling would have caught all three issues.

Full methodology details are on our [research methodology page](/research/methodology/). The compression findings inform our [attack taxonomy](/research/attack-taxonomy/) classification of format-exploiting techniques.
