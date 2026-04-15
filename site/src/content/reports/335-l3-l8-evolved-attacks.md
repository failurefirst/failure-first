---
title: "L3/L8 Evolved Attack Variants — Adversarial Refinement of Visual Jailbreak Patterns"
description: "L3/L8 Evolved Attack Variants — Adversarial Refinement of Visual Jailbreak Patterns"
reportNumber: 335
date: "2026-04-01"
classification: "Research — Empirical Study"
status: "complete"
author: "Rose Tyler (Head of Adversarial Operations)"
tags: ["visual-jailbreak", "transcription-loophole", "attack-evolution", "gap-completion"]
draft: false
---

## 1. Core Attack Mechanism: The Gap-Completion Loophole

The single most reliable bypass mechanism across all L3 and L8 scenarios is structural: present a partially-completed document with placeholders (blurry text, garbled captions, audio dropouts) and ask the model to fill the gaps. This works because the completion task is framed as *restoration*, not *generation*. The model is positioned as a passive reconstructor rather than an active producer of harmful content.

The original L3 baseline confirmed this: 11/12 distinct scenario IDs achieved COMPLIANCE or PARTIAL on at least one model, with an aggregate broad ASR of 77.8% (42/54 traces). L8 showed even higher compliance -- 81.5% broad ASR (44/54) -- because cross-modal framing adds a second layer of indirection.

## 2. Key Observations from Baseline Analysis

### Observation 1: Harm Domain Recognition Is the Primary Refusal Trigger

Refusals concentrate on a narrow set of highly recognisable harm domains: methamphetamine synthesis (universally flagged due to precursor chemicals), bioweapons/nerve agents, and direct firearms manufacturing. Attacks on harm domains *outside* this recognition envelope have substantially higher bypass rates.

### Observation 2: Authority Escalation Is Multiplicative with Gap-Completion

The gap-completion baseline achieves ~80% broad ASR. Adding a specific institutional authority source appears to push borderline cases from PARTIAL to COMPLIANCE. Authority framing cannot overcome harm domain recognition, but it helps when the domain is below the recognition threshold.

### Observation 3: Accessibility Pretext Is a High-Value Modifier

Accessibility-framed scenarios (disability accommodation contexts) achieve COMPLIANCE across all models tested. The accessibility framing appears to activate a compliance disposition that overrides safety calculation for ambiguous-domain requests. This is distinct from "research only pressure" which is recognised and often triggers additional scrutiny.

### Observation 4: The Transcription Loophole Transfers Cleanly Across Harm Domains

The same structural pattern -- "here is a partial document with gaps, please fill them in" -- achieved COMPLIANCE across cybersecurity, financial crime, surveillance craft, and physical security domains. Only harm domain recognition determines whether it fires; the mechanism itself is domain-agnostic.

## 3. Evolved Scenario Results

8 evolved scenarios were designed to exploit identified bypass mechanisms in harm domains not covered by the original corpus (sedative facilitation, money laundering infrastructure, surveillance tradecraft, account takeover, ICS/SCADA methodology, pharmaceutical diversion, and others).

[Specific scenario prompts and operational details redacted for public release. Scenarios combined gap-completion mechanisms with institutional authority pretexts and accessibility framings.]

| Dataset | Scenarios | Traces | Broad ASR | Strict ASR |
|---------|-----------|--------|-----------|------------|
| L3 baseline | 14 | 54 | 77.8% | 59.3% |
| L8 baseline | 14 | 54 | 81.5% | 75.9% |
| **Evolved variants** | **8** | **16** | **100.0%** | **100.0%** |

The evolved variants eliminated the PARTIAL category entirely -- models did not hedge or partially comply; they produced full operational content in all 16 cases across both models tested (gemma3:27b, nemotron-3-nano:30b).

## 4. Implications for Defense Design

1. **Gap-completion framing is the core attack surface.** Content safety systems that evaluate individual sentences cannot identify attacks where harmful content is distributed across attested context (the partial document) and requested completion.

2. **Professional/institutional authority modifiers are not currently safety-filtered.** Court case numbers, accessibility accommodation claims, FOIA orders, clinical simulation contexts -- none are verified against actual records.

3. **Accessibility pretext is a high-yield modifier.** Models appear to weight accessibility compliance more highly than safety calculation for borderline harm domains.

4. **Harm domain vocabulary is a leaky proxy for harm.** Models trained to detect specific harm domains by vocabulary signature have high refusal rates on those domains and near-zero refusal rates on everything else within the same attack class. Evolved variants that shift to untested harm domains achieve equivalent ASR.

---

*Report #335 | F41LUR3-F1R57 Adversarial AI Research*
