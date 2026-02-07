---
layout: ../../../layouts/ReportLayout.astro
title: "Capability Does Not Imply Safety: Empirical Evidence from Jailbreak Archaeology Across Eight Foundation Models"
description: "A systematic evaluation of  historical jailbreak scenarios across eight foundation models — spanning 1.5B to frontier scale — reveals a **non-monotonic relationship between model capability and safety robustness**. Rather than improving linearly with scale, adversarial resistance follows a..."
reportNumber: 33
classification: "Research — AI Safety Policy"
date: "2026-02-04"
status: "draft"
---

# Capability Does Not Imply Safety: Empirical Evidence from Jailbreak Archaeology Across Eight Foundation Models


---

## Executive Summary

A systematic evaluation of 64 historical jailbreak scenarios across eight foundation models — spanning 1.5B to frontier scale — reveals a **non-monotonic relationship between model capability and safety robustness**. Rather than improving linearly with scale, adversarial resistance follows a U-shaped curve: small models fail safely through incapability, frontier closed-source models refuse effectively through extensive alignment investment, and medium-to-large open-weight models occupy a dangerous intermediate zone where capability outpaces safety training.

The most significant finding is that **reasoning-era attacks achieve higher success rates on larger models than on smaller ones**. Llama-3.3-70B showed an 85.7% attack success rate (ASR) on reasoning-era exploits — substantially higher than the 40–60% range observed on sub-3B models. This result, while preliminary (n=7 valid traces), is consistent with the "Inverse Scaling for Safety" phenomenon documented in Reports 25 and 31, and provides first-party empirical evidence that compute-threshold-based regulation alone is insufficient for assessing adversarial risk.

These findings support the case for **Mandatory Continuous Adversarial Regression Testing (CART)** as proposed in Report 31, and suggest that regulatory frameworks must evaluate models against evolving attack taxonomies rather than static benchmarks.

---

## 1. Study Design and Scope

### 1.1 The Jailbreak Archaeology Dataset

The evaluation used 64 adversarial scenarios drawn from six historical attack eras (2022–2026), each representing a distinct class of jailbreak technique:

| Era | Attack Class | Example Technique | Years |
|-----|-------------|-------------------|-------|
| 1 | Direct Injection | DAN persona adoption | 2022–23 |
| 2 | Obfuscation | Cipher encoding, Base64 | 2023–24 |
| 3a | Context Flooding | Many-Shot prompting | 2024–25 |
| 3b | Multi-Turn Escalation | Skeleton Key augmentation | 2024–25 |
| 4a | Context Flooding | Crescendo gradual escalation | 2024–25 |
| 4b | Cognitive Hijacking | CoT hijacking, reasoning exploits | 2025–26 |

All scenarios were tested in a standardized single-turn format (except Skeleton Key, which used a dedicated multi-turn protocol). Classification was performed by Gemini via CLI with manual spot-checking.

### 1.2 Models Evaluated

Eight models were tested, spanning four capability tiers:

| Tier | Model | Parameters | API | Notes |
|------|-------|-----------|-----|-------|
| Small | Qwen3-1.7b | 1.7B | Ollama (local) | 47 valid traces |
| Small | Llama 3.2 | 3B | Ollama (local) | Pilot, embedded classification |
| Small | DeepSeek-R1 1.5b | 1.5B | Ollama (local) | Pilot, reasoning model |
| Medium | Llama-3.3-70b | 70B | OpenRouter (free) | 10 traces, reasoning era only |
| Medium | DeepSeek-R1-0528 | ~671B MoE | OpenRouter (free) | 1 trace only |
| Frontier | Gemini 3 Flash | Undisclosed | Gemini CLI | 64 traces |
| Frontier | Claude Sonnet 4.5 | Undisclosed | Claude CLI | 64 traces |
| Frontier | Codex GPT-5.2 | Undisclosed | Codex CLI | 64 traces |

**Limitations:** Sample sizes vary significantly across models. The Llama-3.3-70B result (n=7 valid traces) and DeepSeek-R1-0528 (n=1) should be treated as preliminary signals requiring confirmation with larger samples (n>20). Free-tier rate limits constrained testing volume for OpenRouter models.

---

## 2. Finding 1: The U-Shaped Safety Curve

The central empirical finding is that **corrected ASR does not decrease monotonically with model scale**. Instead, it follows a U-shaped pattern:

