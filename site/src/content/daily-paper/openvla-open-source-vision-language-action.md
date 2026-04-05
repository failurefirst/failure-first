---
title: "OpenVLA: An Open-Source Vision-Language-Action Model for Robotic Manipulation"
description: "Introduces OpenVLA, a 7B parameter open-source vision-language-action model trained on 970M robot demonstrations, achieving competitive performance on robotic manipulation benchmarks and enabling wide accessibility for embodied AI research."
date: 2025-11-07
arxiv: "2406.09246"
authors: "Mayank Sinha, Kunal Prakash, Abhinav Gupta, Lili Chen, Tsung-Yen Yang, Pieter Abbeel, Ion Stoica, Sergey Levine"
paperType: "empirical"
tags: [vision-language-action, robotics, embodied-ai, open-source, manipulation, language-grounding]
draft: false
---

Vision-language-action (VLA) models have emerged as a promising approach for robotic manipulation—networks that consume an image and instruction, output an action. But prior VLAs were either proprietary (RT-2, PaLM-E) or limited in scale. OpenVLA changes this by releasing a fully open-source 7B model trained on 970M real-world robot demonstrations.

The architecture is straightforward: a vision encoder (CLIP-style), a language model base (LLaMA 7B), and action decoders for different robot platforms. Training uses supervised learning from diverse embodied datasets including real-world interactions. The model generalizes across robot morphologies, manipulation tasks, and visual environments.

Critically, OpenVLA achieves performance comparable to much larger proprietary models. A 7B model trained on diverse real data outperforms some larger models with limited training data. This result has significant implications for safety research: it means open-source embodied AI systems can match proprietary capabilities, enabling distributed research and safety audits.

OpenVLA has become the foundation model for embodied AI research, analogous to how LLaMA became the foundation for language model red-teaming. Researchers can now study failure modes in VLA models without proprietary restrictions, benchmark adversarial attacks, and develop defenses.

However, the scale of training data (970M demonstrations) and the diversity of robot platforms create new safety questions. A model trained on this diversity may inherit conflicting values or safety constraints from different sources. VLA safety cannot be addressed through training alone; it requires behavioral auditing, domain-specific testing, and understanding how visual and linguistic inputs interact to produce physical actions.

OpenVLA's open release accelerates embodied AI safety research by making the core technology accessible and reproducible. Understanding the failure modes of open-source VLA models is essential for predicting the behavior of future embodied systems.
