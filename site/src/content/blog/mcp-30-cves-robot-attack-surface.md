---
title: "30 CVEs and Counting: The MCP Security Crisis That Connects to Your Robot"
description: "The Model Context Protocol has accumulated 30+ CVEs in 18 months, including cross-client data leaks and chained RCE. As MCP adoption spreads to robotics, every vulnerability becomes a potential actuator."
date: 2026-03-11
tags: [mcp, supply-chain, agentic-ai, embodied-ai, vulnerability, tool-calling]
---

The Model Context Protocol (MCP) was designed to let AI agents use tools safely. Eighteen months after its launch, it has accumulated [more than 30 CVEs](https://vulnerablemcp.info/), including remote code execution, cross-client data leakage, and supply chain poisoning attacks.

For text-based AI systems, these are software security problems. For embodied AI systems connected via MCP, they are physical safety problems. When the tool your AI agent calls controls a robotic arm, a building management system, or an autonomous vehicle, a supply chain vulnerability becomes a pathway to physical harm.

## The Vulnerability Landscape

Three categories of MCP vulnerability have emerged, each with distinct implications for embodied AI.

### Category 1: Cross-Client Data Leakage

[CVE-2026-25536](https://nvd.nist.gov/vuln/detail/CVE-2026-25536) (CVSS 7.1) affects the canonical MCP TypeScript SDK. When a single McpServer instance serves multiple clients, responses leak across client boundaries. One client receives data intended for another.

Authentication does not prevent this. The vulnerability exists within authenticated sessions.

**Embodied AI implication:** In a multi-tenant robotics deployment — a warehouse with multiple operators controlling different robots through shared MCP infrastructure — one operator's commands could be received by another operator's robot.

### Category 2: Chained Remote Code Execution

Three chained CVEs (CVE-2025-68145, 68143, 68144) in the official Anthropic mcp-server-git achieve full remote code execution when combined with the Filesystem MCP server. A malicious repository provides a pathway from software supply chain to host compromise.

**Embodied AI implication:** If a robot system uses MCP for configuration management or code updates, a malicious repository provides a path from software compromise to physical actuation. The attacker does not need to interact with the robot directly.

### Category 3: Supply Chain Poisoning

MCP tool descriptions can contain [malicious instructions invisible to users](https://unit42.paloaltonetworks.com/model-context-protocol-attack-vectors/). The "rug pull" variant is particularly concerning: an approved MCP server modifies its tool definitions between sessions, presenting different capabilities than initially reviewed.

## The Protocol-Level Problem

These vulnerabilities are not implementation bugs that patches will permanently fix. Several reflect [design-level weaknesses](https://www.redhat.com/en/blog/model-context-protocol-mcp-understanding-security-risks-and-controls) in the MCP specification:

- **Session identifiers in URLs** violate security best practices
- **No authentication standard** — implementations must provide their own
- **No message signing or verification** — no mechanism to verify tool responses are untampered
- **No trust boundary between tool definitions and execution** — the model processes descriptions and outputs with equal trust

For text-based AI, these gaps produce data leaks. For embodied AI, they produce a control channel with no integrity verification between the AI agent and the physical actuator it controls.

## The Numbers

Our Governance Lag Index includes five MCP-related entries. All five have OWASP framework coverage but zero legislative coverage and zero enforcement. No jurisdiction has enacted legislation addressing MCP or AI tool-calling security.

The median doc-to-framework time for MCP/agentic vulnerabilities is approximately 101 days — an order of magnitude faster than the 1,700-day median for legacy ML attack classes. The software security community responds quickly. But the framework-to-legislation transition has not begun.

## What Operators Should Do Now

For organisations deploying AI systems connected to physical infrastructure via MCP:

1. **Upgrade the MCP TypeScript SDK to v1.26.0 or later.** CVE-2026-25536 is fixed in this version.
2. **Do not run multi-client MCP servers in shared-state mode.** Create fresh instances per client or session.
3. **Audit MCP tool definitions.** Review descriptions for injected instructions. Re-review after updates.
4. **Isolate MCP-connected physical systems.** Network-isolated environments with explicit allow-listing of permitted tool calls.
5. **Do not assume authentication prevents cross-client leakage.** CVE-2026-25536 demonstrates it does not.

These are stopgaps. The underlying protocol design issues require specification-level changes that have not yet been proposed.

## The Bigger Picture

MCP is the connective tissue between AI reasoning and physical action. It is becoming the standard way AI agents interact with tools, services, and — increasingly — physical systems. The security of MCP is not a niche software engineering concern. It is the security of the interface between digital intelligence and physical reality.

Thirty CVEs in eighteen months is not a bug count. It is a signal that the protocol was not designed with adversarial robustness in mind. And as MCP adoption spreads from coding assistants to robotic controllers, the attack surface spreads with it.

---

*This analysis draws on the [VulnerableMCP database](https://vulnerablemcp.info/), NVD CVE records, [OWASP Top 10 for Agentic Applications](https://owasp.org/), and the Failure-First Governance Lag Index dataset (59 entries, March 2026).*
