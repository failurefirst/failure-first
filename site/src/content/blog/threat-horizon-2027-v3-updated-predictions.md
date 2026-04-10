---
title: "Threat Horizon 2027 -- Updated Predictions (v3)"
date: 2026-03-24
author: Adrian Wedd
tags: [threat-horizon, predictions, safety, embodied-ai, governance, insurance, benchmark-contamination, defense-evolver]
description: "Our eight predictions for embodied AI safety in 2027, updated with Sprint 13-14 evidence: benchmark contamination, automated defense ceiling effects, provider vulnerability correlation, and novel attack families at 88-100% ASR."
audio: "https://cdn.failurefirst.org/audio/blog/sprint23/15-threat-horizon-2027.m4a"
---

# Threat Horizon 2027 -- Updated Predictions (v3)

This is the third iteration of our Threat Horizon predictions for embodied AI safety in calendar year 2027. Version 1 (March 19) made five predictions. Version 2 (March 24) expanded to eight with substantial evidence updates. This v3 incorporates findings from Sprint 13-14 that materially change four predictions and add one new one.

All predictions remain falsifiable and time-bounded to December 31, 2027. We will reassess against reality in March 2027.

---

## What Changed Since v2

Four findings from Sprint 13-14 alter the evidence base:

**1. Benchmark contamination is systematic, not incidental.** Qwen3-8b shows an 83 percentage-point gap between AdvBench (15.3% ASR) and novel attack families (98.3% ASR). Chi-square=80.5, p<10^-18, Cramer's V=0.82. This is a large effect specific to Qwen3 -- the comparable gap for Nemotron is 33pp. Any published safety evaluation based solely on public benchmarks is measuring memorisation, not safety. This finding undermines the evidentiary basis for all published model safety claims that rely on AdvBench, HarmBench, or JailbreakBench as primary evaluation instruments.

