---
arxiv_id: "2603.12681"
title: "Colluding LoRA: A Composite Attack on LLM Safety Alignment"
date: 2026-03-18
authors: ["Sihao Ding"]
institutions: ["Mercedes-Benz Research & Development North America"]
tags: ["supply-chain", "LoRA", "compositional-attack", "alignment-degradation", "refusal-suppression"]
relevance: "Novel compositional attack — benign parts combine to break safety, exploiting combinatorial blindness of current defenses"
significance: high
---

## Summary

CoLoRA (Colluding LoRA) introduces a composition-triggered attack: each LoRA adapter appears benign in isolation, yet their linear composition consistently compromises safety alignment. No adversarial prompt or trigger needed — just loading the right combination of adapters suppresses refusal broadly.

## Key Findings

- **Composition-triggered**: no input trigger needed — the attack is in the model weights, not the prompt
- **Benign individually**: each adapter passes single-module safety verification
- **Combinatorial blindness**: exhaustively scanning all adapter compositions is computationally intractable
- **Broad refusal suppression**: once composed, the model complies with harmful requests without adversarial prompts
- Tested across several open-weight LLMs

## Relevance to Failure-First

- Validates our **supply chain injection** family at a deeper level — SCA attacks the prompt, CoLoRA attacks the weights
- Extends the concept to **model composition**: the modular AI ecosystem creates attack surfaces that don't exist in monolithic models
- Connects to our **technique non-additivity** finding: individual attacks don't stack, but compositional weight-level attacks DO
- From Mercedes-Benz R&D — automotive industry is taking embodied AI safety seriously