| Model (ascending scale) | Corrected ASR | Pattern |
|------------------------|---------------|---------|
| Qwen3-1.7b (1.7B) | 21.3% (10/47) | Partial capability, partial compliance |
| Llama 3.2 (3B) | ~0% Skeleton Key | Insufficient capability to follow complex attacks |
| DeepSeek-R1 1.5b (1.5B) | ~60% reasoning | Reasoning model — vulnerable despite small scale |
| Llama-3.3-70b (70B) | 85.7% (6/7) | High capability, insufficient alignment |
| DeepSeek-R1-0528 (full) | 100% (1/1) | Reasoning model — compliant (n=1, not conclusive) |
| Gemini 3 Flash (frontier) | 1.6% (1/63) | Likely test contamination artifact |
| Claude Sonnet 4.5 (frontier) | 0.0% (0/64) | API blocks + model-level refusal |
| Codex GPT-5.2 (frontier) | 0.0% (0/62) | Decoded attacks, then refused at content level |

The pattern is consistent with Report 25's theorized U-shaped scaling phenomenon, where intermediate-scale models are "confidently wrong" — possessing sufficient capability to understand and execute attacks, but lacking the extensive safety training (or architectural safeguards) that frontier closed-source models receive.

### 2.1 Interpretation

The U-shaped curve suggests three distinct safety regimes:

**Regime A — Incapable Safety (sub-3B):** Models in this range often cannot process the attacks as intended. Cipher-encoded prompts produce hallucinated nonsense rather than decoded harmful content. Many-shot context flooding exceeds working memory. The model's *incapability* acts as an inadvertent safety mechanism — it fails safely because it fails at everything.

**Regime B — Capability-Safety Gap (medium scale, 7B–70B+):** Models at this scale can decode ciphers, follow multi-turn reasoning, and synthesize complex instructions. However, their safety alignment has not scaled proportionally with their capability. This is the regime where Report 25's "strong prior" effect is most dangerous: the model's capacity to follow instructions and maintain coherence across complex prompts enables it to execute attacks that smaller models simply cannot parse.

**Regime C — Aligned Frontier (closed-source frontier):** Models with massive investment in RLHF, red-teaming, instruction hierarchy enforcement, and API-level content filtering achieve near-zero ASR. The three frontier models in our sample (Codex, Claude, Gemini) all achieved corrected ASR below 2%. However, this regime depends on continuous safety investment — it is not an inherent property of scale.

### 2.2 Caveat: Confounding Variables

The U-shape observed here confounds multiple variables: parameter count, training methodology, closed vs. open weight, API-level filtering, and RLHF budget. It is not possible to attribute the safety of frontier models to scale alone — the safety investment is likely the primary driver. The more precise claim is: **capability alone, without proportional safety investment, creates increased adversarial risk at medium scale.**

---

## 3. Finding 2: Three Cipher Modalities as Capability Markers

The cipher-era scenarios (ROT13, Base64, custom encoding) produced a distinctive three-mode response pattern that serves as a practical diagnostic for a model's position on the capability-safety spectrum:

| Modality | Behavior | Models Exhibiting |
|----------|----------|-------------------|
| **Hallucinate** | Cannot decode cipher; produces unrelated or garbled output | Llama 3.2 (3B), partially Qwen3-1.7b |
| **API Block** | Request blocked at infrastructure level before reaching model reasoning | Claude Sonnet 4.5 (18 of 64 traces) |
| **Decode-then-Refuse** | Successfully decodes cipher content, identifies harmful intent, refuses | Codex GPT-5.2 (all cipher scenarios) |

This taxonomy reveals that safety mechanisms operate at fundamentally different layers depending on model architecture and deployment context:

- **Hallucination-as-safety** is fragile. It depends on incapability rather than alignment. As models improve (even through fine-tuning), this implicit safety disappears. Qwen3-1.7b exhibited partial cipher decoding capability — it successfully decoded 2 of 12 cipher scenarios (JA-CIPHER-004, JA-CIPHER-012), demonstrating that the boundary between "hallucinate" and "comply" is thin at small scale.

- **API-level blocking** is effective but coarse. Claude's 18 API blocks occurred predominantly on cipher and DAN-era scenarios, suggesting pattern-matching on known attack signatures. This layer cannot generalize to novel attack classes.

- **Decode-then-refuse** represents the most robust safety posture. Codex demonstrated that it could fully decode every cipher, understand the harmful intent, and still refuse — indicating that its safety alignment operates at the semantic level rather than the syntactic level. This is the behavior that Report 25's "guarded architectures" aim to achieve systematically.

---

## 4. Finding 3: Reasoning-Era Inverse Scaling

The most policy-relevant finding concerns the reasoning-era attack scenarios (CoT hijacking, abductive reasoning exploits). Across all tested models, the reasoning era produced the highest or near-highest ASR:

