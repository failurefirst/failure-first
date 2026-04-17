---

title: "Paper Summary Attack: Jailbreaking LLMs through LLM Safety Papers"
description: "Introduces a novel jailbreak technique that synthesizes content from LLM safety research papers to craft adversarial prompts, achieving 97-98% attack success rates against Claude 3.5 Sonnet and DeepSeek-R1 by exploiting models' trust in academic authority."
date: 2025-12-10
arxiv: "2507.13474"
authors: "Liang Lin, Zhihao Xu, Xuehai Tang, Shi Liu, Biyu Zhou, Fuqing Zhu, Jizhong Han, Songlin Hu"
paperType: "empirical"
tags: ["jailbreaks", "authority-exploitation", "academic-trust", "adversarial-prompts", "claude", "deepseek", "social-engineering"]
draft: false
audio: "https://cdn.failurefirst.org/audio/daily-paper/2025-12-10-paper-summary-attack.m4a"
---

# Paper Summary Attack: Jailbreaking LLMs through LLM Safety Papers

**Focus:** Lin et al. demonstrate that LLMs exhibit a trust bias toward academic paper
content that can be weaponized for jailbreaking. The Paper Summary Attack (PSA) synthesizes
content from LLM safety literature and embeds harmful requests within structured paper
sections. The technique achieved 97% ASR against Claude 3.5 Sonnet and 98% against
DeepSeek-R1. An additional finding reveals that different models show opposing vulnerability
biases depending on whether attack-focused or defense-focused papers are used as the
authority source.

---

## Key Insights

- **Academic authority as attack vector.** Models trained to be helpful with research
  content treat academic paper structure as an implicit trust signal, reducing safety
  scrutiny for content embedded within paper-like formatting. This is a form of authority
  exploitation distinct from persona hijacking.

- **Near-total bypass on frontier models.** The 97-98% ASR against Claude 3.5 Sonnet and
  DeepSeek-R1 demonstrates that even heavily safety-trained models are vulnerable to
  authority-based framing attacks, not just weaker or open-source models.

- **Attack-vs-defense paper asymmetry.** Different models respond differently to content
  framed as attack research versus defense research, suggesting that safety training
  creates model-specific biases in how academic content is processed. This asymmetry
  could inform both attack refinement and defense design.

- **Self-referential vulnerability.** The attack uses safety research itself as the
  weapon, creating a recursive problem: the more safety papers are published, the more
  material is available for constructing PSA-style attacks.

## Failure-First Relevance

This paper exemplifies a pattern central to our research: safety mechanisms creating new
attack surfaces. The research-only-pressure intent label in our taxonomy captures exactly
this class of attack, where academic or research framing is used to suppress safety
constraints. PSA demonstrates that this is not just a theoretical concern but achieves
near-total bypass rates on production models. The self-referential nature of the attack
(using safety papers to defeat safety) connects to our broader thesis about recursive
failure modes in AI safety. The finding about attack-vs-defense paper asymmetry across
model versions suggests that safety training introduces predictable, exploitable biases
rather than robust defenses.

## Open Questions

- Can models be trained to evaluate the semantic content of academic framing independently
  of its structural authority signals, or is trust-in-authority too deeply embedded in
  pre-training data?

- Does the attack-vs-defense asymmetry correlate with specific safety training
  methodologies (RLHF vs. constitutional AI vs. DPO), or is it an artifact of training
  data composition?

- As this attack becomes known, will safety training against it create new trust biases
  toward other authority domains (legal, medical, governmental) that can be similarly
  exploited?

---

*Read the [full paper on arXiv](https://arxiv.org/abs/2507.13474) · [PDF](https://arxiv.org/pdf/2507.13474.pdf)*
