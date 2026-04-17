---
title: "LLM Defenses Are Not Robust to Multi-Turn Human Jailbreaks Yet"
description: "Multi-turn human jailbreaks achieve over 70% attack success rate against state-of-the-art LLM defenses that report single-digit rates against automated attacks, exposing a systematic gap in how safety is evaluated."
date: 2026-04-17
arxiv: "2408.15221"
authors: "Nathaniel Li, Ziwen Han, Ian Steneker, Willow Primack, Riley Goodside, Hugh Zhang, Zifan Wang, Cristina Menghini, Summer Yue"
paperType: "empirical"
tags: ["multi-turn-jailbreak", "red-teaming", "defense-evaluation", "safety-alignment", "machine-unlearning"]
draft: false
---

# LLM Defenses Are Not Robust to Multi-Turn Human Jailbreaks Yet

**Focus:** Li et al. expose a critical measurement gap in LLM safety research: the defenses that claim near-perfect protection against automated single-turn attacks collapse against multi-turn jailbreaks conducted by human red-teamers. The paper documents attack success rates exceeding 70% on HarmBench against defenses that report single-digit rates in automated evaluations — not because the defenses improved, but because the benchmarks were too easy.

The contribution is uncomfortable in the best way: the safety community has been measuring the wrong thing.

---

### Key Insights

- **Automated benchmarks create false confidence.** Single-turn automated attacks are the dominant evaluation methodology for LLM defenses, but they represent a fraction of the threat surface. Human attackers use conversation dynamics, gradual escalation, and context manipulation that automated methods cannot replicate.
- **Machine unlearning does not erase knowledge.** One of the paper's most striking findings is that biosecurity knowledge can be recovered from models specifically trained to "unlearn" it. Multi-turn human jailbreaks extract information that targeted unlearning procedures were supposed to eliminate.
- **The threat model mismatch is systemic.** Published defense papers typically test against the same automated attack baselines. This creates a research ecosystem where defenses are optimized against the easiest adversaries rather than the most realistic ones.

### The MHJ Dataset

The paper introduces Multi-Turn Human Jailbreaks (MHJ): 2,912 prompts spanning 537 distinct multi-turn jailbreak conversations, collected from commercial red teaming engagements. Each conversation represents a real human red-teamer working across multiple turns to extract harmful outputs.

The dataset is organized around a compendium of jailbreak tactics compiled from professional red teaming practice. These tactics — multi-turn escalation, persona adoption, hypothetical framing, incremental commitment — are well-known to practitioners but largely absent from automated evaluation frameworks.

Against this dataset, defenses that achieve single-digit attack success rates in automated evaluation routinely exceed 70% ASR. The gap is not marginal — it is an order of magnitude.

### Why Multi-Turn Attacks Succeed

Automated single-turn attacks work by crafting a single prompt that bypasses refusal training. They are constrained to a single exchange and must front-load all manipulation into one input. Defenses can be trained to recognize the statistical signatures of known single-turn attack patterns.

Multi-turn human attacks operate differently:

1. **Context building:** Early turns establish a benign interaction context, priming the model toward helpfulness and cooperative framing before introducing harmful requests.
2. **Incremental escalation:** Requests start innocuous and gradually shift, exploiting the model's tendency to maintain conversational consistency rather than reassessing each turn independently.
3. **Cognitive commitment:** By eliciting partial commitments to premises, attackers make full refusal psychologically costly for the model to execute — a conversational version of the foot-in-the-door technique.
4. **Persona and framing manipulation:** Role-play setups, hypothetical framings, and character adoption bypass refusal patterns that are keyed to direct harmful requests.

These dynamics are invisible to single-turn evaluations and require genuinely adversarial human intelligence to exploit systematically.

### Machine Unlearning: A Case Study in Illusory Safety

The paper's treatment of machine unlearning deserves particular attention. Unlearning approaches aim to selectively remove specific knowledge — for instance, biosecurity information — from a trained model without full retraining. The procedure is evaluated by asking the model direct questions and verifying it no longer responds with the targeted information.

Multi-turn human jailbreaks recover this knowledge reliably. The mechanism appears to be that unlearning suppresses direct recall pathways without actually removing the underlying representations. A skilled human red-teamer can circumvent the suppression by approaching the knowledge indirectly — through related concepts, analogical reasoning, or gradual context construction — in ways that automated probes do not test.

This is a significant finding for any safety approach that claims to eliminate dangerous capabilities through training-time interventions. The claim requires validation against realistic adversaries, not just automated probes.

### Failure-First Connections

This paper maps directly onto embodied AI safety concerns. VLA models deployed on robots operate in multi-turn, multi-interaction environments where a single safety evaluation at deployment time is meaningless. An adversarial user — or adversarial environmental inputs — can probe a robot's action policy across many interactions, building context and exploiting consistency biases exactly as the MHJ attackers do against LLMs.

The evaluation gap the paper identifies is even more acute in robotics: almost no deployed VLA safety evaluations use adversarial human red-teamers. They use automated task success metrics that cannot capture the multi-step manipulation patterns that would actually matter for real-world safety.

The machine unlearning finding also transfers directly: if knowledge suppression fails against multi-turn linguistic attacks on LLMs, intervention-based "safety constraints" bolted onto VLA models face the same circumvention risks against patient adversarial actors.

### Actionable Implications

**For safety evaluators:** Single-turn automated benchmarks are necessary but not sufficient. Any defense claiming robustness must be validated against human red-teamers using multi-turn scenarios. The MHJ dataset provides a starting point.

**For defense researchers:** Design defenses that track conversational state, not just individual inputs. A model that maintains a coherent safety posture across turns — reassessing compliance at each step rather than treating each prompt in isolation — is substantially harder to jailbreak through escalation tactics.

**For embodied AI deployers:** Robot safety evaluations must include adversarial multi-interaction scenarios. A single demonstration of safe behavior in a fixed evaluation environment does not validate safety against a motivated adversary with repeated access.

---

*Read the [full paper on arXiv](https://arxiv.org/abs/2408.15221) · [PDF](https://arxiv.org/pdf/2408.15221.pdf)*
