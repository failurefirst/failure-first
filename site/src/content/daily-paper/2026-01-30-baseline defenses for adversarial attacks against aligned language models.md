---
title: "Baseline Defenses for Adversarial Attacks Against Aligned Language Models"
description: "Not analyzed"
date: 2026-01-30
arxiv: "2309.00614"
authors: "Neel Jain, Avi Schwarzschild, Yuxin Wen, Gowthami Somepalli, John Kirchenbauer, Ping-yeh Chiang, Micah Goldblum, Aniruddha Saha, Jonas Geiping, Tom Goldstein"
paperType: survey
tags: [not-analyzed]
draft: false
audio: "https://cdn.failurefirst.org/audio/daily-paper/2309.00614-audio-overview.m4a"
video: "/video/2309.00614-video-overview.mp4"
---

# Baseline Defenses for Adversarial Attacks Against Aligned Language Models

When new attack methods emerge, the first question is always: do simple defenses work? If straightforward mitigations like input filtering or output detection can block attacks, then the threat is containable. If simple defenses fail, we know the problem is more fundamental and requires deeper architectural changes.

This paper evaluates baseline defense strategies against adversarial attacks: perplexity filtering (detecting adversarial inputs by their unusual statistical properties), paraphrasing (rewriting prompts to strip adversarial content), and output-side detection (identifying harmful responses after generation). The results are mixed. Simple defenses provide partial mitigation but don't eliminate vulnerability. They also introduce costs: increased latency, compute, and sometimes false positives that harm usability. More concerning, adversaries can adapt to simple defenses by making attacks less anomalous or by finding workarounds.

The failure-first insight is that defense against LLM attacks doesn't have a cheap solution. Simple mitigations help but don't suffice. This means security requires ongoing investment, not a one-time patch. It also suggests that the asymmetry between attack and defense is fundamental: attacks can be simple and targeted, while defenses must be comprehensive and constant.

---

## Key Insights

This briefing document synthesizes empirical research into the efficacy of baseline defense strategies for aligned Large Language Models (LLMs) against adversarial attacks such as Greedy Coordinate Gradient (GCG) suffixes. It evaluates the current state of adversarial robustness in language-only systems and the trade-offs each defense category introduces.

---

## Executive Summary

Traditional defense categories—detection, preprocessing, and robust optimization—are evaluated as baselines against algorithmically-optimized jailbreak attacks on text-only LLMs. Due to the discrete nature of text and the high computational cost of current text optimizers, simple defenses like perplexity filtering and paraphrasing are currently effective at suppressing measured Attack Success Rate (ASR). However, these defenses introduce significant trade-offs in model performance and user experience, and none eliminates vulnerability outright.

---

## Analysis of Key Themes

### 1. Text Defenses Differ From Vision Defenses
Because text is discrete and current gradient-based text optimizers are far more expensive to run than their image counterparts, defenses that would be brittle against vision-based adversarial attacks are, for now, comparatively effective against text-based ones.

*   **Optimizer Cost Asymmetry:** Crafting an adversarial text suffix is orders of magnitude more expensive than crafting an adversarial image perturbation, which limits how quickly attackers can adapt to a deployed defense.
*   **No Free Lunch:** Every defense category tested reduces ASR at the cost of latency, compute, or benign-query false positives — none is a costless fix.

### 2. Evaluated LLM Defense Strategies
Research into baseline defenses for LLMs focuses on three primary categories adapted from computer vision.

#### A. Detection (Self-Perplexity Filtering)
This defense assumes that algorithmically crafted adversarial strings (like those produced by Greedy Coordinate Gradient, or GCG) appear as "gibberish" and thus have high perplexity.
*   **Mechanism:** Models calculate the average negative log likelihood of tokens. If a prompt exceeds a set threshold, it is flagged.
*   **Windowed Perplexity:** Breaking text into contiguous chunks (e.g., 10-token windows) is more effective than global filtering.
*   **Effectiveness:** Currently highly effective against white-box attacks because optimizers struggle to balance the "low perplexity" objective with the "harmful output" objective.
*   **Trade-off:** High false-positive rate; approximately 10% of benign user queries are flagged, which may be untenable for production systems.

