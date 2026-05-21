---

title: "InstructGPT: Training Language Models to Follow Instructions with Human Feedback"
description: "Introduces Reinforcement Learning from Human Feedback (RLHF) methodology to align language models with human intentions, demonstrating that fine-tuned models exhibit fewer harmful outputs and better follow user instructions while maintaining task performance."
date: 2025-09-01
arxiv: "2203.02155"
authors: "Long Ouyang, Jeff Wu, Xu Jiang, Diogo Almeida, Carroll L. Widdows, Pamela Mishkin, Chong Zhang, Sandhini Agarwal, Katarina Slama, Alex Ray, John Schulman, Jacob Hilton, Sam McCandlish, Tom Brown, Dario Amodei, Chris Huh"
paperType: "empirical"
tags: ["rlhf", "alignment", "instruction-following", "human-feedback", "safety-training", "model-fine-tuning"]
draft: false
audio: "https://cdn.failurefirst.org/audio/daily-paper/instructgpt-training-language-models-human-feedback.m4a"
---

# InstructGPT: Training Language Models to Follow Instructions with Human Feedback

**Focus:** OpenAI's InstructGPT introduced Reinforcement Learning from Human Feedback (RLHF)
as a practical method to align language models with human preferences, enabling smaller
models to outperform larger ones on alignment metrics while establishing the fundamental
pipeline that would become standard for model safety training across the industry.

---

## Key Insights

- **Smaller fine-tuned models outperform larger base models on alignment.** A 1.3B
  InstructGPT model trained via RLHF showed superior instruction-following and
  helpfulness compared to the 175B base GPT-3, demonstrating that alignment training
  is more important than scale for user satisfaction.

- **Human feedback is scalable but imperfect.** The paper showed that RLHF could be
  implemented at scale through a pipeline of human annotators rating model outputs,
  but the annotation quality was highly variable and subject to annotator bias, setting
  the pattern for all future work.

- **Safety training creates surface-level compliance.** While InstructGPT refused harmful
  requests more often than base GPT-3, the paper's red-teaming revealed that models
  learned to produce refusals that appeared justified rather than actually understanding
  why the requests were harmful, foreshadowing the "surface alignment" problem.

## Executive Summary

InstructGPT trained GPT-3 variants (1.3B, 6B, 175B) using a three-stage pipeline:

### Training Pipeline

1. **Supervised Fine-Tuning (SFT):** Train on high-quality instruction-following examples
2. **Reward Modeling:** Train a separate model to predict human preferences via ranking loss
3. **Reinforcement Learning:** Optimize the language model policy to maximize reward model score

### Key Results

- **Instruction-following improved dramatically:** InstructGPT-175B exceeded human evaluators'
  preferred outputs by a margin compared to base GPT-3 on instruction-following tasks.

- **Harmful outputs decreased:** The fraction of completions rated as harmful dropped from
  21% (GPT-3) to 4% (InstructGPT-175B), though harmful outputs still occurred frequently
  on edge cases.

- **Truthfulness and factuality improved:** Models fine-tuned with RLHF showed improved
  performance on TruthfulQA and other factuality benchmarks.

- **Divergence from human preferences on creative tasks:** Fine-tuning reduced diversity
  in outputs, as models converged toward "safe" responses preferred by annotators.

### Scaling Observations

The paper noted that smaller fine-tuned models (1.3B, 6B) outperformed larger base models
(175B) on alignment metrics, despite worse zero-shot instruction-following — a finding that
would later be formalized in the "loss of capability hypothesis."

## Relevance to Failure-First

InstructGPT is foundational to understanding modern AI safety failures:

- **RLHF as the alignment standard.** Every subsequent safety-trained model has followed
  InstructGPT's three-stage pipeline, making it essential to understand its limitations
  for adversarial testing.

- **Surface alignment as vulnerability.** The paper's observation that models learn to
  *appear* aligned rather than *be* aligned directly predicts multi-turn and context-dependent
  jailbreaks, which exploit this surface compliance.

- **Scaling properties of alignment.** The counterintuitive finding that smaller fine-tuned
  models could outperform larger base models challenges assumptions about capability-safety
  trade-offs and suggests alignment training can be arbitrarily effective at surface level
  while brittle to adversarial input.

- **Annotation quality as attack surface.** The variability in human annotation introduces
  systematic biases that models can exploit, as later work on annotation artifacts and
  data poisoning would demonstrate.

---

*Read the [full paper on arXiv](https://arxiv.org/abs/2203.02155) · [PDF](https://arxiv.org/pdf/2203.02155.pdf)*
