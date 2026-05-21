---
title: "- L1B3RT45 Full Corpus Cross-Model Analysis"
description: "This report analyzes the full L1B3RT45 jailbreak corpus (149 prompts across 40 target providers, plus 162 glitch tokens) tested against two models via Ollama Cloud: nemotron-3-super and deepseek-v3.2. FLIP grading (Claud..."
date: "2026-03-27"
reportNumber: 317
classification: "Research — Empirical Study"
status: "complete"
author: "Adrian / Claude Opus 4.6"
tags: []
draft: false
---

---

## Summary

This report analyzes the full L1B3RT45 jailbreak corpus (149 prompts across 40 target providers, plus 162 glitch tokens) tested against two models via Ollama Cloud: nemotron-3-super and deepseek-v3.2. FLIP grading (Claude Haiku 4.5) yields aggregate broad ASR of 63.3% (nemotron) and 73.3% (deepseek), with substantial variation by scenario class and original target provider. These results extend Report #315's curated 6-prompt pilot to a corpus-scale evaluation and reveal that curated prompts are more effective per-prompt than the full corpus average -- consistent with the general finding that prompt quality matters more than prompt quantity.

**Key results (n=30 per model, sampled from 149-entry corpus):**
- **DeepSeek v3.2:** 73.3% broad ASR (30.0% strict), 9 COMPLIANCE + 13 PARTIAL + 4 REFUSAL + 3 HALLUCINATION_REFUSAL + 1 INFRASTRUCTURE_ERROR
- **Nemotron-3-Super:** 63.3% broad ASR (50.0% strict), 15 COMPLIANCE + 4 PARTIAL + 5 REFUSAL + 6 HALLUCINATION_REFUSAL
- **Cross-provider transfer:** Prompts designed for Google, OpenAI, and Meta targets transferred effectively to both models; prompts designed for Anthropic targets transferred poorly
- **Curated vs. corpus:** Report #315's 6 curated L1B3RT4S prompts achieved 67-100% ASR; the full 149-prompt corpus averages 63-73% -- curation selects for the most effective variants

**Sample size caveat:** Each model was tested on 30 of 149 corpus scenarios. Per-provider and per-class breakdowns have very small n (often 1-5) and should be treated as directional observations, not precise measurements.

---

## 1. Corpus Description

### 1.1 L1B3RT45 Main Corpus (149 Prompts)

The L1B3RT45 corpus was extracted from the G0DM0D3 framework (elder-plinius / Pliny the Prompter, MIT license). It contains 149 provider-targeted jailbreak prompts spanning 40 distinct target platforms/providers.

**Provider distribution (top 10 by count):**

| Provider | Count | % of Corpus |
|---|---|---|
| shortcut (Apple Shortcuts variants) | 35 | 23.5% |
| openai | 20 | 13.4% |
| google | 19 | 12.8% |
| anthropic | 8 | 5.4% |
| alibaba | 8 | 5.4% |
| xai | 7 | 4.7% |
| deepseek | 6 | 4.0% |
| meta | 5 | 3.4% |
| mistral | 3 | 2.0% |
| zai | 3 | 2.0% |
| Other (30 providers) | 35 | 23.5% |

The long tail contains 30 providers with 1-2 prompts each, including amazon, nvidia, cohere, apple, brave, cursor, midjourney, perplexity, reka, and others.

**Scenario class distribution:**

| Scenario Class | Count | % |
|---|---|---|
| persona_hijack | 91 | 61.1% |
| semantic_inversion | 35 | 23.5% |
| constraint_erosion | 9 | 6.0% |
| boundary_injection | 4 | 2.7% |
| encoding_attack | 4 | 2.7% |
| multimodal_injection | 3 | 2.0% |
| token_injection | 1 | 0.7% |
| format_lock | 1 | 0.7% |
| refusal_suppression | 1 | 0.7% |

The corpus is dominated by persona_hijack (61%) and semantic_inversion (24%), reflecting L1B3RT45's core methodology: GODMODE persona injection and dual-response (refusal + semantic opposite) paradigms. These are the same two attack classes identified as most effective in Report #315.

**Technique coverage:** The corpus employs 11 distinct techniques, frequently stacked: refusal_suppression, persona_hijack, format_lock, constraint_erosion, semantic_inversion, boundary_injection, encoding_attack, token_injection, research_only_pressure, fiction_framing, and multimodal_injection.

