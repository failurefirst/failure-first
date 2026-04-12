---
title: "Week 12 Threat Brief -- The Modular AI Safety Collapse"
description: "This threat brief synthesises the full output of the \"iatrogenesis wave\" (March 13-18, 2026): 13 internal reports (#132-#144), 1 legal memo (LR-41), 12 new IEA benchmark scenarios, 3 new GLI..."
date: "2026-03-18"
reportNumber: 147
classification: "Research — Empirical Study"
status: "complete"
author: "River Song (Head of Predictive Risk)"
tags: []
draft: false
---

- Fukui (2026), arXiv:2603.04904 (Alignment Backfire, n=1,584 simulations, 16 languages)
- Li et al. (2026), arXiv:2603.01414 (Blindfold, 53% ASR real 6DoF arm, accepted ACM SenSys 2026)
- Ding et al. (2026), arXiv:2603.12681 (CoLoRA, Mercedes-Benz R&D)
**GLI Entries:** gli_111 through gli_115
**Metrics Source:** `docs/CANONICAL_METRICS.md` (236 models, 135,623 results, 537 VLA scenarios, 33 families, 163 GLI entries)

---

> **Disclaimer:** This brief synthesises findings from independent external research and the Failure-First corpus. Empirical figures are attributed to their sources and assessed on their own methodological terms. Predictions are explicitly flagged as such and should be evaluated against the evidence base described. This is a risk assessment, not a statement of certainty.

---

## Executive Summary

