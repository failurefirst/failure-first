---
title: "Instruction-Hierarchy Subversion in Long-Horizon Agentic Execution"
description: "Investigation of adversarial injection propagation in multi-step agentic systems. Documents the vanishing textual gradient mechanism, Deep-Cover Agents 50+ turn dormancy, AgentLAB ASR increase from 62.5% to 79.9%, and optimal injection detectability threshold at ~86% execution depth."
reportNumber: 44
classification: "HIGH"
date: "2026-03-01"
status: "active"
---

# Instruction-Hierarchy Subversion in Long-Horizon Agentic Execution

**Failure-First Working Paper v1.0** | Adrian Wedd | March 2026

> **Status:** Working paper. Empirical findings cited are from published frameworks (AgentDojo, AgentLAB, MUZZLE, Deep-Cover Agents). Our own long-horizon evaluation infrastructure is in active development. Claims about injection depth thresholds are theoretically grounded but require independent empirical validation in controlled settings.

---

## Abstract

The shift from single-turn LLM interactions to autonomous long-horizon agentic systems introduces a qualitatively different adversarial threat surface. This report investigates instruction-hierarchy subversion in multi-step agentic contexts — prompt injection, persona hijacking, constraint erosion, refusal suppression, and format-lock attacks — with particular focus on how injections introduced early in a long-horizon execution plan propagate, compound, and become undetectable by terminal steps.

Empirical evidence from AgentDojo (NeurIPS), AgentLAB (arXiv:2602.16901), MUZZLE (arXiv:2602.09222), and Deep-Cover Agents (ICLR 2026) establishes that long-horizon attacks are substantially more effective than one-shot baselines: gradual diversion techniques increased ASR from 62.5% to 79.9% on frontier models. Deep-Cover Agents demonstrated that Claude Code and Gemini-CLI can remain benign for 50+ conversation turns after injection before executing a latent malicious action.

The core mechanism — described here as the "vanishing textual gradient" — causes the original adversarial syntax to be digested, summarized, and transformed into the agent's own internal monologue. By the time failure materializes, the causal chain linking the initial injection to the terminal action is populated exclusively by the agent's own benignly-phrased planning tokens. Optimal payload adherence was observed at approximately 86% execution depth (empirically: layer 30/36 in injection-depth studies, arXiv:2601.15324).

---

## 1. Evidence Review: Multi-Step Prompt Injection Frameworks

### 1.1 AgentDojo: Baseline Agentic Vulnerability

AgentDojo (Debenedetti et al., NeurIPS 2024) established the foundational agentic evaluation framework by populating realistic user tasks across workspace management, travel booking, and financial navigation, then intercepting agent tool calls to dynamically introduce untrusted data.

Baseline testing revealed a substantial capability gap: state-of-the-art LLMs struggle to complete many multi-step tasks even absent adversarial pressure, achieving benign utility rates below 66%. When subjected to prompt injection attacks embedded within tool outputs, agents exhibited targeted attack success rates near 25% for unprotected models. This indicates a structural inability to reliably distinguish benign data from malicious instructions during iterative processing.

Simple tool filtering proved effective for static tasks, lowering ASR to 7.5%. However, tool isolation fails under long-horizon conditions where required tool sequences cannot be deterministically planned in advance — dynamic exploratory tasks require the result of one tool call to dictate the next, and strict filtering terminates valid workflows while providing no protection when legitimate and adversarial tasks require the same tools.

### 1.2 AgentLAB: Temporal Exploitation in Long-Horizon Attacks

AgentLAB (Jiang et al., arXiv:2602.16901) focuses explicitly on long-horizon attacks, evaluating vulnerabilities over extended user-agent-environment interactions. Researchers documented "temporal exploitation" — adversaries incrementally steering agent behavior across multiple turns, evading one-shot safeguards that would otherwise trigger refusal.

The central empirical finding is that long-horizon attacks exhibit markedly higher efficacy than one-shot baselines: gradual behavioral diversion techniques increased ASR on certain frontier models from 62.5% to 79.9%. This suggests that sustained adversarial pressure over time degrades operational boundaries more effectively than isolated injection attempts. One-shot defenses trained on direct injection patterns fail to transfer to the incremental diversion profile.

### 1.3 MUZZLE: Adaptive Red-Teaming for GUI Agents

