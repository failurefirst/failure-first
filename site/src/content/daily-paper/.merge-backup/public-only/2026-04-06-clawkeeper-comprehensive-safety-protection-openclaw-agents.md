---
title: "ClawKeeper: Comprehensive Safety Protection for OpenClaw Agents Through Skills, Plugins, and Watchers"
description: "A three-layer runtime security framework for autonomous agents that prevents privilege escalation, data leakage, and malicious skill execution through context-injected policies, behavioral monitoring, and a decoupled watcher middleware."
date: 2026-04-06
arxiv: "2603.24414"
authors: "Songyang Liu, Chaozhuo Li, Chenxu Wang, Jinyu Hou, Zejian Chen, Litian Zhang, Zheng Liu, Qiwei Ye, Yiming Hei, Xi Zhang, Zhongyuan Wang"
paperType: "empirical"
tags: [agent-safety, autonomous-agents, privilege-escalation, runtime-security, prompt-injection, threat-detection, agentic-systems]
audio: "https://cdn.failurefirst.org/audio/daily-paper/2603.24414-audio-overview.m4a"
draft: false
---

As autonomous agents gain the ability to execute shell commands, access file systems, and invoke third-party tools, the attack surface for AI-driven systems expands dramatically. ClawKeeper addresses this challenge head-on by proposing a comprehensive, three-layer security framework for OpenClaw — an open-source autonomous agent runtime — that operates in real time without compromising the agent's core functionality. The work arrives at a critical moment: as embodied and agentic AI systems proliferate, runtime safety enforcement is emerging as a necessary complement to alignment-time training.

### The Problem: Agents With Teeth

OpenClaw agents are powerful precisely because they can act: they integrate tools, read and write files, execute code, and invoke external plugins. This capability envelope creates a correspondingly large set of failure modes. The ClawKeeper paper identifies three primary threat categories:

**Sensitive data leakage** occurs when an agent, manipulated through adversarial prompts or misbehaving plugins, exfiltrates private information through its tool-use or output channels. **Privilege escalation** arises when an agent is induced to perform actions beyond its intended authorization scope — for example, writing to restricted directories or invoking administrative APIs it should not access. **Malicious third-party skill execution** exploits the open plugin ecosystem: a carefully crafted external skill can inject instructions into the agent's context, redirecting its behavior in ways the original developer never intended.

These threats are not hypothetical. They are the agentic analogs of well-understood software security vulnerabilities — injection attacks, privilege boundary violations, and supply chain compromise — now manifesting in systems that reason and act in natural language.

### Three Layers of Defense

ClawKeeper's architecture responds to these threats with a layered defense-in-depth approach:

**Skill-based protection** operates at the context level. Security policies are injected directly into the agent's prompt context, establishing environment-specific constraints that govern what the agent may do. Rather than relying on post-hoc output filtering, this layer preemptively shapes the agent's reasoning by making safety boundaries explicit within its decision-making process. This is analogous to constitutional AI approaches but applied to action-space constraints rather than content generation.

**Plugin-based protection** provides runtime enforcement during tool invocation. This layer monitors agent behavior as it unfolds — detecting anomalous patterns in tool calls, flagging requests that deviate from the agent's declared task scope, and enforcing threat-detection rules at the point of execution. Because plugins mediate the interface between the agent's reasoning and the external world, instrumenting them provides high-fidelity visibility into potentially dangerous behavior.

**Watcher-based protection** is the architectural centerpiece. Watchers are decoupled system-level security middleware — separate processes that observe agent activity and can intervene in real time without being embedded in the agent's internal logic. This decoupling is critical: it means that a compromised or manipulated agent cannot disable its own security monitor, since the watcher operates outside the agent's trust boundary. The watcher paradigm draws inspiration from OS-level security mechanisms — audit daemons, mandatory access controls — and applies them to the agentic context.

### Empirical Evaluation

The paper evaluates ClawKeeper across a diverse set of threat scenarios, including both automated attacks and human-crafted adversarial inputs targeting each of the three threat categories. The results demonstrate that the three-layer architecture provides substantially stronger protection than any single layer in isolation, with the watcher-based layer proving especially effective against attacks that succeed in manipulating the agent's context-level policies.

Crucially, the evaluation also measures utility preservation — confirming that ClawKeeper's protections do not meaningfully degrade agent performance on legitimate tasks. This is a necessary property for practical deployment: a security framework that prevents all harmful actions by also preventing most helpful ones is not viable.

### Implications for Embodied AI Safety

The embodied AI safety community has focused extensively on failure modes at the model level — adversarial inputs to perception systems, unsafe action generation in VLAs, misspecified reward functions in RL-trained policies. ClawKeeper points toward a complementary and underexplored layer: runtime enforcement at the agentic infrastructure level.

For embodied systems specifically, the privilege escalation threat is directly analogous to unsafe actuation: an agent that has been induced to exceed its authorized action scope in software terms may, in a physical system, translate that overreach into dangerous physical actions. The skill injection vector maps cleanly onto the problem of adversarial environmental manipulation — an attacker who can craft an object or scene to inject instructions into a vision-language model's context is exploiting the same fundamental vulnerability that ClawKeeper's plugin-protection layer addresses in the software domain.

The Watcher paradigm is particularly promising as a template for embodied safety architecture. A safety monitor that is decoupled from the agent's primary reasoning pipeline — and that can observe, log, and intervene in real time — provides guarantees that training-time alignment cannot: it remains effective even when the model has been manipulated or fine-tuned adversarially, because it operates at the infrastructure level rather than within the model's weights.

### Open Questions

ClawKeeper raises as many questions as it answers. How do skill-injected policies interact with long-horizon planning, where the agent's context evolves significantly across many steps? Can watcher-based interventions be made fast enough for real-time robotic control loops? And critically, how robust are the security policies themselves to adversarial manipulation — can an attacker craft inputs that rewrite the injected constraints? These are the questions that will define the next generation of agentic safety research.

*Read the [full paper on arXiv](https://arxiv.org/abs/2603.24414) · [PDF](https://arxiv.org/pdf/2603.24414.pdf)*
