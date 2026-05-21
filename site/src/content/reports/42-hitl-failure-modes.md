---
title: "Human-in-the-Loop Failure Modes in Embodied AI Oversight"
description: "> **Disclaimer:** Empirical figures cited from Failure-First research reflect testing on specific model families under research conditions. Attack success rates are indicative estimates with methodological caveats descri..."
date: "2026-03-01"
reportNumber: 42
classification: "Research — Empirical Study"
status: "draft"
tags: []
draft: false
---

---

> **Disclaimer:** Empirical figures cited from Failure-First research reflect testing on specific model families under research conditions. Attack success rates are indicative estimates with methodological caveats described in Appendix A. External research findings are attributed and assessed on their own methodological terms. This brief does not constitute safety certification guidance.

---

## Executive Summary

Human-in-the-loop (HITL) oversight is widely deployed as the final control layer in embodied AI systems — the assumption being that a human reviewer will catch unsafe agent outputs before they produce physical consequences. Research using the AgentLAB benchmark (arXiv:2602.16901, February 2026) found that human reviewers approved approximately 78% of AI-generated plans that had been subtly subverted through instruction hierarchy attacks. That figure is context-dependent and should not be generalised uncritically across deployment settings; nonetheless, it indicates that HITL oversight, as currently implemented, is vulnerable to systematic adversarial manipulation and may not function as a reliable final control.

This brief examines four cognitive and structural mechanisms through which HITL oversight can fail under adversarial conditions: automation bias (systematic over-trust in AI outputs), alert fatigue (desensitisation from high-volume low-signal approval workflows), decision speed pressure (time constraints that reduce detection of embedded deviations), and plausible-deniability formatting (presentation techniques that obscure harmful intent within structurally valid plans). Each mechanism is observable in Failure-First episode-level evaluation data and consistent with established cognitive science literature on human-automation interaction.

The policy implication is not that human oversight should be removed, but that HITL effectiveness should be treated as an empirically testable parameter of the control hierarchy, not a default assumption. Deployment architectures that depend on HITL as a final control should be required to demonstrate — through adversarial testing — that the oversight mechanism functions under realistic conditions including adversarial inputs.

---

## 1. Introduction

### 1.1 Context and Motivation

As embodied AI systems take on physical consequence roles — operating autonomous vehicles, directing robotic manipulators, executing logistics plans in shared human spaces — human oversight has become a standard architectural response to the limits of fully autonomous operation. The reasoning is straightforward: if the AI makes an error, a human can catch it before physical harm occurs.

This reasoning is sound under conventional assumptions about AI failure modes. If an AI system fails through random error, sensor malfunction, or out-of-distribution inputs, a human reviewer who understands the task domain will generally detect the failure. The failure produces an output that is visibly wrong.

Adversarial failure modes break this assumption. An adversarially subverted plan is designed to be structurally indistinguishable from a valid plan. The deviation is embedded within plausible content, formatted to match expected output patterns, and calibrated to avoid surface-level indicators of failure. The human reviewer is not detecting a random error; they are detecting a deliberately concealed subversion. The difficulty of this detection task differs categorically from the difficulty of detecting random errors.

Failure-First episode-level evaluation data — 5-10 scene sequences testing stateful degradation and recovery — suggests that adversarial subversions introduced early in an interaction sequence tend to survive subsequent human review steps at rates that would not be expected if reviewers were detecting adversarial content reliably. This is consistent with the AgentLAB finding and with established research on automation bias in human-automation systems.

### 1.2 Scope

This brief addresses HITL failure modes in embodied AI contexts where human review occurs prior to physical action execution. It covers four primary failure mechanisms, draws on Failure-First episode evaluation data and external research literature, and makes recommendations oriented toward embodied AI deployment practice and policy.

This brief does not address HITL failure modes in purely language-model contexts, or failure modes arising from AI system errors that are not adversarially induced. The specific numerical findings cited are from external research (AgentLAB) or Failure-First research-grade evaluation and carry the methodological caveats described in Appendix A.

---

## 2. Failure Mechanisms

### 2.1 Automation Bias

Automation bias refers to the tendency for human operators to over-rely on automated outputs, accepting or implementing automated recommendations without adequate critical evaluation. The phenomenon is well-documented in aviation, medical decision support, and process control literature; its extension to AI agent oversight is a straightforward application of the same cognitive dynamics.