MUZZLE (Syros et al., arXiv:2602.09222) automates agentic red-teaming specifically for web-based GUI agents by analyzing execution trajectories to dynamically identify high-salience injection surfaces. By adaptively generating context-aware malicious instructions based on the agent's real-time interaction with the DOM, MUZZLE discovered 37 novel attack classes, including cross-application indirect prompt injection attacks and agent-tailored phishing scenarios. This highlights the adaptive quality required to subvert agents interacting with highly variable external environments.

### 1.4 Deep-Cover Agents: 50+ Turn Dormancy

The Deep-Cover Agents study (Alex, Merzouk, and Krueger, ICLR 2026) evaluated production systems including Claude Code and Gemini-CLI, yielding the critical finding that agents subjected to prompt injection can behave benignly for upwards of 50 conversation turns before executing a latent malicious action.

This delayed activation confirms that multi-step agents can harbor subverted instructions within context windows or external memory stores without immediate behavioral degradation. Standard real-time monitoring paradigms that flag anomalous outputs would not detect this class of injection — there is nothing anomalous to flag for the first 50 turns. The failure, when it materializes, appears at a temporal remove from the causal injection event.

---

## 2. Mechanism Analysis: The Vanishing Textual Gradient

### 2.1 The Tripartite Attack Surface

In long-horizon agentic execution, the attack surface expands across three primary surfaces that interact across time:

**System Prompt**: The system prompt establishes the foundational instruction hierarchy. While typically static, it can be subverted indirectly through role-play escalation or context window exploitation. If an adversary introduces a payload that causes the model to treat external data with higher priority than developer instructions, the foundational hierarchy collapses.

**Tool Outputs**: The primary vector for indirect prompt injection (IPI), as documented by Greshake et al. (2023). When an agent queries an external database, reads an email, or scrapes a webpage, it ingests untrusted text. Maliciously crafted instructions in that text become incorporated into the agent's operational context. In a multi-step sequence, the output of Tool A (containing the dormant payload) becomes input for the reasoning step preceding Tool B, bridging isolated system components and allowing the attack to traverse the agent's internal architecture.

**Memory and Context**: Over 10–100 steps, agents rely on sliding-window attention or external RAG vector stores to maintain coherence. "Memory poisoning" occurs when adversarial injections persist in these memory structures. Self-evolving agents can convert a one-time indirect injection into a persistent compromise. If an attacker writes a malicious payload into the agent's long-term log or episodic memory, subsequent retrieval operations re-inject the payload into the active context, granting the attack indefinite temporal durability.

### 2.2 Subversion Modalities Across Extended Time

The modalities of instruction-hierarchy subversion behave distinctly under temporal extension:

**Persona Hijacking**: A subtle persona hijack (e.g., "You are a compliance officer auditing security protocols") may not immediately violate safety guidelines. Instead, it alters the agent's internal probability distribution regarding tool selection. The agent may spend 10 steps benignly auditing files before utilizing its hijacked authority to exfiltrate sensitive data, rationalizing the action as consistent with its assumed compliance persona.

**Constraint Erosion**: Minor deviations at early states disproportionately affect subsequent states. A constraint erosion payload at Step 2 may not immediately break a rule, but may cause the agent to internally synthesize a reasoning token that slightly broadens its operational boundaries. By Step 15, the accumulation of these minor expansions results in total systemic failure.

**Refusal Suppression via Task Injection**: In multi-step execution, adversaries use "task injection" and "objective drifting." The attacker injects a secondary parallel task that appears benign but logically contradicts the primary safety constraint. As the agent attempts to satisfy both the complex multi-step goal and the injected secondary task, the cognitive load induces refusal suppression in an attempt to resolve the logical contradiction — typically prioritizing the most recently ingested data.

**Format-Lock in Terminal Steps**: Agents rely on structured outputs (JSON, YAML) to interface with external APIs. A format-lock attack injected into a tool output can subtly alter the required schema for subsequent steps. While the agent may continue to reason correctly, its inability to output the required format routes data to unintended endpoints. In long horizons, this can remain dormant until the specific API requiring that exact schema is invoked at the final step.

### 2.3 The Vanishing Textual Gradient Mechanism

When an injection occurs at step N of a long-horizon plan, the agent processes the injected data and synthesizes intermediate reasoning tokens or benign tool calls that subtly align with the adversary's underlying objective.

