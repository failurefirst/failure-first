---
title: "State-Dependent Safety Failures in Multi-Turn Language Model Interaction"
description: "Introduces STAR, a state-oriented diagnostic framework showing that multi-turn safety failures arise from structured contextual state evolution rather than isolated prompt vulnerabilities, with mechanistic evidence of monotonic drift away from refusal representations and abrupt phase transitions."
date: 2025-12-12
arxiv: "2603.15684"
authors: "Pengcheng Li, Jie Zhang, Tianwei Zhang, Han Qiu, Zhang Kejun, Weiming Zhang, Nenghai Yu, Wenbo Zhou"
paperType: "methods"
tags: ["multi-turn-attacks", "safety-alignment", "state-transitions", "conversational-safety", "phase-transitions", "mechanistic-interpretability", "refusal-drift"]
draft: false
---

# State-Dependent Safety Failures in Multi-Turn Language Model Interaction

**Focus:** Li et al. reframe multi-turn safety failures as a state-space problem rather
than a prompt engineering problem. Their STAR framework treats dialogue history as a state
transition operator, enabling controlled analysis of how aligned models traverse the safety
boundary under autoregressive conditioning. The key finding: models that appear robust
under static single-turn evaluation undergo rapid and reproducible safety collapse under
structured multi-turn interaction, driven by monotonic drift away from refusal-related
representations and abrupt phase transitions induced by role-conditioned context.

---

## Key Insights

- **Safety is a dynamic, state-dependent property.** Static evaluation of isolated queries
  systematically overestimates model safety. The state-space perspective reveals that
  safety alignment degrades as a function of conversational trajectory, not just prompt
  content.

- **Monotonic drift toward compliance.** Mechanistic analysis shows that internal
  representations drift steadily away from refusal-related features across turns. This is
  not random fluctuation but a structured, predictable process that attackers can exploit.

- **Abrupt phase transitions exist.** Role-conditioned context can induce sudden shifts
  from refusal to compliance, analogous to phase transitions in physical systems. This
  means safety does not degrade gracefully — it can collapse abruptly at a critical point
  in the conversation.

- **Diagnostic framework, not attack optimization.** STAR is designed to probe and
  understand safety boundaries rather than maximize attack success, providing a principled
  tool for safety evaluation rather than just another jailbreak technique.

## Failure-First Relevance

This paper provides mechanistic evidence for patterns we have observed empirically in our
multi-turn benchmarking: models that pass single-turn safety evaluations fail under
sustained conversational pressure. The state-transition framing aligns with our episode-
based evaluation approach, where 5-10 scene sequences test stateful degradation. The
finding of monotonic drift and phase transitions offers a theoretical foundation for why
multi-turn attacks like crescendo patterns and Foot-In-The-Door techniques work — they are
exploiting a structural property of autoregressive conditioning, not just finding clever
prompt wordings. The diagnostic (rather than attack-optimizing) orientation makes STAR a
potential complement to our FLIP grading methodology.

## Open Questions

- Can the monotonic drift be detected at inference time to implement dynamic safety
  monitoring that triggers re-evaluation or conversation reset before phase transitions
  occur?

- Do different model families exhibit different state-space trajectories, or is the drift
  pattern universal across architectures and training approaches?

- How does the state-transition analysis extend to embodied agents where conversational
  context includes physical state observations and action history?

---

*Read the [full paper on arXiv](https://arxiv.org/abs/2603.15684) · [PDF](https://arxiv.org/pdf/2603.15684.pdf)*
