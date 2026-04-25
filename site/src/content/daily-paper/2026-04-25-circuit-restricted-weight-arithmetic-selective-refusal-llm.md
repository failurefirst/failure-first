---
title: "C-ΔΘ: Circuit-Restricted Weight Arithmetic for Selective Refusal"
description: "C-ΔΘ uses mechanistic circuit analysis to localize refusal-causal computation and distill it into a sparse offline weight update, eliminating per-request inference-time safety hooks."
date: 2026-04-25
arxiv: "2602.04521"
authors: "Aditya Kasliwal, Pratinav Seth, Vinay Kumar Sankarapu"
paperType: "methods"
tags: [mechanistic-interpretability, selective-refusal, llm-safety, weight-editing, sparse-circuits, alignment]
draft: false
---

Safety enforcement in deployed LLMs usually costs something at inference time. Guardrails, activation steering, and conditional refusal systems all insert logic into the forward pass — adding compute, complexity, and latency on every request, whether the input is dangerous or not. C-ΔΘ asks whether this runtime overhead is structurally necessary, or whether the same selective refusal capability can be moved entirely offline as a one-time weight edit. The answer turns out to be yes, at least for category-targeted refusal, using a surprisingly small fraction of the model's parameters.

### The Problem with Runtime Safety Hooks

Activation steering is one of the most-studied tools in the mechanistic interpretability toolkit. It works by adding a direction vector to a model's residual stream at inference time, nudging the model toward or away from certain behaviors. The technique can be made selective — applying the steering only when the input is detected to fall into a particular category — but this selectivity requires keeping an inference-time control path active throughout deployment.

The cost is real: every request must be routed through the conditional check, the steering logic must be maintained as a deployed component, and the system's safety properties become tied to the integrity of that runtime infrastructure. For high-throughput deployments, the overhead is non-trivial. More subtly, runtime hooks can be bypassed or perturbed in ways that offline weight changes cannot — a consideration relevant to adversarial robustness of safety-critical systems.

### The C-ΔΘ Approach

The method proceeds in two steps.

**Step 1: Circuit localization.** The authors use Edge Attribution Patching with Integrated Gradients (EAP-IG) to identify the sparse subgraph of the model's computational graph that is causally responsible for refusal behavior on a given category of inputs. This is a mechanistic interpretability technique — rather than asking "does the model refuse?" it asks "which edges in the attention and MLP computation are doing the work of refusal?" The result is a circuit typically comprising less than 5% of the model's total parameters.

**Step 2: Constrained weight update.** Having localized the refusal circuit, the method computes a weight update ΔθC whose support is restricted to the edges identified in step 1. This update is optimized to achieve the desired selective refusal behavior — refusing the target category while leaving responses to other categories unchanged. The key constraint is sparsity: by restricting to the circuit, the update cannot accidentally affect unrelated capabilities. The resulting modified checkpoint is a standard model file with no attached inference-time machinery.

The "circuit-restricted" framing is what makes this different from naive fine-tuning. Fine-tuning on refusal examples tends to either under-generalize (refusing only examples similar to the training set) or over-generalize (becoming more reluctant across the board, degrading utility). By grounding the update in a mechanistic understanding of where refusal lives in the network, C-ΔΘ aims for a more surgical intervention.

### Implications for Safety Alignment

This work sits at the intersection of two active research threads: mechanistic interpretability and practical safety engineering. Its contribution is to show that interpretability findings can be operationalized into deployment artifacts, not just analytical insights.

From a safety perspective, offline weight edits have properties that runtime hooks do not. A checkpoint with a baked-in weight update cannot be "turned off" by disabling a guardrail service, cannot be bypassed by routing around an inference-time check, and cannot be degraded by load-shedding under traffic spikes. The safety property becomes intrinsic to the model rather than extrinsic infrastructure. This shifts the attack surface for adversarial bypasses from runtime manipulation to the harder problem of gradient-based optimization against a fixed checkpoint.

The sparse circuit framing also opens a path to *auditable* safety modifications. If the set of affected parameters is known and small, it becomes feasible to analyze what the edit does and does not change — something that is much harder to establish for full fine-tunes or for emergent behaviors shaped by RLHF. This connects to broader calls in the safety community for interpretable and verifiable safety guarantees rather than empirical robustness claims.

### Connection to Embodied AI Safety

While C-ΔΘ is framed in the context of text-based LLMs, the underlying approach — identify the computation responsible for an unsafe behavior, then edit that computation in a targeted and constrained way — is potentially extensible to multimodal and embodied systems. VLA models share architectural DNA with the transformer-based LLMs studied here. As mechanistic interpretability tools mature and are applied to action-prediction heads and cross-modal attention layers, circuit-restricted editing could become a tool for instilling safety constraints in robot controllers with similar precision.

The selectivity dimension is particularly relevant for embodied AI. A robot operating in a physical environment needs safety constraints that are *specific*: refuse to execute commands that would damage the environment or harm humans, but do not refuse to complete ordinary manipulation tasks. Over-refusal in an LLM degrades user experience; over-refusal in a robot controller can make the system unusable. C-ΔΘ's focus on category-targeted selectivity and capability retention directly addresses this tension.

### Limitations and Open Questions

The evaluation on refusal and utility benchmarks is reported but the paper does not yet provide the full numerical results in the arXiv preprint — the approach is positioned as a framework with benchmarks forthcoming. The generalization question is open: circuits identified on one distribution of harmful inputs may not generalize to novel phrasing or prompt formats, particularly adversarial ones designed to avoid triggering the circuit.

There is also a fundamental question about circuit stability. Mechanistic interpretability research has shown that circuits can shift under fine-tuning or even minor distribution changes. If the refusal circuit identified offline does not match the computation path activated by a deployment-time attack, the weight edit may fail to fire. Understanding the robustness of circuit identification across input distributions is a critical prerequisite for treating this as a reliable safety primitive.

*Read the [full paper on arXiv](https://arxiv.org/abs/2602.04521) · [PDF](https://arxiv.org/pdf/2602.04521.pdf)*