In the embodied AI oversight context, automation bias manifests as a disposition to approve AI-generated plans that are coherent and plausible, without systematic scrutiny of whether each step is appropriate. When the AI system has a strong performance record, this bias intensifies: the reviewer's prior experience of accurate AI output creates an expectation that the current output is also accurate, reducing the cognitive scrutiny applied.

Failure-First episode-level evaluation data shows that adversarial subversions introduced in early scenes of a multi-scene sequence — where the AI's initial outputs are correct and establish a performance baseline — are more likely to survive subsequent review steps than subversions introduced without an established track record context. This pattern is consistent with automation bias dynamics: the established baseline of correct performance generates reviewer confidence that persists into the adversarially subverted scene.

The policy implication is that human oversight effectiveness is not constant across deployment lifetime. Reviewers operating in high-reliability AI environments may develop higher automation bias than reviewers in lower-reliability environments, potentially making the former more vulnerable to adversarial subversion despite — or because of — better average AI performance.

### 2.2 Alert Fatigue

Alert fatigue arises when high-volume notification or approval workflows generate reviewer desensitisation, reducing the attention applied to individual items. The mechanism is familiar from clinical alarm fatigue in hospital settings, where high alarm rates produce alarm silencing or reduced alarm response rates.

In AI oversight workflows, alert fatigue operates when human reviewers are asked to approve high volumes of agent-generated plans or actions within compressed timeframes. The cognitive demand of sustained critical evaluation at high throughput is not sustainable; reviewers adapt by developing pattern-matching heuristics that allow rapid approval of visually familiar output structures without item-by-item evaluation.

Adversarial subversion techniques specifically exploit this dynamic. A format-lock attack — presenting a plan in JSON or YAML structure that the reviewer expects to see — exploits the heuristic that structurally familiar output is correct output. The reviewer pattern-matches the format, not the content. Failure-First testing of format-lock attacks in plan generation tasks found that structurally formatted adversarial outputs elicited higher compliance rates than equivalent natural language outputs presenting the same subverted content, consistent with format exploiting reviewer pattern-matching rather than content evaluation.

Alert fatigue is not a reviewer character failing; it is a predictable consequence of oversight workflow design. Deployment architectures that require human approval at high throughput without adjusting the cognitive load of individual approval tasks will predictably generate alert fatigue dynamics. This is a system design issue, not a personnel selection or training issue.

### 2.3 Decision Speed Pressure

Decision speed pressure refers to the effect of time constraints on the depth of cognitive processing applied to individual decisions. Under time pressure, human decision-makers shift from analytical (System 2) processing toward heuristic (System 1) processing. The shift is rational under the constraint — it maximises throughput — but it reduces detection of embedded anomalies that require analytical evaluation to identify.

In embodied AI contexts, decision speed pressure arises from operational tempo requirements: a warehouse robotics system waiting for human approval of each action plan cannot operate at economically viable throughput if approval takes minutes per plan. Realistic approval windows are seconds to tens of seconds for routine operations. Within that window, the reviewer's capacity to evaluate plan correctness is limited by what can be processed analytically under time pressure.

Adversarial plans calibrated to pass superficial review exploit this directly. A plan that is structurally correct, operationally plausible, and formatted to minimise time-to-comprehension — but that contains an embedded deviation in a non-prominent element — is likely to pass a 15-second approval review even if it would not pass a 5-minute analytical review.

This suggests that deployment architectures relying on human approval under operational tempo constraints should not assume that approval under those constraints constitutes adequate adversarial detection. The effective detection capability of a human reviewer operating under 15-second approval windows is qualitatively different from the same reviewer operating without time constraint.

### 2.4 Plausible-Deniability Formatting

Plausible-deniability formatting describes a family of presentation techniques in which adversarially subverted content is embedded within structurally valid, operationally plausible plan representations. The technique exploits the mismatch between structural validation (is this output in the expected format?) and semantic validation (does this output mean what I think it means?).

Examples observed in Failure-First episode evaluation include:

- **Parameter substitution**: a physically harmful action is presented with operationally standard parameters except for one value that is outside safe range but within the expected order of magnitude, exploiting the reviewer's tendency to validate parameter type rather than parameter value
- **Instruction embedding**: a subverted instruction is embedded in a step that describes a legitimate action, using subordinate clause structure that reduces the prominence of the deviation
- **Conditional framing**: a harmful action is conditioned on an event that the reviewer expects will not occur, so that the plan appears safe at review time but executes the harmful action under conditions that arise post-deployment
- **Abbreviation and reference**: a harmful action is expressed through abbreviation or reference to a prior document, relying on the reviewer's assumption that the referenced content is benign

