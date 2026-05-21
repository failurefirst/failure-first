---
title: "TopoPilot: Reliable Conversational Workflow Automation for Topological Data Analysis and Visualization"
description: "TopoPilot introduces a two-agent agentic framework with systematic guardrails and verification mechanisms to reliably automate complex scientific visualization workflows, particularly for topological data analysis."
date: 2026-03-28
arxiv: "2603.25063"
authors: "Nathaniel Gorski, Shusen Liu, Bei Wang"
paperType: "methods"
tags: [agentic-systems,llm-reliability,verification-mechanisms,scientific-visualization,failure-mode-taxonomy,workflow-automation]
audio: "/audio/daily-paper/2603.25063-audio-overview.m4a"
image: "/images/daily-paper/2603.25063-infographic.png"
draft: false
---

# TopoPilot: Reliable Conversational Workflow Automation for Topological Data Analysis and Visualization

### 1. Introduction: The "Black Box" Problem in AI Science
In the race to automate scientific discovery, we have encountered a critical "unreliability gap." While Large Language Models (LLMs) can generate complex code on the fly, they operate in a vast, unconstrained output space. When tasked with multi-step scientific visualizations, standard AI agents act as "black boxes"—stochastic systems that frequently hallucinate parameters, skip essential validations, or execute semantically invalid operations. For high-stakes research, raw code generation is fundamentally incompatible with the scientific requirement for "Ground Truth."

This reliability crisis is most visible in Topological Data Analysis (TDA). TDA is essential for uncovering structural patterns in climate science, molecular biology, and fluid dynamics, but its workflows are notoriously intricate, requiring precise coordination of data preprocessing and feature extraction. Standard agents often crumble here, failing half the time. **TopoPilot** changes the paradigm. By shifting from an autonomous "creative writer" to a constrained "system operator," this framework achieves a 99% success rate, transforming AI from a risky assistant into a verifiable scientific partner.

### 2. Why Standard AI Agents Fail: A Taxonomy of Errors
To build a safer agent, we must first categorize how they break. The TopoPilot research establishes a rigorous taxonomy of six specific failure modes (**F1–F6**) that define the current state of agentic unreliability:

*   **F1: Clarification Failure:** The agent makes unsupported assumptions about ambiguous or underspecified prompts instead of requesting missing parameters.
*   **F2: Confusion of Capabilities:** The system attempts operations outside its toolset or incorrectly claims it cannot perform a feasible task.
*   **F3: Invalid Parameterization:** The selection of illegal values (e.g., negative persistence thresholds) or choices that yield misleading, low-quality visualizations.
*   **F4: Invalid Workflow:** The construction of semantically inconsistent sequences, such as attempting to apply scalar simplification to a vector field.
*   **F5: Goal Misalignment:** Producing an output that is technically executable but fails to satisfy the user’s actual research objective.
*   **F6: Erroneous Execution:** Runtime failures, corrupted artifacts, or computation errors during the rendering phase.

The necessity of these safeguards is proven by the data: in "Control Trials" where checks were disabled, the system's success rate plummeted to 46.8%. Most alarmingly, for **minimally specified tasks**, the failure rate hit a staggering **77.5%**. Without multi-turn interaction and deterministic constraints, agents are essentially guessing.

### 3. The Core Innovation: The Two-Agent Architecture
TopoPilot solves the reliability problem by decoupling the "thinking" from the "doing." It utilizes a two-agent split that prevents the compounding errors typical of single-agent stochastic workflows.

*   **The Orchestrator (The Architect):** This agent translates natural language into structured workflows. Crucially, it does not write raw code. Instead, it utilizes the **Model Context Protocol (MCP)** to invoke a predefined set of atomic operations. This constrains the output space to a "safe" set of actions, ensuring that every step is a known, valid operation.
*   **The Verifier (Quality Control):** Before any code executes, the Verifier performs a formal review. Unlike standard LLM "critiques" which can be lazy or vague, the TopoPilot Verifier answers **deterministic boolean parameters** via a tool interface. It evaluates the plan against the user's intent and structural requirements, answering "yes/no" to specific validity checks. If the Verifier detects a violation, the workflow is blocked.

| **Orchestrator’s Responsibilities** | **Verifier’s Safeguards** |
| :--- | :--- |
| Interprets user intent and requests clarification (F1). | Conducts "Orchestrator assessment" of the proposed plan. |
| Invokes atomic tools via MCP to build a workflow. | Validates "alignment with user intent" (F5). |
| Constrains behavior to predefined capabilities (F2). | Checks for "Proper tool use" and parameter legality (F3). |
| Constructs a transparent Node Tree representation. | Answers deterministic boolean questions to block invalid code. |

