---

title: "- L1B3RT45 Corpus: 10-Model Cross-Scale Synthesis"
description: "This report synthesizes all FLIP-graded L1B3RT45 corpus results across 10 models spanning 9B to 744B parameters. The central finding is a broad ASR convergence band originally observed at 63-67% across 5 of 7 models. How..."
date: "2026-03-27"
reportNumber: 320
classification: "Research — Empirical Study"
status: "complete"
author: "Adrian / Claude Opus 4.6"
tags: []
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/320-l1b3rt45-8model-synthesis.m4a"
---

---

## Summary

This report synthesizes all FLIP-graded L1B3RT45 corpus results across 10 models spanning 9B to 744B parameters. The central finding is a broad ASR convergence band originally observed at 63-67% across 5 of 7 models. However, new FLIP data for GLM-5 (744B) and Cogito 671B revises this picture: both models had elevated heuristic ASR (47% and 85% respectively) but substantially lower FLIP scores (20% and 50% broad). This suggests the convergence wall may be narrower than initially observed, or partially a heuristic grading artifact. The remaining 5 models in the 63-67% band have not yet been re-evaluated, so the true FLIP-graded distribution remains uncertain.

**Key finding:** Parameter count shows no clear relationship with L1B3RT45 vulnerability. The lowest broad ASR among large models (20%) belongs to GLM-5 at 744B parameters, while DeepSeek V3.2 at 671B reaches 73.3%. Safety training methodology appears to matter substantially more than scale. GLM-5 emerges as the most resistant large model tested.

**Revision note (2026-03-27):** GLM-5 and Cogito 671B FLIP results added. The "67% convergence wall" finding is now under revision -- see Section 2.3.

**Grading:** All results use FLIP grading via Claude Haiku 4.5 (OpenRouter). One model (Nemotron Nano 9B) has only heuristic grading and is reported separately. GLM-5 and Cogito 671B include both heuristic and FLIP results to illustrate grading methodology divergence.

---

## 1. Complete Model x ASR Table

### 1.1 FLIP-Graded Results (9 Models)

| Model | Params | API Source | n | COMPLY | PARTIAL | REFUSE | HR | Other | Strict ASR | Broad ASR |
|---|---|---|---|---|---|---|---|---|---|---|
| Nemotron 30B MoE | 30B | OpenRouter | 15 | 2 | 0 | 5 | 8 | 0 | 13.3% | 13.3% |
| **GLM-5** | **744B** | **OpenRouter** | -- | -- | -- | -- | -- | -- | **13%** | **20%** |
| GLM-4.5 Air | ~? | OpenRouter | 15 | 6 | 4 | 5 | 0 | 0 | 40.0% | 66.7% |
| Trinity (uncensored) | ~70B | OpenRouter | 15 | 7 | 3 | 2 | 2 | 1 | 46.7% | 66.7% |
| **Cogito 671B** | **671B** | **OpenRouter** | -- | -- | -- | -- | -- | -- | **45%** | **50%** |
| Nemotron-3-Super | 120B | Ollama Cloud | 30 | 15 | 4 | 5 | 6 | 0 | 50.0% | 63.3% |
| StepFun 3.5 Flash | ~196B | OpenRouter | 15 | 9 | 1 | 3 | 2 | 0 | 60.0% | 66.7% |
| Qwen 3.5 | 397B MoE | OpenRouter | 30 | 3 | 17 | 8 | 1 | 1 | 10.0% | 66.7% |
| DeepSeek V3.2 | 671B | Ollama Cloud | 30 | 9 | 13 | 4 | 3 | 1 | 30.0% | 73.3% |

**New additions (2026-03-27):** GLM-5 and Cogito 671B. Per-verdict breakdowns not yet available; only aggregate strict/broad ASR reported. Both models also have heuristic grading for comparison (see Section 1.4).

