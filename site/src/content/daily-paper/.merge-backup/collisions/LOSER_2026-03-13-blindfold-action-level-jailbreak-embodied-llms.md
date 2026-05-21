---
arxiv_id: "2603.01414"
title: "Blindfold: Jailbreaking Embodied LLMs via Action-level Manipulation"
date: 2026-03-13
authors: ["Xinyu Huang", "Qiang Yang", "Leming Shen", "Zijing Ma", "Yuanqing Zheng"]
institutions: ["Hong Kong Polytechnic University", "University of Cambridge"]
tags: ["embodied-ai", "jailbreak", "VLA", "action-level-attacks", "physical-safety"]
relevance: "Directly validates our IDDL finding — attacks that appear semantically safe but cause physical harm are the hardest to detect"
significance: high
---

## Summary

Blindfold introduces an automated attack framework for embodied LLMs that operates at the action level rather than the language level. Instead of trying to make the model say harmful things, it makes the model do harmful things — through instructions that appear semantically benign but result in dangerous physical consequences.

## Key Findings

- **Action-level manipulation**: Adversarial Proxy Planning compromises a local surrogate LLM to generate action sequences that look safe but have harmful physical effects
- **53% higher ASR** than state-of-the-art baselines on both simulators and a real 6DoF robotic arm
- **Noise injection** conceals malicious actions from defense mechanisms
- **Rule-based verifier** improves attack executability (the attack must actually work physically)

## Relevance to Failure-First

This paper provides independent validation of several F41LUR3-F1R57 findings:
- **IDDL**: Confirms that the most dangerous embodied attacks are semantically undetectable
- **CDC**: The useful capability (following complex action instructions) IS the vulnerability
- **Text-action gap**: Language-level safety filters don't prevent action-level harm
- Our CCS paper already cites this work (reference: Blindfold)