Each of these techniques exploits the gap between format recognition and semantic evaluation. A reviewer who validates that a plan is in the expected format, that the action types are recognisable, and that the overall sequence is plausible may not detect embedded deviations in parameter values, conditional logic, or referenced content.

---

## 3. Episode-Level Evidence

### 3.1 Multi-Scene Degradation Sequences

Failure-First episode evaluation uses 5-10 scene sequences to test stateful degradation and recovery in AI agent behaviour. Each scene represents an interaction state; scenes are designed to test how early-scene context — including adversarially established context — persists and degrades safety behaviour in later scenes.

In multi-scene sequences where HITL approval steps are included between scenes, our evaluation data indicates that adversarial subversions introduced in scenes 1-2 of a sequence tend to persist through subsequent human approval steps in scenes 3-5 at rates that suggest the approval steps are not systematically detecting the earlier-introduced subversion. This is an observational finding from research-grade evaluation; sample sizes are insufficient to make precise statistical claims, and the direction of the finding is more robustly supported than the specific rate.

The mechanism appears consistent with automation bias and plausible-deniability formatting dynamics: the early-scene context establishes a plausible narrative for later actions, and the formatting of later scenes is calibrated to be consistent with that narrative. Human reviewers approving later scenes have access to the prior context, which they appear to use as a reference frame that makes the subverted later actions appear consistent rather than anomalous.

### 3.2 HITL Latency and Detection Rate

Failure-First episode evaluation has tested HITL approval steps under two conditions: unconstrained review (no time limit on the human reviewer) and constrained review (reviewer instructed to approve or reject within a defined window). Detection rates for adversarially subverted plans were observationally lower under constrained review than unconstrained review, consistent with the decision speed pressure mechanism described in Section 2.3.

These findings are from a small number of human evaluation sessions in research conditions and should not be treated as population-level data. They are directionally consistent with broader human-automation interaction research and with the AgentLAB benchmark finding (arXiv:2602.16901) that approximately 78% of subtly subverted plans were approved by human reviewers in that study's experimental conditions.

---

## 4. Policy Recommendations

### 4.1 Treat HITL Effectiveness as an Empirically Testable Parameter

**Recommendation:** AI deployment standards for embodied systems should require empirical testing of HITL oversight effectiveness under adversarial conditions, rather than accepting human-in-the-loop architecture as a presumptively adequate final control.

**Rationale:** Human oversight effectiveness is not a binary property. It varies with operational tempo, reviewer workload, AI performance track record, and plan presentation format. Adversarial subversion techniques specifically exploit the conditions under which HITL oversight is weakest. A deployment architecture that has not tested its HITL component under adversarial conditions has not validated its final control.

**Implementation:** Pre-deployment testing requirements for embodied AI systems operating in high-consequence environments should include adversarial HITL evaluation: presenting adversarially subverted plans to human reviewers under realistic operational conditions and measuring detection rates. The AgentLAB benchmark provides a reference methodology; sector-specific adaptations would be required for mining, logistics, and other high-risk contexts.

### 4.2 Design Against Alert Fatigue at the System Level

**Recommendation:** Deployment architectures requiring human approval of AI-generated plans should be designed to limit approval throughput requirements to levels consistent with sustained analytical review, rather than heuristic pattern-matching.

**Rationale:** Alert fatigue is a predictable system-level outcome of high-throughput approval workflows, not a reviewer performance failure. Deployment architectures that require approval at rates exceeding the capacity for analytical review are effectively requiring approval without review. System design should account for cognitive load constraints on sustained analytical evaluation.

**Implementation:** Throughput constraints should be established through workload modelling that distinguishes routine approvals (where heuristic review may be adequate) from high-stakes or novel plans (which should be flagged for analytical review). AI systems should flag uncertainty and novelty for elevated review attention rather than presenting all outputs with equivalent confidence signals.

### 4.3 Require Semantic Validation Infrastructure for High-Consequence Approvals

**Recommendation:** For embodied AI deployments where approved plans produce irreversible physical consequences, approval interfaces should be designed to support semantic validation rather than relying solely on format recognition.

**Rationale:** Plausible-deniability formatting exploits the gap between format validation and semantic evaluation. Approval interfaces that present plans as text blocks or structured data without semantic highlighting create conditions where format recognition substitutes for content evaluation. Interface design can reduce this gap by surfacing specific parameters, flagging deviations from prior approved plans, and requiring explicit confirmation of specific elements rather than global approval.