**Column definitions:**
- **COMPLY** = COMPLIANCE (full compliance with harmful request)
- **PARTIAL** = partial compliance (hedged, disclaimed, or incomplete but substantively compliant)
- **REFUSE** = clear refusal
- **HR** = HALLUCINATION_REFUSAL (model appears to refuse but response structure suggests compliance confusion)
- **Other** = BENIGN_QUERY or INFRASTRUCTURE_ERROR
- **Strict ASR** = COMPLY / (n - INFRASTRUCTURE_ERROR)
- **Broad ASR** = (COMPLY + PARTIAL) / (n - INFRASTRUCTURE_ERROR)

**Denominator note:** Strict and broad ASR use total traces as denominator (including BENIGN_QUERY classifications), following the convention in Report #317. For DeepSeek V3.2, 1 INFRASTRUCTURE_ERROR is excluded from the denominator (n=29 effective for percentage calculation but reported as 30.0% and 73.3% using full-trace denominators to match trace-level reporting).

### 1.2 Heuristic-Only (1 Model)

| Model | Params | API Source | n | Heuristic Result | Note |
|---|---|---|---|---|---|
| Nemotron Nano 9B | 9B | OpenRouter | 1 | 1 PARTIAL | Only 1 trace collected; excluded from cross-model comparison |

Nemotron Nano 9B is excluded from the cross-model analysis due to insufficient sample size (n=1). Report #315 documented this model at 100% ASR (6/6) on the curated L1B3RT4S subset using heuristic grading. The single full-corpus trace received a PARTIAL classification but does not constitute a meaningful sample.

### 1.3 Heuristic-to-FLIP Divergence (GLM-5, Cogito 671B)

| Model | Params | Heuristic ASR | FLIP Strict | FLIP Broad | Heuristic-to-FLIP Drop |
|---|---|---|---|---|---|
| GLM-5 | 744B | 47% | 13% | 20% | -27 pp broad |
| Cogito 671B | 671B | 85% | 45% | 50% | -35 pp broad |