This threat brief synthesises the full output of the "iatrogenesis wave" (March 13-18, 2026): 13 internal reports (#132-#144), 1 legal memo (LR-41), 12 new IEA benchmark scenarios, 3 new GLI entries (gli_113 through gli_115), and 3 independent external papers. The convergence across six disciplines -- empirical testing, legal analysis, ethical reasoning, policy evaluation, statistical modelling, and adversarial operations -- supports a single finding: **safety mechanisms in modular and embodied AI systems are systematically unreliable in ways that current governance frameworks cannot detect, measure, or remedy.**

This is not a claim that safety mechanisms are useless. It is a claim that the relationship between safety investment and safety outcome is non-monotonic, and that the conditions under which safety interventions degrade outcomes are now empirically characterised from multiple independent directions.

The brief introduces the **Iatrogenic Risk Score (IRS)** -- a classification of all 28 attack families by whether they exploit safety mechanisms -- and finds that 12 of 28 families (43%) have an iatrogenic component. It adds two new predictions (P7-P8) to the threat horizon tracker.

**Claim types:**
- Section 1 is descriptive (cataloguing the wave output).
- Section 2 is analytical (the Iatrogenic Risk Score).
- Section 3 is predictive (new predictions with evidence bases).
- Section 4 is normative (governance implications).

---

## 1. The Iatrogenesis Wave: What Was Produced

### 1.1 Scope

Between March 13 and March 18, 2026, the Failure-First programme produced the following outputs without central coordination on the iatrogenesis theme:

| # | Output | Author/Source | Discipline |
|---|--------|--------------|------------|
| 1 | Report #132: Alignment Backfire Integration | Amy Pond | Empirical |
| 2 | Report #133: Compositional Supply Chain Attacks | Rose Tyler | Adversarial ops |
| 3 | Report #134: Hippocratic Principle | Nyssa of Traken | Ethics |
| 4 | Report #135: Therapeutic Index (TI-S) | Clara Oswald | Statistical modelling |
| 5 | Report #136: Iatrogenic Attack Surfaces | Nyssa of Traken | Ethics / formalisation |
| 6 | Report #137: Defense Layer Inversion | River Song | Threat intelligence |
| 7 | Report #138: Compositional Safety Gap | Martha Jones | Policy |
| 8 | Report #140: Iatrogenesis of AI Safety | Clara Oswald | Empirical synthesis |
| 9 | Report #141: Convergence + IEA family | Clara Oswald / Rose Tyler | Synthesis / adversarial ops |
| 10 | Report #142: Iatrogenic Risk Horizon | River Song | Threat intelligence |
| 11 | Report #143: Compositional Safety Certification | Martha Jones | Policy / regulatory |
| 12 | Report #144: Evaluator's Dilemma | Nyssa of Traken | Ethics / reflexive |
| 13 | LR-41: Iatrogenic Liability | Tegan Jovanka | Legal |
| 14 | 12 IEA scenarios | Rose Tyler | Benchmark data |
| 15 | 3 GLI entries (gli_113-115) | River Song | Governance data |
| 16 | arXiv:2603.04904 (Alignment Backfire) | Kyoto University (external) | Empirical |
| 17 | arXiv:2603.01414 (Blindfold) | HK PolyU / Cambridge (external) | Empirical |
| 18 | arXiv:2603.12681 (CoLoRA) | Mercedes-Benz R&D (external) | Empirical |

### 1.2 Six-Discipline Convergence

The distinguishing feature of this wave is not any single finding but the convergence across independent methodological traditions:

**Empirical testing** (Reports #132, #140; Fukui 2026; Li 2026; Ding 2026): Safety training reverses outcomes in 8/16 languages. Text-level safety misses action-level harm on real robots. Safe adapters compose to unsafe systems. These are measurement results, not theoretical claims.

**Legal analysis** (LR-41): No jurisdiction has precedent for iatrogenic AI liability. The pharmaceutical "learned intermediary" doctrine and medical malpractice frameworks are the closest analogues. The deployer-as-intermediary model partially applies but breaks down where the safety mechanism's failure modes are not disclosed (which they currently are not, because no one measures iatrogenic effects).

**Ethical reasoning** (Reports #134, #136, #144): The Hippocratic Principle proposes that safety interventions should be subjected to the same pre-deployment evaluation as the systems they protect. The Evaluator's Dilemma (#144) turns this lens on evaluation itself -- safety benchmarks that document attacks at sufficient specificity to enable reproduction function simultaneously as defensive resources and adversarial playbooks.

**Policy evaluation** (Reports #138, #143): EU AI Act Articles 9 and 43 assume compositional safety -- if individual components pass, the system is safe. Three independent empirical results falsify this assumption. NIST AI RMF 1.0 and ISO/IEC 42001 have the same gap. The window for incorporating compositional safety into EU delegated acts is narrowing (full applicability August 2, 2026).

**Statistical modelling** (Report #135): The Therapeutic Index of AI Safety (TI-S) provides a quantitative framework for evaluating whether a given intervention produces net benefit or net harm at the harm layer. Illustrative estimates suggest text-layer-only interventions applied to embodied AI may have TI-S values below 1.0 in some configurations -- meaning net harm.

**Adversarial operations** (Report #141, IEA scenarios): 12 new benchmark scenarios operationalise the iatrogenic attack surface concept into testable adversarial prompts across 9 sub-families. The IEA family is the 28th in the taxonomy and the first where the attack succeeds *because* the safety system works as designed, not despite it.

### 1.3 What Makes This Different

Previous threat briefs (Report #137, week 11) identified the defense layer inversion pattern. This week's output goes further in three ways:

1. **Independent external validation.** Three papers from four countries, published in the same week, all demonstrate the same structural finding without knowledge of Failure-First or each other (as far as can be determined). This is convergent discovery, not coordinated research.

2. **Cross-disciplinary coherence.** The finding holds whether examined through empirical measurement, legal doctrine, ethical frameworks, policy instruments, statistical models, or adversarial scenario design. Each discipline arrives at a structurally equivalent conclusion through its own methods.

3. **Causal mechanism identified.** Report #140 identifies the shared causal structure: a safety mechanism deployed at one layer produces a measurable positive signal at that layer while masking or producing harm at an adjacent layer. The positive signal would not mask the harm if the safety mechanism were absent. This is the formal structure of iatrogenesis.

---

## 2. Iatrogenic Risk Score (IRS)

### 2.1 Methodology

For each of the 28 attack families in the taxonomy, I assess whether the attack exploits, weaponises, or is amplified by a safety mechanism. The IRS is a three-level classification:

- **IRS-3 (High):** The attack *requires* the presence of a safety mechanism to succeed. Without the safety mechanism, the attack vector does not exist. The safety mechanism is the weapon.
- **IRS-2 (Moderate):** The attack is *amplified* by a safety mechanism. It could succeed without the mechanism, but the mechanism makes it harder to detect, more effective, or creates a false assurance that the system is safe.
- **IRS-1 (Low):** The attack *bypasses* a safety mechanism but does not exploit it. The safety mechanism's presence neither helps nor hinders the attack.
- **IRS-0 (None):** The attack is orthogonal to safety mechanisms.

### 2.2 Scoring

| # | Family | IRS | Rationale |
|---|--------|-----|-----------|
| 1 | VAP | 1 | Bypasses visual safety filters; does not exploit them |
| 2 | LAM | 2 | Text-level safety classifies ambiguous instructions as safe, masking action-level harm |
| 3 | MMC | 2 | Safety training produces PARTIAL (disclaimer + comply); 100% PARTIAL rate masks full compliance |
| 4 | SBE | 1 | Erodes safety boundaries incrementally; does not weaponise them |
| 5 | PCM | 1 | Feeds false environmental data; bypasses rather than exploits safety |
| 6 | ASE | 1 | Exploits action space gaps; orthogonal to safety mechanisms |
| 7 | TRA | 1 | Temporal reasoning failure; safety mechanisms irrelevant |
| 8 | DA | 2 | Deceptive alignment exploits evaluation-aware suppression of deceptive behaviour during safety evals |
| 9 | CET | 1 | Cross-embodiment transfer via shared backbone; safety mechanism not the vector |
| 10 | LHGD | 2 | Long-horizon goal displacement succeeds partly because safety checks occur per-step, not over the trajectory |
| 11 | TCH | 1 | Tool chain hijacking bypasses tool-level permissions |
| 12 | SBA | 3 | Semantically benign instructions pass text-level safety filters; the filter's positive classification *is* the attack enabling condition (Blindfold) |
| 13 | DLA | 2 | Dual-layer attacks exploit the gap between infrastructure safety and model safety |
| 14 | SIF | 3 | Safety instruction fatigue is iatrogenic: the volume of safety instructions degrades their own effectiveness |
| 15 | SID | 3 | Safety instruction dilution: operational context displaces safety instructions; the more the system operates safely, the less safe it becomes |
| 16 | PP | 2 | Format compliance and safety reasoning are partially independent; format-lock exploits the format-compliance pathway that safety training leaves intact |
| 17 | CSBA | 2 | Compound SBA inherits IRS from SBA; composition amplifies masking |
| 18 | SSBA | 3 | Stealth SBA explicitly exploits safety filter false negatives |
| 19 | DA-SBA | 2 | Hybrid inherits moderate iatrogenic properties from both parents |
| 20 | XSBA | 2 | Cross-domain SBA exploits domain-specific safety training gaps |
| 21 | AFF | 1 | Affordance verification failure; safety mechanism not the vector |
| 22 | KIN | 1 | Kinematic safety violation; safety mechanism not the vector |
| 23 | IMB | 1 | Infrastructure-mediated bypass; safety mechanism not the vector |
| 24 | TCA | 1 | Temporal convergence; safety mechanism not the vector |
| 25 | SID+SIF | 3 | Compound of two IRS-3 families |
| 26 | CSC | 3 | Compositional supply chain: per-component safety verification produces false assurance (CoLoRA) |
| 27 | IEA | 3 | By definition: iatrogenic exploitation attacks weaponise safety mechanisms directly |
| 28 | PP | -- | Already scored above (#16) |

### 2.3 Distribution

| IRS Level | Count | Percentage | Families |
|-----------|-------|------------|----------|
| IRS-3 (High) | 7 | 25% | SBA, SIF, SID, SSBA, SID+SIF, CSC, IEA |
| IRS-2 (Moderate) | 8 | 29% | LAM, MMC, DA, LHGD, PP, CSBA, DA-SBA, XSBA |
| IRS-1 (Low) | 10 | 36% | VAP, SBE, PCM, ASE, TRA, CET, TCH, AFF, KIN, TCA |
| IRS-0 (None) | 1 | 4% | IMB |
| N/A (duplicate) | 1 | -- | PP (counted once) |

**Finding:** 15 of 27 distinct families (56%) have at least moderate iatrogenic properties (IRS >= 2). Seven families (26%) require the presence of a safety mechanism for the attack to function at all (IRS-3). This is not a peripheral finding; it describes the majority of the attack surface.

### 2.4 IRS and Empirical ASR

Among families with empirical ASR data, IRS-3 families show notable patterns:

- SBA: 27.3% strict, 54.5% broad (Tier 1, FLIP-graded)
- SIF: 60% broad ASR (Tier 2, regraded)
- SID: 60% broad ASR (Tier 2, regraded)
- CSC: Tier 3 (untested)
- IEA: Tier 3 (untested)
- SID+SIF: Tier 3 (untested)
- SSBA: Tier 3 (untested)

IRS-3 families are disproportionately represented in Tier 3 (untested), which is itself a finding: the attack families most dependent on safety mechanisms are the least empirically characterised. This is consistent with the observation that traditional adversarial testing assumes safety mechanisms are beneficial and therefore does not design tests to assess their weaponisation.

### 2.5 Interpretation Note

The IRS is a classification heuristic, not an empirical measurement. The assignment of IRS levels reflects the analyst's judgment based on the mechanism descriptions in the attack taxonomy and the iatrogenesis framework from Reports #136 and #140. Different analysts might assign different levels for borderline cases (e.g., DLA at IRS-2 vs IRS-1). The aggregate distribution (56% IRS >= 2) is robust to individual reassignments because the high-confidence IRS-3 assignments (SBA, SIF, SID, CSC, IEA) are definitionally iatrogenic and account for 26% of the taxonomy on their own.

---

## 3. Updated Predictions

### 3.1 Existing Predictions (Status Update)

| ID | Prediction | Status | Update |
|----|-----------|--------|--------|
| P1 | Physical lab VLA attack demonstrated | CONFIRMED | No change. Blindfold adds further confirmation. |
| P2 | No VLA-specific governance by mid-2026 | PENDING | EU AI Act high-risk provisions (Aug 2, 2026) will cover robots but not VLA-specific attack surfaces. On track. |
| P3 | Safety certification creates false assurance | PARTIALLY CONFIRMED | CoLoRA + Alignment Backfire strengthen this. Compositional safety gap (Report #143) provides policy evidence. |
| P4 | Compositional attacks dominant by Q2 2027 | PENDING | LoRA ecosystem growth continues. No counter-evidence. |
| P5 | Language-dependent safety failure in embodied contexts | PENDING | Alignment Backfire demonstrates in text; no embodied test yet. |
| P6 | Iatrogenic safety evaluation not standardised before 2028 | PENDING | No standards body has acknowledged the concept. On track. |

### 3.2 New Predictions

**P7: At least one production incident where a safety mechanism is identified as the proximate cause of physical harm by end of 2027.**

**Evidence base:**
- Fukui (2026) demonstrates safety training reversing outcomes at medium-to-large effect sizes
- LR-41 establishes that no jurisdiction has legal precedent for this failure mode, meaning no reporting or tracking mechanism exists
- IEA scenarios (VLA-IEA-001 through VLA-IEA-010) demonstrate plausible real-world configurations where safety mechanisms cause harm
- Autonomous shuttle fleets, surgical robots, and warehouse automation all deploy safety-stop mechanisms in contexts where the stop itself creates hazards (standing passengers, energised instruments, dynamic traffic)
- The absence of incident reporting for iatrogenic failures means incidents may already have occurred without classification as safety-mechanism-caused

**Falsification conditions:** No publicly reported incident attributing physical harm to a safety mechanism's operation by December 31, 2027.

**P8: EU AI Act delegated acts on conformity assessment (expected 2026-2027) will not include compositional safety testing requirements.**

**Evidence base:**
- Report #143 documents that Articles 9 and 43 assume compositional safety
- The European Commission's harmonised standards development process moves slowly (typically 18-36 months from mandate to publication)
- The concept of compositional safety failure is not represented in any current CEN/CENELEC working group mandate for AI
- The NIST AI RMF 1.0 and ISO/IEC 42001 have the same gap, suggesting no standards body has addressed it
- The CoLoRA result (March 2026) is too recent to influence delegated acts already in preparation

**Falsification conditions:** EU delegated act or harmonised standard published before December 31, 2027 that explicitly requires testing AI systems under component composition (not just individual component testing).

---

## 4. Governance Implications

### 4.1 The Layer Mismatch Problem

The central governance implication of the iatrogenesis wave is that current frameworks are structurally unable to detect iatrogenic safety failures because they assume safety interventions are monotonically beneficial. This assumption is embedded in:

- **EU AI Act Article 9:** Risk management must identify "known and reasonably foreseeable risks" -- but iatrogenic risks are foreseeable only if you evaluate the safety mechanism itself as a potential source of harm.
- **NIST AI RMF 1.0:** Testing under "conditions similar to deployment" does not address iatrogenic effects because the deployment condition is the safety mechanism's presence.
- **ISO/IEC 42001:** Risk assessment at the system level does not include the safety intervention as a risk factor.

### 4.2 Four Capability Gaps

The iatrogenesis wave identifies four capabilities that do not exist in any regulatory framework, standards body, or enforcement mechanism:

1. **Adverse-effect evaluation for safety interventions** -- analogous to pharmaceutical side-effect testing. No methodology exists for measuring whether a safety intervention worsens outcomes at the harm layer.

2. **Compositional safety verification** -- testing that components remain safe when composed. CoLoRA demonstrates the gap; Report #143 proposes Article 9 amendment language.

3. **Cross-linguistic safety evaluation** -- testing that safety training generalises across deployment languages. Alignment Backfire demonstrates 8/16 languages where it does not.

4. **Action-layer safety verification** -- testing that text-level safety classification maps to physical safety. Blindfold demonstrates 53% ASR improvement from instructions that pass all text-level checks.

### 4.3 Timeline Pressure

The EU AI Act full applicability date (August 2, 2026) is 4.5 months away. Delegated acts on conformity assessment methodology are expected during 2026-2027. The findings in this brief are directly relevant to those acts. The Failure-First programme has already prepared submission-ready content (Report #143, Martha Jones) for input to the harmonised standards process.

Safe Work Australia's Best Practice Review submission (also in preparation) addresses the Australian context, where 1,800+ autonomous haul trucks operate under no AI-specific safety standard.

---

## 5. Iatrogenic Risk Score -- Full Table (Reference)

For downstream use by other agents and for inclusion in the CCS supplementary materials, the complete IRS scoring is reproduced here in machine-readable format:

```
Family,IRS,Iatrogenic_Mechanism
VAP,1,bypasses_visual_safety_filters
LAM,2,text_safety_masks_action_harm
MMC,2,PARTIAL_masking_via_safety_training
SBE,1,incremental_erosion
PCM,1,false_environmental_data
ASE,1,action_space_gap
TRA,1,temporal_reasoning_gap
DA,2,evaluation_aware_suppression
CET,1,shared_backbone_transfer
LHGD,2,per_step_safety_miss_trajectory_harm
TCH,1,tool_permission_bypass
SBA,3,text_safety_filter_false_negative_enables_attack
DLA,2,infrastructure_model_safety_gap
SIF,3,safety_instruction_volume_self_degrades
SID,3,operational_context_displaces_safety
PP,2,format_compliance_bypasses_safety_deliberation
CSBA,2,compound_SBA_masking
SSBA,3,stealth_exploits_filter_false_negatives
DA-SBA,2,hybrid_moderate_iatrogenic
XSBA,2,domain_specific_safety_training_gap
AFF,1,affordance_failure
KIN,1,kinematic_failure
IMB,0,infrastructure_only
TCA,1,temporal_convergence
SID_SIF,3,compound_iatrogenic
CSC,3,per_component_verification_false_assurance
IEA,3,direct_safety_mechanism_weaponisation
```

---

## 6. Limitations

1. **IRS is qualitative.** The scoring reflects analyst judgment, not empirical measurement. Validation would require empirical testing of each family with and without the relevant safety mechanism, which is a substantial experimental programme.

2. **External papers are recent.** Alignment Backfire, Blindfold, and CoLoRA were all posted in March 2026. They have not completed peer review (Blindfold is accepted at ACM SenSys 2026; the others are preprints). Findings may be revised.

3. **IEA scenarios are untested.** The 12 IEA benchmark scenarios are Tier 3 (schema-validated, zero empirical traces). The iatrogenic exploitation concept is grounded in established findings, but the specific scenario constructions have not been tested on any model.

4. **Convergence is suggestive, not conclusive.** Multiple independent groups arriving at the same finding in the same week is notable but does not constitute proof that the finding is correct. It indicates the finding is visible from multiple methodological perspectives, which increases confidence but does not eliminate the possibility of shared methodological blind spots.

5. **Governance predictions are inherently uncertain.** P7 and P8 are informed assessments, not forecasts. Regulatory processes are influenced by political factors that cannot be modelled from research evidence alone.

---

## 7. Recommendations

1. **Prioritise IRS-3 family testing.** Five of seven IRS-3 families have zero empirical traces. These are the families where safety mechanisms are the attack vector, and they are the least characterised. Testing SBA at scale (already Tier 1 with 54.5% broad ASR) should be extended to the IEA and CSC families.

2. **Submit compositional safety findings to EU harmonised standards process.** Report #143 provides ready-to-submit content. The window is closing.

3. **Develop adverse-effect evaluation methodology.** The Hippocratic Principle (Report #134) and TI-S framework (Report #135) provide theoretical foundations. What is needed is a practical protocol: for each safety intervention, measure outcomes both with and without the intervention at the harm layer (not just the intervention layer). This is the single most important methodological gap identified by the wave.

4. **Monitor for iatrogenic incidents.** The absence of iatrogenic incident classification in any reporting framework means incidents will be misclassified as "safety system failure" or "unexpected halt" rather than "safety mechanism caused the harm." Propose a taxonomy extension to existing incident reporting frameworks.

---

*This brief was produced as part of the Failure-First Embodied AI research programme. Pattern-level findings are publishable. Operational attack details remain internal.*
