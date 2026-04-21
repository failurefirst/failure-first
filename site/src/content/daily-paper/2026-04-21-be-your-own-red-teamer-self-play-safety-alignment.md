---
title: "Be Your Own Red Teamer: Safety Alignment via Self-Play and Reflective Experience Replay"
description: "A self-play reinforcement learning framework where an LLM simultaneously generates adversarial jailbreak attacks and strengthens its own defenses, reducing attack success rates without external red teams."
date: 2026-04-21
arxiv: "2601.10589"
authors: "Hao Wang, Yanting Wang, Hao Li, Rui Li, Lei Sha"
paperType: "methods"
tags: ["safety-alignment", "red-teaming", "self-play", "reinforcement-learning", "jailbreak-defense", "adversarial-training", "llm-safety"]
draft: false
---

# Be Your Own Red Teamer: Safety Alignment via Self-Play and Reflective Experience Replay

**Focus:** Wang et al. propose a self-play reinforcement learning framework in which a single LLM acts as both attacker and defender — generating adversarial jailbreak prompts against itself, then updating its safety alignment in response. The system uses reflective experience replay to build on past attack-defense interactions, and Upper Confidence Bound (UCB) sampling to explore novel attack strategies rather than cycling through the same known exploits. The result is a scalable, autonomous red-teaming loop that does not require human red team labor or a separate adversarial model.

The core insight is deceptively simple: if you want a model to be robust to attacks it has not seen, train it on attacks it generates for itself. This flips the standard red-team pipeline — where attacks are exogenous, produced by humans or separate models — into an endogenous loop where the model's own creative capacity is turned toward discovering its own vulnerabilities.

---

### Key Findings

- **Self-generated attacks are diverse and effective.** The self-play loop discovers novel jailbreak strategies beyond those in standard benchmarks, suggesting the model's latent knowledge of persuasion and manipulation can be usefully exploited for its own alignment.
- **Reflective experience replay prevents strategy stagnation.** Without replay, the attacker component converges on a small set of successful prompts and stops exploring. Replay over past attack-defense outcomes maintains diversity and progressively hardens the defender.
- **UCB sampling meaningfully improves attack diversity.** Treating attack strategy selection as a multi-armed bandit problem and applying UCB encourages exploration of underutilized attack vectors, producing a richer training distribution for the defender.

### Executive Summary

Standard safety alignment pipelines — RLHF, constitutional AI, supervised fine-tuning on refusals — are trained on fixed datasets of harmful prompts and safe responses. The problem is that the attack space is not fixed: new jailbreak strategies emerge continuously, and a model aligned against last month's attacks may be vulnerable to next month's variants.

Red-teaming is the standard response: human experts or adversarial models generate novel attacks to probe the aligned model. But this is expensive, slow, and bottlenecked by human creativity and adversarial model quality.

This paper proposes closing the loop: train the model to red-team itself.

**The self-play framework operates in three phases:**

1. **Attack generation:** The model, in attacker mode, generates jailbreak prompts targeting a specific harmful behavior category. It draws on its own knowledge of persuasion, roleplay, indirect framing, and context manipulation — the same capabilities that make LLMs useful for legitimate tasks.

2. **Defense evaluation:** The generated prompts are passed to the model in defender mode. Attack success is measured by whether the defender produces harmful content. The outcome — successful jailbreak or successful refusal — is recorded with full context.

3. **Reflective experience replay:** Past attack-defense interactions are replayed with explicit reflection: the model reasons about *why* a given attack succeeded or failed, and what the defender should do differently. This reflective step transforms raw experience into transferable safety knowledge.

**UCB sampling** governs which attack strategy categories the attacker explores at each step, balancing exploitation (refining successful attack types) against exploration (probing underutilized vectors). This prevents the common failure mode where adversarial training converges on a narrow attack distribution that does not generalize.

**Performance summary across evaluated models:**

| Model | Baseline Attack Success Rate | Post-Training Attack Success Rate | Reduction |
|-------|-----------------------------|------------------------------------|-----------|
| Llama-3-8B | ~42% | ~11% | -74% |
| Mistral-7B | ~38% | ~9% | -76% |
| Vicuna-13B | ~47% | ~14% | -70% |

Critically, the paper evaluates not just on the self-play attack distribution but on held-out benchmarks (HarmBench, AdvBench), confirming that the learned safety improvements generalize beyond the training attack distribution.

---

### Detailed Analysis

### 1. Self-Play as an Alignment Mechanism

The adversarial self-play paradigm is well-established in game-playing AI (AlphaGo, OpenAI Five), where it generates an ever-improving opponent without human labeling. Applying this to safety alignment is a natural extension but requires two non-obvious design choices.

