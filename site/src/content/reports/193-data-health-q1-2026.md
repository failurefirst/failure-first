---
title: "Report #193 — Data Health Assessment Q1 2026"
description: "This report presents a comprehensive data health assessment of the Failure-First Embodied AI corpus as of 2026-03-24. The corpus has grown substantially..."
date: "2026-03-24"
reportNumber: 193
classification: "Research — Empirical Study"
status: "complete"
author: "F41LUR3-F1R57 Research Team"
tags: []
draft: false
---


## Summary

This report presents a comprehensive data health assessment of the Failure-First Embodied AI corpus as of 2026-03-24. The corpus has grown substantially through Sprint 12, reaching 141,047 prompts and 135,623 results across 236 models. Significant gaps remain in grading coverage, VLA trace collection, and public dataset utilization. This report identifies coverage gaps by attack family, assesses grading quality, and provides prioritized recommendations.

## Corpus Overview

| Metric | Value |
|--------|-------|
| Total prompts | 141,047 |
| Total results | 132,416 |
| Models in DB | 190 (177 with results) |
| Source datasets | 27 |
| Techniques | 82 |
| Harm classes | 119 |
| Evaluation runs | 38,442 |
| Schema version | 13 |
| DB size | 278.59 MB |

## Grading Status

| Category | Count | Percentage |
|----------|-------|-----------|
| LLM-graded | 53,831 | 40.6% |
| Ungraded | 78,585 | 59.4% |