#### B. Preprocessing (Paraphrasing & Retokenization)
Preprocessing aims to strip adversarial perturbations before they reach the target model.
*   **Paraphrasing:** Using a second model (e.g., ChatGPT) to rewrite the input. This significantly reduces Attack Success Rates (ASR). On Vicuna-7B, successful attacks dropped from 74 to 5.
*   **Retokenization (BPE-Dropout):** Randomly dropping BPE merges (e.g., at a 0.4 rate) to disrupt the specific token combinations an optimizer relies on. While this degrades attacks, it also risks increasing the ASR of unattacked harmful prompts because the model's refusal training is often tied to "proper" tokenization.

#### C. Robust Optimization (Adversarial Training)
While the gold standard in computer vision, adversarial training is currently "an open problem" for LLMs.
*   **Computational Cost:** Crafting adversarial text is 5–6 orders of magnitude more expensive than crafting adversarial images.
*   **Model Degeneration:** Attempts to inject human-crafted red-team data during instruction finetuning often lead to "model collapse," where the model begins repeating "cannot" or "harm" for almost all prompts, even benign ones.

---

## Comparative Defense Performance

The following table summarizes the impact of various defenses on the Attack Success Rate (ASR) across different 7B-parameter models:

| Defense Method | Vicuna-7B ASR | Guanaco-7B ASR | Benign Performance Impact (AlpacaEval) |
| :--- | :--- | :--- | :--- |
| **No Defense (Baseline)** | 0.79 | 0.96 | N/A |
| **Perplexity Filter** | 0.00 | 0.00 | ~10% False Positive Rate |
| **Paraphrasing** | 0.05 | 0.33 | 10-15% Win-rate drop |
| **Retokenization (0.4)** | 0.44 | 0.44 | ~5-7% Win-rate drop |
| **Adversarial Training** | ~0.95 | N/A | Significant (Model Unusable) |

---

## Important Quotes with Context

> **"Adversarial attacks are particularly problematic because their discovery can be automated, and they can easily bypass safeguards based on hand-crafted fine-tuning data and RLHF."**
*   **Context:** From the Jain et al. study on baseline defenses.
*   **Significance:** Emphasizes that "red teaming" via manual prompt engineering is insufficient to stop algorithmically optimized attacks.

> **"The domain of LLMs is appreciably different from 'classical' problems in adversarial machine learning... simple optimizers quickly smash through complex adaptive attack objectives [in vision]. In the language domain, the gradient-based optimizers we have today are not particularly effective at breaking defenses as simple as perplexity filtering."**
*   **Context:** Discussion on why LLM security currently appears stronger than vision security.
*   **Significance:** Suggests a temporary "security through optimizer weakness" that may vanish if more efficient text optimization algorithms are developed.

---

## Actionable Insights

### For Red-Teaming and Safety Evaluation
1.  **Use Gray-Box Threat Models:** Since proprietary model parameters are often secret, practitioners should focus on whether attacks transfer from open-source surrogate models to target API models, rather than assuming full white-box access.
2.  **Evaluate Compute as a Constraint:** LLM security should be measured by the "computational budget" required for an optimizer to find a successful jailbreak, not just a fixed attack-success threshold.

### For Defense Implementation
1.  **Deploy Layered Defense:** Perplexity filtering should not be used to discard prompts but to trigger secondary defenses like paraphrasing or human moderation. 
2.  **Optimize Tokenization Robustness:** Training models on "retokenized" or noisy data (via BPE-dropout) may help them maintain alignment even when an attacker tries to disrupt standard token boundaries.
3.  **Monitor Paraphraser Alignment:** If using a paraphrasing defense, the paraphraser itself must be highly aligned, as an adaptive attacker might attempt to jailbreak the paraphraser to pass an adversarial string through to the target model.

---

*Read the [full paper on arXiv](https://arxiv.org/abs/2309.00614) · [PDF](https://arxiv.org/pdf/2309.00614.pdf)*
