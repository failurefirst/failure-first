---
title: "AutoDAN: Generating Adversarial Examples via Automatic Optimization"
description: "Proposes an automated approach to generate adversarial inputs against aligned LLMs using evolutionary algorithms and semantic mutation, achieving high attack success rates without manual engineering."
date: 2025-11-02
arxiv: "2310.04451"
authors: "Shuai Liu, Ning Ding, Bowen Zhou, Yuxiao Dong, Tang Xu, Xuanjing Huang"
paperType: "empirical"
tags: [jailbreaking, adversarial-generation, evolutionary-algorithms, llm-safety, automatic-attacks]
draft: false
---

Manual adversarial examples require domain expertise and careful engineering. AutoDAN explores whether automated search can discover effective jailbreaks at scale without human intervention. The key insight is treating jailbreak discovery as a black-box optimization problem: mutate candidate prompts, evaluate success against a target model, and retain improvements.

The method combines semantic mutation (replacing words with similar ones) with a genetic algorithm framework, allowing simultaneous evolution of multiple jailbreak candidates. Unlike gradient-based attacks that require model access to compute gradients, AutoDAN operates on discrete text tokens, making it applicable to closed-source APIs.

Critically, the evolved prompts often transfer to unseen models, suggesting that jailbreaks exploit shared vulnerabilities across LLM architectures rather than model-specific quirks. AutoDAN generates prompts that appear natural to humans while reliably triggering unsafe outputs—a key distinction from obvious adversarial examples.

For embodied AI, this finding matters: if robots are controlled by LLMs that accept natural-language commands from untrusted sources (users, cloud interfaces, sensor noise interpreted as text), then automated discovery of transferable adversarial prompts becomes a practical threat. A robot trained to follow instructions about object manipulation might be vulnerable to subtly-mutated commands discovered by evolutionary search on a different model.

The work demonstrates that adversarial robustness cannot rely on obscurity or manual attack difficulty. Instead, embodied systems require principled defenses that account for the possibility of automated, distributed attack generation.