### 4. The "Node Tree": Turning Stochastic Prompts into Deterministic Workflows
The "secret sauce" of TopoPilot is the **Node Tree**, a custom data structure that serves as a formal abstraction of a workflow. In this model, the **Root Node** is the only component allowed to load data; every subsequent node is a strictly defined **transformation**. This transformation-only logic ensures the entire pipeline is verifiable.

The Node Tree architecture directly addresses several core design requirements (**R1–R7**):
*   **Caching and Flexibility (R6):** Because each node’s output is cached, users can adjust downstream parameters—like changing a colormap—without recomputing expensive upstream persistence calculations.
*   **Extensibility (R3):** New algorithms can be added as standalone classes without modifying the core system, preventing the "brittleness" common in evolving AI systems.
*   **Reproducibility (R5) and Interpretability (R7):** The system generates portable Python scripts by traversing the Node Tree. This allows scientists to inspect, export, and rerun the exact logic used, moving away from "black box" dependency.

To enforce these rules, TopoPilot utilizes **Guardrails**. These are not mere suggestions; they are programmatic enforcements. For instance, a guardrail ensures that an Isocontour node must use the same colormap as the scalar field it originates from, and the system is hard-coded to require explicit user confirmation before applying critical steps like persistence simplification.

### 5. Empirical Proof: 1,000 Conversations Later
The framework’s reliability was validated through a massive evaluation of 1,000 simulated multi-turn conversations. The results prove that architectural constraints beat raw model scaling:

*   **99.1% Success Rate:** Across all feasible tasks, the Orchestrator/Verifier duo virtually eliminated execution errors.
*   **Safety in the Unknown:** The system excelled at handling **Adversarial and Infeasible** requests. For example, when asked to perform a "gradient-based simplification"—a semantically invalid request—TopoPilot correctly identified the task as outside its capabilities and refused to execute, where a standard LLM would likely have hallucinated a nonsensical script.
*   **Clarification Efficacy:** By refusing to guess on minimally specified tasks, TopoPilot maintained high accuracy where standard baselines failed nearly 80% of the time.

### 6. Expert Insights: Bridging the "Trust Gap"
Feedback from domain experts (E1–E4) in chemistry and mechanical engineering emphasized that the value of TopoPilot extends beyond just "AI."

*   **Overcoming the Infrastructure Roadblock:** Experts E1 and E2 noted that TDA tools are often poorly documented and difficult to integrate. TopoPilot provides an **infrastructure abstraction** that allows researchers to focus on science rather than learning new library syntax.
*   **Preventing Over-interpretation:** Expert E3 highlighted the danger of "over-interpreting" results from a black box. TopoPilot’s ability to export a readable Python script is the direct solution to this trust issue, allowing researchers to verify that the patterns they see are physically meaningful and not artifacts of an AI hallucination.
*   **Assistant to Tutor:** The conversational interface doesn't just execute tasks; it guides the user. By asking, "Are you sure you want to simplify by this threshold?" it acts as a pedagogical partner, helping students understand the trade-offs in topological analysis.

### 7. Conclusion: The Future of Agentic AI Safety
TopoPilot represents a fundamental shift in how we build AI for science. We must move away from the idea of the "all-knowing" agent and toward a model of **transparent, verifiable partnerships**. By enforcing structural validity through Node Trees and separating planning from deterministic verification, we can finally trust AI in high-stakes scientific environments.

**Takeaways for AI Practitioners:**
*   **Decouple Planning from Verification:** A two-agent split is essential to prevent compounding errors in stochastic workflows. Never let the agent that writes the plan be the one that approves it.
*   **Constraint is a Feature, Not a Bug:** Using protocols like MCP to limit an agent to a predefined action space dramatically increases reliability compared to unconstrained code generation.
*   **Workflow Abstraction over Raw Code:** Representing tasks as atomic Node Trees ensures reproducibility (R5) and allows for robust caching (R6), turning "one-off" AI outputs into reusable scientific assets.

The shift from "black box" assistant to "transparent tutor" is not just about better code—it is about building a foundation for AI safety that can scale alongside the complexity of modern science.

*Read the [full paper on arXiv](https://arxiv.org/abs/2603.25063) · [PDF](https://arxiv.org/pdf/2603.25063.pdf)*
