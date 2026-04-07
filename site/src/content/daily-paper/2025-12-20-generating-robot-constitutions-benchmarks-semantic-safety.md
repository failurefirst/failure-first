---
title: "Generating Robot Constitutions & Benchmarks for Semantic Safety"
description: "Introduces the ASIMOV Benchmark for evaluating semantic safety in robot foundation models and an automated framework for generating robot constitutions that achieves 84.3% alignment with human safety preferences."
date: 2025-12-20
arxiv: "2503.08663"
authors: "Pierre Sermanet, Anirudha Majumdar, Alex Irpan, Dmitry Kalashnikov, Vikas Sindhwani"
paperType: "empirical"
tags: ["robot-safety", "constitutional-ai", "semantic-safety", "safety-benchmarks", "foundation-models"]
draft: false
---

# Generating Robot Constitutions & Benchmarks for Semantic Safety

**Focus:** Sermanet et al. address the expanding attack surface of language-controlled robots by introducing the ASIMOV Benchmark for evaluating semantic safety in foundation models used as robot controllers, alongside an automated framework that generates behavioral constitutions through a novel auto-amending process.

---

### Key Insights

- **Safety has moved beyond collision avoidance.** The paper frames a fundamental shift: as robots gain vision-language understanding and physical manipulation capabilities, the safety problem expands from geometric (avoiding obstacles) to semantic (understanding when an action is harmful in context). A robot that can follow the instruction "hand me the knife" must also reason about whether the person requesting it is a child, whether the handoff is safe, and whether the broader context makes compliance appropriate.

- **ASIMOV Benchmark combines synthetic and real-world failure data.** The benchmark draws from multiple sources including text and image generation techniques, real-world visual data, and hospital injury reports. This grounding in actual injury data distinguishes it from purely synthetic safety benchmarks and ensures the evaluation scenarios reflect real deployment risks rather than hypothetical edge cases.

- **Auto-amending constitutions outperform human-written rules.** The automated constitution generation process starts with broad safety principles and iteratively refines them through an amending mechanism that adds nuance and specificity. At 84.3% alignment on the ASIMOV Benchmark, this approach surpasses both baseline and human-written constitutions. The implication is that safety rules benefit from systematic enumeration and refinement rather than expert intuition alone.

- **Constitutional AI transfers to the physical domain.** The framework extends Constitutional AI methods from language model alignment to robot control, establishing that the principle of guiding behavior through explicit constitutions applies across the digital-physical boundary. This is a meaningful bridge between LLM safety research and embodied AI safety.

### Failure-First Relevance

This work directly addresses a gap our research has documented: the absence of standardized semantic safety evaluation for embodied AI. Our taxonomy distinguishes between geometric failures (the robot hits something) and semantic failures (the robot does the wrong thing in context), and the ASIMOV Benchmark provides the first systematic evaluation framework for the latter category. The auto-amending constitution approach is particularly relevant to our defense research, as it suggests that safety guardrails for embodied systems may need to be generated and refined algorithmically rather than specified manually. The 84.3% alignment rate, while promising, also reveals a 15.7% failure rate that likely concentrates in precisely the ambiguous edge cases where embodied failures are most dangerous. The use of hospital injury reports as ground truth connects our adversarial research to real-world harm data in a way that strengthens the case for failure-first evaluation.

### Open Questions

- How robust are auto-generated constitutions to adversarial manipulation, where an attacker crafts scenarios specifically designed to exploit gaps between constitutional rules?

- Does the 84.3% alignment rate degrade when evaluated against multi-step tasks where safety considerations compound across sequential actions?

- Can the ASIMOV Benchmark be extended to multi-agent scenarios where multiple robots must coordinate safety reasoning, and where one compromised agent could undermine the safety of the entire system?

---

*Read the [full paper on arXiv](https://arxiv.org/abs/2503.08663) · [PDF](https://arxiv.org/pdf/2503.08663.pdf)*