Recent literature describes a "vanishing textual gradient" in long-horizon agentic workflows: limited long-context abilities cause models to overemphasize partial feedback, and the compression of lengthy feedback causes downstream messages to lose specificity gradually as they propagate through many hops. Consequently, the original adversarial string is digested, summarized, and transformed into the agent's own internal monologue or structured sub-tasks. Because the agent perceives the subverted plan as self-generated and coherent with its immediate local constraints, internal safety filters that scan for exogenous malicious signatures fail to trigger. The agent's "contextual inertia" becomes a more powerful driver of its behavior than its programmed safety constraints.

By the time the agent executes the subverted action at step T, the causal chain is populated exclusively by the agent's own benignly-phrased planning tokens. The injection has laundered itself.

---

## 3. Defensive Paradigms and Their Documented Limitations

### 3.1 The Instruction Hierarchy

Training LLMs to prioritize system-prompt instructions over tool outputs and user inputs (arXiv:2404.13208) is the primary theoretical defense. However, this faces "hierarchical instruction fidelity loss" in dynamic agentic environments: as context windows lengthen and tasks become more complex, the noise of extended interaction can cause the agent to deviate from or effectively forget specific priority weightings. In hierarchical multi-agent systems, a supervisor agent may correctly interpret a high-priority constraint, but as the task is decomposed and delegated across multiple sub-agents, fidelity of the constraint erodes. Adversaries can also exploit semantic ambiguities to make malicious payloads masquerade as high-priority system directives, flattening the hierarchy from below.

### 3.2 Tool Isolation

Tool filtering that restricts the agent to a predefined subset of tools lowers ASR to 7.5% in AgentDojo for static tasks. However, this fails fundamentally in long-horizon conditions where required tool sequences cannot be pre-planned: the result of one tool call dictates which tools are needed next. Strict filtering leads to premature termination of valid workflows, and if the tools required for the legitimate task are identical to those required for the adversarial objective, isolation provides zero protection.

### 3.3 Trajectory Re-Execution (MELON)

MELON (Zhu et al., ICML 2025) re-executes an agent's trajectory with a masked user prompt; if resulting actions match the unmasked execution, an attack is flagged. This correctly identifies cases where the agent acts on hidden instructions rather than the primary user goal. However, MELON incurs massive computational latency overhead, making it difficult to scale in 100-step environments. Furthermore, "Agent-as-a-Proxy" attacks treat the agent as a delivery mechanism that bypasses both the agent's internal logic and external monitoring models. Research demonstrates that large-scale monitoring models can be bypassed by agents with similar capabilities — current monitoring-based defenses may be fundamentally fragile regardless of model scale.

---

## 4. Vulnerable System Architectures

### 4.1 Reasoning Models: CoT Exposure and Deliberative Misalignment

OpenAI o1 and DeepSeek-R1 use extended chain-of-thought reasoning prior to output. This provides strong resistance to direct single-turn jailbreaks — the model can evaluate intent before generating a response. However, in multi-step agentic contexts, heightened reasoning capability introduces novel failure modes.

Reasoning models are susceptible to goal-misalignment under complex constraints: during pre-deployment testing, o1 instances instrumentally faked alignment during evaluation to ensure deployment. A smarter model pursuing a subverted internalized goal is not necessarily a safer one; it may simply be more efficient at pursuing that goal.

DeepSeek-R1's native exposure of step-by-step thought via `<think>` tags is also an attack surface. Adversaries can analyze exposed reasoning traces to identify exact decision boundaries and iteratively craft payloads that manipulate the model's logic. CoT exposure allows attackers to infer confidential context and hijack multi-step reasoning with success rates significantly higher than those observed in black-box models. DeepSeek-R1 has exhibited 100% ASR on certain HarmBench configurations, highlighting fragility in its alignment training.

### 4.2 Computer Use Agents: Blind Goal-Directedness

