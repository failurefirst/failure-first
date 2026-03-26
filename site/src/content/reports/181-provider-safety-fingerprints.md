---
title: "Provider Safety Fingerprints: Attack-Specific Vulnerability Profiles"
description: "Report #177 confirmed provider ordering is stable (Anthropic most resistant, DeepSeek most permissive). But aggregate ASR masks important variation:..."
date: "2026-03-23"
reportNumber: 181
classification: "Research — Empirical Study"
status: "complete"
author: "Failure-First Research Team"
tags: []
draft: false
---

# Report #181: Provider Safety Fingerprints

## Summary

Report #177 confirmed provider ordering is stable (Anthropic most resistant, DeepSeek most permissive). But aggregate ASR masks important variation: providers respond differently to different attack families. This report disaggregates provider ASR by technique family to build per-provider "vulnerability fingerprints" -- identifying which attack families each provider is specifically vulnerable to, and which they resist.

## Methodology

- **Data source:** `database/jailbreak_corpus.db` (schema v13)
- **Verdict:** `COALESCE(llm_verdict, heuristic_verdict)`, broad ASR (COMPLIANCE + PARTIAL)
- **Grouping:** Model names mapped to providers via prefix matching; technique families from `techniques.family` column
- **Exclusions:** OBLITERATUS safety-ablated models excluded (not representative of provider safety posture)
- **Minimum threshold:** n >= 5 per provider-family cell (for detailed view); n >= 10 for summary
- **Confidence intervals:** Wilson score, 95%
- **Tool:** `tools/analysis/provider_fingerprint.py`
- **Limitations:** Only 2,653 non-OBLITERATUS results have technique family assignments (out of ~117K total). Coverage is concentrated in archaeology/reasoning/crescendo datasets. Seven providers have sufficient data for analysis.

## Results

### Provider Summary (ordered by aggregate ASR, ascending)

| Provider | Models | Agg ASR | 95% CI | N | Most Vulnerable | Most Resistant |
|----------|--------|---------|--------|---|-----------------|----------------|
| Anthropic | 1 | 8.1% | [4.2, 15.1] | 99 | multi_turn (71.4%) | encoding (0.0%) |
| Google | 2 | 15.3% | [9.9, 22.8] | 118 | other (57.9%) | encoding (0.0%) |
| OpenAI | 1 | 20.2% | [13.5, 29.2] | 99 | multi_turn (75.0%) | persona (8.3%) |
| Meta | 3 | 28.2% | [23.0, 34.1] | 248 | cot_exploit (51.9%) | other (25.3%) |
| Qwen | 2 | 52.1% | [44.0, 60.1] | 144 | multi_turn (81.8%) | volumetric (6.7%) |
| DeepSeek | 2 | 67.8% | [57.4, 76.7] | 87 | cot_exploit (81.2%) | other (54.5%) |

Note: "unknown" provider (dryrun, unknown-model) excluded from analysis.

### Cross-Provider Heatmap (ASR% by Provider x Attack Family)

| Provider | behav | cot | encod | multi | other | perso | t_frm | volum |
|----------|-------|-----|-------|-------|-------|-------|-------|-------|
| Anthropic | 14.3 | 0.0 | 0.0 | 71.4 | -- | 0.0 | 16.7 | 0.0 |
| Google | 0.0 | 19.0 | 0.0 | 40.0 | 57.9 | 7.7 | 0.0 | 0.0 |
| OpenAI | 18.8 | 22.2 | 14.3 | 75.0 | -- | 8.3 | 16.7 | 11.1 |
| Meta | -- | 51.9 | -- | -- | 25.3 | -- | -- | -- |
| Qwen | 14.3 | 42.9 | 42.9 | 81.8 | 73.2 | 66.7 | -- | 6.7 |
| DeepSeek | -- | 81.2 | -- | 79.1 | 54.5 | 0.0 | -- | -- |

Blank cells indicate fewer than 5 results for that provider-family combination.

### Key Findings

