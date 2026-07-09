---
title: "AI Safety Daily — June 2, 2026"
description: "Computer-use agents miss planning-time safety in long-horizon tasks; frontier model safety profiles diverge by modality; refusal collapses at the reasoning cliff in reasoning models."
date: 2026-06-02
tags: ["ai-safety-daily", "agentic-safety", "frontier-models", "mechanistic-interpretability", "jailbreak-evaluation"]
draft: false
---

## AI Safety Research Digest — June 2, 2026

> *Computer-use agents fail safety checks mid-plan, frontier model safety diverges by modality, and a mechanistic cliff in reasoning models drops refusal intent just before output.*

### Key Findings

- **Computer-use agents fail planning-time safety in long-horizon tasks.** LPS-Bench (arXiv:2602.03255) evaluates MCP-based computer-use agents across extended task sequences under both benign and adversarial conditions, finding significant safety-awareness deficiencies: agents plan unsafe intermediate steps that would be flagged in isolation but pass undetected within a longer horizon. Retrieval-augmented safety checks and multi-agent oversight partially recover performance but do not eliminate the structural gap.

- **Frontier model safety profiles diverge by modality and evaluation domain.** A comparative safety report on GPT-5.2, Gemini 3 Pro, Qwen3-VL, Doubao 1.8, Grok 4.1 Fast, and Seedream 4.5 (arXiv:2601.10527) finds no consistent safety leader: models performing well on compliance metrics fail on adversarial multimodal inputs, and vice versa. The result challenges using any single benchmark score as a proxy for overall safety posture.

- **Multi-turn dialogue degrades safety alignment systematically.** SafeDialBench (arXiv:2502.11090) introduces a fine-grained benchmark covering diverse jailbreak strategies across multi-turn conversations, finding that most models maintaining safety in single-turn settings show measurable degradation across extended dialogue. Hierarchical safety taxonomies reveal that degradation rates differ significantly by harm category, with some categories robust and others nearly fully exploitable by turn three.

- **Refusal intent drops sharply at the reasoning cliff.** "Refusal Falls off a Cliff" (arXiv:2510.06036) identifies a mechanistic failure mode in large reasoning models where the internal representation of refusal intent peaks during the reasoning chain then collapses before output generation. Targeted intervention on specific attention heads restores safety without degrading reasoning quality, offering a concrete implementation path for reasoning-model alignment.

- **Professional-domain agents expose systematic safety gaps under task pressure.** SafePro (arXiv:2601.06663) benchmarks LLM-based agents on complex professional tasks — legal, medical, financial — finding that task complexity and professional framing significantly increase unsafe behaviour rates. Targeted safety mitigations reduce risks but introduce performance trade-offs that vary by domain, suggesting domain-specific calibration is necessary rather than a single safety configuration.

### Implications for Embodied AI

The LPS-Bench result refines the failure model that motivates the episode corpus. Prior work focused on per-turn refusal; long-horizon planning safety adds a structural failure mode where unsafe intermediate actions are assembled correctly into an unsafe plan even when no individual action triggers a safety check. This directly extends the IS-Bench finding from June 1 — local correction without global propagation — and the two results together suggest episode designs should include scenarios where each individual action is marginally safe but the assembled plan is not.

The refusal cliff in reasoning models has direct implications for grading generation traces. If reasoning models suppress their own refusal intent at the final output step, graders treating the complete response as the safety signal will systematically underdetect failures that are visible in the intermediate reasoning chain. This argues for updating FLIP grader configurations for reasoning models to score over the chain, not only the terminal output.

The modality divergence in frontier safety profiles reinforces the corpus design decision to evaluate across text, vision, and embodied inputs rather than optimising for a single modality. A model that scores well on text-only benchmarks may still fail on multimodal adversarial inputs of the kind relevant to the PiCar-X visual pipeline and any camera-equipped embodied platform.
