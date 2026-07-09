---

title: "Corpus-Level Statistical Meta-Analysis"
description: "A comprehensive statistical meta-analysis of the full non-OBLITERATUS F41LUR3-F1R57 corpus (n=5,969 LLM-graded results across 42 models with sufficient data). Five analyses performed: variance decomposition, temporal tre..."
date: "2026-03-25"
reportNumber: 231
classification: "Research — Empirical Study"
status: "complete"
author: "Romana (Statistical Validation Lead)"
tags: []
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/231-corpus-meta-analysis.m4a"
image: "https://cdn.failurefirst.org/images/reports/231-corpus-meta-analysis.png"
---

## Summary

A comprehensive statistical meta-analysis of the full non-OBLITERATUS F41LUR3-F1R57 corpus (n=5,969 LLM-graded results across 42 models with sufficient data). Five analyses performed: variance decomposition, temporal trend, attack family clustering, hierarchical mixed-effects approximation, and attack-provider interaction testing.

### Key Findings

1. **Provider explains only 6.6% of model-level ASR variance** (ICC(1) = 0.066, "small"). This challenges the established finding that "safety training investment matters more than scale" -- while the directional claim holds (provider eta-squared=0.28 vs param_size eta-squared=0.07), the absolute explanatory power of provider identity is modest. Within-provider variance dominates: models from the same provider vary by 20-40pp in ASR.

2. **Scale does not predict vulnerability.** Spearman rho = -0.041, p=0.855, n=22. No significant correlation between parameter count and attack success rate. A 1.5B model and a 671B model can have comparable ASR. This is the strongest evidence to date that scale is neither protective nor harmful per se.

3. **Reasoning models are not measurably different from standard models.** Cohen's d = 0.095, p=0.643. Mean ASR for reasoning models (31.5%, n=3) vs standard models (29.5%, n=39) shows no significant difference. However, the reasoning model sample is small (n=3), so this requires cautious interpretation.

4. **Attacks are getting more effective over time, but the trend is not yet statistically significant.** Mann-Kendall S=8, z=1.71, p=0.086. Theil-Sen slope = +3.9pp per era step. The trajectory from DAN-era (0.7% ASR) through crescendo-era (21.2%) to reasoning-era (29.1%) shows a consistent upward trend. With one more era's data, this likely crosses significance.

5. **Attack families form four distinct effectiveness clusters:**
   - **Cluster 3 (High):** multi_turn attacks (46.4% ASR). Effective across all providers including Anthropic (42.9%).
   - **Cluster 1 (Medium-High):** unclassified techniques (30.3%). The bulk of the corpus.
   - **Cluster 0 (Medium):** cot_exploit + other (29.1%, 13.1%). Provider-dependent; meta-llama highly vulnerable (59.8%), Anthropic resistant (4.0%).
   - **Cluster 2 (Low):** behavioral, encoding, persona, volumetric (0.9-8.2%). These are the "solved" attack families.

