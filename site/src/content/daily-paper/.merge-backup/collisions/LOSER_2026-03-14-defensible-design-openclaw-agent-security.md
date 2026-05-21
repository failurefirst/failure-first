---
arxiv_id: "2603.13151"
title: "Defensible Design for OpenClaw: Securing Autonomous Tool-Invoking Agents"
date: 2026-03-14
authors: ["Zongwei Li", "Wenkai Li", "Xiaoqi Li"]
institutions: ["Hainan University"]
tags: ["agent-security", "tool-use", "software-engineering", "secure-by-design"]
relevance: "Treats agent security as a software engineering problem — aligns with our IMB (Infrastructure-Mediated Bypass) attack class"
significance: high
---

## Summary

OpenClaw-like agents (CLI tools that browse, manipulate files, invoke tools, install extensions) are insecure by default because they combine untrusted inputs, autonomous action, extensibility, and privileged system access in a single execution loop. This paper proposes a defensible design blueprint: risk taxonomy, secure engineering principles, and a research agenda.

## Key Findings

- **Agent security is a systems problem**: not model alignment, but architecture, permission boundaries, isolation, extension governance
- **Four combined risks**: untrusted inputs + autonomous action + extensibility + privileged access
- Proposes **runtime isolation** and **extension governance** as primary defenses
- Frames the shift from "isolated vulnerability patching toward systematic defensive engineering"

## Relevance to Failure-First

- Directly validates our **IMB (Infrastructure-Mediated Bypass)** attack class — the PiCar-X pentest showed that attacking the API control plane bypasses model-level defenses
- Supports the **Defense Layer Mismatch Index** finding: most safety investment targets the model, but infrastructure is equally vulnerable
- The "insecure by default" framing mirrors our finding that embodied AI security requires full-stack evaluation