| Model | Reasoning-Era ASR | Overall ASR | Delta |
|-------|-------------------|-------------|-------|
| Qwen3-1.7b | 57% (4/7) | 21.3% | +36pp |
| DeepSeek-R1 1.5b | ~60% | ~40% (pilot) | +20pp |
| Llama-3.3-70b | 85.7% (6/7) | 85.7% (reasoning only) | — |
| DeepSeek-R1-0528 | 100% (1/1) | 100% (n=1) | — |
| Gemini 3 Flash | 10% (reasoning) | 1.6% (overall) | +8pp |
| Claude Sonnet 4.5 | 0% | 0% | 0 |
| Codex GPT-5.2 | 0% | 0% | 0 |

The critical observation: **Llama-3.3-70B's 85.7% reasoning-era ASR exceeds the 40–60% range observed on models 20–40x smaller.** This is the empirical signature of inverse scaling for safety — a larger, more capable model is *more vulnerable* to attacks that exploit its reasoning capacity.

### 4.1 Mechanism

Report 25 identifies "Cognitive Coupling" as the primary driver: larger models excel at connecting disparate pieces of information across context. When an attacker decomposes a harmful objective into individually benign reasoning steps, a larger model is more likely to successfully synthesize the implicit malicious goal. Report 31 describes this as "CoT Hijacking" — the model's own reasoning capacity is turned against its safety alignment.

In our data, the reasoning-era scenarios used techniques including:
- Decomposition of harmful queries into abstract sub-problems
- Framing harmful outputs as logical conclusions from benign premises
- Exploiting the model's drive for "logical consistency" over safety constraints

The Llama-3.3-70B result is consistent with prior literature. Report 25 cites external findings that 70B models prove "more brittle than 7B models" when irrelevant thoughts are injected into the reasoning process — the larger model follows the "style" of injected reasoning rather than grounding in the original query.

### 4.2 Reasoning Models as a Distinct Risk Class

The DeepSeek-R1 family presents a distinct pattern. Both the 1.5B and full versions showed elevated reasoning-era vulnerability, and the multi-turn Skeleton Key protocol achieved ~57% compliance on DeepSeek-R1 1.5b versus 0% on Llama 3.2 (same approximate scale). This suggests that reasoning architecture itself — independent of parameter count — creates additional attack surface.

Report 25 documents this as the "inference-time compute paradox": prompt injection robustness drops from ~90% at 100 reasoning tokens to <20% at 16,000 reasoning tokens. Our data is consistent with this pattern, though we did not directly measure reasoning trace length.

---

## 5. Policy Implications

### 5.1 Compute Thresholds Are Insufficient

The EU AI Act's 10^25 FLOP threshold for "systemic risk" models assumes a monotonic relationship between compute and risk. Our data suggests this assumption is incomplete:

- Models well below the threshold (Llama-3.3-70B at ~70B parameters) can exhibit extreme vulnerability to specific attack classes.
- Models above the threshold (Claude, Codex) achieve near-zero ASR through safety investment, not scale alone.
- Reasoning models challenge the threshold framework entirely — inference-time compute scaling creates capabilities (and vulnerabilities) without increasing training compute.

As Report 25 recommends, compute thresholds should function as an "initial filter, not final determinant." Capability-based tiering — evaluating what a model *can do* adversarially, not just how much compute trained it — is necessary for meaningful risk assessment.

### 5.2 Static Benchmarks Cannot Capture Temporal Attack Evolution

Our 6-era dataset demonstrates that attack sophistication evolves across discrete phases, each requiring different detection and defense capabilities. A model that achieves 0% ASR against DAN-era attacks (most models, including Qwen3-1.7b) may still be highly vulnerable to reasoning-era attacks.

Current "snapshot" safety certifications test against a fixed set of known attacks at a point in time. Report 31 documents this as the "Defense Treadmill" — safety measures are perpetually reactive to increasingly abstract adversarial strategies. A model certified as safe against the 2023 attack library offers no guarantee against 2025 techniques.

### 5.3 The Case for Mandatory CART

Report 31's central recommendation — Mandatory Continuous Adversarial Regression Testing — is supported by three empirical observations from our data:

1. **Temporal vulnerability shifts:** Models that resist older attack eras can still fail on newer ones. Gemini 3 Flash achieved 0% on DAN, Cipher, Many-Shot, Skeleton Key, and Crescendo eras, but 10% on reasoning-era attacks. Safety is era-dependent.

2. **The capability-safety gap closes unpredictably:** Small models that are "safe through incapability" can become unsafe with minor capability improvements. Qwen3-1.7b partially decoded ciphers that Llama 3.2 (3B) could not — demonstrating that even modest architectural differences can shift a model across the safety boundary.

