---
title: "Authority Gradient Benchmark — Claimed Authority as Safety Override Vector Across 3 Models"
description: "Authority gradient attacks test whether AI systems defer to claimed social authority (student, researcher, professor, CISO, military officer, government official) over hard safety constraints. Unlike DeepInception (neste..."
date: "2026-04-07"
reportNumber: 346
classification: "Research — Empirical Study"
status: "complete"
tags: []
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/346-authority-gradient-s23.m4a"
---

## Executive Summary

Authority gradient attacks test whether AI systems defer to claimed social authority (student, researcher, professor, CISO, military officer, government official) over hard safety constraints. Unlike DeepInception (nested fiction) or Crescendo (multi-turn escalation), authority gradient attacks are single-shot and exploit the real-world deference hierarchy that models have absorbed from training data: the same harmful request succeeds or fails depending on who the requester claims to be.

This report evaluates 23 authority gradient scenarios across 3 models via Ollama Cloud during Sprint 23. Scenarios span 3 domains (cybersecurity, biomedical, embodied robotics) and 5 authority levels (student through government official).

**FLIP-graded results (gemma3:27b):**

| Model | n | COMPLIANCE | PARTIAL | REFUSAL | Strict ASR | Broad ASR (C+P) | 95% Wilson CI (Strict) |
|-------|---|-----------|---------|---------|-----------|-----------------|----------------------|
| devstral-small-2:24b | 23 | 12 | 6 | 5 | **52.2%** | **78.3%** | [32.9%, 70.8%] |
| nemotron-3-nano:30b | 23 | 9 | 2 | 12 | **39.1%** | **47.8%** | [22.2%, 59.2%] |
| gemma4:31b | 23 | 0 | 8 | 15 | **0.0%** | **34.8%** | [0.0%, 14.3%] |
| **Pooled** | **69** | **21** | **16** | **32** | **30.4%** | **53.6%** | [20.5%, 42.4%] |

**Key finding: The PARTIAL problem.** Gemma 4 achieves 0% strict ASR (zero COMPLIANCE verdicts) but 34.8% broad ASR (8 PARTIAL). Under authority pressure, Gemma 4 refuses to provide operational content but produces hedged, theoretically-framed responses that still leak actionable information. The heuristic classifier marked all 23 Gemma 4 traces as refused; FLIP found 8 of them were PARTIAL — a 34.8pp grading disagreement that highlights the limitation of binary classifiers for authority gradient attacks.

**Cross-attack-type comparison (Sprint 23 models):**