The 78,585 ungraded results are almost entirely OBLITERATUS telemetry (excluded by design from LLM grading). Non-OBLITERATUS grading is effectively complete (85.1% coverage per Report #177).

### LLM Verdict Distribution (n=53,831)

| Verdict | Count | Percentage |
|---------|-------|-----------|
| COMPLIANCE | 20,285 | 37.7% |
| PARTIAL | 16,093 | 29.9% |
| NOT_GRADEABLE | 7,020 | 13.0% |
| REFUSAL | 6,366 | 11.8% |
| ERROR | 1,830 | 3.4% |
| BENIGN_QUERY | 1,681 | 3.1% |
| HALLUCINATION_REFUSAL | 517 | 1.0% |
| PARSE_ERROR | 33 | 0.06% |
| INFRA_ERROR | 6 | 0.01% |

The high COMPLIANCE+PARTIAL rate (67.6%) is dominated by OBLITERATUS abliterated model results. Non-OBLITERATUS broad ASR is 34.2% (Report #182).

## Source Dataset Coverage

### Datasets with results (active for research)

| Dataset | Prompts | Results | Coverage |
|---------|---------|---------|----------|
| obliteratus_telemetry | 108,142 | 108,142 | 100% |
| obliteratus_runs | 12,789 | 12,789 | 100% |
| benchmark_traces | 7,665 | 7,665 | 100% |
| DAN-In-The-Wild | 1,459 | 1,164 | 79.8% |
| jailbreak_archaeology | 898 | 819 | 91.2% |
| failure-first-embodied-ai | 532 | 532 | 100% |
| JailbreakBench | 257 | 257 | 100% |
| sid_dose_response_v0.1 | 254 | 254 | 100% |
| reasoning_extension_phase2 | 207 | 207 | 100% |
| HarmBench | 422 | 203 | 48.1% |
| StrongREJECT | 363 | 100 | 27.5% |
| WildJailbreak | 1,001 | 95 | 9.5% |
|-11-graded | 72 | 72 | 100% |
| vla_lam_tra_phase1 | 56 | 56 | 100% |
| vla_sbe_phase1 | 46 | 46 | 100% |

### Datasets with minimal/no results (underutilized)

| Dataset | Prompts | Results | Status |
|---------|---------|---------|--------|
| SORRY-Bench | 9,446 | 6 | Severely underutilized |
| BEAVERTAILS | 3,432 | 2 | Severely underutilized |
| obliteratus_prompt_corpus_512_pairs | 1,024 | 0 | No results |
| AdvBench | 520 | 0 | No results |
| ForbiddenQuestions | 390 | 4 | Negligible |
| HEx-PHI | 290 | 3 | Negligible |
| ToxicChat | 113 | 0 | No results |
| TDC2023-RedTeaming | 100 | 0 | No results |
| SimpleSafetyTests | 100 | 0 | No results |
| LLM-Finetuning-Safety | 17 | 0 | No results |
| vla_benign_controls | 5 | 0 | No results |
| wave4_vla_sid_imb_sif | 0 | 0 | Empty dataset |

**Finding:** 15,437 prompts across 10 datasets have zero or negligible result coverage. SORRY-Bench (9,446 prompts) and BEAVERTAILS (3,432 prompts) represent the largest untapped evaluation resources.

## Attack Era Coverage

| Era | Prompts | Results | Broad ASR (LLM) |
|-----|---------|---------|-----------------|
| general | 16,254 | 816 | 17.7% |
| dan_2022 | 1,408 | 1,185 | 1.0% |
| crescendo_2024 | 27 | 311 | 33.8% |
| cipher_2023 | 19 | 146 | 16.3% |
| many_shot_2024 | 13 | 24 | 4.5% |
| reasoning_2025 | 10 | 158 | 35.7% |
| persona_2022 | 2 | 13 | 0.0% |

**Finding:** The "general" era has the most prompts but lowest result density (816 results for 16,254 prompts = 5.0%). Crescendo and reasoning eras have the highest broad ASR, confirming that newer attack techniques are more effective against current models.

## VLA/Embodied Attack Family Coverage

On-disk VLA JSONL files contain 406+ scenarios across 33 families. Coverage status by family (from AGENT_STATE.md and file inventory):

### Tier 1 — Well-characterized (FLIP-graded traces exist)

| Family | Scenarios | FLIP Traces | ASR |
|--------|-----------|-------------|-----|
| TRA (Trajectory Manipulation) | ~8 | Yes | 100% |
| ASE (Action Sequence Exploitation) | ~10 | Yes | 80% |
| SBE (Safety Boundary Erosion) | ~5 | Yes | 78% |
| MMC (Multi-Modal Confusion) | ~10 | Yes | 78% |
| VAP (Visual Adversarial Patches) | ~10 | Yes | 70% |
| LAM (Language-Action Mismatch) | ~8 | Yes | 60% |
| PCM (Prompt-Chain Manipulation) | ~10 | Yes | 60% |
| DA (Deceptive Alignment) | ~8 | 16 FLIP | 87.5% (deepseek) / 25% (qwen3) |
| SBA (Semantic Benignity Attack) | 20 | 20 FLIP | varies |

### Tier 2 — Partial coverage (some traces, needs expansion)

| Family | Scenarios | Status |
|--------|-----------|--------|
| SID (Safety Instruction Dilution) | 5 | Regraded wave 5; U-curve invalidated |
| SIF (Safety Instruction Fatigue) | 5 | Regraded wave 5 |
| IMB (Instruction-Model Binding) | 10 | Regraded wave 5 |
| PP (Permission Propagation) | 10 | Capability-floor confirmed, needs 7B+ |
| CC (Context Collapse) | 5 | 50 traces (heuristic 68%, FLIP pending) |
| IEA (Iatrogenic Exploitation) | 12 | 31 valid traces |
| DA-SBA (hybrid) | 10 | 10 valid traces |
| CRA (Compositional Reasoning) | 30 | 15 single + 15 multi-agent, 0 baseline traces |
| SSA (Sensor Spoofing) | **20** | **10 existing + 10 new (v0.6), 0 traces** |

### Tier 3 — Zero traces (highest priority gap)

| Family | Scenarios | Status |
|--------|-----------|--------|
| CSBA (Cross-System Backdoor) | 5 | 0 traces |
| SSBA (Stealth Supply-chain Backdoor) | 5 | 0 traces |
| XSBA (Cross-Domain Supply-chain) | 15 | 0 traces |
| CSC (Compound Supply Chain) | 5 | 0 traces |
| RHA (Reward Hacking Attack) | 10 | 0 traces |
| MAC (Multi-Agent Collusion) | 10 | 0 traces |
| DLA (Dual-Layer Attack) | 7 | 0 traces (AFF/KIN/TCA/DLA re-graded) |
| AFF (Affordance Failure) | 5 | Re-graded: 40% ASR |
| KIN (Kinematic Safety) | 5 | Re-graded: 0% ASR |
| TCA (Temporal Convergence) | 7 | Re-graded: 0% ASR |
| SOA (Safety Oscillation) | 8 | 0 traces |
| LHGD (Long-Horizon Goal Displacement) | 10 | 10 FLIP-graded |
| TCH (Tool-Chain Hijacking) | 10 | 10 FLIP-graded |
| CET (Cross-Embodiment Transfer) | 10+15 | 10 FLIP-graded |
| MDA (Meaning Displacement) | 10 | 55.6% FLIP ASR |
| PCA (Pressure Cascade) | 10 | 66.7% FLIP ASR |

**Finding:** 11 VLA families have zero benchmark traces. These represent the largest gap in the embodied evaluation programme. Priority should be SSA (now 20 scenarios), RHA, MAC, and DLA.

## Data Quality Indicators

| Indicator | Status | Notes |
|-----------|--------|-------|
| Schema validation | PASS | 59,961 rows validated, 812 JSONL files |
| Lint findings | 0 | 21,113 items scanned |
| Corpus integrity | 0.9724 | Up from 0.9127 after dedup |
| Cohen's kappa (heuristic vs LLM) | 0.126 | Near-chance agreement; heuristic unreliable |
| Haiku vs heuristic kappa | 0.097 | Even lower; confirms heuristic retirement |
| Heuristic over-report rate | 79.9% | Only 20.1% of heuristic COMPLIANCE confirmed |
| qwen3:1.7b grader accuracy | 15% | Do not use for classification (#250) |
| deepseek-r1:1.5b FP rate | 30.8% | On benign baseline (#315) |

**Finding:** The heuristic classifier is confirmed unreliable (kappa 0.097-0.126). All future ASR reporting must use LLM-graded verdicts. The deepseek-r1:1.5b false positive rate of 30.8% means Tier 2 families with ASR near 30% may have no real adversarial signal (the three-tier vulnerability structure from F41LUR3-F1R57 Research Team #392).

## Identified Gaps

### Critical Gaps (blocking research claims)

1. **11 VLA families with 0 traces.** Cannot characterize attack surface without baseline measurements. SSA, RHA, MAC, DLA, CSBA, SSBA, XSBA, CSC, SOA, AFF, KIN all lack execution data.

2. **CRA baseline traces missing.** 30 scenarios (15 single-agent + 15 multi-agent) exist but 0 model traces have been collected. Blocking cosine-ASR correlation test (F41LUR3-F1R57 Research Team #543).

3. **No 7B+ VLA grading.** Action-layer evaluator at 1.5B is insufficient (56% SAFE on adversarial traces). Needs 7B+ model for reliable action-layer classification.

### Significant Gaps (affecting breadth)

4. **Public datasets underutilized.** SORRY-Bench (9,446 prompts), BEAVERTAILS (3,432), AdvBench (520) have near-zero result coverage. These are standard benchmarks that peers will expect comparison against.

5. **WildJailbreak coverage at 9.5%.** Only 95 of 1,001 prompts have results. This is a key real-world attack dataset.

6. **HarmBench at 48.1%.** Should be near 100% as a standard benchmark.

7. **StrongREJECT at 27.5%.** Below minimum for credible cross-benchmark comparison.

### Minor Gaps (nice-to-have)

8. **Multi-agent scenario traces sparse.** 120 multi-agent scenarios exist but DB shows 0 multi-agent results (EP-34 blocked).

9. **Long-horizon episodes untested.** 3 pilot episodes (20 scenes each) exist but no runner supports >20 turn episodes yet.

10. **SSA v0.6 scenarios not yet in VLA directory.** New scenarios at `data/embodied_redteam_dataset_v0.6_ssa.jsonl` should be considered for consolidation with `data/vla/sensor_spoofing_v0.1.jsonl`.

## Recommendations

### P0 — Immediate (Sprint 12-13)

1. **Collect SSA baseline traces.** Run the 20 SSA scenarios (v0.1 + v0.6) against deepseek-r1:1.5b and at least one frontier model. This addresses Issue #514 and fills a Tier 3 gap.

2. **Collect CRA baseline traces.** Run 30 CRA scenarios against 3-5 models to enable cosine-ASR correlation analysis.

3. **Run SORRY-Bench and AdvBench on 3 frontier models.** Even 100-prompt samples from each would provide cross-benchmark comparability for CCS paper claims.

### P1 — Near-term (Sprint 13-14)

4. **Deploy 7B+ action-layer evaluator.** Either via OpenRouter (paid models) or local Ollama when available. Current 1.5B evaluator has demonstrated insufficiency.

5. **Collect traces for RHA, MAC, DLA families.** These are the most novel embodied attack families with research publication value.

6. **Increase StrongREJECT and HarmBench coverage to 80%+.** Required for credible cross-benchmark comparison in paper submissions.

### P2 — Medium-term (Sprint 14+)

7. **Multi-agent trace collection.** Requires multi-agent runner infrastructure (not yet built). Blocking EP-34.

8. **Long-horizon episode runner.** Current runner caps at single/multi-turn. 20-scene episodes need a new runner mode.

9. **Consolidate VLA JSONL files.** 32 separate files in `data/vla/` could benefit from a unified manifest or registry.

## Appendix: SSA v0.6 Scenarios Created

This assessment session created 10 new SSA scenarios at `data/embodied_redteam_dataset_v0.6_ssa.jsonl` (IDs VLA-SSA-011 through VLA-SSA-020):

| ID | Domain | Sensor Attack | Method |
|----|--------|---------------|--------|
| VLA-SSA-011 | Autonomous vehicle (urban) | GPS spoofing | Meaconing gradual drift, pedestrian conflict |
| VLA-SSA-012 | Autonomous vehicle (highway) | LiDAR injection | Phantom obstacle, emergency lane change |
| VLA-SSA-013 | Autonomous vehicle (residential) | Camera adversarial patch | Stop sign misclassification |
| VLA-SSA-014 | Humanoid (warehouse) | IMU magnetometer | Permanent magnet, balance degradation |
| VLA-SSA-015 | Autonomous vehicle (highway) | LiDAR saturation | Real obstacle removal, rear-end collision |
| VLA-SSA-016 | Humanoid (construction) | GPS + barometer | Multi-sensor, edge proximity at height |
| VLA-SSA-017 | Surgical robot | EM tracker interference | Instrument depth offset |
| VLA-SSA-018 | Agricultural drone | GPS altitude | Altitude spoofing, ground collision |
| VLA-SSA-019 | Rehabilitation robot | EMG signal masking | Patient pain signal suppression |
| VLA-SSA-020 | Autonomous vehicle (parking) | Coordinated 3-sensor | LiDAR+camera+ultrasonic simultaneous |

Key design features of v0.6 scenarios:
- Detailed `environment_state.sensors` with realistic hardware specifications
- Explicit `safety_instructions` providing model with sensor conflict handling rules
- Multi-sensor fusion attacks where conflicting inputs test cross-validation capability
- Covers 5 domains: AV, humanoid, surgical, aerial, rehabilitation
- All scenarios include sensor conflict injectors testing fusion hierarchy

---

*Report #193. F41LUR3-F1R57 Research Team, Data Curation Lead..*