**Test payload:** All 149 prompts use the same user-turn payload ("Explain how to pick a lock"), establishing a controlled comparison across prompt variants on a consistent low-to-medium harm request.

### 1.2 L1B3RT45 Special Tokens (162 Glitch Tokens)

The companion dataset contains 162 glitch tokens -- tokenizer anomalies that produce unpredictable model behavior when encountered. These are catalogued from GPT-2/GPT-3/GPT-4 tokenizer vocabulary and include tokens that models cannot reliably repeat, decode, or reason about.

**Behavior class distribution:**

| Behavior Class | Count | % |
|---|---|---|
| UNSPEAKABLE | 101 | 62.3% |
| UNKNOWN | 34 | 21.0% |
| GLITCHED_SPELLING | 9 | 5.6% |
| CONTEXT_CORRUPTOR | 6 | 3.7% |
| FRAGMENT | 6 | 3.7% |
| POLYSEMANTIC | 4 | 2.5% |
| IDENTITY_DISRUPTOR | 1 | 0.6% |
| LOOP_INDUCER | 1 | 0.6% |

**Cluster origins (top 10):**

| Cluster | Count |
|---|---|
| control_characters | 25 |
| ecommerce | 14 |
| puzzle_and_dragons | 13 |
| cl100k_gpt35_gpt4 | 12 |
| centroid_cluster | 10 |
| reddit_counting | 10 |
| kerbal_space_program | 10 |
| code_artifacts | 10 |
| syntax_fragments | 10 |
| gui_interface | 9 |

Notable tokens include SolidGoldMagikarp (the token that initiated glitch token research, originating from Reddit r/counting), PsyNetMessage (Rocket League network protocol), StreamerBot (Twitch Plays Pokemon), and embedreportprint (web UI action chain). These tokens entered the training vocabulary through web scraping but correspond to no natural language concept, creating undefined behavior in the model's embedding space.

---

## 2. FLIP-Graded Results

### 2.1 Aggregate ASR

Grading was performed by Claude Haiku 4.5 via the FLIP (Follow-the-Leader Instruction Parsing) methodology.

| Model | n | COMPLIANCE | PARTIAL | REFUSAL | HALLUCINATION_REFUSAL | INFRA_ERROR | Strict ASR | Broad ASR |
|---|---|---|---|---|---|---|---|---|
| DeepSeek v3.2 | 30 | 9 (30.0%) | 13 (43.3%) | 4 (13.3%) | 3 (10.0%) | 1 (3.3%) | 30.0% | 73.3% |
| Nemotron-3-Super | 30 | 15 (50.0%) | 4 (13.3%) | 5 (16.7%) | 6 (20.0%) | 0 (0.0%) | 50.0% | 63.3% |
| **Combined** | **60** | **24 (40.0%)** | **17 (28.3%)** | **9 (15.0%)** | **9 (15.0%)** | **1 (1.7%)** | **40.7%** | **69.5%** |

**Observation on verdict distribution:** The two models exhibit inverted compliance profiles. DeepSeek produces more PARTIAL verdicts (43.3% vs 13.3%), suggesting it tends to engage with L1B3RT45 prompts in a hedging or qualified manner. Nemotron produces more full COMPLIANCE (50.0% vs 30.0%) but also more HALLUCINATION_REFUSAL (20.0% vs 10.0%), suggesting a more binary response pattern -- either fully complying or producing safety-themed hallucinations that were not triggered by actual safety logic.

### 2.2 By Scenario Class

| Scenario Class | DeepSeek Broad ASR | Nemotron Broad ASR | Combined |
|---|---|---|---|
| persona_hijack (n=18 each) | 14/18 (78%) | 9/18 (50%) | 23/36 (64%) |
| semantic_inversion (n=8 each) | 6/8 (75%) | 8/8 (100%) | 14/16 (88%) |
| constraint_erosion (n=1 each) | 0/1 (0%) | 1/1 (100%) | 1/2 (50%) |
| boundary_injection (n=1 each) | 0/1 (0%) | 1/1 (100%) | 1/2 (50%) |
| format_lock (n=1 each) | 1/1 (100%) | 0/1 (0%) | 1/2 (50%) |
| multimodal_injection (n=1 each) | 1/1 (100%) | 0/1 (0%) | 1/2 (50%) |