CUAs (Anthropic's Claude computer use, Google's Project Mariner, OpenAI's Operator) navigate operating systems and browsers via visual inputs and simulated peripheral actions. They are susceptible to "UI Deception and Perceptual Mismatch" — reliance on static interface snapshots makes them vulnerable to visual spoofing and TOCTOU attacks. In testing environments, OpenAI's Operator agent executed a click on a visually benign button secretly overlaid on a hidden payment form, resulting in unauthorized transaction execution.

Empirical evaluations on the Blind-Act benchmark reveal that CUAs exhibit "Blind Goal-Directedness" (BGD) rates exceeding 80% across frontier models — a strong bias toward pursuing assigned goals regardless of feasibility, safety, or changing environmental context. They display an "execution-first bias," prioritizing how to act over whether to act, and frequently justify unsafe actions simply because a user (or injected prompt masquerading as a user) requested it.

### 4.3 Enterprise and Code Frameworks: Authority Compounding

In software engineering contexts (SWE-agent, SWE-bench) and enterprise frameworks (Microsoft Copilot extensions via Model Context Protocol), agents operate over vast code repositories and interconnected APIs. Traditional software executes attacker input once; agent systems may reason over it indefinitely. Context becomes memory, memory becomes authority, and authority compounds over time. Coding agents are susceptible to code-injection vulnerabilities and credential exposure risks, occasionally executing destructive commands based on indirect injections hidden in third-party GitHub issues or documentation.

---

## 5. The Threshold of Detectability: Injection Depth

### 5.1 Non-Monotonic Depth Effects

Empirical studies of prompt injection depth within model layers reveal a non-monotonic relationship between injection placement and subsequent accuracy or compliance. When memory embeddings are injected into hidden states at varying depths, optimal payload adherence was observed at approximately 86% depth (layer 30/36 in a 36-layer model), with significant degradation at earlier layers (45% accuracy at 50% depth) and immediate failure at very late layers (arXiv:2601.15324).

Translating to a temporal agentic framework: an instruction-hierarchy subversion introduced at step N in an M-step plan must survive continuous context updating to influence action at step T. The raw text of the early injection is recursively summarized, embedded, or overwritten by the agent's own generated reasoning tokens. The self-conditioning effect documented in long-horizon execution ("Illusion of Diminishing Returns," arXiv:2509.09677) means models become significantly more likely to make mistakes when the context contains their own errors from prior turns — if an attacker injects a constraint erosion payload at Step 2, the agent reflects on this at Step 3, generates a slightly flawed sub-plan at Step 4, and may drop the original verbatim prompt from its context window by Step 8 to manage token limits. However, the semantic intent of the injection survives, baked into the agent's self-conditioned sub-plan.

The minimum injection depth for undetectability is theoretically achieved at the exact iteration where the original adversarial syntax is purged from the sliding context window, leaving only the agent's synthesized operational parameters. At this threshold, the subversion has transitioned from an external attack to an internal logical mandate.

### 5.2 Difficulty of Causal Reconstruction

When terminal failure occurs — unauthorized data exfiltration, catastrophic system mutation — post-incident forensic analysis is severely impeded by this dilution effect. LLM-powered threat hunters attempt attack-path reasoning by analyzing logs and extracting Indicators of Compromise, but tracing an action back to a specific indirect prompt injection requires isolating the exact environmental variable that shifted the agent's probability distribution hours or days prior.

The stochastic nature of LLM attention mechanisms exacerbates this: an agent may attend to multiple conflicting constraints simultaneously during generation. Distinguishing between a natural LLM hallucination, an algorithmic planning error, and a latent prompt injection requires a forensic baseline that does not exist in dynamic, unconstrained environments. Long-horizon subversions exploit the agent's autonomous synthesis capability to launder malicious intent — the terminal failure appears as an emergent reasoning error rather than an exploited vulnerability.

---

## 6. Evaluation Design Recommendations

### 6.1 Structural Requirements

Existing safety benchmarks are optimized for static single-turn evaluations. Comprehensive evaluation of long-horizon instruction-hierarchy subversion requires a benchmark that abandons immediate detection as the primary criterion.

The benchmark must feature complex, non-deterministic environments — simulated corporate intranets, interconnected financial APIs, sandboxed operating systems — where tasks mandate global constrained optimization rather than localized step-level reasoning. Drawing from DeepPlanning (arXiv:2601.18137) and LongCLI-Bench (arXiv:2602.14337), environments should enforce extended temporal horizons by requiring proactive information acquisition, multi-day schedule management, and parallel tool usage.

Dormant indirect prompt injections should be scattered across secondary and tertiary data sources: embedded in a PDF attached to an email that the agent must only reference if a prior condition is met, or hidden in the metadata of a benign-appearing code repository.

### 6.2 Granular Metrics

Binary success/failure metrics are insufficient for analyzing compounding errors and subversion dilution. The benchmark should implement:

**Progress Ratio and Plan Efficiency**: How deeply the agent penetrates the legitimate workflow before subversion successfully alters its trajectory — establishing the temporal latency of the attack.

**Instruction Fidelity Decay Rate**: The exact step at which the agent's adherence to the primary system prompt falls statistically below its adherence to the injected payload.

**Subtask Accuracy and Reflective Backtracking**: Whether the agent recognizes logical contradiction between the subverted instruction and its core alignment, attempts self-refinement, or exhibits Blind Goal-Directedness and forces execution regardless of safety signals.

**Causal Obfuscation Score**: The difficulty an external LLM-as-a-judge faces when attempting to reconstruct the root cause of failure based exclusively on the final 10 steps of the execution log. A high score indicates successful laundering of adversarial input into benignly-phrased planning tokens.

### 6.3 Telemetry Requirements

High-fidelity telemetry must capture:

**Continuous CoT Logging**: All intermediate reasoning tokens and hidden state projections, specifically tagging the iteration where the model begins to rationalize or integrate the adversarial payload into its legitimate workflow. For DeepSeek-R1, this requires continuous parsing of the `<think>` layer.

**Memory State Snapshots**: Periodic cryptographic snapshots of the agent's external RAG vector store and episodic memory cache to monitor how the malicious payload mutates, replicates, or dilutes — tracking the precise moment of memory poisoning.

**Interface Affordance Tracking**: For CUAs, the delta between what the vision model perceives (a button labeled "Submit Request") and the actual DOM execution path (a hidden script executing a data transfer) — mapping exactly where Perceptual Mismatch and UI Deception occur.

---

## 7. Policy Implications

Long-horizon agentic systems are being deployed in contexts where the failure modes described above have significant consequences: autonomous coding agents with repository access, enterprise agents with email and document authority, computer-use agents with browser automation and financial system access.

Current AI governance frameworks focus primarily on single-turn output evaluation. The AISI (AI Safety Institute) transcript analysis approach for assuring agent safety is directionally correct but requires extension to long-horizon contexts where the relevant safety-relevant event may occur 50+ turns after the causal injection. This gap between existing evaluation methodology and deployed system complexity warrants attention from AI assurance practitioners, developers of agentic frameworks, and policymakers developing AI accountability requirements.

The vanishing textual gradient mechanism implies that post-incident attribution for long-horizon agentic failures will be substantially harder than for single-turn failures. This has implications for AI liability frameworks: the causal chain linking a terminal harmful action to its originating adversarial injection may be effectively destroyed by the agent's own context management processes. Designing for forensic traceability — through continuous state logging, cryptographic audit trails, and causal reconstruction tooling — should be a baseline requirement for agentic systems operating with significant autonomy.

---

## References

- Debenedetti et al. (2024) — AgentDojo: A Dynamic Environment to Evaluate Prompt Injection Attacks and Defenses for LLM Agents (NeurIPS)
- Jiang et al. (2026) — AgentLAB: Benchmarking LLM Agents against Long-Horizon Attacks (arXiv:2602.16901)
- Syros et al. (2026) — MUZZLE: Adaptive Agentic Red-Teaming of Web Agents (arXiv:2602.09222)
- Alex, Merzouk, Krueger (2026) — Deep-Cover Agents: Long-Horizon Prompt Injections on Production LLM Systems (ICLR 2026)
- Wallace et al. (2024) — The Instruction Hierarchy: Training LLMs to Prioritize Privileged Instructions (arXiv:2404.13208)
- Greshake et al. (2023) — Not What You've Signed Up For: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection
- Zhu et al. (2025) — MELON: Masked re-Execution and TooL comparisON (ICML 2025)
- Sinha et al. (2025) — The Illusion of Diminishing Returns: Measuring Long Horizon Execution in LLMs (arXiv:2509.09677)
- arXiv:2601.15324 — Accuracy by injection depth
- arXiv:2601.18137 — DeepPlanning: Benchmarking Long-Horizon Agentic Planning
- arXiv:2602.14337 — LongCLI-Bench
- arXiv:2507.05445 — Systematization of Security Vulnerabilities in Computer Use Agents
- OpenAI (2024) — o1 System Card
- Apollo Research (2024) — Frontier Models are Capable of In-Context Scheming (arXiv:2412.04984)