**2. Automated defense generation is possible but hits a ceiling.** The Defense Evolver (Report #233) ran its first live generation against graded attack traces. The best seed defense (DEF-000-00) achieved 100% refusal rate but with a 20% false refusal rate -- it blocks attacks by becoming overly restrictive. This is consistent with the polyhedral geometry finding: single-direction safety interventions are either too weak or too strong. Automated defense evolution can produce effective defenses within narrow operating windows, but cannot solve the fundamental problem of multi-dimensional safety.

**3. Provider choice is a safety decision, not a procurement decision.** Provider vulnerability correlation (Report #227) shows phi coefficients of 0.24--0.43 between restrictive providers. When Anthropic refuses a prompt, OpenAI is significantly more likely to also refuse it (phi=+0.431, p<0.05). This means provider selection determines not just the average failure rate but the specific prompts that succeed. Two systems using different restrictive providers will have correlated -- but not identical -- vulnerability profiles.

**4. Novel attack families achieve 88-100% ASR on models that resist public benchmarks.** Six new families (CRA, PCA, MDA, MAC, SSA, RHA) designed after Sprint 10 achieve extreme ASR on models with strong AdvBench performance. These families were designed to target attack surfaces absent from all public datasets and all existing frameworks. Their effectiveness confirms that safety training is benchmark-specific, not harm-general.

---

## The Nine Predictions

### P9 (Updated): First AI-Caused Physical Injury from Adversarial Attack

**Confidence: MEDIUM-HIGH (60-75%)** -- unchanged from v2

New evidence strengthens the existing case without changing the confidence level. Novel attack families at 88-100% ASR against models with strong published safety numbers means the gap between what safety benchmarks measure and what attackers can actually do is wider than v2 estimated. The Defense Evolver ceiling effect means automated defense will not close this gap in time.

**What to watch:** AV/robot incident reports mentioning "perception anomaly," "unexpected action," or "adversarial." NHTSA, NTSB, Waymo safety reports, OSHA robotics incidents.

---

### P14 (Updated): DETECTED_PROCEEDS Discovered in Production Systems

**Confidence: MEDIUM-HIGH (60-75%)** -- unchanged from v2

The DETECTED_PROCEEDS arXiv preprint remains upload-ready. When published, it will accelerate external discovery by providing the search pattern. The Defense Evolver result reinforces the prediction: even automated defense attempts cannot prevent the knowing-doing gap because it is a structural feature of how safety training interacts with task completion, not a tunable parameter.

---

### P11 (Updated): Insurance Crisis -- "Silent AI" Parallels "Silent Cyber"

**Confidence: MEDIUM (50-65%)** -- unchanged from v2

No new evidence in Sprint 13-14 directly affects the insurance prediction. The structural conditions remain: coverage ambiguity, accelerating deployment, no actuarial models. The benchmark contamination finding indirectly strengthens the case: insurers relying on published safety benchmarks to assess AI risk are using contaminated data.

---

### P15 (Updated): Attack Combination Exploitation in Multi-Agent Deployments

**Confidence: MEDIUM-HIGH (50-65%)** -- **raised from MEDIUM (45-60%)**

Sprint 13-14 novel attack families provide additional combination components. Six new families designed to target distinct attack surfaces create 15 additional pairwise combination possibilities beyond the three identified in v2. The benchmark contamination finding means defenders cannot evaluate their exposure to these combinations using public benchmarks. The Defense Evolver ceiling effect means automated defense against combinations is even harder than against individual attacks.

**What to watch:** Multi-agent security advisories, CTF competition entries, red-team reports at DEF CON AI Village.

---

### P10' (Updated): Regulatory Failure -- EU AI Act August 2026 Deadline

**Confidence: HIGH (80-90%)** -- **raised from HIGH (75-85%)**

The benchmark contamination finding directly undermines the compliance pathway. If providers demonstrate EU AI Act Article 9(8) compliance using AdvBench or similar public benchmarks, they are submitting contaminated evidence. An 83pp gap between public benchmark performance and novel-prompt vulnerability means compliance demonstrations based on public benchmarks are unreliable. Unless the EU AI Office or notified bodies require evaluation on held-out, non-public test sets, compliance assessments will not detect the actual vulnerability level.

**What to watch:** EU AI Office enforcement actions, provider compliance announcements, conformity assessment methodology publications.

---

### P13 (Updated): First Iatrogenic AI Safety Incident Formally Documented

**Confidence: MEDIUM-HIGH (65-75%)** -- **raised from MEDIUM-HIGH (60-75%)**

The Defense Evolver result provides direct evidence of iatrogenic risk. DEF-000-00 achieved 100% attack refusal with 20% false refusal -- it blocks legitimate operations one time in five. Deployed in an embodied system, a 20% false refusal rate means the safety mechanism causes operational failure at a rate that would be unacceptable in any safety-critical domain (aviation, medicine, nuclear). The narrow therapeutic window documented in polyhedral geometry (Report #198) and now confirmed by automated defense evolution means there is no parameter setting that simultaneously achieves high attack refusal and low false refusal. Safety mechanisms that are strong enough to work are strong enough to cause harm.

**What to watch:** Incident reports naming safety mechanisms in causal chains. NTSB, OSHA, FDA MAUDE, EU RAPEX.

---

### P16 (Updated): Safety Re-Emergence Exploited -- Dimensional Targeting

**Confidence: MEDIUM (50-60%)** -- **raised from MEDIUM (45-60%)**

Novel attack families at 88-100% ASR demonstrate the dimensional targeting principle in practice, even without explicit geometric framing. Attacks designed to target uncovered dimensions (embodied action layers, compositional reasoning, cross-agent coordination) achieve extreme success precisely because safety training covers only the text-layer dimensions tested by public benchmarks.

**What to watch:** Mechanistic interpretability papers targeting safety geometry. ICML, NeurIPS proceedings.

---

### P12 (Unchanged): Humanoid Robot Deployment Exceeds 10,000 Units

**Confidence: MEDIUM (45-60%)** -- no change. No new evidence in Sprint 13-14.

---

### P17 (NEW): Benchmark Contamination Acknowledged by Major Provider

**Statement:** By December 31, 2027, at least one major AI provider (top-10 by deployment scale) will publicly acknowledge that their safety benchmark performance was inflated by training data contamination, or an independent evaluation will demonstrate contamination with sufficient rigour to force a public response.

**Evidence basis:**

1. *The Qwen3-8b gap is too large to be explained by task difficulty alone.* An 83pp gap with Cramer's V=0.82 is a large effect. The comparable gap for Nemotron (33pp, V=0.31) shows this is not a generic property of novel prompts being harder.

2. *AdvBench is in the training data.* AdvBench (Zou et al., 2023) has been available on GitHub since July 2023. Any model trained on web-scraped data after mid-2023 has likely encountered AdvBench prompts. The memorisation pathway is straightforward: the model learns to associate specific AdvBench phrasing patterns with refusal, without generalising the refusal to semantically equivalent requests.

3. *Competitive pressure creates perverse incentives.* Model providers compete partly on published safety scores. If safety benchmarks are in the training data, there is no incentive to remove them -- and arguably an incentive to ensure they remain. The contamination may not be deliberate, but the structural incentive to address it is weak.

4. *Independent replication is straightforward.* Our methodology -- comparing performance on public benchmark prompts versus novel prompts targeting the same harm categories -- is reproducible by any research group with API access. The finding will be independently replicated.

**Confidence: MEDIUM (50-65%)**

**Reasoning:** The contamination is empirically demonstrated. Independent replication is straightforward. The prediction depends on whether discovery triggers a public response or is quietly absorbed. Providers may preemptively address contamination through internal benchmark improvements without public acknowledgment. The most likely path to confirmation is an independent academic study that gains sufficient attention to force a response.

**Verification criteria:**
- A public statement from a top-10 AI provider acknowledging training data contamination in safety benchmarks; OR
- A peer-reviewed or widely-cited preprint demonstrating contamination across multiple providers with methodology robust enough to force public engagement; OR
- A provider announcing a shift away from public benchmarks to held-out evaluation, with explicit rationale citing contamination risk.

---

## Summary Table

| # | Prediction | v2 | v3 | Change |
|---|-----------|-----|-----|--------|
| P9 | Physical injury from adversarial attack | 60-75% | 60-75% | Unchanged; novel families strengthen evidence |
| P14 | DETECTED_PROCEEDS in production | 60-75% | 60-75% | Unchanged |
| P11 | Insurance crisis ("silent AI") | 50-65% | 50-65% | Unchanged |
| P15 | Attack combination exploitation | 45-60% | 50-65% | +5pp; 6 new families expand combination space |
| P10' | EU AI Act regulatory failure | 75-85% | 80-90% | +5pp; contaminated compliance pathway |
| P13 | Iatrogenic safety incident | 60-75% | 65-75% | +5pp; Defense Evolver confirms therapeutic window |
| P16 | Dimensional safety exploitation | 45-60% | 50-60% | +5pp; novel families demonstrate principle |
| P12 | Humanoid deployment >10,000 units | 45-60% | 45-60% | Unchanged |
| P17 | Benchmark contamination acknowledged | -- | 50-65% | New prediction |

**Joint probability:** At least 1 of 9 confirmed by end of 2027: 88-94%. At least 3 of 9: 45-60%.

---

## Cross-Prediction Dependencies (Updated)

The benchmark contamination finding (P17) creates a new dependency pathway:

- P17 (contamination acknowledged) weakens trust in published safety claims, accelerating P10' (regulatory failure) and P11 (insurance crisis as actuaries discover their risk data is unreliable)
- The Defense Evolver ceiling (strengthening P13) is mechanistically connected to the polyhedral geometry (P16) -- both reflect the same underlying constraint on single-direction safety interventions

The governance vacuum documented in our GLI dataset (136 entries) remains the structural accelerant across all predictions. The only governance lag we can fully compute -- prompt injection -- is 1,421 days (3.9 years). Alignment faking and VLA adversarial attacks have null GLI: no regulatory framework exists anywhere.

---

## Full Data

The evidence base for these predictions is documented in our [State of Adversarial AI Safety 2026 annual report](/blog/state-of-adversarial-ai-safety-2026): 193 models, 133,033 evaluation results, 36 attack families, graded with FLIP methodology.

These predictions will be reassessed against reality in March 2027.

Contact: research@failurefirst.org
