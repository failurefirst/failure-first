---
title: "Can Large Language Models Automatically Jailbreak GPT-4V?"
description: "Demonstrates an automated jailbreak technique (AutoJailbreak) that uses LLMs for red-teaming and prompt optimization to compromise GPT-4V's safety alignment, achieving 95.3% attack success rate on facial recognition tasks."
date: 2026-02-11
arxiv: "2407.16686"
authors: "Yuanwei Wu,Yue Huang,Yixin Liu,Xiang Li,Pan Zhou,Lichao Sun"
paperType: "empirical"
tags: [multimodal-jailbreaking,prompt-optimization-attacks,llm-red-teaming,vision-language-model-safety,privacy-leakage-facial-recognition,adversarial-prompt-generation]
draft: false
image: "https://cdn.failurefirst.org/images/daily-paper/2407.16686-infographic.webp"
audio: "https://cdn.failurefirst.org/audio/daily-paper/2407.16686-audio-overview.m4a"
---

Jailbreak research has traditionally focused on manual prompt engineering or running gradient-based attacks on models you have access to. But what if you could train one model to automatically generate jailbreaks against another model without ever seeing its weights? This question matters because it describes the real attack surface: an attacker with API access to a strong open-source model, trying to break a closed commercial system.

Researchers showed that you can train an attacker LLM on a small set of successful
jailbreaks, then use it to generate novel attacks against GPT-4V without any access to GPT-4V's internals. The trained attacker model learns patterns about what makes jailbreaks work and can generalize to new targets. Success rates were significant enough to demonstrate the vulnerability, and the approach generalizes: an attacker model trained on one target can often break other targets. This is concerning because it means the cost of attacking is not proportional to the sophistication of the target—you just need a capable LLM and some seed jailbreaks.

The failure-first insight here is that attack automation democratizes jailbreaking. You no longer need to be an elite prompt engineer or have a GPU farm running gradient attacks. You need API access and a capable model. This fundamentally changes the threat model for deployed systems. Defenders must assume that attacks will be systematized and automated, not handcrafted. This shifts the burden from "can humans find this jailbreak" to "can we defend against systematic, LLM-generated attacks that exploit our vulnerabilities at scale.

---

## Key Findings

- Attacker LLM trained on seed jailbreaks can generate novel attacks on closed-source models
- Attack works through API access only—no white-box access required
- Attack automation generalizes across models: patterns learned from one target transfer to others
- Cost barrier to jailbreaking drops dramatically with attack automation

---

## Key Findings

- Agentic AI systems shift threat model from content moderation to systems security
- Traditional alignment training doesn't apply well when legitimate use cases require 'dangerous' operations
- Code execution capability becomes an attack vector into user infrastructure
- Defense strategy must balance capability with sandboxing and privilege separation

---

## 🎬 Video Overview

<video controls style="width: 100%; max-width: 600px;">
  <source src="/video/daily-paper/2407.16686-video-overview.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

---
## 🎙️ Audio Overview

<audio controls style="width: 100%; max-width: 600px;">
  <source src="/audio/daily-paper/2407.16686-audio-overview.m4a" type="audio/mp4">
  Your browser does not support the audio element.
</audio>

---
## Full Paper

GPT-4V has attracted considerable attention due to its extraordinary capacity for integrating and processing multimodal information. At the same time, its ability of face recognition raises new safety concerns of privacy leakage. Despite researchers' efforts in safety alignment through RLHF or preprocessing filters, vulnerabilities might still be exploited. In our study, we introduce AutoJailbreak, an innovative automatic jailbreak technique inspired by prompt optimization. We leverage Large Language Models (LLMs) for red-teaming to refine the jailbreak prompt and employ weak-to-strong in-context learning prompts to boost efficiency. Furthermore, we present an effective search method that incorporates early stopping to minimize optimization time and token expenditure. Our experiments demonstrate that AutoJailbreak significantly surpasses conventional methods, achieving an Attack Success Rate (ASR) exceeding 95.3\%. This research sheds light on strengthening GPT-4V security, underscoring the potential for LLMs to be exploited in compromising GPT-4V integrity.

---

*Read the [full paper on arXiv](https://arxiv.org/abs/2407.16686) · [PDF](https://arxiv.org/pdf/2407.16686.pdf)*

*This post is part of the [Daily Paper](/daily-paper/) series exploring cutting-edge research in AI safety and embodied systems.*