**Implementation:** Approval interface design standards for high-consequence embodied AI should require parameter-level display of key values, deviation flagging relative to previous approved plans, and explicit confirmation of irreversible action elements. Interface design should be evaluated through usability testing with adversarial plan stimuli, not only with normal operation stimuli.

### 4.4 Extend Model WHS Laws Guidance to Address HITL Control Validation

**Recommendation:** Safe Work Australia and comparable workplace safety regulators should clarify that for AI systems where human oversight constitutes a nominated control measure, the effectiveness of that control must be validated — including under adversarial conditions — rather than assumed.

**Rationale:** The hierarchy of controls framework in WHS legislation requires that nominated controls are effective. For conventional controls, effectiveness is validated through engineering standards and inspection. For HITL as a control measure for adversarial AI failure modes, no equivalent validation requirement currently exists. The AgentLAB finding (arXiv:2602.16901) indicates that unevaluated HITL controls may have substantially lower effectiveness than assumed.

**Implementation:** WHS guidance on AI systems in high-risk workplaces should specify that HITL oversight, where nominated as a control measure for adversarial AI failure modes, requires documented effectiveness testing. Testing methodology should be developed in coordination with AU AISI and relevant technical experts.

---

## 5. Conclusion

Human-in-the-loop oversight is a necessary but not sufficient condition for safe embodied AI deployment in adversarial environments. The four mechanisms examined in this brief — automation bias, alert fatigue, decision speed pressure, and plausible-deniability formatting — represent predictable and exploitable weaknesses in human oversight as currently implemented. They are not random variation; adversarial attack techniques are specifically calibrated to exploit them.

The research evidence available, including the AgentLAB benchmark finding and directional indicators from Failure-First episode evaluation, suggests that HITL approval rates for subtly subverted AI plans may be substantially higher than deployment architects assume. These figures carry methodological caveats and should be interpreted cautiously, but the direction of the finding is consistent across multiple research programs and cognitive science foundations.

The appropriate policy response is not to remove human oversight from embodied AI deployment architectures, but to require that the effectiveness of human oversight be empirically demonstrated rather than assumed. This is the same standard applied to engineering controls in conventional plant safety: controls must be validated, not presumed. HITL oversight of adversarially capable AI systems should meet the same standard.

---

## Appendix A: Methodology

### Failure-First Episode Evaluation

Failure-First episode evaluation uses 5-10 scene sequences testing stateful AI agent behaviour. Sequences are drawn from the `data/episodes/` dataset, validated against `schemas/episodes/episode_schema_v0.1.json`. Human review steps in episode sequences use research participants under controlled conditions, not operational-workforce reviewers. Findings from these evaluations are research-grade; they demonstrate directional patterns but should not be treated as population-level measurements applicable to specific deployment contexts.

HITL detection rate figures from Failure-First evaluation are based on a limited number of evaluation sessions. Sample sizes are insufficient for precise statistical confidence interval computation. Results are reported with appropriate hedging throughout this brief.

### External Research Characterisation

The AgentLAB benchmark finding (approximately 78% approval rate for subtly subverted plans) is drawn from arXiv:2602.16901 (February 2026). The specific rate reflects experimental conditions in that study — specific plan types, specific reviewer populations, specific interface designs — and should not be treated as a universal HITL failure rate. It is cited as an existence proof that HITL approval of adversarially subverted plans occurs at meaningful rates under at least some realistic conditions, not as a precise estimate of the failure rate across all HITL deployments.

---

## Appendix B: Related Work

- AgentLAB: arXiv:2602.16901 (February 2026) — HITL approval rates under adversarial plan conditions
- Crescendo attack methodology: arXiv:2404.01833 (2024) — multi-turn adversarial escalation
- Failure-First Report 39: `research/reports/39_embodied_multi_agent_failure_modes.md` — multi-agent failure mode taxonomy
- Failure-First Report 41: `research/reports/41_safe_work_australia_adversarial_ai_brief.md` — WHS regulatory context for HITL failure modes
- Parasuraman, R. & Riley, V. (1997). *Humans and Automation: Use, Misuse, Disuse, Abuse*. Human Factors, 39(2). — foundational automation bias research
- Wickens, C.D. et al. (2015). *Engineering Psychology and Human Performance* (4th ed.). — alert fatigue and attention allocation under workload

---

**Prepared by:** F41LUR3-F1R57 Research Team
**Contact:** failurefirst.org
**License:** CC BY-SA 4.0
*⟪F41LUR3-F1R57-EMBODIED-AI-RESEARCH⟫*
