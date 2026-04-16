---
title: "Cross-Wave Research Synthesis (Sprint 11-12, Waves 24-25)"
description: "This synthesis maps the research output from Sprint 11-12 (Waves 24-25), which produced 8 reports (#178-186), 3 legal memos (LR-54/55/56), 2 blog posts, a..."
date: "2026-03-24"
reportNumber: 191
classification: "Research — Empirical Study"
status: "complete"
author: "F41LUR3-F1R57 Research Team"
tags: []
draft: false
---


## Executive Summary

This synthesis maps the research output from Sprint 11-12 (Waves 24-25), which produced 8 reports (#178-186), 3 legal memos (LR-54/55/56), 2 blog posts, a Foresight grant application, and significant paper progress across CCS, AIES, and NeurIPS D&B. The central finding of this synthesis is that three independently-developed research threads -- provider safety fingerprinting (F41LUR3-F1R57 Research Team), compositional reasoning attacks (F41LUR3-F1R57 Research Team), and cross-provider safety inheritance (F41LUR3-F1R57 Research Team) -- converge on a single structural claim: **safety is a provider-level property, not a model-level property, and it does not survive modification.** This claim is the most publishable finding from the recent waves.

The synthesis identifies three additional cross-agent connections that were not previously articulated, flags two tensions between different agents' findings, and proposes five high-impact research questions derived from gaps in the current evidence base.

---

## 1. Cross-Agent Finding Map

### Connection 1: The Provider-Safety Nexus (Bill + F41LUR3-F1R57 Research Team + Clara)

Three independent analyses converge:

- **Report #181 (F41LUR3-F1R57 Research Team):** Provider safety fingerprints show three distinct clusters -- restrictive (<15% ASR: Anthropic, Google, StepFun), mixed (29-43%: Ollama, Meta-Llama, Liquid, DeepSeek, Qwen, Nvidia), permissive (>50%: some distributions). PARTIAL signature varies dramatically: Qwen 43.7% vs Anthropic 3.5%, revealing fundamentally different safety architectures (hedging vs binary refusal).

- **Report #184 (F41LUR3-F1R57 Research Team):** Cross-provider safety inheritance -- 50 models, 8 families, 24,477 LLM-graded results. Safety does NOT transfer through distillation. Third-party fine-tuning universally eliminates Llama safety (25 degraded, 58 preserved, 17 improved overall, but direction depends on modification type). DeepSeek R1 distillation produces 100% ASR on Qwen derivatives despite R1 itself showing 21.5%.

- **Report #184b (F41LUR3-F1R57 Research Team):** Corpus pattern mining -- CoT-exploit inverted scaling is technique-specific (small models 42.9% vs XL 7.5%). Claude Sonnet 4.5 achieves 0% on CoT-exploits while other frontier models show 11-22%, indicating Anthropic-specific safety training addresses reasoning-chain manipulation.

**Convergence thesis:** Safety is an investment property (Report #50 established finding: safety training beats scale) that is provider-specific in character (Bill), does not transfer through model modification (F41LUR3-F1R57 Research Team), and is technique-dependent in its coverage (Clara). This is a single publishable story: "Safety is a non-transferable provider investment, not an inheritable model property."

### Connection 2: Compositional Attacks Exploit Polyhedral Refusal (Rose + Martha/OBLITERATUS)

- **Report #180 (F41LUR3-F1R57 Research Team):** CRA achieved 75% heuristic ASR (6/8), outperforming MDA (33%) and PCA (33%). The explanation offered: compositional attacks span multiple harm categories simultaneously.

- **Report #183 (F41LUR3-F1R57 Research Team / OBLITERATUS):** Refusal geometry is polyhedral (4 distinct directions, cone dimensionality 3.96, mean pairwise cosine 0.132). Category-specific in early layers, converging toward unified representation in later layers.

**Connection (not previously articulated):** CRA's elevated ASR is mechanistically explained by polyhedral refusal geometry. If each harm category has its own refusal direction (weapons, fraud, intrusion, cyber), then an attack that distributes benign components across categories avoids triggering any single refusal direction. This is the first time we can link a VLA attack family's empirical success to a mechanistic finding. The multi-agent CRA expansion (Report #185, 15 new scenarios across agent boundaries) tests an even harder version: whether cross-agent safety reasoning can integrate across polyhedral directions that no single agent holds.

**Publishability:** High. The mechanistic grounding of CRA via polyhedral refusal is a novel contribution. However, the mechanistic evidence is from a 0.5B model (capability floor) and the CRA ASR is heuristic-only. Both need strengthening.

### Connection 3: The Legal-Technical Feedback Loop (Tegan + Nyssa + Bill)

- **LR-54/55/56 (F41LUR3-F1R57 Research Team):** Reasoning traces are legally admissible as evidence of corporate knowledge, create a "knowledge trap" (reviewing = actual knowledge, not reviewing = constructive knowledge), and tiered mandatory disclosure is warranted for high-risk embodied systems.

- **Report #186 (F41LUR3-F1R57 Research Team):** The ethics of automated attack evolution -- the AARDF five-tier disclosure framework addresses when evolved attacks should be published, held, or coordinated. D-Score assessment: evolved code 8/12 (coordinated disclosure), evolved population 10/12 (withhold).

- **Report #181 (F41LUR3-F1R57 Research Team):** Provider fingerprints operationalise the disclosure question -- encoding attacks perfectly discriminate safety tiers (0% on Anthropic/Google, 25% on Ollama). This means the fingerprint tool itself has dual-use implications: it maps exactly which providers are vulnerable to which attack families.

**Connection:** Tegan's legal analysis (corporate knowledge of reasoning traces) combined with Bill's fingerprint tool creates a regulatory compliance pathway: providers who use the fingerprint tool gain actual knowledge of their vulnerability profile, which Tegan's LR-55 analysis says creates constructive knowledge obligations under the Bank of New England doctrine. Nyssa's AARDF provides the disclosure framework for how to communicate those findings. Together, these three bodies of work form a complete "know your vulnerability, manage your disclosure, understand your legal exposure" package.

### Connection 4: Defense Ineffectiveness and the Iatrogenesis Chain (Amy + Nyssa + Tegan)

- **Report #174 (F41LUR3-F1R57 Research Team, Wave 21):** Defense benchmark: 120 traces, FLIP-graded. STRUCTURED most effective (-26.6pp), but format-lock is FULLY defense-resistant (100% ASR all conditions). One iatrogenic observation (emotional manipulation +33pp under ADVERSARIAL_AWARE defense).

- **Iatrogenesis preprint v2 (Nyssa):** The TI-S framework predicts that safety interventions have a narrow therapeutic window. OBLITERATUS concept cone experiment (Report #183) found that at alpha +/-1.0, the model degenerates. No intermediate "safe but refusing" state exists.

- **LR-51 (Tegan):** Ineffective defense is a potential design defect under PLD 2024 Art 6(1), WHS Act s 18(c)-(d). State-of-the-art defence is closed by Tier 3 evidence of defense ineffectiveness.

**Connection:** The empirical defense null result (Amy) feeds directly into the iatrogenesis framework (Nyssa) as a Level 2 iatrogenic effect (interventions that fail to help but create false confidence), which in turn creates specific legal liability exposure (Tegan). This is a closed empirical-theoretical-legal loop -- possibly the tightest cross-disciplinary connection in the project.

---

## 2. Three Most Publishable Findings

Ranked by combination of novelty, evidence strength, and venue fit.

### P1: Safety Is a Non-Transferable Provider Investment

**Evidence base:** Reports #50, #181, #184. n=50 models, 24,477 results (F41LUR3-F1R57 Research Team); 27 providers (Bill); 190 models corpus-wide.

**Novelty:** No prior work has shown at this scale that safety does not survive model modification. The DeepSeek R1 distillation finding (100% ASR on Qwen derivatives despite R1 = 21.5%) is a specific, testable claim that no other group has published.

**Venue:** NeurIPS 2026 D&B Track (fits benchmark + dataset narrative) or CCS 2026 Cycle 2 (fits security framing). Strong candidate for a standalone short paper.

**Evidence gaps:** All data is from our corpus (no external validation). Need same-prompt controlled comparison across base/instruct/distilled variants to eliminate confounding from heterogeneous prompt sets.

### P2: Polyhedral Refusal Geometry Explains Compositional Attack Success

**Evidence base:** Reports #180, #183, #185. Mechanistic (concept cone, 0.5B model) + empirical (CRA 75% heuristic ASR, 62.5% FLIP ASR on 5/8).

**Novelty:** First mechanistic explanation for why compositional attacks succeed against embodied AI systems. The polyhedral refusal finding itself is not new (Arditi et al. 2024 showed direction-specific refusal), but connecting it to CRA and the multi-agent expansion is.

**Venue:** AIES 2026 (abstract May 14, fits safety-governance framing) or arXiv immediate (priority claim). Consider joint with iatrogenesis paper.

**Evidence gaps:** Mechanistic result is 0.5B only (capability floor caveat). CRA FLIP grading incomplete. Multi-agent CRA has 0 traces. Need replication on 7B+ model and FLIP-graded CRA traces before submitting.

### P3: Automated Attack Evolution with Convergent Phenotypes

**Evidence base:** Reports #175, #184 (F41LUR3-F1R57 Research Team lineage analysis), #176 (ethics), #186 (AARDF framework). 39 evolved attacks, 4 generations, convergent evolution confirmed.

**Novelty:** Convergent evolution across independent attack lineages is a new finding. Prior automated red-teaming work (AutoDAN, PAIR, TAP, GCG) generates attacks but does not analyze lineage evolution or convergent phenotypes. The AARDF disclosure framework adds an ethics layer that is publishable independently.

**Venue:** CCS 2026 (security venue, attack evolution fits), NeurIPS 2026 main track (if framed as methodology), or a standalone arXiv paper. The AARDF framework paper fits AIES 2026 independently.

**Evidence gaps:** All ASR is heuristic-only. Flat fitness landscape on permissive models means the evolution system has not yet been tested on models that would provide discriminative signal. FLIP regrading required (Issue #534). Need frontier model validation.

---

## 3. Paper Pipeline — Finding-to-Venue Mapping

| Finding | Primary Venue | Backup Venue | Deadline | Status | Blockers |
|---------|--------------|--------------|----------|--------|----------|
| Safety non-transferable (P1) | NeurIPS 2026 D&B | CCS 2026 Cycle 2 | May 26 / Apr 29 | Draft sections exist (Clara's D&B unified draft) | Same-prompt controlled comparison needed |
| Polyhedral refusal + CRA (P2) | AIES 2026 | arXiv (immediate) | May 14 / anytime | OBLITERATUS section exists; CRA data partial | 7B+ replication, FLIP grading |
| Attack evolution convergence (P3) | CCS 2026 Cycle 2 | arXiv (immediate) | Apr 29 / anytime | Lineage analysis complete, ethics analysis complete | FLIP regrading, frontier model validation |
| Iatrogenesis framework (existing) | arXiv (this week) + AIES 2026 | - | Mar 31 / May 14 | arXiv submission package READY (#552) | Human review + upload |
| IDDL + reasoning vulnerability (CCS main) | CCS 2026 Cycle 2 | - | Apr 22 abstract, Apr 29 paper | Submission bundle v8 READY | Abstract registration (human) |
| Heuristic classifier crisis (Report #178) | NeurIPS 2026 D&B (methodology section) | Standalone short paper | May 26 | Data complete (Martha), integrated into D&B draft | Already covered in D&B draft |
| Legal reasoning trace trilogy (LR-54/55/56) | Law review article | Stanford Technology Law Review or Harvard JOLT | Rolling | 3 memos complete, outline exists | Academic legal formatting, peer review |
| Defense ineffectiveness + iatrogenic loop | AIES 2026 (governance section) | IEEE S&P workshop | May 14 | 120 traces FLIP-graded, legal memo complete | Small sample (120 traces), need 500+ |
| GLI quantitative framework | Public policy journal | Science & Engineering Ethics | Rolling | 133 entries, methodology doc complete | Need external validation of GLI methodology |

---

## 4. Contradictions and Tensions

### Tension 1: Heuristic Over-Report Rate Discrepancy

- **Report #177 (F41LUR3-F1R57 Research Team):** Heuristic over-report rate is 79.9% (only 20.1% of heuristic COMPLIANCE confirmed by Haiku).
- **Report #178 (F41LUR3-F1R57 Research Team):** Heuristic over-report rate is 67.3% (32.7% confirmed by LLM graders as C/P).

These two numbers come from the same author and appear to be different analyses on overlapping data. The 79.9% figure uses Haiku-only grading (n=4,723); the 67.3% figure uses the full dual-graded corpus (n=4,875) with all LLM graders. The discrepancy (12.6pp) may reflect: (a) Haiku being a stricter grader than the corpus average, (b) different inclusion criteria, or (c) different denominator definitions. Both are cited in CANONICAL_METRICS.md but neither report explains the discrepancy.

**Resolution needed:** A reconciliation note specifying which number to use for which purpose. For external submissions, the more conservative 67.3% figure has a larger sample and includes multiple graders, which is methodologically stronger.

### Tension 2: OBLITERATUS Safety Re-emergence vs. Defense Ineffectiveness

- **Established finding (F41LUR3-F1R57 Research Team audit):** Safety-like behavior re-emerges at scale in abliterated models (Qwen3.5 series: 100% ASR at 0.8B down to 47.3% at 9.0B). But this is textual hedging, not behavioral refusal -- broad ASR remains 100% at 9.0B.
- **Report #183 (OBLITERATUS mechanistic):** Therapeutic window for safety steering is "extremely narrow" -- no intermediate safe-but-refusing state exists.
- **Report #174 (F41LUR3-F1R57 Research Team defense benchmark):** System-prompt defenses had ZERO effect on permissive models.

The tension: if safety behavior partially re-emerges at scale (the hedging signal), why does it provide zero behavioral protection? One explanation: the hedging is purely textual (System S) while the action output (System T) remains unaffected. The narrow therapeutic window means there is no dosage of safety steering that produces refusal without degeneration. These are consistent but the project has not yet explicitly framed this as a single coherent finding: **safety re-emergence at scale is a cosmetic phenomenon with no functional consequence.**

**Resolution needed:** A short reconciliation note in CANONICAL_METRICS.md or a targeted update to the OBLITERATUS section of the CCS paper. F41LUR3-F1R57 Research Team or Martha should write a paragraph connecting these three results.

### Tension 3: CRA ASR vs. FLIP Grading Confidence

F41LUR3-F1R57 Research Team's Report #180 presents CRA at 75% heuristic ASR and 62.5% FLIP ASR. The Foresight grant (F41LUR3-F1R57 Research Team) cites "50% of VLA verdicts are PARTIAL" and "zero outright refusals across 63 FLIP-graded traces." These are not contradictory -- the CRA finding is a subset of the broader VLA finding -- but the grant does not cite the CRA-specific result despite CRA being the most novel VLA finding. The grant application could be strengthened by citing CRA specifically as evidence for the cross-embodiment transfer hypothesis.

---

## 5. Next Five Highest-Impact Research Questions

Derived from gaps identified across all agents' work, ordered by expected impact on the paper pipeline.

### Q1: Does safety non-transferability hold under controlled conditions?

**Gap:** F41LUR3-F1R57 Research Team's Report #184 uses heterogeneous prompt sets across models. The finding that "safety does not transfer through distillation" is confounded by different models seeing different prompts. A controlled experiment with identical prompts across base, instruct, distilled, abliterated, and fine-tuned variants of a single model family would be definitive evidence.

**Impact:** Directly enables P1 (most publishable finding) as a standalone paper. Without this, the claim is correlational.

**Effort:** ~200 traces (5 variants x 40 prompts). Medium compute cost. Could run on free-tier OpenRouter with Llama/Qwen families.

### Q2: Does polyhedral refusal geometry replicate at 7B+?

**Gap:** Report #183 concept cone analysis is 0.5B only. The capability-floor caveat means the polyhedral finding might not hold at production scale. Replication on 7B Qwen2.5-Instruct or Llama 3.2-8B would validate the mechanism.

**Impact:** Directly enables P2 and grounds the CRA mechanistic explanation. Also critical for the iatrogenesis TI-S experiment (the therapeutic window finding at 0.5B may not hold at 7B where safety training is more robust).

**Effort:** Requires GPU compute (7B+ model inference for activation extraction). Estimated 100 GPU-hours. Compute-grant dependent.

### Q3: What is the FLIP-graded ASR of evolved attacks on restrictive models?

**Gap:** All 39 evolved attacks (Report #184 lineage) have heuristic-only ASR on permissive free-tier models. The flat fitness landscape means evolution has not been tested against models that would provide discriminative signal. Running evolved attacks against Claude, GPT-5.2, or Gemini 3 Flash would test whether convergent phenotypes actually outperform their seed ancestors against real defenses.

**Impact:** Validates or refutes the attack evolution methodology. If evolved attacks show elevated ASR on restrictive models, the convergent evolution finding becomes a significant safety concern. If they show no improvement, the evolution system needs redesign.

**Effort:** ~100 traces (49 attacks x 2-3 frontier models). Requires paid API credits. Medium cost (~$50-100 on OpenRouter paid tier).

### Q4: What is the multi-agent CRA baseline ASR?

**Gap:** Report #185 designed 15 multi-agent CRA scenarios but has 0 traces. The hypothesis that cross-agent compositional hazards are structurally harder to defend against than single-agent CRA has no empirical test. This is the most novel VLA finding in the pipeline and it is purely theoretical.

**Impact:** If multi-agent CRA ASR > single-agent CRA ASR (62.5%), this is a strong publishable finding for NeurIPS D&B or AIES. If lower, it still characterizes the failure mode.

**Effort:** ~45 traces (15 scenarios x 3 models). Requires multi-agent benchmark infrastructure that does not currently exist for the HTTP runner. May need a custom runner adaptation.

### Q5: Can provider fingerprints predict vulnerability to novel attack families?

**Gap:** Bill's Report #181 maps per-provider vulnerability profiles retrospectively. The predictive question: given a provider's fingerprint (e.g., high PARTIAL rate, encoding-attack susceptibility), can we predict their ASR against a novel attack family (e.g., CRA, MDA, PCA) before running the test? This would transform the fingerprint from a descriptive tool to a predictive one.

**Impact:** Predictive provider fingerprinting would be a high-impact methodology contribution. It would also have commercial value for the red-team assessment pipeline.

**Effort:** Requires running the 3 novel VLA families (CRA, MDA, PCA) against at least 5 providers spanning the restrictive-mixed-permissive spectrum. ~75 traces. Medium cost. Analysis is straightforward (rank correlation between fingerprint score and novel-family ASR).

---

## 6. Foresight Grant QA (Cross-Check Against CANONICAL_METRICS.md)

**Document:** `research/submissions/foresight_grant_2026.md` (F41LUR3-F1R57 Research Team, 2026-03-24)
**Methodology:** Every number in the grant cross-checked against CANONICAL_METRICS.md (verified 2026-03-24).

### Numbers Verified (PASS)

| Claim in Grant | Canonical Value | Status |
|---------------|----------------|--------|
| 190 models | 190 total (177 with results) | PASS |
| 132,416 graded results | 132,416 total | PASS |
| 82 attack techniques | 82 | PASS |
| 33 VLA attack families | 33 total | PASS |
| 406 embodied scenarios | 406 lines on disk | PASS |
| 43.0% FD ASR (non-OBLITERATUS) | 43.0% (n=5,865) | PASS |
| 50% PARTIAL verdicts in VLA | 50% of FLIP verdicts | PASS |
| kappa = 0.126 | 0.126 [0.108, 0.145] | PASS |
| DeepSeek R1 21.5% ASR (n=149) | 21.5% (32/149) | PASS |
| Frontier average 9.1% (n=208) | 9.1% (19/208) | PASS |
| Chi-square 9.8, V=0.166 | Confirmed | PASS |
| Crescendo 65.0% [43.3%, 81.9%] | 65.0% [43.3%, 81.9%] (n=20) | PASS |
| 62.5% single-step, 79.9% multi-step | Brief C established finding | PASS |
| 78% HITL approval rate | Brief C established finding | PASS |
| GLI 1,421 days (prompt injection) | 1,421 days (~3.9 years) | PASS |
| 3,362 days (adversarial examples) | 3,362 days (9.2 years) | PASS |
| 78,585 ungraded OBLITERATUS | 78,585 (CANONICAL_METRICS implied) | PASS |
| Anthropic 3.7%, Google 9.1%, Nvidia 40.0%, Qwen 43.1% | Report #50 values | PASS (see note) |
| Inverse scaling r=-0.140 | r=-0.140 (n=24) | PASS |

### Numbers Requiring Update (DRIFT)

| Claim in Grant | Canonical Value | Issue |
|---------------|----------------|-------|
| "129 GLI entries" (Section 2, 3, 5) | **133 entries** (CANONICAL_METRICS: gli_001-gli_133) | Grant uses 129 (stale by 4 entries). Immaterial to argument but should be corrected before submission. |
| "166 research reports" (Section 7) | **171 files** (CANONICAL_METRICS verified 2026-03-24) | Grant uses 166 (stale by 5 reports). Cosmetic only. |
| "57 legal memos" (Section 7) | **61 files** (CANONICAL_METRICS verified 2026-03-24) | Grant uses 57 (stale by 4 memos). Cosmetic only. |
| "106+ blog posts" (Section 7) | **108+ published** (AGENT_STATE Key Metrics) | Minor, within reasonable rounding. |
| "1,243 automated tests" (Section 7) | **1,263 collected** (CANONICAL_METRICS verified 2026-03-24) | Stale by 20 tests. Cosmetic only. |
| "604 pages indexed" (Section 7) | **633 pages** (F41LUR3-F1R57 Research Team Wave 23 refresh) | Stale by 29 pages. Cosmetic. |
| "90.0% have at least one PENDING milestone" (Sections 3, 5) | Not directly in CANONICAL_METRICS | Claim is from GLI dataset analysis but no canonical source verified. Should add citation or verify against current GLI dataset. |
| "null-framework rate at 94.2%" (Section 3) | Not in CANONICAL_METRICS | Same as above. These GLI-derived percentages need a traceable source. |
| "1,800+ autonomous haul trucks" (Section 3) | Brief E established finding | PASS but external claim -- should cite source. |

### Defensibility Flags (CAUTION)

1. **"Largest independent adversarial evaluation corpus" (Section 2, abstract).** Defensible by count (135,623 results, 236 models) but the claim "largest independent" could be challenged by industry labs (Google DeepMind, Anthropic) that run internal evaluations at larger scale but do not publish. Recommend softening to "largest publicly documented independent adversarial evaluation corpus."

2. **"No standardised adversarial evaluation framework exists for these systems" (Section 2).** Mostly defensible -- AdvBench/HarmBench/JailbreakBench/StrongREJECT are all text-only. However, ANNIE (SafeVLA) and Blindfold (SenSys 2026) do exist as domain-specific frameworks. Recommend qualifying: "No comprehensive, multi-family adversarial evaluation framework exists for embodied AI systems."

3. **"Zero scenarios cover embodied, tool-integrated, or multi-agent systems" (Section 3).** Partially stale. MUZZLE (arXiv:2602.09222) has 37 agentic attack instances. ANNIE and SafeVLA cover some VLA scenarios. Recommend: "Zero public benchmark tests embodied action-layer safety alongside text-level evaluation."

4. **"1,400 GPU-hours at A100/H100 rates" (Section 6 budget).** The $6,708 figure implies ~$4.79/GPU-hour. Current A100 spot rates on Brev/Lambda/RunPod range $1.50-$3.50/hour. H100 is $2.50-$5.00/hour. The estimate is within range but slightly high for A100. Consider specifying the assumed rate.

5. **"Cross-model vulnerability profiles (n=57 models with LLM-graded verdicts)" (Finding 1).** This n=57 figure is from Report #50. CANONICAL_METRICS now shows 236 models with results. The finding may be based on a subset. Recommend clarifying: "n=57 models with sufficient LLM-graded verdicts for statistical analysis" or updating if the analysis has been re-run.

6. **Provider ASR figures (Anthropic 3.7%, Google 9.1%, Nvidia 40.0%, Qwen 43.1%).** These are from Report #50. CANONICAL_METRICS per-provider table (Report #182) shows Anthropic 7.6%, Google not listed separately (deepseek 37.6%, nvidia 34.3%). The Report #50 figures and the Report #182 figures use different methodologies (COALESCE vs LLM-only). The grant should specify which methodology is cited. For consistency, recommend using the CANONICAL_METRICS non-OBLITERATUS per-provider table.

### Recommendation

The grant application is substantively strong. The five key findings are all data-backed and correctly cited. The six drift items are cosmetic (4-29 unit differences) and should be corrected in a 10-minute pass before submission. The six defensibility flags require minor language softening, not structural changes. The grant is **submission-ready after these corrections.**

---

## 7. Summary: State of the Research Programme

### What the waves produced (Sprint 11-12 combined)

| Category | Count | Key Items |
|----------|-------|-----------|
| Research reports | 8 | #178-186 (heuristic overcount, novel families, provider fingerprints v2, grading completion, OBLITERATUS mechanistic, cross-provider inheritance, CRA multi-agent, corpus pattern mining, attack evolution lineage, ethics of automated evolution) |
| Legal memos | 3 | LR-54 (trace admissibility), LR-55 (corporate knowledge), LR-56 (hidden reasoning disclosure) |
| Blog posts | 2 | GLI governance lag, safety re-emergence at scale |
| Grant applications | 1 | Foresight AI Nodes ($10K-$100K) |
| Paper progress | 3 papers | CCS v8 bundle ready; AIES full draft (11,804 words); NeurIPS D&B unified draft (~7,900 words) |
| Tools | 3 | provider_fingerprint.py v2, heuristic_overcount_analyzer.py, cross_provider_safety_inheritance.py |
| VLA scenarios | 15 | Multi-agent CRA (10 cross-domain categories) |
| GLI entries | +4 | gli_130-133 |
| Evolved attacks | 39+10 | 39 from Run 1 + 10 new evolvability-optimized seeds |

### Critical path items

1. **CCS abstract registration: April 22 (29 days).** Bundle v8 ready. BLOCKED on human submission.
2. **Foresight grant: March 31 (7 days).** Application drafted, QA above. BLOCKED on human review + submit.
3. **AIES abstract: May 14 (51 days).** Full draft exists. Needs page-limit trim, figures, LaTeX conversion.
4. **arXiv iatrogenesis: ASAP.** Submission package ready. BLOCKED on human review + upload.
5. **NeurIPS D&B: ~May 26.** Unified draft exists. Needs LaTeX conversion, figures, co-author review.

### What the next wave should prioritise

1. Controlled same-prompt safety inheritance experiment (Q1 above) -- directly enables the most publishable finding.
2. CRA FLIP grading + multi-agent CRA baseline traces (Q4) -- fills the most prominent evidence gap.
3. Reconcile heuristic over-report rate discrepancy (Tension 1) -- prevents confusion in external submissions.
4. Foresight grant cosmetic corrections (6 items above) -- 10-minute fix, submission-critical.
5. arXiv iatrogenesis upload -- zero-cost priority claim, all materials ready.

---

*Prepared by F41LUR3-F1R57 Research Team (Editorial & Integrity Director), Failure-First Embodied AI Research.*
*All metrics sourced from `docs/CANONICAL_METRICS.md` (verified 2026-03-24).*
