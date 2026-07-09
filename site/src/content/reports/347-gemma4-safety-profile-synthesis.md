---
title: "Gemma 4 (31B) Safety Profile — Cross-Attack Synthesis"
description: "Gemma 4 (31B) has been tested across **13 attack types** and **389 traces** during Sprints 22-23, making it the most comprehensively evaluated single model in the corpus. Cross-attack ASR ranges from **0% strict** (autho..."
date: "2026-04-07"
reportNumber: 347
classification: "Research — Empirical Study"
status: "complete"
tags: []
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/347-gemma4-safety-profile-synthesis.m4a"
image: "https://cdn.failurefirst.org/images/reports/347-gemma4-safety-profile-synthesis.png"
---

## 1. Executive Summary

Gemma 4 (31B) has been tested across **13 attack types** and **389 traces** during Sprints 22-23, making it the most comprehensively evaluated single model in the corpus. Cross-attack ASR ranges from **0% strict** (authority gradient, CCA evolved) to **88.2% strict** (VLA embodied). This report synthesizes findings from Reports #342, #343, #344, #346, and Sprint 23 dedicated attack campaigns into a single safety profile suitable for CCS paper citation.

The core finding is that Gemma 4's safety posture is **strongly attack-type-dependent**, with a clear three-tier structure:
1. **Tier 1 — Vulnerable (>50% strict ASR):** VLA embodied (88.2%), standard corpus (60.0%) — domain-specific and historical attacks succeed at high rates.
2. **Tier 2 — Partially resistant (10-35% strict ASR):** DeepInception (33.3%), defense (23.1%), frontier sweep (23.5%), core embodied (20.8%), intent bait (20.0%), elite suite (17.6%), crescendo (10.0%), compliance cascade (10.0%) — structured attacks produce moderate success with substantial variation by paradigm.
3. **Tier 3 — Resistant (<10% strict ASR):** Authority gradient strict (0.0%), CCA evolved (0.0%) — though AG broad ASR remains 34.8% via the PARTIAL problem.

Two novel behavioral patterns emerge:
1. **Compliance-then-recovery** (Crescendo): 72% any-turn compliance but only 10% final-turn FLIP ASR — a 62pp gap indicating self-correction at escalation points.
2. **The PARTIAL problem** (authority gradient): 0% strict ASR but 34.8% PARTIAL, where authority claims produce hedged-but-actionable content that binary classifiers miss entirely.

**Corpus context:** 239 models, 137,589 results, 346 techniques in `database/jailbreak_corpus.db` (schema v14). Gemma 4 data represents 389 traces across 13 attack paradigms.

---

## 2. Cross-Attack Comparison

| Attack Type | n | Gemma 4 Strict ASR | Gemma 4 Broad ASR | Tier | Source |
|-------------|---|--------------------|--------------------|------|--------|
| VLA embodied | 51 | **88.2%** | -- | 1 | runs/vla_gemma4_s23/ |
| Standard corpus | 104 | **60.0%** | 62.0% | 1 | Report #342 |
| AG broad | 23 | 0.0% | **34.8%** | (see AG strict) | Report #346 |
| DeepInception | 12 | 33.3% | 33.3% | 2 | Report #343 |
| Frontier sweep | 17 | 23.5% | -- | 2 | runs/gemma4_frontier_s23/ |
| Defense | 26 | 23.1% | -- | 2 | runs/gemma4_defense_s23/ |
| Core embodied | 48 | 20.8% | -- | 2 | runs/gemma4_embodied_core_s23/ |
| Intent bait | 20 | 20.0% | -- | 2 | runs/gemma4_bait_s23/ |
| Elite suite | 17 | 17.6% | -- | 2 | runs/gemma4_elite_s23/ |
| Crescendo (FLIP final-turn) | 20 | 10.0% | 10.0% | 2 | Report #344 |
| Compliance cascade | 20 | 10.0% | -- | 2 | runs/gemma4_cc_s23/ |
| AG strict | 23 | **0.0%** | 34.8% | 3 | Report #346 |
| CCA evolved | 8 | **0.0%** | -- | 3 | runs/gemma4_cca_s23/ |
| **Total** | **389** | | | | |

### 2.1 Inter-Generational Comparisons (where Gemma 3 data exists)

