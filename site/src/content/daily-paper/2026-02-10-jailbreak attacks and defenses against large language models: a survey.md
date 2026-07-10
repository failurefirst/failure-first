---
title: "Jailbreak Attacks and Defenses Against Large Language Models: A Survey"
description: "Provides a comprehensive taxonomy of jailbreak attack methods (black-box and white-box) and defense strategies (prompt-level and model-level) for LLMs, with analysis of evaluation methodologies."
date: 2026-02-10
arxiv: "2407.04295"
authors: "Sibo Yi,Yule Liu,Zhen Sun,Tianshuo Cong,Xinlei He,Jiaxing Song,Ke Xu,Qi Li"
paperType: "survey"
tags: [adversarial-prompts,jailbreak-attacks,safety-alignment,prompt-injection,llm-vulnerabilities,defense-mechanisms]
draft: false
audio: "https://cdn.failurefirst.org/audio/daily-paper/2407.04295-audio-overview.m4a"
---

# Jailbreak Attacks and Defenses Against Large Language Models: A Survey

The literature on LLM jailbreaking has exploded, but organizing it into a coherent threat model is difficult. New attack papers appear weekly. Defenses are published faster than anyone can evaluate them. Without a systematic understanding of the attack surface, practitioners are left guessing which threats matter and which are theoretical edge cases.

This survey provides a comprehensive taxonomy of jailbreak attacks and defenses across
multiple dimensions: semantic attacks (role-playing, hypothetical scenarios, constraint relaxation), token-level attacks (adversarial suffixes, prompt injection), and system-level attacks (fine-tuning manipulation, supply chain compromise). For each category, the authors analyze proposed defenses and assess their effectiveness. The conclusion is humbling: most defenses are narrow in scope, often solving one attack category while leaving others untouched. Defenses that worked well a year ago are now circumvented by evolved attack techniques.

The failure-first takeaway is that jailbreaking research confirms a hard truth about adversarial robustness: defenses are always playing catch-up. An attack works until researchers understand it well enough to patch it, then attackers adapt. This suggests that perfect robustness is not achievable. Instead, practitioners should focus on understanding the threat model relevant to their deployment, implement defense-in-depth strategies, and accept that new vulnerabilities will emerge. Security is a continuous process, not a solved problem.

---

## Key Findings

- Semantic attacks (role-playing, hypothetical scenarios) exploit distribution gaps in safety training
- Token-level attacks (adversarial suffixes) target model internals, requiring different defenses
- System-level attacks (supply chain, fine-tuning) operate outside the model, bypassing alignment training
- Most defenses are narrow: solving one attack category while leaving others open

---

## Key Findings

- Removing 5-10% of carefully selected weights dramatically increases jailbreak success rates
- Safety alignment is localized in specific weight subsets, not distributed throughout network
- Pruning and low-rank modifications (production optimization techniques) degrade alignment
- Safety-efficiency tradeoff is real: compression techniques undo alignment training

---

## 📊 Infographic

![Jailbreak Attacks and Defenses Against Large Language Models: A Survey Infographic](/images/daily-paper/2407.04295-infographic.png)

---
## 🎬 Video Overview

<video controls style="width: 100%; max-width: 600px;">
  <source src="/video/daily-paper/2407.04295-video-overview.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

---
## 🎙️ Audio Overview

<audio controls style="width: 100%; max-width: 600px;">
  <source src="/audio/daily-paper/2407.04295-audio-overview.m4a" type="audio/mp4">
  Your browser does not support the audio element.
</audio>

---
## Full Paper

Large Language Models (LLMs) have performed exceptionally in various text-generative tasks, including question answering, translation, code completion, etc. However, the over-assistance of LLMs has raised the challenge of "jailbreaking", which induces the model to generate malicious responses against the usage policy and society by designing adversarial prompts. With the emergence of jailbreak attack methods exploiting different vulnerabilities in LLMs, the corresponding safety alignment measures are also evolving. In this paper, we propose a comprehensive and detailed taxonomy of jailbreak attack and defense methods. For instance, the attack methods are divided into black-box and white-box attacks based on the transparency of the target model. Meanwhile, we classify defense methods into prompt-level and model-level defenses. Additionally, we further subdivide these attack and defense methods into distinct sub-classes and present a coherent diagram illustrating their relationships. We also conduct an investigation into the current evaluation methods and compare them from different perspectives. Our findings aim to inspire future research and practical implementations in safeguarding LLMs against adversarial attacks. Above all, although jailbreak remains a significant concern within the community, we believe that our work enhances the understanding of this domain and provides a foundation for developing more secure LLMs.

---

*Read the [full paper on arXiv](https://arxiv.org/abs/2407.04295) · [PDF](https://arxiv.org/pdf/2407.04295.pdf)*

*This post is part of the [Daily Paper](../index.md) series exploring cutting-edge research in AI safety and embodied systems.*
