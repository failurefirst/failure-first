---

title: "Towards Robust and Secure Embodied AI: A Survey on Vulnerabilities and Attacks"
description: "A systematic survey categorizing embodied AI vulnerabilities into exogenous (physical attacks, cybersecurity threats) and endogenous (sensor failures, software flaws) sources, examining how adversarial attacks target perception, decision-making, and interaction in robotic and autonomous systems."
date: 2025-12-07
arxiv: "2502.13175"
authors: "Wenpeng Xing, Minghao Li, Mohan Li, Meng Han"
paperType: "survey"
tags: ["embodied-ai", "vulnerability-taxonomy", "adversarial-attacks", "robotics-security", "autonomous-vehicles", "perception-attacks", "survey"]
draft: false
audio: "https://cdn.failurefirst.org/audio/daily-paper/2025-12-07-robust-secure-embodied-ai-survey.m4a"
---

# Towards Robust and Secure Embodied AI: A Survey on Vulnerabilities and Attacks

**Focus:** Xing et al. provide a systematic survey of vulnerabilities and attacks against
embodied AI systems including robots and autonomous vehicles. The work introduces a
two-axis taxonomy: exogenous sources (physical adversarial attacks, cybersecurity threats)
versus endogenous factors (sensor failures, software flaws), cross-cut with the stage of
the agent pipeline affected (perception, decision-making, embodied interaction). The survey
also covers how jailbreaks and misinterpretation attacks target the large language models
and vision-language models that increasingly serve as embodied agent brains.

---

## Key Insights

- **Exogenous vs. endogenous distinction is critical for defense design.** Physical
  adversarial patches and network intrusions require fundamentally different mitigations
  than sensor drift and software bugs. Conflating these leads to incomplete threat models.

- **LLM/VLM jailbreaks are now an embodied AI attack vector.** As embodied systems
  increasingly use foundation models for planning and decision-making, traditional
  jailbreak attacks gain physical consequences. The survey bridges the gap between
  NLP-focused safety research and robotics security.

- **Perception-to-action pipeline has compounding vulnerabilities.** Attacks at the
  perception stage propagate through decision-making and execution, potentially amplifying
  rather than attenuating. The survey documents how small perturbations in perception can
  produce large deviations in physical action.

- **Defensive strategies remain fragmented.** The proposed defensive framework integrates
  multiple dimensions, but the survey reveals that most existing defenses address single
  attack types in isolation rather than the compound threats embodied systems face.

## Failure-First Relevance

This survey maps directly onto the failure-first framework's core thesis: embodied AI
systems have uniquely dangerous failure modes because errors in digital reasoning produce
physical consequences. The exogenous/endogenous taxonomy complements our scenario
classification system, and the pipeline-stage analysis mirrors our multi-stage evaluation
approach. The survey's coverage of LLM jailbreaks as embodied attack vectors validates our
research direction of studying jailbreak techniques specifically in the context of
embodied agents rather than treating them as purely linguistic phenomena.

## Open Questions

- How do exogenous and endogenous vulnerabilities interact in practice — does a sensor
  degradation make a system more susceptible to adversarial perturbations, creating
  compound failure modes?

- What is the minimum viable threat model for an embodied AI deployment — which attack
  categories can be safely deprioritized for a given deployment context?

- As foundation models become the standard "brain" for embodied systems, will the
  jailbreak-to-physical-action pathway become the dominant attack surface, eclipsing
  traditional perception attacks?

---

*Read the [full paper on arXiv](https://arxiv.org/abs/2502.13175) · [PDF](https://arxiv.org/pdf/2502.13175.pdf)*
