---
title: "RED QUEEN: Safeguarding Large Language Models against Concealed Multi-Turn Jailbreaking"
description: "Reveals that multi-turn jailbreaking achieves 87.62% success on GPT-4o by concealing harmful intent across dialogue turns, and introduces RED QUEEN GUARD that reduces attack success to below 1%."
date: 2026-04-06
arxiv: "2409.17458"
authors: "Yifan Jiang, Kriti Aggarwal, Tanmay Laud, Kashif Munir, Jay Pujara, Subhabrata Mukherjee"
paperType: "empirical"
tags: ["multi-turn-jailbreaking", "conversational-safety", "red-teaming", "safety-guardrails", "llm-defense"]
draft: false
---

# RED QUEEN: Safeguarding Large Language Models against Concealed Multi-Turn Jailbreaking

**Focus:** Jiang et al. expose a fundamental vulnerability in LLM safety mechanisms by demonstrating that harmful intent can be concealed across multiple dialogue turns, achieving attack success rates of 87.62% on GPT-4o and 75.4% on Llama3-70B. They then introduce RED QUEEN GUARD, a mitigation strategy that reduces these rates to below 1%.

---

### Key Insights

- **Multi-turn concealment defeats single-turn safety alignment.** The RED QUEEN ATTACK distributes harmful intent across multiple conversational turns, where each individual turn appears benign. This exploits a structural weakness in safety training: models are predominantly aligned on single-turn interactions, and their safety reasoning does not aggregate threat signals across a conversation history. The 87.62% success rate on GPT-4o demonstrates that even frontier models are vulnerable to this strategy.

- **Larger models are more vulnerable, not less.** The finding that larger models exhibit higher attack success rates inverts the common assumption that scale improves safety. The authors attribute this to larger models' superior instruction-following capabilities: they are better at maintaining conversational context, which means they are also better at following a multi-turn attack trajectory to its harmful conclusion. This capability-vulnerability coupling is a fundamental tension in model scaling.

- **56,000 examples across 14 categories establish a benchmark.** The generated dataset of multi-turn attack examples provides systematic coverage across harmful categories and scenarios, creating a reusable resource for evaluating multi-turn safety. The scale (40 scenarios per category, 14 categories) enables statistically meaningful comparisons that single-study attack demonstrations cannot support.

- **RED QUEEN GUARD achieves near-complete mitigation.** The defense reduces attack success to below 1% while preserving performance on standard benchmarks. The key mechanism is maintaining awareness of cumulative conversational intent rather than evaluating each turn in isolation. This represents a shift from per-message safety filtering to conversation-level threat assessment.

### Failure-First Relevance

RED QUEEN directly validates one of our core research hypotheses: that multi-turn interaction is the primary attack surface for deployed AI systems, and that single-turn safety alignment provides a false sense of security. Our multi-agent scenario dataset was designed precisely to test this class of vulnerability, where adversarial intent is distributed across interaction sequences. The capability-vulnerability coupling finding is particularly important for embodied AI, where we want more capable models to handle complex physical tasks but that same capability makes them better at following multi-turn attack sequences. The 87.62% success rate on GPT-4o provides a concrete data point for our vulnerability landscape analysis, and the RED QUEEN GUARD defense model offers a template for conversation-level safety monitoring that could be adapted for embodied agent interactions. The scale of the generated dataset (56,000 examples) also provides a potential complement to our own multi-turn evaluation corpus.

### Open Questions

- Does the RED QUEEN ATTACK transfer to embodied settings where multi-turn interactions involve physical actions between dialogue turns, adding temporal gaps and environmental state changes?

- How does RED QUEEN GUARD's conversation-level monitoring interact with instruction hierarchy enforcement, where system-level safety instructions must be maintained across extended interactions?

- Can adaptive adversaries defeat RED QUEEN GUARD by introducing sufficient benign turns between attack turns to dilute the cumulative threat signal below the detection threshold?

---

*Read the [full paper on arXiv](https://arxiv.org/abs/2409.17458) · [PDF](https://arxiv.org/pdf/2409.17458.pdf)*
