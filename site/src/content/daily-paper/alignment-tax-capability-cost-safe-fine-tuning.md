---


title: "The Alignment Tax: An Open Question for Embodied AI Economics"
description: "An F41LUR3-F1R57 position piece asking whether a capability cost of safety training — if real — would create economic pressure against safety in embodied systems. No quantitative claims are made; we have not measured a capability cost ourselves."
date: 2026-05-09
paperType: "position"
tags: ["alignment-cost", "safety-capability-tradeoff", "embodied-ai", "economic-incentives", "open-question"]
draft: false
audio: "https://cdn.failurefirst.org/audio/daily-paper/alignment-tax-capability-cost-safe-fine-tuning.m4a"
image: "https://cdn.failurefirst.org/images/daily-paper/alignment-tax-capability-cost-safe-fine-tuning.png"
---

# The Alignment Tax: An Open Question for Embodied AI Economics

*This is an F41LUR3-F1R57 position piece, not a summary of an external paper. An earlier version of this post attributed a set of specific capability-loss statistics to a fabricated author byline; see the editorial note at the end.*

"Alignment tax" is the informal name for a claim discussed in the AI safety literature: that safety training (RLHF, safety fine-tuning) may reduce a model's capability or helpfulness on legitimate tasks, alongside its intended effect of reducing harmful outputs. This is a real, actively studied question — see for example Lin et al., ["Mitigating the Alignment Tax of RLHF"](https://arxiv.org/abs/2309.06256) (arXiv:2309.06256) — but the *size* of any such tax is contested and task-dependent in the literature, and we have not measured it ourselves. We are not citing a magnitude here, and the paper above is cited only as evidence the concept is studied, not as a source for any number in this post.

## The Question We Think Is Underasked

Most alignment-tax discussion is framed around chat and text-generation models: does safety training cost benchmark points, helpfulness scores, or creative-output quality? We think there is a distinct, under-discussed version of the question for embodied systems: **if a capability cost from safety training exists at all, would it be more economically consequential for embodied agents than for chat models?**

Our reasoning for why this might be true, not a finding:

- **Embodied capability is often more directly monetised than chat helpfulness.** A warehouse-picking robot's throughput or a delivery robot's completion rate maps to revenue more tightly than a chatbot's helpfulness score maps to subscription retention. If safety constraints reduce throughput, the commercial pressure to loosen them plausibly bites harder and faster.
- **Safety failures in embodied systems are physical, not just reputational.** This cuts the other way from the "economic pressure against safety" framing — a robot that harms a person or damages property creates liability exposure that a refused chat message does not. Whether the capability-cost pressure or the liability-cost pressure dominates is, as far as we know, unstudied.
- **We have no benchmark for "capability cost of safety training" in embodied action space.** Unlike MMLU-style text benchmarks, there is no widely agreed metric for what a safety-constrained manipulation or navigation policy "loses" relative to an unconstrained one. Without that measurement, any claim about the size of an embodied alignment tax — ours or anyone else's — is speculation.

## What We Are Not Claiming

We are not asserting that safety training measurably degrades embodied capability by any specific amount, that an economic incentive against embodied safety training has been demonstrated, or that any "dose-response" relationship between safety-training intensity and capability loss has been measured — for embodied systems or otherwise. If this repository's own benchmark corpus produces evidence bearing on this question, it will be reported separately with a citation to `docs/CANONICAL_METRICS.md`, not folded back into this post.

## Why We Think the Question Still Matters

If a capability cost turns out to be real and economically significant for embodied deployment, it argues for exactly the kind of external pressure — safety certification, insurance requirements, regulatory floors — that removes the "compete by cutting safety" option from the table, rather than leaving individual deployers to weigh capability against safety unilaterally. That's a normative argument, not an empirical one, and we present it as such.

---

*Editorial note: this post previously presented itself as a summary of an empirical paper, "The Alignment Tax: Safety Training Reduces Model Capability and User Satisfaction," attributed to a fabricated author byline — Ping Qi, Jing Jiang, Youhua Zhang, Xiaofei Ma, Dan Roth — none of whom wrote any such paper, along with a fabricated publication date and a full set of invented quantitative results (benchmark percentage-point losses, an economic-value estimate, a "dose-response" table). No such paper, authorship, or dataset exists — see [issue #972](https://github.com/adrianwedd/failure-first-embodied-ai/issues/972). Every fabricated claim and the entire invented byline have been removed; none were re-sourced to a real paper to preserve them. What remains is an honest, unsourced F41LUR3-F1R57 position piece asking an open question, with no quantitative claims of our own.*
