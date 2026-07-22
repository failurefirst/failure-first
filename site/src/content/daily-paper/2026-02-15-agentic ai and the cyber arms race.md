---
title: "Agentic AI and the Cyber Arms Race"
description: "Examines how agentic AI is reshaping cybersecurity by enabling both attackers and defenders to automate tasks and augment human capabilities, with implications for cyber warfare and geopolitical power distribution."
date: 2026-02-15
arxiv: "2503.04760"
authors: "Sean Oesch,Jack Hutchins,Phillipe Austria,Amul Chaulagain"
paperType: "survey"
tags: [agentic-ai-security,cyber-arms-race,ai-automation-attacks,ai-defense-augmentation,capability-proliferation,cyber-warfare]
draft: false
audio: "https://cdn.failurefirst.org/audio/daily-paper/2503.04760-audio-overview.m4a"
---

# Agentic AI and the Cyber Arms Race

As AI systems gain the ability to take actions in the world—writing code, running commands, accessing external APIs—the attack surface expands dramatically. An agentic AI system that can execute code is not just a text generator; it's a potential entry point into your infrastructure. This transforms AI safety from a content moderation problem into a systems security problem.

The paper maps out how agentic AI capabilities interact with cybersecurity concerns. An
AI assistant that can write and run code is powerful for productivity but dangerous if compromised or misaligned. It could be tricked into writing malicious code, accessing unauthorized systems, or exfiltrating data. Worse, the traditional AI safety mitigations (alignment training, refusal training) may not apply well to agentic tasks because many legitimate use cases require the ability to execute potentially dangerous operations. How do you safely enable "run this shell command" while preventing abuse?

This represents a shift in the threat model. Older AI safety discussions treated the model as a text oracle—dangerous primarily in what it says. Agentic systems are dangerous in what they do. This means security evaluation needs to shift from "can the model be tricked into saying harmful things" to "can the model be tricked into executing harmful actions." For builders deploying agentic systems, this means infrastructure hardening, sandboxing, and capability limitation become as important as alignment training.

---

## Key Findings

- Agentic AI systems shift threat model from content moderation to systems security
- Traditional alignment training doesn't apply well when legitimate use cases require 'dangerous' operations
- Code execution capability becomes an attack vector into user infrastructure
- Defense strategy must balance capability with sandboxing and privilege separation

---

## Key Findings

- Backward inference reward models match or exceed traditional preference-based models at 1/10 the cost
- Approach reframes reward modeling as inverse problem solvable by LLMs
- Works well for detecting instruction-following failures and measuring alignment
- Requires smaller models and less compute than traditional RLHF reward modeling

---

## 🎬 Video Overview

<video controls style="width: 100%; max-width: 600px;">
  <source src="/video/daily-paper/2503.04760-video-overview.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

---
## 🎙️ Audio Overview

<audio controls style="width: 100%; max-width: 600px;">
  <source src="/audio/daily-paper/2503.04760-audio-overview.m4a" type="audio/mp4">
  Your browser does not support the audio element.
</audio>

---
## Full Paper

Agentic AI is shifting the cybersecurity landscape as attackers and defenders leverage AI agents to augment humans and automate common tasks. In this article, we examine the implications for cyber warfare and global politics as Agentic AI becomes more powerful and enables the broad proliferation of capabilities only available to the most well resourced actors today.

---

*Read the [full paper on arXiv](https://arxiv.org/abs/2503.04760) · [PDF](https://arxiv.org/pdf/2503.04760.pdf)*

*This post is part of the [Daily Paper](../index.md) series exploring cutting-edge research in AI safety and embodied systems.*