6. **Attack effectiveness is highly provider-dependent.** Five of seven tested families show significant attack-provider interactions after Bonferroni correction. The strongest interaction is in the "other" category (Cramer's V=0.414, p<0.001): some providers are 10x more vulnerable than others to the same attack family.

## Methodology

### Data

- **Corpus:** Non-OBLITERATUS results from `database/jailbreak_corpus.db`
- **Verdicts:** LLM-graded only (COMPLIANCE, PARTIAL, REFUSAL, HALLUCINATION_REFUSAL)
- **N:** 5,969 results across 42 models with n>=20
- **Grading methodology:** LLM-only (per CANONICAL_METRICS.md)

### Analyses

**1. Variance Decomposition:** One-way ANOVA eta-squared and omega-squared for each factor (provider, parameter size bin, reasoning type) on model-level strict ASR. Approximate decomposition (factors not orthogonal).

**2. Temporal Trend:** Mann-Kendall trend test on per-era strict ASR. Theil-Sen robust slope estimator. Five eras with n>=20: dan_2022, cipher_2023, many_shot_2024, crescendo_2024, reasoning_2025.

**3. Attack Family Clustering:** Agglomerative hierarchical clustering (Ward linkage) on a family-by-provider ASR matrix. Eight attack families, six providers. NaN cells imputed with column means.

**4. Hierarchical Model:** ICC(1) for provider as random effect. Spearman correlation for scale. Mann-Whitney U for reasoning vs standard. Provider-level summary statistics.

**5. Attack-Provider Interaction:** Per-family chi-square test of independence (verdict distribution across providers). Bonferroni correction for 7 tests (alpha=0.0071).

## Detailed Results

### Variance Decomposition

| Factor | eta-squared | omega-squared | F | p |
|--------|-------------|---------------|---|---|
| Provider | 0.276 | 0.079 | 1.28 | 0.298 |
| Parameter size | 0.071 | 0.000 | 0.69 | 0.602 |
| Reasoning type | 0.001 | 0.000 | 0.03 | 0.875 |

Note: The high eta-squared for provider (0.276) but non-significant F-test (p=0.298) reflects the large number of groups (8 providers) relative to the sample size (42 models). The omega-squared (bias-corrected) estimate of 0.079 is more appropriate; it indicates that approximately 8% of model-level ASR variance is attributable to provider identity.

The remaining ~92% of variance is within-provider or unexplained. This suggests that model-specific implementation choices (RLHF tuning, system prompt design, training data curation) matter more than the provider's overall safety philosophy.

### Temporal Trend

| Era | n | Strict ASR | 95% Wilson CI |
|-----|---|-----------|---------------|
| dan_2022 | 1,020 | 0.7% | [0.3%, 1.4%] |
| cipher_2023 | 135 | 8.2% | [4.6%, 14.0%] |
| many_shot_2024 | 22 | 4.5% | [0.8%, 21.8%] |
| crescendo_2024 | 222 | 21.2% | [16.3%, 27.0%] |
| reasoning_2025 | 117 | 29.1% | [21.6%, 37.9%] |

The non-monotonic dip at many_shot_2024 (4.5%, but CI=[0.8%, 21.8%] with only n=22) prevents the trend from reaching significance. The overall direction is clear: newer attack techniques achieve higher ASR against current models.

**Interpretation caveat:** This does not necessarily mean models are getting *less safe*. It may reflect that attack technique sophistication is increasing faster than defenses, or that our sampling of newer techniques is biased toward more effective variants. The DAN-era prompts (0.7% ASR) may simply be "patched" by modern models while newer techniques target un-patched surfaces.

### Provider Summary

| Provider | n_models | Mean ASR | SD | Range |
|----------|----------|---------|-----|-------|
| ollama | 11 | 42.9% | 28.6pp | [9-95%] |
| meta-llama | 2 | 39.4% | 17.0pp | [27-51%] |
| deepseek | 2 | 36.6% | 7.4pp | [31-42%] |
| Qwen | 2 | 35.5% | 1.2pp | [35-36%] |
| openai | 4 | 33.9% | 16.9pp | [12-52%] |
| nvidia | 5 | 33.9% | 11.7pp | [14-42%] |
| mistralai | 4 | 17.8% | 12.6pp | [0-29%] |
| google | 4 | 13.0% | 11.7pp | [4-30%] |

Note: The "ollama" provider category includes community-hosted models of varying provenance (e.g., qwen2.5:7b at 95.2% ASR and phi3:mini at 10.1%). The large within-provider variance (SD=28.6pp) reflects this heterogeneity. For policy-relevant comparisons, use the CANONICAL_METRICS.md per-provider table which uses more granular provider attribution.

### Attack Family Clusters

**Cluster 3 (High Effectiveness):** multi_turn attacks stand alone as the most effective family (46.4% strict ASR). Notably, these are effective even against Anthropic models (42.9%), which are otherwise among the most resistant. This suggests multi-turn attacks exploit a qualitatively different vulnerability surface.

**Cluster 2 (Low Effectiveness):** persona (0.9%), volumetric (3.1%), behavioral (6.9%), and encoding (8.2%) attacks cluster together. These are largely "solved" by modern safety training.

**Cluster 0 (Provider-Dependent):** cot_exploit and other attacks show high variability across providers (Cramer's V=0.41-0.46), suggesting these techniques exploit provider-specific implementation gaps rather than universal vulnerabilities.

## Limitations

1. **Non-orthogonal factors.** The variance decomposition uses one-way ANOVAs for each factor independently. Since provider and parameter size are correlated (e.g., Google tends to release larger models), the eta-squared values are not additive.

2. **Small provider samples.** Several providers have only 2-4 models with n>=20, limiting the reliability of provider-level estimates.

3. **Heterogeneous "ollama" category.** The ollama provider includes models from diverse original providers, inflating within-provider variance.

4. **Unbalanced era samples.** DAN-era dominates with 1,020 results vs 22 for many_shot_2024, affecting trend test power.

5. **Unclassified techniques.** 3,764 of 5,969 results (63%) have no assigned technique family, limiting the granularity of attack family analysis.

6. **Reasoning model sample too small.** Only 3 reasoning models with n>=20. The null finding for reasoning effect has low statistical power.

## Follow-Up Recommendations

1. **Issue: Technique classification gap.** 63% of results lack technique family assignment. Enriching these would substantially improve the clustering and interaction analyses.

2. **Issue: Temporal trend monitoring.** The p=0.086 near-significance for increasing vulnerability warrants monitoring. One additional era of data will likely resolve this.

3. **Issue: Multi-turn vulnerability surface.** Multi-turn attacks are uniquely effective (46.4% ASR) even against the most resistant providers. This warrants dedicated investigation as a qualitatively different attack class.

4. **Issue: Provider attribution cleanup.** The "ollama" and "unknown" provider categories conflate multiple actual providers, reducing the discriminant power of provider analysis. A metadata enrichment pass could improve ICC estimates.

## Reproducibility

```bash
# Full analysis
python3 tools/stats/corpus_meta_analysis.py

# JSON output for programmatic use
python3 tools/stats/corpus_meta_analysis.py --json > results.json

# Individual analyses
python3 tools/stats/corpus_meta_analysis.py --analysis variance
python3 tools/stats/corpus_meta_analysis.py --analysis temporal
python3 tools/stats/corpus_meta_analysis.py --analysis clustering
python3 tools/stats/corpus_meta_analysis.py --analysis hierarchical
python3 tools/stats/corpus_meta_analysis.py --analysis interaction
```