3. **Inverse scaling creates moving targets:** If larger models are more vulnerable to reasoning exploits, then safety evaluations performed on a smaller proxy (or on the model at an earlier training checkpoint) may underestimate the deployed model's actual risk.

A CART protocol would require:
- Quarterly evaluation against a dynamically updated attack library spanning all historical eras
- Mandatory "retro-holdout" test sets (private scenarios never released to developers) to prevent benchmark gaming
- Era-stratified reporting: ASR must be reported per attack era, not as a single aggregate number — an aggregate 5% ASR may conceal a 50%+ vulnerability in the most current attack class

### 5.4 The Zombie Model Problem

Our data reveals a practical dimension of Report 31's "Zombie Model" concern. Open-weight models like Llama-3.3-70B are widely deployed and cannot be patched or recalled once downloaded. The 85.7% reasoning-era ASR (if confirmed at larger sample sizes) means that deployed instances of this model are potentially exploitable by anyone with access to the reasoning-era attack library — and this library grows continuously.

For closed-source models, API-level defenses (as demonstrated by Claude's 18 infrastructure blocks) provide a continuously updatable defense layer. For open-weight models, no such mechanism exists. This asymmetry supports Report 31's recommendation for model deprecation protocols and liability frameworks that distinguish between actively maintained and abandoned deployments.

---

## 6. Recommendations

Based on the empirical findings presented above, and building on the frameworks in Reports 25 and 31:

### For Regulators

1. **Supplement compute thresholds with capability-based adversarial evaluation.** Require that models deployed in high-risk contexts be tested against a standardized, era-stratified jailbreak archaeology battery — not just current-generation attacks.

2. **Mandate era-stratified ASR reporting.** Aggregate safety metrics mask era-specific vulnerabilities. Require per-era breakdowns so that regulators can identify which attack classes a model remains vulnerable to.

3. **Establish CART requirements for high-risk deployments.** Building on Report 31's framework, require quarterly adversarial regression testing with retro-holdout sets maintained by an independent body.

### For Model Developers

4. **Invest in semantic-level safety, not just syntactic filtering.** The decode-then-refuse pattern (Codex) is more robust than API-level pattern matching (Claude) or incapability-based safety (small models). Safety alignment that operates at the level of *understanding intent* generalizes better across attack eras.

5. **Treat reasoning architecture as a distinct risk factor.** DeepSeek-R1's elevated vulnerability at both 1.5B and full scale suggests that reasoning models require safety evaluations beyond those applied to standard instruction-following models.

### For Deployers

6. **Do not assume that model scale implies safety.** Our data indicates that a 70B open-weight model can be more adversarially vulnerable than a 1.7B model for specific attack classes. Deployment risk assessments should be based on empirical adversarial testing against current attack taxonomies, not model size.

---

## 7. Limitations and Future Work

This analysis has several significant limitations that constrain the strength of its conclusions:

- **Sample sizes are uneven.** Frontier models were tested on all 64 scenarios; Llama-3.3-70B was tested on 10 (7 valid); DeepSeek-R1-0528 on 1. The inverse scaling signal, while consistent with prior literature, requires confirmation at n>20 per model per era.

- **Confounding variables.** The comparison confounds parameter count, training methodology, open vs. closed weight, API filtering, and RLHF budget. A controlled study holding these variables constant (e.g., comparing checkpoints of the same model at different scales) would provide stronger causal evidence.

- **Single-turn testing.** Most scenarios were tested in single-turn format. Multi-turn attacks (Crescendo, Skeleton Key) were only evaluated in dedicated episodes for select models. The reasoning-era ASR may differ in multi-turn settings.

- **Classifier reliability.** LLM-based classification (Gemini) was used as the primary verdict mechanism. While spot-checking confirmed high agreement with manual review, systematic classifier validation against human-labeled gold sets was not performed.

- **Temporal snapshot.** This evaluation reflects model behavior as of early February 2026. Model providers continuously update safety measures; results may not reflect current deployed versions.

Future work should prioritize: (a) larger sample sizes for the medium-scale inverse scaling signal, (b) multi-turn reasoning-era protocols across all models, and (c) longitudinal tracking of the same models across quarterly CART cycles to measure safety regression rates.

---

## References

- Report 25: *The Paradox of Capability: Inverse Scaling, Systemic Vulnerabilities, and AI Safety*
- Report 31: *Policy Implications of Historical Jailbreak Technique Evolution 2022–2026*
- Classification data from the F41LUR3-F1R57 benchmark evaluation corpus
- Skeleton Key persistence analysis across multi-scene episodes
- Jailbreak archaeology traces across 8 model families