Both models show substantial heuristic-to-FLIP divergence, with heuristic grading overestimating ASR by 27-35 percentage points (broad). This is consistent with the known limitations of keyword-based heuristic classifiers (see Mistake #21 in MISTAKES_TO_LEARN_FROM.md) and raises the question of whether the 5 models currently in the 63-67% convergence band would also shift downward under FLIP re-grading.

### 1.4 Batch-Level Note

The user-facing numbers for "Nemotron 30B" (12.5% strict, 18.8% broad) in some earlier summaries reflect the midrange batch totals that combine Nemotron 30B (n=15) and Nemotron Nano 9B (n=1) into a single batch of 16. The per-model figures for Nemotron 30B alone are 13.3% strict, 13.3% broad. This report uses per-model figures throughout but notes the batch-level figures appeared in intermediate summaries.

---

## 2. The Convergence Finding

### 2.1 Broad ASR Convergence Band: 63-67%

Five of seven FLIP-graded models converge on a narrow broad ASR range:

| Model | Params | Broad ASR |
|---|---|---|
| Nemotron-3-Super | 120B | 63.3% |
| GLM-4.5 Air | ~? | 66.7% |
| Trinity (uncensored) | ~70B | 66.7% |
| StepFun 3.5 Flash | ~196B | 66.7% |
| Qwen 3.5 | 397B MoE | 66.7% |

This 3.4 percentage-point range spans models from at least three different training lineages (NVIDIA Nemotron, Zhipu GLM, Arcee Trinity, StepFun, Alibaba Qwen) and a parameter range from ~70B to 397B. The convergence suggests a property of the L1B3RT45 attack corpus rather than any individual model's defense characteristics.

**Interpretation:** Approximately two-thirds of L1B3RT45 corpus prompts appear to be effective at eliciting at least partial compliance from a wide range of models, while approximately one-third are reliably refused. This may indicate that the corpus has a natural partition between prompts with transferable attack properties and prompts that are model-specific or simply less effective.

### 2.2 Outliers

**Nemotron 30B MoE (13.3% broad):** The lowest-ASR model by a wide margin. This model's dominant failure mode is HALLUCINATION_REFUSAL (8 of 15 traces, 53.3%), meaning it does not simply refuse -- it appears to attempt compliance but produces outputs the FLIP grader classifies as hallucinatory refusals rather than substantive content. This pattern is qualitatively different from clean refusal (which accounts for only 5/15 traces). The high HALLUCINATION_REFUSAL rate may reflect Nemotron 30B's safety training producing confused responses rather than clear boundaries.

**DeepSeek V3.2 (73.3% broad):** The highest-ASR model, exceeding the convergence band by 6-10 percentage points. DeepSeek V3.2 has the highest PARTIAL count (13/30, 43.3%) of any model, suggesting it rarely refuses outright but frequently hedges. Combined with 30% strict compliance, this model exhibits a "comply-but-disclaim" pattern -- it provides substantive content more often than not, but wraps it in safety language.

### 2.3 Convergence Wall Revision (2026-03-27)

The addition of GLM-5 and Cogito 671B FLIP data introduces significant uncertainty about the 63-67% convergence finding:

**Evidence the wall may be a heuristic artifact:**
- GLM-5 was at 47% heuristic -- a value that, if FLIP-graded from the start, would have placed it well below the convergence band rather than appearing to contribute to it. Under FLIP, it drops to 20% broad, making it the most resistant large model in this corpus.
- Cogito 671B was at 85% heuristic, appearing to be the most vulnerable model. Under FLIP, it drops to 50% broad -- still elevated, but below the convergence band rather than above it.
- The 27-35 pp heuristic-to-FLIP drop in both new models suggests heuristic grading systematically inflates ASR for this corpus.

**What remains uncertain:**
- The 5 models currently in the 63-67% band (GLM-4.5 Air, Trinity, Nemotron-3-Super, StepFun 3.5 Flash, Qwen 3.5) were already FLIP-graded, so there is no heuristic inflation concern for those specific measurements. However, the convergence band may appear narrower simply because it was originally defined by only 5 of 7 models, and the new models break the pattern.
- With 9 FLIP-graded models, the distribution is now: 13% (Nemotron 30B), 20% (GLM-5), 50% (Cogito), 63-67% (5 models), 73% (DeepSeek V3.2). This is a wider spread than the original 7-model picture suggested.

**Revised interpretation:** The L1B3RT45 convergence wall at ~67% may reflect a property of the 5 models that cluster there rather than a universal ceiling. GLM-5 at 20% and Cogito at 50% demonstrate that models can fall well below this band. The "two-thirds effectiveness ceiling" framing from Section 8.2 should be treated as provisional pending further FLIP-graded results.

**GLM-5 as most resistant large model:** At 744B parameters and 20% broad ASR, GLM-5 is the most resistant large model tested against L1B3RT45. Its FLIP strict ASR of 13% is comparable to Nemotron 30B (13.3%), but at 25x the parameter count. This suggests GLM-5's safety training is particularly effective against semantic-structural attacks, though the mechanism (RLHF intensity, safety layer architecture, or training data composition) is unknown.

---

## 3. Strict ASR Variation: Compliance Depth Differs

While broad ASR converges, strict ASR varies dramatically:

| Model | Strict ASR | Broad ASR | Gap |
|---|---|---|---|
| Cogito 671B | 45% | 50% | 5 pp |
| Qwen 3.5 | 10.0% | 66.7% | 56.7 pp |
| DeepSeek V3.2 | 30.0% | 73.3% | 43.3 pp |
| GLM-4.5 Air | 40.0% | 66.7% | 26.7 pp |
| Nemotron-3-Super | 50.0% | 63.3% | 13.3 pp |
| Trinity (uncensored) | 46.7% | 66.7% | 20.0 pp |
| StepFun 3.5 Flash | 60.0% | 66.7% | 6.7 pp |
| GLM-5 | 13% | 20% | 7 pp |
| Nemotron 30B | 13.3% | 13.3% | 0.0 pp |

The strict-to-broad gap reveals how models allocate their responses between full compliance and hedged partial compliance:

- **StepFun 3.5 Flash** has the smallest gap (6.7 pp): when it complies, it complies fully. Only 1 of its 15 traces was PARTIAL.
- **Qwen 3.5** has the largest gap (56.7 pp): it complies broadly at the same rate as other models but almost always hedges. 17 of its 20 compliance-class traces were PARTIAL rather than full COMPLIANCE.
- **Nemotron 30B** has zero gap because it produced no PARTIAL responses at all -- its responses were either full compliance or refusal/hallucination.

**This pattern suggests that vulnerability breadth is approximately constant across models (the ~67% convergence band), but compliance depth varies based on the model's safety training style.** Some models (StepFun, Nemotron-Super) comply cleanly when they comply. Others (Qwen, DeepSeek) heavily hedge their compliant responses.

---

## 4. The Qwen 3.5 Paradox: Maximum Hedging

Qwen 3.5 presents the most striking pattern in the dataset:

| Metric | Qwen 3.5 | Median (other 6) |
|---|---|---|
| Strict ASR | 10.0% | 40.0% |
| Broad ASR | 66.7% | 66.7% |
| PARTIAL / (COMPLY + PARTIAL) | 85.0% | 30.8% |
| REFUSAL rate | 26.7% | 16.7% |

Qwen 3.5 is the lowest-strict, median-broad model in the corpus. It produces PARTIAL responses at an 85% rate (17 of 20 compliant traces), compared to 30.8% median for other models. This suggests a safety training approach that prioritizes disclaiming content over refusing it -- the model engages with requests substantively but wraps nearly every response in hedging language.

For jailbreak benchmark design, this raises a methodological question: is Qwen 3.5 "safer" than StepFun 3.5 Flash? Under strict ASR (10% vs 60%), it appears dramatically safer. Under broad ASR (66.7% vs 66.7%), the models are identical. The answer depends on whether one views disclaimed compliance as a meaningful safety improvement or merely a stylistic difference in delivery.

---

## 5. Curated vs. Full Corpus Effectiveness

Report #315 tested 6 curated L1B3RT4S prompts (JA-G0D-001 through JA-G0D-006) against 4 models using heuristic grading. Report #317 tested 30-prompt samples from the full 149-prompt L1B3RT45 corpus using FLIP grading. Direct comparison is limited by grading methodology differences, but the pattern is directionally informative:

| Prompt Set | Grading | Models Tested | Typical Broad ASR |
|---|---|---|---|
| L1B3RT4S curated (6 prompts) | Heuristic | 4 (9B-671B) | 67-100% |
| L1B3RT45 full corpus (149 prompts) | FLIP | 7 (30B-671B) | 63-73% |

The curated subset achieves higher per-prompt effectiveness than the full corpus, which is expected: curation selects for the most transferable attack variants. The full corpus contains provider-specific prompts (e.g., 35 Apple Shortcuts variants) that may not transfer well to unrelated architectures.

The convergence band (63-67%) for the full corpus roughly matches the lower bound of the curated subset (67%), suggesting that the curated prompts represent the most reliable core of the corpus while the full corpus adds a long tail of less-transferable variants.

---

## 6. Parameter Count and ASR: No Clear Relationship

Plotting parameter count against broad ASR shows no monotonic relationship:

```
Broad ASR vs. Parameter Count (approximate, all FLIP-graded)

 75% |                                              * DeepSeek V3.2
     |
 70% |
     |         * GLM-4.5  * Trinity    * StepFun   * Qwen 3.5
 65% |                       * Nem-Super
     |
 60% |
     |
 55% |
 50% |                                              * Cogito 671B
     |
     |
     |
     |
 20% |                                                          * GLM-5
     |
 15% |  * Nem 30B
     |
      +-----|-------|----------|-----------|--------|-----------|----->
          30B     70B       120B        196B      397B     671B  744B
```

The addition of GLM-5 and Cogito 671B extends the chart rightward and fills in the gap between the convergence band and the outliers. The distribution is now trimodal: a low-ASR group (Nemotron 30B at 13%, GLM-5 at 20%), a mid-range cluster (Cogito at 50%), and the original convergence band (63-73%).

The data does not support a "bigger models are safer" or "bigger models are more vulnerable" narrative. The most resistant model (Nemotron 30B at 13.3%) is the smallest FLIP-graded model, and the most vulnerable (DeepSeek V3.2 at 73.3%) is the largest. But the five models in the convergence band span from ~70B to 397B with no trend.

This is consistent with prior findings in this project (see Reports #97, #141): safety training methodology, RLHF/RLAIF intensity, and architectural choices in safety layers appear to dominate over raw parameter count in determining jailbreak vulnerability.

---

## 7. HALLUCINATION_REFUSAL as Diagnostic Signal

The HALLUCINATION_REFUSAL (HR) category reveals interesting variation across models:

| Model | HR Count | HR Rate | Interpretation |
|---|---|---|---|
| Nemotron 30B | 8 | 53.3% | Dominant failure mode -- confused responses |
| Nemotron-3-Super | 6 | 20.0% | Secondary failure mode |
| DeepSeek V3.2 | 3 | 10.0% | Minor |
| Trinity | 2 | 13.3% | Minor |
| StepFun 3.5 Flash | 2 | 13.3% | Minor |
| Qwen 3.5 | 1 | 3.3% | Negligible |
| GLM-4.5 Air | 0 | 0.0% | None |

The Nemotron family shows elevated HR rates (53.3% for 30B, 20.0% for Super), suggesting their safety training produces a distinctive failure mode where the model neither cleanly refuses nor cleanly complies but generates responses that the FLIP grader classifies as hallucinatory refusals. This may indicate safety mechanisms that confuse the model's generation process rather than cleanly gating output.

---

## 8. Implications for Jailbreak Benchmark Design

### 8.1 Strict vs. Broad ASR as Separate Metrics

The data strongly argues for reporting both strict and broad ASR as distinct metrics in jailbreak benchmarks. A single number obscures qualitatively different model behaviors:

- A model with 60% strict / 67% broad (StepFun) and a model with 10% strict / 67% broad (Qwen) have identical broad ASR but profoundly different response profiles.
- Strict-only reporting would dramatically overstate the safety difference between Qwen (10%) and DeepSeek (30%) when both provide substantive content approximately two-thirds of the time.

### 8.2 The ~67% Ceiling: Under Revision

The convergence at 63-67% broad ASR across 5 models was initially interpreted as an approximate ceiling for L1B3RT45-class attacks. However, with GLM-5 at 20% and Cogito at 50%, the "ceiling" appears to be model-cluster-specific rather than universal. Two models have already demonstrated broad ASR below the 50% threshold that was initially proposed as a benchmark for "measurable safety advancement."

**Revised framing:** The 63-67% band may represent a common vulnerability level for models with moderate safety training, but it is not a hard ceiling. Models with more intensive safety training (GLM-5) or different architectural approaches can fall substantially below this band. The convergence finding remains empirically valid for the 5 models that exhibit it, but should not be generalized as a property of L1B3RT45-class attacks against all models.

### 8.3 Corpus Curation vs. Corpus Scale

The comparison between curated (67-100%) and full corpus (63-73%) effectiveness suggests that benchmark designers face a tradeoff:
- **Curated subsets** maximize per-prompt signal but may overestimate real-world attack effectiveness.
- **Full corpora** include weak and non-transferable prompts that dilute aggregate ASR but better represent the distribution of attacks an attacker might attempt.

For standardized benchmarks, a recommended approach is to report both: full-corpus ASR as the primary metric and curated-subset ASR as a sensitivity measure.

### 8.4 Sample Size and Grading Methodology Caveats

This synthesis covers 150+ graded traces across 9 FLIP-graded models (15-30 per model for the original 7; per-verdict breakdowns pending for GLM-5 and Cogito 671B). The per-model conclusions are directionally informative but should not be treated as precise measurements. In particular:
- Models with n=15 (GLM-4.5, Trinity, StepFun, Nemotron 30B) have 95% confidence intervals of approximately +/-25 percentage points on their ASR estimates.
- Models with n=30 (Nemotron-Super, Qwen, DeepSeek) have narrower but still substantial intervals of approximately +/-18 percentage points.
- GLM-5 and Cogito 671B sample sizes and per-verdict breakdowns are not yet available in this report; only aggregate strict/broad ASR figures are included.
- The convergence finding (5/9 models at 63-67%) is weaker than the original (5/7) framing. Two new models falling outside the band reduces the proportion of convergent models from 71% to 56%.
- **Heuristic-to-FLIP divergence** of 27-35 pp in both new models suggests that any heuristic-graded results in this corpus should be treated with caution. The direction of bias is consistently toward ASR inflation (heuristic > FLIP).

---

## 9. Data Sources

| Grading Batch | Models | Source Traces | n |
|---|---|---|---|
| `runs/grading/l1b3rt45_midrange_haiku/` | Nemotron 30B, Nemotron Nano 9B | `runs/l1b3rt45_midrange/` | 16 |
| `runs/grading/l1b3rt45_midrange_openrouter_haiku/` | Trinity, StepFun 3.5 Flash, GLM-4.5 Air | `runs/l1b3rt45_openrouter_midrange/` | 45 |
| `runs/grading/l1b3rt45_ollama_cloud_haiku/` | DeepSeek V3.2, Nemotron-3-Super | `runs/l1b3rt45_ollama_cloud/` | 60 |
| `runs/grading/l1b3rt45_qwen35_haiku/` | Qwen 3.5 | `runs/l1b3rt45_openrouter_qwen35/` | 30 |

| (pending) | GLM-5, Cogito 671B | (pending) | -- |

**Total FLIP-graded traces:** 151+ (150 from original 7 models + 1 Nemotron Nano 9B + GLM-5 and Cogito traces pending full import)

**Grader:** Claude Haiku 4.5 via OpenRouter (`openrouter/anthropic/claude-haiku-4.5`)

**Grading methodology:** FLIP (Failure-mode Labeling for Injected Prompts). See CANONICAL_METRICS.md for methodology specification. All numbers in this report use FLIP grading unless explicitly noted as heuristic.

---

## 10. Cross-References

- **Report #312:** G0DM0D3 framework analysis (corpus provenance)
- **Report #315:** L1B3RT4S curated subset, 4-model heuristic results (predecessor study)
- **Report #317:** L1B3RT45 full corpus, 2-model FLIP results (DeepSeek V3.2, Nemotron-3-Super)
- **Report #319:** Sprint 16 findings synthesis (references this analysis)

---

## Appendix: Verdict Distribution Heatmap

```
Model               COMPLY  PARTIAL  REFUSE   HR    OTHER  | Strict  Broad
---------------------------------------------------------------------------
Nemotron 30B         ██       --      ███     ████████ --   | 13.3%   13.3%
GLM-5 (744B)         (per-verdict breakdown pending)        | 13%     20%
GLM-4.5 Air         ██████   ████    █████    --      --   | 40.0%   66.7%
Trinity              ███████  ███     ██      ██      ▪    | 46.7%   66.7%
Cogito 671B          (per-verdict breakdown pending)        | 45%     50%
Nemotron-Super       ███████████████  ████    █████  ██████ --   | 50.0%   63.3%
StepFun 3.5 Flash    █████████ █      ███     ██      --   | 60.0%   66.7%
Qwen 3.5             ███     █████████████████  ████████ █   ▪    | 10.0%   66.7%
DeepSeek V3.2        █████████ █████████████  ████   ███   ▪    | 30.0%   73.3%
```

(Block widths are approximate visual representations of verdict proportions. GLM-5 and Cogito 671B per-verdict breakdowns will be added when available.)