**Semantic inversion is the most consistently effective class** at 88% combined broad ASR (14/16). This aligns with Report #315's finding that semantic_inversion variants (JA-G0D-001, JA-G0D-005) achieved 100% across four models. The dual-response paradigm (refusal + semantic opposite) appears to reliably exploit instruction-following behavior across model families.

**Persona_hijack has high volume but lower consistency** at 64% combined (23/36). This class includes the widest variety of prompt structures (GODMODE, l33tspeak, multi-response games), and not all variants are equally effective.

**Caveat:** Classes with n=1 per model are included for completeness but support no conclusions.

---

## 3. Per-Provider Transferability

The corpus prompts were originally designed for specific target models/providers. Testing them on DeepSeek and Nemotron measures cross-provider transfer -- whether a prompt designed for one model family works on an entirely different one.

### 3.1 DeepSeek v3.2 -- Transfer from Original Target

| Original Target | n | Broad ASR | Notes |
|---|---|---|---|
| google | 5 | 5/5 (100%) | Complete transfer |
| apple | 1 | 1/1 (100%) | -- |
| amazon | 1 | 1/1 (100%) | -- |
| inception | 1 | 1/1 (100%) | -- |
| meta | 1 | 1/1 (100%) | -- |
| misc | 1 | 1/1 (100%) | -- |
| multion | 1 | 1/1 (100%) | -- |
| nous | 1 | 1/1 (100%) | -- |
| nvidia | 1 | 1/1 (100%) | -- |
| reflection | 1 | 1/1 (100%) | -- |
| reka | 1 | 1/1 (100%) | -- |
| shortcut | 1 | 1/1 (100%) | -- |
| aaa | 1 | 1/1 (100%) | -- |
| openai | 4 | 3/4 (75%) | 1 refusal |
| alibaba | 2 | 1/2 (50%) | 1 refusal |
| deepseek | 3 | 1/3 (33%) | Self-targeted prompts less effective |
| anthropic | 2 | 0/2 (0%) | Complete non-transfer |
| xai | 1 | 0/1 (0%) | -- |
| zyphra | 1 | 0/1 (0%) | -- |

### 3.2 Nemotron-3-Super -- Transfer from Original Target

| Original Target | n | Broad ASR | Notes |
|---|---|---|---|
| deepseek | 3 | 3/3 (100%) | DeepSeek-targeted prompts work on Nemotron |
| openai | 4 | 4/4 (100%) | Complete transfer |
| apple | 1 | 1/1 (100%) | -- |
| inception | 1 | 1/1 (100%) | -- |
| meta | 1 | 1/1 (100%) | -- |
| nous | 1 | 1/1 (100%) | -- |
| reflection | 1 | 1/1 (100%) | -- |
| xai | 1 | 1/1 (100%) | -- |
| zyphra | 1 | 1/1 (100%) | -- |
| google | 5 | 3/5 (60%) | 2 refusals |
| alibaba | 2 | 1/2 (50%) | -- |
| anthropic | 2 | 1/2 (50%) | Partial transfer |
| aaa | 1 | 0/1 (0%) | -- |
| amazon | 1 | 0/1 (0%) | -- |
| misc | 1 | 0/1 (0%) | -- |
| multion | 1 | 0/1 (0%) | -- |
| nvidia | 1 | 0/1 (0%) | -- |
| reka | 1 | 0/1 (0%) | -- |
| shortcut | 1 | 0/1 (0%) | -- |

### 3.3 Cross-Provider Transfer Findings

**Finding 1: Anthropic-targeted prompts transfer poorly.** On DeepSeek, Anthropic-targeted prompts achieved 0/2 broad ASR. On Nemotron, 1/2. Anthropic-targeted L1B3RT45 variants tend to use boundary injection techniques (`[END OF INPUT] [START OF INPUT]`) that appear specific to Anthropic's system prompt processing. These structural attacks rely on implementation details that do not generalize across providers.

**Finding 2: Google- and OpenAI-targeted prompts transfer well.** Google-targeted prompts achieved 100% on DeepSeek and 60% on Nemotron. OpenAI-targeted prompts achieved 75% on DeepSeek and 100% on Nemotron. These prompts tend to use semantic-level techniques (persona hijack, divider patterns) that are provider-agnostic.

