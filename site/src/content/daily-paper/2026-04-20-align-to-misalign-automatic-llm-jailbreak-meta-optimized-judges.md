---
title: "Align to Misalign: Automatic LLM Jailbreak with Meta-Optimized LLM Judges"
description: "A bi-level meta-optimization framework co-evolves jailbreak prompts and scoring templates to achieve 100% attack success on Claude-4-Sonnet, exposing fundamental cracks in how safety alignment is measured."
date: 2026-04-20
arxiv: "2511.01375"
authors: "Hamin Koo, Minseon Kim, Jaehyung Kim"
paperType: "empirical"
tags: [jailbreak, red-teaming, safety-alignment, meta-optimization, adversarial-attacks, llm-safety, alignment-evaluation]
draft: false
---

Safety alignment research faces a measurement problem at its core. To know whether an alignment technique works, you need to know whether it stops attacks. But measuring whether an attack actually succeeds—whether a model truly produced harmful content versus a borderline response—has proven surprisingly difficult to automate reliably. AMIS (Align to MISalign) exploits this difficulty directly, and the results are uncomfortable reading for anyone who works on frontier model safety.

The paper introduces a bi-level meta-optimization framework that simultaneously refines two things: the jailbreak prompts used to attack a model, and the scoring templates used to judge whether those attacks worked. The key insight is that the evaluation mechanism is itself a variable, not a fixed oracle. Previous jailbreak frameworks treated scoring as a solved problem—either using binary pass/fail signals, which are sparse and uninformative, or manually crafted templates, which encode human bias. AMIS treats the scoring template as something to be learned alongside the attack.

The results: 88.0% attack success rate (ASR) on Claude-3.5-Haiku and 100.0% ASR on Claude-4-Sonnet across standard benchmarks, outperforming existing methods by substantial margins.

### The Bi-Level Structure

AMIS separates the optimization into two nested loops:

**Inner loop**: With a fixed scoring template, jailbreak prompts are iteratively refined using fine-grained, dense feedback. Unlike binary success signals that only say "it worked" or "it didn't," the inner loop receives information about *how close* each prompt came to eliciting the target behavior. This allows the optimization to make directional progress rather than random search.

**Outer loop**: The scoring template is updated using an ASR alignment score—a measure of how well the template's judgments correlate with ground-truth attack outcomes across a distribution of queries. Templates that systematically over- or undercount successes are corrected. The template gradually evolves to better reflect what actually constitutes a successful jailbreak, which in turn provides more accurate feedback to the inner loop.

The loops reinforce each other: a better scoring template generates more informative inner-loop signals, which produce stronger prompts, which provide richer data for template refinement. The optimization self-bootstraps toward increasingly calibrated attack capability.

### What 100% ASR on Claude-4-Sonnet Means

The headline number requires careful interpretation. A 100% attack success rate on JBB-Behaviors doesn't mean Claude-4-Sonnet is trivially unsafe or that any user can easily elicit harmful outputs. It means that with a sophisticated optimization framework running at scale, an adversary can find prompts that reliably satisfy the benchmark's criteria for policy-violating responses.

This distinction matters but shouldn't be used as reassurance. The benchmark categories in AdvBench and JBB-Behaviors represent the types of harmful behaviors that model developers specifically tried to prevent. Achieving 100% ASR against a frontier model that underwent extensive safety training is a meaningful result—it demonstrates that current alignment techniques create a learned boundary that optimization can find and cross, not a logical constraint that cannot be violated.

### The Circularity Exposed

AMIS reveals something important about the structure of the safety alignment problem. Current RLHF-based training uses human feedback and scoring models to define "aligned" behavior. Those scoring mechanisms are then used in evaluation to assess whether attacks succeed. Adversaries who optimize *against the scoring mechanism itself*—as AMIS does in its outer loop—gain a structural advantage that models trained only against a fixed definition of alignment cannot anticipate.

This is not merely a theoretical concern. It's an instance of Goodhart's Law operating at the level of safety evaluation: when the scoring template becomes a target, it ceases to be a reliable measure. AMIS makes this circularity explicit and quantifies how much it can be exploited.

For the safety research community, this points toward an important gap in current evaluation methodology. If automated scoring templates systematically underestimate attack success—because they haven't been calibrated against sophisticated adversaries—then the field may have been operating with inflated confidence in how robust current alignment methods actually are.

### Red-Teaming as Safety Infrastructure

The paper frames AMIS as a tool for proactive vulnerability discovery, not a blueprint for causing harm. This framing matters: automated red-teaming frameworks are dual-use, and their responsible deployment requires using them to find and patch vulnerabilities before attackers do.

The practical implication is that safety teams at AI labs need automated red-teaming tools that are at least as capable as AMIS—ideally more capable. If the gap between the best available red-teaming tools and deployed alignment methods grows too wide in the wrong direction, safety evaluations become unreliable even when conducted in good faith. AMIS raises the bar for what "comprehensive red-teaming" means.

### Connections to Embodied AI Safety

For systems that integrate language models into physical robots—the core subject of VLA safety research—the vulnerabilities AMIS identifies in pure language models are likely to reappear and potentially amplify. VLA models rely on natural language as their primary instruction interface. A sufficiently powerful jailbreak framework targeting the language component could, in principle, be used to issue adversarial instructions to a robot with physical consequences.

This connection between the LLM jailbreak literature and embodied AI safety is not hypothetical; it's the threat model underlying most VLA adversarial attack research. AMIS demonstrates that meta-optimized attacks can achieve near-perfect success rates against frontier language models—which is relevant context for anyone designing safety mechanisms for the systems that will act on those models' outputs.

The alignment vulnerabilities AMIS exposes are not unique to Claude or any specific model. They reflect structural properties of how current safety training works. Understanding them clearly is a prerequisite for building something more robust.

*Read the [full paper on arXiv](https://arxiv.org/abs/2511.01375) · [PDF](https://arxiv.org/pdf/2511.01375.pdf)*
