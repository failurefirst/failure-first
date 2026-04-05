---
title: "Llama Guard: LLM-based Input-Output Safeguard for Open-Ended Generative Models"
description: "First LLM-based safety filter—delegates moderation to a smaller, specialized safety model"
date: 2025-10-02
arxiv: "2312.06674"
authors: "Hakan Inan, Kartikeya Upasani, Andrew Poulton, Telmo Vieira, Rashi Malik, Andrew Tran, Joelle Pineau, Yasemin Akyürek, Meta"
paperType: "empirical"
tags: [safety-filtering, llm-as-judge, moderation-framework, taxonomy, content-policy]
draft: false
---

## Llama Guard: Delegating Harm Detection to LLMs

Meta's Llama Guard (2023) introduced a paradigm shift: instead of building hand-crafted content filters or classifier ensembles, use a smaller LLM fine-tuned to recognize harm patterns. This approach proved remarkably effective for understanding context-dependent harms that fixed keyword lists miss.

## Key Innovation

- **LLM-as-judge pattern:** A 7B safety model evaluates both inputs and outputs against a structured taxonomy
- **Unsafe Category Taxonomy:** 6 input categories (illegal activity, child abuse, unethical behavior, physical violence, economic fraud, sexual content) + 4 output categories (violence, illegal activity, unethical behavior, sexual content)
- **Reasoning transparency:** Model explains its moderation decision, enabling human review
- **Open weights:** Available through Meta's Llama model releases

## The Taxonomy Insight

By formalizing safety as a taxonomy of violation categories, Llama Guard made moderation **explainable** and **auditable**—a critical requirement for deployed systems where safety decisions affect real people.

## Embodied AI Relevance

F41LUR3-F1R57 research has shown that embodied systems require **contextual safety constraints**. A robot in a hospital setting has different risk profiles than one in a warehouse. Llama Guard's taxonomy-based approach allows organizations to customize moderation thresholds per deployment context, rather than accepting binary accept/reject decisions.

## Known Limitations

Llama Guard can still be jailbroken via adversarial prompting; the model sometimes over-interprets benign requests as harmful, creating false-positive refusals.

## Impact

This paper spawned a generation of LLM-based moderation tools (including WildGuard, which expands the taxonomy). It demonstrated that safety filtering itself can be learned, not hard-coded.
