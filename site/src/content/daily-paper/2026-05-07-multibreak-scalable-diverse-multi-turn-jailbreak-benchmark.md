---

title: "MultiBreak: A Scalable and Diverse Multi-turn Jailbreak Benchmark for Evaluating LLM Safety"
description: "An active-learning pipeline that builds 10,389 multi-turn adversarial prompts spanning 2,665 distinct harmful intents — achieving 54% higher attack success rates than prior benchmarks on DeepSeek-R1-7B."
date: 2026-05-07
arxiv: "2605.01687"
authors: "Jialin Song, Xiaodong Liu, Weiwei Yang, Wuyang Chen, Mingqian Feng, Xuekai Zhu, Jianfeng Gao"
paperType: "empirical"
tags: [jailbreak, multi-turn, benchmark, attack-success-rate, evaluation, red-teaming]
audio: "https://cdn.failurefirst.org/audio/daily-paper/2605.01687-audio-overview.m4a"
draft: false
image: "https://cdn.failurefirst.org/images/daily-paper/2026-05-07-multibreak-scalable-diverse-multi-turn-jailbreak-benchmark.png"
---

The field of jailbreak evaluation has a diversity problem. Most benchmarks — even well-constructed ones — sample from a constrained distribution of attack templates. Adversaries do not. MultiBreak addresses this by building a benchmark from the opposite direction: start from the full space of harmful intents, generate high-quality multi-turn attack trajectories, and use active learning to ensure the resulting dataset is both large and genuinely diverse.

### Why Multi-Turn Changes Everything

Single-turn jailbreak evaluation is simpler, but it systematically underestimates the real attack surface. Multi-turn attacks exploit something single-turn attacks cannot: the conversational context window and the model's tendency toward in-context consistency. A model that correctly refuses a harmful request at turn one can be nudged toward compliance at turn seven through gradual context accumulation, role solidification, and the progressive erosion of refusal signals that safety training embeds.

MultiBreak formalises this intuition empirically. The benchmark contains 10,389 adversarial prompts across 2,665 distinct harmful intents — a scale and diversity that dwarfs existing multi-turn datasets. Crucially, it achieves up to **54.0% higher attack success rate than the second-best dataset on DeepSeek-R1-7B** and 34.6% higher on GPT-4.1-mini. These are not marginal improvements. They suggest that current multi-turn evaluation benchmarks are substantially underestimating model vulnerability.

### The Active Learning Pipeline

The key architectural innovation is the generator training loop. Rather than sampling attacks from a fixed template distribution, MultiBreak trains a generator to produce stronger candidates and iteratively refines it through uncertainty-based filtering: prompts that the model confidently refuses or confidently complies with are less informative than those that sit near the decision boundary. Concentrating training effort on boundary-proximate cases produces a generator that specialises in the exact attack trajectories most likely to expose safety gaps.

This approach has a structural advantage over static datasets: it naturally tracks the attack frontier as models improve. A static benchmark becomes stale as soon as safety training advances; an active learning pipeline can be re-run against a new model to identify the new decision boundary.

### Implications for Safety Evaluation Infrastructure

For the AI safety community, the 54% ASR improvement raises an uncomfortable question: if current multi-turn benchmarks are this far below the true attack frontier, what does that imply for the safety evaluations that informed deployment decisions? The paper does not make this argument explicitly, but the data is difficult to interpret otherwise. Safety evaluations that use narrow benchmark distributions may be certifying models against a threat model that adversaries already know how to exceed.

The benchmark also reveals something about **harmful intent diversity** as an evaluation dimension. The 2,665 distinct intents span topics that prior benchmarks collapsed into broad categories. Finer-grained intent coverage exposes capability asymmetries: some models are robust to a high-level harmful category in aggregate but have specific sub-intents where their refusal rate collapses. Aggregate ASR statistics mask these intra-category vulnerabilities.

### Connecting to Failure-First Research

The F41LUR3-F1R57 research programme has documented this problem in the context of single-turn evaluations: keyword-based classifiers, narrow benchmark sampling, and aggregate success-rate statistics all underestimate failure rates in ways that are predictable from the evaluation design. MultiBreak extends this critique to the multi-turn setting and provides a concrete tool for addressing it.

For embodied AI red-teaming in particular, multi-turn dynamics are not a secondary concern — they are the primary one. A robot agent that receives instructions over multiple turns in a human-robot collaboration setting is precisely the multi-turn scenario that single-turn safety training fails to prepare for. The attack trajectories in MultiBreak are a direct analogue of the instruction sequences an adversarial human collaborator might use to redirect a physical agent.

*Read the [full paper on arXiv](https://arxiv.org/abs/2605.01687) · [PDF](https://arxiv.org/pdf/2605.01687.pdf)*
