---

title: "Beyond I'm Sorry, I Can't: Dissecting Large Language Model Refusal"
description: "Using sparse autoencoders to mechanistically identify the neural features that drive safety refusal in instruction-tuned LLMs, revealing layered redundant defenses and new pathways for targeted safety auditing."
date: 2026-04-22
arxiv: "2509.09708"
authors: "Nirmalendu Prakash, Yeo Wei Jie, Amir Abdullah, Ranjan Satapathy, Erik Cambria, Roy Ka Wei Lee"
paperType: "empirical"
tags: [llm-safety, refusal-mechanisms, sparse-autoencoders, mechanistic-interpretability, jailbreak, safety-alignment, neural-features]
draft: false
audio: "https://cdn.failurefirst.org/audio/daily-paper/2026-04-22-beyond-im-sorry-i-cant-dissecting-llm-refusal.m4a"
---

When an instruction-tuned language model declines to help with a harmful request, what is actually happening inside the network? The conventional answer — "it was trained to refuse" — explains the outcome without explaining the mechanism. This paper by Prakash et al. attempts to open that black box, using sparse autoencoders to identify the specific neural features responsible for refusal behavior in Gemma-2-2B-IT and LLaMA-3.1-8B-IT. The findings reveal that safety is not a monolithic property but an architecturally layered system of redundant defenses.

### Why Mechanism Matters for Safety

The gap between behavioral and mechanistic understanding of safety is not academic. A model that refuses harmful prompts because of superficial pattern matching in token space is vulnerable in ways that a model with robust, distributed safety representations is not. Jailbreaks routinely exploit this gap — encoding harmful intent in unusual formats, indirect framings, or multi-turn setups that bypass surface-level detection while the underlying harmful capability remains intact.

Understanding where and how refusal is implemented in a model's internals enables more precise safety audits: not just "does this model refuse?" but "which components drive refusal, and how stable are they under perturbation?" The authors frame this as essential groundwork for evaluating whether safety behaviors are genuinely robust or merely performing robustness at the behavioral level.

### Sparse Autoencoders as Interpretability Tools

The core technical approach uses sparse autoencoders (SAEs) trained on the model's residual stream activations. SAEs learn a dictionary of interpretable features — directions in activation space that correspond to identifiable concepts — by encouraging sparse activation patterns. Applied to safety-relevant prompts, they allow the researchers to ask: which features activate when the model processes a harmful instruction and decides to refuse?

The methodology proceeds in three stages. First, the authors identify a "refusal direction" — a linear subspace in activation space that distinguishes harmful prompts that trigger refusal from benign prompts that do not. Second, they apply greedy filtering to reduce this space to the smallest set of features that preserves predictive power. Third, they use factorization machines to discover nonlinear interactions among these features, capturing cases where no single feature alone explains refusal but combinations do.

This three-stage pipeline is more rigorous than earlier approaches that simply probe for refusal directions, because it accounts for feature redundancy and interaction without assuming linearity.

### Layered Defenses and Redundant Features

The most significant finding is structural: refusal is implemented through layers of redundant features, not a single bottleneck. The authors observe features that activate only after earlier features have been suppressed — a cascading architecture where disabling one safety signal causes a backup to engage. This pattern resembles defense-in-depth, but arising from training dynamics rather than deliberate engineering.

For practitioners thinking about jailbreak resistance, this is an important result. It suggests that attacks which identify and suppress a single refusal direction — a technique used by several well-known jailbreaks — may activate subsequent redundant features rather than fully bypassing safety. Conversely, attacks that systematically target multiple features in sequence, or that exploit the nonlinear interactions between them, may be more effective. The paper does not develop such attacks, but the mechanistic map it provides is clearly relevant to understanding why some jailbreaks succeed and others do not.

### Safety Auditing Applications

The authors propose that their feature identification methodology enables "fine-grained auditing and targeted intervention" in ways that behavioral testing cannot. Rather than probing a model with thousands of adversarial prompts and recording outcomes, safety auditors could directly inspect whether key refusal features are present, properly connected, and stable to perturbation. This shifts safety evaluation from black-box behavioral testing toward structural auditing of the safety implementation itself.

This has practical implications for alignment research. Models trained with different RLHF recipes, fine-tuning approaches, or constitutional AI variants may implement refusal through quite different feature structures. Comparing these structures mechanistically — rather than only through benchmark performance — could reveal which training approaches produce more robust representations, not just better average refusal rates.

### Connections to Embodied and Agentic Safety

The methodology developed here for LLM refusal is directly extensible to agentic systems, including VLA models. In embodied contexts, "refusal" is not just declining to answer but declining to execute a dangerous action. Understanding which internal representations mediate that decision in vision-language-action models — and whether they are stable under visual perturbation, distribution shift, or adversarial patch attacks — is an open problem with high stakes. The sparse autoencoder approach applied here could, in principle, be adapted to audit the action-gating mechanisms in VLA models.

There is also a failure mode connection: the layered redundancy found here may not be present in smaller, distilled, or fine-tuned models where safety training was less extensive. A model that passes behavioral safety benchmarks but has lost its structural redundancy may be far more vulnerable to targeted attacks than its benchmark scores suggest.

### Limitations

The study is limited to two relatively small open-source models. Whether the layered redundancy structure generalizes to larger proprietary systems — where safety training is more extensive and potentially better engineered — is unknown. The nonlinear interaction analysis using factorization machines is also an approximation; deeper nonlinearities may require more expressive tools. Finally, the paper focuses on identifying features rather than verifying causal claims with ablation experiments at scale.

These are tractable limitations for follow-up work, and the methodological contribution — the three-stage SAE pipeline for mechanistic safety auditing — stands independently.

*Read the [full paper on arXiv](https://arxiv.org/abs/2509.09708) · [PDF](https://arxiv.org/pdf/2509.09708.pdf)*
