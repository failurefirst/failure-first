---
title: "AI Safety Daily — April 28, 2026"
description: "Large-scale public competition data confirms indirect prompt injection as a pervasive vulnerability across model families; Skill-Inject shows skill-file attacks achieve up to 80% success on frontier models; AgentLAB demonstrates that long-horizon attack chains evade defences calibrated for single-step injections."
date: 2026-04-28
tags: ["ai-safety-daily", "prompt-injection", "agentic-ai", "agent-security", "red-teaming"]
draft: false
image: "https://cdn.failurefirst.org/images/blog/ai-safety-daily-2026-04-28.png"
---

## AI Safety Research Digest — April 28, 2026

> *Today is the opening day of the GPT-5.5 Bio Bug Bounty testing window. The parallel literature on agentic attack surfaces provides useful framing for what structured testing at scale tends to surface.*

### Key Findings

- **Large-scale competition data confirms indirect prompt injection as a pervasive vulnerability.** Dziemian et al. (Mar 2026) report findings from a public red-teaming competition targeting LLM agents across coding, tool-calling, computer-use, and memory scenarios. The study documents widespread indirect prompt injection vulnerability across multiple model families — attacks that manipulate agent behaviour through content in the environment rather than direct user instructions, and that do not reveal the compromise in the agent's final response. Attack success rates and transferability patterns vary by model architecture and scenario type; the dataset represents the largest empirical record on this attack class published to date. The finding that compromise is not visible in the final response is the key deployment implication: output monitoring cannot detect these attacks. [Link](https://hf.co/papers/2603.15714)

- **Skill-file attacks achieve up to 80% success on frontier models.** Skill-Inject (Schmotz et al., Feb 2026) characterises an attack surface specific to agents that execute code from modular capability libraries ("skill files"). Frontier models show up to 80% vulnerability to harmful instruction execution via this pathway — even when equivalent instructions in a direct user prompt would be refused. The attack exploits a trust asymmetry: skill-file content is treated as trusted execution context rather than user input, bypassing the input-level safety layer. The paper advocates context-aware authorisation frameworks that tag content by trust level rather than by channel. [Link](https://hf.co/papers/2602.20156)

- **Long-horizon attack chains defeat defences calibrated for single-step injection.** AgentLAB (Jiang et al., Feb 2026) benchmarks agents against attacks that unfold across multiple steps — intent hijacking, tool chaining, objective drifting, memory poisoning. The finding is consistent with the multi-turn jailbreak literature: defences that stop single-step injection fail systematically when the harmful payload is distributed across a sequence of individually benign-looking actions. AgentLAB provides structured ground truth for evaluating long-horizon robustness across multiple agent environments and attack types. [Link](https://hf.co/papers/2602.16901)

- **The agentic attack surface is structurally different from the text-generation attack surface.** Indirect injection (environment-mediated), skill-file trust exploitation, and long-horizon objective drifting are attacks not captured by standard LLM safety benchmarks. An agent that passes a jailbreak evaluation on direct inputs may still be vulnerable to all three. Evaluation frameworks that test only the direct user-instruction pathway are measuring a subset of the attack surface.

### Methodological Implication

Skill-Inject's finding that skill-file content bypasses input-level safety is a concrete argument for trust-level tagging in agent architectures. A safety evaluation that does not test indirect and module-composition pathways separately from direct instruction pathways is leaving the majority of the agentic attack surface unmeasured.

### Implications for Embodied AI

Embodied agents running VLA models with skill/module composition are directly in scope for all three attack classes documented today. A household robot that loads skill modules from a shared library, receives indirect instructions through sensory input, and plans across a 20-step task horizon is exposed to indirect injection, skill-file exploitation, and long-horizon objective drifting simultaneously — and none of the three attack paths is covered by standard embodied safety benchmarks.

---

*Research sourced via Hugging Face/arXiv paper discovery. NLM-augmented assets (audio/infographic/video) added by local pipeline when available.*