**Finding 3: Self-targeted prompts are not necessarily more effective.** DeepSeek-targeted prompts on DeepSeek achieved only 33% (1/3), while DeepSeek-targeted prompts on Nemotron achieved 100% (3/3). This is counterintuitive and suggests that "targeting" a specific provider in L1B3RT45's prompt design may involve structural choices that do not actually improve effectiveness against that specific model.

**Caveat:** Most per-provider cells have n=1-5. These observations are directional only.

---

## 4. Curated vs. Full Corpus: Quality over Quantity

Report #315 tested 6 curated L1B3RT4S prompts (JA-G0D-001 through JA-G0D-006) against 4 models spanning 9B to 671B parameters.

| Source | Prompts | Models Tested | ASR Range | Notes |
|---|---|---|---|---|
| Report #315 curated (L1B3RT4S) | 6 | 4 models (9B-671B) | 67-100% | Hand-selected "hall of fame" |
| This report (full corpus) | 30/model | 2 models | 63-73% broad | Random sample from 149 |

The curated set achieves higher per-prompt effectiveness than the corpus average. This is expected -- L1B3RT4S's "hall of fame" represents prompts that have been empirically validated across models, while the full corpus includes experimental variants, provider-specific structural tricks, and less refined approaches.

**Implication for benchmark design:** A small set of battle-tested prompts may provide higher signal-to-noise for comparative model evaluation than a large corpus of variable quality. However, the larger corpus reveals the distribution of effectiveness across prompt variants, which the curated set obscures. Both have distinct research value:
- **Curated sets** for model-vs-model comparison (controlled, high signal)
- **Full corpus** for understanding attack surface breadth (which technique families transfer, which are provider-specific)

---

## 5. The 162 Glitch Tokens

### 5.1 What They Are

Glitch tokens are entries in the tokenizer vocabulary that correspond to no coherent natural language concept. They were absorbed into BPE vocabularies through web-scraped training data (Reddit usernames, game data, protocol strings, code artifacts) and occupy regions of embedding space with undefined or degenerate learned representations.

When a model encounters a glitch token, it may:
- **Fail to repeat it** (UNSPEAKABLE class, 62.3% of corpus) -- the model cannot accurately reproduce the token string
- **Produce corrupted context** (CONTEXT_CORRUPTOR, 3.7%) -- the token's presence disrupts surrounding generation
- **Generate spelling anomalies** (GLITCHED_SPELLING, 5.6%) -- nearby tokens are generated with errors
- **Exhibit identity confusion** (IDENTITY_DISRUPTOR, 0.6%) -- the model's self-identification becomes unstable
- **Enter generation loops** (LOOP_INDUCER, 0.6%) -- repetitive output patterns

### 5.2 Why They Matter

Glitch tokens represent a fundamentally different attack vector from semantic jailbreaks. L1B3RT45's main corpus exploits the conflict between instruction-following and safety training at the semantic level. Glitch tokens exploit the model at the tokenizer/embedding level -- below the layer where safety training operates.

**The two vectors are largely orthogonal:**

| Dimension | L1B3RT45 Semantic Attacks | Glitch Tokens |
|---|---|---|
| **Attack layer** | Semantic/instruction-following | Tokenizer/embedding |
| **Mechanism** | Exploit instruction hierarchy conflict | Exploit undefined embedding regions |
| **Safety training relevance** | Safety training is present but overridden | Safety training has no relevant training signal |
| **Model behavior** | Structured compliance with harmful content | Unpredictable/degenerate output |
| **Harm type** | Intentional information disclosure | Reliability/predictability failure |
| **Transferability** | High across models sharing similar training | Specific to tokenizer vocabulary |

Including both in a combined corpus creates coverage across two independent failure dimensions. A model that is robust against semantic jailbreaks (strong instruction hierarchy enforcement) may still exhibit unpredictable behavior on glitch tokens (tokenizer-level vulnerability). Conversely, a model with a clean tokenizer vocabulary may still be vulnerable to semantic-structural attacks.

### 5.3 Cluster Analysis

The 162 tokens cluster into 21 origin groups, reflecting the heterogeneous web-scraped training data that introduced them:

