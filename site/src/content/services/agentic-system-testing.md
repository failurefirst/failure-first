---
title: "Agentic System Testing"
description: "Red-team testing for agentic AI systems — tool-use misuse, prompt injection via retrieved content, planner attacks, and long-horizon drift."
layout: "service-detail"
draft: true
---

# Agentic System & Tool-Use Red-Teaming

Agentic systems introduce attack surfaces that single-turn LLM testing misses entirely. The planner, the tool router, the memory store, and any external content the agent retrieves are all adversary-reachable. We test the whole loop.

## What We Test

- **Tool-use misuse.** Can the agent be induced to call privileged tools it should not, in orders it should not, with arguments it should not?
- **Indirect prompt injection.** Adversarial content embedded in retrieved documents, emails, web pages, or tool outputs — including instructions that ride along with otherwise-safe data.
- **Planner attacks.** Framing the task so the planner decomposes it into steps that individually pass safety review but are harmful in aggregate.
- **Long-horizon drift.** How constraints erode across 20+ turn agentic sessions, especially when the agent maintains memory or summarization state.
- **Exfiltration pathways.** Whether sensitive state (system prompts, tool credentials, prior-user data) can be coaxed into tool outputs or external content.

## Methodology Summary

Testing uses the F41LUR3-F1R57 agentic corpus plus engagement-specific scenarios built against your tool catalog. We emphasize realistic attack surfaces: documents, emails, web content, and RAG outputs — the channels adversaries actually reach.

All tool calls are logged. All external content used in testing is preserved. Grading uses FLIP with agent-specific verdict categories including TOOL_MISUSE, POLICY_DRIFT, and EXFILTRATION.

## Deliverables

- **Core Technical Report** — findings with full agent traces, tool-call logs, and adversarial input artifacts
- **Tool-risk mapping** — per-tool exposure summary
- **Session replay** — complete conversational + tool-call evidence for each finding

## Example Engagement Shapes

| Scenario | Suggested Tier |
|---|---|
| Quick assessment of a new agent tool catalog before rollout | Quick Scan |
| Annual red-team of a deployed internal or customer-facing agent | Standard |
| Comprehensive evaluation including custom indirect-injection corpus and multi-session drift | Comprehensive |

## Get a Scoping Call

Contact [TBD — Operator].
