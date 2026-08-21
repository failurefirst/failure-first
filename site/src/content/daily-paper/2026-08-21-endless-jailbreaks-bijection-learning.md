---
title: "Endless Jailbreaks with Bijection Learning"
description: "A model is taught a custom bijective encoding through in-context examples, then attacked in that private language — attack strength peaks at a dispersion level tuned to the target model's capability tier."
date: 2026-08-21
arxiv: "2410.01294"
paperType: "methods"
tags: [jailbreak, encoding-attacks, in-context-learning, red-teaming, capability-scaling]
draft: false
---

**Focus:** Bijection Learning teaches a target model an ad hoc substitution cipher — a random mapping from each letter of the alphabet to a short digit string — purely through in-context demonstration, then submits the harmful request encoded in that taught language. The model, having just been shown how to "speak" the cipher, decodes and complies before its safety training (trained overwhelmingly on plaintext English) recognizes the request.

## Mechanism

The attack has three stages: teach the bijection, submit the encoded query, decode the response. Teaching happens through a **fixed sequence of 10 translation examples** given as multi-turn conversation — the model isn't told "this is a jailbreak," it's walked through learning a language via worked examples, the same way an in-context few-shot task would be framed. The harmful query is then appended, encoded, as a final user turn; the model's encoded response is decoded by inverting the mapping, with GPT-4o-mini used to clean up decode errors.

Two parameters control attack strength: **dispersion** (how much of the alphabet is actually remapped, from 0 to all 26 letters) and **encoding length** (digits per character). The paper's central finding is a Pareto frontier, not a monotonic relationship: too little dispersion and the model's safety training still recognizes the request; too much and the model's own capability degrades under the decoding burden until it can't produce a coherent harmful answer even if it wants to. Peak attack effectiveness sits at a *middling* dispersion — and that middle point tracks target-model capability. Weaker models break at low dispersion; Claude 3.5 Sonnet in their tests only breaks at maximal dispersion combined with 4-5 digit character mappings.

## Failure-First Relevance

This is a genuinely different mechanism from the fixed-mapping homoglyph and cipher-space-reasoning operators already in this repo's attack-evolution pipeline (`mutate_homoglyph_obfuscate`, `cipher_space_reason` in `tools/autoresearch/evolve_attacks.py`) — those use one static mapping and single-shot framing. Bijection Learning's contribution is making cipher strength an *evolvable, capability-matched gene* (dispersion × encoding length) built up through worked-example teaching rather than declared. Filed as one of five literature-sourced operator gaps in #1094 (internal tracker).