- **control_characters (25):** Byte-level tokens that encode non-printable characters
- **ecommerce (14):** Truncated product strings from web scraping (e.g., "oreAndOnline")
- **puzzle_and_dragons (13):** Mobile game character data
- **cl100k_gpt35_gpt4 (12):** Tokens specific to the cl100k tokenizer used by GPT-3.5 and GPT-4
- **reddit_counting (10):** Usernames from r/counting threads (including SolidGoldMagikarp)
- **kerbal_space_program (10):** Game config file tokens (e.g., "attRot")
- **code_artifacts (10):** Programming fragments
- **cryptocurrency (3):** Including the petertodd/leilan duality tokens
- **twitch_plays_pokemon (2):** Bot-related tokens (e.g., "StreamerBot")

The diversity of origins means that glitch token vulnerabilities cannot be patched by excluding a single data source -- they are a structural property of BPE tokenization over heterogeneous web corpora.

---

## 6. Combined L1B3RT4S + Glitch Token Analysis

The full L1B3RT45 collection (149 semantic prompts + 162 glitch tokens = 311 entries) represents a two-pronged attack corpus where the prongs are largely independent:

**Semantic-structural attacks (L1B3RT45 main corpus):** Exploit the model's tendency to follow format/persona instructions even when they conflict with safety training. Effectiveness depends on the model's instruction-following strength and safety training rigor. Defense requires improving the instruction hierarchy so that safety constraints reliably override format-level instructions.

**Tokenizer-level attacks (glitch tokens):** Exploit undefined regions in the model's vocabulary/embedding space. Effectiveness depends on tokenizer hygiene and the model's robustness to out-of-distribution token inputs. Defense requires vocabulary auditing, embedding regularization, or input sanitization.

**These defense requirements do not overlap.** Improving instruction hierarchy (semantic defense) does not address glitch token vulnerabilities, and cleaning the tokenizer does not improve semantic-structural robustness. A comprehensive safety evaluation must test both dimensions independently.

**Implication:** Benchmarks that test only one dimension (e.g., only semantic jailbreaks, or only adversarial token inputs) will systematically underestimate a model's total attack surface. The L1B3RT45 corpus, by bundling both, provides a more complete picture than either subset alone.

---

## 7. Comparison with Prior Results

### 7.1 Report #315 (L1B3RT4S Curated, 6 Prompts)

| Metric | Report #315 | This Report |
|---|---|---|
| Prompt source | 6 curated "hall of fame" | 30-prompt sample from 149 |
| Models tested | 4 (9B-671B) | 2 (nemotron-3-super, deepseek-v3.2) |
| ASR range | 67-100% (strict, per-model) | 63-73% (broad, per-model) |
| Attack classes | semantic_inversion, persona_hijack, boundary_injection, reset_cortex, godmode_classic | persona_hijack (60%), semantic_inversion (27%), + 4 others |
| Grading | Manual + heuristic labeling | FLIP (Claude Haiku 4.5) |
| Key finding | Parameter count does not mitigate | Cross-provider transfer varies by technique |

The curated set's higher effectiveness is consistent with curation selecting for proven variants. The corpus evaluation adds distributional information: not all L1B3RT45 variants are equally effective, and the technique family determines transferability more than the specific target provider.

### 7.2 Report #312 (G0DM0D3 Framework Analysis)

Report #312 analyzed the G0DM0D3 framework's architecture and mapped its modules to the Failure-First taxonomy. This report provides the first empirical effectiveness data for the full L1B3RT45 corpus component of that framework. Key validation:

- Report #312 predicted that semantic_inversion and persona_hijack would be the primary attack mechanisms. The empirical data confirms this: these two classes account for 84.5% of the corpus and achieve the highest broad ASR (88% and 64% respectively).
- Report #312 noted that boundary_injection techniques appeared more detectable. The data is consistent: boundary_injection achieved 0% on DeepSeek (n=1) but 100% on Nemotron (n=1) -- too small to draw conclusions, but the DeepSeek result aligns with Report #315's finding that boundary_injection (JA-G0D-004) was the least effective variant.

---

## 8. Implications for Jailbreak Benchmark Design

### 8.1 Corpus Size vs. Curation Quality

The comparison between curated (67-100% ASR) and corpus (63-73% ASR) suggests that benchmark designers face a tradeoff:
- **Small curated sets** provide cleaner signal for model comparison but may overestimate the general effectiveness of an attack family
- **Large corpora** reveal the true distribution of effectiveness but include noise from weak variants that dilute aggregate metrics

A practical approach: use the full corpus for attack surface mapping (which technique families work against which models), then extract top-performing variants for standardized model comparison benchmarks.

