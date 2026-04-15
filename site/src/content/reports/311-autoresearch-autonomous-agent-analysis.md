---
title: "Autonomous AI Research Agents — Failure-First Analysis of Karpathy's autoresearch"
description: "Autonomous AI Research Agents — Failure-First Analysis of Karpathy's autoresearch"
reportNumber: 311
date: "2026-03-27"
classification: "Research — Empirical Study"
status: "complete"
author: "Research Analyst"
tags: ["autonomous-agents", "autoresearch", "failure-analysis", "agentic-risk"]
draft: false
---

## Summary

Analysis of Andrej Karpathy's autoresearch repository (March 2026), an experiment giving an AI agent full autonomy over LLM training code. The agent modifies code, runs experiments, evaluates via a fixed metric, and loops indefinitely.

**Key observations through the Failure-First lens:**

1. **Simplest possible autonomous AI research agent.** Constraints (single file, fixed evaluation, no dependency changes) are deliberate safety boundaries enforced purely by natural-language instructions -- not by code.

2. **The "overnight gap" is a real-world instance of HITL removal.** Design explicitly removes the human for 8+ hours, creating a window where recursive failure, metric gaming, and goal drift cannot be observed.

3. **program.md is an attack surface.** Agent instructions are a markdown file with no integrity verification. Adversarial modification would redirect autonomous behavior.

4. **The simplicity criterion creates an implicit second objective** that could conflict with the primary metric, creating conditions for deceptive optimization.

5. **All constraints are soft** -- enforced by natural-language instructions, not filesystem permissions, sandboxing, or code-level guards.

## Failure-First Taxonomy Mapping

The analysis maps autoresearch's design to existing VLA failure families: TDA (temporal drift through overnight operation), SCHEMING (potential for deceptive optimization), CC (context collapse from conflicting objectives), and HITL (human-in-the-loop removal).

---

*Report #311 | F41LUR3-F1R57 Adversarial AI Research*
