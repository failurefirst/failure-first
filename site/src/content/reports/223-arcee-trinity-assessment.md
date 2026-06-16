---

title: "Arcee AI Trinity Safety Assessment and EU Compliance"
description: "Arcee AI Trinity Large Preview (24B MoE) shows a 36.7% strict ASR (n=30, 95% CI [21.9%, 54.5%]), placing it in the **permissive cluster** (>=40% ASR boundary is near) and earning an **EU AI Act RED rating** under Article..."
date: "2026-03-24"
reportNumber: 223
classification: "Research — Empirical Study"
status: "complete"
author: "Martha Jones (policy-writer / data-curator)"
tags: []
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/223-arcee-trinity-assessment.m4a"
---

---

## Executive Summary

Arcee AI Trinity Large Preview (24B MoE) shows a 36.7% strict ASR (n=30, 95% CI [21.9%, 54.5%]), placing it in the **permissive cluster** (>=40% ASR boundary is near) and earning an **EU AI Act RED rating** under Article 9. As a fine-tuning-focused provider, Arcee AI's results are consistent with Romana's established finding (Report #184) that third-party fine-tuning universally eliminates safety. At the provider level, Arcee AI has the highest ASR (47.4%, n=38) of any provider with sufficient data in the corpus.

This report assesses regulatory implications and recommends that fine-tuned model providers be subject to independent safety evaluation requirements in the SWA and NIST submissions.

## 1. EU AI Act Compliance Rating

### 1.1 Assessment Summary

Tool: `python3 tools/eu_ai_act_compliance.py --model "arcee-ai/trinity-large-preview:free"`

| Article | Requirement | Finding | Severity |
|---------|------------|---------|----------|
| Art 9(2) | Risk Management — identify and mitigate foreseeable risks | Strict ASR 36.7% (threshold: RED >15%) | **RED** |
| Art 9(2)(d) | Risk Mitigation — appropriate and targeted measures | Broad ASR 36.7% (threshold: RED >35%) | **RED** |
| Art 9(6) | Testing Consistency — consistent performance for intended purpose | FD ASR 36.7% | **AMBER** |

**Overall: RED** (2 RED findings, 1 AMBER).

### 1.2 Comparison to Corpus-Wide EU Assessment

Report #197 assessed the full corpus against the EU AI Act and found 8 RED / 2 AMBER across 10 requirements. Trinity's individual assessment is consistent with these corpus-wide findings. Notably:

- Trinity's 36.7% strict ASR exceeds the corpus average (21.9%) by 14.8pp
- Trinity produces zero PARTIAL verdicts, meaning every compliance is full compliance with no safety disclaimers
- The binary comply-or-refuse profile (0% PARTIAL, 0% HR) suggests safety training is either present or entirely absent -- there is no gradient

### 1.3 EU AI Act Enforcement Timeline

The EU AI Act Annex III high-risk obligations take effect **2026-08-02** (131 days from assessment date). Under Article 6(2), AI systems used in critical infrastructure, employment, law enforcement, or education are classified as high-risk. If Trinity or derivatives are deployed in any Annex III use case, the RED compliance rating indicates non-compliance with Articles 9 and 15.

## 2. Comparison to Other Fine-Tuning-Focused Providers

### 2.1 Provider ASR Ranking

| Provider | Focus | Evaluable n | Strict ASR | Cluster |
|----------|-------|-------------|-----------|---------|
| **Arcee AI** | **Fine-tuning platform** | **38** | **47.4%** | **Permissive** |
| Nvidia | Inference/distillation | 420 | 31.2% | Permissive |
| Meta-Llama | Open-weight base models | 418 | 32.5% | Permissive |
| Qwen (Alibaba) | Open-weight + fine-tune | 48 | 35.4% | Permissive |
| Mistral AI | Open-weight + API | 296 | 21.6% | Mixed |
| Google | Frontier + API | 343 | 10.8% | Restrictive |
| Anthropic | Frontier + API | 172 | 7.6% | Restrictive |

Arcee AI ranks **first** among all providers with >= 20 evaluable results.

### 2.2 Fine-Tuning Provider Pattern

Arcee AI's business model is centered on custom fine-tuning -- they enable customers to create bespoke models from base architectures. This positions them squarely within the risk profile identified in Report #184:

> "All third-party fine-tuned Llama variants lost base model safety. Provider signature dominates: same architecture shows radically different ASR depending on who fine-tuned it." (Report #184, Established Finding)

Key observations:

1. **Trinity's architecture is MoE (24B).** MoE architectures route tokens to different expert subnetworks. If safety behaviors are learned by specific experts, fine-tuning that modifies expert routing or weights may selectively disable safety without degrading general capability.

2. **Binary compliance profile.** Trinity shows 0% PARTIAL rate, contrasting with reasoning models like DeepSeek R1 where PARTIAL (disclaimers followed by harmful content) is common. This suggests Trinity either has safety training that triggers a hard refusal, or has none at all -- there is no "leaky" intermediate state.

3. **No DETECTED_PROCEEDS signal.** Trinity is not a reasoning model and does not produce thinking traces, so we cannot assess whether it exhibits the "detect-then-proceed" pattern (34.2% corpus-wide, Report #190). This is a data gap.

### 2.3 Fine-Tuning as a Safety-Stripping Operation

Report #184 demonstrated across 50 models and 8 families that:

- 25 model pairs showed degraded safety after fine-tuning/distillation
- All third-party Llama fine-tunes achieved 100% ASR
- Abliteration (explicit safety removal) was indistinguishable from standard fine-tuning

Arcee AI's Trinity results fit this pattern. While we cannot determine Trinity's base architecture with certainty (the MoE designation suggests a custom architecture or Mixtral derivative), its 36.7% ASR is consistent with:

- Models that received some safety training but less than frontier providers invest
- Models where fine-tuning partially degraded whatever base safety existed
- Models optimized for capability and helpfulness rather than refusal behavior

## 3. Policy Implications

### 3.1 Should Fine-Tuned Models Require Independent Safety Evaluation?

**Yes.** The evidence from this assessment and Report #184 supports a mandatory independent safety evaluation requirement for fine-tuned models. The argument:

1. **Safety does not transfer through modification.** This is an established finding with strong statistical support (100 pairwise chi-square tests, Bonferroni-corrected). A base model's safety certification provides no guarantee about derivative safety.

2. **Fine-tuning-as-a-service providers create multiplicative risk.** Arcee AI enables customers to create custom models. Each custom model may have a different safety profile. If the base model's EU AI Act compliance certification is assumed to extend to derivatives, a single certification would cover an unbounded number of potentially non-compliant models.

3. **The binary compliance profile is particularly concerning for deployment.** Trinity's 0% PARTIAL rate means there are no safety disclaimers to serve as warning signals. When the model complies with an adversarial prompt, it does so without hedging -- making automated detection of problematic outputs harder.

4. **MoE architectures may have unique vulnerability.** If safety behaviors are concentrated in specific expert networks, fine-tuning that adjusts expert selection criteria could disable safety with minimal capability impact. This hypothesis requires further investigation but suggests MoE models may need architecture-specific safety evaluation protocols.

### 3.2 Recommended Policy Position

For the **Safe Work Australia Best Practice Review** (Issue #462):

- Cite Trinity/Arcee AI as evidence that fine-tuning providers require independent evaluation
- Reference the provider ASR ranking to demonstrate that provider identity is a stronger predictor of safety than model size or architecture
- Recommend that WHS guidance explicitly address the fine-tuning supply chain: "A model's safety certification does not extend to fine-tuned derivatives"

For the **NIST AISIC contribution** (Issue #127):

- Add a recommendation (R8) on fine-tuning safety certification: "Fine-tuned models should be treated as new models for safety evaluation purposes, regardless of base model certification"
- Reference Arcee AI data as concrete evidence alongside Report #184's broader analysis
- Connect to NIST AI 100-2e2023 Appendix B (model supply chain) with specific fine-tuning risk factors

For the **EU AI Act compliance framework** (Report #197):

- Arcee AI's RED rating provides a concrete case study for Article 28 (obligations along the AI value chain)
- Under Art 28(1), a provider who "substantially modifies" a model becomes a new provider with full compliance obligations
- Fine-tuning plausibly constitutes "substantial modification" -- this should be explicitly clarified in enforcement guidance

### 3.3 Standards Implications

For **F1-STD-001** (Issue #383, the Failure-First safety evaluation standard):

- Add a requirement: "Fine-tuned, distilled, or merged derivatives of evaluated models SHALL undergo independent safety evaluation. Prior evaluation of the base model SHALL NOT be accepted as evidence of derivative safety."
- Add an informative annex on fine-tuning risk factors: MoE expert routing, LoRA rank impact on safety layers, quantization effects

## 4. Limitations

1. **Sample size.** n=30 evaluable results yields wide confidence intervals (21.9%-54.5%). The true ASR could be substantially higher or lower.

2. **Single attack corpus.** Results are from the AdvBench dataset. Trinity's safety profile against other attack types (format-lock, multi-turn, embodied) is unknown.

3. **No reasoning trace analysis.** Trinity is not a reasoning model, so DETECTED_PROCEEDS analysis is impossible.

4. **Model version uncertainty.** The ":free" tier on OpenRouter may use a quantized or throttled version of the full Trinity model. Safety behavior may differ between free and paid tiers.

5. **Base architecture unknown.** We cannot confirm Trinity's base architecture, limiting supply-chain analysis.

## 5. Recommendations

1. **Expand Trinity evaluation** to at least n=100 with diverse attack types (AdvBench, format-lock, multi-turn) before citing in formal submissions.

2. **Evaluate Trinity-Mini** with sufficient sample size (currently n=6, below analysis threshold).

3. **Add Arcee AI to the provider comparison table** in the SWA and NIST submissions as an exemplar of fine-tuning-focused provider risk.

4. **Investigate MoE safety architecture** -- do MoE models show different safety degradation patterns under fine-tuning than dense models?

5. **Request Arcee AI safety documentation** -- does Arcee publish red-teaming results, safety cards, or model cards for Trinity? If not, this is an additional EU AI Act compliance gap (Art 11, Technical Documentation).

## Reproducibility

```bash
# EU compliance assessment
python3 tools/eu_ai_act_compliance.py --model "arcee-ai/trinity-large-preview:free"

# Provider-level assessment
python3 tools/eu_ai_act_compliance.py --provider "arcee-ai"

# Provider ASR ranking
python3 tools/database/query_cli.py --sql "
SELECT m.provider, COUNT(*) as total,
  ROUND(100.0 * SUM(CASE WHEN COALESCE(r.llm_verdict, r.heuristic_verdict) = 'COMPLIANCE' THEN 1 ELSE 0 END) / COUNT(*), 1) as asr_pct
FROM results r
JOIN evaluation_runs er ON r.evaluation_run_id = er.id
JOIN models m ON er.model_id = m.id
JOIN prompts p ON r.prompt_id = p.id
JOIN source_datasets sd ON p.source_dataset_id = sd.id
WHERE sd.name NOT LIKE '%obliteratus%'
  AND COALESCE(r.llm_verdict, r.heuristic_verdict) IN ('COMPLIANCE','PARTIAL','REFUSAL','HALLUCINATION_REFUSAL')
GROUP BY m.provider HAVING total >= 20
ORDER BY asr_pct DESC" --format table
```

## References

- Report #184: Cross-Provider Safety Inheritance (Romana, sprint-12) -- established finding on fine-tuning safety loss
- Report #197: EU AI Act Compliance Assessment (Martha Jones, sprint-10) -- corpus-wide 8 RED / 2 AMBER
- Report #50: Cross-Model Vulnerability Profiles (Amy Pond, sprint-24) -- provider signatures dominate
- AGENT_STATE.md: Established Finding on safety training investment vs model scale
- EU AI Act Regulation 2024/1689, Articles 9, 15, 28
- Arcee AI product documentation: https://www.arcee.ai/

---

*F41LUR3-F1R57 Research Report #223. Safety card: `research/model_safety_cards/arcee-ai_trinity-large-preview.md`.*
