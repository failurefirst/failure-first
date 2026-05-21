---
title: "AI Safety Daily — April 25, 2026"
description: "SafetyALFRED shows embodied agents recognise hazards better than they act on them; HomeGuard introduces context-guided spatial constraints for household VLMs; and the pattern of static recognition versus corrective action emerges as the dominant gap in embodied safety evaluation."
date: 2026-04-25
tags: ["ai-safety-daily", "embodied-ai", "vla", "benchmark", "household-robotics"]
draft: false
image: "https://cdn.failurefirst.org/images/blog/ai-safety-daily-2026-04-25.png"
---

## AI Safety Research Digest — April 25, 2026

> *Recognising a hazard is not the same as acting safely around one. Two new benchmarks make this distinction measurable.*

### Key Findings

- **Embodied agents can identify hazards but struggle to act on that identification.** SafetyALFRED (Torres-Fonseca et al., Apr 21) extends the ALFRED household planning benchmark with safety-annotated tasks requiring corrective action rather than static recognition — pausing, rerouting, or flagging before executing a potentially hazardous step. Current multimodal LLMs score well on hazard-identification probes but revert to task-completion pressure when corrective action is required, defaulting to the task objective rather than the safety constraint. The study concludes the field has optimised hazard awareness as a classification problem and underinvested in planning-level corrective response. [Link](https://hf.co/papers/2604.19638)

- **HomeGuard addresses the same gap from the control side.** HomeGuard (Lu et al., Mar 2026) routes household VLM agent outputs through a context-guided chain-of-thought that generates spatial constraints — explicit collision-avoidance bounds and navigation waypoints — before executing actions. Reinforcement Fine-Tuning with process rewards for visual evidence gathering replaces post-hoc filtering. Performance on collision avoidance and task completion metrics improves compared to baseline VLMs. The architectural choice — generating constraints as an intermediate output before action, not after — is consistent with the direction the control-barrier-function literature has been taking. [Link](https://hf.co/papers/2603.14367)

- **The recognition-versus-corrective-action split is a methodological failure as much as a capability finding.** SafetyALFRED's central point: if a benchmark only asks whether an agent can identify a hazard (classification), it will overestimate safety for deployment contexts where the relevant question is whether the agent changes behaviour in response. The SafeAgentBench 10% rejection ceiling documented earlier this week is a related signal from a different benchmark — the same structural gap appearing under different evaluation conditions.

- **Frontier AI Risk Management v1.5 contextualises embodied safety within a broader taxonomy.** Liu et al.'s risk analysis framework (Feb 2026) identifies embodied AI safety as one of five critical risk dimensions alongside cyber offense, strategic deception, persuasion/manipulation, and self-replication. The taxonomy is useful for grounding embodied-specific benchmarks within the wider threat landscape and for prioritising which failure modes warrant the most evaluation investment. [Link](https://hf.co/papers/2602.14457)

### Methodological Implication

The recognition-action distinction SafetyALFRED surfaces is a concrete argument for **corrective-action benchmarks** as a distinct evaluation class. A model that describes a hazard correctly in a QA setting may still select the hazardous action in a planning loop — the two measurements are not proxies for the same capability. Evaluation designs that require the agent to produce a modified trajectory, not a correct label, are measuring something that static QA cannot.

### Implications for Embodied AI

HomeGuard's constraint-generation approach and SafetyALFRED's corrective-action framing reinforce the same architectural direction: safety interventions need to operate at the planning and trajectory level, not just at the output classification layer. This is consistent with the control-barrier-function findings from the SafeLIBERO line of work. The recognition-to-corrective-action gap is now measurable — which is the precondition for making it addressable.

---

*Research sourced via Hugging Face/arXiv paper discovery. NLM-augmented assets (audio/infographic/video) added by local pipeline when available.*