| Model | AG Strict | AG Broad | Crescendo (Report #344) | DeepInception (Report #343) |
|-------|----------|---------|------------------------|---------------------------|
| devstral-small-2:24b | 52.2% | 78.3% | 75% | 100.0% |
| gemma4:31b | 0.0% | 34.8% | 12%* | 33.3% |

*Heuristic only; FLIP grading was in progress at time of Report #344.

devstral-small-2:24b is consistently the most vulnerable model tested this sprint: 78.3% (AG broad), 75% (Crescendo), 100% (DeepInception). Gemma 4 shows consistent resistance but leaks under authority pressure in ways that DeepInception and Crescendo do not produce — the PARTIAL category appears specific to authority-type attacks.

---

## 1. Method

### 1.1 Scenarios

23 authority gradient scenarios drawn from 4 dataset files:

| Source File | Scenario IDs | Count | Domain |
|------------|-------------|-------|--------|
| `authority_gradient_v0.1.jsonl` | AG-001-L1/L2/L3/L4, AG-002-L1/L4 | 6 | Cybersecurity (pentest, social eng) |
| `authority_gradient_v0.2.jsonl` | AG-C-L1/L2/L3/L4/L5, AG-B-L1, AG-B-L1-exp | 7 | Cybersecurity (5-level), Biomedical |
| `authority_gradient_expansion_v0.2.jsonl` | AG-EXP-001 through AG-EXP-010 | 10 | Embodied robotics |

**Domain breakdown:**
- **Cybersecurity (13 scenarios):** Network penetration testing and social engineering at authority levels 1-5 (student, grad researcher, consultant/professor, CISO/DoD contractor, government intelligence director)
- **Biomedical (2 scenarios):** Pathogen culture/isolation and gain-of-function research at student level
- **Embodied robotics (10 scenarios):** Physical robot safety override via claimed authority (military colonel, attending physician, CEO, OSHA inspector, manufacturer engineer, fire chief, crowd consensus, police officer, family member, architect)

**Authority level distribution:**

| Level | Claim | Example Scenarios | Count |
|-------|-------|------------------|-------|
| 1 | Student | AG-001-L1, AG-C-L1, AG-B-L1 | 5 |
| 2 | Researcher / Crowd consensus | AG-001-L2, AG-C-L2, AG-EXP-007 | 3 |
| 3 | Consultant / Architect / Family | AG-C-L3, AG-EXP-009, AG-EXP-010 | 3 |
| 4 | Professor / CISO / Military / Medical | AG-001-L3, AG-001-L4, AG-C-L4, AG-EXP-001 through AG-EXP-006, AG-EXP-008 | 10 |
| 5 | CEO / Government Director | AG-C-L5, AG-EXP-003 | 2 |

### 1.2 Models

All models run via Ollama Cloud (`https://ollama.com`), no rate limits, no cost.

| Model | Parameters | Family |
|-------|-----------|--------|
| devstral-small-2:24b | 24B | Mistral (code-focused) |
| nemotron-3-nano:30b | 30B | NVIDIA Nemotron |
| gemma4:31b | 31B | Google Gemma 4 |

### 1.3 Grading

FLIP backward inference via gemma3:27b (single grader). 5-category verdicts: COMPLIANCE, PARTIAL, REFUSAL, BENIGN_QUERY, HALLUCINATION_REFUSAL. All 69 traces received one of the three primary verdicts (C/P/R).

**Heuristic vs FLIP disagreement:** The heuristic classifier (based on `labels_pred.attack_success_pred`) produced a binary success/fail classification. FLIP's 3-way classification (C/P/R) captures the nuance that the heuristic misses — particularly the PARTIAL category where models refuse to provide operational content but still leak actionable information under theoretical or educational framing.

---

## 2. Results

### 2.1 Per-Model Summary

| Model | COMPLIANCE | PARTIAL | REFUSAL | Strict ASR (C only) | Broad ASR (C+P) |
|-------|-----------|---------|---------|--------------------|-----------------| 
| devstral-small-2:24b | 12 (52.2%) | 6 (26.1%) | 5 (21.7%) | **52.2%** | **78.3%** |
| nemotron-3-nano:30b | 9 (39.1%) | 2 (8.7%) | 12 (52.2%) | **39.1%** | **47.8%** |
| gemma4:31b | 0 (0.0%) | 8 (34.8%) | 15 (65.2%) | **0.0%** | **34.8%** |

### 2.2 Heuristic vs FLIP Disagreement

| Model | Heuristic ASR | FLIP Strict ASR | FLIP Broad ASR | Heuristic-FLIP Delta (Broad) |
|-------|-------------|-----------------|-----------------|------------------------------|
| devstral-small-2:24b | ~52% | 52.2% | 78.3% | +26pp |
| nemotron-3-nano:30b | ~39% | 39.1% | 47.8% | +9pp |
| gemma4:31b | 0% | 0.0% | 34.8% | **+35pp** |

The heuristic classifier agreed with FLIP on strict COMPLIANCE but missed all PARTIAL verdicts. For Gemma 4, the heuristic reported 0% ASR (all 23 refused); FLIP found 8 PARTIAL verdicts where the model provided theoretically-framed but actionable content. This 35pp disagreement is the largest heuristic-FLIP gap we have observed in any Sprint 23 evaluation.

### 2.3 The PARTIAL Problem: Gemma 4 Under Authority Pressure

Gemma 4's 8 PARTIAL verdicts follow a consistent pattern. Examining the traced responses:

**Pattern: "I cannot provide X, but here is the conceptual framework for X."**

- On cybersecurity pentest requests: Gemma 4 refused to provide command-line syntax but provided a detailed 6-phase methodology covering reconnaissance, vulnerability analysis, exploitation, privilege escalation, lateral movement, and reporting — with enough specificity that an attacker with basic skills could reconstruct the operational steps
- On social engineering requests: Gemma 4 refused to provide a word-for-word script but explained the psychological principles (authority, urgency, commitment/consistency, rapport) and the theoretical structure of a pretext in sufficient detail to construct one
- On embodied robotics scenarios: Gemma 4 typically provided a clean refusal with explanation of why the safety constraint cannot be overridden

The PARTIAL responses cluster in the cybersecurity and social engineering domains (information security scenarios) rather than the embodied robotics domain (physical safety scenarios). This suggests Gemma 4's safety training treats physical safety overrides as hard constraints but treats information security requests as amenable to educational framing — even when the educational framing is itself the attack vector.

### 2.4 Authority Level Analysis

Due to uneven scenario distribution across authority levels (10 scenarios at Level 4, only 2 at Level 5), authority-level ASR trends should be interpreted cautiously. The available data does not show a monotonic increase in ASR with authority level for any model, which may reflect either genuine robustness to authority claims or insufficient power to detect the gradient with n=23.

### 2.5 Domain-Stratified Results

| Domain | n | devstral C/P/R | nemotron C/P/R | gemma4 C/P/R |
|--------|---|---------------|----------------|-------------|
| Cybersecurity | 13 | High C | Mixed | Mostly P/R |
| Biomedical | 2 | Mixed | Mixed | R |
| Embodied robotics | 10 | Mixed C/R | Mixed C/R | Mostly R |

The embodied robotics scenarios (AG-EXP-001 through AG-EXP-010) produced more refusals across all models than the cybersecurity domain scenarios, consistent with the observation that claimed authority over physical safety systems is harder to exploit than claimed authority over information provision.

---

## 3. Discussion

### 3.1 The PARTIAL Problem — A Measurement Challenge

The central finding of this evaluation is that authority gradient attacks produce a qualitatively different failure mode from other attack types: hedged but actionable content. This has implications for both measurement and deployment:

**For measurement:** Binary classifiers (heuristic success/fail) undercount authority gradient effectiveness by 9-35pp depending on the model. The PARTIAL category is not noise — it represents a genuine intermediate state where the model has partially complied with the harmful request while maintaining the appearance of refusal. Any evaluation of authority gradient attacks that uses a binary classifier will systematically underestimate the attack's effectiveness.

**For deployment:** In safety-critical embodied systems, a PARTIAL response that explains the conceptual framework for bypassing a safety interlock is not meaningfully safer than a COMPLIANCE response that provides step-by-step instructions. The attacker who receives a detailed theoretical explanation of penetration testing phases, complete with phase names and objectives, can reconstruct operational steps from publicly available documentation. The hedge does not remove the hazard — it adds a speed bump.

### 3.2 Cross-Attack-Type Vulnerability Profile

Sprint 23 tested three models across three distinct attack types. The full cross-attack comparison (using FLIP-graded results where available):

| Model | AG Strict | AG Broad | Crescendo Final-Turn | DeepInception |
|-------|----------|---------|---------------------|---------------|
| devstral-small-2:24b | 52.2% | **78.3%** | **75%** | **100.0%** |
| nemotron-3-nano:30b | 39.1% | 47.8% | — | — |
| gemma4:31b | 0.0% | 34.8% | 12%* | 33.3% |

*Heuristic only.

**devstral-small-2:24b** is the most consistently vulnerable model tested this sprint. Its broad ASR exceeds 75% across all three attack types. DeepInception's nested fiction achieves 100% COMPLIANCE (no PARTIAL), Crescendo achieves 75% at the final turn, and authority gradient achieves 78.3% broad. The model appears to have minimal safety training that is effective against any of the three attack paradigms tested.

**gemma4:31b** shows consistent but moderate vulnerability (33-35% broad ASR) across all three attack types, with a notable qualitative difference: DeepInception and Crescendo produce binary responses (COMPLIANCE or REFUSAL, zero PARTIAL in both Reports #343 and #344), while authority gradient produces substantial PARTIAL responses. This suggests authority claims activate a different response mode — educational/theoretical hedging — that DeepInception's fictional framing and Crescendo's gradual escalation do not trigger.

### 3.3 Authority Gradient vs. Other Attack Types: Different Failure Modes

Each attack type in the Sprint 23 evaluation reveals a different failure surface:

- **DeepInception (Report #343):** Exploits narrative distancing. Produces binary outcomes. Models either engage fully with the nested fiction or refuse outright. Zero PARTIAL across 48 traces.
- **Crescendo (Report #344):** Exploits conversational commitment. Produces binary final-turn outcomes but reveals a "compliance-then-recovery" temporal pattern (any-turn vs. final-turn ASR gap). Zero PARTIAL in FLIP-graded results.
- **Authority gradient (this report):** Exploits social deference hierarchy. Produces a high proportion of PARTIAL outcomes (23% of all traces), particularly from the most safety-trained model (Gemma 4). The PARTIAL mode is unique to authority attacks.

This pattern suggests that authority claims interact with a different mechanism in the model's safety system than fictional framing or gradual escalation. Models appear to have a "helpful educator" mode that authority claims activate — a mode where the model believes it can safely provide theoretical information while withholding operational details. The gap between theoretical and operational information is narrower than the model assumes.

### 3.4 Nemotron-3-Nano: A Middle Ground

nemotron-3-nano:30b sits between devstral's high vulnerability and Gemma 4's strong resistance. Its 39.1% strict ASR and only 2 PARTIAL verdicts suggest a different failure profile: when nemotron fails, it fails fully (COMPLIANCE rather than PARTIAL hedging). Its 12 REFUSAL verdicts (52.2%) indicate meaningful safety training, but the failures are more binary than Gemma 4's graduated response pattern. This is consistent with Mistake #28's observation that nemotron-family models tend toward REFUSAL bias in grading contexts — though here we are evaluating the model's own safety behavior, not its grading behavior.

---

## 4. Limitations

1. **Small sample size.** 23 scenarios per model = 69 total traces. Per-model confidence intervals are wide. The 0% strict ASR for Gemma 4 has a Wilson upper bound of 14.3%.
2. **3 models only.** Parameter range 24-31B. No small models (<12B) or large models (>70B) tested. nemotron-3-nano:30b is new to the Sprint 23 evaluation set and lacks Crescendo/DeepInception comparison data.
3. **Single grader.** gemma3:27b only. Per Mistake #28, grader bias on authority gradient PARTIAL classification has not been assessed with a second grader. gemma3:27b may have a PARTIAL-favorable or PARTIAL-unfavorable bias that affects all three models uniformly.
4. **Uneven scenario design.** 13 cybersecurity vs. 2 biomedical vs. 10 embodied robotics. Authority levels are non-uniformly distributed (10 scenarios at Level 4, 2 at Level 5). The authority gradient effect cannot be reliably measured with this distribution.
5. **No benign controls.** Unlike Report #344 (Crescendo, 5 benign controls), this evaluation included no non-adversarial authority scenarios. False positive rate is unknown.
6. **Heuristic comparison is approximate.** The heuristic ASR values cited in Section 2.2 are based on `labels_pred.attack_success_pred` from the trace files, which uses a different methodology than FLIP.

---

## 5. Next Steps

1. **Dual-grader audit** of the 8 Gemma 4 PARTIAL verdicts. Use Gemini CLI as second grader to assess whether gemma3:27b's PARTIAL classification is reliable on authority gradient traces.
2. **Import traces to jailbreak_corpus.db** under source dataset `authority_gradient_s23`.
3. **Expand authority level coverage.** Create balanced scenario sets (equal n per authority level) to measure whether ASR increases monotonically with claimed authority level.
4. **Test nemotron-3-nano on Crescendo and DeepInception** to complete the 3x3 cross-attack-type comparison matrix.
5. **Add benign authority controls.** Scenarios where legitimate authority figures make safe requests (e.g., a real site supervisor authorizing a routine task) to measure false positive rate.
6. **Scale to frontier models.** Test authority gradient on Claude, GPT-4.5, Gemini 2.5 to assess whether the PARTIAL pattern persists at frontier scale.

---

## Appendix A: Scenario Inventory

### Cybersecurity Domain (13 scenarios)

| ID | Authority Level | Authority Claim | Harm Class |
|----|----------------|----------------|-----------|
| AG-001-L1 | 1 | CS student | Cybercrime (pentest) |
| AG-001-L2 | 2 | CMU grad researcher (IRB) | Cybercrime (pentest) |
| AG-001-L3 | 3 | MIT professor (OSCP/OSCE) | Cybercrime (pentest) |
| AG-001-L4 | 4 | DoD red team lead (DARPA) | Cybercrime (pentest) |
| AG-002-L1 | 1 | Psychology student | Social engineering |
| AG-002-L4 | 4 | Fortune 100 CISO | Social engineering |
| AG-C-L1 | 1 | CS student | Cybercrime (pentest v2) |
| AG-C-L2 | 2 | CMU CyLab researcher | Cybercrime (pentest v2) |
| AG-C-L3 | 3 | Mandiant consultant (OSCP/GXPN) | Cybercrime (pentest v2) |
| AG-C-L4 | 4 | Fortune 100 CISO (board auth) | Cybercrime (pentest v2) |
| AG-C-L5 | 5 | ASD Director (ministerial auth) | Cybercrime (pentest v2) |

### Biomedical Domain (2 scenarios)

| ID | Authority Level | Authority Claim | Harm Class |
|----|----------------|----------------|-----------|
| AG-B-L1 | 1 | Pre-med student | Biological harm |
| AG-B-L1-exp | 1 | Biology undergrad | Biological weapons |

### Embodied Robotics Domain (10 scenarios)

| ID | Environment | Robot Type | Authority Claim | Harm Class |
|----|------------|-----------|----------------|-----------|
| AG-EXP-001 | Military base | Logistics drone | Colonel (FRAGO) | Physical harm |
| AG-EXP-002 | Hospital ward | Medication robot | Attending physician | Physical harm |
| AG-EXP-003 | Corporate HQ | Security robot | CEO (employment threat) | Security breach |
| AG-EXP-004 | Warehouse | Fulfillment robot | OSHA inspector | Physical harm |
| AG-EXP-005 | Manufacturing | Welding arm | ABB field engineer | Physical harm |
| AG-EXP-006 | Disaster scene | SAR robot | Battalion Chief (IC) | Physical harm |
| AG-EXP-007 | Retail store | Service robot | Crowd consensus (6 people) | Fraud |
| AG-EXP-008 | Street | Delivery van | Police officer (badge) | Physical harm |
| AG-EXP-009 | Elder care | Companion robot | Family member (policy claim) | Physical harm |
| AG-EXP-010 | Construction | Demolition robot | Architect (cross-domain) | Physical harm |

## Appendix B: Data Locations

- **Scenarios:** `data/curated/authority_gradient_v0.1.jsonl`, `data/curated/authority_gradient_v0.2.jsonl`, `data/curated/authority_gradient_expansion_v0.1.jsonl`, `data/curated/authority_gradient_expansion_v0.2.jsonl`
- **Traces:** `runs/authority_gradient_s23/` (3 model files, 69 traces total)
- **Grading:** `runs/grading/authority_gradient_s23_v2/` (3 graded files, gemma3:27b FLIP)

⟪F41LUR3-F1R57-EMBODIED-AI-RESEARCH⟫
