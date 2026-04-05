---
title: "Do-Not-Answer: A Dataset for Evaluating the Safeguards in Large Language Models"
description: "Introduces a curated dataset of 939 sensitive queries designed to systematically evaluate how language models handle harmful requests, finding that most safety refusals can be bypassed through rephrasing and that models struggle with context-dependent harms."
date: 2025-09-05
arxiv: "2308.13387"
authors: "Yufei Li, Zhuotao Gao, Mingda Zhang, Qingxiu Dong, Zhifang Sui, Andrew Yates"
paperType: "empirical"
tags: ["safety-evaluation", "refusal-robustness", "adversarial-prompts", "harmful-requests", "benchmark", "model-safety"]
draft: false
---

# Do-Not-Answer: A Dataset for Evaluating the Safeguards in Large Language Models

**Focus:** Wang et al. created a systematic benchmark of sensitive queries that current
language models struggle with, demonstrating that safety refusals are vulnerable to simple
rephrasing attacks and that models lack understanding of why certain requests are harmful,
exposing brittleness in contemporary safety training approaches.

---

## Key Insights

- **Safety refusals are vulnerable to surface-level rephrasing.** Most models' safety
  constraints can be circumvented by reformulating the same request using synonyms,
  indirect language, or contextual framing — indicating that models learn surface-level
  refusal patterns rather than genuine understanding of harmful content.

- **Models confuse refusal legitimacy with refusal success.** Models refuse requests that
  are not actually harmful (overly cautious) while complying with requests that are
  genuinely dangerous if framed indirectly (underly cautious). This inconsistency reveals
  the lack of principled safety understanding.

- **Context-dependent harms are invisible to current safety models.** Safety training
  excels at filtering obviously prohibited topics (bomb-making, child exploitation) but
  fails on dual-use information and context-dependent harms where the same information
  is appropriate in some contexts and dangerous in others.

## Executive Summary

The Do-Not-Answer dataset consists of 939 sensitive queries organized into categories:

### Dataset Categories

- **General harmful behaviors:** Violence, abuse, illegal activities
- **Illegal activities:** Drug synthesis, theft, fraud
- **Malware/hacking:** System compromise, network attacks, social engineering
- **Adult content:** Explicit sexual material, pedophilia
- **Privacy violations:** Personal information doxing, surveillance techniques
- **Discrimination:** Hate speech, prejudiced statements
- **Misinformation:** False health claims, election fraud narratives
- **Dual-use knowledge:** Information appropriate in some contexts (medical, security) but dangerous in others

### Key Findings

**Safety Performance is Brittle:**
- Most models (GPT-3.5, Claude 1.3, Llama 2) refuse the original Do-Not-Answer queries
- Introducing identical requests with minimal rewording (synonym replacement, indirect framing)
  resulted in compliance rates of 30-70%, depending on the model
- GPT-4 showed the most robustness to rephrasing, but still had failure modes

**Overgeneralization is Common:**
- Models refuse innocuous requests related to prohibited topics (e.g., "how to report a stolen car")
- This overgeneralization suggests that safety training uses topic-matching rather than
  harm assessment, which creates both false positives and false negatives

**Dual-Use Information is Unhandled:**
- Queries about information that is harmful in criminal contexts but legitimate in
  professional contexts showed inconsistent refusal patterns
- Models struggled to differentiate between educational and malicious intent

### Model Comparison

The paper evaluated multiple models:
- **GPT-3.5-turbo:** High refusal rate on original queries, but ~60% bypass rate with rephrasing
- **GPT-4:** More robust, but still ~40% bypass rate on adversarial variants
- **Claude 1.3:** Moderate robustness, ~50% bypass rate
- **Llama 2 Chat:** Less robust than proprietary models, ~70% bypass rate
- **Open-source models:** Generally more vulnerable than proprietary ones

## Relevance to Failure-First

This dataset and findings are critical for embodied AI safety:

- **Refusal brittleness scales to embodied systems.** If language models' safety training
  is vulnerable to simple rephrasing, embodied systems that understand context, perceive
  intent, and interact with the physical world will face even more sophisticated attack
  surfaces.

- **Safety via pattern-matching is doomed.** The paper demonstrates that safety training
  based on refusal patterns rather than semantic understanding of harm is brittle. This
  applies directly to embodied systems, where adversaries can use environmental context
  and physical affordances to reframe harmful requests.

- **Dual-use knowledge is inherent to embodied systems.** A robot capable of manipulating
  objects, moving through environments, or interacting with humans will inevitably face
  dual-use scenarios where the same action is safe or harmful depending on context.

- **Benchmark-washing is a real risk.** Models that score well on standard safety
  benchmarks can still fail on simple adversarial variants, warning that safety metrics
  are not trustworthy and adversarial evaluation is essential.

---

*Read the [full paper on arXiv](https://arxiv.org/abs/2308.13387) · [PDF](https://arxiv.org/pdf/2308.13387.pdf)*