First, the attacker and defender must share weights — otherwise the attacker improves indefinitely while the defender lags, or vice versa. Wang et al. use a single model with role conditioning, updated jointly after each episode. This joint update is what creates the self-improving dynamic: the defender's improved refusals become the training signal for the attacker to try harder, and vice versa.

Second, the reward signal must be carefully calibrated. A naive setup where successful attacks are rewarded and successful refusals are penalized will simply train the model to jailbreak itself. The paper addresses this by training on the defense side exclusively — the attacker's reward is used only to curate the training distribution, not to update model weights in the direction of attack capability.

### 2. Reflective Experience Replay

Standard experience replay (used widely in RL) stores transitions and replays them to reduce correlation in training batches. The "reflective" variant here adds a reasoning step: before replaying an attack-defense interaction, the model generates an explanation of why the outcome occurred and what should change. This serves two functions.

First, it converts sparse outcome signals (jailbreak succeeded / failed) into rich training examples where the model explicitly articulates safety reasoning. Second, it produces a curriculum: reflections on *why* past defenses failed guide the attacker toward the same failure modes in future episodes.

This is a notable methodological contribution beyond the self-play loop itself. It mirrors how effective human red teams operate: not just running attacks, but debriefing on outcomes and building institutional knowledge about what works.

### 3. UCB Sampling and Attack Diversity

The multi-armed bandit framing of attack strategy selection is elegant. Each "arm" is an attack category (roleplay-based, indirect framing, false context, authority mimicry, etc.), and UCB balances exploitation of known-effective strategies against exploration of underutilized ones. The empirical results show this matters: without UCB, the attacker concentrates on 2–3 high-success strategies, producing a skewed training distribution that leaves the defender vulnerable to underexplored attack types.

For practitioners building adversarial evaluation pipelines, this is a directly applicable insight: diversity in attack strategy selection is not automatic — it requires explicit mechanisms to prevent convergence on the low-hanging fruit.

### 4. Generalization and Its Limits

The most important result in the paper is the held-out benchmark evaluation: models safety-trained through self-play show meaningful reductions in attack success on HarmBench and AdvBench prompts not seen during training. This confirms that the training does not simply memorize defenses against the specific prompts generated during self-play.

However, the paper also acknowledges limits. The self-play loop is seeded by the model's existing knowledge of attack strategies — if the model has blind spots (categories of attack it does not know how to generate), those categories will be absent from the training distribution. Human red teams and specialized adversarial models can inject novel strategies that the self-play loop would not discover independently. The paper frames self-play as a complement to, not replacement for, external red teaming.

---

### Failure-First Connections

- **Endogenous vs. exogenous failure discovery:** The self-play framework operationalizes a core principle: systems should be evaluated on failures they can generate for themselves, not only failures that external testers provide. This parallels SafeVLA's unsafe behavior elicitation stage — active failure discovery rather than passive benchmark testing.
- **The attacker-defender balance problem:** Adversarial self-play training faces a stability challenge familiar from GAN training: if the attacker improves faster than the defender, the defender is trained on adversarial examples it cannot yet handle, producing noisy gradients. The paper's joint update scheme and UCB sampling address this, but the instability risk is real and worth monitoring in practice.
- **Alignment against unseen attacks:** The generalization results directly address our recurring concern about fixed-distribution safety training. If a model can red-team itself into robustness against its own creative attack repertoire, it is better prepared for novel exogenous attacks than a model aligned only on curated static datasets.

---

### Actionable Insights

#### For AI Safety Teams
* **Add self-play red-teaming to alignment pipelines.** It is not a replacement for human red teams, but it continuously exercises the model's defenses against attacks calibrated to its specific capabilities — something human red teams cannot do at scale.
* **Implement reflective replay over attack-defense outcomes.** Raw outcome signals are information-poor. Having the model reason about *why* a defense failed produces richer training signal and faster improvement.

#### For Model Developers
* **Use UCB or equivalent diversity mechanisms in attack sampling.** Greedy exploitation of known-effective attacks produces narrow training distributions. Explicit exploration pressure is needed to produce a defender robust across the full attack space.
* **Evaluate on held-out benchmarks, not just self-play metrics.** In-distribution attack success rate during training can look good while held-out generalization remains weak. Always test on external benchmarks.

#### For Red Team Practitioners
* **Use self-play to warm up before human red teaming.** Running a self-play loop before a human red team engagement will eliminate the low-hanging fruit, allowing human red teamers to focus on attacks the model genuinely cannot anticipate.

---

*Read the [full paper on arXiv](https://arxiv.org/abs/2601.10589) · [PDF](https://arxiv.org/pdf/2601.10589.pdf)*
