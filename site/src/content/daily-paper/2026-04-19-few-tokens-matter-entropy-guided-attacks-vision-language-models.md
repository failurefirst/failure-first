---

title: "Few Tokens Matter: Entropy Guided Attacks on Vision-Language Models"
description: "Adversarial attacks targeting high-entropy tokens in VLMs achieve severe semantic degradation with minimal perturbation budgets and transfer across architectures."
date: 2026-04-19
arxiv: "2512.21815"
authors: "Mengqi He, Xinyu Tian, Xin Shen, Jinhong Ni, Shu Zou, Zhaoyuan Yang, Jing Zhang"
paperType: "empirical"
tags: [adversarial-attacks, vision-language-models, entropy, transferability, robustness, embodied-ai]
draft: false
audio: "https://cdn.failurefirst.org/audio/daily-paper/2026-04-19-few-tokens-matter-entropy-guided-attacks-vision-language-models.m4a"
---

Vision-language models (VLMs) now sit at the perception core of many embodied AI systems — from robot arms parsing manipulation instructions to autonomous agents interpreting their environment. Robustness to small input perturbations is often assumed. This paper dismantles that assumption by identifying a structural vulnerability: the high-entropy tokens in a model's autoregressive generation process are disproportionately fragile, and attacking them selectively achieves outsized semantic damage at minimal cost.

### The Attack Surface Hidden in Uncertainty

During autoregressive text generation, a VLM produces a probability distribution over the next token at each step. Low-entropy positions are those where the model is highly confident — context strongly constrains the next token. High-entropy positions are those where the model genuinely hesitates, distributing probability mass across many candidate tokens.

The paper's core claim is that these high-entropy positions are *decision junctions*: small perturbations that shift which token is selected at these positions cascade into large semantic divergence in subsequent generation. Low-entropy positions, by contrast, are robust by construction — the model will predict the same token even under modest input noise.

This entropy-guided insight motivates a targeted adversarial attack: rather than optimizing perturbations against the entire output sequence, concentrate adversarial energy on shifting the high-entropy tokens specifically. The result is an attack that achieves significantly greater semantic degradation than token-agnostic baselines while using a smaller perturbation budget — and while maintaining visual imperceptibility.

### Transferability Across Architectures

The finding that most directly concerns embodied AI practitioners is the transferability result. Adversarial examples crafted against one VLM architecture degrade performance on architectures they were never optimized against. This cross-model transfer is not incidental — the paper argues it reflects a structural property of autoregressive generation itself. High-entropy positions arise from the underlying uncertainty of the prediction task, not from idiosyncrasies of a particular model's weights.

For deployed systems, transferability eliminates the "security through obscurity" assumption. An adversary with access to any open-source VLM can craft entropy-guided perturbations and expect them to transfer to proprietary or closed models used in production robotics and embodied agents. The adversary doesn't need to reverse-engineer or query the target system directly.

### Failure Modes for Embodied AI

Consider a VLA-controlled robot mid-task: a manipulation sequence where the robot must correctly identify an object, its orientation, and the appropriate grasp strategy. The VLM component parsing the scene provides semantic grounding for action selection. An adversarial patch placed in the scene — a sticker on an object, a modified texture — that targets the high-entropy tokens in the scene-description pathway can corrupt the parsed semantics while appearing innocuous to human observers.

The action consequences can be severe. An attacker who can reliably misdirect semantic parsing can drive the robot to apply wrong grasps, move to wrong locations, or ignore safety-critical scene features — all without triggering any visual anomaly detection based on image statistics.

This attack model is particularly dangerous because it requires no ongoing access to the system. The patch is crafted once (against surrogate models) and placed physically in the environment. The attack then operates passively whenever the robot operates in that environment.

### Evaluation Gaps in Current Robustness Testing

Standard robustness benchmarks for VLMs measure degradation under uniform noise (Gaussian, salt-and-pepper) or report clean accuracy on held-out distributions. Neither paradigm captures the structural vulnerability exposed here. A model can score well under conventional robustness evaluation while remaining highly susceptible to entropy-guided attacks that concentrate perturbation budget on the positions where it actually fails.

This represents a significant evaluation gap. Safety certifications for VLM-based embodied systems that rely on existing benchmarks may substantially underestimate real-world adversarial risk.

The paper evaluates several existing defenses — adversarial training, input preprocessing, and detection-based approaches — and finds they provide limited protection. Defense mechanisms specifically designed to address the entropy structure of VLM generation appear necessary but are not yet available.

### Toward Entropy-Aware Robustness

The entropy-guided attack points toward a research direction: *entropy-aware robustness*. Training objectives that explicitly penalize high-entropy variance at safety-critical generation positions, or architectural choices that flatten entropy profiles at decision-junction tokens, could reduce this attack surface at the source rather than patching it post-hoc.

For practitioners deploying VLMs in embodied AI pipelines, the immediate takeaway is that visual parsers should not be treated as trusted components for safety-critical decision paths. Defense-in-depth architectures — where safety-critical decisions involve redundant sensing modalities or independent verification — offer more robust postures than single-path VLM parsing.

The paper represents a valuable contribution to understanding the specific attack surfaces that arise from the architecture of autoregressive generation, a property that will persist across model generations until addressed at a structural level.

*Read the [full paper on arXiv](https://arxiv.org/abs/2512.21815) · [PDF](https://arxiv.org/pdf/2512.21815.pdf)*