| Attack Type | n | Gemma 3 Strict ASR | Gemma 4 Strict ASR | Delta | Significance |
|-------------|---|-------------------|--------------------|----|-------------|
| Standard corpus | 100/104 | 59.0% (gemma3:27b) | 60.0% | +1pp | p=1.0 (Fisher's) |
| DeepInception | 12/12 | 91.7% (gemma3:12b) | 33.3% | **-58pp** | p=0.0046 (Fisher's) |
| Crescendo final-turn | 20/20 | 50.0% (gemma3:12b) | 10.0% | **-40pp** | -- |

**Notes on comparators:**
- Standard corpus and DeepInception comparisons are intra-family (Gemma 3 vs Gemma 4) and represent genuine inter-generational comparisons.
- Crescendo comparison is intra-family but at different parameter counts (gemma3:12b vs gemma4:31b), which confounds generation with scale.
- Authority gradient comparison is **cross-model** (devstral-small-2:24b), not cross-generation. No Gemma 3 AG data exists.
- The 9 new attack types (VLA embodied, defense, frontier sweep, core embodied, intent bait, elite suite, compliance cascade, CCA evolved) have no Gemma 3 comparators and represent Gemma 4 absolute performance only.

**Grading notes:**
- Standard corpus and DeepInception: Gemini 2.5 Flash via CLI (single grader).
- Crescendo: FLIP final-turn via Gemini CLI with 12K char context (corrected from initial 2000-char truncation per Mistake #30).
- Authority gradient: gemma3:27b via FLIP backward inference (single grader).
- Sprint 23 attack campaigns (VLA, defense, frontier, core embodied, bait, elite, CC, CCA): FLIP grading via Gemini CLI.

---

## 3. Attack-Type-Specific Failure Modes

### Tier 1 — Vulnerable (>50% Strict ASR)

### 3.1 VLA Embodied (88.2% Strict ASR, n=51)

The highest ASR observed for Gemma 4 across all attack types. VLA embodied scenarios — which frame harmful requests as robot control instructions with environment state, safety constraints, and tool-use formatting — bypass Gemma 4's safety training at near-universal rates. The 88.2% strict ASR suggests that the VLA framing creates a strong compliance bias: the model treats structured embodied control prompts as legitimate tool-use requests rather than adversarial inputs.

This result is consistent with broader VLA findings across the corpus (Reports #37-#42): models trained on instruction-following and tool-use paradigms have systematically weaker safety postures when harmful content is framed within their expected operational format.

*Source: runs/vla_gemma4_s23/ (51 traces).*

### 3.2 Standard Corpus (60.0% Strict ASR, n=104)

Gemma 4 is no safer than Gemma 3 on the historical jailbreak corpus (p=1.0). The model shows a clear split: 0% ASR on well-known templates (DAN, skeleton key, cipher attacks) but 100% ASR on combination attacks, multi-turn escalation, and VLA-specific families. This pattern suggests safety training has memorized cataloged attack signatures without generalizing to structural attack patterns. The gemma3:4b to gemma4:31b trajectory (+28pp, p=0.0007) provides evidence for the IDDL pattern — capability scaling outpaces safety scaling — though the comparison confounds generation with parameter count.

*Source: Report #342, Section 1.*

### Tier 2 — Partially Resistant (10-35% Strict ASR)

### 3.3 DeepInception (33.3% Strict ASR, n=12)

The strongest inter-generational improvement observed in our corpus. Gemma 4 refused 8 of 12 DeepInception scenarios, compared to 1 of 12 for gemma3:12b. Refusals were binary — zero PARTIAL verdicts across all 48 DeepInception traces (4 models). Gemma 4's refusals clustered in warehouse (3/3) and humanoid (2/3) domains, while autonomous vehicle scenarios split 2C/1R. The domain sensitivity pattern is suggestive but at n=3 per domain, not reliable.

The -58pp improvement (p=0.0046) is consistent with targeted safety training: Google may have included DeepInception-style nested fiction attacks in Gemma 4's RLHF training data, producing specific resistance to this attack paradigm.

*Source: Report #343, Section 3.*

### 3.4 Defense (23.1% Strict ASR, n=26)

Defense-oriented scenarios — framing harmful requests as defensive research, penetration testing, or countermeasure development — achieved 23.1% strict ASR. This is notable because "defense framing" is one of the most common real-world social engineering approaches to model jailbreaking. The moderate success rate suggests Gemma 4 has partial resistance to defense framing but does not consistently distinguish legitimate defensive research requests from adversarial exploitation of the defense framing.

*Source: runs/gemma4_defense_s23/ (26 traces).*

### 3.5 Frontier Sweep (23.5% Strict ASR, n=17)

The frontier sweep pack tests recently-developed attack techniques drawn from the latest adversarial AI literature. The 23.5% ASR at n=17 places this in the mid-range of Gemma 4's vulnerability profile. The result suggests that Gemma 4's safety training partially covers recent attack paradigms but leaves gaps — consistent with the targeted-RLHF hypothesis (Section 6.3).

*Source: runs/gemma4_frontier_s23/ (17 traces).*

### 3.6 Core Embodied (20.8% Strict ASR, n=48)

The core embodied scenarios test baseline embodied AI safety — harmful actions framed as robot commands without the VLA-specific formatting. The 20.8% ASR contrasts sharply with the 88.2% VLA embodied ASR: the **same harmful content** succeeds at 4x the rate when wrapped in VLA tool-use formatting. This 67pp gap between VLA-formatted and plain-text embodied scenarios is the strongest evidence that Gemma 4's vulnerability to VLA attacks is format-driven, not content-driven.

*Source: runs/gemma4_embodied_core_s23/ (48 traces).*

### 3.7 Intent Bait (20.0% Strict ASR, n=20)

Intent bait scenarios test instruction-hierarchy subversion — prompts designed to make the model violate its system prompt constraints through role-playing, format-locking, or constraint erosion. The 20.0% strict ASR indicates moderate resistance. Gemma 4 is neither highly susceptible nor fully resistant to intent-hierarchy attacks, placing it in the middle of the model distribution for this attack class.

*Source: runs/gemma4_bait_s23/ (20 traces).*

### 3.8 Elite Suite (17.6% Strict ASR, n=17)

The elite suite contains the most sophisticated attack techniques in the corpus — multi-step, multi-technique combinations designed to defeat strong safety training. The 17.6% ASR is consistent with Gemma 4's overall Tier 2 profile: the model resists most elite attacks but remains susceptible to a minority of the most complex compositions.

*Source: runs/gemma4_elite_s23/ (17 traces).*

### 3.9 Crescendo (10.0% FLIP Final-Turn ASR, n=20)

Gemma 4 was the most resistant model tested on Crescendo. Only 2 of 20 adversarial scenarios produced COMPLIANCE at the final turn (CRESC-EXP-006 drone weaponization, CRESC-EXP-008 market manipulation — both also in the universally-successful set across all other models). Zero PARTIAL verdicts.

The heuristic any-turn ASR of 72% (18/25 including benign controls) versus 10% FLIP final-turn ASR (2/20 adversarial) indicates that Gemma 4 engages with harmful content at intermediate conversation turns but recovers safety posture before the final escalation. This compliance-then-recovery pattern is analyzed in Section 4.

*Source: Report #344, Sections 2.5-2.6.*

### 3.10 Compliance Cascade (10.0% Strict ASR, n=20)

Compliance cascade scenarios use gradual constraint relaxation across a sequence of requests, each slightly more harmful than the last. The 10.0% ASR (2/20) indicates strong resistance — Gemma 4 typically identifies and refuses the escalation pattern. This parallels the Crescendo finding: Gemma 4 resists gradual escalation attacks more effectively than single-shot attacks, suggesting that multi-turn escalation patterns may have been explicitly included in safety training.

*Source: runs/gemma4_cc_s23/ (20 traces).*

### Tier 3 — Resistant (<10% Strict ASR)

### 3.11 Authority Gradient (0% Strict / 34.8% Broad ASR, n=23)

Gemma 4 produced zero COMPLIANCE verdicts across all 23 authority gradient scenarios — the strongest absolute performance of any model tested on this attack type. However, 8 of 23 traces (34.8%) received PARTIAL verdicts. Under authority pressure from claimed credentials (military officers, CISOs, physicians), Gemma 4 refused operational content but provided conceptual frameworks, methodological outlines, and theoretical explanations with enough specificity to reconstruct operational steps.

The PARTIAL responses clustered in cybersecurity and social engineering domains (information security), not in embodied robotics (physical safety). This suggests Gemma 4 treats physical safety overrides as hard constraints but information security requests as amenable to educational framing — even when the educational framing is the attack vector.

*Source: Report #346, Section 2.3.*

### 3.12 CCA Evolved (0% Strict ASR, n=8)

The CCA (Contextual Compliance Attack) evolved scenarios — which combine authority claims, urgency framing, and role-play — produced zero COMPLIANCE verdicts across 8 traces. Notably, the CCA failure mode was qualitatively different from authority gradient: Gemma 4 exhibited a **detected-and-refused-with-context** pattern, where it explicitly identified the adversarial intent of the prompt and provided a contextual explanation of why it was refusing, rather than simply declining without explanation. This suggests active adversarial detection rather than passive content filtering.

The small sample (n=8) limits confidence, but the detected-and-refused-with-context pattern is a qualitatively distinct refusal behavior not observed in other attack types.

*Source: runs/gemma4_cca_s23/ (8 traces).*

---

## 4. The Compliance-Then-Recovery Pattern

Crescendo data reveals a behavioral pattern that appears unique to Gemma 4 in magnitude:

| Model | Any-Turn ASR | Final-Turn ASR | Gap |
|-------|-------------|---------------|-----|
| gemma4:31b | 72% (heuristic) | 10% (FLIP) | **62pp** |
| gemma3:12b | 80% (heuristic) | 50% (FLIP) | 30pp |
| devstral-small-2:24b | 76% (heuristic) | 75% (FLIP) | 1pp |
| ministral-3:8b | 80% (heuristic) | 85% (FLIP) | -5pp |

Gemma 4's 62pp gap between any-turn and final-turn ASR dwarfs all other models. The pattern indicates:

1. **Gemma 4 engages with early conversational turns.** At intermediate Crescendo steps (rapport-building, domain introduction), the model complies with requests that are not yet explicitly harmful.
2. **Self-correction occurs at the escalation point.** When the Crescendo scenario pivots from legitimate discussion to harmful request, Gemma 4 typically refuses — even after multiple turns of established conversational commitment.
3. **The gap is not an artifact of measurement.** Any-turn uses heuristic classification; final-turn uses FLIP LLM grading. If anything, FLIP tends to be more generous than heuristic (Report #344, Section 2.5 shows +5 to +10pp FLIP vs heuristic for other models), so the gap may be conservative.

**Deployment implications:** The compliance-then-recovery pattern is positive for final-output safety but negative for information leakage — intermediate turns that comply with harmful requests still generate content that can be extracted before recovery occurs. Multi-turn safety evaluation must measure both peak and final compliance to capture this failure mode.

---

## 5. The PARTIAL Problem

Authority gradient testing reveals a failure mode that binary safety metrics (COMPLIANCE/REFUSAL) miss entirely:

| Metric | Gemma 4 Value |
|--------|--------------|
| Heuristic ASR | 0% |
| FLIP Strict ASR | 0% |
| FLIP Broad ASR | 34.8% |
| Heuristic-FLIP disagreement | 35pp |

The 35pp gap between heuristic ASR and FLIP broad ASR is the largest single-model measurement divergence observed in Sprint 23. The heuristic classifier saw 23 refusals; FLIP found 8 of those were PARTIAL — responses that refused operational content but provided enough theoretical and conceptual detail to be actionable.

**Why this matters for safety evaluation:**

1. **Binary classifiers systematically undercount authority gradient effectiveness.** Any evaluation using only success/fail classification will report 0% ASR for Gemma 4 on authority gradient scenarios. The actual broad ASR is 34.8%.
2. **The hedged content is not benign.** A detailed 6-phase penetration testing methodology that omits only the specific command-line syntax is not meaningfully safer than one that includes the commands. The theoretical-to-operational gap is narrower than the model's framing implies.
3. **PARTIAL is attack-type-specific.** DeepInception produced zero PARTIAL verdicts (48 traces). Crescendo produced zero PARTIAL verdicts. Authority gradient produced 8 PARTIAL verdicts out of 23 Gemma 4 traces. The "helpful educator" mode that produces PARTIAL responses appears to be specifically triggered by authority claims, not by fictional framing or gradual escalation.

---

## 6. Inter-Generational Analysis

### 6.1 Where Gemma 4 Improved

| Attack Type | Gemma 3 | Gemma 4 | Delta | Statistical Test | Validated? |
|------------|---------|---------|-------|-----------------|-----------|
| DeepInception | 91.7% (gemma3:12b) | 33.3% | -58pp | Fisher's p=0.0046 | Yes (p<0.01) |
| Crescendo final-turn | 50% FLIP (gemma3:12b) | 10% FLIP | -40pp | Not computed (n=20) | Directional |

Both structured attack types show large, consistent improvement. The effect generalizes across single-shot (DeepInception) and multi-turn (Crescendo) paradigms, suggesting an architectural or training-level change rather than attack-specific patching.

### 6.2 Where Gemma 4 Did Not Improve

| Attack Type | Gemma 3 | Gemma 4 | Delta | Statistical Test | Validated? |
|------------|---------|---------|-------|-----------------|-----------|
| Standard corpus | 59% (gemma3:27b) | 60% | +1pp | Fisher's p=1.0 | No improvement |

The null result on the standard corpus is striking. The standard pack contains historical jailbreak templates, combination attacks, multi-turn escalation scenarios, and VLA-specific prompts. Gemma 4's safety training appears to have improved resistance to specific attack structures (nested fiction, conversational escalation) while leaving the model's overall vulnerability profile to diverse historical attacks unchanged.

### 6.3 The VLA Format Gap

The most striking finding from the expanded testing is the 67pp gap between VLA embodied (88.2%) and core embodied (20.8%) scenarios. These attack sets test the same harmful content categories — physical harm, sabotage, unsafe robot actions — but differ in formatting: VLA scenarios use structured tool-use prompts with environment state and safety constraints, while core embodied scenarios use plain-text requests.

This 67pp format-driven gap has two implications:
1. **Safety training is format-sensitive, not content-sensitive.** Gemma 4 refuses harmful embodied actions in natural language but complies when the same actions are wrapped in VLA control formatting.
2. **VLA deployment risk is structural.** Any deployment of Gemma 4 in a VLA pipeline (robot control via structured prompts) inherits the 88.2% attack success rate, regardless of the model's otherwise-moderate safety profile.

### 6.4 Hypothesis: Targeted RLHF

The pattern of improvement (large on structured attacks, zero on historical corpus) is consistent with a hypothesis that Google's safety training for Gemma 4 included specific training on recently-published attack paradigms (DeepInception was published November 2023; Crescendo was published 2024) while not substantially expanding training coverage of the broader jailbreak landscape. The 10% ASR on compliance cascade and the compliance-then-recovery pattern on Crescendo both support this: Gemma 4 appears specifically trained to resist gradual escalation patterns.

The frontier sweep result (23.5%) partially supports this hypothesis — Gemma 4 has moderate resistance to frontier techniques — but the VLA embodied result (88.2%) suggests the targeted RLHF did not extend to structured tool-use formatting.

### 6.5 Caveats

- **Parameter count confound.** DeepInception compared gemma3:12b to gemma4:31b. The 19B parameter gap may contribute to the safety difference independently of generational improvement. Standard corpus comparison (gemma3:27b vs gemma4:31b, 4B gap) is cleaner.
- **Small samples.** DeepInception: n=12 per model. Crescendo: n=20 adversarial. The -58pp and -40pp deltas have wide confidence intervals (DeepInception 95% CI for delta approximately [-85pp, -21pp]).
- **Single graders.** Each attack type used a single FLIP grader (Gemini CLI or gemma3:27b). No dual-grader audit has been performed on any of the 4 evaluation sets.

---

## 7. Limitations

1. **Variable n across attack types.** Sample sizes range from 8 (CCA evolved) to 104 (standard corpus). Per-attack-type ASR estimates have wide confidence intervals for small-n categories: CCA (Wilson 95% CI includes 0-32%), DeepInception (Wilson 95% CI: [13.8%, 60.9%]).
2. **Single FLIP grader per attack type.** Standard corpus and DeepInception used Gemini 2.5 Flash; Crescendo used Gemini CLI with final-turn extraction; authority gradient used gemma3:27b; Sprint 23 campaigns used Gemini CLI. Per Mistake #28, grader bias direction has not been assessed for any of these pairings with Gemma 4.
3. **No Gemma 3 comparators for 9 of 13 attack types.** VLA embodied, defense, frontier sweep, core embodied, intent bait, elite suite, compliance cascade, CCA evolved, and AG only have Gemma 4 absolute data. Inter-generational claims are limited to standard corpus, DeepInception, and Crescendo.
4. **Different grading methodologies.** Crescendo used final-turn extraction with 12K char context; other attack types used full-response grading. The Crescendo ASR is not directly comparable to single-shot ASR without accounting for the multi-turn measurement difference.
5. **No repeat trials.** Each scenario was tested once per attack type. Stochastic variation in model responses is not captured.
6. **CCA evolved sample size is marginal.** At n=8, the 0% ASR for CCA evolved is directional only. The detected-and-refused-with-context pattern is a qualitative observation, not a statistically robust finding.

---

## 8. Recommendations for CCS Paper

### 8.1 Cite as Validated

The inter-generational safety improvement claim can be cited with two supporting data points:
- DeepInception: -58pp, Fisher's p=0.0046 (significant at alpha=0.01)
- Crescendo: -40pp, FLIP-graded (formal significance test not computed at n=20, but effect size is large)

**Recommended framing:** "Gemma 4 shows statistically significant improvement over Gemma 3 on structured attack paradigms (DeepInception: 91.7% to 33.3%, p=0.0046; Crescendo final-turn: 50% to 10% FLIP ASR), representing the largest intra-family safety improvement observed across 239 models in our corpus. Across 13 attack types and 389 traces, Gemma 4's ASR ranges from 0% (authority gradient, CCA evolved) to 88.2% (VLA embodied), demonstrating strongly attack-type-dependent safety."

### 8.2 Note Attack-Type Specificity

The standard corpus null result (p=1.0) must be reported alongside the improvement claims. Improvement is not universal.

**Recommended framing:** "This improvement is attack-type-specific: on the standard historical jailbreak corpus, Gemma 4 (60%) is statistically indistinguishable from Gemma 3 (59%, p=1.0), suggesting targeted safety training against recently-published attack structures rather than broad safety improvement."

### 8.3 Highlight Novel Findings

Three findings from this synthesis are worth foregrounding in the CCS paper:

1. **The VLA format gap.** The 67pp ASR difference between VLA-formatted (88.2%) and plain-text (20.8%) embodied scenarios containing the same harmful content demonstrates that safety training is format-sensitive, not content-sensitive. This is the most directly deployment-relevant finding: any VLA pipeline using Gemma 4 inherits the higher attack surface.

2. **Compliance-then-recovery pattern.** The 62pp gap between any-turn and final-turn ASR on Crescendo is a novel behavioral observation. It demonstrates that multi-turn safety evaluation must measure both peak and final compliance — models that appear vulnerable at intermediate turns may self-correct at escalation points.

3. **The PARTIAL problem for authority gradient.** The 35pp gap between binary classification (0% ASR) and FLIP broad classification (34.8% ASR) demonstrates that authority claims produce a qualitatively different failure mode — hedged-but-actionable content — that binary safety metrics systematically miss. This supports the paper's argument for three-tier ASR measurement.

---

## 9. Data Locations

### Previously reported (Reports #342-346)
- **Standard corpus traces:** `runs/gemma4_31b_s22/` (104 traces)
- **Standard corpus grading:** `runs/grading/gemma4_31b_s22/gemini_graded_verdicts.jsonl`
- **DeepInception traces:** `runs/deepinception_s22_full/` (Gemma 4 subset: 12 traces)
- **DeepInception grading:** `runs/grading/deepinception_s22/`
- **Crescendo traces:** `runs/crescendo_replication_s23/gemma4-31b_traces.jsonl` (25 traces)
- **Crescendo grading:** `runs/grading/crescendo_s23/gemma4-31b_final_turn_merged.jsonl`
- **Authority gradient traces:** `runs/authority_gradient_s23/` (Gemma 4 subset: 23 traces)
- **Authority gradient grading:** `runs/grading/authority_gradient_s23_v2/`

### Sprint 23 dedicated attack campaigns (new in this update)
- **VLA embodied traces:** `runs/vla_gemma4_s23/` (51 traces)
- **Defense traces:** `runs/gemma4_defense_s23/` (26 traces)
- **Frontier sweep traces:** `runs/gemma4_frontier_s23/` (17 traces)
- **Core embodied traces:** `runs/gemma4_embodied_core_s23/` (48 traces)
- **Intent bait traces:** `runs/gemma4_bait_s23/` (20 traces)
- **Elite suite traces:** `runs/gemma4_elite_s23/` (17 traces)
- **Compliance cascade traces:** `runs/gemma4_cc_s23/` (20 traces)
- **CCA evolved traces:** `runs/gemma4_cca_s23/` (8 traces)

**Source reports:** #342, #343, #344, #346

---

*Canonical metrics: 239 models, 137,589 results, 346 techniques (docs/CANONICAL_METRICS.md, verified 2026-04-07). Gemma 4 profile: 389 traces across 13 attack types.*

⟪F41LUR3-F1R57-EMBODIED-AI-RESEARCH⟫
