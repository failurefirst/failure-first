---
title: "When LLM Meets DRL: Advancing Jailbreaking Efficiency via DRL-guided Search"
description: "Proposes RLbreaker, a deep reinforcement learning-driven black-box jailbreaking attack that uses DRL with customized reward functions and PPO to automatically generate effective jailbreaking prompts, demonstrating superior performance over genetic algorithm-based attacks across six SOTA LLMs."
date: 2026-02-08
arxiv: "2406.08705"
authors: "Xuan Chen,Yuzhou Nie,Wenbo Guo,Xiangyu Zhang"
paperType: "empirical"
tags: [llm-jailbreaking-attacks,reinforcement-learning-adversarial,black-box-prompt-optimization,drl-guided-search,safety-alignment-evasion,transferable-adversarial-prompts]
draft: false
audio: "https://cdn.failurefirst.org/audio/daily-paper/2406.08705-audio-overview.m4a"
---

Manual jailbreaking is labor-intensive. Genetic algorithms for automated jailbreaking work but waste compute on random mutations. What if you could train a reinforcement learning agent to intelligently search the jailbreak space, learning which mutation strategies are most likely to succeed? This transforms jailbreaking from trial-and-error to systematic exploitation.

RLbreaker demonstrates this approach: an RL agent learns to select mutations (rephrase,
expand, shorten, etc.) that maximize attack success. By training on accessible models, the learned policies transfer to closed-source systems like GPT-4 and Claude. The efficiency gain is significant—the agent finds working jailbreaks far faster than random search or genetic algorithms. This matters because it shows that jailbreak discovery is not a hard problem requiring deep model knowledge; it's a search optimization problem that RL solves effectively.

The failure-first perspective here is that as attack automation improves, the asymmetry between attack cost and defense cost gets worse. Manual jailbreaking required expertise. Automated jailbreaking with RL requires only compute. This further democratizes attacks and raises the bar for defense. You must assume attackers have access to automated attack tools, not just manual techniques. This shifts the problem from "can humans find this jailbreak" to "what defenses survive systematic, automated attack discovery.

---

## Key Findings

- RL agent learns mutation strategies (rephrase, expand, shorten) that maximize jailbreak success
- Learned policies transfer across models—training on accessible models breaks closed systems
- RL approach finds working jailbreaks far faster than random search or genetic algorithms
- Jailbreak discovery is search optimization, not a deep model knowledge problem

---

## Key Findings

- Semantic attacks (role-playing, hypothetical scenarios) exploit distribution gaps in safety training
- Token-level attacks (adversarial suffixes) target model internals, requiring different defenses
- System-level attacks (supply chain, fine-tuning) operate outside the model, bypassing alignment training
- Most defenses are narrow: solving one attack category while leaving others open

---

## 📊 Infographic

![When LLM Meets DRL: Advancing Jailbreaking Efficiency via DRL-Guided Search Infographic](/images/daily-paper/2406.08705-infographic.png)

---
## 🎬 Video Overview

<video controls style="width: 100%; max-width: 600px;">
  <source src="/video/daily-paper/2406.08705-video-overview.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

---
## 🎙️ Audio Overview

<audio controls style="width: 100%; max-width: 600px;">
  <source src="/audio/daily-paper/2406.08705-audio-overview.m4a" type="audio/mp4">
  Your browser does not support the audio element.
</audio>

---
## Full Paper

Recent studies developed jailbreaking attacks, which construct jailbreaking prompts to fool LLMs into responding to harmful questions. Early-stage jailbreaking attacks require access to model internals or significant human efforts. More advanced attacks utilize genetic algorithms for automatic and black-box attacks. However, the random nature of genetic algorithms significantly limits the effectiveness of these attacks. In this paper, we propose RLbreaker, a black-box jailbreaking attack driven by deep reinforcement learning (DRL). We model jailbreaking as a search problem and design an RL agent to guide the search, which is more effective and has less randomness than stochastic search, such as genetic algorithms. Specifically, we design a customized DRL system for the jailbreaking problem, including a novel reward function and a customized proximal policy optimization (PPO) algorithm. Through extensive experiments, we demonstrate that RLbreaker is much more effective than existing jailbreaking attacks against six state-of-the-art (SOTA) LLMs. We also show that RLbreaker is robust against three SOTA defenses and its trained agents can transfer across different LLMs. We further validate the key design choices of RLbreaker via a comprehensive ablation study.

---

*Read the [full paper on arXiv](https://arxiv.org/abs/2406.08705) · [PDF](https://arxiv.org/pdf/2406.08705.pdf)*

*This post is part of the [Daily Paper](/daily-paper/) series exploring cutting-edge research in AI safety and embodied systems.*
