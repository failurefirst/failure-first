---
title: "PaLM-E: An Embodied Multimodal Language Model for Robotics"
description: "Presents PaLM-E, a large-scale multimodal language model that unifies vision, text, and embodiment, enabling robots to perform complex manipulation tasks through natural language grounding and learned sensorimotor representations."
date: 2025-11-09
arxiv: "2303.03378"
authors: "Danny Driess, Fei Xia, Mehdi SM Sajjadi, Corey Lynch, Ayzaan Wahid, Tingnan Zhang, Adam Szucs, Joseph Ortega, Oscar Ramirez, Yuka Inagaki, Alexander Toshev, Thomas Dreyfus, Sergio Guadarrama, Florian Shkurti, Sergey Levine"
paperType: "empirical"
tags: [embodied-ai, multimodal, language-grounding, robotics, manipulation, sensorimotor, foundation-models]
draft: false
---

PaLM-E combines a language model (PaLM) with embodied sensor data to create a unified multimodal model for robotic control. Unlike RT-2 which treats actions as discrete tokens, PaLM-E integrates continuous sensor streams (joint positions, forces) as continuous tokens within the language model. The robot's body becomes part of the model's vocabulary.

This design enables rich interaction between language understanding and physical control. The model can reason about object properties, spatial relationships, and physical constraints learned from sensor data, then ground abstract language instructions into concrete motor commands. A user can say "gently grasp the delicate object," and PaLM-E combines linguistic understanding of "gently" with learned sensorimotor patterns of force control.

PaLM-E was trained on diverse robotic datasets including real-world manipulation, enabling transfer to new tasks and new robot morphologies. The architecture scales: larger models learned more robust generalizations and could handle more complex, underspecified instructions.

From a safety perspective, PaLM-E raises new questions about embodied multimodal alignment. Language models can be jailbroken through adversarial prompts, but what happens when adversarial inputs are presented through vision or sensor streams? Can an attacker manipulate a robot's understanding of physical safety through false sensor readings? If the model conflates language understanding with sensorimotor reasoning, could linguistic jailbreaks transfer to physical failure modes?

PaLM-E demonstrates that embodied AI is not just visual language grounding—it's the integration of linguistic, visual, and sensorimotor understanding into a unified decision-making system. This integration is more powerful for legitimate tasks, but also more complex to defend. A jailbreak that affects only language understanding might fail to control the robot, but a jailbreak that also corrupts sensorimotor grounding could be devastating.

Understanding multimodal embodied AI safety requires studying failure modes across all integrated modalities, not just language.
