---
title: "CoP: Agentic Red-teaming for LLMs using Composition of Principles"
description: "An extensible agentic framework that composes human-provided red-teaming principles to generate jailbreak attacks, achieving up to 19x improvement over single-turn baselines."
date: 2026-03-26
arxiv: "2506.00781"
authors: "Chen Xiong, Pin-Yu Chen, Tsung-Yi Ho"
paperType: "methods"
tags: [red-teaming, jailbreak, agentic-attacks, attack-composition, llm-safety]
draft: false
---

Automated red-teaming has emerged as a necessary complement to manual adversarial testing, but most existing approaches either generate attacks from a fixed template library or rely on gradient-based optimization that requires white-box model access. Xiong, Chen, and Ho propose **Composition of Principles (CoP)**, an agentic framework that bridges the gap between human expertise and automated attack generation by allowing red-teamers to express attack strategies as composable principles that an AI agent then orchestrates into concrete jailbreak prompts.

### Principles as Composable Building Blocks

The central design choice in CoP is treating red-teaming knowledge as modular principles rather than monolithic attack templates. Each principle encodes a specific adversarial strategy: role-playing, hypothetical framing, authority appeals, output format manipulation, or emotional pressure. The agent then composes multiple principles into a single attack, exploring combinations that human red-teamers might not consider or would take prohibitive time to test manually.

This compositional approach offers two advantages over prior automated methods. First, it is inherently extensible: new attack strategies discovered through manual testing can be encoded as additional principles without retraining the agent or modifying the framework architecture. Second, it captures the combinatorial nature of real-world jailbreaks, which typically layer multiple manipulation techniques rather than relying on a single vector.

### Agentic Orchestration of Attack Strategies

CoP goes beyond simple template filling by employing an agentic loop where the attacking model iteratively refines its prompts based on target model responses. The agent selects which principles to activate, determines their ordering and emphasis, and adapts its strategy based on whether partial compliance or outright refusal was observed. This feedback-driven approach mirrors how skilled human red-teamers adjust their tactics mid-conversation.

The framework's unified architecture means it can encompass and orchestrate diverse red-teaming methodologies that were previously studied in isolation. Persona hijacking, constraint erosion, format locking, and research-context pressure --- all documented attack families in the adversarial AI literature --- become composable modules within a single system.

### 19x Improvement Over Single-Turn Baselines

Testing against leading commercial and open-source LLMs, CoP achieves up to 19 times improvement in attack success rate compared to existing single-turn attack methods. This dramatic multiplier reflects the power of principled composition: while any individual attack strategy may be well-defended against, novel combinations expose gaps in safety training that were never explicitly addressed.

The magnitude of this improvement raises important questions about the adequacy of current safety evaluation practices. If a structured composition of known attack principles can achieve an order-of-magnitude improvement, it suggests that defenses trained against individual attack patterns provide substantially less protection than their per-pattern evaluation scores would imply. This echoes findings from our own F41LUR3-F1R57 research on non-compositionality of safety defenses.

### Connections to the Failure-First Framework

CoP's results directly reinforce several core findings from the failure-first research program. The compositional attack surface aligns with documented observations that safety alignment is not compositional: models robust to technique A and technique B individually may be vulnerable to A combined with B. CoP provides a systematic method for exploring this combinatorial space.

The framework also demonstrates the scalability challenge facing defenders. Each new principle added to CoP's library multiplicatively expands the attack surface, while each new defense must be tested against all existing combinations. This asymmetry between attack composition (multiplicative) and defense validation (exponential) is a structural property of the safety alignment problem that no amount of additional safety training can fully resolve.

From a methodological perspective, CoP's principle-based architecture offers a useful formalization for cataloguing and systematizing attack technique families. The explicit separation of strategy (principles) from execution (agent) creates a clean interface for comparing attack effectiveness across models and tracking how vulnerability patterns evolve over time.

*Read the [full paper on arXiv](https://arxiv.org/abs/2506.00781) · [PDF](https://arxiv.org/pdf/2506.00781.pdf)*
