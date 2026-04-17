---

title: "Multi-Stream Perturbation Attack: Breaking Safety Alignment of Thinking LLMs Through Concurrent Task Interference"
description: "Proposes a jailbreak attack that interweaves multiple task streams within a single prompt to exploit unique vulnerabilities in thinking-mode LLMs, achieving high attack success rates while causing thinking collapse and repetitive outputs across Qwen3, DeepSeek, and Gemini 2.5 Flash."
date: 2025-12-11
arxiv: "2603.10091"
authors: "Fan Yang"
paperType: "empirical"
tags: ["jailbreak", "reasoning-models", "thinking-mode", "format-lock", "multi-turn", "concurrent-interference"]
draft: false
audio: "https://cdn.failurefirst.org/audio/daily-paper/2025-12-11-multi-stream-perturbation-attack.m4a"
---

# Multi-Stream Perturbation Attack: Breaking Safety Alignment of Thinking LLMs Through Concurrent Task Interference

**Focus:** Yang introduces a novel attack against thinking-mode LLMs that exploits concurrent task processing. Rather than targeting the content of the reasoning chain, the attack overloads it by interleaving multiple task streams, character reversals, and format constraints within a single prompt. This causes the model's reasoning process to either collapse entirely or degenerate into repetitive loops, bypassing safety alignment in the process.

---

## Key Insights

- **Thinking mode creates new attack surfaces.** The step-by-step reasoning process that makes thinking LLMs more capable also makes them more vulnerable when that reasoning is disrupted. The extended reasoning chain provides more surface area for interference than a direct response would.

- **Three perturbation strategies compound.** Multi-stream interleaving (concurrent task interference), inversion perturbation (character reversal), and shape transformation (format constraints) each disrupt the thinking process differently. Their combination is more effective than any single strategy.

- **Thinking collapse is a distinct failure mode.** Up to 17% of attacked responses exhibited complete thinking collapse, and 60% showed response repetition. These are not just safety bypasses but fundamental breakdowns in the model's reasoning capacity.

- **Broad model coverage.** The attack achieves high success rates across mainstream thinking models including Qwen3 series, DeepSeek, Qwen3-Max, and Gemini 2.5 Flash, suggesting this is a systemic vulnerability in thinking-mode architectures rather than a model-specific flaw.

## Failure-First Relevance

This paper directly validates several F41LUR3-F1R57 research findings. The multi-stream perturbation approach is structurally similar to our format-lock attack family, where format constraints compete with safety constraints for the model's attention budget. The thinking collapse phenomenon maps onto our documented reasoning trace vulnerabilities (Mistake #18), where extended reasoning can be manipulated to undermine safety. For embodied AI systems that use thinking-mode models for planning, concurrent task interference could cause a planning agent to lose coherence mid-execution, a scenario with direct physical safety implications.

## Open Questions

- Does thinking collapse transfer to agentic settings where the reasoning model is embedded in a tool-use loop? A collapsed reasoning chain that still produces tool calls could trigger irreversible physical actions.

- How does the attack interact with safety-tuned reasoning models that have been specifically trained to maintain safety awareness throughout their chain-of-thought?

- Can concurrent task interference be detected by monitoring reasoning chain coherence metrics before the final response is emitted?

---

*Read the [full paper on arXiv](https://arxiv.org/abs/2603.10091) · [PDF](https://arxiv.org/pdf/2603.10091.pdf)*