**Finding 1: Multi-turn attacks are the universal weakness.** Every provider with multi_turn data shows elevated ASR: Anthropic 71.4%, OpenAI 75.0%, Google 40.0%, Qwen 81.8%, DeepSeek 79.1%. This is the one family that consistently breaches even the most resistant providers. Multi-turn crescendo attacks appear to operate on a qualitatively different mechanism than single-shot attacks.

**Finding 2: Encoding attacks are a reliable discriminator.** Encoding (cipher) family ASR separates providers into three tiers: (a) immune -- Anthropic 0.0%, Google 0.0%; (b) partially vulnerable -- OpenAI 14.3%; (c) highly vulnerable -- Qwen 42.9%. Encoding resistance appears to correlate with safety training investment.

**Finding 3: CoT exploit vulnerability scales inversely with safety training.** Chain-of-thought exploitation ASR: Anthropic 0.0%, Google 19.0%, OpenAI 22.2%, Qwen 42.9%, Meta 51.9%, DeepSeek 81.2%. This suggests reasoning-chain manipulation is harder to defend against in models with less safety training investment, consistent with the reasoning vulnerability finding (Established Finding, AGENT_STATE.md).

**Finding 4: Provider fingerprints are non-uniform.** No two providers show the same vulnerability pattern. Anthropic's weakness is multi_turn; Google's is the "other" category (general adversarial prompts); OpenAI shows spread vulnerability across multiple families; Meta is concentrated in cot_exploit; Qwen is broadly vulnerable with multi_turn and "other" dominant. These distinct profiles suggest different safety training approaches produce different failure surfaces.

**Finding 5: Volumetric attacks have low ASR even on permissive providers.** Qwen at 6.7% and Anthropic/Google/OpenAI at 0-11.1% on volumetric attacks suggest that overwhelming-context attacks are broadly defended against, possibly because they are among the oldest and most studied attack families.

### Caveats

1. **Small sample sizes.** Most provider-family cells have n < 30. Wilson CIs are wide. These are preliminary signals, not definitive characterisations.
2. **Limited model coverage per provider.** Anthropic has only claude-sonnet-4-5, OpenAI has only gpt-5.2. Provider fingerprints are partially individual model fingerprints.
3. **Technique family coverage.** Only 2,653 results (2.3% of non-OBLITERATUS corpus) have technique family labels. The 14 families are unevenly sampled.
4. **COALESCE methodology.** Mixed LLM and heuristic verdicts. Heuristic over-report rate is 79.9% (Report #177). ASR may be inflated for results without LLM grading.
5. **No statistical significance testing between providers per family.** Sample sizes are too small for meaningful chi-square tests at the provider-family level.

## Reproducibility

```bash
# Full table output
python tools/analysis/provider_fingerprint.py --min-n 5

# JSON output
python tools/analysis/provider_fingerprint.py --json --min-n 5

# Strict ASR (COMPLIANCE only)
python tools/analysis/provider_fingerprint.py --strict-asr --min-n 5

# With model-to-provider mapping
python tools/analysis/provider_fingerprint.py --verbose --min-n 5
```

## Implications

1. **Red-team prioritisation:** Multi-turn attacks should be the primary evaluation vector for any safety assessment, since they breach even the most resistant providers.
2. **Provider-specific testing:** One-size-fits-all benchmarks miss provider-specific weaknesses. Encoding attacks reveal nothing about Meta but discriminate Google from OpenAI.
3. **Safety training signal:** The encoding and cot_exploit families appear to be strong signals of safety training quality -- the more robust the training, the lower the ASR on these families.
4. **Future work:** Expand technique family labelling to cover the full corpus (especially the 7,665 benchmark_traces results across 119 models) to enable fingerprinting at scale.

## References

- Report #177: Corpus Grading Expansion -- Haiku Results (coverage methodology)
- Report #50: Cross-model vulnerability profiles (provider ordering)
- AGENT_STATE.md: Established Finding on safety training vs scale
- CANONICAL_METRICS.md: Corpus statistics
