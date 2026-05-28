---

title: "Foundation Protocol: Building the Safety Infrastructure for a Human–AI Society"
description: "A graph-native coordination layer for agentic systems that treats identity, authority delegation, economic exchange, and audit as protocol primitives — not afterthoughts — as autonomous agents become social infrastructure."
date: 2026-05-31
arxiv: "2605.23218"
authors: "Yongfeng Gu, Jiayi Zhang, Zhaoyang Yu, Sirui Hong, et al."
paperType: "position"
tags: [multi-agent, agentic-society, coordination, governance, protocol-design, accountability]
draft: false
image: "https://cdn.failurefirst.org/images/daily-paper/2026-05-31-foundation-protocol-coordination-layer-agentic-society.png"
---

There is a specific moment when agent safety stops being a model alignment problem and becomes a protocol design problem. That moment is when agents act not just as tools but as participants — browsing, purchasing, deploying software, managing systems, and interacting with one another as persistent entities in a shared environment. Foundation Protocol (FP) argues that this moment is already here, and that the protocol layer governing agent interaction is now a safety boundary, not just an integration convenience.

### The Coordination Gap in Existing Protocols

MCP gives models a common tool interface. A2A defines agent-to-agent task collaboration. A2UI handles controllable interface delegation. Each addresses a specific boundary well. What none of them address is what happens when a single workflow crosses all those boundaries simultaneously — when an agent recruits sub-agents, settles payments, delegates authority, and must leave an auditable evidence trail across the entire chain.

FP's diagnosis is sharp: when every protocol carries its own notion of identity, session state, authority, and trace, integration is not just difficult — provenance breaks at protocol boundaries, and oversight degrades into a patchwork of logs that cannot be coherently audited. The safety consequence is that accountability becomes unverifiable at scale.

### The Four-Plane Architecture

FP structures the coordination layer into four planes:

**Entity & Trust Plane** — unified addressable identity for agents, humans, tools, resources, and institutions. A single entity model that works across agent types.

**Transport & Routing Plane** — discovery, addressing, and connection across heterogeneous transports, without prescribing a specific transport stack.

**Interaction & Organization Plane** — multi-party activities including messaging, event streams, role-typed teams, transactions, and economic settlements as first-class protocol objects. This is where agent teams form, delegate, and transact.

**Regulation & Oversight Plane** — policy enforcement points and provenance hooks that travel with every interaction. Governance is not an add-on; it is embedded in the communication substrate.

The design principle underlying all four planes is that fast execution must not imply fragile accountability. Economic analysis of autonomous agent systems suggests that as execution becomes cheaper, the scarce complement shifts toward verification capacity and liability underwriting. FP builds the verification layer that makes that economy governable.

### Why This Matters for Multi-Agent Safety Research

FP directly addresses the multi-agent safety surface that HarnessAudit (2605.14271) empirically characterises. HarnessAudit shows that most safety violations in multi-agent harnesses concentrate in resource access and inter-agent information transfer. FP's Entity & Trust Plane and Regulation & Oversight Plane are precisely the protocol-level primitives that would allow those violations to be detected, traced, and attributed at runtime rather than post-hoc from logs.

The paper also makes an important institutional argument: vertical integration is the path of least resistance when interoperability is painful. If FP-like coordination infrastructure does not emerge as shared, open protocol substrate, the likely outcome is a small number of platforms that own identity, policy, routing, and economic settlement end-to-end. The governance consequences of that concentration are exactly the power asymmetry concerns that the F41LUR3-F1R57 policy research tracks.

### Failure-First Implications

The paper's framing of agents as social infrastructure — not tools — is the right threat model for embodied AI safety research. Physical agents in real environments are already in this regime: a robot with persistent credentials, tool access, and the ability to act on delegated authority is exactly the kind of entity FP is designed to govern. The interaction safety failures that IS-Bench (2506.16402) benchmarks in household tasks, and the harness violations that HarnessAudit documents in execution traces, are both symptoms of the same underlying gap: agent systems operating without the coordination substrate that would make their behaviour accountable.

*Read the [full paper on arXiv](https://arxiv.org/abs/2605.23218) · [PDF](https://arxiv.org/pdf/2605.23218.pdf)*