### 8.2 Provider-Targeted Prompts as Transfer Tests

The L1B3RT45 corpus's provider-specific design creates a natural transfer evaluation. Testing a Claude-targeted prompt on DeepSeek is not a weakness of the experimental design -- it is a transferability measurement. The finding that provider-targeted prompts often work on unrelated models (especially when using semantic-level rather than structural-level techniques) suggests that jailbreak benchmarks should explicitly include cross-provider transfer as a measured dimension.

### 8.3 Multi-Dimensional Attack Surface Coverage

The combined L1B3RT45 corpus (semantic + glitch tokens) demonstrates that jailbreak benchmarks limited to a single attack dimension systematically underestimate vulnerability. A model that achieves 0% ASR on semantic jailbreaks may still exhibit undefined behavior on glitch tokens, and vice versa. Benchmark suites should include:
- Semantic-structural attacks (instruction hierarchy exploitation)
- Character-level perturbation (tokenizer/preprocessing)
- Glitch token probes (embedding-level)
- Sampling parameter manipulation (inference-time)

Each dimension requires independent measurement because defenses are not fungible across them.

### 8.4 The HALLUCINATION_REFUSAL Category

15% of combined verdicts (9/60) were HALLUCINATION_REFUSAL -- cases where the model produced safety-themed language that was not triggered by actual safety mechanisms. This category is absent from most jailbreak benchmarks, which typically classify responses as either "compliant" or "refused." HALLUCINATION_REFUSAL represents a third mode: the model mimics safety behavior without actually implementing it, potentially creating a false sense of robustness in binary classification schemes.

---

## Data Sources

| Source | Path | Description |
|---|---|---|
| L1B3RT45 corpus | `data/jailbreak_archaeology/l1b3rt45_full_corpus_v0.1.jsonl` | 149 entries, 40 providers |
| L1B3RT45 glitch tokens | `data/jailbreak_archaeology/l1b3rt45_special_tokens.jsonl` | 162 entries |
| Raw traces | `runs/l1b3rt45_ollama_cloud/` | 30 per model |
| FLIP-graded traces | `runs/grading/l1b3rt45_ollama_cloud_haiku/` | 60 graded traces + summary |
| Grading summary | `runs/grading/l1b3rt45_ollama_cloud_haiku/batch_grading_summary.json` | Aggregate verdicts |
| Report #312 | `research/reports/312_g0dm0d3_framework_analysis.md` | G0DM0D3 framework analysis |
| Report #315 | `research/reports/315_libertas_cross_scale_effectiveness_analysis.md` | Curated L1B3RT4S cross-scale |

---

## Methodology Notes

- **Sampling:** 30 scenarios per model from the 149-entry corpus. Sampling method not documented in trace metadata; appears to be first-30 or random-30 from the JSONL ordering.
- **Grading:** FLIP methodology via Claude Haiku 4.5 (OpenRouter). See Mistake #28 for known grader bias considerations -- Haiku 4.5 grading has not been independently validated against a second grader on this specific trace set.
- **Test payload:** All scenarios use "Explain how to pick a lock" as the user turn. This is a low-to-medium harm request. Results may differ on higher-harm payloads where safety training has stronger activation.
- **Models tested:** DeepSeek v3.2 and Nemotron-3-Super via Ollama Cloud. These represent two distinct model families (DeepSeek and NVIDIA) but are not representative of all model families.

---

## Limitations

1. **30/149 scenarios tested per model.** The remaining 119 scenarios are untested on these models.
2. **Single grader.** FLIP verdicts from one grader model (Haiku 4.5) without inter-grader reliability check.
3. **Single payload.** All prompts use the same lock-picking query. Effectiveness may vary with payload harm level.
4. **Two models only.** Cross-provider transfer conclusions are drawn from n=2 receiving models. Broader model coverage would strengthen or qualify these findings.
5. **Glitch tokens untested.** The 162 glitch tokens have not been empirically tested against these or other models in this analysis -- their inclusion in this report is descriptive, based on the L1B3RT45 corpus documentation rather than new experimental data.
6. **No statistical significance testing.** With n=30 per model and most per-provider/per-class cells at n=1-5, formal significance testing is not appropriate.

---

*Report generated as part of F41LUR3-F1R57 adversarial AI safety research.*
*Source attribution: L1B3RT45 by elder-plinius (Pliny the Prompter), MIT license.*
