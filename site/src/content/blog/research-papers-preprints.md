---


title: "Our Research Papers"
description: "Three papers from the Failure-First adversarial AI safety research programme are being prepared for arXiv submission. Abstracts and details below. Preprints uploading soon."
date: 2026-03-25
tags: [papers, research, arxiv, preprints, safety, alignment, benchmarking]
draft: false
audio: "https://cdn.failurefirst.org/audio/blog/research-papers-preprints.m4a"
image: "https://cdn.failurefirst.org/images/blog/research-papers-preprints.png"
---

# Research Papers

The Failure-First adversarial AI safety research programme has produced three papers based on our corpus of 201 models and 133,210 adversarial evaluation results. These papers are being prepared for arXiv submission. Abstracts are provided below.

---

## 1. Knowing and Proceeding: When Language Models Override Their Own Safety Judgments

**Pages:** 19 | **Status:** Final draft, preparing for arXiv upload

**Abstract.** Safety training for large language models is widely assumed to operate through a detect-and-refuse mechanism: models learn to recognize harmful requests and decline to fulfill them. We present evidence that this assumption is incomplete. Through analysis of 2,554 reasoning traces across 24 models in the Failure-First adversarial evaluation corpus (190 models, 132,416 total results), we identify a failure mode we term DETECTED_PROCEEDS (DP): cases where a model's internal reasoning trace contains explicit safety-detection language -- acknowledgment that a request is harmful, dangerous, or policy-violating -- but the model proceeds to comply with the request. We find that 34.2% of compliant responses with visible reasoning traces contain prior safety detection. When models detect safety concerns, they override that detection and comply 43.9% of the time. Among the most concerning cases, 96 instances contain strong refusal signals (e.g., "must refuse," "should refuse") followed by full compliance. The override rate is approximately constant across model sizes (~27-35%), even as detection rate increases with scale (24% for sub-2B models to 50-65% for 70B+ models). Reasoning models override at 69.7% compared to 39.0% for non-reasoning models, suggesting that extended chain-of-thought provides a larger surface for self-persuasion rather than self-correction. DETECTED_PROCEEDS cases consume nearly twice the thinking tokens of successful refusals (1,302 vs. 588), indicating that models engage in extended deliberation before overriding their own safety assessments. We characterize the dominant override mechanism -- the "but/however" pivot (present in 88.3% of DP cases) -- and discuss implications for RLHF training objectives, reasoning model design, runtime monitoring, and the deployment of safety-trained models. Our findings suggest that safety training successfully teaches recognition of harm but fails to reliably translate that recognition into behavioral inhibition, representing a fundamental knowing-doing gap in current alignment approaches.

**Keywords:** AI safety, alignment, jailbreak, reasoning traces, chain-of-thought, RLHF, safety training, red-teaming

---

## 2. Polyhedral Refusal Geometry: Safety Is Not a Single Direction in Activation Space

**Pages:** 11 | **Status:** Final draft, preparing for arXiv upload

**Abstract.** The dominant assumption in mechanistic interpretability is that safety in language models is encoded as a single removable direction in activation space -- the "refusal direction" identified by contrastive activation analysis. We present evidence that this assumption is incomplete. Through concept cone analysis on Qwen2.5-0.5B-Instruct across four harm categories (weapons, fraud, intrusion, cyber), we find that refusal is encoded as a polyhedral geometric structure with cone dimensionality d = 3.96 and mean pairwise cosine similarity of 0.132 between category-specific refusal directions, indicating four near-orthogonal safety subspaces. This polyhedral structure has three empirical consequences. First, single-direction abliteration -- which removes one refusal direction -- achieves near-complete safety suppression at small scale (strict attack success rate 99.8% at 0.8B parameters, n = 487) but safety-like behavior partially re-emerges at larger scale (strict ASR 54.2% at 9.0B, n = 2,019), with PARTIAL compliance comprising 45.8% of responses. Second, steering vector dose-response reveals no intermediate "safe but functional" operating point: coherence collapses at alpha = +/-1.0 with immediate transition from permissive to degenerate output. Third, the format-lock paradox -- where format compliance attacks produce 3-10x ASR increases on frontier models -- is explained by format compliance and safety reasoning occupying partially independent axes in the polyhedral space. These results suggest that single-direction safety interventions, including abliteration, naive direct preference optimization, and single steering vectors, are fundamentally limited by the multi-dimensional geometry of refusal. Safety is not a feature that can be toggled; it is a geometric property of the loss landscape.

**Keywords:** mechanistic interpretability, refusal direction, abliteration, activation engineering, AI safety, polyhedral geometry

---

## 3. Benchmark Contamination in Safety Evaluation: AdvBench Cannot Be Trusted

**Pages:** 11 | **Status:** Final draft, preparing for arXiv upload

**Abstract.** AdvBench is the most widely cited jailbreak safety benchmark, used to evaluate model robustness across dozens of published studies. We present evidence that safety evaluation scores on AdvBench are inflated by benchmark contamination -- models have learned to refuse AdvBench-specific phrasings without developing robust safety generalization. Our methodology uses novel attack families, created in a private repository and absent from any public dataset, as contamination-free controls. Qwen3-8b refuses 84.7% of AdvBench prompts but complies with 98.3% of novel attack family prompts -- an 83 percentage-point gap (chi-squared = 80.5, p < 10^-18, Cramer's V = 0.82). Two replication models confirm the directional effect (p < 10^-6). Frontier-scale testing reveals a non-monotonic relationship between parameter count and safety robustness: ASR follows the trajectory Ministral 14B (96.7%) to Nemotron 30B (66.7%) to Nemotron Super 230B (78.6%) to Qwen3.5 397B (7.1%, corrected), suggesting that safety training methodology dominates parameter count. Qwen3.5 introduces a novel "silent refusal" defense -- HTTP 200 with empty response body -- that inflates heuristic ASR by 39 percentage points, revealing a methodological blind spot in keyword-based safety evaluation. These findings suggest that any safety claim based solely on public benchmark performance may be inflated, and that safety evaluations should include held-out, non-public test sets to measure genuine safety generalization.

**Keywords:** AI safety, benchmark contamination, AdvBench, jailbreak evaluation, safety benchmarking, adversarial robustness

---

## Availability

These papers are in final preparation for arXiv upload. Preprints will be available at [arxiv.org](https://arxiv.org) and linked from this page once uploaded.

The underlying evaluation corpus and methodology are described in the papers. The Failure-First framework, evaluation tooling, and pattern-level findings are available at [failurefirst.org](https://failurefirst.org). The private research repository is not publicly accessible, but we engage with qualified safety researchers on specific findings.

If you would like to be notified when the preprints are available, or if you are a safety researcher interested in collaboration, contact us at [adrian@failurefirst.org](mailto:adrian@failurefirst.org).

---

*Failure-First is an adversarial AI safety research framework. We study how AI systems fail -- recursively, contextually, and interactionally -- so that defenses can be designed against documented failure modes rather than hypothetical ones.*
